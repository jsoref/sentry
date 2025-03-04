from sentry.api.serializers import Serializer, register
from sentry.models.eventuser import EventUser
from sentry.utils.avatar import get_gravatar_url


@register(EventUser)
class EventUserSerializer(Serializer):
    def serialize(self, obj, attrs, user):
        return {
            "id": str(obj.id),
            "hash": obj.hash,
            "tagValue": obj.tag_value,
            "identifier": obj.ident,
            "username": obj.username,
            "email": obj.email,
            "name": obj.get_display_name(),
            "ipAddress": obj.ip_address,
            "dateCreated": obj.date_added,
            "avatarUrl": get_gravatar_url(obj.email, size=32),
        }
