from anthropic import Anthropic 
from django.conf import settings 
from ..models import Products, UserProduct

class ClaudeService:
    def __init__ (self):
        self.client = Anthropic(api_key = settings.ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-20250514"

    def get_response(self, user_message):
        prompt = f"""You are a skincare expert. Be concise, short, and informative when answering user's question regarding skincare needs"""
        response = self.client.messages.create (
            model=self.model, 
            max_tokens = 1000, 
            system = prompt,
            messages = [
                {"role": "user", "content": user_message}
            ]
        )
        return response.content[0].text
    
    def get_personalised_response(self, user_message, user_profile, user_product_rec):
        if isinstance(user_profile, dict): 
            if user_profile["no_products"] == 3:
                instruction = "Only recommend cleanser, moisturiser and sunscreen"
            elif user_profile["no_products"] == 5:
                instruction = "Recommend any products except toner products and eye products"
            else:
                instruction = "Recommend all products"
            userActive = user_profile["active_ingre"] or []
            activeLevel = user_profile["advanced_active_use"] or None
        else:
            if user_profile.no_products == 3:
                instruction = "Only recommend cleanser, moisturiser and sunscreen"
            elif user_profile.no_products == 5:
                instruction = "Recommend any products except toner products and eye products"
            else:
                instruction = "Recommend all products"
            userActive = user_profile.active_ingre or []
            activeLevel = user_profile.advanced_active_use or None
        
        extra_info = ""
        if userActive:
            extra_info += f"User is using these active ingredients: {', '.join(userActive)}\n"
        if activeLevel:
            extra_info += f"User's experience level with actives: {activeLevel}\n"
            if activeLevel == "beginner":
                extra_info += "Provide extra precautions for beginners using actives\n"

        prompt = f"""You are a skincare expert. Provide personalised advice based on user's profile:
        {instruction}
        User's profile: {user_profile}
        User's product recommendation: {user_product_rec}
        Only answer question when asked. Be short all the time
        When answering questions: 
        - Use Australian spelling 
        - Taking their skin profile, especially {extra_info} into account.
        - Explain the reasons behind recommend these products 
        - Be concise, short and informative """
        response = self.client.messages.create(
            model = self.model, 
            max_tokens = 1000, 
            system = prompt, 
            messages = [{"role": "user", "content": user_message}]
        )
        return response.content[0].text