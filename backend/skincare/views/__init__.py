from .auth_views import signup
from .profile_views import processdata, getImage
from .chat_views import chatbox
from .email_views import sendEmail

__all__ = [
    'signup',
    'processdata',
    'getImage',
    'chatbox',
    'sendEmail',
]