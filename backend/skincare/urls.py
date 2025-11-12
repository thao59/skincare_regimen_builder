from django.urls import path
from . import views 
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings 
from django.conf.urls.static import static

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("signup/", views.signup, name="signup"),
    path("processdata/", views.processdata, name="process_data"), 
]

    #if debug = true, set path and storage for photos 
if settings.DEBUG: 
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)