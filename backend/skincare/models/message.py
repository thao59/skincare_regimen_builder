from django.db import models
from .conversation import Conversation 

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField ()
    role = models.CharField (max_length = 20, choices = [("user", "User"), ("assistant", "Assistant")])

    def __str__(self):
        return f"Text: {self.content}"
