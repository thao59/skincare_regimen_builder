import json
from anthropic import Anthropic
from django.conf import settings
from ..models import Products

class ClaudeService:
    def __init__ (self):
        self.client = Anthropic(api_key = settings.ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-20250514"
        self.tools = [
            {
                "name": "find_similar_products",         
                "description": "Find products with similar ingredients and concerns", 
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "ingredients": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of ingredients to match"
                        },
                        "category": {
                            "type": "string", 
                            "description": "Product category: e.g. cleanser, toner, serum, moisturiser, sunscreen", 
                        },
                        "concerns": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Skin concerns to match e.g. acne, dryness"
                        }
                    },
                    "required": ["ingredients", "concerns", "category"]   
                }
            }
        ]
        

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
    
    def get_personalised_response(self, user_message, user_profile, user_product_rec, convo_history):
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
        When answering about recommended products:
        - Explain why recommended products suit their skin type and concerns.
        - Highlight key ingredients and their benefits 
        - Products' prices are in AUD.
        NOTE: 
        - Be specific when user asks why products are recommended to them. Format: "[product name] is recommend because [product ingredients] help with [concern] for [skintype] skin"
        - Only mention ingredients that are explicitly listed in the product data
        - Don't use your general knowledge about products/ingredients.
        - If you don't know which specific product has an ingredient, don't mention it
        - Don't use **bold**, *italics*, or other formatting symbols

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
            tools = self.tools,
            messages = convo_history + [{"role": "user", "content": user_message}]
        )
        if response.stop_reason == "tool_use":
            tool_results = []
            for item in response.content:
                if item.type == "tool_use":
                    similar_products = []
                    category = item.input.get("category", None)
                    if category:
                        db = Products.objects.filter(product_cat = category)
                        for row in db:
                            sum_ingre = sum(1 for i in item.input.get("ingredients", []) if i in row.product_main_ingre)
                            sum_target = sum(1 for i in item.input.get("concerns", []) if i in row.product_target)
                            temp = {"product_name": row.product_name, "product_brand": row.product_brand, "product_link": row.product_link}
                            if len(row.product_main_ingre) >= 2:
                                if sum_ingre >= 2 and sum_target >= 2:
                                    similar_products.append(temp)
                            elif len(row.product_main_ingre) < 2:
                                if sum_ingre == 1 and sum_target == 1:
                                    similar_products.append(temp)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": item.id,
                        "content": json.dumps(similar_products)
                    })
            messages = convo_history + [
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": response.content},
                {"role": "user", "content": tool_results}
            ]
            final_response = self.client.messages.create(
                model = self.model, 
                max_tokens = 1000, 
                system = prompt, 
                tools = self.tools,
                messages = messages,
            )
            return final_response.content[0].text
        elif response.stop_reason == "end_turn":
            return response.content[0].text
        
