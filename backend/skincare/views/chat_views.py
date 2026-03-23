from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status 
from ..models import UserProfile, UserProduct, Conversation, Message, Products 
from ..services import ClaudeService


@api_view(["POST", "GET"])
def chatbox (request): 
    get_message = request.data.get("message")
    if not get_message:
        return Response({"error": "no message sent"}, status=status.HTTP_400_BAD_REQUEST)
    
    consId = request.data["messageId"]

    user = request.user 
    
    if request.user.is_authenticated:
        #create new conversation or just update old one 
        if not consId:  
            user_conver = Conversation.objects.create(user= user)
        else: 
            user_conver = Conversation.objects.get(id = consId, user =user)
            user_conver.save()
        Message.objects.create(conversation = user_conver, content = get_message["message"], role = get_message["role"])
        
        try:
            get_profile = UserProfile.objects.get(user = user)
        except Exception as e:
            print(f"error: {e}")
            get_profile = None

        get_products_rec = UserProduct.objects.filter(user = user)
        if not get_products_rec.exists():
            get_products_rec = None

        product_string = ""
        if get_products_rec:
            product_string = "\n".join(
                [
                    f"{p.product.product_name}\n {p.product.product_brand}\n {p.product.product_cat}\n {p.product.product_main_ingre}\n {p.product.product_target}\n {p.product.skintypes}\n {p.product.product_price}\n {p.product.product_des}\n {p.product.product_time}"
                for p in get_products_rec
                ])

        if not get_profile and not get_products_rec:
            service = ClaudeService()
            response = service.get_response(get_message["message"])
            Message.objects.create(conversation = user_conver, content=response, role ="assistant")
            return Response({"reply": response, "msgID": user_conver.id}, status = status.HTTP_200_OK)
        else: 
            service = ClaudeService()
            response = service.get_personalised_response(get_message["message"], get_profile, product_string)
            Message.objects.create(conversation = user_conver, content= response, role= "assistant")
            return Response ({"reply": response, "msgID" : user_conver.id}, status = status.HTTP_200_OK)
        
    else: 
        if not consId: 
            if not request.session.session_key:
                request.session.create()
                consId = request.session.session_key
            else:
                consId = request.session.session_key

        user_profile = request.session.get("skinprofile")
        if not user_profile:
            user_profile = None
        
        products = request.session.get("product_rec")

        product_string = ""
        if products:
            for key in ["off_cleanser", "off_toner", "off_serum", "off_moisturiser", "off_sunscreen", "off_eye"]:
                product_string += "\n".join([
                    f'{p["product_name"]}\n {p["product_brand"]}\n {p["product_main_ingre"]}\n {p["product_target"]}\n {p["skintypes"]}\n {p["product_price"]}\n {p["product_des"]}\n {p["product_time"]}'
                    for p in products[key]
                ])
            if products.get("off_oil_cleanser"):
                product_string += "\n".join([
                    f'{p["product_name"]}\n {p["product_brand"]}\n {p["product_main_ingre"]}\n {p["product_target"]}\n {p["skintypes"]}\n {p["product_price"]}\n {p["product_des"]}\n {p["product_time"]}'
                    for p in products["off_oil_cleanser"]
                ])
            if products.get("off_micellar_water"):
                product_string += "\n".join([
                    f'{p["product_name"]}\n {p["product_brand"]}\n {p["product_main_ingre"]}\n {p["product_target"]}\n {p["skintypes"]}\n {p["product_price"]}\n {p["product_des"]}\n {p["product_time"]}'
                    for p in products["off_micellar_water"]
                ])
        
        if not user_profile and not products: 
            service = ClaudeService()
            response = service.get_response(get_message["message"])
            return Response({"reply": response, "msgID": consId}, status= status.HTTP_200_OK)
        else: 
            service = ClaudeService()
            response = service.get_personalised_response(get_message["message"], user_profile, product_string)
            return Response ({"reply": response, "msgID": consId}, status= status.HTTP_200_OK)
