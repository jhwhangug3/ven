"""
AI Service for intelligent response generation
Integrates multiple AI providers for enhanced capabilities
"""

import os
import json
import logging
import random
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
import pytz
import requests
from textblob import TextBlob
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

logger = logging.getLogger(__name__)

class AIService:
    """Service for AI-powered response generation and analysis"""
    
    def __init__(self):
        """Initialize AI service with configuration"""
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.google_api_key = os.getenv('GOOGLE_API_KEY')
        self.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        
        # Initialize NLP tools
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Load knowledge base
        self.knowledge_base = self._load_knowledge_base()
        
        # Initialize conversation memory
        self.conversation_memory = {}
        
    def _load_knowledge_base(self) -> Dict[str, Any]:
        """Load knowledge base from JSON file"""
        try:
            with open('responses.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning("responses.json not found, using default knowledge base")
            return self._get_default_knowledge_base()
    
    def _get_default_knowledge_base(self) -> Dict[str, Any]:
        """Get default knowledge base if JSON file is not available"""
        return {
            'basic_conversation': {
                'hi': ['Hello! How are you today?', 'Hi there! Nice to meet you!'],
                'hello': ['Hello! How are you today?', 'Hi there! Nice to meet you!'],
                'help': ['I can help you with various tasks!', 'How can I assist you today?']
            },
            'time_queries': {
                'what time': ['Let me get the current time for you!', 'I\'ll check the time!'],
                'current time': ['Here\'s the current time!', 'Let me tell you the time!']
            }
        }
    
    def analyze_message(self, message: str) -> Dict[str, Any]:
        """Analyze user message for intent, sentiment, and entities"""
        analysis = {
            'intent': self._detect_intent(message),
            'sentiment': self._analyze_sentiment(message),
            'entities': self._extract_entities(message),
            'keywords': self._extract_keywords(message),
            'language': self._detect_language(message),
            'complexity': self._assess_complexity(message)
        }
        return analysis
    
    def _detect_intent(self, message: str) -> str:
        """Detect the intent of the user message"""
        message_lower = message.lower()
        
        # Greeting intent
        if any(word in message_lower for word in ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']):
            return 'greeting'
        
        # Question intent
        if any(word in message_lower for word in ['what', 'how', 'why', 'when', 'where', 'who', 'which']):
            return 'question'
        
        # Time intent
        if any(word in message_lower for word in ['time', 'clock', 'hour', 'minute']):
            return 'time_query'
        
        # Date intent
        if any(word in message_lower for word in ['date', 'day', 'today', 'tomorrow', 'yesterday']):
            return 'date_query'
        
        # Math intent
        if any(char in message for char in ['+', '-', '*', '/', '=', '(', ')']):
            return 'math_query'
        
        # Translation intent
        if any(word in message_lower for word in ['translate', 'in spanish', 'to french', 'in german']):
            return 'translation_request'
        
        # Information request
        if any(word in message_lower for word in ['tell me about', 'what is', 'who is', 'search for']):
            return 'information_request'
        
        # Personal intent
        if any(word in message_lower for word in ['my name', 'i am', 'i\'m', 'i live in']):
            return 'personal_info'
        
        # Default to general conversation
        return 'general_conversation'
    
    def _analyze_sentiment(self, message: str) -> Dict[str, float]:
        """Analyze sentiment of the message"""
        try:
            blob = TextBlob(message)
            polarity = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
            
            # Categorize sentiment
            if polarity > 0.3:
                sentiment_category = 'positive'
            elif polarity < -0.3:
                sentiment_category = 'negative'
            else:
                sentiment_category = 'neutral'
            
            return {
                'polarity': polarity,
                'subjectivity': subjectivity,
                'category': sentiment_category
            }
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return {'polarity': 0.0, 'subjectivity': 0.0, 'category': 'neutral'}
    
    def _extract_entities(self, message: str) -> List[Dict[str, str]]:
        """Extract named entities from the message"""
        entities = []
        
        # Simple entity extraction (can be enhanced with spaCy or NER models)
        words = word_tokenize(message)
        
        # Extract potential names (capitalized words)
        for word in words:
            if word[0].isupper() and len(word) > 1 and word.lower() not in self.stop_words:
                entities.append({
                    'text': word,
                    'type': 'PERSON',
                    'confidence': 0.7
                })
        
        # Extract numbers
        for word in words:
            if word.replace('.', '').replace(',', '').isdigit():
                entities.append({
                    'text': word,
                    'type': 'NUMBER',
                    'confidence': 1.0
                })
        
        # Extract locations (simple heuristic)
        location_keywords = ['in', 'at', 'from', 'to']
        for i, word in enumerate(words):
            if word.lower() in location_keywords and i + 1 < len(words):
                next_word = words[i + 1]
                if next_word[0].isupper():
                    entities.append({
                        'text': next_word,
                        'type': 'LOCATION',
                        'confidence': 0.6
                    })
        
        return entities
    
    def _extract_keywords(self, message: str) -> List[str]:
        """Extract important keywords from the message"""
        # Tokenize and clean the message
        words = word_tokenize(message.lower())
        
        # Remove stop words and short words
        keywords = [
            self.lemmatizer.lemmatize(word) 
            for word in words 
            if word not in self.stop_words and len(word) > 2
        ]
        
        # Remove duplicates while preserving order
        seen = set()
        unique_keywords = []
        for keyword in keywords:
            if keyword not in seen:
                seen.add(keyword)
                unique_keywords.append(keyword)
        
        return unique_keywords[:10]  # Limit to top 10 keywords
    
    def _detect_language(self, message: str) -> str:
        """Detect the language of the message"""
        try:
            blob = TextBlob(message)
            return blob.detect_language()
        except Exception:
            return 'en'  # Default to English
    
    def _assess_complexity(self, message: str) -> Dict[str, Any]:
        """Assess the complexity of the message"""
        words = word_tokenize(message)
        sentences = sent_tokenize(message)
        
        # Calculate various complexity metrics
        avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        
        # Categorize complexity
        if avg_sentence_length > 20 or avg_word_length > 6:
            complexity_level = 'high'
        elif avg_sentence_length > 15 or avg_word_length > 5:
            complexity_level = 'medium'
        else:
            complexity_level = 'low'
        
        return {
            'word_count': len(words),
            'sentence_count': len(sentences),
            'avg_word_length': round(avg_word_length, 2),
            'avg_sentence_length': round(avg_sentence_length, 2),
            'level': complexity_level
        }
    
    def generate_response(self, message: str, context: Dict[str, Any] = None) -> str:
        """Generate an intelligent response based on message analysis and context"""
        try:
            # Analyze the message
            analysis = self.analyze_message(message)
            
            # Get context-aware response
            response = self._get_contextual_response(message, analysis, context)
            
            # Enhance response with AI if available
            if self.openai_api_key:
                enhanced_response = self._enhance_with_openai(message, response, context)
                if enhanced_response:
                    response = enhanced_response
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I'm sorry, I encountered an error while processing your message. Please try again."
    
    def _get_contextual_response(self, message: str, analysis: Dict[str, Any], context: Dict[str, Any] = None) -> str:
        """Get a contextual response based on analysis"""
        intent = analysis['intent']
        sentiment = analysis['sentiment']
        
        # Handle specific intents
        if intent == 'greeting':
            return self._get_greeting_response(sentiment)
        elif intent == 'time_query':
            return self._get_time_response()
        elif intent == 'date_query':
            return self._get_date_response()
        elif intent == 'math_query':
            return self._solve_math_problem(message)
        elif intent == 'translation_request':
            return self._handle_translation_request(message)
        elif intent == 'information_request':
            return self._get_information_response(message, analysis)
        elif intent == 'personal_info':
            return self._handle_personal_info(message, context)
        
        # Default to knowledge base lookup
        return self._get_knowledge_base_response(message, analysis)
    
    def _get_greeting_response(self, sentiment: Dict[str, Any]) -> str:
        """Get appropriate greeting response based on sentiment"""
        greetings = [
            "Hello! How are you today? 😊",
            "Hi there! Nice to meet you! 👋",
            "Hey! How can I help you? 😄",
            "Greetings! What's on your mind? 🌟"
        ]
        
        # Adjust response based on sentiment
        if sentiment['category'] == 'positive':
            greetings.extend([
                "Hello! You seem to be in a great mood! 😊✨",
                "Hi there! Your positive energy is contagious! 🌟"
            ])
        elif sentiment['category'] == 'negative':
            greetings.extend([
                "Hello! I'm here to help brighten your day! ☀️",
                "Hi there! Let's turn that frown upside down! 😊"
            ])
        
        return random.choice(greetings)
    
    def _get_time_response(self) -> str:
        """Get current time response"""
        now = datetime.now()
        time_str = now.strftime("%I:%M %p")
        date_str = now.strftime("%A, %B %d, %Y")
        
        return f"It's currently {time_str} on {date_str}. ⏰"
    
    def _get_date_response(self) -> str:
        """Get current date response"""
        now = datetime.now()
        date_str = now.strftime("%A, %B %d, %Y")
        
        return f"Today is {date_str}. 📅"
    
    def _solve_math_problem(self, message: str) -> str:
        """Solve mathematical expressions"""
        try:
            # Clean the message to extract mathematical expression
            import re
            
            # Remove common words and keep only math expression
            clean_message = re.sub(r'[^0-9+\-*/()^.\s]', '', message)
            clean_message = clean_message.replace('^', '**')  # Convert ^ to **
            
            # Evaluate the expression safely
            result = eval(clean_message)
            
            if isinstance(result, (int, float)):
                if result == int(result):
                    result = int(result)
                return f"The answer is {result}. 🧮"
            else:
                return "I can only solve basic mathematical expressions."
                
        except Exception as e:
            logger.error(f"Error solving math problem: {e}")
            return "I'm sorry, I couldn't solve that mathematical expression. Please try a simpler equation."
    
    def _handle_translation_request(self, message: str) -> str:
        """Handle translation requests"""
        # This is a simplified version - in production, you'd integrate with translation APIs
        return "I can help you with translations! Please specify the text and target language. For example: 'Translate hello to Spanish' 🌍"
    
    def _get_information_response(self, message: str, analysis: Dict[str, Any]) -> str:
        """Get information response based on keywords"""
        keywords = analysis['keywords']
        
        # Search knowledge base
        for keyword in keywords:
            response = self._search_knowledge_base(keyword)
            if response:
                return response
        
        # If no specific information found, provide helpful response
        return f"I'd be happy to help you learn about that! Could you provide more specific details about what you'd like to know? 🤔"
    
    def _handle_personal_info(self, message: str, context: Dict[str, Any] = None) -> str:
        """Handle personal information updates"""
        message_lower = message.lower()
        
        # Extract name
        if 'my name is' in message_lower or 'i\'m called' in message_lower:
            import re
            name_match = re.search(r'(?:my name is|i\'m called)\s+([a-zA-Z]+)', message, re.IGNORECASE)
            if name_match:
                name = name_match.group(1)
                if context:
                    context['user_name'] = name
                return f"Nice to meet you, {name}! I'll remember your name. 😊"
        
        # Extract age
        if any(word in message_lower for word in ['years old', 'age']):
            import re
            age_match = re.search(r'(\d+)\s*years?\s*old', message, re.IGNORECASE)
            if age_match:
                age = int(age_match.group(1))
                if context:
                    context['user_age'] = age
                return f"Got it! You're {age} years old. 🎂"
        
        return "I'm here to help! What would you like to know? 😊"
    
    def _search_knowledge_base(self, keyword: str) -> Optional[str]:
        """Search knowledge base for information"""
        # Search in loaded knowledge base
        for category, responses in self.knowledge_base.items():
            for trigger, response_list in responses.items():
                if keyword.lower() in trigger.lower():
                    return random.choice(response_list)
        
        return None
    
    def _get_knowledge_base_response(self, message: str, analysis: Dict[str, Any]) -> str:
        """Get response from knowledge base"""
        message_lower = message.lower()
        
        # Search for exact matches
        for category, responses in self.knowledge_base.items():
            for trigger, response_list in responses.items():
                if trigger.lower() in message_lower:
                    return random.choice(response_list)
        
        # If no exact match, try keyword matching
        keywords = analysis['keywords']
        for keyword in keywords:
            response = self._search_knowledge_base(keyword)
            if response:
                return response
        
        # Default fallback response
        fallback_responses = [
            "That's interesting! Tell me more about it. 😊",
            "I'd love to learn more about that! What would you like to know? 🤔",
            "That's a great topic! How can I help you explore it further? 🌟",
            "Interesting! What aspects would you like to discuss? 💭"
        ]
        
        return random.choice(fallback_responses)
    
    def _enhance_with_openai(self, message: str, current_response: str, context: Dict[str, Any] = None) -> Optional[str]:
        """Enhance response using OpenAI API"""
        if not self.openai_api_key:
            return None
        
        try:
            # This would integrate with OpenAI API for enhanced responses
            # For now, return the current response
            return current_response
        except Exception as e:
            logger.error(f"Error enhancing with OpenAI: {e}")
            return current_response
    
    def get_time_in_timezone(self, timezone_name: str) -> str:
        """Get current time in specified timezone"""
        try:
            tz = pytz.timezone(timezone_name)
            now = datetime.now(tz)
            time_str = now.strftime("%I:%M %p")
            date_str = now.strftime("%A, %B %d, %Y")
            
            return f"In {timezone_name}, it's {time_str} on {date_str}. ⏰"
        except Exception as e:
            logger.error(f"Error getting timezone time: {e}")
            return f"Sorry, I couldn't get the time for {timezone_name}."
    
    def get_weather_info(self, location: str) -> str:
        """Get weather information for a location"""
        # This would integrate with a weather API
        return f"I'd be happy to tell you about the weather in {location}! However, I need to integrate with a weather service to provide current information. 🌤️"
    
    def get_calculation_response(self, expression: str) -> str:
        """Get response for calculation requests"""
        try:
            # Clean and evaluate mathematical expression
            import re
            clean_expr = re.sub(r'[^0-9+\-*/()^.\s]', '', expression)
            clean_expr = clean_expr.replace('^', '**')
            
            result = eval(clean_expr)
            
            if isinstance(result, (int, float)):
                if result == int(result):
                    result = int(result)
                return f"The result is {result}. 🧮"
            else:
                return "I can only handle basic mathematical calculations."
                
        except Exception as e:
            logger.error(f"Error in calculation: {e}")
            return "I'm sorry, I couldn't calculate that. Please try a simpler expression."
