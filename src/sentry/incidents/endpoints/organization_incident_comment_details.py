from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.request import Request
from rest_framework.response import Response

from sentry.api.api_publish_status import ApiPublishStatus
from sentry.api.base import region_silo_endpoint
from sentry.api.bases.incident import IncidentEndpoint, IncidentPermission
from sentry.api.exceptions import ResourceDoesNotExist
from sentry.api.serializers import serialize
from sentry.incidents.logic import delete_comment, update_comment
from sentry.incidents.models import IncidentActivity, IncidentActivityType


class CommentSerializer(serializers.Serializer):
    comment = serializers.CharField(required=True)


class CommentDetailsEndpoint(IncidentEndpoint):
    def convert_args(self, request: Request, activity_id, *args, **kwargs):
        # See GroupNotesDetailsEndpoint:
        #   We explicitly don't allow a request with an ApiKey
        #   since an ApiKey is bound to the Organization, not
        #   an individual. Not sure if we'd want to allow an ApiKey
        #   to delete/update other users' comments
        if not request.user.is_authenticated:
            raise PermissionDenied(detail="Key doesn't have permission to delete Note")

        args, kwargs = super().convert_args(request, *args, **kwargs)

        try:
            # Superusers may mutate any comment
            user_filter = {} if request.user.is_superuser else {"user_id": request.user.id}

            kwargs["activity"] = IncidentActivity.objects.get(
                id=activity_id,
                incident=kwargs["incident"],
                # Only allow modifying comments
                type=IncidentActivityType.COMMENT.value,
                **user_filter,
            )
        except IncidentActivity.DoesNotExist:
            raise ResourceDoesNotExist

        return args, kwargs


@region_silo_endpoint
class OrganizationIncidentCommentDetailsEndpoint(CommentDetailsEndpoint):
    publish_status = {
        "DELETE": ApiPublishStatus.UNKNOWN,
        "PUT": ApiPublishStatus.UNKNOWN,
    }
    permission_classes = (IncidentPermission,)

    def delete(self, request: Request, organization, incident, activity) -> Response:
        """
        Delete a comment
        ````````````````
        :auth: required
        """

        try:
            delete_comment(activity)
        except IncidentActivity.DoesNotExist:
            raise ResourceDoesNotExist

        return Response(status=204)

    def put(self, request: Request, organization, incident, activity) -> Response:
        """
        Update an existing comment
        ``````````````````````````
        :auth: required
        """

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.validated_data

            try:
                comment = update_comment(activity=activity, comment=result.get("comment"))
            except IncidentActivity.DoesNotExist:
                raise ResourceDoesNotExist

            return Response(serialize(comment, request.user), status=200)
        return Response(serializer.errors, status=400)
