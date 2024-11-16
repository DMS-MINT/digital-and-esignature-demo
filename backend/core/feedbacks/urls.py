from django.urls import path
from django.urls.resolvers import URLPattern

from .apis import (
    CheckSimilarity,
    FeedbackCreateApi,
    FeedbackListApi,
    FeedbackListKeyApi,
    FeedbackPdfApi,
    TamperAndVerifySignatureFeedbackApi,
    VerifySignatureApi,
)

app_name = "feedbacks"

urlpatterns: list[URLPattern] = [
    path("", FeedbackListApi.as_view(), name="feedback-list"),
    path("withkey/", FeedbackListKeyApi.as_view(), name="feedback-list-with-key"),
    path("create/", FeedbackCreateApi.as_view(), name="feedback-create"),
    path("check_similarity/", CheckSimilarity.as_view(), name="feedback-check_similarity"),
    path("<uuid:feedback_id>/verify", VerifySignatureApi.as_view(), name="feedback-verify"),
    path("<uuid:feedback_id>/tamper", TamperAndVerifySignatureFeedbackApi.as_view(), name="feedback-tamper-verify"),
    path("<uuid:feedback_id>/pdf/", FeedbackPdfApi.as_view(), name="feedback-pdf"),
]
