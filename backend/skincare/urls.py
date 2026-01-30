from django.urls import path
from .views import signup, processdata, getImage, chatbox, sendEmail
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings 
from django.conf.urls.static import static

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("signup/", signup, name="signup"),
    path("processdata/", processdata, name="process_data"), 
    path("getImage/", getImage, name="get_image"),
    path("chatbox/", chatbox, name="chatbox"),
    path("sendtoemail/", sendEmail, name="send_to_email")
]

    #if debug = true, set path and storage for photos 
if settings.DEBUG: 
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)