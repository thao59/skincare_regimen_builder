from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status 
from .models import User, UserProfile, UserImage, Products, UserProduct, Conversation, Message 
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.decorators import permission_classes 
from rest_framework.permissions import IsAuthenticated 
from .serializers import ImageSerializer, ProfileSerializer, ProductSerializer, UserProductSerializer
from .services import ClaudeService, Recommendation

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
    
    #no check valid value for optional fields 
    user_eyeconcern = request.data["eye_concern"]
    user_products_type = request.data["products_type"]
    user_routine = request.data["routine"]
    user_active_use = request.data["active_use"]
    user_activeIngre = request.data["activeIngre"]
    user_advanced_use = request.data["advanced_user"]
    user_no_products = request.data["no_products"]

    #check if user uploads photo
    if "image_file" in request.FILES:
        get_image = request.FILES["image_file"]
    
        if not get_image: 
            return Response({"error": "image is failed to fetch"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            #ensure img < 5MB 
            if get_image.size > 5*1024*1024: 
                return Response({"error": "Image exceeds 5MB"}, status = status.HTTP_400_BAD_REQUEST)
            
            #check if user is logged in
            if request.user.is_authenticated: 
                #get UserProfile instance
                user = request.user.info
                
                #save imgs to db 
                try:
                    save_image = UserImage.objects.create(userinfo = user, image = get_image)
                    print(f"Save image successfully: {save_image}")
                except Exception as e:
                    print(f"Image saved unsuccessfully, error: {e}")
                    return Response({"error": "Image saved unsuccessfully"})

    #if USER IS LOGGED IN
    if request.user.is_authenticated:
        #get user instance 
        get_user = request.user 

        #save data if new profile. If there's an existing profile, modify fields 
        profile, created = UserProfile.objects.update_or_create(
            user = get_user, 
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
            })
        #detele the old recommendation and only saving the latest
        UserProduct.objects.filter(user = request.user).delete()

        get_rec = Recommendation()
        products_rec = get_rec.get_login_rec(get_user, profile) 
        user_skin_profile = ProfileSerializer(profile)
        
        return Response ({"product_recs" : products_rec.data, "user_skin_profile": user_skin_profile.data}, status=status.HTTP_200_OK)
    
    #if USER IS NOT LOGGED IN
    user_profile = {"username": user_name, "age": user_age, "skintype": user_skintype, "skin_concern": user_skinconcern, "pregnant": user_pregnant, "eye_concern": user_eyeconcern, "products_type":  user_products_type, "routine": user_routine, "active_use": user_active_use, "active_ingre": user_activeIngre, "advanced_active_use": user_advanced_use, "no_products": user_no_products}
    
    #create temp id for user
    if not request.session.session_key:
        request.session.create()
    
    print(f"id: {request.session.session_key}")
    request.session["skinprofile"] = user_profile
    print(f"userprofile: {request.session["skinprofile"]}")
    request.session.modified = True
    
    create = Recommendation()
    products_rec = create.get_rec(user_profile)

    #float all products'price before saving to session as JSON cant serialise decimals 
    for row in products_rec["off_cleanser"]:
        row["product_price"] = float(row["product_price"])
    
    for row in products_rec["off_toner"]:
        row["product_price"] = float(row["product_price"])
    
    for row in products_rec["off_serum"]:
        row["product_price"] = float(row["product_price"])

    for row in products_rec["off_moisturiser"]:
        row["product_price"] = float(row["product_price"])
    
    for row in products_rec["off_sunscreen"]:
        row["product_price"] = float(row["product_price"])
    
    for row in products_rec["off_eye"]:
        row["product_price"] = float(row["product_price"])
    
    for row in products_rec["off_oil_cleanser"]:
        row["product_price"] = float(row["product_price"])

    for row in products_rec["off_micellar_water"]:
        row["product_price"] = float(row["product_price"])

    request.session["product_rec"]= products_rec
    print(f"product rec: {request.session["product_rec"]}")
    return Response ({"product_recs": products_rec, "user_skin_profile": user_profile}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getImage(request):
    user = request.user.info
    user_photo = user.image_profile
    image_dict = ImageSerializer(user_photo, many=True)
    print(f"image: {user_photo}")
    info_dict = ProfileSerializer(user)
    get_product_recs = UserProduct.objects.filter(user=request.user)
    print(f"product rec: {get_product_recs}")
    product_recs_dict = UserProductSerializer(get_product_recs, many=True)
    
    return Response({"image": image_dict.data, "skininfo": info_dict.data, "product_recs": product_recs_dict.data}, status=status.HTTP_200_OK)

@api_view(["POST", "GET"])
def chatbox (request): 
    get_message = request.data["message"]
    if not get_message:
        return Response({"error": "no message sent"}, status=status.HTTP_400_BAD_REQUEST)
    print(f"type: {get_message["message"]}")
    
    consId = request.data["messageId"]

    user = request.user 
    
    if request.user.is_authenticated:
        #create new conversation or just update old one 
        if not consId:  
            user_conver = Conversation.objects.create(user= user)
            print(f"active conver: {user_conver}")
        else: 
            user_conver = Conversation.objects.get(id = consId, user =user)
            user_conver.save()

        Message.objects.create(conversation = user_conver, content = get_message["message"], role = get_message["role"])
        get_profile = UserProfile.objects.get(user = user)
        get_products_rec = UserProduct.objects.filter(user = user)
    
        service = ClaudeService()
        response = service.get_personalised_response(get_message["message"], get_profile, get_products_rec)
        Message.objects.create(conversation = user_conver, content= response, role= "assistant")

        return Response ({"reply": response, "msgID" : user_conver.id}, status = status.HTTP_200_OK)
    
    else: 
        print(f"id: {request.session.session_key}")
        if not consId: 
            if not request.session.session_key:
                request.session.create()
                consId = request.session.session_key
            else:
                consId = request.session.session_key

        user_profile = request.session.get("skinprofile")
        print(f"user profile: {user_profile}")
        if not user_profile:
            return Response({"error": "Session has expired. Please complete the survey again"}, status=status.HTTP_400_BAD_REQUEST)
        products = request.session["product_rec"]
        print(f"product rec: {products}")
        
        service = ClaudeService()
        response = service.get_personalised_response(get_message["message"], user_profile, products)
        return Response ({"reply": response, "msgID": consId}, status= status.HTTP_200_OK)











    





        



        
    
          