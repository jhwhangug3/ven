"""
Intelligent Chatbot Service
Orchestrates AI responses and conversation management
"""

import logging
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from services.ai_service import AIService

logger = logging.getLogger(__name__)

class IntelligentChatbotService:
    """Main service for intelligent chatbot functionality"""
    
    def __init__(self, ai_service: AIService):
        """Initialize the chatbot service"""
        self.ai_service = ai_service
        self.conversation_contexts = {}
        self.user_memories = {}
        
    def get_response(self, user_message: str, user_id: Optional[int] = None, chat_id: Optional[str] = None) -> Dict[str, Any]:
        """Get intelligent response for user message"""
        try:
            # Get or create conversation context
            context_key = f"{user_id}_{chat_id}" if user_id and chat_id else "anonymous"
            context = self.conversation_contexts.get(context_key, {})
            
            # Update context with user message
            self._update_conversation_context(context, user_message, user_id, chat_id)
            
            # Generate intelligent response
            response_text = self.ai_service.generate_response(user_message, context)
            
            # Update context with bot response
            self._update_conversation_context(context, response_text, user_id, chat_id, is_bot=True)
            
            # Store updated context
            self.conversation_contexts[context_key] = context
            
            # Update user memory if user_id is provided
            if user_id:
                self._update_user_memory(user_id, user_message, response_text, context)
            
            # Prepare response object
            response = {
                'text': response_text,
                'timestamp': datetime.now().isoformat(),
                'context': {
                    'intent': context.get('last_intent'),
                    'sentiment': context.get('last_sentiment'),
                    'entities': context.get('last_entities', []),
                    'conversation_length': context.get('message_count', 0)
                }
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Error getting response: {e}")
            return {
                'text': "I'm sorry, I encountered an error while processing your message. Please try again.",
                'timestamp': datetime.now().isoformat(),
                'context': {'error': str(e)}
            }
    
    def _update_conversation_context(self, context: Dict[str, Any], message: str, user_id: Optional[int] = None, 
                                   chat_id: Optional[str] = None, is_bot: bool = False):
        """Update conversation context with new message"""
        # Initialize context if empty
        if not context:
            context.update({
                'user_id': user_id,
                'chat_id': chat_id,
                'start_time': datetime.now().isoformat(),
                'message_count': 0,
                'user_message_count': 0,
                'bot_message_count': 0,
                'topics': [],
                'entities': [],
                'sentiment_history': [],
                'intent_history': [],
                'last_interaction': None
            })
        
        # Update message counts
        context['message_count'] += 1
        if is_bot:
            context['bot_message_count'] += 1
        else:
            context['user_message_count'] += 1
        
        # Analyze message if it's from user
        if not is_bot:
            analysis = self.ai_service.analyze_message(message)
            
            # Update context with analysis
            context['last_intent'] = analysis['intent']
            context['last_sentiment'] = analysis['sentiment']
            context['last_entities'] = analysis['entities']
            
            # Add to history
            context['intent_history'].append(analysis['intent'])
            context['sentiment_history'].append(analysis['sentiment']['category'])
            
            # Extract and store topics
            keywords = analysis['keywords']
            if keywords:
                context['topics'].extend(keywords)
                # Keep only unique topics
                context['topics'] = list(set(context['topics']))[-10:]  # Keep last 10 topics
            
            # Extract and store entities
            if analysis['entities']:
                context['entities'].extend(analysis['entities'])
                # Keep only unique entities
                seen_entities = set()
                unique_entities = []
                for entity in context['entities']:
                    entity_key = f"{entity['text']}_{entity['type']}"
                    if entity_key not in seen_entities:
                        seen_entities.add(entity_key)
                        unique_entities.append(entity)
                context['entities'] = unique_entities[-20:]  # Keep last 20 entities
        
        # Update last interaction time
        context['last_interaction'] = datetime.now().isoformat()
        
        # Store conversation flow
        if 'conversation_flow' not in context:
            context['conversation_flow'] = []
        
        context['conversation_flow'].append({
            'timestamp': datetime.now().isoformat(),
            'sender': 'bot' if is_bot else 'user',
            'message': message[:100] + '...' if len(message) > 100 else message,  # Truncate long messages
            'intent': context.get('last_intent') if not is_bot else None,
            'sentiment': context.get('last_sentiment', {}).get('category') if not is_bot else None
        })
        
        # Keep only last 50 messages in flow
        context['conversation_flow'] = context['conversation_flow'][-50:]
    
    def _update_user_memory(self, user_id: int, user_message: str, bot_response: str, context: Dict[str, Any]):
        """Update user memory with conversation information"""
        if user_id not in self.user_memories:
            self.user_memories[user_id] = {
                'user_id': user_id,
                'conversations': [],
                'preferences': {},
                'facts': [],
                'interests': set(),
                'last_interaction': None
            }
        
        memory = self.user_memories[user_id]
        
        # Update last interaction
        memory['last_interaction'] = datetime.now().isoformat()
        
        # Store conversation summary
        conversation_summary = {
            'timestamp': datetime.now().isoformat(),
            'user_message': user_message[:100] + '...' if len(user_message) > 100 else user_message,
            'bot_response': bot_response[:100] + '...' if len(bot_response) > 100 else bot_response,
            'intent': context.get('last_intent'),
            'sentiment': context.get('last_sentiment', {}).get('category'),
            'topics': context.get('topics', [])[-5:]  # Last 5 topics
        }
        
        memory['conversations'].append(conversation_summary)
        
        # Keep only last 100 conversations
        memory['conversations'] = memory['conversations'][-100:]
        
        # Extract and store user interests from topics
        if context.get('topics'):
            memory['interests'].update(context['topics'])
            # Keep only last 50 interests
            memory['interests'] = set(list(memory['interests'])[-50:])
        
        # Extract personal information
        self._extract_personal_info(user_message, memory)
    
    def _extract_personal_info(self, message: str, memory: Dict[str, Any]):
        """Extract personal information from user message"""
        message_lower = message.lower()
        
        # Extract name
        import re
        name_patterns = [
            r'my name is (\w+)',
            r'i\'m called (\w+)',
            r'call me (\w+)',
            r'i am (\w+)',
            r'i\'m (\w+)'
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, message_lower)
            if match:
                name = match.group(1).title()
                memory['preferences']['name'] = name
                break
        
        # Extract age
        age_patterns = [
            r'i am (\d+) years? old',
            r'i\'m (\d+) years? old',
            r'(\d+) years? old',
            r'age (\d+)'
        ]
        
        for pattern in age_patterns:
            match = re.search(pattern, message_lower)
            if match:
                age = int(match.group(1))
                memory['preferences']['age'] = age
                break
        
        # Extract location
        location_patterns = [
            r'i live in ([^.!?]+)',
            r'i\'m from ([^.!?]+)',
            r'location ([^.!?]+)'
        ]
        
        for pattern in location_patterns:
            match = re.search(pattern, message_lower)
            if match:
                location = match.group(1).strip()
                memory['preferences']['location'] = location
                break
        
        # Extract preferences
        if 'favorite' in message_lower or 'love' in message_lower or 'like' in message_lower:
            # Extract what they like
            like_patterns = [
                r'i love (\w+)',
                r'i like (\w+)',
                r'favorite (\w+)',
                r'love (\w+)'
            ]
            
            for pattern in like_patterns:
                match = re.search(pattern, message_lower)
                if match:
                    preference = match.group(1)
                    if 'preferences' not in memory:
                        memory['preferences'] = {}
                    if 'likes' not in memory['preferences']:
                        memory['preferences']['likes'] = []
                    memory['preferences']['likes'].append(preference)
                    break
    
    def get_conversation_summary(self, user_id: Optional[int] = None, chat_id: Optional[str] = None) -> Dict[str, Any]:
        """Get summary of conversation context"""
        context_key = f"{user_id}_{chat_id}" if user_id and chat_id else "anonymous"
        context = self.conversation_contexts.get(context_key, {})
        
        if not context:
            return {"message": "No conversation context found"}
        
        # Calculate conversation statistics
        total_messages = context.get('message_count', 0)
        user_messages = context.get('user_message_count', 0)
        bot_messages = context.get('bot_message_count', 0)
        
        # Get most common topics
        topics = context.get('topics', [])
        topic_frequency = {}
        for topic in topics:
            topic_frequency[topic] = topic_frequency.get(topic, 0) + 1
        
        # Get most common intents
        intents = context.get('intent_history', [])
        intent_frequency = {}
        for intent in intents:
            intent_frequency[intent] = intent_frequency.get(intent, 0) + 1
        
        # Get sentiment distribution
        sentiments = context.get('sentiment_history', [])
        sentiment_distribution = {}
        for sentiment in sentiments:
            sentiment_distribution[sentiment] = sentiment_distribution.get(sentiment, 0) + 1
        
        return {
            'conversation_stats': {
                'total_messages': total_messages,
                'user_messages': user_messages,
                'bot_messages': bot_messages,
                'start_time': context.get('start_time'),
                'last_interaction': context.get('last_interaction')
            },
            'topics': {
                'all_topics': topics[-10:],  # Last 10 topics
                'topic_frequency': dict(sorted(topic_frequency.items(), key=lambda x: x[1], reverse=True)[:5])
            },
            'intents': {
                'all_intents': intents[-10:],  # Last 10 intents
                'intent_frequency': dict(sorted(intent_frequency.items(), key=lambda x: x[1], reverse=True)[:5])
            },
            'sentiments': {
                'all_sentiments': sentiments[-10:],  # Last 10 sentiments
                'sentiment_distribution': sentiment_distribution
            },
            'entities': context.get('entities', [])[-10:]  # Last 10 entities
        }
    
    def get_user_memory(self, user_id: int) -> Dict[str, Any]:
        """Get user memory and preferences"""
        memory = self.user_memories.get(user_id, {})
        
        if not memory:
            return {"message": "No user memory found"}
        
        # Convert set to list for JSON serialization
        if 'interests' in memory:
            memory['interests'] = list(memory['interests'])
        
        return memory
    
    def clear_conversation_context(self, user_id: Optional[int] = None, chat_id: Optional[str] = None):
        """Clear conversation context"""
        context_key = f"{user_id}_{chat_id}" if user_id and chat_id else "anonymous"
        if context_key in self.conversation_contexts:
            del self.conversation_contexts[context_key]
    
    def get_suggested_responses(self, user_message: str, context: Dict[str, Any] = None) -> List[str]:
        """Get suggested responses based on user message and context"""
        try:
            # Analyze the message
            analysis = self.ai_service.analyze_message(user_message)
            
            # Generate multiple response variations
            responses = []
            
            # Base response
            base_response = self.ai_service.generate_response(user_message, context)
            responses.append(base_response)
            
            # Generate variations based on intent
            intent = analysis['intent']
            if intent == 'greeting':
                responses.extend([
                    "Hello! How can I help you today? 😊",
                    "Hi there! What would you like to know? 👋",
                    "Greetings! How may I assist you? 🌟"
                ])
            elif intent == 'question':
                responses.extend([
                    "That's a great question! Let me help you with that. 🤔",
                    "I'd be happy to answer that for you! 💭",
                    "Interesting question! Here's what I know about that. 📚"
                ])
            elif intent == 'time_query':
                responses.extend([
                    "Let me check the current time for you! ⏰",
                    "I'll get the time right now! 🕐",
                    "Here's the current time! 📅"
                ])
            
            # Remove duplicates while preserving order
            seen = set()
            unique_responses = []
            for response in responses:
                if response not in seen:
                    seen.add(response)
                    unique_responses.append(response)
            
            return unique_responses[:5]  # Return up to 5 unique responses
            
        except Exception as e:
            logger.error(f"Error generating suggested responses: {e}")
            return ["I'm here to help! What would you like to know?"]
    
    def get_conversation_insights(self, user_id: Optional[int] = None, chat_id: Optional[str] = None) -> Dict[str, Any]:
        """Get insights about the conversation"""
        try:
            summary = self.get_conversation_summary(user_id, chat_id)
            
            if 'message' in summary:
                return summary
            
            # Generate insights
            insights = {
                'conversation_length': summary['conversation_stats']['total_messages'],
                'engagement_level': self._calculate_engagement_level(summary),
                'topic_diversity': len(summary['topics']['all_topics']),
                'sentiment_trend': self._analyze_sentiment_trend(summary['sentiments']['all_sentiments']),
                'intent_patterns': self._analyze_intent_patterns(summary['intents']['all_intents']),
                'recommendations': self._generate_recommendations(summary)
            }
            
            return {
                'summary': summary,
                'insights': insights
            }
            
        except Exception as e:
            logger.error(f"Error generating conversation insights: {e}")
            return {"error": "Could not generate insights"}
    
    def _calculate_engagement_level(self, summary: Dict[str, Any]) -> str:
        """Calculate user engagement level"""
        total_messages = summary['conversation_stats']['total_messages']
        
        if total_messages > 20:
            return "Very High"
        elif total_messages > 15:
            return "High"
        elif total_messages > 10:
            return "Medium"
        elif total_messages > 5:
            return "Low"
        else:
            return "Very Low"
    
    def _analyze_sentiment_trend(self, sentiments: List[str]) -> str:
        """Analyze sentiment trend over conversation"""
        if not sentiments:
            return "Neutral"
        
        # Calculate sentiment changes
        positive_count = sentiments.count('positive')
        negative_count = sentiments.count('negative')
        neutral_count = sentiments.count('neutral')
        
        if positive_count > negative_count and positive_count > neutral_count:
            return "Improving"
        elif negative_count > positive_count and negative_count > neutral_count:
            return "Declining"
        else:
            return "Stable"
    
    def _analyze_intent_patterns(self, intents: List[str]) -> Dict[str, Any]:
        """Analyze patterns in user intents"""
        if not intents:
            return {"pattern": "None", "most_common": "None"}
        
        # Find most common intent
        intent_counts = {}
        for intent in intents:
            intent_counts[intent] = intent_counts.get(intent, 0) + 1
        
        most_common = max(intent_counts.items(), key=lambda x: x[1])
        
        # Analyze pattern
        if len(set(intents)) == 1:
            pattern = "Consistent"
        elif len(set(intents)) <= 3:
            pattern = "Focused"
        else:
            pattern = "Diverse"
        
        return {
            "pattern": pattern,
            "most_common": most_common[0],
            "intent_variety": len(set(intents))
        }
    
    def _generate_recommendations(self, summary: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on conversation analysis"""
        recommendations = []
        
        # Topic-based recommendations
        topics = summary['topics']['all_topics']
        if topics:
            recommendations.append(f"Continue exploring topics like: {', '.join(topics[-3:])}")
        
        # Sentiment-based recommendations
        sentiments = summary['sentiments']['sentiment_distribution']
        if sentiments.get('negative', 0) > sentiments.get('positive', 0):
            recommendations.append("Consider asking more positive or neutral questions")
        
        # Intent-based recommendations
        intents = summary['intents']['all_intents']
        if 'question' in intents and intents.count('question') > len(intents) * 0.7:
            recommendations.append("You're asking great questions! Keep exploring")
        
        if not recommendations:
            recommendations.append("Keep the conversation flowing naturally")
        
        return recommendations
