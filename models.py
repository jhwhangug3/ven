"""
Database models for the Ven chatbot
"""

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(db.Model):
    """User model for authentication and personalization"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    profile_image = db.Column(db.String(255))
    preferences = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    chats = db.relationship('Chat', backref='user', lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_image': self.profile_image,
            'preferences': self.preferences,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }

class Chat(db.Model):
    """Chat session model"""
    __tablename__ = 'chats'
    
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), default='New Chat')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    messages = db.relationship('Message', backref='chat', lazy=True, order_by='Message.created_at')
    
    def to_dict(self):
        """Convert chat to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'message_count': len(self.messages),
            'is_active': self.is_active
        }

class Message(db.Model):
    """Individual message model"""
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.String(36), db.ForeignKey('chats.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(10), nullable=False)  # 'user' or 'bot'
    message_type = db.Column(db.String(20), default='text')  # text, image, file, etc.
    metadata = db.Column(db.JSON)  # Additional message data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert message to dictionary"""
        return {
            'id': self.id,
            'chat_id': self.chat_id,
            'user_id': self.user_id,
            'content': self.content,
            'sender': self.sender,
            'message_type': self.message_type,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Response(db.Model):
    """Predefined response templates"""
    __tablename__ = 'responses'
    
    id = db.Column(db.Integer, primary_key=True)
    trigger = db.Column(db.String(255), nullable=False, unique=True)
    responses = db.Column(db.JSON, nullable=False)  # List of possible responses
    category = db.Column(db.String(50), default='general')
    priority = db.Column(db.Integer, default=1)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert response to dictionary"""
        return {
            'id': self.id,
            'trigger': self.trigger,
            'responses': self.responses,
            'category': self.category,
            'priority': self.priority,
            'is_active': self.is_active
        }

class KnowledgeBase(db.Model):
    """Knowledge base entries for intelligent responses"""
    __tablename__ = 'knowledge_base'
    
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(255), nullable=False, unique=True)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='general')
    keywords = db.Column(db.JSON)  # List of related keywords
    facts = db.Column(db.JSON)  # List of facts about the topic
    source = db.Column(db.String(255))
    confidence = db.Column(db.Float, default=1.0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert knowledge base entry to dictionary"""
        return {
            'id': self.id,
            'topic': self.topic,
            'content': self.content,
            'category': self.category,
            'keywords': self.keywords,
            'facts': self.facts,
            'source': self.source,
            'confidence': self.confidence,
            'is_active': self.is_active
        }

class ConversationContext(db.Model):
    """Store conversation context for better responses"""
    __tablename__ = 'conversation_contexts'
    
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.String(36), db.ForeignKey('chats.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    context_data = db.Column(db.JSON)  # Store context information
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert context to dictionary"""
        return {
            'id': self.id,
            'chat_id': self.chat_id,
            'user_id': self.user_id,
            'context_data': self.context_data,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class UserMemory(db.Model):
    """Store user preferences and memory"""
    __tablename__ = 'user_memories'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    location = db.Column(db.String(255))
    preferences = db.Column(db.JSON)  # User preferences
    facts = db.Column(db.JSON)  # Facts about the user
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert user memory to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'age': self.age,
            'location': self.location,
            'preferences': self.preferences,
            'facts': self.facts,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
