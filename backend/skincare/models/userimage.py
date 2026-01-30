from django.db import models 
from .userprofile import UserProfile 

class UserImage(models.Model): 
    userinfo = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="image_profile")
    datetime = models.DateTimeField(auto_now_add=True, null=True)
    #install Pillow to use field ImageField
    image = models.ImageField(upload_to="photo/", blank=True, null=True)

    def __str__(self):
        return f"Info: {self.userinfo}, Date and time: {self.datetime}, Image: {self.image}"
