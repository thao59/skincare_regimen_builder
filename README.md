# Skincare Regimen Builder
A full-stack web application that provides personalized skincare product recommendations based on user skin profiles. Built with Django REST Framework and React.


## 🌟 Core Functionality
13-Stage Interactive Survey: Comprehensive questionnaire to understand user's skin needs.
Personalised Recommendations based on:
  - Skin type
  - Skin concerns
  - Eye concerns
  - Pregnancy status
  - Current skincare routine level
  - Active ingredient usage

Scoring Algorithm: Products scored based on skin type match and concern targeting.

Price-Based Categorization: Products organised into low (<$40), mid ($40-80), and high (>$80) price ranges.

## User Features
User Authentication: Secure login/signup system
Session Management: Recommendations saved for non-authenticated users via sessions
AI Chatbot: Integrated Claude API for personalised skincare advice
Product Database: Web-scraped products from multiple websites with detailed information

## Technical Features
RESTful API: Django REST Framework backend
Web Scraping: Automated product data collection using BeautifulSoup
Conditional Survey Flow: Dynamic question branching based on user responses

## 🛠️ Tech Stack

## Backend
Django 4.2 - Web framework
Django REST Framework - API development
SQLite - Database
BeautifulSoup4 - Web scraping
Anthropic Claude API - AI chatbot integration
python-dotenv - Environment variable management

## Frontend
React 18 - UI framework
CSS3 - Custom styling
Fetch API- HTTP requests

## Development Tools
Git - Version control
VS Code - Code editor

## 💾 Database Models

### Products
- Product name, brand, category
- Main ingredients
- Target concerns
- Compatible skin types
- Price, image URL, product link
- Usage time (AM/PM)

### UserProfile
- User information
- Skin type and concerns
- Eye concerns
- Pregnancy status
- Current routine details
- Active ingredient preferences

### UserProduct
- Links users to recommended products
- Stores product categories for user's routine

### UserImage
- Stores user-uploaded skin photos

## 🔧 Key Features Implementation

## Recommendation Algorithm
The algorithm scores products based on:
1. **Skin Type Match** (+1 point)
2. **Concern Targeting** (+1 point per matching concern)
3. **Pregnancy Safety** (excludes products with "avoid pregnancy" flag)


## AI Chatbot Integration
Uses Anthropic's Claude API to provide personalised skincare advice:
- Context-aware responses based on user profile
- Product recommendations
- Skincare routine guidance

## Common Issues
Issue: API requests fail with CORS error **
Solution: Ensure `django-cors-headers` is installed and configured in `settings.py`

Issue: Products not appearing in recommendations **
Solution: Check that product data matches expected format (skin types, concerns)

Issue: Session not persisting for non-authenticated users **
Solution: Verify `SESSION_COOKIE_HTTPONLY` and CORS credentials settings

