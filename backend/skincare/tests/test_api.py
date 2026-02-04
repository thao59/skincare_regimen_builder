from ..models import User 
import pytest
from rest_framework.test import APIClient 

@pytest.mark.django_db 
def test_url():
    user = User.objects.create_user(username="testuser", password="testpassword")
    client = APIClient()
    client.force_authenticate(user=user)
    survey = {"name": "mimi", "age": 20, "skin_type": "dry", "skin_concern": ["acne"], "pregnant": False, "products_type": ["toner", "serum"], "active_use": False, "no_products": 3, "eye_concern": None, "routine": None, "active_use": False, "activeIngre": None, "advanced_user": None,}

    response = client.post("/api/processdata/", survey, format="json")

    assert response.status_code == 200
    assert "product_recs" in response.data 
    assert "user_skin_profile" in response.data

@pytest.mark.django_db 
def test_missing_required_field(): 
    user = User.objects.create_user(username="testuser", password="testpassword")
    client = APIClient()
    client.force_authenticate(user=user)

    with pytest.raises(KeyError):
        survey = {"name": "mimi", "age": 20, "skin_concern": ["acne"], "pregnant": False, "products_type": ["toner", "serum"], "active_use": False, "no_products": 3, "eye_concern": None, "routine": None, "active_use": False, "activeIngre": None, "advanced_user": None,}
        response = client.post("/api/processdata/", survey, format="json")

