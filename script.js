class Chatbot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        
        // Initialize responses as empty, will be loaded from JSON
        this.responses = {};
        
        // Enhanced knowledge base for accurate information
        this.knowledgeBase = {
            'sun': {
                type: 'star',
                description: 'The Sun is a star, not a planet. It is the star at the center of our Solar System, around which Earth and other planets orbit. The Sun is a massive ball of hydrogen and helium that produces energy through nuclear fusion, providing light and heat to Earth.',
                facts: [
                    'The Sun is about 93 million miles (150 million kilometers) from Earth',
                    'It is classified as a G-type main-sequence star (G2V)',
                    'The Sun contains 99.86% of the mass in our Solar System',
                    'It has a surface temperature of about 5,500°C (10,000°F)',
                    'The Sun is about 4.6 billion years old'
                ]
            },
            'earth': {
                type: 'planet',
                description: 'Earth is the third planet from the Sun and the only known planet to support life. It has a solid surface, liquid water, and an atmosphere that protects life from harmful radiation.',
                facts: [
                    'Earth is the fifth largest planet in our Solar System',
                    'It has one natural satellite - the Moon',
                    'Earth\'s atmosphere is 78% nitrogen and 21% oxygen',
                    'The planet is about 4.5 billion years old',
                    'Earth\'s surface is 71% water and 29% land'
                ]
            },
            'moon': {
                type: 'satellite',
                description: 'The Moon is Earth\'s only natural satellite. It orbits around Earth and is the fifth largest moon in our Solar System.',
                facts: [
                    'The Moon is about 238,855 miles (384,400 km) from Earth',
                    'It has no atmosphere and no liquid water',
                    'The Moon\'s surface is covered in craters from meteor impacts',
                    'It takes about 27.3 days to orbit Earth',
                    'The Moon is about 4.5 billion years old'
                ]
            },
            'mars': {
                type: 'planet',
                description: 'Mars is the fourth planet from the Sun, often called the "Red Planet" due to its reddish appearance caused by iron oxide on its surface.',
                facts: [
                    'Mars has two moons: Phobos and Deimos',
                    'It has the largest volcano in the Solar System - Olympus Mons',
                    'Mars has a thin atmosphere mostly made of carbon dioxide',
                    'A day on Mars is about 24 hours and 37 minutes',
                    'Mars has seasons like Earth due to its tilted axis'
                ]
            },
            'jupiter': {
                type: 'planet',
                description: 'Jupiter is the largest planet in our Solar System and the fifth planet from the Sun. It is a gas giant with no solid surface.',
                facts: [
                    'Jupiter has at least 79 moons',
                    'The Great Red Spot is a giant storm that has lasted for centuries',
                    'Jupiter is so massive that it could fit all other planets inside it',
                    'It has a strong magnetic field',
                    'Jupiter rotates faster than any other planet'
                ]
            },
            'saturn': {
                type: 'planet',
                description: 'Saturn is the sixth planet from the Sun and is famous for its spectacular ring system. It is the second largest planet in our Solar System.',
                facts: [
                    'Saturn has the most extensive ring system in the Solar System',
                    'It has at least 82 moons',
                    'Saturn\'s rings are made mostly of ice particles',
                    'The planet is less dense than water',
                    'Saturn\'s largest moon, Titan, is larger than Mercury'
                ]
            },
            'venus': {
                type: 'planet',
                description: 'Venus is the second planet from the Sun and is often called Earth\'s "sister planet" due to similar size and mass.',
                facts: [
                    'Venus is the hottest planet in our Solar System',
                    'It has a thick atmosphere of carbon dioxide',
                    'Venus rotates backwards compared to most planets',
                    'A day on Venus is longer than its year',
                    'Venus has no moons'
                ]
            },
            'mercury': {
                type: 'planet',
                description: 'Mercury is the smallest and innermost planet in our Solar System. It is the closest planet to the Sun.',
                facts: [
                    'Mercury has no moons',
                    'It has extreme temperature variations',
                    'Mercury has a very thin atmosphere',
                    'It is the fastest planet orbiting the Sun',
                    'Mercury has the most eccentric orbit of all planets'
                ]
            },
            'uranus': {
                type: 'planet',
                description: 'Uranus is the seventh planet from the Sun and is classified as an ice giant. It has a unique tilted axis.',
                facts: [
                    'Uranus rotates on its side with an axial tilt of 98 degrees',
                    'It has 27 known moons',
                    'Uranus has a faint ring system',
                    'The planet appears blue-green due to methane in its atmosphere',
                    'Uranus was the first planet discovered with a telescope'
                ]
            },
            'neptune': {
                type: 'planet',
                description: 'Neptune is the eighth and farthest known planet from the Sun. It is also an ice giant like Uranus.',
                facts: [
                    'Neptune has the strongest winds in the Solar System',
                    'It has 14 known moons',
                    'Neptune has a faint ring system',
                    'The planet appears blue due to methane in its atmosphere',
                    'Neptune was discovered through mathematical predictions'
                ]
            }
        };
        
        // User memory system for context
        this.userMemory = {
            name: null,
            age: null,
            location: null,
            preferences: {},
            facts: []
        };
        
        // Chat history for storage
        this.chatHistory = [];
        this.currentChatId = null;
        
        // init() will be called separately after construction
    }
    
    async init() {
        // Load responses from JSON file
        await this.loadResponses();
        
        // Load saved chat history and user memory
        this.loadFromStorage();
        
        // Initialize hamburger menu
        this.initHamburgerMenu();
        
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
        
        // Voice input functionality
        this.initVoiceInput();
        
        // New chat functionality
        this.initNewChat();
        
        // Focus on input when page loads
        this.messageInput.focus();
    }
    
    initHamburgerMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const chatInputArea = document.querySelector('.chat-input-area');
        
        if (hamburgerMenu && sidebar && mainContent) {
            hamburgerMenu.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                hamburgerMenu.classList.toggle('active');
                
                // Add overlay for mobile
                if (window.innerWidth <= 768) {
                    if (sidebar.classList.contains('open')) {
                        this.addOverlay();
                        // Hide chat input area when sidebar is open on mobile
                        if (chatInputArea) {
                            chatInputArea.style.display = 'none';
                        }
                    } else {
                        this.removeOverlay();
                        // Show chat input area when sidebar is closed on mobile
                        if (chatInputArea) {
                            chatInputArea.style.display = 'flex';
                        }
                    }
                }
            });
            
            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(e.target) && 
                    !hamburgerMenu.contains(e.target) &&
                    sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    hamburgerMenu.classList.remove('active');
                    this.removeOverlay();
                    // Show chat input area when sidebar is closed
                    if (chatInputArea) {
                        chatInputArea.style.display = 'flex';
                    }
                }
            });
        }
    }
    
    addOverlay() {
        if (!document.getElementById('sidebarOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'sidebarOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                cursor: pointer;
            `;
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('hamburgerMenu').classList.remove('active');
                this.removeOverlay();
            });
        }
    }
    
    removeOverlay() {
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    // Save chat history and user memory to browser storage
    saveToStorage() {
        try {
            const dataToSave = {
                chatHistory: this.chatHistory,
                userMemory: this.userMemory,
                currentChatId: this.currentChatId,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('chatbotData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }
    
    // Load chat history and user memory from browser storage
    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('chatbotData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Load user memory
                if (data.userMemory) {
                    this.userMemory = { ...this.userMemory, ...data.userMemory };
                }
                
                // Load chat history
                if (data.chatHistory && data.chatHistory.length > 0) {
                    this.chatHistory = data.chatHistory;
                    this.currentChatId = data.currentChatId || this.chatHistory[0]?.id;
                    
                    // Display the current chat
                    this.displayCurrentChat();
                    // Update sidebar with chat history
                    this.updateChatSidebar();
                } else {
                    // Start a new chat if no history exists
                    this.startNewChat();
                }
            } else {
                // Start a new chat if no saved data
                this.startNewChat();
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
            this.startNewChat();
        }
    }
    
    // Display the current chat messages
    displayCurrentChat() {
        if (!this.currentChatId) return;
        
        const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
        if (!currentChat) return;
        
        // Clear current display
        this.chatMessages.innerHTML = '';
        
        // Display all messages in the current chat
        currentChat.messages.forEach(message => {
            this.addMessage(message.text, message.sender, false); // false = don't save again
        });
        
        this.scrollToBottom();
    }
    
    async loadResponses() {
        try {
            console.log('Loading responses from JSON...');
            const response = await fetch('responses.json');
            if (!response.ok) {
                throw new Error('Failed to load responses.json');
            }
            const data = await response.json();
            console.log('JSON data loaded:', data);
            
            // Flatten all categories into a single responses object
            this.responses = {};
            for (const category in data) {
                for (const key in data[category]) {
                    this.responses[key] = data[category][key];
                }
            }
            console.log('Responses loaded:', Object.keys(this.responses).length, 'responses');
        } catch (error) {
            console.error('Error loading responses:', error);
            // Fallback to basic responses if JSON loading fails
            this.responses = {
                'hi': ['Hello! How are you today?'],
                'hello': ['Hello! How are you today?'],
                'help': ['I can help you with various tasks!'],
                'thanks': ['You\'re welcome!']
            };
        }
    }
    
    // Start a new chat
    startNewChat() {
        const newChatId = 'chat_' + Date.now();
        const newChat = {
            id: newChatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString()
        };
        
        this.chatHistory.unshift(newChat); // Add to beginning
        this.currentChatId = newChatId;
        
        // Clear the chat display
        this.chatMessages.innerHTML = '';
        
        // Add welcome message
        this.addMessage("Hello! I'm Ven, your AI assistant. How can I help you today?", 'bot');
        
        // Save to storage
        this.saveToStorage();
        
        // Update sidebar if it exists
        this.updateChatSidebar();
    }
    
    // Update the chat sidebar with current chats
    updateChatSidebar() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;
        
        chatList.innerHTML = '';
        
        this.chatHistory.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            if (chat.id === this.currentChatId) {
                chatItem.classList.add('active');
            }
            
            chatItem.innerHTML = `
                <div class="chat-item-content">
                    <div class="chat-title">${chat.title}</div>
                    <div class="chat-date">${new Date(chat.createdAt).toLocaleDateString()}</div>
                </div>
                <button class="delete-chat-btn" title="Delete chat">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            // Add click event for switching to chat
            const chatContent = chatItem.querySelector('.chat-item-content');
            chatContent.addEventListener('click', () => {
                this.switchToChat(chat.id);
            });
            
            // Add click event for delete button
            const deleteBtn = chatItem.querySelector('.delete-chat-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteChat(chat.id);
            });
            
            chatList.appendChild(chatItem);
        });
    }
    
    // Delete a chat
    deleteChat(chatId) {
        // Don't delete if it's the only chat
        if (this.chatHistory.length <= 1) {
            return;
        }
        
        // Find the chat to delete
        const chatIndex = this.chatHistory.findIndex(chat => chat.id === chatId);
        if (chatIndex === -1) return;
        
        // If we're deleting the current chat, switch to another chat first
        if (chatId === this.currentChatId) {
            // Switch to the next available chat, or the previous one if this is the last
            let newChatId;
            if (chatIndex === this.chatHistory.length - 1) {
                // This is the last chat, switch to the previous one
                newChatId = this.chatHistory[chatIndex - 1].id;
            } else {
                // Switch to the next chat
                newChatId = this.chatHistory[chatIndex + 1].id;
            }
            this.switchToChat(newChatId);
        }
        
        // Remove the chat from history
        this.chatHistory.splice(chatIndex, 1);
        
        // Save to storage
        this.saveToStorage();
        
        // Update the sidebar
        this.updateChatSidebar();
    }
    
    // Switch to a different chat
    switchToChat(chatId) {
        this.currentChatId = chatId;
        this.displayCurrentChat();
        this.updateChatSidebar();
        this.saveToStorage();
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
        
        // Check for translation requests first
        const translationResult = await this.handleTranslationRequest(message);
        if (translationResult) {
            return translationResult;
        }
        
        // Check for user memory/context updates
        const memoryResult = this.handleUserMemory(message);
        if (memoryResult) {
            return memoryResult;
        }
        
        // Check for Nahin searches first (highest priority)
        if (this.isNahinSearch(message)) {
            return this.getNahinInfo(message);
        }
        
        // Check knowledge base for accurate information
        const knowledgeResult = this.getKnowledgeBaseResponse(message);
        if (knowledgeResult) {
            return knowledgeResult;
        }
        
        // Check if this is a search query (contains question words or person queries)
        const isSearchQuery = lowerMessage.includes('who is') || 
                             lowerMessage.includes('who was') || 
                             lowerMessage.includes('what is') || 
                             lowerMessage.includes('what was') ||
                             lowerMessage.includes('tell me about') ||
                             lowerMessage.includes('search for') ||
                             lowerMessage.includes('information about') ||
                             lowerMessage.includes('how old') ||
                             lowerMessage.includes('how tall') ||
                             lowerMessage.includes('where is') ||
                             lowerMessage.includes('when was');
        
        // If it's a search query, skip generic responses and search directly
        if (isSearchQuery) {
            return await this.searchForInformation(message);
        }
        
        // Check for exact matches for generic responses (longer phrases first)
        console.log('Checking responses for:', lowerMessage);
        console.log('Available response keys:', Object.keys(this.responses));
        const sortedKeys = Object.keys(this.responses).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
            if (lowerMessage.includes(key)) {
                console.log('Found matching key:', key);
                return this.getRandomResponse(this.responses[key]);
            }
        }
        
        // If no predefined response, search for information online
        return await this.searchForInformation(message);
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    handleUserMemory(message) {
        const lowerMessage = message.toLowerCase();
        
        // Handle name updates
        if (lowerMessage.includes('my name is') || lowerMessage.includes('i\'m called') || lowerMessage.includes('call me')) {
            const nameMatch = message.match(/(?:my name is|i'm called|call me)\s+([a-zA-Z]+)/i);
            if (nameMatch) {
                this.userMemory.name = nameMatch[1];
                return `Nice to meet you, ${this.userMemory.name}! I'll remember your name.`;
            }
        }
        
        // Handle direct name responses (just a name) - but only if it's a reasonable name
        const cleanMessage = message.trim();
        if (/^[a-zA-Z]+$/.test(cleanMessage) && cleanMessage.length >= 2 && cleanMessage.length <= 20) {
            // Only treat as name if it's not a common word or command
            const commonWords = [
                'hi', 'hello', 'hey', 'bye', 'goodbye', 'thanks', 'thank', 'yes', 'no', 'ok', 'okay',
                'what', 'how', 'why', 'when', 'where', 'who', 'which', 'math', 'help', 'search',
                'translate', 'calculate', 'solve', 'find', 'tell', 'me', 'about', 'the', 'and', 'or',
                'but', 'for', 'with', 'from', 'to', 'in', 'on', 'at', 'by', 'of', 'a', 'an', 'is',
                'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
                'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'shall'
            ];
            
            if (!commonWords.includes(cleanMessage.toLowerCase())) {
                this.userMemory.name = cleanMessage;
            return `Nice to meet you, ${this.userMemory.name}! I'll remember your name.`;
            }
        }
        
        // Handle age updates
        if (lowerMessage.includes('i\'m') && lowerMessage.includes('years old') || lowerMessage.includes('i am') && lowerMessage.includes('years old')) {
            const ageMatch = message.match(/(?:i'm|i am)\s+(\d+)\s+years?\s+old/i);
            if (ageMatch) {
                this.userMemory.age = parseInt(ageMatch[1]);
                return `Got it! You're ${this.userMemory.age} years old.`;
            }
        }
        
        // Handle direct age responses (just a number)
        if (/^\d+$/.test(message.trim()) && parseInt(message.trim()) >= 1 && parseInt(message.trim()) <= 120) {
            this.userMemory.age = parseInt(message.trim());
            return `Got it! You're ${this.userMemory.age} years old.`;
        }
        
        // Handle location updates
        if (lowerMessage.includes('i live in') || lowerMessage.includes('i\'m from')) {
            const locationMatch = message.match(/(?:i live in|i'm from)\s+([a-zA-Z\s]+)/i);
            if (locationMatch) {
                this.userMemory.location = locationMatch[1].trim();
                return `I'll remember you live in ${this.userMemory.location}.`;
            }
        }
        
        // Handle preferences
        if (lowerMessage.includes('favorite color is') || lowerMessage.includes('love') && lowerMessage.includes('pizza')) {
            if (lowerMessage.includes('favorite color is')) {
                const colorMatch = message.match(/favorite color is\s+([a-zA-Z]+)/i);
                if (colorMatch) {
                    this.userMemory.preferences.color = colorMatch[1];
                    return `I'll remember your favorite color is ${this.userMemory.preferences.color}!`;
                }
            }
            if (lowerMessage.includes('love') && lowerMessage.includes('pizza')) {
                this.userMemory.preferences.food = 'pizza';
                return `I'll remember you love pizza!`;
            }
        }
        
        // Handle direct color responses (just a color name)
        const colorNames = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'brown', 'gray', 'grey', 'cyan', 'magenta', 'violet', 'indigo', 'teal', 'lime', 'navy', 'maroon', 'olive', 'silver', 'gold'];
        if (colorNames.includes(lowerMessage.trim())) {
            this.userMemory.preferences.color = lowerMessage.trim();
            return `I'll remember your favorite color is ${this.userMemory.preferences.color}!`;
        }
        
        // Handle memory queries
        if (lowerMessage.includes('what\'s my name') || lowerMessage.includes('what is my name') || lowerMessage.includes('my name')) {
            if (this.userMemory.name) {
                return `Your name is ${this.userMemory.name}!`;
            } else {
                return `I don't think you've told me your name yet. What should I call you?`;
            }
        }
        
        if (lowerMessage.includes('how old am i') || lowerMessage.includes('my age')) {
            if (this.userMemory.age) {
                return `You're ${this.userMemory.age} years old!`;
            } else {
                return `I don't think you've told me your age yet. How old are you?`;
            }
        }
        
        if (lowerMessage.includes('where do i live') || lowerMessage.includes('where am i from')) {
            if (this.userMemory.location) {
                return `You live in ${this.userMemory.location}!`;
            } else {
                return `I don't think you've told me where you live yet. Where are you from?`;
            }
        }
        
        if (lowerMessage.includes('favorite color') || lowerMessage.includes('my favorite color')) {
            if (this.userMemory.preferences.color) {
                return `Your favorite color is ${this.userMemory.preferences.color}!`;
            } else {
                return `I don't think you've told me your favorite color yet. What is it?`;
            }
        }
        
        if (lowerMessage.includes('what do i love') || lowerMessage.includes('what do i like')) {
            const likes = [];
            if (this.userMemory.preferences.food) {
                likes.push(this.userMemory.preferences.food);
            }
            if (likes.length > 0) {
                return `You love ${likes.join(' and ')}!`;
            } else {
                return `I don't think you've told me what you love yet. What do you like?`;
            }
        }
        
        return null;
    }
    
    getKnowledgeBaseResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check if the message contains any terms from our knowledge base
        for (const [term, info] of Object.entries(this.knowledgeBase)) {
            if (lowerMessage.includes(term)) {
                let response = info.description + '\n\n';
                response += 'Key facts:\n';
                info.facts.forEach((fact, index) => {
                    response += `• ${fact}\n`;
                });
                return response;
            }
        }
        
        // Check for specific questions about celestial bodies
        if (lowerMessage.includes('sun') || lowerMessage.includes('star')) {
            const sunInfo = this.knowledgeBase.sun;
            let response = sunInfo.description + '\n\n';
            response += 'Key facts:\n';
            sunInfo.facts.forEach(fact => {
                response += `• ${fact}\n`;
            });
            return response;
        }
        
        if (lowerMessage.includes('earth') || lowerMessage.includes('planet')) {
            const earthInfo = this.knowledgeBase.earth;
            let response = earthInfo.description + '\n\n';
            response += 'Key facts:\n';
            earthInfo.facts.forEach(fact => {
                response += `• ${fact}\n`;
            });
            return response;
        }
        
        if (lowerMessage.includes('moon')) {
            const moonInfo = this.knowledgeBase.moon;
            let response = moonInfo.description + '\n\n';
            response += 'Key facts:\n';
            moonInfo.facts.forEach(fact => {
                response += `• ${fact}\n`;
            });
            return response;
        }
        
        return null;
    }
    
    async handleTranslationRequest(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check if this is a translation request
        const translationKeywords = [
            'translate', 'translation', 'in spanish', 'to spanish', 'en español',
            'in french', 'to french', 'en français', 'in german', 'to german',
            'in italian', 'to italian', 'in portuguese', 'to portuguese',
            'in chinese', 'to chinese', 'in japanese', 'to japanese',
            'in korean', 'to korean', 'in russian', 'to russian',
            'in arabic', 'to arabic', 'in hindi', 'to hindi',
            'in bengali', 'to bengali', 'in bangla', 'to bangla',
            'in urdu', 'to urdu', 'in punjabi', 'to punjabi',
            'in gujarati', 'to gujarati', 'in marathi', 'to marathi',
            'in tamil', 'to tamil', 'in telugu', 'to telugu',
            'in kannada', 'to kannada', 'in malayalam', 'to malayalam',
            'in nepali', 'to nepali', 'in sinhala', 'to sinhala',
            'in dutch', 'to dutch', 'in swedish', 'to swedish',
            'in norwegian', 'to norwegian', 'in danish', 'to danish',
            'in finnish', 'to finnish', 'in polish', 'to polish',
            'in czech', 'to czech', 'in hungarian', 'to hungarian',
            'in romanian', 'to romanian', 'in bulgarian', 'to bulgarian',
            'in greek', 'to greek', 'in turkish', 'to turkish',
            'in thai', 'to thai', 'in vietnamese', 'to vietnamese',
            'in indonesian', 'to indonesian', 'in malay', 'to malay',
            'in ukrainian', 'to ukrainian', 'in belarusian', 'to belarusian',
            'in slovak', 'to slovak', 'in slovenian', 'to slovenian',
            'in croatian', 'to croatian', 'in serbian', 'to serbian',
            'in macedonian', 'to macedonian', 'in albanian', 'to albanian',
            'in estonian', 'to estonian', 'in latvian', 'to latvian',
            'in lithuanian', 'to lithuanian', 'in icelandic', 'to icelandic',
            'in irish', 'to irish', 'in welsh', 'to welsh',
            'in breton', 'to breton', 'in catalan', 'to catalan',
            'in galician', 'to galician', 'in basque', 'to basque'
        ];
        
        const hasTranslationKeyword = translationKeywords.some(keyword => 
            lowerMessage.includes(keyword)
        );
        
        if (!hasTranslationKeyword) {
            return null;
        }
        
        // Extract the text to translate
        let textToTranslate = '';
        let targetLanguage = '';
        
        // Handle different translation request formats
        if (lowerMessage.includes('translate')) {
            // Format: "translate [text] to [language]"
            const translateMatch = message.match(/translate\s+(.+?)\s+to\s+(\w+)/i);
            if (translateMatch) {
                textToTranslate = translateMatch[1].trim();
                targetLanguage = translateMatch[2].toLowerCase();
            } else {
                // Format: "translate [text] in [language]"
                const translateInMatch = message.match(/translate\s+(.+?)\s+in\s+(\w+)/i);
                if (translateInMatch) {
                    textToTranslate = translateInMatch[1].trim();
                    targetLanguage = translateInMatch[2].toLowerCase();
                }
            }
        } else {
            // Format: "[text] in [language]" or "[text] to [language]"
            const inMatch = message.match(/(.+?)\s+in\s+(\w+)/i);
            if (inMatch) {
                textToTranslate = inMatch[1].trim();
                targetLanguage = inMatch[2].toLowerCase();
            } else {
                const toMatch = message.match(/(.+?)\s+to\s+(\w+)/i);
                if (toMatch) {
                    textToTranslate = toMatch[1].trim();
                    targetLanguage = toMatch[2].toLowerCase();
                }
            }
        }
        
        if (!textToTranslate || !targetLanguage) {
            return "I can help you translate! Please use formats like:\n• 'translate hello to spanish'\n• 'i love you in spanish'\n• 'translate thank you to french'\n\nI support many languages including Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Russian, Arabic, Hindi, Bengali, Urdu, Punjabi, Tamil, Telugu, and many more!";
        }
        
        // Get the translation
        return await this.getTranslation(textToTranslate, targetLanguage);
    }
    
    async getTranslation(text, targetLanguage) {
        try {
            // Use Google Translate API (free tier)
            const response = await this.translateWithGoogleAPI(text, targetLanguage);
            if (response) {
                return `"${text}" in ${targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)}: ${response}`;
            }
        } catch (error) {
            console.error('Google Translate API error:', error);
        }
        
        // Fallback to LibreTranslate (free and open source)
        try {
            const response = await this.translateWithLibreTranslate(text, targetLanguage);
            if (response) {
                return `"${text}" in ${targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)}: ${response}`;
            }
        } catch (error) {
            console.error('LibreTranslate error:', error);
        }
        
        // Final fallback to MyMemory API (free)
        try {
            const response = await this.translateWithMyMemory(text, targetLanguage);
            if (response) {
                return `"${text}" in ${targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1)}: ${response}`;
            }
        } catch (error) {
            console.error('MyMemory API error:', error);
        }
        
        return `Sorry, I couldn't translate "${text}" to ${targetLanguage}. Please try again or check your internet connection.`;
    }
    
    async translateWithGoogleAPI(text, targetLanguage) {
        // Google Translate API (requires API key, but we'll use a proxy approach)
        const languageMap = {
            'spanish': 'es',
            'french': 'fr', 
            'german': 'de',
            'italian': 'it',
            'portuguese': 'pt',
            'chinese': 'zh',
            'japanese': 'ja',
            'korean': 'ko',
            'russian': 'ru',
            'arabic': 'ar',
            'hindi': 'hi',
            'bengali': 'bn',
            'bangla': 'bn',
            'urdu': 'ur',
            'punjabi': 'pa',
            'gujarati': 'gu',
            'marathi': 'mr',
            'tamil': 'ta',
            'telugu': 'te',
            'kannada': 'kn',
            'malayalam': 'ml',
            'nepali': 'ne',
            'sinhala': 'si',
            'dutch': 'nl',
            'swedish': 'sv',
            'norwegian': 'no',
            'danish': 'da',
            'finnish': 'fi',
            'polish': 'pl',
            'czech': 'cs',
            'hungarian': 'hu',
            'romanian': 'ro',
            'bulgarian': 'bg',
            'greek': 'el',
            'turkish': 'tr',
            'thai': 'th',
            'vietnamese': 'vi',
            'indonesian': 'id',
            'malay': 'ms',
            'filipino': 'tl',
            'ukrainian': 'uk',
            'belarusian': 'be',
            'slovak': 'sk',
            'slovenian': 'sl',
            'croatian': 'hr',
            'serbian': 'sr',
            'macedonian': 'mk',
            'albanian': 'sq',
            'estonian': 'et',
            'latvian': 'lv',
            'lithuanian': 'lt',
            'icelandic': 'is',
            'irish': 'ga',
            'welsh': 'cy',
            'breton': 'br',
            'catalan': 'ca',
            'galician': 'gl',
            'basque': 'eu'
        };
        
        const targetLang = languageMap[targetLanguage.toLowerCase()];
        if (!targetLang) {
            throw new Error(`Unsupported language: ${targetLanguage}`);
        }
        
        // Use a free Google Translate proxy
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Google Translate API request failed');
        }
        
        const data = await response.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }
        
        throw new Error('Invalid response from Google Translate');
    }
    
    async translateWithLibreTranslate(text, targetLanguage) {
        const languageMap = {
            'spanish': 'es',
            'french': 'fr',
            'german': 'de', 
            'italian': 'it',
            'portuguese': 'pt',
            'chinese': 'zh',
            'japanese': 'ja',
            'korean': 'ko',
            'russian': 'ru',
            'arabic': 'ar',
            'hindi': 'hi',
            'bengali': 'bn',
            'bangla': 'bn',
            'urdu': 'ur',
            'punjabi': 'pa',
            'gujarati': 'gu',
            'marathi': 'mr',
            'tamil': 'ta',
            'telugu': 'te',
            'kannada': 'kn',
            'malayalam': 'ml',
            'nepali': 'ne',
            'sinhala': 'si',
            'dutch': 'nl',
            'swedish': 'sv',
            'norwegian': 'no',
            'danish': 'da',
            'finnish': 'fi',
            'polish': 'pl',
            'czech': 'cs',
            'hungarian': 'hu',
            'romanian': 'ro',
            'bulgarian': 'bg',
            'greek': 'el',
            'turkish': 'tr',
            'thai': 'th',
            'vietnamese': 'vi',
            'indonesian': 'id',
            'malay': 'ms',
            'ukrainian': 'uk',
            'belarusian': 'be',
            'slovak': 'sk',
            'slovenian': 'sl',
            'croatian': 'hr',
            'serbian': 'sr',
            'macedonian': 'mk',
            'albanian': 'sq',
            'estonian': 'et',
            'latvian': 'lv',
            'lithuanian': 'lt',
            'icelandic': 'is',
            'irish': 'ga',
            'welsh': 'cy',
            'breton': 'br',
            'catalan': 'ca',
            'galician': 'gl',
            'basque': 'eu'
        };
        
        const targetLang = languageMap[targetLanguage.toLowerCase()];
        if (!targetLang) {
            throw new Error(`Unsupported language: ${targetLanguage}`);
        }
        
        // Use LibreTranslate public API
        const url = 'https://libretranslate.de/translate';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: targetLang
            })
        });
        
        if (!response.ok) {
            throw new Error('LibreTranslate API request failed');
        }
        
        const data = await response.json();
        if (data && data.translatedText) {
            return data.translatedText;
        }
        
        throw new Error('Invalid response from LibreTranslate');
    }
    
    async translateWithMyMemory(text, targetLanguage) {
        const languageMap = {
            'spanish': 'es',
            'french': 'fr',
            'german': 'de',
            'italian': 'it', 
            'portuguese': 'pt',
            'chinese': 'zh',
            'japanese': 'ja',
            'korean': 'ko',
            'russian': 'ru',
            'arabic': 'ar',
            'hindi': 'hi',
            'bengali': 'bn',
            'bangla': 'bn',
            'urdu': 'ur',
            'punjabi': 'pa',
            'gujarati': 'gu',
            'marathi': 'mr',
            'tamil': 'ta',
            'telugu': 'te',
            'kannada': 'kn',
            'malayalam': 'ml',
            'nepali': 'ne',
            'sinhala': 'si',
            'dutch': 'nl',
            'swedish': 'sv',
            'norwegian': 'no',
            'danish': 'da',
            'finnish': 'fi',
            'polish': 'pl',
            'czech': 'cs',
            'hungarian': 'hu',
            'romanian': 'ro',
            'bulgarian': 'bg',
            'greek': 'el',
            'turkish': 'tr',
            'thai': 'th',
            'vietnamese': 'vi',
            'indonesian': 'id',
            'malay': 'ms',
            'ukrainian': 'uk',
            'belarusian': 'be',
            'slovak': 'sk',
            'slovenian': 'sl',
            'croatian': 'hr',
            'serbian': 'sr',
            'macedonian': 'mk',
            'albanian': 'sq',
            'estonian': 'et',
            'latvian': 'lv',
            'lithuanian': 'lt',
            'icelandic': 'is',
            'irish': 'ga',
            'welsh': 'cy',
            'breton': 'br',
            'catalan': 'ca',
            'galician': 'gl',
            'basque': 'eu'
        };
        
        const targetLang = languageMap[targetLanguage.toLowerCase()];
        if (!targetLang) {
            throw new Error(`Unsupported language: ${targetLanguage}`);
        }
        
        // Use MyMemory API (free, no API key required)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('MyMemory API request failed');
        }
        
        const data = await response.json();
        if (data && data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        }
        
        throw new Error('Invalid response from MyMemory API');
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
            const lowerQuery = query.toLowerCase();
            
            // Special case for Nahin Bin Monir searches
            if (this.isNahinSearch(query)) {
                return this.getNahinInfo(query);
            }
            
            // Check if this is a query that should go directly to Google search
            if (this.shouldUseGoogleSearch(query)) {
                const googleResults = await this.getGoogleSearchResults(query);
                if (googleResults && googleResults.length > 0) {
                    return this.createGoogleSearchResponse(googleResults, query);
                }
            }
            
            // First, try Wikipedia (most reliable)
            const wikiInfo = await this.getWikipediaInfo(query);
            
            if (wikiInfo) {
                // If Wikipedia has info, use it as primary source
                return this.createCleanResponse([wikiInfo], query);
            }
            
            // If Wikipedia doesn't have info, try Google search
            const googleResults = await this.getGoogleSearchResults(query);
            if (googleResults && googleResults.length > 0) {
                return this.createGoogleSearchResponse(googleResults, query);
            }
            
            // If no information found anywhere
            return this.getHelpfulNoResultsResponse(query);
            
        } catch (error) {
            console.error('Search error:', error);
            return "I'm sorry, I couldn't find information about that right now. Please try again.";
        }
    }
    
    isNahinSearch(query) {
        const lowerQuery = query.toLowerCase();
        const nahinTerms = [
            'nahin',
            'nahin bin monir',
            'nahin bin',
            'bin monir',
            'nahin monir'
        ];
        
        // Check if any Nahin term is in the query
        const hasNahinTerm = nahinTerms.some(term => lowerQuery.includes(term));
        
        // Also check for queries that might be about Nahin even without the full name
        const nahinRelatedQueries = [
            'how old is nahin',
            'nahin age',
            'nahin birthday',
            'nahin work',
            'nahin job',
            'nahin career',
            'nahin university',
            'nahin education',
            'nahin projects',
            'nahin blog',
            'nahin contact',
            'nahin email'
        ];
        
        const isNahinRelated = nahinRelatedQueries.some(term => lowerQuery.includes(term));
        
        return hasNahinTerm || isNahinRelated;
    }
    
    getNahinInfo(query) {
        const lowerQuery = query.toLowerCase();
        
        // Provide comprehensive information about Nahin Bin Monir
        let response = '';
        
        // Basic information
        response += "Nahin Bin Monir is a software developer and technology enthusiast. He is passionate about web development, artificial intelligence, and creating innovative solutions. ";
        
        // Add specific information based on the query
        if (lowerQuery.includes('age') || lowerQuery.includes('birthday') || lowerQuery.includes('born')) {
            response += "He is a young professional in the tech industry, focused on building modern web applications and exploring cutting-edge technologies. ";
        }
        
        if (lowerQuery.includes('work') || lowerQuery.includes('job') || lowerQuery.includes('career') || lowerQuery.includes('profession')) {
            response += "He works as a software developer, specializing in web development and modern technologies. His work involves creating user-friendly applications and exploring new programming paradigms. ";
        }
        
        if (lowerQuery.includes('university') || lowerQuery.includes('uni') || lowerQuery.includes('education') || lowerQuery.includes('study')) {
            response += "He has a strong educational background in computer science and technology, with a focus on practical application of programming concepts. ";
        }
        
        if (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('development')) {
            response += "His projects include web applications, AI integrations, and various software solutions. He maintains an active portfolio showcasing his technical skills and creative problem-solving abilities. ";
        }
        
        if (lowerQuery.includes('blog') || lowerQuery.includes('writing') || lowerQuery.includes('article')) {
            response += "He shares his knowledge and experiences through his blog, covering topics like web development, technology trends, and programming insights. ";
        }
        
        if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('reach')) {
            response += "You can find more information about his work, projects, and contact details on his personal website. ";
        }
        
        // Add general information if no specific query
        if (response.length < 200) {
            response += "He is dedicated to continuous learning and staying updated with the latest technology trends. His approach combines technical expertise with creative problem-solving to deliver effective solutions. ";
        }
        
        return response;
    }
    
    shouldUseGoogleSearch(query) {
        const lowerQuery = query.toLowerCase();
        
        // Queries that should go directly to Google search
        return lowerQuery.includes('how to') ||
               lowerQuery.includes('recipe') ||
               lowerQuery.includes('cooking') ||
               lowerQuery.includes('weather') ||
               lowerQuery.includes('forecast') ||
               lowerQuery.includes('price') ||
               lowerQuery.includes('cost') ||
               lowerQuery.includes('near me') ||
               lowerQuery.includes('location') ||
               lowerQuery.includes('restaurant') ||
               lowerQuery.includes('hotel') ||
               lowerQuery.includes('store') ||
               lowerQuery.includes('shop') ||
               lowerQuery.includes('buy') ||
               lowerQuery.includes('sell') ||
               lowerQuery.includes('schedule') ||
               lowerQuery.includes('hours') ||
               lowerQuery.includes('phone number') ||
               lowerQuery.includes('contact') ||
               lowerQuery.includes('address');
    }
    
    async getGoogleSearchResults(query) {
        try {
            // Simulate Google search results for topics not in Wikipedia
            const searchResults = this.getGoogleSearchResultsForQuery(query);
            if (searchResults && searchResults.length > 0) {
                return searchResults;
            }
        } catch (error) {
            console.error('Google search error:', error);
        }
        return null;
    }
    
    getGoogleSearchResultsForQuery(query) {
        const lowerQuery = query.toLowerCase();
        const cleanQuery = query.replace(/who is|who was|what is|tell me about/gi, '').trim();
        
        // Provide Google search results for various topics not typically in Wikipedia
        if (lowerQuery.includes('how to')) {
            return [
                {
                    title: `How to ${cleanQuery} - Complete Guide`,
                    content: `There are several effective approaches to ${cleanQuery}. The most successful method typically involves following established best practices and guidelines. Many experts recommend starting with the basics and gradually building up to more advanced techniques. The key is to practice consistently and learn from each attempt.`,
                    source: 'How-to Guide'
                }
            ];
        }
        
        if (lowerQuery.includes('recipe') || lowerQuery.includes('cooking')) {
            return [
                {
                    title: `${cleanQuery} Recipe - Step by Step Instructions`,
                    content: `To make ${cleanQuery}, you'll need quality ingredients and proper technique. The recipe involves several steps that should be followed carefully. Many variations exist, and you can adapt based on available ingredients and personal preferences.`,
                    source: 'Cooking Guide'
                }
            ];
        }
        
        if (lowerQuery.includes('weather') || lowerQuery.includes('forecast')) {
            return [
                {
                    title: `Current Weather and Forecast for ${cleanQuery}`,
                    content: `Weather conditions for ${cleanQuery} vary by season and location. Current forecasts show typical patterns for this time of year. For the most accurate and up-to-date weather information, check local weather services or weather apps.`,
                    source: 'Weather Service'
                }
            ];
        }
        
        if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
            return [
                {
                    title: `${cleanQuery} - Current Prices and Costs`,
                    content: `The price of ${cleanQuery} varies depending on factors like quality, location, and market conditions. Current market prices fluctuate regularly, so it's best to check multiple sources for the most accurate and up-to-date pricing information.`,
                    source: 'Price Guide'
                }
            ];
        }
        
        if (lowerQuery.includes('near me') || lowerQuery.includes('location')) {
            return [
                {
                    title: `${cleanQuery} - Find Locations Near You`,
                    content: `To find ${cleanQuery} near your location, you can use local search services, maps, or directory listings. The availability and options will depend on your specific area and current business listings.`,
                    source: 'Local Search'
                }
            ];
        }
        
        if (lowerQuery.includes('restaurant') || lowerQuery.includes('food')) {
            return [
                {
                    title: `${cleanQuery} - Restaurant Reviews and Information`,
                    content: `Information about ${cleanQuery} restaurants includes reviews, menus, locations, and hours. Popular options vary by area, and many restaurants offer online ordering and delivery services.`,
                    source: 'Restaurant Guide'
                }
            ];
        }
        
        if (lowerQuery.includes('hotel') || lowerQuery.includes('accommodation')) {
            return [
                {
                    title: `${cleanQuery} - Hotel and Accommodation Options`,
                    content: `Accommodation options for ${cleanQuery} include hotels, motels, and alternative lodging. Prices and availability vary by season and location. Booking in advance is recommended for the best rates and availability.`,
                    source: 'Travel Guide'
                }
            ];
        }
        
        if (lowerQuery.includes('store') || lowerQuery.includes('shop')) {
            return [
                {
                    title: `${cleanQuery} - Store Locations and Information`,
                    content: `Store information for ${cleanQuery} includes locations, hours, contact details, and available products or services. Many stores offer online shopping and delivery options for convenience.`,
                    source: 'Store Directory'
                }
            ];
        }
        
        if (lowerQuery.includes('schedule') || lowerQuery.includes('hours')) {
            return [
                {
                    title: `${cleanQuery} - Schedule and Operating Hours`,
                    content: `Schedule and hours for ${cleanQuery} vary by location and day of the week. It's best to check directly with the specific location for the most accurate and up-to-date information.`,
                    source: 'Business Directory'
                }
            ];
        }
        
        if (lowerQuery.includes('phone number') || lowerQuery.includes('contact')) {
            return [
                {
                    title: `${cleanQuery} - Contact Information`,
                    content: `Contact information for ${cleanQuery} includes phone numbers, email addresses, and physical addresses. For the most current contact details, check their official website or directory listings.`,
                    source: 'Contact Directory'
                }
            ];
        }
        
        // For scientific or educational queries, provide more helpful responses
        if (lowerQuery.includes('planet') || lowerQuery.includes('star') || lowerQuery.includes('galaxy') || 
            lowerQuery.includes('solar system') || lowerQuery.includes('universe') || lowerQuery.includes('space')) {
            return [
                {
                    title: `${cleanQuery} - Scientific Information`,
                    content: `I have accurate information about many celestial bodies in my knowledge base. For ${cleanQuery}, I can provide scientific facts about planets, stars, and other astronomical objects. If you're asking about a specific celestial body, try asking about the Sun, Earth, Moon, Mars, Jupiter, Saturn, Venus, Mercury, Uranus, or Neptune for detailed information.`,
                    source: 'Scientific Database'
                }
            ];
        }
        
        // Generic search results for other topics
        return [
            {
                title: `${cleanQuery} - Information and Resources`,
                content: `I don't have specific information about "${cleanQuery}" in my knowledge base, but this topic is likely covered by various sources online. For the most current and detailed information, I recommend checking reliable websites, educational resources, or specialized databases related to this subject.`,
                source: 'Web Search'
            }
        ];
    }
    
    createGoogleSearchResponse(googleResults, query) {
        let response = '';
        
        // Combine information from multiple search results
        googleResults.forEach((result, index) => {
            if (index > 0) response += '\n\n';
            response += this.cleanContent(result.content);
        });
        
        // Limit total length
        if (response.length > 600) {
            response = response.substring(0, 600) + '...';
        }
        
        return response;
    }
    
    createCleanResponse(results, query) {
        const wikiResult = results.find(r => r.source === 'Wikipedia');
        const newsResult = results.find(r => r.source === 'News');
        const webResult = results.find(r => r.source === 'Web');
        
        let response = '';
        
        // Start with Wikipedia content (most reliable)
        if (wikiResult) {
            response += this.cleanContent(wikiResult.content);
        }
        
        // Add news if available and relevant
        if (newsResult && newsResult.content) {
            if (response) response += '\n\n';
            response += this.cleanContent(newsResult.content);
        }
        
        // Add web info if available and not redundant
        if (webResult && webResult.content && !response.includes(webResult.content.substring(0, 50))) {
            if (response) response += '\n\n';
            response += this.cleanContent(webResult.content);
        }
        
        // Limit total length
        if (response.length > 800) {
            response = response.substring(0, 800) + '...';
        }
        
        return response;
    }
    
    cleanContent(content) {
        return content
            .replace(/\[.*?\]/g, '') // Remove citations
            .replace(/\s+/g, ' ') // Remove extra whitespace
            .replace(/^[•\-\*]\s*/gm, '') // Remove bullet points
            .trim();
    }
    
    async getWikipediaInfo(query) {
        try {
            // Clean the query for better search results
            let cleanQuery = query.toLowerCase()
                .replace(/who is|who was|what is|tell me about/gi, '')
                .trim();
            
            // First, try direct search for the page
            const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
            const response = await fetch(searchUrl);
            
            if (response.ok) {
                const data = await response.json();
                if (data.extract && !data.extract.includes('disambiguation')) {
                    // Verify this result is actually relevant to the query
                    if (this.isRelevantWikipediaResult(data.title, cleanQuery)) {
                        return {
                            source: 'Wikipedia',
                            content: data.extract,
                            url: data.content_urls?.desktop?.page || null
                        };
                    }
                }
            }
            
            // If direct search fails or returns irrelevant result, try a broader search
            const searchApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(cleanQuery)}&srlimit=5&origin=*`;
            const searchResponse = await fetch(searchApiUrl);
            
            if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                if (searchData.query?.search?.length > 0) {
                    // Find the best match that's actually relevant
                    const bestMatch = searchData.query.search.find(page => 
                        !page.title.includes('disambiguation') && 
                        !page.title.includes('list of') &&
                        this.isRelevantWikipediaResult(page.title, cleanQuery)
                    );
                    
                    if (bestMatch) {
                        const pageTitle = bestMatch.title;
                        const pageUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
                        const pageResponse = await fetch(pageUrl);
                        
                        if (pageResponse.ok) {
                            const pageData = await pageResponse.json();
                            if (pageData.extract && !pageData.extract.includes('disambiguation')) {
                                return {
                                    source: 'Wikipedia',
                                    content: pageData.extract,
                                    url: pageData.content_urls?.desktop?.page || null
                                };
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Wikipedia error:', error);
        }
        return null;
    }
    
    isRelevantWikipediaResult(title, query) {
        const titleLower = title.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // For person queries, check if the title actually matches the person's name
        if (queryLower.includes(' ') && queryLower.split(' ').length >= 2) {
            // This is likely a person query
            const queryWords = queryLower.split(' ').filter(word => word.length > 2);
            const titleWords = titleLower.split(' ');
            
            // Check if at least 2 words from the query are in the title
            const matchingWords = queryWords.filter(word => 
                titleWords.some(titleWord => titleWord.includes(word))
            );
            
            return matchingWords.length >= 2;
        }
        
        // For single word queries, check for exact or close matches
        if (titleLower.includes(queryLower) || queryLower.includes(titleLower.split(' ')[0])) {
            return true;
        }
        
        return false;
    }
    
    async getNewsInfo(query) {
        try {
            const cleanQuery = query.replace(/who is|who was|what is|tell me about/gi, '').trim();
            
            // Simulate news search with relevant content
            const newsContent = this.getRelevantNewsContent(cleanQuery);
            if (newsContent) {
                return {
                    source: 'News',
                    content: newsContent
                };
            }
        } catch (error) {
            console.error('News error:', error);
        }
        return null;
    }
    
    getRelevantNewsContent(query) {
        const lowerQuery = query.toLowerCase();
        
        // Provide relevant news content based on query type
        if (lowerQuery.includes('elon musk')) {
            return "Recent news about Elon Musk includes updates on Tesla's production, SpaceX missions, and developments with X (formerly Twitter). He continues to be active in electric vehicles, space exploration, and artificial intelligence.";
        }
        
        if (lowerQuery.includes('bill gates')) {
            return "Recent news about Bill Gates focuses on his philanthropic work through the Bill & Melinda Gates Foundation, climate change initiatives, and his continued influence in global health and education.";
        }
        
        if (lowerQuery.includes('sky') || lowerQuery.includes('weather')) {
            return "Current weather patterns and sky conditions vary by region. Recent meteorological studies continue to advance our understanding of atmospheric phenomena and climate patterns.";
        }
        
        if (lowerQuery.includes('technology') || lowerQuery.includes('ai')) {
            return "Recent developments in technology include advancements in artificial intelligence, with major companies investing heavily in AI research and development.";
        }
        
        return null;
    }
    
    async getWebInfo(query) {
        try {
            const cleanQuery = query.replace(/who is|who was|what is|tell me about/gi, '').trim();
            
            // Provide additional web information
            const webContent = this.getAdditionalWebInfo(cleanQuery);
            if (webContent) {
                return {
                    source: 'Web',
                    content: webContent
                };
            }
        } catch (error) {
            console.error('Web info error:', error);
        }
        return null;
    }
    
    getAdditionalWebInfo(query) {
        const lowerQuery = query.toLowerCase();
        
        // Provide additional context based on query
        if (lowerQuery.includes('elon musk')) {
            return "Elon Musk is known for his ambitious goals in electric vehicles, space exploration, and neural technology. His companies Tesla, SpaceX, and Neuralink represent his vision for sustainable energy, interplanetary travel, and brain-computer interfaces.";
        }
        
        if (lowerQuery.includes('sky')) {
            return "The sky's appearance changes throughout the day and night, from the blue of daytime to the stars and planets visible at night. Atmospheric conditions, pollution, and weather all affect how we perceive the sky.";
        }
        
        if (lowerQuery.includes('technology')) {
            return "Technology continues to evolve rapidly, with new innovations in computing, communication, and automation reshaping how we live and work.";
        }
        
        return null;
    }
    
    getHelpfulNoResultsResponse(query) {
        const cleanQuery = query.replace(/who is|who was|what is|tell me about/gi, '').trim();
        
        if (query.toLowerCase().includes('who is') || query.toLowerCase().includes('who was')) {
            return `I don't have specific information about ${cleanQuery} in my knowledge base. This could be because:\n\n• The person might not have a Wikipedia page\n• The name might be spelled differently\n• It might be a very recent or local figure\n\nYou could try searching for alternative spellings or checking social media profiles for more current information.`;
        }
        
        if (query.toLowerCase().includes('what is')) {
            // Check if it might be a scientific term we can help with
            if (cleanQuery.toLowerCase().includes('planet') || cleanQuery.toLowerCase().includes('star') || 
                cleanQuery.toLowerCase().includes('sun') || cleanQuery.toLowerCase().includes('moon') ||
                cleanQuery.toLowerCase().includes('earth') || cleanQuery.toLowerCase().includes('mars') ||
                cleanQuery.toLowerCase().includes('jupiter') || cleanQuery.toLowerCase().includes('saturn') ||
                cleanQuery.toLowerCase().includes('venus') || cleanQuery.toLowerCase().includes('mercury') ||
                cleanQuery.toLowerCase().includes('uranus') || cleanQuery.toLowerCase().includes('neptune')) {
                return `I have accurate information about many celestial bodies! Try asking about specific planets or stars like the Sun, Earth, Moon, Mars, Jupiter, Saturn, Venus, Mercury, Uranus, or Neptune for detailed scientific facts.`;
            }
            
            return `I don't have a clear definition for "${cleanQuery}" in my knowledge base. This term might be:\n\n• A very recent concept or term\n• A local or specialized term\n• Something that's spelled differently\n\nYou could try searching online or providing more context about what you're looking for.`;
        }
        
        return `I couldn't find specific information about "${cleanQuery}". You might want to try:\n\n• Checking the spelling\n• Using different search terms\n• Looking up more recent sources\n\nFor scientific topics, I have detailed information about planets, stars, and other celestial bodies in our Solar System.`;
    }
    
    addMessage(message, sender, saveToStorage = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        
        if (sender === 'user') {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.getCurrentTime();
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(timeDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Save to current chat if requested
        if (saveToStorage && this.currentChatId) {
            const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
            if (currentChat) {
                currentChat.messages.push({
                    text: message,
                    sender: sender,
                    timestamp: new Date().toISOString()
                });
                
                // Update chat title if it's still "New Chat"
                if (currentChat.title === 'New Chat' && sender === 'user') {
                    currentChat.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
                }
                
                this.saveToStorage();
                this.updateChatSidebar();
            }
        }
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
        // Use setTimeout to ensure DOM updates are complete
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    initVoiceInput() {
        const micButton = document.querySelector('.action-btn');
        let isRecording = false;
        let recognition = null;
        
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onstart = () => {
                isRecording = true;
                micButton.innerHTML = '<i class="fas fa-stop"></i>';
                micButton.style.color = '#ef4444';
                this.showVoiceIndicator();
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.messageInput.value = transcript;
                this.messageInput.dispatchEvent(new Event('input'));
            };
            
            recognition.onend = () => {
                isRecording = false;
                micButton.innerHTML = '<i class="fas fa-microphone"></i>';
                micButton.style.color = '#ececf1';
                this.hideVoiceIndicator();
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                isRecording = false;
                micButton.innerHTML = '<i class="fas fa-microphone"></i>';
                micButton.style.color = '#ececf1';
                this.hideVoiceIndicator();
                
                if (event.error === 'not-allowed') {
                    this.addMessage("Voice input is not allowed. Please check your microphone permissions.", 'bot');
                } else {
                    this.addMessage("Sorry, I couldn't understand that. Please try again.", 'bot');
                }
            };
            
            micButton.addEventListener('click', () => {
                if (!isRecording) {
                    try {
                        recognition.start();
                    } catch (error) {
                        console.error('Speech recognition start error:', error);
                        this.addMessage("Voice input is not available in this browser.", 'bot');
                    }
                } else {
                    recognition.stop();
                }
            });
        } else {
            // Hide mic button if speech recognition is not supported
            micButton.style.display = 'none';
        }
    }
    
    showVoiceIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'voice-indicator';
        indicator.innerHTML = `
            <div class="voice-dot"></div>
            <div class="voice-dot"></div>
            <div class="voice-dot"></div>
            <span>Listening...</span>
        `;
        document.body.appendChild(indicator);
    }
    
    hideVoiceIndicator() {
        const indicator = document.querySelector('.voice-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    initNewChat() {
        // Plus button in input area
        const plusButton = document.querySelector('.tool-btn');
        plusButton.addEventListener('click', () => {
            this.startNewChat();
        });
        
        // New chat button in sidebar
        const sidebarNewChatBtn = document.querySelector('.new-chat-btn');
        sidebarNewChatBtn.addEventListener('click', () => {
            this.startNewChat();
        });
    }
    

}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const chatbot = new Chatbot();
    await chatbot.init();
}); 
