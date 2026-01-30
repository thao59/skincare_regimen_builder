from django.db import models 
from .user import User

class Conversation (models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name="conversations")
    created_at = models.DateTimeField (auto_now_add=True)
    updated_at = models.DateTimeField (auto_now=True)
    
    def __str__(self):
        return f"User: {self.user} - date: {self.created_at}"
