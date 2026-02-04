from django.test import TestCase
from ..models import UserProfile, User 
import pytest
from django.db import IntegrityError


# Create your tests here.
@pytest.mark.django_db 
def test_userprofile_valid_data(): 
    user = User.objects.create_user(username = "testuser", password="123")
    profile = UserProfile.objects.create(
        user = user,
        age = 22, 
        skintype = "dry", 
        skin_concern = "sensitive", 
        pregnant = True, 
    )

    assert profile.id is not None
    assert profile.user.username == "testuser"

@pytest.mark.django_db 
def test_userprofile_invalid_data(): 
    user = User.objects.create_user(username = "testuser", password="123")
    
    with pytest.raises(IntegrityError):
        profile = UserProfile.objects.create (
            user = user, 
            username = "mimi", 
            skintype = "dry", 
            skin_concern = "sensitive", 
            pregnant = True, 
        )
        