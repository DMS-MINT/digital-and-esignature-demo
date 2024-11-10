import os

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from django.db import models
from django.utils.translation import gettext_lazy as _

from core.common.models import BaseModel
from core.crypto.services import generate_rsa_key_pair
from core.users.models import Member


class Feedback(BaseModel):
    author = models.ForeignKey(Member, on_delete=models.CASCADE)
    comment = models.TextField(
        "Your Comment",
        help_text=_("Type your feedback here..."),
    )
    e_signature = models.ImageField(
        "E Signature",
        upload_to="",
        help_text=_("Upload the author signature."),
    )
    digital_signature = models.BinaryField(
        "Digital Signature",
        editable=False,
        null=True,
        blank=True,
        help_text=_("The digital signature of the feedback."),
    )
    public_key = models.TextField(
        "Public Key",
        editable=False,
        null=True,
        blank=True,
        help_text=_("The public key for verifying the digital signature."),
    )

    def __str__(self) -> str:
        return self.author.full_name

    def save(self, *args, **kwargs):
        # Generate a new key pair if the public key does not already exist
        if not self.public_key:
            private_key_pem, public_key_pem = generate_rsa_key_pair()
            self.public_key = public_key_pem.decode("utf-8")

            # Save private key to a file if needed (optional)
            private_key_path = f"private_keys/{self.author.id}_private_key.pem"
            os.makedirs(os.path.dirname(private_key_path), exist_ok=True)
            with open(private_key_path, "wb") as key_file:
                key_file.write(private_key_pem)

        # Load the private key from file (or database if saved)
        private_key = serialization.load_pem_private_key(
            private_key_pem,
            password=None,  # No password protection in this example
        )

        # Hash the comment
        data_to_sign = self.comment.encode("utf-8")
        hashed_comment = hashes.Hash(hashes.SHA256())
        hashed_comment.update(data_to_sign)
        hashed_comment = hashed_comment.finalize()

        # Sign the hashed comment
        self.digital_signature = private_key.sign(
            hashed_comment,
            padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
            hashes.SHA256(),
        )

        super().save(*args, **kwargs)

    def verify_signature(self):
        # Load the public key from PEM format
        public_key = serialization.load_pem_public_key(self.public_key.encode("utf-8"))

        # Hash the comment to verify
        data_to_verify = self.comment.encode("utf-8")
        hashed_comment = hashes.Hash(hashes.SHA256())
        hashed_comment.update(data_to_verify)
        hashed_comment = hashed_comment.finalize()

        # Verify the digital signature
        try:
            public_key.verify(
                self.digital_signature,
                hashed_comment,
                padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
                hashes.SHA256(),
            )
            print("Verification successful!")
            return True
        except Exception as e:
            print(f"Verification failed: {e}")
            return False

    def load_private_key_from_file(self):
        if self.private_key_path and os.path.exists(self.private_key_path):
            with open(self.private_key_path, "rb") as key_file:
                private_key_pem = key_file.read()
            return private_key_pem
        return None

    def simulate_tampering_and_verify(self):
        private_key_pem = self.load_private_key_from_file()

        if private_key_pem is None:
            print("Private key PEM is not available.")
            return False

        # Store the original comment
        original_comment = self.comment

        # Modify the comment to simulate tampering
        self.comment += " (Tampered!)"

        # Re-sign the tampered comment
        private_key = serialization.load_pem_private_key(
            private_key_pem,
            password=None,  # No password protection in this example
        )
        data_to_sign = self.comment.encode("utf-8")
        hashed_comment = hashes.Hash(hashes.SHA256())
        hashed_comment.update(data_to_sign)
        hashed_comment = hashed_comment.finalize()
        tampered_signature = private_key.sign(
            hashed_comment,
            padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
            hashes.SHA256(),
        )

        # Restore the original comment
        self.comment = original_comment

        # Verify the tampered signature
        public_key = serialization.load_pem_public_key(self.public_key.encode("utf-8"))

        try:
            public_key.verify(
                tampered_signature,
                hashed_comment,
                padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
                hashes.SHA256(),
            )
            print("Tampering detected: Verification successful when it should have failed!")
            return False
        except Exception as e:
            print(f"Tampering detected: Verification failed as expected: {e}")
            return True
