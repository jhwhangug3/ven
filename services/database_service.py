"""
Database Service for managing data operations
Handles users, chats, messages, and knowledge base
"""

import logging
import uuid
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from werkzeug.security import generate_password_hash, check_password_hash

from models import User, Chat, Message, Response, KnowledgeBase, ConversationContext, UserMemory
from app import db

logger = logging.getLogger(__name__)

class DatabaseService:
    """Service for database operations"""
    
    def __init__(self):
        """Initialize database service"""
        pass
    
    # User Management
    def create_user(self, username: str, email: str, password: str) -> int:
        """Create a new user"""
        try:
            # Check if user already exists
            existing_user = User.query.filter(
                (User.username == username) | (User.email == email)
            ).first()
            
            if existing_user:
                raise ValueError("Username or email already exists")
            
            # Create new user
            user = User(
                username=username,
                email=email
            )
            user.set_password(password)
            
            db.session.add(user)
            db.session.commit()
            
            # Create user memory entry
            user_memory = UserMemory(user_id=user.id)
            db.session.add(user_memory)
            db.session.commit()
            
            logger.info(f"Created user: {username}")
            return user.id
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating user: {e}")
            raise
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user login"""
        try:
            user = User.query.filter_by(email=email).first()
            
            if user and user.check_password(password):
                logger.info(f"User authenticated: {user.username}")
                return user
            
            return None
            
        except Exception as e:
            logger.error(f"Error authenticating user: {e}")
            return None
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        try:
            return User.query.get(user_id)
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            return None
    
    def update_user_profile(self, user_id: int, **kwargs) -> bool:
        """Update user profile"""
        try:
            user = User.query.get(user_id)
            if not user:
                return False
            
            # Update allowed fields
            allowed_fields = ['username', 'profile_image', 'preferences']
            for field, value in kwargs.items():
                if field in allowed_fields and hasattr(user, field):
                    setattr(user, field, value)
            
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"Updated user profile: {user_id}")
            return True
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating user profile: {e}")
            return False
    
    # Chat Management
    def create_chat(self, user_id: int, title: str = "New Chat") -> str:
        """Create a new chat session"""
        try:
            chat_id = str(uuid.uuid4())
            
            chat = Chat(
                id=chat_id,
                user_id=user_id,
                title=title
            )
            
            db.session.add(chat)
            db.session.commit()
            
            logger.info(f"Created chat: {chat_id} for user: {user_id}")
            return chat_id
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating chat: {e}")
            raise
    
    def get_user_chats(self, user_id: int) -> List[Dict[str, Any]]:
        """Get all chats for a user"""
        try:
            chats = Chat.query.filter_by(user_id=user_id, is_active=True).order_by(Chat.updated_at.desc()).all()
            return [chat.to_dict() for chat in chats]
            
        except Exception as e:
            logger.error(f"Error getting user chats: {e}")
            return []
    
    def get_chat_by_id(self, chat_id: str) -> Optional[Chat]:
        """Get chat by ID"""
        try:
            return Chat.query.get(chat_id)
        except Exception as e:
            logger.error(f"Error getting chat: {e}")
            return None
    
    def update_chat_title(self, chat_id: str, title: str) -> bool:
        """Update chat title"""
        try:
            chat = Chat.query.get(chat_id)
            if not chat:
                return False
            
            chat.title = title
            chat.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"Updated chat title: {chat_id}")
            return True
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating chat title: {e}")
            return False
    
    def delete_chat(self, chat_id: str) -> bool:
        """Soft delete a chat"""
        try:
            chat = Chat.query.get(chat_id)
            if not chat:
                return False
            
            chat.is_active = False
            chat.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"Deleted chat: {chat_id}")
            return True
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting chat: {e}")
            return False
    
    # Message Management
    def save_message(self, chat_id: str, user_id: int, message: str, sender: str, 
                    message_type: str = "text", metadata: Dict[str, Any] = None) -> int:
        """Save a message to the database"""
        try:
            msg = Message(
                chat_id=chat_id,
                user_id=user_id,
                content=message,
                sender=sender,
                message_type=message_type,
                metadata=metadata or {}
            )
            
            db.session.add(msg)
            
            # Update chat's updated_at timestamp
            chat = Chat.query.get(chat_id)
            if chat:
                chat.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            logger.info(f"Saved message: {msg.id} in chat: {chat_id}")
            return msg.id
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error saving message: {e}")
            raise
    
    def get_chat_messages(self, chat_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Get messages for a specific chat"""
        try:
            messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.created_at.asc()).limit(limit).all()
            return [msg.to_dict() for msg in messages]
            
        except Exception as e:
            logger.error(f"Error getting chat messages: {e}")
            return []
    
    def get_message_by_id(self, message_id: int) -> Optional[Message]:
        """Get message by ID"""
        try:
            return Message.query.get(message_id)
        except Exception as e:
            logger.error(f"Error getting message: {e}")
            return None
    
    # Response Management
    def get_responses(self, category: str = None) -> List[Dict[str, Any]]:
        """Get response templates"""
        try:
            query = Response.query.filter_by(is_active=True)
            if category:
                query = query.filter_by(category=category)
            
            responses = query.order_by(Response.priority.desc(), Response.trigger.asc()).all()
            return [resp.to_dict() for resp in responses]
            
        except Exception as e:
            logger.error(f"Error getting responses: {e}")
            return []
    
    def add_response(self, trigger: str, responses: List[str], category: str = "general", 
                    priority: int = 1) -> int:
        """Add new response template"""
        try:
            response = Response(
                trigger=trigger,
                responses=responses,
                category=category,
                priority=priority
            )
            
            db.session.add(response)
            db.session.commit()
            
            logger.info(f"Added response: {response.id}")
            return response.id
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error adding response: {e}")
            raise
    
    def update_response(self, response_id: int, **kwargs) -> bool:
        """Update response template"""
        try:
            response = Response.query.get(response_id)
            if not response:
                return False
            
            # Update allowed fields
            allowed_fields = ['trigger', 'responses', 'category', 'priority', 'is_active']
            for field, value in kwargs.items():
                if field in allowed_fields and hasattr(response, field):
                    setattr(response, field, value)
            
            response.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"Updated response: {response_id}")
            return True
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating response: {e}")
            return False
    
    # Knowledge Base Management
    def get_knowledge_base(self, category: str = None) -> List[Dict[str, Any]]:
        """Get knowledge base entries"""
        try:
            query = KnowledgeBase.query.filter_by(is_active=True)
            if category:
                query = query.filter_by(category=category)
            
            knowledge = query.order_by(KnowledgeBase.confidence.desc(), KnowledgeBase.topic.asc()).all()
            return [kb.to_dict() for kb in knowledge]
            
        except Exception as e:
            logger.error(f"Error getting knowledge base: {e}")
            return []
    
    def add_knowledge(self, topic: str, content: str, category: str = "general", 
                     keywords: List[str] = None, facts: List[str] = None, 
                     source: str = None, confidence: float = 1.0) -> int:
        """Add new knowledge base entry"""
        try:
            knowledge = KnowledgeBase(
                topic=topic,
                content=content,
                category=category,
                keywords=keywords or [],
                facts=facts or [],
                source=source,
                confidence=confidence
            )
            
            db.session.add(knowledge)
            db.session.commit()
            
            logger.info(f"Added knowledge: {knowledge.id}")
            return knowledge.id
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error adding knowledge: {e}")
            raise
    
    def search_knowledge(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search knowledge base"""
        try:
            # Simple search implementation - can be enhanced with full-text search
            knowledge_entries = KnowledgeBase.query.filter(
                KnowledgeBase.is_active == True,
                (KnowledgeBase.topic.ilike(f'%{query}%') |
                 KnowledgeBase.content.ilike(f'%{query}%') |
                 KnowledgeBase.keywords.contains([query]))
            ).order_by(KnowledgeBase.confidence.desc()).limit(limit).all()
            
            return [kb.to_dict() for kb in knowledge_entries]
            
        except Exception as e:
            logger.error(f"Error searching knowledge: {e}")
            return []
    
    def update_knowledge(self, knowledge_id: int, **kwargs) -> bool:
        """Update knowledge base entry"""
        try:
            knowledge = KnowledgeBase.query.get(knowledge_id)
            if not knowledge:
                return False
            
            # Update allowed fields
            allowed_fields = ['topic', 'content', 'category', 'keywords', 'facts', 'source', 'confidence']
            for field, value in kwargs.items():
                if field in allowed_fields and hasattr(knowledge, field):
                    setattr(knowledge, field, value)
            
            knowledge.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"Updated knowledge: {knowledge_id}")
            return True
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating knowledge: {e}")
            return False
    
    # User Memory Management
    def get_user_memory(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user memory"""
        try:
            memory = UserMemory.query.filter_by(user_id=user_id).first()
            return memory.to_dict() if memory else None
            
        except Exception as e:
            logger.error(f"Error getting user memory: {e}")
            return None
    
    def update_user_memory(self, user_id: int, **kwargs) -> bool:
        """Update user memory"""
        try:
            memory = UserMemory.query.filter_by(user_id=user_id).first()
            if not memory:
                # Create new memory entry
                memory = UserMemory(user_id=user_id)
                db.session.add(memory)
            
            # Update allowed fields
            allowed_fields = ['name', 'age', 'location', 'preferences', 'facts']
            for field, value in kwargs.items():
                if field in allowed_fields and hasattr(memory, field):
                    setattr(memory, field, value)
            
            memory.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"Updated user memory: {user_id}")
            return True
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating user memory: {e}")
            return False
    
    # Conversation Context Management
    def save_conversation_context(self, chat_id: str, user_id: int, context_data: Dict[str, Any]) -> int:
        """Save conversation context"""
        try:
            # Check if context already exists
            existing_context = ConversationContext.query.filter_by(
                chat_id=chat_id, user_id=user_id
            ).first()
            
            if existing_context:
                existing_context.context_data = context_data
                existing_context.updated_at = datetime.utcnow()
                context_id = existing_context.id
            else:
                context = ConversationContext(
                    chat_id=chat_id,
                    user_id=user_id,
                    context_data=context_data
                )
                db.session.add(context)
                context_id = context.id
            
            db.session.commit()
            
            logger.info(f"Saved conversation context: {context_id}")
            return context_id
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error saving conversation context: {e}")
            raise
    
    def get_conversation_context(self, chat_id: str, user_id: int) -> Optional[Dict[str, Any]]:
        """Get conversation context"""
        try:
            context = ConversationContext.query.filter_by(
                chat_id=chat_id, user_id=user_id
            ).first()
            
            return context.context_data if context else None
            
        except Exception as e:
            logger.error(f"Error getting conversation context: {e}")
            return None
    
    # Initialization
    def initialize_knowledge_base(self):
        """Initialize default knowledge base entries"""
        try:
            # Check if knowledge base already has entries
            existing_count = KnowledgeBase.query.count()
            if existing_count > 0:
                logger.info("Knowledge base already initialized")
                return
            
            # Add default knowledge entries
            default_knowledge = [
                {
                    'topic': 'sun',
                    'content': 'The Sun is the star at the center of our Solar System, around which Earth and other planets orbit.',
                    'category': 'astronomy',
                    'keywords': ['star', 'solar system', 'energy', 'light', 'heat'],
                    'facts': [
                        'The Sun is about 93 million miles from Earth',
                        'It is classified as a G-type main-sequence star',
                        'The Sun contains 99.86% of the mass in our Solar System'
                    ],
                    'source': 'Scientific Database',
                    'confidence': 1.0
                },
                {
                    'topic': 'earth',
                    'content': 'Earth is the third planet from the Sun and the only known planet to support life.',
                    'category': 'astronomy',
                    'keywords': ['planet', 'life', 'water', 'atmosphere', 'home'],
                    'facts': [
                        'Earth is the fifth largest planet in our Solar System',
                        'It has one natural satellite - the Moon',
                        'Earth\'s atmosphere is 78% nitrogen and 21% oxygen'
                    ],
                    'source': 'Scientific Database',
                    'confidence': 1.0
                }
            ]
            
            for knowledge_data in default_knowledge:
                knowledge = KnowledgeBase(**knowledge_data)
                db.session.add(knowledge)
            
            db.session.commit()
            logger.info("Initialized knowledge base with default entries")
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error initializing knowledge base: {e}")
    
    def initialize_responses(self):
        """Initialize default response templates"""
        try:
            # Check if responses already exist
            existing_count = Response.query.count()
            if existing_count > 0:
                logger.info("Responses already initialized")
                return
            
            # Add default responses
            default_responses = [
                {
                    'trigger': 'hi',
                    'responses': ['Hello! How are you today? 😊', 'Hi there! Nice to meet you! 👋'],
                    'category': 'greeting',
                    'priority': 1
                },
                {
                    'trigger': 'hello',
                    'responses': ['Hello! How are you today? 😊', 'Hi there! Nice to meet you! 👋'],
                    'category': 'greeting',
                    'priority': 1
                },
                {
                    'trigger': 'help',
                    'responses': ['I can help you with various tasks!', 'How can I assist you today?'],
                    'category': 'assistance',
                    'priority': 2
                }
            ]
            
            for response_data in default_responses:
                response = Response(**response_data)
                db.session.add(response)
            
            db.session.commit()
            logger.info("Initialized responses with default templates")
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error initializing responses: {e}")
    
    def get_database_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        try:
            stats = {
                'users': User.query.count(),
                'chats': Chat.query.count(),
                'messages': Message.query.count(),
                'responses': Response.query.count(),
                'knowledge_entries': KnowledgeBase.query.count(),
                'active_chats': Chat.query.filter_by(is_active=True).count(),
                'active_users': User.query.filter_by(is_active=True).count()
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting database stats: {e}")
            return {}
