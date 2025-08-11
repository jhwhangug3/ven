#!/usr/bin/env python3
"""
Ven Chatbot Startup Script
Simple script to run the Flask application
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Set default environment variables if not already set
    if not os.getenv('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    if not os.getenv('SECRET_KEY'):
        os.environ['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    
    # Get port from environment or use default
    port = int(os.getenv('PORT', 5000))
    
    print(f"🚀 Starting Ven Chatbot on port {port}")
    print(f"📱 Open your browser and navigate to: http://localhost:{port}")
    print(f"🔧 Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"💾 Database: {os.getenv('DATABASE_URL', 'sqlite:///ven_chatbot.db')}")
    print("\n" + "="*50)
    
    try:
        # Run the Flask application
        app.run(
            host=os.getenv('HOST', '0.0.0.0'),
            port=port,
            debug=os.getenv('FLASK_ENV') == 'development'
        )
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down Ven Chatbot...")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error starting Ven Chatbot: {e}")
        sys.exit(1)
