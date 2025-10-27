from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status 
from .models import User, UserProfile
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.decorators import permission_classes 
from rest_framework.permissions import IsAuthenticated 

# Create your views here.
@api_view(["POST"])
def signup(request):

    #request.data is dict automatically parsed by DRF. 
    #catch missing keys 
    try: 
        username = request.data["username"]
        email = request.data["email"]
        password = request.data["password"]
        confirm_password = request.data["confirm_password"]
    except KeyError: 
        return Response({"error": "Missing key"}, status = status.HTTP_400_BAD_REQUEST)
    
    #catch empty keys 
    if not username or not email or not password or not confirm_password: 
        return Response({"error": "All fields are required"}, status = status.HTTP_400_BAD_REQUEST )
        
    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status = status.HTTP_400_BAD_REQUEST)
    
    #check if user already exists in the db. If yes,return error message. If no, create and save account to db 
    check_email = User.objects.filter(email=email).exists()
    if check_email:
        return Response({"error": "This email is associated with an account!"}, status = status.HTTP_400_BAD_REQUEST)

    check_username = User.objects.filter(username = username).exists()
    if check_username: 
        return Response({"error": "This username has been taken!"}, status = status.HTTP_400_BAD_REQUEST)
    
  
    create_account = User.objects.create_user(email=email, username=username, password=password)
    
    #create refresh/access token for new user 
    new_token = RefreshToken.for_user(create_account)
    get_refresh = str(new_token)
    get_access = str(new_token.access_token)
    return Response({"access" : get_access, "refresh": get_refresh}, status = status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def processdata(request):

    #extract all data from json. For required fields, check for valid value 
    user_name = request.data["name"]
    if not user_name:
        return Response({"error": "Missing value"}, status= status.HTTP_400_BAD_REQUEST)
    
    user_age = request.data["age"]
    if not user_age:
        return Response({"error": "Missing value"}, status = status.HTTP_400_BAD_REQUEST)
    
    user_skintype = request.data["skin_type"]
    if not user_skintype: 
        return Response({"error": "missing value"}, status = status.HTTP_400_BAD_REQUEST)
    
    user_skinconcern = request.data["skin_concern"]
    if not user_skinconcern:
        return Response({"error": "Missing value"}, status = status.HTTP_400_BAD_REQUEST)
    
    user_pregnant = request.data["pregnant"]
    if user_pregnant is None: 
        return Response({"error": "Missing value"}, status=status.HTTP_400_BAD_REQUEST)
    
    #dont need to check valid value for optional fields 
    user_eyeconcern = request.data["eye_concern"]
    user_products_type = request.data["products_type"]
    user_routine = request.data["routine"]
    user_active_use = request.data["active_use"]
    user_activeIngre = request.data["activeIngre"]
    user_advanced_use = request.data["advanced_user"]
    user_no_products = request.data["no_products"]

    #get user instance 
    user = request.user 

    #save data if new profile. If there's an existing profile, modify fields 
    profile, created = UserProfile.objects.update_or_create(
        user = user, 
        defaults = {
            "username" : user_name, 
            "age": user_age, 
            "skintype":  user_skintype, 
            "skin_concern": user_skinconcern, 
            "eye_concern": user_eyeconcern, 
            "pregnant": user_pregnant, 
            "products_type": user_products_type, 
            "routine": user_routine, 
            "active_use": user_active_use, 
            "active_ingre": user_activeIngre, 
            "advanced_active_use": user_advanced_use, 
            "no_products": user_no_products,
        }
    )
    return Response({"message": "data is saved"}, status = status.HTTP_200_OK)
        



        
    
          