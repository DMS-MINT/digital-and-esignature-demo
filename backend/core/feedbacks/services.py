import base64
import os
import tempfile
from rest_framework.response import Response
from django.template.loader import render_to_string
from weasyprint import HTML
from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework.exceptions import PermissionDenied, ValidationError
from core.users.models import Member
from .models import Feedback
from .utils import compare_images
import shutil
from django.core.files import File

def feedback_create(*, current_user: Member, comment: str, e_signature):
    try:
        reference_signature_full_path = os.path.join(settings.MEDIA_ROOT, current_user.e_signature.path)

        # Save the uploaded signature to a temporary file
        with tempfile.NamedTemporaryFile(delete=False) as temp_signature:
            temp_signature.write(e_signature.read())
            uploaded_signature_path = temp_signature.name

        similarity = compare_images(image1_path=reference_signature_full_path, image2_path=uploaded_signature_path)

        if similarity <= 80:
            raise PermissionDenied(f"Signature verification failed. Your signature similarity is {similarity}.")

        # Create feedback only after successful signature verification
        # feedback = Feedback.objects.create(author=current_user, comment=comment, e_signature=e_signature)
        
        with tempfile.NamedTemporaryFile(delete=False) as temp_signature:
            shutil.copy(reference_signature_full_path, temp_signature.name)
            default_signature_path = temp_signature.name

        # Create feedback using the author's default signature
        with open(default_signature_path, "rb") as signature_file:
            feedback = Feedback.objects.create(
            author=current_user,
            comment=comment,
            e_signature=File(signature_file, name=os.path.basename(reference_signature_full_path)),
            )

        # Clean up the temporary file
        os.unlink(default_signature_path)

        # Generate PDF and handle errors
        try:
            pdf_url = generate_feedback_pdf(feedback_id=feedback.id)
        except Exception as e:
            # If PDF generation fails, delete the feedback to maintain consistency
            feedback.delete()
            raise ValidationError(f"PDF generation failed: {str(e)}")

        return "Signature verified successfully. Feedback has been created."

    except PermissionDenied as pd:
        raise pd

    except ValueError as ve:
        raise ValidationError(f"Validation error: {ve}")

    except Exception as e:
        print(e)
        raise ValidationError(f"Unexpected error: {e}")


def check_similarity(*, image_1, image_2):
    # Save the uploaded images to a temporary files
    with (
        tempfile.NamedTemporaryFile(delete=False) as temp_file_1,
        tempfile.NamedTemporaryFile(delete=False) as temp_file_2,
    ):
        # Write the content of image_1 to temp_file_1
        temp_file_1.write(image_1.read())
        image1_path = temp_file_1.name

        # Write the content of image_2 to temp_file_2
        temp_file_2.write(image_2.read())
        image2_path = temp_file_2.name

    return compare_images(image1_path, image2_path)



def generate_feedback_pdf(feedback_id):

    feedback = Feedback.objects.get(id=feedback_id)
        # Ensure e_signature is properly encoded
    e_signature_base64 = None
    if feedback.e_signature:
        with feedback.e_signature.open("rb") as e_signature_file:
            e_signature_base64 = base64.b64encode(e_signature_file.read()).decode("utf-8")

        # Context for the template
    context = {
        "feedback": feedback,
        "e_signature_base64": e_signature_base64,
    }

        # Render HTML content
    html_content = render_to_string("feedback.html", context)
    print("HTML Content Rendered Successfully")
    # Generate PDF from HTML

    weasy_html = HTML(string=html_content, base_url=settings.STATIC_URL)
    pdf_data = weasy_html.write_pdf()
    
    # Define the path to save the PDF
    pdf_path = f"feedback_pdfs/{feedback.id}_feedback.pdf"
    file_path = os.path.join(settings.MEDIA_ROOT, pdf_path)
    
    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    # Save the PDF to storage
    with open(file_path, 'wb') as pdf_file:
        pdf_file.write(pdf_data)
    # Return the URL of the saved PDF
    pdf_url = default_storage.url(pdf_path)
    print("Generated PDF URL:", pdf_url)

    return Response({"pdf_url": pdf_url}, status=200)



