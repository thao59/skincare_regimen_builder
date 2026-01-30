from django.db import models 
from .user import User
from .products import Products

class UserProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "recommendation")
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name="recommended_to")

    def __str__(self):
        return f"User: {self.user} Rec: {self.product}"
    