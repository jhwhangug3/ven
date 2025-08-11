# Ven - Intelligent AI Assistant

A sophisticated, Python-based AI chatbot with database integration, advanced natural language processing, and intelligent conversation management.

## 🚀 Features

### Core Functionality

- **Intelligent Response Generation**: Advanced AI-powered responses using multiple AI providers
- **Database Integration**: SQLite/PostgreSQL/MySQL support with comprehensive data models
- **User Management**: Full authentication system with user profiles and preferences
- **Conversation Memory**: Context-aware conversations with persistent chat history
- **Multi-modal Support**: Text, voice input, and rich media support

### AI Capabilities

- **Natural Language Processing**: Intent detection, sentiment analysis, entity extraction
- **Context Understanding**: Maintains conversation context across sessions
- **Knowledge Base**: Expandable knowledge system with confidence scoring
- **Response Customization**: Multiple response styles (friendly, formal, casual, creative)
- **Multi-language Support**: Built-in language detection and translation capabilities

### Advanced Features

- **Conversation Analytics**: Detailed insights into conversation patterns and engagement
- **Smart Suggestions**: AI-powered response suggestions based on context
- **Personalization**: User preferences, memory, and adaptive responses
- **Real-time Processing**: Asynchronous message handling and real-time updates
- **Scalable Architecture**: Modular design for easy extension and customization

## 🏗️ Architecture

```
ven/
├── app.py                 # Main Flask application
├── models.py             # Database models and schemas
├── services/             # Business logic services
│   ├── ai_service.py     # AI and NLP processing
│   ├── chatbot_service.py # Main chatbot orchestration
│   └── database_service.py # Database operations
├── templates/            # HTML templates
│   └── index.html       # Main chat interface
├── static/              # Static assets
│   ├── styles.css       # Application styling
│   └── script.js        # Frontend JavaScript
├── responses.json        # Knowledge base and responses
├── requirements.txt      # Python dependencies
└── README_PYTHON.md     # This file
```

## 🛠️ Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ven
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv

   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**

   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

5. **Initialize the application**

   ```bash
   python app.py
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-here
HOST=0.0.0.0
PORT=5000

# Database Configuration
DATABASE_URL=sqlite:///ven_chatbot.db

# AI Service API Keys (Optional)
OPENAI_API_KEY=your-openai-api-key
GOOGLE_API_KEY=your-google-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379/0
```

### Database Configuration

The application supports multiple database backends:

- **SQLite** (default): `sqlite:///ven_chatbot.db`
- **PostgreSQL**: `postgresql://username:password@localhost/ven_chatbot`
- **MySQL**: `mysql://username:password@localhost/ven_chatbot`

## 📊 Database Schema

### Core Tables

- **users**: User accounts and authentication
- **chats**: Chat sessions and metadata
- **messages**: Individual chat messages
- **responses**: Predefined response templates
- **knowledge_base**: Expandable knowledge entries
- **conversation_contexts**: Conversation state and context
- **user_memories**: User preferences and personal data

### Key Features

- **Automatic Migration**: Database tables are created automatically
- **Data Integrity**: Foreign key constraints and validation
- **Soft Deletes**: Data preservation with soft deletion
- **Audit Trail**: Timestamps and change tracking

## 🧠 AI Service Integration

### Supported AI Providers

1. **OpenAI GPT Models**

   - Enhanced response generation
   - Context-aware conversations
   - Multi-language support

2. **Google AI Services**

   - Natural language understanding
   - Sentiment analysis
   - Entity recognition

3. **Anthropic Claude**
   - Advanced reasoning capabilities
   - Ethical AI responses
   - Long-context conversations

### NLP Capabilities

- **Intent Detection**: Understands user goals and requests
- **Sentiment Analysis**: Analyzes emotional context
- **Entity Extraction**: Identifies names, locations, numbers
- **Language Detection**: Automatic language identification
- **Complexity Assessment**: Adapts responses to user level

## 🔌 API Endpoints

### Chat Endpoints

- `POST /api/chat` - Send message and get response
- `POST /api/chat/new` - Create new chat session
- `GET /api/chat/<chat_id>/history` - Get chat history

### User Management

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User authentication
- `POST /api/user/logout` - User logout

### Knowledge Management

- `GET /api/knowledge` - Retrieve knowledge base
- `POST /api/knowledge` - Add new knowledge entry

### System Health

- `GET /api/health` - Application health check

## 🎨 Customization

### Response Styles

The chatbot supports multiple response styles:

- **Friendly**: Warm and approachable responses
- **Formal**: Professional and structured communication
- **Casual**: Relaxed and informal conversation
- **Creative**: Imaginative and engaging responses

### Knowledge Base

Easily extend the knowledge base:

```python
# Add new knowledge entry
knowledge_data = {
    'topic': 'Python Programming',
    'content': 'Python is a high-level programming language...',
    'category': 'programming',
    'keywords': ['python', 'programming', 'coding'],
    'facts': ['Created by Guido van Rossum', 'First released in 1991'],
    'source': 'Official Documentation',
    'confidence': 1.0
}

db_service.add_knowledge(**knowledge_data)
```

### Response Templates

Customize response patterns:

```python
# Add new response template
response_data = {
    'trigger': 'python help',
    'responses': [
        'I can help you with Python programming!',
        'Let me assist you with Python questions.',
        'Python programming support is my specialty!'
    ],
    'category': 'programming',
    'priority': 2
}

db_service.add_response(**response_data)
```

## 🚀 Deployment

### Development

```bash
# Run in development mode
python app.py
```

### Production

```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Using Docker
docker build -t ven-chatbot .
docker run -p 5000:5000 ven-chatbot
```

### Docker Support

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## 🔒 Security Features

- **Password Hashing**: Secure password storage using Werkzeug
- **Session Management**: Secure session handling with Flask-Session
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive input sanitization and validation
- **SQL Injection Protection**: Parameterized queries and ORM usage

## 📈 Performance Optimization

- **Database Indexing**: Optimized database queries
- **Caching**: Redis-based caching for frequently accessed data
- **Async Processing**: Background task processing with Celery
- **Connection Pooling**: Efficient database connection management
- **Response Compression**: Gzip compression for API responses

## 🧪 Testing

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-cov

# Run tests with coverage
pytest --cov=services --cov=models tests/

# Run specific test file
pytest tests/test_ai_service.py
```

### Test Structure

```
tests/
├── test_ai_service.py      # AI service tests
├── test_chatbot_service.py # Chatbot service tests
├── test_database_service.py # Database service tests
├── test_models.py          # Model tests
└── conftest.py             # Test configuration
```

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Code Standards

- Follow PEP 8 Python style guide
- Add comprehensive docstrings
- Include unit tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Flask**: Web framework for Python
- **SQLAlchemy**: Database toolkit and ORM
- **NLTK**: Natural language processing toolkit
- **TextBlob**: Simplified text processing
- **Font Awesome**: Icon library

## 📞 Support

For support and questions:

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the inline code documentation
- **Community**: Join our community discussions

## 🔮 Future Enhancements

- **Voice Recognition**: Advanced speech-to-text capabilities
- **Multi-modal AI**: Image and video understanding
- **Advanced Analytics**: Machine learning insights and predictions
- **Plugin System**: Extensible architecture for custom modules
- **Mobile App**: Native mobile applications
- **Enterprise Features**: Advanced security and compliance tools

---

**Ven - Making AI conversations intelligent, personal, and engaging.** 🚀
