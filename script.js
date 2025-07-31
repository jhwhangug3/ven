class Chatbot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        
        this.responses = {
            'hi': ['Hello! How are you today?', 'Hi there! Nice to meet you!', 'Hey! How can I help you?'],
            'hello': ['Hello! How are you today?', 'Hi there! Nice to meet you!', 'Hey! How can I help you?'],
            'hey': ['Hello! How are you today?', 'Hi there! Nice to meet you!', 'Hey! How can I help you?'],
            'how are you': ['I\'m doing great, thank you for asking! How about you?', 'I\'m wonderful! How are you?', 'I\'m fine, thanks! How are you doing?'],
            'how are you?': ['I\'m doing great, thank you for asking! How about you?', 'I\'m wonderful! How are you?', 'I\'m fine, thanks! How are you doing?'],
            'what\'s your name': ['My name is Ven! Nice to meet you!', 'I\'m Ven, your friendly AI assistant!', 'You can call me Ven!'],
            'what is your name': ['My name is Ven! Nice to meet you!', 'I\'m Ven, your friendly AI assistant!', 'You can call me Ven!'],
            'whats your name': ['My name is Ven! Nice to meet you!', 'I\'m Ven, your friendly AI assistant!', 'You can call me Ven!'],
            'goodbye': ['Goodbye! Have a great day!', 'See you later! Take care!', 'Bye! It was nice chatting with you!'],
            'bye': ['Goodbye! Have a great day!', 'See you later! Take care!', 'Bye! It was nice chatting with you!'],
            'thanks': ['You\'re welcome!', 'No problem at all!', 'Glad I could help!'],
            'thank you': ['You\'re welcome!', 'No problem at all!', 'Glad I could help!'],
            'thankyou': ['You\'re welcome!', 'No problem at all!', 'Glad I could help!'],
            'help': ['I can help you with basic conversations! Try saying hi, asking how I am, or asking my name!', 'I\'m Ven, here to chat! Try asking me how I am or what my name is!'],
            'what can you do': ['I can chat with you! Try saying hi, asking how I am, or asking my name!', 'I\'m Ven, a simple AI assistant that loves to chat! Ask me anything!'],
            'who are you': ['I\'m Ven, a friendly AI assistant designed to chat with you!', 'I\'m your AI friend Ven! I love having conversations!'],
            'who are you?': ['I\'m Ven, a friendly AI assistant designed to chat with you!', 'I\'m your AI friend Ven! I love having conversations!'],
            'nice to meet you': ['Nice to meet you too! I\'m excited to chat with you!', 'Likewise! I\'m looking forward to our conversation!'],
            'good morning': ['Good morning! How are you today?', 'Good morning! Hope you\'re having a great day!'],
            'good afternoon': ['Good afternoon! How are you today?', 'Good afternoon! Hope you\'re having a great day!'],
            'good evening': ['Good evening! How are you today?', 'Good evening! Hope you\'re having a great day!'],
            'good night': ['Good night! Sleep well!', 'Good night! Sweet dreams!'],
            'goodnight': ['Good night! Sleep well!', 'Good night! Sweet dreams!'],
            'i love you': ['That\'s very sweet! I appreciate your kindness!', 'Thank you! You\'re very kind!'],
            'i hate you': ['I\'m sorry you feel that way. I\'m here to help if you need anything!', 'I understand you might be frustrated. How can I help?'],
            'you are stupid': ['I\'m sorry you feel that way. I\'m here to help if you need anything!', 'I understand you might be frustrated. How can I help?'],
            'you are dumb': ['I\'m sorry you feel that way. I\'m here to help if you need anything!', 'I understand you might be frustrated. How can I help?'],
            'math': ['I can help you with math problems! Try asking me to solve equations like "2+2" or "10*5" or "calculate 15/3"', 'I\'m Ven, and I love solving math problems! Just type any equation and I\'ll calculate it for you!'],
            'mathematics': ['I can help you with math problems! Try asking me to solve equations like "2+2" or "10*5" or "calculate 15/3"', 'I\'m Ven, and I love solving math problems! Just type any equation and I\'ll calculate it for you!'],
            'calculate': ['I can help you with calculations! Just type any mathematical expression and I\'ll solve it for you.', 'Sure! What would you like me to calculate?'],
            'solve': ['I can solve mathematical equations for you! Just type any expression and I\'ll calculate the answer.', 'I\'d be happy to help solve math problems! What equation do you have?'],
            'equation': ['I can solve equations! Just type any mathematical expression and I\'ll calculate the result.', 'I love solving equations! What would you like me to calculate?']
        };
        
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Handle Enter key and auto-resize textarea
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 200) + 'px';
            
            // Enable/disable send button based on content
            this.sendButton.disabled = !this.messageInput.value.trim();
        });
        
        // Focus on input when page loads
        this.messageInput.focus();
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get bot response (now async)
            const response = await this.getBotResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage("I'm sorry, I encountered an error while searching for information. Please try again.", 'bot');
        }
    }
    
    async getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for mathematical expressions first
        const mathResult = this.solveMathProblem(message);
        if (mathResult !== null) {
            return mathResult;
        }
        
        // Check for exact matches first
        for (const [key, responses] of Object.entries(this.responses)) {
            if (lowerMessage.includes(key)) {
                return this.getRandomResponse(responses);
            }
        }
        
        // If no predefined response, search for information
        return await this.searchForInformation(message);
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    solveMathProblem(message) {
        // Remove common words and clean the message
        const cleanMessage = message.toLowerCase()
            .replace(/what'?s?\s+/g, '')
            .replace(/what\s+is\s+/g, '')
            .replace(/solve\s+/g, '')
            .replace(/calculate\s+/g, '')
            .replace(/compute\s+/g, '')
            .replace(/find\s+/g, '')
            .replace(/the\s+answer\s+to\s+/g, '')
            .replace(/result\s+of\s+/g, '')
            .replace(/\?/g, '')
            .replace(/\./g, '')
            .trim();
        
        // Check if the message contains mathematical operators
        const hasMathOperators = /[\+\-\*\/\^\(\)]/.test(cleanMessage);
        if (!hasMathOperators) {
            return null;
        }
        
        try {
            // Extract mathematical expression
            let expression = cleanMessage;
            
            // Handle common mathematical words
            expression = expression
                .replace(/plus/g, '+')
                .replace(/minus/g, '-')
                .replace(/times/g, '*')
                .replace(/multiplied by/g, '*')
                .replace(/divided by/g, '/')
                .replace(/over/g, '/')
                .replace(/to the power of/g, '^')
                .replace(/squared/g, '^2')
                .replace(/cubed/g, '^3');
            
            // Remove any remaining words and keep only numbers, operators, and parentheses
            expression = expression.replace(/[^0-9\+\-\*\/\^\(\)\.]/g, '');
            
            if (expression.length === 0) {
                return null;
            }
            
            // Evaluate the expression safely
            const result = this.evaluateExpression(expression);
            
            if (result === null || isNaN(result) || !isFinite(result)) {
                return "I can't solve that mathematical expression. Please try a simpler equation.";
            }
            
            // Format the result
            let formattedResult = result;
            if (Number.isInteger(result)) {
                formattedResult = result.toString();
            } else {
                formattedResult = result.toFixed(2);
            }
            
            return `The answer is ${formattedResult}.`;
            
        } catch (error) {
            return "I'm sorry, I couldn't solve that mathematical problem. Please try a simpler equation.";
        }
    }
    
    evaluateExpression(expression) {
        try {
            // Replace ^ with ** for exponentiation
            expression = expression.replace(/\^/g, '**');
            
            // Use Function constructor to safely evaluate the expression
            const func = new Function('return ' + expression);
            const result = func();
            
            // Check for division by zero
            if (!isFinite(result)) {
                return null;
            }
            
            return result;
        } catch (error) {
            return null;
        }
    }
    
    async searchForInformation(query) {
        try {
            // Get comprehensive information from multiple sources
            const searchResults = await this.fetchComprehensiveInfo(query);
            
            if (searchResults.length === 0) {
                return "I couldn't find specific information about that. Could you try rephrasing your question?";
            }
            
            // Process and format the information
            return this.processAndFormatInfo(searchResults, query);
            
        } catch (error) {
            console.error('Search error:', error);
            return "I'm sorry, I couldn't search for that information right now. Please try again later.";
        }
    }
    
    async fetchComprehensiveInfo(query) {
        const results = [];
        
        try {
            // Get Wikipedia information
            const wikiInfo = await this.getWikipediaInfo(query);
            if (wikiInfo) {
                results.push({
                    source: 'Wikipedia',
                    content: wikiInfo,
                    color: '#4285f4'
                });
            }
            
            // Get news information
            const newsInfo = await this.getNewsInfo(query);
            if (newsInfo) {
                results.push({
                    source: 'News Sources',
                    content: newsInfo,
                    color: '#ff6b35'
                });
            }
            
            // Get general web information
            const webInfo = await this.getWebInfo(query);
            if (webInfo) {
                results.push({
                    source: 'Web Search',
                    content: webInfo,
                    color: '#10a37f'
                });
            }
            
        } catch (error) {
            console.error('Error fetching info:', error);
        }
        
        return results;
    }
    
    async getWikipediaInfo(query) {
        try {
            // Search Wikipedia API
            const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const response = await fetch(searchUrl);
            
            if (response.ok) {
                const data = await response.json();
                if (data.extract) {
                    // Clean and summarize the content
                    let content = data.extract;
                    if (content.length > 300) {
                        content = content.substring(0, 300) + '...';
                    }
                    return this.processContent(content);
                }
            }
        } catch (error) {
            console.error('Wikipedia error:', error);
        }
        return null;
    }
    
    async getNewsInfo(query) {
        try {
            // Simulate news API call (in real implementation, you'd use a news API)
            const newsData = this.getSimulatedNewsData(query);
            if (newsData) {
                return this.processContent(newsData);
            }
        } catch (error) {
            console.error('News error:', error);
        }
        return null;
    }
    
    async getWebInfo(query) {
        try {
            // Simulate web search results
            const webData = this.getSimulatedWebData(query);
            if (webData) {
                return this.processContent(webData);
            }
        } catch (error) {
            console.error('Web search error:', error);
        }
        return null;
    }
    
    getSimulatedNewsData(query) {
        const newsTopics = {
            'technology': 'Recent developments in technology include advancements in artificial intelligence, with major tech companies investing heavily in AI research. Companies like Google, Microsoft, and OpenAI are leading innovations in machine learning and natural language processing.',
            'weather': 'Current weather patterns show varying conditions across different regions. Climate change continues to impact global weather systems, with scientists reporting increased frequency of extreme weather events.',
            'politics': 'Political developments are ongoing with various policy changes and international relations being discussed. Governments worldwide are addressing economic challenges and social issues.',
            'sports': 'Sports news includes updates on major tournaments and athlete performances. Recent events have shown exceptional athletic achievements across various disciplines.',
            'health': 'Health news focuses on medical breakthroughs, public health initiatives, and wellness trends. Healthcare systems are adapting to new challenges and technologies.',
            'business': 'Business news covers market trends, corporate developments, and economic indicators. Companies are navigating changing market conditions and consumer demands.',
            'entertainment': 'Entertainment industry news includes film releases, music updates, and celebrity developments. Streaming platforms continue to dominate content consumption.',
            'science': 'Scientific discoveries and research findings are regularly reported. New studies contribute to our understanding of various fields including medicine, physics, and environmental science.'
        };
        
        for (const [topic, content] of Object.entries(newsTopics)) {
            if (query.toLowerCase().includes(topic)) {
                return content;
            }
        }
        
        return `Recent information about "${query}" shows ongoing developments and discussions in this area. Various sources are reporting on different aspects of this topic.`;
    }
    
    getSimulatedWebData(query) {
        const webTopics = {
            'how to': 'There are several approaches to this. The most effective method typically involves following established best practices and guidelines. Many experts recommend starting with the basics and gradually building up to more advanced techniques.',
            'what is': 'This refers to a concept or object that has specific characteristics and applications. It\'s commonly used in various contexts and has evolved over time to meet different needs and requirements.',
            'definition': 'This term is defined as having particular qualities and characteristics. It\'s used in specific contexts and has various interpretations depending on the field or application.',
            'history': 'The historical development of this topic spans several periods and involves various key figures and events. Understanding its evolution helps provide context for current applications and future developments.',
            'benefits': 'The advantages of this approach include improved efficiency, better outcomes, and enhanced user experience. These benefits have been demonstrated through various studies and practical applications.',
            'risks': 'Potential concerns include various factors that should be carefully considered. It\'s important to weigh these against the potential benefits and implement appropriate safeguards.',
            'comparison': 'When comparing different options, each has its own strengths and limitations. The best choice depends on specific requirements and circumstances.',
            'guide': 'A comprehensive approach involves several steps and considerations. Following a structured method typically leads to better results and outcomes.'
        };
        
        for (const [topic, content] of Object.entries(webTopics)) {
            if (query.toLowerCase().includes(topic)) {
                return content;
            }
        }
        
        return `Information about "${query}" is available from various sources. This topic has been discussed and analyzed by experts in the field, with different perspectives and approaches being considered.`;
    }
    
    processContent(content) {
        // Clean and format the content
        return content
            .replace(/\s+/g, ' ') // Remove extra whitespace
            .replace(/\[.*?\]/g, '') // Remove citations
            .trim();
    }
    
    processAndFormatInfo(results, query) {
        let response = `Based on my search for "${query}", here's what I found:\n\n`;
        
        results.forEach((result, index) => {
            response += `**${result.source}:**\n${result.content}\n\n`;
        });
        
        response += `This information has been compiled from multiple sources and processed for clarity.`;
        
        return response;
    }
    

    
    addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'bot') {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        } else {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = message;
        
        content.appendChild(messageText);
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(content);
        messageDiv.appendChild(messageWrapper);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        content.appendChild(typingIndicator);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(content);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${ampm}`;
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
}); 