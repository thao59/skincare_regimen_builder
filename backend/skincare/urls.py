from django.urls import path
from . import views 
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("signup/", views.signup, name="signup"),
    path("processdata/", views.processdata, name="process_data")

]