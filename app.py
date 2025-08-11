#!/usr/bin/env python3
"""
Ven - Intelligent AI Assistant
A Python-based chatbot with database integration and advanced AI capabilities
"""

import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import pytz

from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///ven_chatbot.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS
CORS(app)

# Initialize database
db = SQLAlchemy(app)

# Import models and services after db initialization
from models import User, Chat, Message, Response, KnowledgeBase
from services.chatbot_service import IntelligentChatbotService
from services.ai_service import AIService
from services.database_service import DatabaseService

# Initialize services
ai_service = AIService()
chatbot_service = IntelligentChatbotService(ai_service)
db_service = DatabaseService()

@app.route('/')
def index():
    """Serve the main chat interface"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages and return intelligent responses"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        user_id = data.get('user_id')
        chat_id = data.get('chat_id')
        
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Get intelligent response
        response = chatbot_service.get_response(
            user_message=user_message,
            user_id=user_id,
            chat_id=chat_id
        )
        
        # Save message and response to database
        if user_id and chat_id:
            db_service.save_message(
                chat_id=chat_id,
                user_id=user_id,
                message=user_message,
                sender='user'
            )
            db_service.save_message(
                chat_id=chat_id,
                user_id=user_id,
                message=response['text'],
                sender='bot'
            )
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/chat/new', methods=['POST'])
def new_chat():
    """Start a new chat session"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        chat_id = db_service.create_chat(user_id=user_id)
        
        return jsonify({
            'chat_id': chat_id,
            'message': 'New chat created successfully'
        })
        
    except Exception as e:
        logger.error(f"Error creating new chat: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/chat/<chat_id>/history', methods=['GET'])
def get_chat_history(chat_id):
    """Get chat history for a specific chat"""
    try:
        messages = db_service.get_chat_messages(chat_id)
        return jsonify({'messages': messages})
        
    except Exception as e:
        logger.error(f"Error getting chat history: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/user/<user_id>/chats', methods=['GET'])
def get_user_chats(user_id):
    """Get all chats for a user"""
    try:
        chats = db_service.get_user_chats(user_id)
        return jsonify({'chats': chats})
        
    except Exception as e:
        logger.error(f"Error getting user chats: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/user/register', methods=['POST'])
def register_user():
    """Register a new user"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        user_id = db_service.create_user(username, email, password)
        
        return jsonify({
            'user_id': user_id,
            'message': 'User registered successfully'
        })
        
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/user/login', methods=['POST'])
def login_user():
    """Authenticate user login"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Email and password required'}), 400
        
        user = db_service.authenticate_user(email, password)
        
        if user:
            session['user_id'] = user.id
            return jsonify({
                'user_id': user.id,
                'username': user.username,
                'message': 'Login successful'
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        logger.error(f"Error in user login: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/user/logout', methods=['POST'])
def logout_user():
    """Logout user"""
    try:
        session.pop('user_id', None)
        return jsonify({'message': 'Logout successful'})
        
    except Exception as e:
        logger.error(f"Error in user logout: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/knowledge', methods=['GET'])
def get_knowledge_base():
    """Get knowledge base entries"""
    try:
        knowledge = db_service.get_knowledge_base()
        return jsonify({'knowledge': knowledge})
        
    except Exception as e:
        logger.error(f"Error getting knowledge base: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/knowledge', methods=['POST'])
def add_knowledge():
    """Add new knowledge base entry"""
    try:
        data = request.get_json()
        topic = data.get('topic')
        content = data.get('content')
        category = data.get('category', 'general')
        
        if not all([topic, content]):
            return jsonify({'error': 'Topic and content required'}), 400
        
        knowledge_id = db_service.add_knowledge(topic, content, category)
        
        return jsonify({
            'knowledge_id': knowledge_id,
            'message': 'Knowledge added successfully'
        })
        
    except Exception as e:
        logger.error(f"Error adding knowledge: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
        # Initialize default knowledge base
        db_service.initialize_knowledge_base()
    
    # Run the application
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 5000)),
        debug=os.getenv('FLASK_ENV') == 'development'
    )
