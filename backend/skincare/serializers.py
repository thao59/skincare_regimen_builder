from rest_framework import serializers 
from .models import UserImage 

class ImageSerializer(serializers.ModelSerializer):
    class Meta: 
        model = UserImage
        fields = ["id", "image", "datetime"]