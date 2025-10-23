from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass 

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "info")
    skintype = models.TextField (null=True)

def __str__(self):
    return f"User: {self.user}, Skin type: {self.skintype}"