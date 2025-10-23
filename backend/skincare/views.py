from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status 
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken 

# Create your views here.
def userdata(request):
    pass 

@api_view(["POST"])
def signup(request):

    #request.data is the dict automatically parsed by DRF
    username = request.data["username"]
    if not username:
        return Response ({"error": "All fields are required"}, status = status.HTTP_400_BAD_REQUEST)
       

    email = request.data["email"]
    if not email:
        return Response({"error": "All fields are required"}, status = status.HTTP_400_BAD_REQUEST)
        

    password = request.data["password"]
    if not password: 
        return Response({"error": "All fields are required"}, status = status.HTTP_400_BAD_REQUEST)
        

    confirm_password = request.data["confirm_password"]
    if not confirm_password:
        return Response({"error": "All fields are required"}, status = status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({"error": "All fields are required"}, status = status.HTTP_400_BAD_REQUEST)
    
    #check if user already exists in the db. If yes,return error message. If no, create and save account to db 
    check_username = User.objects.filter(email=email).exists()
    
    if check_username == True:
        return Response({"error": "This email is associated with an account!"}, status = status.HTTP_400_BAD_REQUEST)
    else:
        create_account = User.objects.create_user(email=email, username=username, password=password)
        
        #create refresh/access token for new user 
        new_token = RefreshToken.for_user(create_account)
        get_refresh = str(new_token)
        get_access = str(new_token.access_token)
        return Response({"access" : get_access, "refresh": get_refresh}, status = status.HTTP_201_CREATED)



        
    
    