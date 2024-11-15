from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers
from rest_framework import status as http_status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from core.common.utils import inline_serializer
from core.users.models import Member
from django.apps import apps
from .models import Feedback
from .services import check_similarity, feedback_create


class CheckSimilarity(APIView):
    class InputSerializer(serializers.Serializer):
        image_1 = Base64ImageField()
        image_2 = Base64ImageField()

    def post(self, request) -> Response:
        input_serializer = self.InputSerializer(data=request.data)

        input_serializer.is_valid(raise_exception=True)

        try:
            similarity = check_similarity(**input_serializer.validated_data)

            response_data = {"similarity": f"{similarity:.2f}"}
            return Response(data=response_data, status=http_status.HTTP_200_OK)
        except ValueError as e:
            raise ValidationError(e)

        except Exception as e:
            raise ValidationError(e)


class FeedbackListApi(APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.UUIDField()
        author = inline_serializer(
            fields={"full_name": serializers.CharField()},
        )
        comment = serializers.CharField()
        e_signature = serializers.URLField()

    def get(self, request) -> Response:
        feedbacks = Feedback.objects.all()

        output_serializer = self.OutputSerializer(feedbacks, many=True)

        response_data = {"feedbacks": output_serializer.data}

        return Response(data=response_data, status=http_status.HTTP_200_OK)


class FeedbackListKeyApi(APIView):
    class InputSerializer(serializers.Serializer):
        email = serializers.EmailField()

    class OutputSerializer(serializers.Serializer):
        id = serializers.UUIDField()
        author = inline_serializer(
            fields={"full_name": serializers.CharField()},
        )
        comment = serializers.CharField()
        e_signature = serializers.URLField()

    def get(self, request) -> Response:
        # Validate the email parameter
        serializer = self.InputSerializer(data=request.query_params)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
        else:
            return Response(
                {"detail": "Invalid email parameter."},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        # Fetch the author/member by email
        try:
            author = Member.objects.get(email=email)
        except Member.DoesNotExist:
            return Response(
                {"detail": "Member with the given email does not exist."},
                status=http_status.HTTP_404_NOT_FOUND,
            )

        # Fetch feedbacks authored by the user or shared with them
        Feedback = apps.get_model('feedbacks', 'Feedback')
        PrivateKeyPermission = apps.get_model('feedbacks', 'PrivateKeyPermission')
        authored_feedbacks = Feedback.objects.filter(author=author)

        shared_feedback_ids = PrivateKeyPermission.objects.filter(user=author).values_list('feedback_id', flat=True)
        shared_feedbacks = Feedback.objects.filter(id__in=shared_feedback_ids)
        feedbacks = authored_feedbacks | shared_feedbacks

        # Serialize the feedbacks
        output_serializer = self.OutputSerializer(feedbacks, many=True)
        response_data = {"feedbacks": output_serializer.data}

        return Response(data=response_data, status=http_status.HTTP_200_OK) 

class FeedbackCreateApi(APIView):
    class InputSerializer(serializers.Serializer):
        email = serializers.EmailField()
        comment = serializers.CharField()
        e_signature = Base64ImageField()  # Assuming custom field for base64-encoded image

    def post(self, request) -> Response:
        # Initialize serializer with request data
        print(f"requested data: {request.data}")
        input_serializer = self.InputSerializer(data=request.data)

        # Validate the data
        if not input_serializer.is_valid():
            return Response(
                {"error": "Invalid input", "details": input_serializer.errors},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        # Access validated data after validation
        email = input_serializer.validated_data["email"]
        comment = input_serializer.validated_data["comment"]
        e_signature = input_serializer.validated_data["e_signature"]

        # Fetch the current user based on the email from validated data
        try:
            current_user = Member.objects.get(email=email)  # Fetch member by email
        except Member.DoesNotExist:
            return Response(
                {"error": "Member with the given email does not exist."},
                status=http_status.HTTP_404_NOT_FOUND,
            )

        print(f"Current user: {current_user}")

        try:
            # Assuming feedback_create is a function that handles feedback creation
            message = feedback_create(current_user=current_user, comment=comment, e_signature=e_signature)
            response_data = {"message": message}
            return Response(data=response_data, status=http_status.HTTP_200_OK)

        except ValidationError as ve:
            return Response({"error": str(ve)}, status=http_status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as pd:
            return Response({"error": str(pd)}, status=http_status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred."}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifySignatureApi(APIView):
    def get(self, request, feedback_id) -> Response:
        feedback_instance = Feedback.objects.get(id=feedback_id)

        result = feedback_instance.verify_signature()

        response_data = {"result": result}

        return Response(data=response_data, status=http_status.HTTP_200_OK)


class TamperAndVerifySignatureFeedbackApi(APIView):
    def put(self, request, feedback_id) -> Response:
        feedback_instance = Feedback.objects.get(id=feedback_id)

        result = feedback_instance.simulate_tampering_and_verify()
        print(result)

        return Response(status=http_status.HTTP_200_OK)
