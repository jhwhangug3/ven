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
                description: 'The Sun is the star at the center of our Solar System, around which Earth and other planets orbit. It is a massive ball of hydrogen and helium that produces energy through nuclear fusion, providing light and heat to Earth.',
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
        
        // User authentication system
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Customization settings
        this.customizationSettings = {
            responseStyle: 'friendly', // casual, friendly, formal, creative
            includeEmojis: true,
            detailedExplanations: false,
            lightMode: false
        };
        
        // Chat history for storage
        this.chatHistory = [];
        this.currentChatId = null;
        
        // Enhanced conversation context tracking
        this.conversationContext = {
            currentTopic: null,
            waitingFor: null,
            lastQuestion: null,
            lastResponse: null,
            conversationHistory: [],
            emotion: null,
            topicHistory: [],
            userMood: null,
            conversationFlow: [],
            questionCount: 0,
            responseCount: 0,
            lastInteractionTime: null
        };

        // NEW FEATURES - Enhanced capabilities
        this.fileUploadSystem = {
            supportedTypes: ['txt', 'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'],
            maxFileSize: 10 * 1024 * 1024, // 10MB
            uploadedFiles: []
        };

        this.voiceSystem = {
            isListening: false,
            isSpeaking: false,
            recognition: null,
            synthesis: null,
            supported: false
        };

        this.codeExecution = {
            supportedLanguages: ['javascript', 'python', 'html', 'css', 'json'],
            sandboxMode: true,
            executionHistory: []
        };

        this.weatherSystem = {
            apiKey: null, // Would need actual API key
            lastLocation: null,
            cache: {},
            cacheExpiry: 30 * 60 * 1000 // 30 minutes
        };

        this.calendarSystem = {
            events: [],
            reminders: [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        this.imageGeneration = {
            supported: false,
            apiKey: null,
            lastGenerated: null
        };

        this.searchFilters = {
            timeRange: 'any',
            language: 'en',
            region: 'us',
            safeSearch: true
        };

        this.languageSupport = {
            currentLanguage: 'en',
            supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'hi', 'bn'],
            translations: {}
        };

        this.analytics = {
            messageCount: 0,
            sessionDuration: 0,
            featuresUsed: {},
            performanceMetrics: {}
        };

        // init() will be called separately after construction
    }
    
    async init() {
        // Load responses from JSON file
        await this.loadResponses();
        
        // Load saved chat history and user memory
        this.loadFromStorage();
        
        // Load user data FIRST (before initializing UI)
        this.loadUserData();
        
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
        
        // Initialize user menu
        this.initUserMenu();
        
        // Initialize login system
        this.initLoginSystem();
        
        // Initialize new enhanced features
        this.initFileUploadSystem();
        this.initVoiceSystem();
        this.initCodeExecution();
        this.initWeatherSystem();
        this.initCalendarSystem();
        this.initImageGeneration();
        this.initSearchFilters();
        this.initLanguageSupport();
        this.initAnalytics();
        
        // Ensure user interface is updated after everything is initialized
        setTimeout(() => {
            this.updateUserInterface();
            // Debug: Check user login status
            console.log('Initialization complete. User status:', {
                isLoggedIn: this.isLoggedIn,
                hasCurrentUser: !!this.currentUser,
                hasProfileImage: this.currentUser ? !!this.currentUser.profileImage : false
            });
        }, 200);
        
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
                const isOpening = !sidebar.classList.contains('open');
                sidebar.classList.toggle('open');
                hamburgerMenu.classList.toggle('active');
                hamburgerMenu.classList.toggle('sidebar-open');
                
                // Move hamburger menu with sidebar on mobile
                if (window.innerWidth <= 768) {
                    if (isOpening) {
                        hamburgerMenu.style.transform = 'translateX(260px)';
                        this.addOverlay();
                        // Hide chat input area when sidebar is open on mobile
                        if (chatInputArea) {
                            chatInputArea.style.visibility = 'hidden';
                            chatInputArea.style.opacity = '0';
                        }
                    } else {
                        hamburgerMenu.style.transform = 'translateX(0)';
                        this.removeOverlay();
                        // Show chat input area when sidebar is closed on mobile
                        if (chatInputArea) {
                            chatInputArea.style.visibility = 'visible';
                            chatInputArea.style.opacity = '1';
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
                    hamburgerMenu.classList.remove('sidebar-open');
                    // Reset hamburger menu position
                    hamburgerMenu.style.transform = 'translateX(0)';
                    this.removeOverlay();
                    // Show chat input area when sidebar is closed
                    if (chatInputArea) {
                        chatInputArea.style.visibility = 'visible';
                        chatInputArea.style.opacity = '1';
                    }
                }
            });
            
            // Ensure chat input area is visible when sidebar is closed on mobile
            const ensureChatInputVisibility = () => {
                if (window.innerWidth <= 768 && chatInputArea) {
                    if (!sidebar.classList.contains('open')) {
                        chatInputArea.style.visibility = 'visible';
                        chatInputArea.style.opacity = '1';
                    } else {
                        chatInputArea.style.visibility = 'hidden';
                        chatInputArea.style.opacity = '0';
                    }
                } else if (chatInputArea) {
                    // On desktop, always show the chat input area
                    chatInputArea.style.visibility = 'visible';
                    chatInputArea.style.opacity = '1';
                }
            };
            
            // Check visibility on window resize
            window.addEventListener('resize', ensureChatInputVisibility);
            
            // Check visibility on page load
            setTimeout(ensureChatInputVisibility, 100);
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
                document.getElementById('hamburgerMenu').classList.remove('sidebar-open');
                // Reset hamburger menu position
                if (window.innerWidth <= 768) {
                    document.getElementById('hamburgerMenu').style.transform = 'translateX(0)';
                }
                this.removeOverlay();
                
                // Show chat input area when sidebar is closed
                const chatInputArea = document.querySelector('.chat-input-area');
                if (chatInputArea && window.innerWidth <= 768) {
                    chatInputArea.style.visibility = 'visible';
                    chatInputArea.style.opacity = '1';
                }
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
        
        // Reset conversation context for new chat
        this.resetConversationContext();
        
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
        
        // Update conversation context
        this.updateConversationContext(message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get bot response (now async)
            const response = await this.getBotResponse(message);
            this.hideTypingIndicator();
            
            // Apply customization styling to the response
            const styledResponse = this.applyResponseStyle(response);
            this.addMessage(styledResponse, 'bot');
            
            // Update bot's response context
            this.updateBotResponseContext(response);
        } catch (error) {
            this.hideTypingIndicator();
            const errorMessage = "I'm sorry, I encountered an error while searching for information. Please try again.";
            const styledError = this.applyResponseStyle(errorMessage);
            this.addMessage(styledError, 'bot');
        }
    }
    
    async getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Track message count for analytics
        this.analytics.messageCount++;
        this.trackFeatureUsage('message_sent');
        
        // Enhanced context understanding
        const contextResult = this.handleContextualQuery(message);
        if (contextResult) {
            return contextResult;
        }
        
        // Check for small talk and greetings
        const smallTalkResult = this.handleSmallTalk(message);
        if (smallTalkResult) {
            return smallTalkResult;
        }
        
        // Check for general knowledge and trivia
        const triviaResult = this.handleTriviaQuery(message);
        if (triviaResult) {
            return triviaResult;
        }
        
        // Check for mathematical expressions
        const mathResult = this.solveMathProblem(message);
        if (mathResult !== null) {
            return mathResult;
        }
        
        // Check for date, time, and weather queries
        const dateTimeResult = this.handleDateTimeQuery(message);
        if (dateTimeResult) {
            return dateTimeResult;
        }
        
        // Check for translation requests
        const translationResult = await this.handleTranslationRequest(message);
        if (translationResult) {
            return translationResult;
        }
        
        // Check for entertainment and media queries
        const entertainmentResult = this.handleEntertainmentQuery(message);
        if (entertainmentResult) {
            return entertainmentResult;
        }
        
        // Check for mental health and emotional support
        const emotionalResult = this.handleEmotionalSupport(message);
        if (emotionalResult) {
            return emotionalResult;
        }
        
        // Check for productivity and tools
        const productivityResult = this.handleProductivityQuery(message);
        if (productivityResult) {
            return productivityResult;
        }
        
        // Check for shopping and budgeting
        const shoppingResult = this.handleShoppingQuery(message);
        if (shoppingResult) {
            return shoppingResult;
        }
        
        // Check for travel and locations
        const travelResult = this.handleTravelQuery(message);
        if (travelResult) {
            return travelResult;
        }
        
        // Check for tech and coding help
        const techResult = this.handleTechQuery(message);
        if (techResult) {
            return techResult;
        }
        
        // Check for money and finance
        const financeResult = this.handleFinanceQuery(message);
        if (financeResult) {
            return financeResult;
        }
        
        // Check for religion and culture
        const religionResult = this.handleReligionQuery(message);
        if (religionResult) {
            return religionResult;
        }
        
        // Check for food and diet
        const foodResult = this.handleFoodQuery(message);
        if (foodResult) {
            return foodResult;
        }
        
        // Check for science and facts
        const scienceResult = this.handleScienceQuery(message);
        if (scienceResult) {
            return scienceResult;
        }
        
        // Check for creativity and fun
        const creativityResult = this.handleCreativityQuery(message);
        if (creativityResult) {
            return creativityResult;
        }
        
        // Check for app and social help
        const appResult = this.handleAppQuery(message);
        if (appResult) {
            return appResult;
        }
        
        // Check for study and learning
        const studyResult = this.handleStudyQuery(message);
        if (studyResult) {
            return studyResult;
        }
        
        // Check for developer-level queries
        const devResult = this.handleDeveloperQuery(message);
        if (devResult) {
            return devResult;
        }
        
        // Check for simple greetings
        const greetingResult = this.handleGreetingQuery(message);
        if (greetingResult) {
            return greetingResult;
        }
        
        // Check for age calculation queries
        const ageResult = this.handleAgeCalculationQuery(message);
        if (ageResult) {
            return ageResult;
        }
        
        // Check for cooking queries
        const cookingResult = this.handleCookingQuery(message);
        if (cookingResult) {
            return cookingResult;
        }
        
        // Check for contextual responses based on conversation history
        const contextualResult = this.handleContextualResponse(message);
        if (contextualResult) {
            return contextualResult;
        }
        
        // Check for user memory/context updates
        const memoryResult = this.handleUserMemory(message);
        if (memoryResult) {
            return memoryResult;
        }
        
        // Check for Nahin searches
        if (this.isNahinSearch(message)) {
            return this.getNahinInfo(message);
        }
        
        // Check knowledge base for accurate information
        const knowledgeResult = this.getKnowledgeBaseResponse(message);
        if (knowledgeResult) {
            return knowledgeResult;
        }
        
        // Check if this is a search query
        const isSearchQuery = this.isSearchQuery(message);
        
        if (isSearchQuery) {
            return await this.searchForInformation(message);
        }
        
        // Check for exact matches for generic responses
        console.log('Checking responses for:', lowerMessage);
        console.log('Available response keys:', Object.keys(this.responses));
        const sortedKeys = Object.keys(this.responses).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
            if (lowerMessage.includes(key)) {
                console.log('Found matching key:', key);
                return this.getRandomResponse(this.responses[key]);
            }
        }
        
        // Enhanced fallback with better context understanding
        const fallbackResponse = this.getIntelligentFallback(message);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        
        // If no predefined response, search for information online
        return await this.searchForInformation(message);
    }
    
    getIntelligentFallback(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for simple words that might be casual conversation
        const simpleWords = ['good', 'bad', 'okay', 'ok', 'fine', 'great', 'awesome', 'cool', 'nice', 'wow', 'yeah', 'yes', 'no', 'maybe', 'sure', 'alright', 'hello', 'hi', 'hey', 'bye', 'thanks', 'thank you'];
        if (simpleWords.includes(lowerMessage.trim())) {
            // Give specific responses based on the word
            if (lowerMessage.trim() === 'bad') {
                const responses = [
                    `I'm sorry to hear that! 😔 What's going on?`,
                    `That's tough! Want to talk about it?`,
                    `I'm here for you! What happened?`,
                    `That's no good! How can I help?`,
                    `I hope things get better! What's on your mind?`,
                    `That's rough! Want to chat about it?`,
                    `I'm sorry! What's bothering you?`,
                    `That's unfortunate! How can I support you?`
                ];
                return this.getRandomResponse(responses);
            } else if (lowerMessage.trim() === 'good') {
                const responses = [
                    `That's great! 😊 How are you doing today?`,
                    `Nice! What's on your mind?`,
                    `Cool! What would you like to talk about?`,
                    `Awesome! How can I help you today?`,
                    `That's good to hear! What's up?`,
                    `Great! What's new with you?`,
                    `That's nice! What would you like to know?`,
                    `Perfect! How can I assist you?`
                ];
                return this.getRandomResponse(responses);
            } else {
                const responses = [
                    `That's great! 😊 How are you doing today?`,
                    `Nice! What's on your mind?`,
                    `Cool! What would you like to talk about?`,
                    `Awesome! How can I help you today?`,
                    `That's good to hear! What's up?`,
                    `Great! What's new with you?`,
                    `That's nice! What would you like to know?`,
                    `Perfect! How can I assist you?`
                ];
                return this.getRandomResponse(responses);
            }
        }
        
        // Check for casual greetings or responses
        if (lowerMessage.includes('yo') || lowerMessage.includes('sup') || lowerMessage.includes('what\'s up')) {
            const responses = [
                `Hey there! 👋 What's up?`,
                `Yo! How's it going? 😊`,
                `Sup! What's on your mind today?`,
                `Hey! What would you like to chat about?`,
                `Yo! How can I help you? 😄`
            ];
            return this.getRandomResponse(responses);
        }
        
        // Check for question patterns that indicate the user wants information
        const questionPatterns = [
            /what (is|are) (.+)/i,
            /how (does|do) (.+)/i,
            /why (is|are) (.+)/i,
            /when (is|are) (.+)/i,
            /where (is|are) (.+)/i,
            /who (is|are) (.+)/i,
            /which (.+)/i,
            /can you (.+)/i,
            /could you (.+)/i,
            /would you (.+)/i,
            /tell me about (.+)/i,
            /explain (.+)/i,
            /describe (.+)/i,
            /what does (.+) mean/i,
            /how to (.+)/i
        ];
        
        for (const pattern of questionPatterns) {
            const match = message.match(pattern);
            if (match) {
                const topic = match[2] || match[1];
                return `I understand you're asking about "${topic}". While I don't have specific information about this in my current knowledge base, I'd be happy to help you find what you're looking for! 

Could you:
- Rephrase your question in a different way?
- Ask about a related topic I might know about?
- Tell me more about what you're trying to accomplish?

I'm here to help and learn from our conversation! 😊`;
            }
        }
        
        // Check for statements that might need clarification
        const statementPatterns = [
            /i (want|need) (.+)/i,
            /i (am|was) (.+)/i,
            /i (have|had) (.+)/i,
            /i (think|thought) (.+)/i,
            /i (like|love) (.+)/i,
            /i (don't|do not) (.+)/i
        ];
        
        for (const pattern of statementPatterns) {
            const match = message.match(pattern);
            if (match) {
                const topic = match[2];
                return `I see you mentioned "${topic}". That's interesting! 

Could you tell me more about what you'd like to know or how I can help you with this? I'm here to assist and learn from our conversation! 😊`;
            }
        }
        
        // Check for single words or short phrases that might be topics
        const words = message.trim().split(/\s+/);
        if (words.length <= 3 && words.length > 0) {
            // Skip if it's a question about the bot itself
            const botQuestions = ['who', 'what', 'how', 'why', 'when', 'where'];
            const isBotQuestion = botQuestions.some(word => lowerMessage.includes(word));
            
            if (!isBotQuestion) {
                const topic = words.join(' ');
                return `I see you mentioned "${topic}". 

Could you provide more context about what you'd like to know? For example:
- Are you asking what this is?
- Do you want to learn more about it?
- Are you looking for information related to this?

I'm here to help once I understand better what you're looking for! 😊`;
            }
        }
        
        // Default conversational response
        const defaultResponses = [
            `That's interesting! What would you like to know more about? 😊`,
            `Cool! How can I help you with that?`,
            `That's nice! What's on your mind?`,
            `Interesting! What would you like to chat about?`,
            `That's great! How can I assist you today?`,
            `Nice! What would you like to explore?`,
            `That's awesome! What can I help you with?`,
            `Cool! What's new with you?`
        ];
        return this.getRandomResponse(defaultResponses);
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    handleUserMemory(message) {
        const lowerMessage = message.toLowerCase();
        
        console.log('handleUserMemory called with:', message);
        console.log('Current waitingFor:', this.conversationContext.waitingFor);
        
        // Handle name updates
        if (lowerMessage.includes('my name is') || lowerMessage.includes('my name') || lowerMessage.includes('i\'m called') || lowerMessage.includes('call me')) {
            const nameMatch = message.match(/(?:my name is|my name|i'm called|call me)\s+([a-zA-Z]+)/i);
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
                // Additional check: if this looks like it could be a famous person's name,
                // don't treat it as a user's name unless it's in a clear name context
                const famousNames = [
                    'elon', 'musk', 'bill', 'gates', 'steve', 'jobs', 'mark', 'zuckerberg', 'jeff', 'bezos',
                    'sundar', 'pichai', 'satya', 'nadella', 'tim', 'cook', 'larry', 'page', 'sergey', 'brin',
                    'warren', 'buffett', 'jack', 'ma', 'masayoshi', 'son', 'larry', 'ellison', 'michael', 'dell',
                    'paul', 'allen', 'steve', 'ballmer', 'reed', 'hastings', 'brian', 'chesky', 'travis', 'kalanick',
                    'evan', 'spiegel', 'bobby', 'murphy', 'kevin', 'systrom', 'mike', 'krieger', 'jan', 'koum',
                    'brian', 'acton', 'drew', 'houston', 'arash', 'ferdowsi', 'ben', 'silbermann', 'evan', 'sharp',
                    'paul', 'sciarra', 'ron', 'conway', 'marc', 'andreessen', 'peter', 'thiel', 'reid', 'hoffman',
                    'chamath', 'palihapitiya', 'naval', 'ravikant', 'sam', 'altman', 'dario', 'amodei', 'demis', 'hassabis',
                    'yann', 'lecun', 'geoffrey', 'hinton', 'andrew', 'ng', 'fei', 'li', 'katherine', 'johnson',
                    'ada', 'lovelace', 'grace', 'hopper', 'alan', 'turing', 'john', 'von', 'neumann', 'claude', 'shannon',
                    'marvin', 'minsky', 'seymour', 'papert', 'donald', 'knuth', 'edsger', 'dijkstra', 'dennis', 'ritchie',
                    'ken', 'thompson', 'brian', 'kernighan', 'linus', 'torvalds', 'richard', 'stallman', 'james', 'gosling',
                    'bjarne', 'stroustrup', 'guido', 'van', 'rossum', 'yukihiro', 'matsumoto', 'rasmus', 'lerdorf',
                    'brendan', 'eich', 'james', 'gunn', 'christopher', 'nolan', 'quentin', 'tarantino', 'martin', 'scorsese',
                    'steven', 'spielberg', 'james', 'cameron', 'george', 'lucas', 'francis', 'ford', 'coppola',
                    'alfred', 'hitchcock', 'stanley', 'kubrick', 'federico', 'fellini', 'ingmar', 'bergman',
                    'akira', 'kurosawa', 'satyajit', 'ray', 'mira', 'nair', 'deepa', 'mehta', 'gurinder', 'chadha',
                    'ang', 'lee', 'wong', 'kar', 'wai', 'zhang', 'yimou', 'chen', 'kaige', 'jia', 'zhangke',
                    'lou', 'ye', 'wang', 'xiaoshuai', 'ning', 'hao', 'feng', 'xiaogang', 'zhang', 'yuan',
                    'wang', 'bing', 'liu', 'bing', 'chen', 'kaige', 'zhang', 'yimou', 'ang', 'lee',
                    'wong', 'kar', 'wai', 'mira', 'nair', 'deepa', 'mehta', 'gurinder', 'chadha', 'satyajit', 'ray',
                    'akira', 'kurosawa', 'ingmar', 'bergman', 'federico', 'fellini', 'stanley', 'kubrick',
                    'alfred', 'hitchcock', 'francis', 'ford', 'coppola', 'george', 'lucas', 'james', 'cameron',
                    'steven', 'spielberg', 'martin', 'scorsese', 'quentin', 'tarantino', 'christopher', 'nolan',
                    'james', 'gunn', 'brendan', 'eich', 'rasmus', 'lerdorf', 'yukihiro', 'matsumoto',
                    'guido', 'van', 'rossum', 'bjarne', 'stroustrup', 'james', 'gosling', 'richard', 'stallman',
                    'linus', 'torvalds', 'brian', 'kernighan', 'ken', 'thompson', 'dennis', 'ritchie',
                    'edsger', 'dijkstra', 'donald', 'knuth', 'seymour', 'papert', 'marvin', 'minsky',
                    'claude', 'shannon', 'john', 'von', 'neumann', 'alan', 'turing', 'grace', 'hopper',
                    'ada', 'lovelace', 'fei', 'li', 'andrew', 'ng', 'geoffrey', 'hinton', 'yann', 'lecun',
                    'demis', 'hassabis', 'dario', 'amodei', 'sam', 'altman', 'naval', 'ravikant',
                    'chamath', 'palihapitiya', 'reid', 'hoffman', 'peter', 'thiel', 'marc', 'andreessen',
                    'ron', 'conway', 'paul', 'sciarra', 'evan', 'sharp', 'ben', 'silbermann',
                    'arash', 'ferdowsi', 'drew', 'houston', 'brian', 'acton', 'jan', 'koum',
                    'mike', 'krieger', 'kevin', 'systrom', 'bobby', 'murphy', 'evan', 'spiegel',
                    'travis', 'kalanick', 'brian', 'chesky', 'reed', 'hastings', 'steve', 'ballmer',
                    'paul', 'allen', 'michael', 'dell', 'larry', 'ellison', 'masayoshi', 'son',
                    'jack', 'ma', 'warren', 'buffett', 'sergey', 'brin', 'larry', 'page', 'tim', 'cook',
                    'satya', 'nadella', 'sundar', 'pichai', 'jeff', 'bezos', 'mark', 'zuckerberg',
                    'steve', 'jobs', 'bill', 'gates', 'musk', 'elon'
                ];
                
                // If this looks like a famous person's name, don't treat it as user's name
                if (famousNames.includes(cleanMessage.toLowerCase())) {
                    return null; // Let it go to search instead
                }
                
                // Additional check: if this is a single word and could be a search query,
                // be more conservative about treating it as a name
                if (cleanMessage.length <= 8) {
                    // For short words, only treat as name if it's clearly a name context
                    // or if the user has explicitly said it's their name
                    return null; // Let it go to search instead
                }
                
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
        
        // Handle "I am [age]" pattern
        if (lowerMessage.includes('i am') || lowerMessage.includes('i\'m')) {
            const ageMatch = message.match(/(?:i am|i'm)\s+(\d+)(?:\s+years?\s+old)?/i);
            if (ageMatch) {
                const age = parseInt(ageMatch[1]);
                if (age >= 1 && age <= 150) {
                    this.userMemory.age = age;
                    
                    // Special responses for different age ranges
                    if (age >= 90 && age <= 110) {
                        return `Wow! You're ${age} years old! 🎉 That's absolutely incredible! You must have so many amazing stories and experiences to share. You're a true inspiration! 🌟`;
                    } else if (age >= 80 && age < 90) {
                        return `Amazing! You're ${age} years old! 👴👵 You've lived through so much history and change. Your wisdom and experience are truly valuable! 💫`;
                    } else if (age >= 70 && age < 80) {
                        return `Wonderful! You're ${age} years old! 🌟 You've seen so much of life and have so much wisdom to share. Age is just a number, and you're proof of that! ✨`;
                    } else if (age >= 60 && age < 70) {
                        return `Great! You're ${age} years old! 🎂 You're in the golden years of life with so much experience and knowledge to offer! 🌟`;
                    } else if (age >= 50 && age < 60) {
                        return `Nice! You're ${age} years old! 🎉 You're in the prime of life with so much experience behind you and still so much ahead! ✨`;
                    } else if (age >= 40 && age < 50) {
                        return `Cool! You're ${age} years old! 🌟 You're in the sweet spot of life with experience and energy! 💪`;
                    } else if (age >= 30 && age < 40) {
                        return `Awesome! You're ${age} years old! 🎯 You're in your prime with the perfect balance of youth and experience! ✨`;
                    } else if (age >= 20 && age < 30) {
                        return `Nice! You're ${age} years old! 🚀 You're in the exciting phase of building your life and career! 🌟`;
                    } else if (age >= 13 && age < 20) {
                        return `Cool! You're ${age} years old! 🎮 You're in the exciting teenage years, discovering yourself and the world! 🌈`;
                    } else if (age >= 1 && age < 13) {
                        return `Aww! You're ${age} years old! 🧸 You're just starting your amazing journey in life! 🌟`;
                    } else {
                        return `Got it! You're ${age} years old! 🎂`;
                    }
                } else if (age > 150) {
                    return `Wow! ${age} years old? That's incredible! 🎉 You must be one of the oldest people ever! If this is true, you're absolutely amazing! 🌟✨`;
                } else if (age < 1) {
                    return `Haha, ${age} years old? That's quite young! 😄 Are you sure about that?`;
                }
            }
        }
        
        // Handle birth year calculation
        if (lowerMessage.includes('born in') || lowerMessage.includes('born on')) {
            const yearMatch = message.match(/(?:born in|born on)\s+(\d{4})/i);
            if (yearMatch) {
                const birthYear = parseInt(yearMatch[1]);
                const currentYear = new Date().getFullYear();
                const age = currentYear - birthYear;
                
                if (age >= 1 && age <= 150) {
                    this.userMemory.age = age;
                    
                    // Special responses for different age ranges
                    if (age >= 90 && age <= 110) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🎉 That's absolutely incredible! You must have so many amazing stories and experiences to share. You're a true inspiration! 🌟`;
                    } else if (age >= 80 && age < 90) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 👴👵 You've lived through so much history and change. Your wisdom and experience are truly valuable! 💫`;
                    } else if (age >= 70 && age < 80) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🌟 You've seen so much of life and have so much wisdom to share. Age is just a number, and you're proof of that! ✨`;
                    } else if (age >= 60 && age < 70) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🎂 You're in the golden years of life with so much experience and knowledge to offer! 🌟`;
                    } else if (age >= 50 && age < 60) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🎉 You're in the prime of life with so much experience behind you and still so much ahead! ✨`;
                    } else if (age >= 40 && age < 50) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🌟 You're in the sweet spot of life with experience and energy! 💪`;
                    } else if (age >= 30 && age < 40) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🎯 You're in your prime with the perfect balance of youth and experience! ✨`;
                    } else if (age >= 20 && age < 30) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🚀 You're in the exciting phase of building your life and career! 🌟`;
                    } else if (age >= 13 && age < 20) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🎮 You're in the exciting teenage years, discovering yourself and the world! 🌈`;
                    } else if (age >= 1 && age < 13) {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🧸 You're just starting your amazing journey in life! 🌟`;
                    } else {
                        return `If you were born in ${birthYear}, you would be ${age} years old now! 🎂`;
                    }
                } else if (age > 150) {
                    return `If you were born in ${birthYear}, you would be ${age} years old now! 🎉 That's incredible! You must be one of the oldest people ever! If this is true, you're absolutely amazing! 🌟✨`;
                } else if (age < 1) {
                    return `If you were born in ${birthYear}, you would be ${age} years old now! 😄 That's quite young! Are you sure about that birth year?`;
                } else if (birthYear > currentYear) {
                    return `Haha, born in ${birthYear}? That's in the future! 😄 Are you a time traveler?`;
                }
            }
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
                let response = `Cool! Here's what I know about ${term}:\n\n`;
                response += info.description + '\n\n';
                response += 'Some interesting facts:\n';
                info.facts.forEach((fact, index) => {
                    response += `• ${fact}\n`;
                });
                response += '\nPretty fascinating, right? 😊';
                return response;
            }
        }
        
        // Check for specific questions about celestial bodies
        if (lowerMessage.includes('sun') || lowerMessage.includes('star')) {
            const sunInfo = this.knowledgeBase.sun;
            let response = `Awesome! Here's what I know about the Sun:\n\n`;
            response += sunInfo.description + '\n\n';
            response += 'Some cool facts:\n';
            sunInfo.facts.forEach(fact => {
                response += `• ${fact}\n`;
            });
            response += '\nPretty amazing, isn\'t it? 🌟';
            return response;
        }
        
        if (lowerMessage.includes('earth') || lowerMessage.includes('planet')) {
            const earthInfo = this.knowledgeBase.earth;
            let response = `Great question! Here's what I know about Earth:\n\n`;
            response += earthInfo.description + '\n\n';
            response += 'Some interesting facts:\n';
            earthInfo.facts.forEach(fact => {
                response += `• ${fact}\n`;
            });
            response += '\nOur planet is pretty special! 🌍';
            return response;
        }
        
        if (lowerMessage.includes('moon')) {
            const moonInfo = this.knowledgeBase.moon;
            let response = `Nice! Here's what I know about the Moon:\n\n`;
            response += moonInfo.description + '\n\n';
            response += 'Some cool facts:\n';
            moonInfo.facts.forEach(fact => {
                response += `• ${fact}\n`;
            });
            response += '\nThe Moon is pretty fascinating! 🌙';
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
        
        // Start with a conversational introduction
        response += `Here's what I found about "${query}":\n\n`;
        
        // Combine information from multiple search results
        googleResults.forEach((result, index) => {
            if (index > 0) response += '\n\n';
            response += this.cleanContent(result.content);
        });
        
        // Limit total length
        if (response.length > 600) {
            response = response.substring(0, 600) + '...';
        }
        
        // Add a conversational ending
        response += '\n\nIs there anything specific about this you\'d like to know more about? 😊';
        
        return response;
    }
    
    createCleanResponse(results, query) {
        const wikiResult = results.find(r => r.source === 'Wikipedia');
        const newsResult = results.find(r => r.source === 'News');
        const webResult = results.find(r => r.source === 'Web');
        
        let response = '';
        
        // Start with a conversational introduction
        response += `Here's what I found about "${query}":\n\n`;
        
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
        
        // Add a conversational ending
        response += '\n\nIs there anything specific about this you\'d like to know more about? 😊';
        
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
            // Check if user has a profile picture
            if (this.isLoggedIn && this.currentUser && this.currentUser.profileImage) {
                console.log('Using profile image for user message');
                avatar.innerHTML = `<img src="${this.currentUser.profileImage}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            } else {
                console.log('Using default user icon - no profile image available');
                console.log('User state:', {
                    isLoggedIn: this.isLoggedIn,
                    hasCurrentUser: !!this.currentUser,
                    hasProfileImage: this.currentUser ? !!this.currentUser.profileImage : false,
                    profileImageLength: this.currentUser && this.currentUser.profileImage ? this.currentUser.profileImage.length : 0
                });
                avatar.innerHTML = '<i class="fas fa-user"></i>';
            }
        } else {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = message;
        
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
    
    handleTimeQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for various time-related queries
        const timeKeywords = [
            'what time is it',
            'what time',
            'current time',
            'time now',
            'what\'s the time',
            'whats the time',
            'tell me the time',
            'time please',
            'what time is it now',
            'current time please',
            'clock',
            'hour',
            'minute'
        ];
        
        // Check if the message contains time-related keywords
        const hasTimeKeyword = timeKeywords.some(keyword => 
            lowerMessage.includes(keyword)
        );
        
        if (!hasTimeKeyword) {
            return null;
        }
        
        // Check for timezone-specific queries
        const timezoneResult = this.handleTimezoneQuery(message);
        if (timezoneResult) {
            return timezoneResult;
        }
        
        // Get current time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        const displaySeconds = seconds.toString().padStart(2, '0');
        
        // Get day of week and date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayOfWeek = days[now.getDay()];
        const month = months[now.getMonth()];
        const date = now.getDate();
        const year = now.getFullYear();
        
        // Create response based on the type of time query
        if (lowerMessage.includes('second')) {
            return `The current time is ${displayHours}:${displayMinutes}:${displaySeconds} ${ampm}.`;
        } else {
            return `The current time is ${displayHours}:${displayMinutes} ${ampm}.`;
        }
    }
    
    handleTimezoneQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Common timezone mappings
        const timezoneMap = {
            'japan': 'Asia/Tokyo',
            'tokyo': 'Asia/Tokyo',
            'berlin': 'Europe/Berlin',
            'germany': 'Europe/Berlin',
            'london': 'Europe/London',
            'uk': 'Europe/London',
            'england': 'Europe/London',
            'new york': 'America/New_York',
            'nyc': 'America/New_York',
            'los angeles': 'America/Los_Angeles',
            'la': 'America/Los_Angeles',
            'california': 'America/Los_Angeles',
            'paris': 'Europe/Paris',
            'france': 'Europe/Paris',
            'lyon': 'Europe/Paris',
            'marseille': 'Europe/Paris',
            'toulouse': 'Europe/Paris',
            'nice': 'Europe/Paris',
            'nantes': 'Europe/Paris',
            'strasbourg': 'Europe/Paris',
            'montpellier': 'Europe/Paris',
            'bordeaux': 'Europe/Paris',
            'lille': 'Europe/Paris',
            'rennes': 'Europe/Paris',
            'reims': 'Europe/Paris',
            'saint-etienne': 'Europe/Paris',
            'toulon': 'Europe/Paris',
            'le havre': 'Europe/Paris',
            'grenoble': 'Europe/Paris',
            'dijon': 'Europe/Paris',
            'angers': 'Europe/Paris',
            'saint-denis': 'Europe/Paris',
            'villeurbanne': 'Europe/Paris',
            'le mans': 'Europe/Paris',
            'aix-en-provence': 'Europe/Paris',
            'brest': 'Europe/Paris',
            'nimes': 'Europe/Paris',
            'tours': 'Europe/Paris',
            'limoges': 'Europe/Paris',
            'clermont-ferrand': 'Europe/Paris',
            'villeurbanne': 'Europe/Paris',
            'rome': 'Europe/Rome',
            'italy': 'Europe/Rome',
            'milan': 'Europe/Rome',
            'naples': 'Europe/Rome',
            'turin': 'Europe/Rome',
            'palermo': 'Europe/Rome',
            'genoa': 'Europe/Rome',
            'bologna': 'Europe/Rome',
            'florence': 'Europe/Rome',
            'bari': 'Europe/Rome',
            'catania': 'Europe/Rome',
            'venice': 'Europe/Rome',
            'verona': 'Europe/Rome',
            'messina': 'Europe/Rome',
            'padova': 'Europe/Rome',
            'trieste': 'Europe/Rome',
            'taranto': 'Europe/Rome',
            'brescia': 'Europe/Rome',
            'parma': 'Europe/Rome',
            'modena': 'Europe/Rome',
            'reggio calabria': 'Europe/Rome',
            'reggio emilia': 'Europe/Rome',
            'perugia': 'Europe/Rome',
            'livorno': 'Europe/Rome',
            'ravenna': 'Europe/Rome',
            'cagliari': 'Europe/Rome',
            'rimini': 'Europe/Rome',
            'salerno': 'Europe/Rome',
            'ferrara': 'Europe/Rome',
            'sassari': 'Europe/Rome',
            'syracuse': 'Europe/Rome',
            'pescara': 'Europe/Rome',
            'bergamo': 'Europe/Rome',
            'vicenza': 'Europe/Rome',
            'trento': 'Europe/Rome',
            'forli': 'Europe/Rome',
            'novara': 'Europe/Rome',
            'piacenza': 'Europe/Rome',
            'bolzano': 'Europe/Rome',
            'udine': 'Europe/Rome',
            'arezzo': 'Europe/Rome',
            'lecce': 'Europe/Rome',
            'trento': 'Europe/Rome',
            'madrid': 'Europe/Madrid',
            'spain': 'Europe/Madrid',
            'barcelona': 'Europe/Madrid',
            'valencia': 'Europe/Madrid',
            'sevilla': 'Europe/Madrid',
            'seville': 'Europe/Madrid',
            'zaragoza': 'Europe/Madrid',
            'malaga': 'Europe/Madrid',
            'murcia': 'Europe/Madrid',
            'palma': 'Europe/Madrid',
            'las palmas': 'Europe/Madrid',
            'bilbao': 'Europe/Madrid',
            'alicante': 'Europe/Madrid',
            'cordoba': 'Europe/Madrid',
            'valladolid': 'Europe/Madrid',
            'vigo': 'Europe/Madrid',
            'gijon': 'Europe/Madrid',
            'hospitalet': 'Europe/Madrid',
            'la coruna': 'Europe/Madrid',
            'vitoria': 'Europe/Madrid',
            'granada': 'Europe/Madrid',
            'elche': 'Europe/Madrid',
            'tarrasa': 'Europe/Madrid',
            'badalona': 'Europe/Madrid',
            'cartagena': 'Europe/Madrid',
            'jerez': 'Europe/Madrid',
            'sabadell': 'Europe/Madrid',
            'mostoles': 'Europe/Madrid',
            'alcala de henares': 'Europe/Madrid',
            'pamplona': 'Europe/Madrid',
            'fuenlabrada': 'Europe/Madrid',
            'almeria': 'Europe/Madrid',
            'san sebastian': 'Europe/Madrid',
            'leganes': 'Europe/Madrid',
            'santander': 'Europe/Madrid',
            'castellon': 'Europe/Madrid',
            'burgos': 'Europe/Madrid',
            'albacete': 'Europe/Madrid',
            'alcorcon': 'Europe/Madrid',
            'getafe': 'Europe/Madrid',
            'salamanca': 'Europe/Madrid',
            'huelva': 'Europe/Madrid',
            'marbella': 'Europe/Madrid',
            'logrono': 'Europe/Madrid',
            'tarragona': 'Europe/Madrid',
            'leon': 'Europe/Madrid',
            'cadiz': 'Europe/Madrid',
            'laredo': 'Europe/Madrid',
            'jaen': 'Europe/Madrid',
            'orensa': 'Europe/Madrid',
            'gerona': 'Europe/Madrid',
            'lugo': 'Europe/Madrid',
            'caceres': 'Europe/Madrid',
            'toledo': 'Europe/Madrid',
            'ceuta': 'Europe/Madrid',
            'girona': 'Europe/Madrid',
            'moscow': 'Europe/Moscow',
            'russia': 'Europe/Moscow',
            'saint petersburg': 'Europe/Moscow',
            'novosibirsk': 'Asia/Novosibirsk',
            'yekaterinburg': 'Asia/Yekaterinburg',
            'kazan': 'Europe/Moscow',
            'nizhny novgorod': 'Europe/Moscow',
            'chelyabinsk': 'Asia/Yekaterinburg',
            'samara': 'Europe/Samara',
            'omsk': 'Asia/Omsk',
            'rostov': 'Europe/Moscow',
            'ufa': 'Asia/Yekaterinburg',
            'krasnoyarsk': 'Asia/Krasnoyarsk',
            'perm': 'Asia/Yekaterinburg',
            'voronezh': 'Europe/Moscow',
            'volgograd': 'Europe/Moscow',
            'krasnodar': 'Europe/Moscow',
            'saratov': 'Europe/Samara',
            'tyumen': 'Asia/Yekaterinburg',
            'tolyatti': 'Europe/Moscow',
            'izhevsk': 'Asia/Yekaterinburg',
            'barnaul': 'Asia/Novosibirsk',
            'ulyanovsk': 'Europe/Moscow',
            'irkutsk': 'Asia/Irkutsk',
            'khabarovsk': 'Asia/Vladivostok',
            'yaroslavl': 'Europe/Moscow',
            'vladivostok': 'Asia/Vladivostok',
            'makhachkala': 'Europe/Moscow',
            'tomsk': 'Asia/Novosibirsk',
            'orenburg': 'Asia/Yekaterinburg',
            'kemerovo': 'Asia/Novosibirsk',
            'novokuznetsk': 'Asia/Novosibirsk',
            'ryazan': 'Europe/Moscow',
            'astrahan': 'Europe/Moscow',
            'naberezhnye chelny': 'Europe/Moscow',
            'penza': 'Europe/Moscow',
            'lipetsk': 'Europe/Moscow',
            'kirov': 'Europe/Moscow',
            'cheboksary': 'Europe/Moscow',
            'tula': 'Europe/Moscow',
            'kaliningrad': 'Europe/Kaliningrad',
            'balashikha': 'Europe/Moscow',
            'krasnogorsk': 'Europe/Moscow',
            'podolsk': 'Europe/Moscow',
            'khimki': 'Europe/Moscow',
            'elektrostal': 'Europe/Moscow',
            'odintsovo': 'Europe/Moscow',
            'korolyov': 'Europe/Moscow',
            'lyubertsy': 'Europe/Moscow',
            'domodedovo': 'Europe/Moscow',
            'reutov': 'Europe/Moscow',
            'zelenograd': 'Europe/Moscow',
            'ramenskoye': 'Europe/Moscow',
            'pushkino': 'Europe/Moscow',
            'dolgoprudny': 'Europe/Moscow',
            'klimovsk': 'Europe/Moscow',
            'vidnoye': 'Europe/Moscow',
            'troitsk': 'Europe/Moscow',
            'lobnya': 'Europe/Moscow',
            'dzerzhinsky': 'Europe/Moscow',
            'krasnoznamensk': 'Europe/Moscow',
            'kotelniki': 'Europe/Moscow',
            'lytkarino': 'Europe/Moscow',
            'butovo': 'Europe/Moscow',
            'shcherbinka': 'Europe/Moscow',
            'podolsk': 'Europe/Moscow',
            'khimki': 'Europe/Moscow',
            'elektrostal': 'Europe/Moscow',
            'odintsovo': 'Europe/Moscow',
            'korolyov': 'Europe/Moscow',
            'lyubertsy': 'Europe/Moscow',
            'domodedovo': 'Europe/Moscow',
            'reutov': 'Europe/Moscow',
            'zelenograd': 'Europe/Moscow',
            'ramenskoye': 'Europe/Moscow',
            'pushkino': 'Europe/Moscow',
            'dolgoprudny': 'Europe/Moscow',
            'klimovsk': 'Europe/Moscow',
            'vidnoye': 'Europe/Moscow',
            'troitsk': 'Europe/Moscow',
            'lobnya': 'Europe/Moscow',
            'dzerzhinsky': 'Europe/Moscow',
            'krasnoznamensk': 'Europe/Moscow',
            'kotelniki': 'Europe/Moscow',
            'lytkarino': 'Europe/Moscow',
            'butovo': 'Europe/Moscow',
            'shcherbinka': 'Europe/Moscow',
            'beijing': 'Asia/Shanghai',
            'china': 'Asia/Shanghai',
            'seoul': 'Asia/Seoul',
            'korea': 'Asia/Seoul',
            'sydney': 'Australia/Sydney',
            'australia': 'Australia/Sydney',
            'mumbai': 'Asia/Kolkata',
            'india': 'Asia/Kolkata',
            'delhi': 'Asia/Kolkata',
            'dubai': 'Asia/Dubai',
            'uae': 'Asia/Dubai',
            'singapore': 'Asia/Singapore',
            'bangkok': 'Asia/Bangkok',
            'thailand': 'Asia/Bangkok',
            'jakarta': 'Asia/Jakarta',
            'indonesia': 'Asia/Jakarta',
            'manila': 'Asia/Manila',
            'philippines': 'Asia/Manila',
            'hanoi': 'Asia/Ho_Chi_Minh',
            'vietnam': 'Asia/Ho_Chi_Minh',
            'kuala lumpur': 'Asia/Kuala_Lumpur',
            'malaysia': 'Asia/Kuala_Lumpur',
            'melaka': 'Asia/Kuala_Lumpur',
            'malacca': 'Asia/Kuala_Lumpur',
            'cyberjaya': 'Asia/Kuala_Lumpur',
            'putrajaya': 'Asia/Kuala_Lumpur',
            'shah alam': 'Asia/Kuala_Lumpur',
            'petaling jaya': 'Asia/Kuala_Lumpur',
            'subang jaya': 'Asia/Kuala_Lumpur',
            'klang': 'Asia/Kuala_Lumpur',
            'george town': 'Asia/Kuala_Lumpur',
            'penang': 'Asia/Kuala_Lumpur',
            'ipoh': 'Asia/Kuala_Lumpur',
            'johor bahru': 'Asia/Kuala_Lumpur',
            'johor': 'Asia/Kuala_Lumpur',
            'alor setar': 'Asia/Kuala_Lumpur',
            'kota kinabalu': 'Asia/Kuala_Lumpur',
            'kuching': 'Asia/Kuala_Lumpur',
            'miri': 'Asia/Kuala_Lumpur',
            'sibu': 'Asia/Kuala_Lumpur',
            'sandakan': 'Asia/Kuala_Lumpur',
            'taiping': 'Asia/Kuala_Lumpur',
            'seremban': 'Asia/Kuala_Lumpur',
            'nilai': 'Asia/Kuala_Lumpur',
            'port dickson': 'Asia/Kuala_Lumpur',
            'malacca city': 'Asia/Kuala_Lumpur',
            'dhaka': 'Asia/Dhaka',
            'bangladesh': 'Asia/Dhaka',
            'tangail': 'Asia/Dhaka',
            'tangail city': 'Asia/Dhaka',
            'chittagong': 'Asia/Dhaka',
            'sylhet': 'Asia/Dhaka',
            'rajshahi': 'Asia/Dhaka',
            'khulna': 'Asia/Dhaka',
            'barisal': 'Asia/Dhaka',
            'rangpur': 'Asia/Dhaka',
            'mymensingh': 'Asia/Dhaka',
            'comilla': 'Asia/Dhaka',
            'jessore': 'Asia/Dhaka',
            'bogra': 'Asia/Dhaka',
            'dinajpur': 'Asia/Dhaka',
            'pabna': 'Asia/Dhaka',
            'kustia': 'Asia/Dhaka',
            'faridpur': 'Asia/Dhaka',
            'gopalganj': 'Asia/Dhaka',
            'madaripur': 'Asia/Dhaka',
            'shariatpur': 'Asia/Dhaka',
            'rajbari': 'Asia/Dhaka',
            'magura': 'Asia/Dhaka',
            'jhenaidah': 'Asia/Dhaka',
            'narail': 'Asia/Dhaka',
            'satkhira': 'Asia/Dhaka',
            'bagerhat': 'Asia/Dhaka',
            'pirojpur': 'Asia/Dhaka',
            'barguna': 'Asia/Dhaka',
            'patuakhali': 'Asia/Dhaka',
            'bhola': 'Asia/Dhaka',
            'lakshmipur': 'Asia/Dhaka',
            'noakhali': 'Asia/Dhaka',
            'feni': 'Asia/Dhaka',
            'chandpur': 'Asia/Dhaka',
            'lakshmipur': 'Asia/Dhaka',
            'cox\'s bazar': 'Asia/Dhaka',
            'coxs bazar': 'Asia/Dhaka',
            'bandarban': 'Asia/Dhaka',
            'rangamati': 'Asia/Dhaka',
            'khagrachari': 'Asia/Dhaka',
            'kolkata': 'Asia/Kolkata',
            'calcutta': 'Asia/Kolkata',
            'chennai': 'Asia/Kolkata',
            'madras': 'Asia/Kolkata',
            'hyderabad': 'Asia/Kolkata',
            'bangalore': 'Asia/Kolkata',
            'bengaluru': 'Asia/Kolkata',
            'pune': 'Asia/Kolkata',
            'ahmedabad': 'Asia/Kolkata',
            'surat': 'Asia/Kolkata',
            'jaipur': 'Asia/Kolkata',
            'lucknow': 'Asia/Kolkata',
            'kanpur': 'Asia/Kolkata',
            'nagpur': 'Asia/Kolkata',
            'indore': 'Asia/Kolkata',
            'thane': 'Asia/Kolkata',
            'bhopal': 'Asia/Kolkata',
            'visakhapatnam': 'Asia/Kolkata',
            'patna': 'Asia/Kolkata',
            'vadodara': 'Asia/Kolkata',
            'ghaziabad': 'Asia/Kolkata',
            'ludhiana': 'Asia/Kolkata',
            'agra': 'Asia/Kolkata',
            'nashik': 'Asia/Kolkata',
            'ranchi': 'Asia/Kolkata',
            'howrah': 'Asia/Kolkata',
            'coimbatore': 'Asia/Kolkata',
            'raipur': 'Asia/Kolkata',
            'jabalpur': 'Asia/Kolkata',
            'gwalior': 'Asia/Kolkata',
            'vijayawada': 'Asia/Kolkata',
            'jodhpur': 'Asia/Kolkata',
            'madurai': 'Asia/Kolkata',
            'guwahati': 'Asia/Kolkata',
            'chandigarh': 'Asia/Kolkata',
            'amritsar': 'Asia/Kolkata',
            'allahabad': 'Asia/Kolkata',
            'rohtak': 'Asia/Kolkata',
            'ranchi': 'Asia/Kolkata',
            'mysore': 'Asia/Kolkata',
            'aurangabad': 'Asia/Kolkata',
            'solapur': 'Asia/Kolkata',
            'bhubaneswar': 'Asia/Kolkata',
            'jamshedpur': 'Asia/Kolkata',
            'bhubaneshwar': 'Asia/Kolkata',
            'varanasi': 'Asia/Kolkata',
            'srinagar': 'Asia/Kolkata',
            'salem': 'Asia/Kolkata',
            'warangal': 'Asia/Kolkata',
            'dhanbad': 'Asia/Kolkata',
            'guntur': 'Asia/Kolkata',
            'amravati': 'Asia/Kolkata',
            'noida': 'Asia/Kolkata',
            'bhiwandi': 'Asia/Kolkata',
            'bhavnagar': 'Asia/Kolkata',
            'tiruchirappalli': 'Asia/Kolkata',
            'kota': 'Asia/Kolkata',
            'ajmer': 'Asia/Kolkata',
            'bhubaneswar': 'Asia/Kolkata',
            'nairobi': 'Africa/Nairobi',
            'kenya': 'Africa/Nairobi',
            'lagos': 'Africa/Lagos',
            'nigeria': 'Africa/Lagos',
            'cairo': 'Africa/Cairo',
            'egypt': 'Africa/Cairo',
            'johannesburg': 'Africa/Johannesburg',
            'south africa': 'Africa/Johannesburg',
            'mexico city': 'America/Mexico_City',
            'mexico': 'America/Mexico_City',
            'sao paulo': 'America/Sao_Paulo',
            'brazil': 'America/Sao_Paulo',
            'buenos aires': 'America/Argentina/Buenos_Aires',
            'argentina': 'America/Argentina/Buenos_Aires',
            'toronto': 'America/Toronto',
            'canada': 'America/Toronto',
            'vancouver': 'America/Vancouver',
            'montreal': 'America/Montreal',
            'calgary': 'America/Edmonton',
            'edmonton': 'America/Edmonton',
            'ottawa': 'America/Toronto',
            'winnipeg': 'America/Winnipeg',
            'halifax': 'America/Halifax',
            'st johns': 'America/St_Johns',
            'newfoundland': 'America/St_Johns',
            'victoria': 'America/Vancouver',
            'saskatoon': 'America/Regina',
            'regina': 'America/Regina',
            'quebec': 'America/Toronto',
            'quebec city': 'America/Toronto',
            'hamilton': 'America/Toronto',
            'kitchener': 'America/Toronto',
            'waterloo': 'America/Toronto',
            'london ontario': 'America/Toronto',
            'windsor': 'America/Toronto',
            'kingston': 'America/Toronto',
            'sudbury': 'America/Toronto',
            'thunder bay': 'America/Toronto',
            'saint john': 'America/Halifax',
            'fredericton': 'America/Halifax',
            'charlottetown': 'America/Halifax',
            'whitehorse': 'America/Whitehorse',
            'yellowknife': 'America/Yellowknife',
            'iqaluit': 'America/Iqaluit',
            'nunavut': 'America/Iqaluit',
            'yukon': 'America/Whitehorse',
            'northwest territories': 'America/Yellowknife',
            'chicago': 'America/Chicago',
            'houston': 'America/Chicago',
            'dallas': 'America/Chicago',
            'fort worth': 'America/Chicago',
            'austin': 'America/Chicago',
            'san antonio': 'America/Chicago',
            'el paso': 'America/Denver',
            'arlington': 'America/Chicago',
            'corpus christi': 'America/Chicago',
            'plano': 'America/Chicago',
            'laredo': 'America/Chicago',
            'lubbock': 'America/Chicago',
            'garland': 'America/Chicago',
            'irving': 'America/Chicago',
            'amarillo': 'America/Chicago',
            'grand prairie': 'America/Chicago',
            'brownsville': 'America/Chicago',
            'pasadena': 'America/Chicago',
            'mckinney': 'America/Chicago',
            'mesa': 'America/Phoenix',
            'tucson': 'America/Phoenix',
            'chandler': 'America/Phoenix',
            'scottsdale': 'America/Phoenix',
            'glendale': 'America/Phoenix',
            'gilbert': 'America/Phoenix',
            'tempe': 'America/Phoenix',
            'peoria': 'America/Phoenix',
            'surprise': 'America/Phoenix',
            'yuma': 'America/Phoenix',
            'avondale': 'America/Phoenix',
            'goodyear': 'America/Phoenix',
            'flagstaff': 'America/Phoenix',
            'buckeye': 'America/Phoenix',
            'casa grande': 'America/Phoenix',
            'lake havasu city': 'America/Phoenix',
            'maricopa': 'America/Phoenix',
            'oregon': 'America/Los_Angeles',
            'portland': 'America/Los_Angeles',
            'salem': 'America/Los_Angeles',
            'eugene': 'America/Los_Angeles',
            'gresham': 'America/Los_Angeles',
            'hillsboro': 'America/Los_Angeles',
            'beaverton': 'America/Los_Angeles',
            'bend': 'America/Los_Angeles',
            'medford': 'America/Los_Angeles',
            'springfield': 'America/Los_Angeles',
            'corvallis': 'America/Los_Angeles',
            'albany': 'America/Los_Angeles',
            'tigard': 'America/Los_Angeles',
            'lake oswego': 'America/Los_Angeles',
            'keizer': 'America/Los_Angeles',
            'grant\'s pass': 'America/Los_Angeles',
            'oregon city': 'America/Los_Angeles',
            'miami': 'America/New_York',
            'florida': 'America/New_York',
            'orlando': 'America/New_York',
            'tampa': 'America/New_York',
            'jacksonville': 'America/New_York',
            'fort lauderdale': 'America/New_York',
            'tallahassee': 'America/New_York',
            'gainesville': 'America/New_York',
            'daytona beach': 'America/New_York',
            'clearwater': 'America/New_York',
            'coral springs': 'America/New_York',
            'cape coral': 'America/New_York',
            'port st lucie': 'America/New_York',
            'sarasota': 'America/New_York',
            'palm bay': 'America/New_York',
            'pompano beach': 'America/New_York',
            'hollywood': 'America/New_York',
            'gainesville': 'America/New_York',
            'lakeland': 'America/New_York',
            'bradenton': 'America/New_York',
            'fort myers': 'America/New_York',
            'kissimmee': 'America/New_York',
            'boynton beach': 'America/New_York',
            'delray beach': 'America/New_York',
            'boca raton': 'America/New_York',
            'west palm beach': 'America/New_York',
            'palm beach': 'America/New_York',
            'naples': 'America/New_York',
            'melbourne': 'America/New_York',
            'daytona': 'America/New_York',
            'kissimmee': 'America/New_York',
            'seattle': 'America/Los_Angeles',
            'washington': 'America/Los_Angeles',
            'spokane': 'America/Los_Angeles',
            'tacoma': 'America/Los_Angeles',
            'vancouver wa': 'America/Los_Angeles',
            'bellevue': 'America/Los_Angeles',
            'kent': 'America/Los_Angeles',
            'everett': 'America/Los_Angeles',
            'renton': 'America/Los_Angeles',
            'yakima': 'America/Los_Angeles',
            'spokane valley': 'America/Los_Angeles',
            'federal way': 'America/Los_Angeles',
            'bellingham': 'America/Los_Angeles',
            'kennewick': 'America/Los_Angeles',
            'auburn': 'America/Los_Angeles',
            'pasco': 'America/Los_Angeles',
            'marysville': 'America/Los_Angeles',
            'lakewood': 'America/Los_Angeles',
            'redmond': 'America/Los_Angeles',
            'shoreline': 'America/Los_Angeles',
            'richland': 'America/Los_Angeles',
            'olympia': 'America/Los_Angeles',
            'lynnwood': 'America/Los_Angeles',
            'bremerton': 'America/Los_Angeles',
            'kennewick': 'America/Los_Angeles',
            'puyallup': 'America/Los_Angeles',
            'denver': 'America/Denver',
            'colorado': 'America/Denver',
            'colorado springs': 'America/Denver',
            'aurora': 'America/Denver',
            'fort collins': 'America/Denver',
            'lakewood': 'America/Denver',
            'thornton': 'America/Denver',
            'arvada': 'America/Denver',
            'westminster': 'America/Denver',
            'pueblo': 'America/Denver',
            'boulder': 'America/Denver',
            'greeley': 'America/Denver',
            'longmont': 'America/Denver',
            'grand junction': 'America/Denver',
            'loveland': 'America/Denver',
            'broomfield': 'America/Denver',
            'castle rock': 'America/Denver',
            'commerce city': 'America/Denver',
            'parker': 'America/Denver',
            'littleton': 'America/Denver',
            'northglenn': 'America/Denver',
            'westminster': 'America/Denver',
            'wheat ridge': 'America/Denver',
            'englewood': 'America/Denver',
            'centennial': 'America/Denver',
            'highlands ranch': 'America/Denver',
            'phoenix': 'America/Phoenix',
            'arizona': 'America/Phoenix',
            'anchorage': 'America/Anchorage',
            'alaska': 'America/Anchorage',
            'fairbanks': 'America/Anchorage',
            'juneau': 'America/Anchorage',
            'sitka': 'America/Anchorage',
            'ketchikan': 'America/Anchorage',
            'kenai': 'America/Anchorage',
            'kodiak': 'America/Anchorage',
            'bethel': 'America/Anchorage',
            'kodiak': 'America/Anchorage',
            'palmer': 'America/Anchorage',
            'wasilla': 'America/Anchorage',
            'kenai': 'America/Anchorage',
            'kodiak': 'America/Anchorage',
            'honolulu': 'Pacific/Honolulu',
            'hawaii': 'Pacific/Honolulu',
            'hilo': 'Pacific/Honolulu',
            'kailua': 'Pacific/Honolulu',
            'kapolei': 'Pacific/Honolulu',
            'ewa beach': 'Pacific/Honolulu',
            'mililani town': 'Pacific/Honolulu',
            'kihei': 'Pacific/Honolulu',
            'maui': 'Pacific/Honolulu',
            'kailua kona': 'Pacific/Honolulu',
            'kaneohe': 'Pacific/Honolulu',
            'ewa': 'Pacific/Honolulu',
            'mililani': 'Pacific/Honolulu',
            'kahului': 'Pacific/Honolulu',
            'kihei': 'Pacific/Honolulu',
            'lahaina': 'Pacific/Honolulu',
            'waipahu': 'Pacific/Honolulu',
            'pearl city': 'Pacific/Honolulu',
            'waimalu': 'Pacific/Honolulu',
            'nanakuli': 'Pacific/Honolulu',
            'kailua': 'Pacific/Honolulu',
            'wahiawa': 'Pacific/Honolulu',
            'schofield barracks': 'Pacific/Honolulu',
            'wailuku': 'Pacific/Honolulu',
            'waianae': 'Pacific/Honolulu',
            'kaneohe': 'Pacific/Honolulu',
            'makakilo city': 'Pacific/Honolulu',
            'ewa': 'Pacific/Honolulu',
            'mililani': 'Pacific/Honolulu',
            'kahului': 'Pacific/Honolulu',
            'kihei': 'Pacific/Honolulu',
            'lahaina': 'Pacific/Honolulu',
            'waipahu': 'Pacific/Honolulu',
            'pearl city': 'Pacific/Honolulu',
            'waimalu': 'Pacific/Honolulu',
            'nanakuli': 'Pacific/Honolulu',
            'kailua': 'Pacific/Honolulu',
            'wahiawa': 'Pacific/Honolulu',
            'schofield barracks': 'Pacific/Honolulu',
            'wailuku': 'Pacific/Honolulu',
            'waianae': 'Pacific/Honolulu',
            'kaneohe': 'Pacific/Honolulu',
            'makakilo city': 'Pacific/Honolulu'
        };
        
        // Check if the message contains a timezone
        for (const [location, timezone] of Object.entries(timezoneMap)) {
            if (lowerMessage.includes(location)) {
                try {
                    const now = new Date();
                    const timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
                    
                    const hours = timeInTimezone.getHours();
                    const minutes = timeInTimezone.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const displayHours = hours % 12 || 12;
                    const displayMinutes = minutes.toString().padStart(2, '0');
                    
                    // Get timezone offset for display
                    const localTime = new Date();
                    const timezoneTime = new Date(localTime.toLocaleString('en-US', { timeZone: timezone }));
                    const offsetHours = Math.round((timezoneTime.getTime() - localTime.getTime()) / (1000 * 60 * 60));
                    
                    let offsetText = '';
                    if (offsetHours > 0) {
                        offsetText = ` (${offsetHours} hours ahead)`;
                    } else if (offsetHours < 0) {
                        offsetText = ` (${Math.abs(offsetHours)} hours behind)`;
                    } else {
                        offsetText = ' (same time)';
                    }
                    
                    return `The current time in ${location.charAt(0).toUpperCase() + location.slice(1)} is ${displayHours}:${displayMinutes} ${ampm}${offsetText}.`;
                } catch (error) {
                    return `I'm sorry, I couldn't get the time for ${location}. Please try a different location.`;
                }
            }
        }
        
        return null;
    }
    
    handleDateQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for timezone-specific date queries first
        const timezoneDateResult = this.handleTimezoneDateQuery(message);
        if (timezoneDateResult) {
            return timezoneDateResult;
        }
        
        // Check for various date and day queries
        const dateKeywords = [
            'what day is today',
            'what day is it today',
            'what day is it',
            'what day today',
            'today is what day',
            'what day of the week',
            'what day of week',
            'day of the week',
            'day of week',
            'what date is today',
            'what date today',
            'today\'s date',
            'todays date',
            'what is today\'s date',
            'what is todays date',
            'current date',
            'today\'s day',
            'todays day',
            'what is the date',
            'what\'s the date',
            'whats the date',
            'date today',
            'today date',
            'current day',
            'what day',
            'what date',
            'day today',
            'date',
            'day'
        ];
        
        // Check for combined day and time queries
        const combinedKeywords = [
            'day and time',
            'time and day',
            'date and time',
            'time and date',
            'day time',
            'time day',
            'date time',
            'time date'
        ];
        
        const hasCombinedKeyword = combinedKeywords.some(keyword => 
            lowerMessage.includes(keyword)
        );
        
        if (hasCombinedKeyword) {
            return this.handleCombinedDateTimeQuery(message);
        }
        
        // Check if the message contains date-related keywords
        const hasDateKeyword = dateKeywords.some(keyword => 
            lowerMessage.includes(keyword)
        );
        
        if (!hasDateKeyword) {
            return null;
        }
        
        // Get current date information
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayOfWeek = days[now.getDay()];
        const month = months[now.getMonth()];
        const date = now.getDate();
        const year = now.getFullYear();
        
        // Add ordinal suffix to date
        const getOrdinalSuffix = (day) => {
            if (day >= 11 && day <= 13) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        
        const ordinalDate = date + getOrdinalSuffix(date);
        
        // Create response based on the type of date query
        if (lowerMessage.includes('day') && !lowerMessage.includes('date')) {
            // User is asking about the day of the week
            return `Today is ${dayOfWeek}.`;
        } else if (lowerMessage.includes('date') && !lowerMessage.includes('day')) {
            // User is asking about the full date
            return `Today's date is ${dayOfWeek}, ${month} ${ordinalDate}, ${year}.`;
        } else {
            // User is asking about both day and date, or general date query
            return `Today is ${dayOfWeek}, ${month} ${ordinalDate}, ${year}.`;
        }
    }
    
    handleContextualQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Intelligent context understanding patterns
        const contextPatterns = [
            // Questions about capabilities
            {
                patterns: ['what can you do', 'what are you capable of', 'what do you do', 'help', 'capabilities', 'features'],
                response: `I'm Ven, your AI assistant! I can help you with:

🤖 **Conversation & Chat**
- Friendly greetings and casual conversation
- Answer questions and provide information
- Translate text between 70+ languages
- Solve math problems and calculations

⏰ **Time & Date**
- Tell you the current time and date
- Timezone-specific time queries
- Age calculations from birth year

🍳 **Cooking & Recipes**
- Step-by-step cooking instructions
- Recipes from Italian, Spanish, Mexican, Malaysian, and Bangladeshi cuisines
- Basic cooking techniques

🧮 **Calculations**
- Mathematical expressions
- Age calculations
- Simple computations

💬 **General Knowledge**
- Answer questions about various topics
- Provide helpful information
- Engage in friendly conversation

Just ask me anything! I'm here to help make your day easier and more enjoyable! 😊`
            },
            
            // Self-awareness questions
            {
                patterns: ['who are you', 'what are you', 'tell me about yourself', 'your name', 'what is your name'],
                response: `I'm Ven, your friendly AI assistant! 🤖

I'm designed to be helpful, conversational, and knowledgeable. I can assist with various tasks like answering questions, providing recipes, helping with calculations, translating languages, and just being a good chat companion.

I aim to be:
- **Helpful** - Providing useful information and assistance
- **Friendly** - Engaging in warm, conversational interactions
- **Knowledgeable** - Sharing information across many topics
- **Reliable** - Giving accurate and helpful responses

I'm here to make your interactions more enjoyable and productive! What would you like to know or do? 😊`
            },
            
            // Creator questions
            {
                patterns: ['who made you', 'who created you', 'who built you', 'who developed you', 'who programmed you', 'who designed you', 'who is your creator', 'who is your developer', 'who is your programmer'],
                response: `I was created by <strong>Nahin Bin Monir</strong>, a developer and programmer! 🤖

Nahin is a developer who loves creating useful applications and AI assistants like me. He designed me to be helpful, friendly, and knowledgeable across many topics.

You can learn more about Nahin and his work at his website: <strong><a href="https://nahin.space/" target="_blank">https://nahin.space/</a></strong>

I'm here to assist you with various tasks like answering questions, providing recipes, helping with calculations, translating languages, and just being a good conversation partner. What would you like to know or how can I help you today? 😊`
            },
            
            // Clarification requests
            {
                patterns: ['i don\'t understand', 'what do you mean', 'can you explain', 'i\'m confused', 'clarify', 'what does that mean'],
                response: `I'd be happy to clarify! 😊

Could you please rephrase your question or let me know what specific part you'd like me to explain further? I want to make sure I give you the most helpful and accurate response possible.

Feel free to ask in a different way or break down your question into smaller parts - I'm here to help! 🤝`
            },
            
            // Thank you responses
            {
                patterns: ['thank you', 'thanks', 'thank you so much', 'thanks a lot', 'appreciate it', 'grateful'],
                response: `You're very welcome! 😊 It's my pleasure to help you. 

Is there anything else you'd like to know or any other way I can assist you today? I'm here whenever you need me! 🤝`
            },
            
            // Goodbye responses
            {
                patterns: ['goodbye', 'bye', 'see you', 'talk to you later', 'have a good day', 'take care'],
                response: `Goodbye! 👋 It was great chatting with you today. 

Feel free to come back anytime - I'm always here to help and chat! Have a wonderful day ahead! 😊`
            },
            
            // Confusion about responses
            {
                patterns: ['that\'s not what i asked', 'that\'s not right', 'you didn\'t answer', 'wrong answer', 'not helpful'],
                response: `I apologize for not understanding your question correctly. 😔

Could you please rephrase your question or provide more context? I want to give you the most accurate and helpful response possible. Sometimes I need a bit more information to understand exactly what you're looking for.

What specifically would you like to know? I'm here to help! 🤝`
            }
        ];
        
        // Check each pattern with more flexible matching
        for (const pattern of contextPatterns) {
            const hasPattern = pattern.patterns.some(p => {
                // Check for exact phrase match
                if (lowerMessage.includes(p)) return true;
                
                // Check for word variations (e.g., "made" vs "created")
                const words = p.split(' ');
                if (words.length > 1) {
                    // For multi-word patterns, check if all words are present
                    return words.every(word => lowerMessage.includes(word));
                }
                
                return false;
            });
            
            if (hasPattern && pattern.response) {
                return pattern.response;
            }
        }
        
        // Enhanced keyword-based understanding
        const enhancedKeywords = {
            // Technology
            'computer': 'Computers are electronic devices that process data and perform calculations. They can be used for work, entertainment, communication, and much more. What specific aspect of computers would you like to know about?',
            'internet': 'The internet is a global network of connected computers that allows people to share information, communicate, and access services worldwide. It\'s revolutionized how we work, learn, and connect with others.',
            'smartphone': 'Smartphones are mobile phones with advanced computing capabilities. They can make calls, send messages, browse the internet, take photos, run apps, and much more.',
            
            // Science
            'gravity': 'Gravity is a fundamental force that attracts objects toward each other. On Earth, it pulls everything toward the center of the planet, which is why things fall down and why we stay on the ground.',
            'photosynthesis': 'Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into oxygen and glucose (sugar). This is how plants make their own food and produce oxygen for other living things.',
            'evolution': 'Evolution is the process by which living things change over time through natural selection. Organisms with traits that help them survive and reproduce pass those traits to their offspring.',
            
            // Health
            'exercise': 'Exercise is physical activity that improves health and fitness. It strengthens muscles, improves cardiovascular health, boosts mood, and helps maintain a healthy weight.',
            'nutrition': 'Nutrition is the science of how food affects health. A balanced diet provides the nutrients your body needs to function properly and stay healthy.',
            'sleep': 'Sleep is essential for health and well-being. It allows your body to rest, repair, and process information. Most adults need 7-9 hours of sleep per night.',
            
            // Education
            'learning': 'Learning is the process of acquiring knowledge, skills, or understanding. It can happen through study, experience, observation, or instruction.',
            'education': 'Education is the process of teaching and learning. It helps people develop knowledge, skills, and understanding that prepare them for life and work.',
            'study': 'Studying is the act of learning or reviewing information. Effective study techniques include reading, taking notes, practicing, and testing yourself.',
            
            // Business
            'business': 'A business is an organization that provides goods or services to customers. Businesses can be small (like a local shop) or large (like multinational corporations).',
            'entrepreneur': 'An entrepreneur is someone who starts and runs their own business. They take risks to create new products, services, or ways of doing things.',
            'marketing': 'Marketing is the process of promoting and selling products or services. It involves understanding customer needs and communicating value effectively.',
            
            // Environment
            'climate change': 'Climate change refers to long-term changes in global weather patterns and temperatures. Human activities, particularly burning fossil fuels, are contributing to these changes.',
            'recycling': 'Recycling is the process of converting waste materials into new products. It helps conserve resources, reduce pollution, and protect the environment.',
            'sustainability': 'Sustainability means meeting current needs without compromising the ability of future generations to meet their own needs. It involves environmental, social, and economic considerations.'
        };
        
        // Check for enhanced keywords
        for (const [keyword, response] of Object.entries(enhancedKeywords)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        return null;
    }
    
    handleContextualResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        console.log('Enhanced contextual analysis:', {
            waitingFor: this.conversationContext.waitingFor,
            currentTopic: this.conversationContext.currentTopic,
            lastQuestion: this.conversationContext.lastQuestion,
            userMood: this.conversationContext.userMood,
            emotion: this.conversationContext.emotion,
            topicHistory: this.conversationContext.topicHistory,
            conversationLength: this.conversationContext.conversationHistory.length
        });
        
        // Check if we're waiting for a specific response
        if (this.conversationContext.waitingFor && this.conversationContext.waitingFor !== null) {
            console.log('Waiting for:', this.conversationContext.waitingFor);
            return this.handleWaitingResponse(message);
        }
        
        // Enhanced contextual responses based on conversation history and mood
        if (this.conversationContext.lastQuestion) {
            const lastQuestion = this.conversationContext.lastQuestion.toLowerCase();
            const userMood = this.conversationContext.userMood;
            
            // Handle wellbeing questions with mood-aware responses
            if (lastQuestion.includes('how are you') || lastQuestion.includes('how do you feel') || lastQuestion.includes('how\'s it going')) {
                if (userMood === 'very_positive' || lowerMessage.includes('amazing') || lowerMessage.includes('fantastic')) {
                    this.conversationContext.lastQuestion = null;
                    return "Wow, that sounds absolutely amazing! 🌟 I'm so happy to hear you're feeling fantastic! What's making your day so special?";
                } else if (userMood === 'positive' || lowerMessage === 'good' || lowerMessage === 'great' || lowerMessage === 'fine') {
                    this.conversationContext.lastQuestion = null;
                    return "That's wonderful! 😊 I'm glad you're doing well. What would you like to talk about?";
                } else if (userMood === 'neutral' || lowerMessage === 'okay' || lowerMessage === 'alright') {
                    this.conversationContext.lastQuestion = null;
                    return "That's okay! Sometimes neutral is perfectly fine. 😊 Is there anything that might make your day better?";
                } else if (userMood === 'negative' || lowerMessage === 'bad' || lowerMessage === 'not good') {
                    this.conversationContext.lastQuestion = null;
                    return "I'm sorry to hear that! 😔 What's going on? I'm here to listen if you want to talk about it.";
                } else if (userMood === 'very_negative' || lowerMessage.includes('terrible') || lowerMessage.includes('awful')) {
                    this.conversationContext.lastQuestion = null;
                    return "I'm really sorry you're feeling that way! 💙 That sounds really tough. Would you like to talk about what's happening? I'm here to listen.";
                }
            }
            
            // Handle topic-specific questions
            if (lastQuestion.includes('what do you do') || lastQuestion.includes('what are you doing')) {
                if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('office')) {
                    this.conversationContext.lastQuestion = null;
                    this.conversationContext.currentTopic = 'work';
                    return "Work can be both challenging and rewarding! 💼 How's your work day going? Any interesting projects you're working on?";
                } else if (lowerMessage.includes('study') || lowerMessage.includes('school') || lowerMessage.includes('learn')) {
                    this.conversationContext.lastQuestion = null;
                    this.conversationContext.currentTopic = 'education';
                    return "Learning is such an exciting journey! 📚 What are you studying? I'd love to hear about your educational interests!";
                }
            }
        }
        
        // Topic continuity - if we've been talking about a specific topic
        if (this.conversationContext.currentTopic && this.conversationContext.topicHistory.length > 0) {
            const currentTopic = this.conversationContext.currentTopic;
            const recentTopics = this.conversationContext.topicHistory.slice(-3);
            
            if (currentTopic === 'work' && (lowerMessage.includes('meeting') || lowerMessage.includes('project') || lowerMessage.includes('boss'))) {
                return "Work dynamics can be complex! 🤝 How are things going with your colleagues and projects?";
            } else if (currentTopic === 'education' && (lowerMessage.includes('class') || lowerMessage.includes('teacher') || lowerMessage.includes('exam'))) {
                return "Education is such a valuable investment in yourself! 🎓 How are your studies progressing?";
            } else if (currentTopic === 'technology' && (lowerMessage.includes('computer') || lowerMessage.includes('phone') || lowerMessage.includes('app'))) {
                return "Technology is constantly evolving! 💻 What tech are you most excited about these days?";
            }
        }
        
        // Emotion-aware responses for standalone statements
        if (this.conversationContext.userMood && !this.conversationContext.lastQuestion) {
            if (this.conversationContext.userMood === 'very_positive') {
                return "Your enthusiasm is contagious! 🌟 I can feel your positive energy! What's making you feel so amazing today?";
            } else if (this.conversationContext.userMood === 'positive') {
                return "That's great to hear! 😊 What would you like to chat about?";
            } else if (this.conversationContext.userMood === 'negative') {
                return "I sense you might be having a tough time. 😔 Would you like to talk about what's on your mind? I'm here to listen.";
            } else if (this.conversationContext.userMood === 'very_negative') {
                return "I'm really concerned about how you're feeling. 💙 Sometimes talking helps. Would you like to share what's going on?";
            }
        }
        
        // Conversation flow analysis
        if (this.conversationContext.conversationHistory.length >= 3) {
            const recentMessages = this.conversationContext.conversationHistory.slice(-3);
            const questionCount = recentMessages.filter(msg => msg.type === 'question').length;
            
            // If user has been asking many questions, offer to help
            if (questionCount >= 2) {
                return "I notice you've been asking a lot of questions! 🤔 Is there something specific you're trying to figure out? I'm happy to help!";
            }
        }
        
        // Check for age guessing game
        if (lowerMessage.includes('guess my age') || lowerMessage.includes('what\'s my age')) {
            this.conversationContext.waitingFor = 'age';
            this.conversationContext.currentTopic = 'age_guessing';
            return "You tell me! What's your age? 😊";
        }
        
        // Check for name guessing game
        if (lowerMessage.includes('guess my name') || lowerMessage.includes('what\'s my name') || lowerMessage.includes('who am i')) {
            this.conversationContext.waitingFor = 'name';
            this.conversationContext.currentTopic = 'name_guessing';
            return "You tell me! What's your name? 😊";
        }
        
        // Check for other guessing games
        if (lowerMessage.includes('guess') && (lowerMessage.includes('my') || lowerMessage.includes('what'))) {
            this.conversationContext.waitingFor = 'general';
            this.conversationContext.currentTopic = 'guessing_game';
            return "You tell me! What should I guess? 😊";
        }
        
        return null;
    }
    
    handleWaitingResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        console.log('handleWaitingResponse called with:', message);
        console.log('waitingFor:', this.conversationContext.waitingFor);
        
        // Handle age response - only if we're actually waiting for age
        if (this.conversationContext.waitingFor === 'age') {
            console.log('Processing age response');
            const ageMatch = message.match(/^(\d+)$/);
            if (ageMatch) {
                const age = parseInt(ageMatch[1]);
                console.log('Age matched:', age);
                // Validate age is reasonable
                if (age >= 1 && age <= 120) {
                    this.conversationContext.waitingFor = null;
                    this.conversationContext.currentTopic = null;
                    return `You are ${age}! 🎉`;
                }
            }
        }
        
        // Handle name response - only if we're actually waiting for name
        if (this.conversationContext.waitingFor === 'name') {
            const nameMatch = message.match(/^[a-zA-Z]+$/);
            if (nameMatch) {
                const name = message.trim();
                this.conversationContext.waitingFor = null;
                this.conversationContext.currentTopic = null;
                return `Your name is ${name}! Nice to meet you! 😊`;
            }
        }
        
        // Handle general response - only if we're actually waiting for general info
        if (this.conversationContext.waitingFor === 'general') {
            this.conversationContext.waitingFor = null;
            this.conversationContext.currentTopic = null;
            return `Got it! Thanks for telling me! 😊`;
        }
        
        // If we're waiting for something but the response doesn't match, clear the context
        if (this.conversationContext.waitingFor) {
            this.conversationContext.waitingFor = null;
            this.conversationContext.currentTopic = null;
        }
        
        return null;
    }
    
    resetConversationContext() {
        this.conversationContext = {
            currentTopic: null,
            waitingFor: null,
            lastQuestion: null,
            lastResponse: null,
            conversationHistory: [],
            emotion: null,
            topicHistory: [],
            userMood: null,
            conversationFlow: [],
            questionCount: 0,
            responseCount: 0,
            lastInteractionTime: null
        };
    }
    
    getMessageType(message) {
        const lowerMessage = message.toLowerCase();
        
        if (this.isQuestion(message)) return 'question';
        if (this.isGreeting(message)) return 'greeting';
        if (this.isResponse(message)) return 'response';
        if (this.isStatement(message)) return 'statement';
        if (this.isCommand(message)) return 'command';
        
        return 'general';
    }
    
    isQuestion(message) {
        const lowerMessage = message.toLowerCase();
        const questionWords = ['how', 'what', 'when', 'where', 'why', 'who', 'which', 'can', 'could', 'would', 'will', 'do', 'does', 'is', 'are', 'was', 'were'];
        const questionPatterns = [
            /how are you/i,
            /how do you feel/i,
            /how's it going/i,
            /what's up/i,
            /how's your day/i,
            /what are you doing/i,
            /how old are you/i,
            /what's your name/i,
            /where are you from/i,
            /what do you do/i,
            /can you help/i,
            /could you tell me/i,
            /would you like/i,
            /do you know/i,
            /are you/i,
            /is it/i,
            /will you/i
        ];
        
        // Check for question mark
        if (message.includes('?')) return true;
        
        // Check for question words at the beginning
        if (questionWords.some(word => lowerMessage.startsWith(word))) return true;
        
        // Check for question patterns
        if (questionPatterns.some(pattern => pattern.test(message))) return true;
        
        return false;
    }
    
    isGreeting(message) {
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'good night', 'morning', 'afternoon', 'evening', 'night'];
        return greetings.includes(message.toLowerCase().trim());
    }
    
    isResponse(message) {
        const responses = ['good', 'bad', 'okay', 'ok', 'fine', 'great', 'awesome', 'cool', 'nice', 'wow', 'yeah', 'yes', 'no', 'maybe', 'sure', 'alright', 'thanks', 'thank you'];
        return responses.includes(message.toLowerCase().trim());
    }
    
    isStatement(message) {
        const lowerMessage = message.toLowerCase();
        return lowerMessage.length > 10 && !this.isQuestion(message) && !this.isGreeting(message) && !this.isResponse(message);
    }
    
    isCommand(message) {
        const commands = ['help', 'stop', 'start', 'go', 'come', 'get', 'give', 'take', 'make', 'let', 'put', 'set', 'keep', 'hold', 'find', 'look', 'see', 'watch', 'listen', 'hear', 'say', 'tell', 'talk', 'speak'];
        return commands.some(cmd => message.toLowerCase().includes(cmd));
    }
    
    detectEmotion(message) {
        const lowerMessage = message.toLowerCase();
        
        // Positive emotions
        if (lowerMessage.includes('happy') || lowerMessage.includes('joy') || lowerMessage.includes('excited') || lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('wonderful')) {
            return 'positive';
        }
        
        // Negative emotions
        if (lowerMessage.includes('sad') || lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('terrible') || lowerMessage.includes('bad') || lowerMessage.includes('awful')) {
            return 'negative';
        }
        
        // Neutral emotions
        if (lowerMessage.includes('okay') || lowerMessage.includes('fine') || lowerMessage.includes('alright') || lowerMessage.includes('normal')) {
            return 'neutral';
        }
        
        return null;
    }
    
    detectTopic(message) {
        const lowerMessage = message.toLowerCase();
        
        // Technology topics
        if (lowerMessage.includes('computer') || lowerMessage.includes('phone') || lowerMessage.includes('internet') || lowerMessage.includes('app') || lowerMessage.includes('software') || lowerMessage.includes('programming')) {
            return 'technology';
        }
        
        // Health topics
        if (lowerMessage.includes('health') || lowerMessage.includes('sick') || lowerMessage.includes('doctor') || lowerMessage.includes('medicine') || lowerMessage.includes('exercise') || lowerMessage.includes('diet')) {
            return 'health';
        }
        
        // Work topics
        if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('office') || lowerMessage.includes('boss') || lowerMessage.includes('meeting') || lowerMessage.includes('project')) {
            return 'work';
        }
        
        // Education topics
        if (lowerMessage.includes('school') || lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('class') || lowerMessage.includes('teacher') || lowerMessage.includes('student')) {
            return 'education';
        }
        
        // Entertainment topics
        if (lowerMessage.includes('movie') || lowerMessage.includes('music') || lowerMessage.includes('game') || lowerMessage.includes('book') || lowerMessage.includes('tv') || lowerMessage.includes('show')) {
            return 'entertainment';
        }
        
        // Personal topics
        if (lowerMessage.includes('family') || lowerMessage.includes('friend') || lowerMessage.includes('relationship') || lowerMessage.includes('love') || lowerMessage.includes('home') || lowerMessage.includes('life')) {
            return 'personal';
        }
        
        return null;
    }
    
    detectUserMood(message) {
        const lowerMessage = message.toLowerCase();
        
        // Very positive
        if (lowerMessage.includes('amazing') || lowerMessage.includes('fantastic') || lowerMessage.includes('incredible') || lowerMessage.includes('perfect')) {
            return 'very_positive';
        }
        
        // Positive
        if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('wonderful') || lowerMessage.includes('happy')) {
            return 'positive';
        }
        
        // Neutral
        if (lowerMessage.includes('okay') || lowerMessage.includes('fine') || lowerMessage.includes('alright') || lowerMessage.includes('normal')) {
            return 'neutral';
        }
        
        // Negative
        if (lowerMessage.includes('bad') || lowerMessage.includes('terrible') || lowerMessage.includes('awful') || lowerMessage.includes('sad') || lowerMessage.includes('angry')) {
            return 'negative';
        }
        
        // Very negative
        if (lowerMessage.includes('horrible') || lowerMessage.includes('miserable') || lowerMessage.includes('depressed') || lowerMessage.includes('hate')) {
            return 'very_negative';
        }
        
        return null;
    }
    
    updateBotResponseContext(response) {
        const currentTime = new Date();
        
        // Update conversation flow with bot response
        this.conversationContext.conversationFlow.push({
            type: 'bot',
            message: response,
            timestamp: currentTime
        });
        
        // Update last response
        this.conversationContext.lastResponse = response;
        
        // Clear waiting state if we provided a response
        if (this.conversationContext.waitingFor) {
            this.conversationContext.waitingFor = null;
        }
        
        // Clear last question if we responded to it
        if (this.conversationContext.lastQuestion) {
            this.conversationContext.lastQuestion = null;
        }
        
        // Update conversation history with bot response
        this.conversationContext.conversationHistory.push({
            message: response,
            timestamp: currentTime.toISOString(),
            type: 'bot_response',
            emotion: this.detectEmotion(response),
            topic: this.detectTopic(response)
        });
        
        // Keep only last 15 messages
        if (this.conversationContext.conversationHistory.length > 15) {
            this.conversationContext.conversationHistory.shift();
        }
        
        console.log('Updated bot response context:', {
            lastResponse: this.conversationContext.lastResponse,
            conversationLength: this.conversationContext.conversationHistory.length,
            flowLength: this.conversationContext.conversationFlow.length
        });
    }
    
    updateConversationContext(message) {
        const lowerMessage = message.toLowerCase();
        const currentTime = new Date();
        
        // Update conversation history with enhanced metadata
        this.conversationContext.conversationHistory.push({
            message: message,
            timestamp: currentTime.toISOString(),
            type: this.getMessageType(message),
            emotion: this.detectEmotion(message),
            topic: this.detectTopic(message)
        });
        
        // Keep only last 15 messages for context
        if (this.conversationContext.conversationHistory.length > 15) {
            this.conversationContext.conversationHistory.shift();
        }
        
        // Update conversation flow
        this.conversationContext.conversationFlow.push({
            type: 'user',
            message: message,
            timestamp: currentTime
        });
        
        // Update interaction time
        this.conversationContext.lastInteractionTime = currentTime;
        
        // Detect and track topics
        const detectedTopic = this.detectTopic(message);
        if (detectedTopic && !this.conversationContext.topicHistory.includes(detectedTopic)) {
            this.conversationContext.topicHistory.push(detectedTopic);
        }
        
        // Update user mood based on message content
        this.conversationContext.userMood = this.detectUserMood(message);
        
        // Check if this message is a question that expects a response
        if (this.isQuestion(message)) {
            this.conversationContext.lastQuestion = message;
            this.conversationContext.questionCount++;
            console.log('Set last question:', message);
        }
        
        // Track response patterns
        this.conversationContext.responseCount++;
        
        console.log('Enhanced conversation context:', {
            lastQuestion: this.conversationContext.lastQuestion,
            currentTopic: this.conversationContext.currentTopic,
            userMood: this.conversationContext.userMood,
            emotion: this.conversationContext.emotion,
            topicHistory: this.conversationContext.topicHistory,
            historyLength: this.conversationContext.conversationHistory.length,
            questionCount: this.conversationContext.questionCount,
            responseCount: this.conversationContext.responseCount
        });
    }
    
    handleGreetingQuery(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        // Simple greetings that should get friendly responses
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
        if (greetings.includes(lowerMessage)) {
            const responses = [
                "Hello! 👋 How are you doing today?",
                "Hi there! 😊 What's on your mind?",
                "Hey! How's it going? 😄",
                "Hello! How can I help you today? ✨"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Simple responses that should get conversational replies (only if no context)
        const simpleResponses = ['good', 'bad', 'okay', 'ok', 'fine', 'great', 'awesome', 'cool', 'nice', 'wow', 'yeah', 'yes', 'no', 'maybe', 'sure', 'alright'];
        if (simpleResponses.includes(lowerMessage)) {
            // Only give generic responses if there's no conversation context
            if (!this.conversationContext.lastQuestion && this.conversationContext.conversationHistory.length <= 2) {
                if (lowerMessage === 'good') {
                    const responses = [
                        "That's great! 😊 What would you like to talk about?",
                        "Awesome! How can I help you today?",
                        "That's wonderful! What's on your mind? ✨",
                        "Great to hear! What would you like to know? 😄"
                    ];
                    return this.getRandomResponse(responses);
                } else if (lowerMessage === 'bad') {
                    const responses = [
                        "I'm sorry to hear that! 😔 What's going on?",
                        "That's tough! Want to talk about it?",
                        "I'm here for you! What happened?",
                        "That's no good! How can I help? 💙"
                    ];
                    return this.getRandomResponse(responses);
                } else {
                    const responses = [
                        "That's nice! What would you like to chat about?",
                        "Cool! How can I assist you?",
                        "Great! What's on your mind today?",
                        "That's good! What would you like to know? 😊"
                    ];
                    return this.getRandomResponse(responses);
                }
            }
            // If there is context, let the contextual handler deal with it
            return null;
        }
        
        return null;
    }
    
    handleAgeCalculationQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for age calculation patterns
        const agePatterns = [
            /if i was born in (\d{4}) how old (am i|i am) now/i,
            /i was born in (\d{4}) how old (am i|i am) now/i,
            /born in (\d{4}) how old (am i|i am) now/i,
            /if i was born (\d{4}) how old (am i|i am) now/i,
            /i was born (\d{4}) how old (am i|i am) now/i,
            /born (\d{4}) how old (am i|i am) now/i,
            /age if born in (\d{4})/i,
            /age if born (\d{4})/i,
            /how old (am i|i am) if born in (\d{4})/i,
            /how old (am i|i am) if born (\d{4})/i
        ];
        
        for (const pattern of agePatterns) {
            const match = message.match(pattern);
            if (match) {
                const birthYear = parseInt(match[1] || match[2]);
                const currentYear = new Date().getFullYear();
                const age = currentYear - birthYear;
                
                if (age < 0) {
                    return `That birth year (${birthYear}) is in the future! Are you sure about that? 😊`;
                } else if (age > 150) {
                    return `That would make you ${age} years old, which seems unlikely! Are you sure about the birth year ${birthYear}? 😊`;
                } else {
                    return `If you were born in ${birthYear}, you would be ${age} years old now! 🎂`;
                }
            }
        }
        
        return null;
    }
    
    handleCookingQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Common cooking queries
        const cookingQueries = {
            'how to make noodles': `Here's how to make basic noodles! 🍜

**Ingredients:**
- 2 cups all-purpose flour
- 1 egg
- 1/2 cup water
- 1/2 tsp salt

**Instructions:**
1. Mix flour and salt in a bowl
2. Beat egg and water together
3. Gradually add wet ingredients to flour, kneading until smooth
4. Let dough rest for 30 minutes
5. Roll out dough and cut into thin strips
6. Boil in salted water for 3-5 minutes
7. Drain and serve with your favorite sauce!

**Tip:** You can also buy pre-made noodles for convenience! 😊`,

            'how to cook noodles': `Here's how to cook noodles! 🍜

**Basic Cooking Method:**
1. Bring a large pot of water to boil
2. Add salt to the water (about 1 tbsp per gallon)
3. Add noodles and stir gently
4. Cook according to package directions (usually 8-12 minutes)
5. Test for doneness - noodles should be tender but firm
6. Drain and rinse with cold water if making a cold dish
7. Serve with your favorite sauce or broth!

**Cooking Tips:**
- Don't break noodles before cooking
- Stir occasionally to prevent sticking
- Save some pasta water for sauces
- Don't overcook - aim for "al dente" texture 😊`,

            'how to make pasta': `Here's how to make fresh pasta! 🍝

**Ingredients:**
- 2 cups all-purpose flour
- 3 large eggs
- 1/2 tsp salt
- 1 tbsp olive oil

**Instructions:**
1. Mix flour and salt on a clean surface
2. Make a well in the center and add eggs
3. Gradually mix flour into eggs with a fork
4. Knead dough for 10 minutes until smooth
5. Wrap in plastic and rest for 30 minutes
6. Roll out dough and cut into desired shapes
7. Cook in boiling salted water for 2-3 minutes
8. Drain and serve with sauce!

**Popular Shapes:** Spaghetti, fettuccine, lasagna sheets 😊`,

            'how to cook pasta': `Here's how to cook pasta perfectly! 🍝

**Perfect Pasta Method:**
1. Use a large pot with plenty of water
2. Bring water to a rolling boil
3. Add salt (about 1 tbsp per gallon of water)
4. Add pasta and stir immediately
5. Cook according to package time (usually 8-12 minutes)
6. Test for "al dente" - firm but not hard
7. Reserve 1 cup of pasta water before draining
8. Drain pasta and serve with sauce

**Pro Tips:**
- Use plenty of water (4-6 quarts for 1 pound pasta)
- Don't add oil to the water
- Stir occasionally to prevent sticking
- Save pasta water to thicken sauces
- Don't rinse unless making a cold dish 😊`,

            'how to make rice': `Here's how to make perfect rice! 🍚

**Basic Rice Method:**
1. Rinse rice until water runs clear
2. Add rice and water to pot (1:2 ratio for white rice)
3. Bring to boil, then reduce heat to low
4. Cover and simmer for 18-20 minutes
5. Remove from heat and let stand 5 minutes
6. Fluff with fork and serve!

**Water Ratios:**
- White rice: 1 cup rice + 2 cups water
- Brown rice: 1 cup rice + 2.5 cups water
- Jasmine rice: 1 cup rice + 1.5 cups water

**Tips:**
- Don't lift the lid while cooking
- Let it rest after cooking
- Use a heavy-bottomed pot
- Season with salt if desired 😊`,

            'how to cook rice': `Here's how to cook rice perfectly! 🍚

**Perfect Rice Method:**
1. Rinse rice in cold water until water runs clear
2. Add rice and water to pot (follow package directions)
3. Bring to a boil over medium-high heat
4. Reduce heat to low and cover tightly
5. Simmer for 18-20 minutes (don't lift lid!)
6. Remove from heat and let stand 5 minutes
7. Fluff with fork and serve

**Water Ratios:**
- White rice: 1:2 (rice:water)
- Brown rice: 1:2.5
- Basmati: 1:1.5
- Wild rice: 1:3

**Pro Tips:**
- Use a heavy-bottomed pot
- Don't stir while cooking
- Let it rest after cooking
- Season with salt if desired 😊`,

            'how to make pizza': `Here's how to make Italian pizza! 🍕

**Ingredients:**
- 3 cups all-purpose flour
- 1 tsp salt
- 1 tsp sugar
- 2 1/4 tsp active dry yeast
- 1 cup warm water
- 2 tbsp olive oil

**Instructions:**
1. Mix yeast, sugar, and warm water, let stand 5 minutes
2. Mix flour and salt in a large bowl
3. Add yeast mixture and olive oil, knead for 10 minutes
4. Let dough rise for 1 hour in warm place
5. Punch down and divide into 2 balls
6. Roll out each ball into 12-inch circle
7. Add toppings and bake at 450°F for 12-15 minutes

**Classic Toppings:** Tomato sauce, mozzarella, basil, olive oil 😊`,

            'how to make lasagna': `Here's how to make Italian lasagna! 🍝

**Ingredients:**
- 12 lasagna noodles
- 1 lb ground beef
- 1 onion, chopped
- 3 cloves garlic, minced
- 2 cups marinara sauce
- 15 oz ricotta cheese
- 2 cups mozzarella, shredded
- 1/2 cup parmesan cheese
- 1 egg
- Salt and pepper

**Instructions:**
1. Cook lasagna noodles according to package
2. Brown beef with onion and garlic
3. Add marinara sauce and simmer 10 minutes
4. Mix ricotta, egg, and parmesan
5. Layer: noodles, meat sauce, ricotta mixture, mozzarella
6. Repeat layers, ending with mozzarella
7. Bake at 375°F for 25 minutes, covered
8. Uncover and bake 15 more minutes

**Tip:** Let it rest 10 minutes before cutting! 😊`,

            'how to make risotto': `Here's how to make Italian risotto! 🍚

**Ingredients:**
- 1 1/2 cups arborio rice
- 4 cups chicken broth
- 1 onion, finely chopped
- 2 cloves garlic, minced
- 1/2 cup white wine
- 1/2 cup parmesan cheese
- 2 tbsp butter
- 2 tbsp olive oil
- Salt and pepper

**Instructions:**
1. Heat broth in a saucepan, keep warm
2. Sauté onion and garlic in olive oil
3. Add rice, stir for 2 minutes
4. Add wine, stir until absorbed
5. Add 1 cup broth, stir until absorbed
6. Continue adding broth 1/2 cup at a time
7. Cook until rice is creamy (20-25 minutes)
8. Stir in butter and parmesan, season to taste

**Classic Variations:** Mushroom, seafood, or saffron risotto 😊`,

            'how to make paella': `Here's how to make Spanish paella! 🥘

**Ingredients:**
- 2 cups short-grain rice (bomba or arborio)
- 4 cups chicken broth
- 1 lb chicken thighs
- 1/2 lb shrimp
- 1/2 cup peas
- 1 red bell pepper, sliced
- 1 onion, chopped
- 3 cloves garlic, minced
- 1 tsp saffron threads
- 2 tbsp olive oil
- Salt and pepper

**Instructions:**
1. Heat oil in paella pan or large skillet
2. Season and brown chicken, remove
3. Sauté onion, garlic, and pepper
4. Add rice, stir for 2 minutes
5. Add saffron and broth, bring to boil
6. Add chicken back, simmer 15 minutes
7. Add shrimp and peas, cook 5 more minutes
8. Let rest 5 minutes before serving

**Tip:** Don't stir after adding broth! 😊`,

            'how to make tacos': `Here's how to make Mexican tacos! 🌮

**Ingredients:**
- 1 lb ground beef or chicken
- 1 packet taco seasoning
- 12 corn tortillas
- 1 cup shredded lettuce
- 1 cup diced tomatoes
- 1 cup shredded cheese
- 1/2 cup sour cream
- 1/2 cup salsa
- 1 onion, diced

**Instructions:**
1. Brown meat in skillet over medium heat
2. Add taco seasoning and water, simmer 5 minutes
3. Warm tortillas in dry skillet or microwave
4. Fill tortillas with meat
5. Top with lettuce, tomatoes, cheese
6. Add sour cream and salsa
7. Serve immediately

**Variations:** Fish tacos, vegetarian with beans, or al pastor! 😊`,

            'how to make enchiladas': `Here's how to make Mexican enchiladas! 🌯

**Ingredients:**
- 12 corn tortillas
- 2 cups shredded chicken
- 2 cups enchilada sauce
- 2 cups shredded cheese
- 1 onion, diced
- 1/2 cup sour cream
- 2 tbsp oil

**Instructions:**
1. Heat oil in skillet, warm tortillas briefly
2. Dip each tortilla in enchilada sauce
3. Fill with chicken, cheese, and onion
4. Roll up and place seam-side down in baking dish
5. Pour remaining sauce over enchiladas
6. Top with remaining cheese
7. Bake at 350°F for 20-25 minutes
8. Serve with sour cream

**Tip:** Let them cool 5 minutes before serving! 😊`,

            'how to make nasi lemak': `Here's how to make Malaysian nasi lemak! 🍚

**Ingredients:**
- 2 cups jasmine rice
- 1 can coconut milk
- 2 pandan leaves (optional)
- 1 tsp salt
- 4 eggs
- 1 cucumber, sliced
- 1/2 cup peanuts
- 1/2 cup ikan bilis (anchovies)
- Sambal chili sauce

**Instructions:**
1. Rinse rice until water runs clear
2. Add coconut milk, salt, and pandan leaves
3. Cook rice in rice cooker or on stovetop
4. Fry peanuts and anchovies until crispy
5. Boil eggs for 6-7 minutes, peel and slice
6. Serve rice with eggs, cucumber, peanuts, anchovies
7. Add sambal chili sauce on the side

**Traditional Sides:** Fried chicken, beef rendang, or curry 😊`,

            'how to make rendang': `Here's how to make Malaysian beef rendang! 🥘

**Ingredients:**
- 2 lbs beef chuck, cubed
- 2 cans coconut milk
- 6 shallots, minced
- 4 cloves garlic, minced
- 2-inch ginger, minced
- 2-inch galangal, minced
- 4 lemongrass stalks, bruised
- 4 kaffir lime leaves
- 2 tbsp chili paste
- 1 tsp turmeric powder
- Salt to taste

**Instructions:**
1. Blend shallots, garlic, ginger, galangal into paste
2. Heat oil, sauté paste until fragrant
3. Add beef, brown on all sides
4. Add coconut milk, lemongrass, lime leaves
5. Simmer on low heat for 2-3 hours
6. Stir occasionally until liquid reduces
7. Add chili paste and turmeric
8. Cook until meat is tender and sauce thickens

**Serve with:** Nasi lemak, rice, or bread 😊`,

            'how to make biryani': `Here's how to make Bangladeshi biryani! 🍚

**Ingredients:**
- 2 cups basmati rice
- 1 lb chicken or beef
- 2 onions, sliced
- 4 cloves garlic, minced
- 1-inch ginger, minced
- 2 cups yogurt
- 1/2 cup ghee
- Whole spices (cardamom, cinnamon, cloves)
- Saffron strands
- 1/2 cup milk
- Salt to taste

**Instructions:**
1. Marinate meat with yogurt, garlic, ginger, spices
2. Soak saffron in warm milk
3. Parboil rice with whole spices
4. Layer: meat, rice, saffron milk, fried onions
5. Repeat layers, ending with rice
6. Cover tightly, cook on low heat 30 minutes
7. Let rest 10 minutes before serving

**Variations:** Chicken, beef, or vegetable biryani 😊`,

            'how to make curry': `Here's how to make Bangladeshi curry! 🍛

**Ingredients:**
- 1 lb chicken or beef
- 2 onions, finely chopped
- 4 cloves garlic, minced
- 1-inch ginger, minced
- 2 tomatoes, chopped
- 2 tbsp oil
- 1 tsp turmeric powder
- 1 tsp chili powder
- 1 tsp cumin powder
- 1 tsp coriander powder
- Salt to taste

**Instructions:**
1. Heat oil, sauté onions until golden
2. Add garlic and ginger, cook 2 minutes
3. Add meat, brown on all sides
4. Add spices, cook 1 minute
5. Add tomatoes, cook until soft
6. Add water, simmer 20-30 minutes
7. Cook until meat is tender and sauce thickens
8. Garnish with fresh cilantro

**Serve with:** Rice, naan, or roti 😊`,

            'how to make khichuri': `Here's how to make Bangladeshi khichuri! 🍚

**Ingredients:**
- 1 cup rice
- 1/2 cup red lentils (masoor dal)
- 1 onion, chopped
- 2 cloves garlic, minced
- 1-inch ginger, minced
- 2 tbsp oil
- 1 tsp turmeric powder
- 1 tsp cumin seeds
- 2 bay leaves
- 4 cups water
- Salt to taste

**Instructions:**
1. Wash rice and lentils together
2. Heat oil, add cumin seeds and bay leaves
3. Add onion, garlic, ginger, sauté until golden
4. Add rice and lentils, stir for 2 minutes
5. Add water, turmeric, and salt
6. Bring to boil, then simmer 20-25 minutes
7. Stir occasionally until thick and creamy
8. Let rest 5 minutes before serving

**Serve with:** Fried eggs, pickles, or vegetables 😊`,

            'how to make bhuna': `Here's how to make Bangladeshi bhuna! 🍛

**Ingredients:**
- 1 lb chicken or beef
- 2 onions, finely chopped
- 4 cloves garlic, minced
- 1-inch ginger, minced
- 2 tomatoes, chopped
- 2 tbsp oil
- 1 tsp turmeric powder
- 1 tsp chili powder
- 1 tsp cumin powder
- 1 tsp coriander powder
- 1 tsp garam masala
- Salt to taste

**Instructions:**
1. Heat oil, sauté onions until dark golden
2. Add garlic and ginger, cook 2 minutes
3. Add meat, brown well on all sides
4. Add spices, cook 1 minute
5. Add tomatoes, cook until soft
6. Add water, simmer 30-40 minutes
7. Cook until meat is tender and sauce thickens
8. Add garam masala at the end

**Serve with:** Rice, naan, or roti 😊`,

            'how to make carbonara': `Here's how to make Italian carbonara! 🍝

**Ingredients:**
- 1 lb spaghetti
- 4 large eggs
- 1 cup parmesan cheese, grated
- 6 slices pancetta or bacon
- 4 cloves garlic, minced
- 1/4 cup pasta water
- Black pepper
- Salt

**Instructions:**
1. Cook pasta in salted water, reserve 1 cup water
2. Cook pancetta until crispy, remove from pan
3. Add garlic to pan, cook 30 seconds
4. Beat eggs and parmesan in a bowl
5. Add hot pasta to pan, remove from heat
6. Quickly stir in egg mixture and pasta water
7. Add pancetta and black pepper
8. Serve immediately with extra parmesan

**Tip:** Don't let eggs scramble! 😊`,

            'how to make tiramisu': `Here's how to make Italian tiramisu! 🍰

**Ingredients:**
- 6 egg yolks
- 1 cup sugar
- 1 1/4 cups mascarpone cheese
- 1 3/4 cups heavy cream
- 1 package ladyfinger cookies
- 1 cup strong coffee, cooled
- 2 tbsp coffee liqueur (optional)
- Cocoa powder for dusting

**Instructions:**
1. Beat egg yolks and sugar until pale
2. Add mascarpone, beat until smooth
3. Whip cream to stiff peaks, fold into mascarpone
4. Mix coffee and liqueur in shallow dish
5. Dip ladyfingers in coffee mixture
6. Layer half the ladyfingers in dish
7. Spread half the mascarpone mixture
8. Repeat layers, dust with cocoa
9. Refrigerate 4 hours or overnight

**Tip:** Use strong espresso for best flavor! 😊`,

            'how to make gnocchi': `Here's how to make Italian gnocchi! 🥟

**Ingredients:**
- 2 lbs russet potatoes
- 2 cups all-purpose flour
- 2 egg yolks
- 1 tsp salt
- 1/4 tsp nutmeg

**Instructions:**
1. Bake potatoes at 400°F for 1 hour
2. Scoop out hot potato flesh, mash well
3. Add flour, egg yolks, salt, and nutmeg
4. Knead gently until smooth dough forms
5. Roll into 1/2-inch ropes
6. Cut into 1-inch pieces
7. Press with fork to create ridges
8. Boil in salted water for 2-3 minutes
9. Serve with your favorite sauce

**Classic Sauces:** Pesto, marinara, or brown butter sage 😊`,

            'how to make tortilla': `Here's how to make Spanish tortilla! 🥔

**Ingredients:**
- 6 large eggs
- 4 medium potatoes, thinly sliced
- 1 onion, thinly sliced
- 1/2 cup olive oil
- Salt and pepper

**Instructions:**
1. Heat oil in large skillet over medium heat
2. Add potatoes and onion, cook 15-20 minutes
3. Beat eggs with salt and pepper
4. Add cooked potatoes to eggs
5. Heat clean skillet with 2 tbsp oil
6. Pour egg mixture into skillet
7. Cook 5 minutes, then flip carefully
8. Cook 5 more minutes until set
9. Let rest 5 minutes before cutting

**Serve with:** Bread and aioli sauce 😊`,

            'how to make gazpacho': `Here's how to make Spanish gazpacho! 🍅

**Ingredients:**
- 6 large tomatoes, chopped
- 1 cucumber, peeled and chopped
- 1 red bell pepper, chopped
- 1 small onion, chopped
- 2 cloves garlic, minced
- 1/4 cup olive oil
- 2 tbsp red wine vinegar
- 1 cup bread, soaked in water
- Salt and pepper

**Instructions:**
1. Soak bread in water for 10 minutes
2. Combine all vegetables in blender
3. Add soaked bread, olive oil, vinegar
4. Blend until smooth
5. Strain through fine mesh sieve
6. Season with salt and pepper
7. Chill for at least 2 hours
8. Serve cold with croutons

**Garnish with:** Chopped vegetables and croutons 😊`,

            'how to make churros': `Here's how to make Spanish churros! 🍩

**Ingredients:**
- 1 cup water
- 1/2 cup butter
- 1 cup all-purpose flour
- 3 eggs
- 1/4 tsp salt
- 1/4 cup sugar
- 1 tsp cinnamon
- Oil for frying

**Instructions:**
1. Bring water and butter to boil
2. Add flour and salt, stir until smooth
3. Cool slightly, add eggs one at a time
4. Transfer to piping bag with star tip
5. Heat oil to 375°F
6. Pipe 4-inch strips into hot oil
7. Fry until golden brown, 2-3 minutes
8. Drain on paper towels
9. Mix sugar and cinnamon, dust churros

**Serve with:** Hot chocolate or dulce de leche 😊`,

            'how to make guacamole': `Here's how to make Mexican guacamole! 🥑

**Ingredients:**
- 3 ripe avocados
- 1 lime, juiced
- 1/2 tsp salt
- 1/2 tsp cumin
- 1/2 onion, diced
- 2 roma tomatoes, diced
- 1 tbsp cilantro, chopped
- 1 jalapeño, minced (optional)

**Instructions:**
1. Cut avocados in half, remove pits
2. Scoop flesh into bowl, mash with fork
3. Add lime juice and salt immediately
4. Add cumin, onion, tomatoes, cilantro
5. Add jalapeño if desired
6. Mix gently, don't over-mash
7. Taste and adjust seasoning
8. Serve immediately

**Tip:** Keep avocado pit in bowl to prevent browning! 😊`,

            'how to make mole': `Here's how to make Mexican mole! 🍫

**Ingredients:**
- 3 dried ancho chiles
- 3 dried pasilla chiles
- 2 tbsp sesame seeds
- 2 tbsp pumpkin seeds
- 1/4 cup almonds
- 1/4 cup raisins
- 2 tbsp chocolate chips
- 1 onion, chopped
- 3 cloves garlic
- 2 tbsp oil
- 2 cups chicken broth
- Salt to taste

**Instructions:**
1. Toast chiles, seeds, and almonds separately
2. Soak chiles in hot water 20 minutes
3. Sauté onion and garlic in oil
4. Blend all ingredients until smooth
5. Strain through fine mesh sieve
6. Cook in oil for 10 minutes
7. Add broth, simmer 30 minutes
8. Season with salt

**Serve with:** Chicken, turkey, or enchiladas 😊`,

            'how to make satay': `Here's how to make Malaysian satay! 🍖

**Ingredients:**
- 1 lb chicken or beef, cubed
- 2 tbsp oil
- 1/2 cup coconut milk
- 2 tbsp soy sauce
- 1 tbsp fish sauce
- 1 tbsp sugar
- 1 tsp turmeric powder
- 1 tsp coriander powder
- 1 tsp cumin powder
- Bamboo skewers

**Instructions:**
1. Soak bamboo skewers in water 30 minutes
2. Mix coconut milk, soy sauce, fish sauce, sugar
3. Add spices, mix well
4. Marinate meat for 2 hours
5. Thread meat onto skewers
6. Grill over medium heat 8-10 minutes
7. Turn occasionally until cooked
8. Serve with peanut sauce

**Peanut Sauce:** Blend peanuts, coconut milk, chili, lime 😊`,

            'how to make laksa': `Here's how to make Malaysian laksa! 🍜

**Ingredients:**
- 1 lb rice noodles
- 1 lb shrimp or chicken
- 2 cans coconut milk
- 4 shallots, minced
- 4 cloves garlic, minced
- 2-inch ginger, minced
- 2 tbsp laksa paste
- 2 cups bean sprouts
- 1 cucumber, julienned
- 4 hard-boiled eggs
- 1/2 cup mint leaves
- 1/2 cup cilantro

**Instructions:**
1. Cook noodles according to package
2. Sauté shallots, garlic, ginger
3. Add laksa paste, cook 2 minutes
4. Add coconut milk, bring to boil
5. Add shrimp/chicken, cook 5 minutes
6. Add bean sprouts, cook 1 minute
7. Serve noodles in bowls
8. Top with soup, eggs, cucumber, herbs

**Tip:** Use store-bought laksa paste for convenience! 😊`,

            'how to make roti canai': `Here's how to make Malaysian roti canai! 🥞

**Ingredients:**
- 2 cups all-purpose flour
- 1/2 cup water
- 1/2 cup milk
- 1 egg
- 1 tsp salt
- 1/2 cup ghee or oil

**Instructions:**
1. Mix flour, salt, egg, water, milk
2. Knead until smooth, rest 30 minutes
3. Divide into 8 balls
4. Flatten each ball with oil
5. Stretch dough very thin
6. Fold into square shape
7. Cook on hot griddle 2-3 minutes each side
8. Serve with curry or dhal

**Serve with:** Chicken curry or lentil dhal 😊`,

            'how to make korma': `Here's how to make Bangladeshi korma! 🍛

**Ingredients:**
- 1 lb chicken or beef
- 1 cup yogurt
- 1/2 cup cream
- 2 onions, finely chopped
- 4 cloves garlic, minced
- 1-inch ginger, minced
- 1/2 cup cashews, ground
- 2 tbsp oil
- 1 tsp cardamom powder
- 1 tsp cinnamon powder
- 1 tsp nutmeg powder
- Salt to taste

**Instructions:**
1. Marinate meat with yogurt and spices
2. Heat oil, sauté onions until golden
3. Add garlic and ginger, cook 2 minutes
4. Add meat, brown on all sides
5. Add ground cashews
6. Add cream, simmer 20-30 minutes
7. Cook until meat is tender
8. Garnish with fried onions

**Serve with:** Rice, naan, or roti 😊`,

            'how to make pulao': `Here's how to make Bangladeshi pulao! 🍚

**Ingredients:**
- 2 cups basmati rice
- 1 lb chicken or beef
- 2 onions, sliced
- 4 cloves garlic, minced
- 1-inch ginger, minced
- 1/2 cup ghee
- Whole spices (cardamom, cinnamon, cloves, bay leaves)
- 1/2 cup raisins
- 1/2 cup cashews
- Salt to taste

**Instructions:**
1. Marinate meat with garlic, ginger, spices
2. Heat ghee, add whole spices
3. Add onions, cook until golden
4. Add meat, brown on all sides
5. Add rice, stir for 2 minutes
6. Add water (1:2 ratio), bring to boil
7. Reduce heat, cover, simmer 20 minutes
8. Add raisins and cashews
9. Let rest 5 minutes before serving

**Serve with:** Raita, pickles, or salad 😊`
        };
        
        // Check for cooking-related keywords
        const cookingKeywords = ['noodles', 'pasta', 'rice', 'cook', 'make', 'pizza', 'lasagna', 'risotto', 'paella', 'tacos', 'enchiladas', 'nasi lemak', 'rendang', 'biryani', 'curry', 'carbonara', 'tiramisu', 'gnocchi', 'tortilla', 'gazpacho', 'churros', 'guacamole', 'mole', 'satay', 'laksa', 'roti canai', 'khichuri', 'bhuna', 'korma', 'pulao'];
        const hasCookingKeyword = cookingKeywords.some(keyword => lowerMessage.includes(keyword));
        
        if (!hasCookingKeyword) {
            return null;
        }
        
        // Check for specific cooking queries
        for (const [query, response] of Object.entries(cookingQueries)) {
            const queryKeywords = query.toLowerCase().split(' ');
            const hasAllKeywords = queryKeywords.every(keyword => 
                lowerMessage.includes(keyword) || keyword === 'how' || keyword === 'to'
            );
            
            if (hasAllKeywords) {
                return response;
            }
        }
        
        return null;
    }
    
    handleTimezoneDateQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check if the message contains both date keywords and location keywords
        const dateKeywords = ['day', 'date'];
        const hasDateKeyword = dateKeywords.some(keyword => lowerMessage.includes(keyword));
        
        if (!hasDateKeyword) {
            return null;
        }
        
        // Common timezone mappings (same as in handleTimezoneQuery)
        const timezoneMap = {
            'japan': 'Asia/Tokyo',
            'tokyo': 'Asia/Tokyo',
            'berlin': 'Europe/Berlin',
            'germany': 'Europe/Berlin',
            'london': 'Europe/London',
            'uk': 'Europe/London',
            'england': 'Europe/London',
            'new york': 'America/New_York',
            'nyc': 'America/New_York',
            'los angeles': 'America/Los_Angeles',
            'la': 'America/Los_Angeles',
            'california': 'America/Los_Angeles',
            'paris': 'Europe/Paris',
            'france': 'Europe/Paris',
            'rome': 'Europe/Rome',
            'italy': 'Europe/Rome',
            'madrid': 'Europe/Madrid',
            'spain': 'Europe/Madrid',
            'moscow': 'Europe/Moscow',
            'russia': 'Europe/Moscow',
            'beijing': 'Asia/Shanghai',
            'china': 'Asia/Shanghai',
            'seoul': 'Asia/Seoul',
            'korea': 'Asia/Seoul',
            'sydney': 'Australia/Sydney',
            'australia': 'Australia/Sydney',
            'mumbai': 'Asia/Kolkata',
            'india': 'Asia/Kolkata',
            'delhi': 'Asia/Kolkata',
            'dubai': 'Asia/Dubai',
            'uae': 'Asia/Dubai',
            'singapore': 'Asia/Singapore',
            'bangkok': 'Asia/Bangkok',
            'thailand': 'Asia/Bangkok',
            'jakarta': 'Asia/Jakarta',
            'indonesia': 'Asia/Jakarta',
            'manila': 'Asia/Manila',
            'philippines': 'Asia/Manila',
            'hanoi': 'Asia/Ho_Chi_Minh',
            'vietnam': 'Asia/Ho_Chi_Minh',
            'kuala lumpur': 'Asia/Kuala_Lumpur',
            'malaysia': 'Asia/Kuala_Lumpur',
            'cyberjaya': 'Asia/Kuala_Lumpur',
            'putrajaya': 'Asia/Kuala_Lumpur',
            'shah alam': 'Asia/Kuala_Lumpur',
            'petaling jaya': 'Asia/Kuala_Lumpur',
            'subang jaya': 'Asia/Kuala_Lumpur',
            'klang': 'Asia/Kuala_Lumpur',
            'george town': 'Asia/Kuala_Lumpur',
            'penang': 'Asia/Kuala_Lumpur',
            'ipoh': 'Asia/Kuala_Lumpur',
            'johor bahru': 'Asia/Kuala_Lumpur',
            'johor': 'Asia/Kuala_Lumpur',
            'alor setar': 'Asia/Kuala_Lumpur',
            'kota kinabalu': 'Asia/Kuala_Lumpur',
            'kuching': 'Asia/Kuala_Lumpur',
            'miri': 'Asia/Kuala_Lumpur',
            'sibu': 'Asia/Kuala_Lumpur',
            'sandakan': 'Asia/Kuala_Lumpur',
            'taiping': 'Asia/Kuala_Lumpur',
            'seremban': 'Asia/Kuala_Lumpur',
            'nilai': 'Asia/Kuala_Lumpur',
            'port dickson': 'Asia/Kuala_Lumpur',
            'malacca city': 'Asia/Kuala_Lumpur',
            'dhaka': 'Asia/Dhaka',
            'bangladesh': 'Asia/Dhaka',
            'tangail': 'Asia/Dhaka',
            'tangail city': 'Asia/Dhaka',
            'chittagong': 'Asia/Dhaka',
            'sylhet': 'Asia/Dhaka',
            'rajshahi': 'Asia/Dhaka',
            'khulna': 'Asia/Dhaka',
            'barisal': 'Asia/Dhaka',
            'rangpur': 'Asia/Dhaka',
            'mymensingh': 'Asia/Dhaka',
            'comilla': 'Asia/Dhaka',
            'jessore': 'Asia/Dhaka',
            'bogra': 'Asia/Dhaka',
            'dinajpur': 'Asia/Dhaka',
            'pabna': 'Asia/Dhaka',
            'kustia': 'Asia/Dhaka',
            'faridpur': 'Asia/Dhaka',
            'gopalganj': 'Asia/Dhaka',
            'madaripur': 'Asia/Dhaka',
            'shariatpur': 'Asia/Dhaka',
            'rajbari': 'Asia/Dhaka',
            'magura': 'Asia/Dhaka',
            'jhenaidah': 'Asia/Dhaka',
            'narail': 'Asia/Dhaka',
            'satkhira': 'Asia/Dhaka',
            'bagerhat': 'Asia/Dhaka',
            'pirojpur': 'Asia/Dhaka',
            'barguna': 'Asia/Dhaka',
            'patuakhali': 'Asia/Dhaka',
            'bhola': 'Asia/Dhaka',
            'lakshmipur': 'Asia/Dhaka',
            'noakhali': 'Asia/Dhaka',
            'feni': 'Asia/Dhaka',
            'chandpur': 'Asia/Dhaka',
            'cox\'s bazar': 'Asia/Dhaka',
            'coxs bazar': 'Asia/Dhaka',
            'bandarban': 'Asia/Dhaka',
            'rangamati': 'Asia/Dhaka',
            'khagrachari': 'Asia/Dhaka',
            'kolkata': 'Asia/Kolkata',
            'calcutta': 'Asia/Kolkata',
            'chennai': 'Asia/Kolkata',
            'madras': 'Asia/Kolkata',
            'hyderabad': 'Asia/Kolkata',
            'bangalore': 'Asia/Kolkata',
            'bengaluru': 'Asia/Kolkata',
            'pune': 'Asia/Kolkata',
            'ahmedabad': 'Asia/Kolkata',
            'surat': 'Asia/Kolkata',
            'jaipur': 'Asia/Kolkata',
            'lucknow': 'Asia/Kolkata',
            'kanpur': 'Asia/Kolkata',
            'nagpur': 'Asia/Kolkata',
            'indore': 'Asia/Kolkata',
            'thane': 'Asia/Kolkata',
            'bhopal': 'Asia/Kolkata',
            'visakhapatnam': 'Asia/Kolkata',
            'patna': 'Asia/Kolkata',
            'vadodara': 'Asia/Kolkata',
            'ghaziabad': 'Asia/Kolkata',
            'ludhiana': 'Asia/Kolkata',
            'agra': 'Asia/Kolkata',
            'nashik': 'Asia/Kolkata',
            'ranchi': 'Asia/Kolkata',
            'howrah': 'Asia/Kolkata',
            'coimbatore': 'Asia/Kolkata',
            'raipur': 'Asia/Kolkata',
            'jabalpur': 'Asia/Kolkata',
            'gwalior': 'Asia/Kolkata',
            'vijayawada': 'Asia/Kolkata',
            'jodhpur': 'Asia/Kolkata',
            'madurai': 'Asia/Kolkata',
            'guwahati': 'Asia/Kolkata',
            'chandigarh': 'Asia/Kolkata',
            'amritsar': 'Asia/Kolkata',
            'allahabad': 'Asia/Kolkata',
            'rohtak': 'Asia/Kolkata',
            'mysore': 'Asia/Kolkata',
            'aurangabad': 'Asia/Kolkata',
            'solapur': 'Asia/Kolkata',
            'bhubaneswar': 'Asia/Kolkata',
            'jamshedpur': 'Asia/Kolkata',
            'bhubaneshwar': 'Asia/Kolkata',
            'varanasi': 'Asia/Kolkata',
            'srinagar': 'Asia/Kolkata',
            'salem': 'Asia/Kolkata',
            'warangal': 'Asia/Kolkata',
            'dhanbad': 'Asia/Kolkata',
            'guntur': 'Asia/Kolkata',
            'amravati': 'Asia/Kolkata',
            'noida': 'Asia/Kolkata',
            'bhiwandi': 'Asia/Kolkata',
            'bhavnagar': 'Asia/Kolkata',
            'tiruchirappalli': 'Asia/Kolkata',
            'kota': 'Asia/Kolkata',
            'ajmer': 'Asia/Kolkata',
            'calgary': 'America/Edmonton',
            'edmonton': 'America/Edmonton',
            'ottawa': 'America/Toronto',
            'winnipeg': 'America/Winnipeg',
            'halifax': 'America/Halifax',
            'st johns': 'America/St_Johns',
            'newfoundland': 'America/St_Johns',
            'victoria': 'America/Vancouver',
            'saskatoon': 'America/Regina',
            'regina': 'America/Regina',
            'quebec': 'America/Toronto',
            'quebec city': 'America/Toronto',
            'hamilton': 'America/Toronto',
            'kitchener': 'America/Toronto',
            'waterloo': 'America/Toronto',
            'london ontario': 'America/Toronto',
            'windsor': 'America/Toronto',
            'kingston': 'America/Toronto',
            'sudbury': 'America/Toronto',
            'thunder bay': 'America/Toronto',
            'saint john': 'America/Halifax',
            'fredericton': 'America/Halifax',
            'charlottetown': 'America/Halifax',
            'whitehorse': 'America/Whitehorse',
            'yellowknife': 'America/Yellowknife',
            'iqaluit': 'America/Iqaluit',
            'nunavut': 'America/Iqaluit',
            'yukon': 'America/Whitehorse',
            'northwest territories': 'America/Yellowknife',
            'dallas': 'America/Chicago',
            'fort worth': 'America/Chicago',
            'austin': 'America/Chicago',
            'san antonio': 'America/Chicago',
            'el paso': 'America/Denver',
            'arlington': 'America/Chicago',
            'corpus christi': 'America/Chicago',
            'plano': 'America/Chicago',
            'laredo': 'America/Chicago',
            'lubbock': 'America/Chicago',
            'garland': 'America/Chicago',
            'irving': 'America/Chicago',
            'amarillo': 'America/Chicago',
            'grand prairie': 'America/Chicago',
            'brownsville': 'America/Chicago',
            'pasadena': 'America/Chicago',
            'mckinney': 'America/Chicago',
            'mesa': 'America/Phoenix',
            'tucson': 'America/Phoenix',
            'chandler': 'America/Phoenix',
            'scottsdale': 'America/Phoenix',
            'glendale': 'America/Phoenix',
            'gilbert': 'America/Phoenix',
            'tempe': 'America/Phoenix',
            'peoria': 'America/Phoenix',
            'surprise': 'America/Phoenix',
            'yuma': 'America/Phoenix',
            'avondale': 'America/Phoenix',
            'goodyear': 'America/Phoenix',
            'flagstaff': 'America/Phoenix',
            'buckeye': 'America/Phoenix',
            'casa grande': 'America/Phoenix',
            'lake havasu city': 'America/Phoenix',
            'maricopa': 'America/Phoenix',
            'oregon': 'America/Los_Angeles',
            'portland': 'America/Los_Angeles',
            'salem': 'America/Los_Angeles',
            'eugene': 'America/Los_Angeles',
            'gresham': 'America/Los_Angeles',
            'hillsboro': 'America/Los_Angeles',
            'beaverton': 'America/Los_Angeles',
            'bend': 'America/Los_Angeles',
            'medford': 'America/Los_Angeles',
            'springfield': 'America/Los_Angeles',
            'corvallis': 'America/Los_Angeles',
            'albany': 'America/Los_Angeles',
            'tigard': 'America/Los_Angeles',
            'lake oswego': 'America/Los_Angeles',
            'keizer': 'America/Los_Angeles',
            'grant\'s pass': 'America/Los_Angeles',
            'oregon city': 'America/Los_Angeles',
            'orlando': 'America/New_York',
            'tampa': 'America/New_York',
            'jacksonville': 'America/New_York',
            'fort lauderdale': 'America/New_York',
            'tallahassee': 'America/New_York',
            'gainesville': 'America/New_York',
            'daytona beach': 'America/New_York',
            'clearwater': 'America/New_York',
            'coral springs': 'America/New_York',
            'cape coral': 'America/New_York',
            'port st lucie': 'America/New_York',
            'sarasota': 'America/New_York',
            'palm bay': 'America/New_York',
            'pompano beach': 'America/New_York',
            'hollywood': 'America/New_York',
            'lakeland': 'America/New_York',
            'bradenton': 'America/New_York',
            'fort myers': 'America/New_York',
            'kissimmee': 'America/New_York',
            'boynton beach': 'America/New_York',
            'delray beach': 'America/New_York',
            'boca raton': 'America/New_York',
            'west palm beach': 'America/New_York',
            'palm beach': 'America/New_York',
            'naples': 'America/New_York',
            'melbourne': 'America/New_York',
            'daytona': 'America/New_York',
            'spokane': 'America/Los_Angeles',
            'tacoma': 'America/Los_Angeles',
            'vancouver wa': 'America/Los_Angeles',
            'bellevue': 'America/Los_Angeles',
            'kent': 'America/Los_Angeles',
            'everett': 'America/Los_Angeles',
            'renton': 'America/Los_Angeles',
            'yakima': 'America/Los_Angeles',
            'spokane valley': 'America/Los_Angeles',
            'federal way': 'America/Los_Angeles',
            'bellingham': 'America/Los_Angeles',
            'kennewick': 'America/Los_Angeles',
            'auburn': 'America/Los_Angeles',
            'pasco': 'America/Los_Angeles',
            'marysville': 'America/Los_Angeles',
            'lakewood': 'America/Los_Angeles',
            'redmond': 'America/Los_Angeles',
            'shoreline': 'America/Los_Angeles',
            'richland': 'America/Los_Angeles',
            'olympia': 'America/Los_Angeles',
            'lynnwood': 'America/Los_Angeles',
            'bremerton': 'America/Los_Angeles',
            'puyallup': 'America/Los_Angeles',
            'colorado springs': 'America/Denver',
            'aurora': 'America/Denver',
            'fort collins': 'America/Denver',
            'lakewood': 'America/Denver',
            'thornton': 'America/Denver',
            'arvada': 'America/Denver',
            'westminster': 'America/Denver',
            'pueblo': 'America/Denver',
            'boulder': 'America/Denver',
            'greeley': 'America/Denver',
            'longmont': 'America/Denver',
            'grand junction': 'America/Denver',
            'loveland': 'America/Denver',
            'broomfield': 'America/Denver',
            'castle rock': 'America/Denver',
            'commerce city': 'America/Denver',
            'parker': 'America/Denver',
            'littleton': 'America/Denver',
            'northglenn': 'America/Denver',
            'wheat ridge': 'America/Denver',
            'englewood': 'America/Denver',
            'centennial': 'America/Denver',
            'highlands ranch': 'America/Denver',
            'fairbanks': 'America/Anchorage',
            'juneau': 'America/Anchorage',
            'sitka': 'America/Anchorage',
            'ketchikan': 'America/Anchorage',
            'kenai': 'America/Anchorage',
            'kodiak': 'America/Anchorage',
            'bethel': 'America/Anchorage',
            'palmer': 'America/Anchorage',
            'wasilla': 'America/Anchorage',
            'hilo': 'Pacific/Honolulu',
            'kailua': 'Pacific/Honolulu',
            'kapolei': 'Pacific/Honolulu',
            'ewa beach': 'Pacific/Honolulu',
            'mililani town': 'Pacific/Honolulu',
            'kihei': 'Pacific/Honolulu',
            'maui': 'Pacific/Honolulu',
            'kailua kona': 'Pacific/Honolulu',
            'kaneohe': 'Pacific/Honolulu',
            'ewa': 'Pacific/Honolulu',
            'mililani': 'Pacific/Honolulu',
            'kahului': 'Pacific/Honolulu',
            'lahaina': 'Pacific/Honolulu',
            'waipahu': 'Pacific/Honolulu',
            'pearl city': 'Pacific/Honolulu',
            'waimalu': 'Pacific/Honolulu',
            'nanakuli': 'Pacific/Honolulu',
            'wahiawa': 'Pacific/Honolulu',
            'schofield barracks': 'Pacific/Honolulu',
            'wailuku': 'Pacific/Honolulu',
            'waianae': 'Pacific/Honolulu',
            'makakilo city': 'Pacific/Honolulu',
            'lyon': 'Europe/Paris',
            'marseille': 'Europe/Paris',
            'toulouse': 'Europe/Paris',
            'nice': 'Europe/Paris',
            'nantes': 'Europe/Paris',
            'strasbourg': 'Europe/Paris',
            'montpellier': 'Europe/Paris',
            'bordeaux': 'Europe/Paris',
            'lille': 'Europe/Paris',
            'rennes': 'Europe/Paris',
            'reims': 'Europe/Paris',
            'saint-etienne': 'Europe/Paris',
            'toulon': 'Europe/Paris',
            'le havre': 'Europe/Paris',
            'grenoble': 'Europe/Paris',
            'dijon': 'Europe/Paris',
            'angers': 'Europe/Paris',
            'saint-denis': 'Europe/Paris',
            'villeurbanne': 'Europe/Paris',
            'le mans': 'Europe/Paris',
            'aix-en-provence': 'Europe/Paris',
            'brest': 'Europe/Paris',
            'nimes': 'Europe/Paris',
            'tours': 'Europe/Paris',
            'limoges': 'Europe/Paris',
            'clermont-ferrand': 'Europe/Paris',
            'milan': 'Europe/Rome',
            'naples': 'Europe/Rome',
            'turin': 'Europe/Rome',
            'palermo': 'Europe/Rome',
            'genoa': 'Europe/Rome',
            'bologna': 'Europe/Rome',
            'florence': 'Europe/Rome',
            'bari': 'Europe/Rome',
            'catania': 'Europe/Rome',
            'venice': 'Europe/Rome',
            'verona': 'Europe/Rome',
            'messina': 'Europe/Rome',
            'padova': 'Europe/Rome',
            'trieste': 'Europe/Rome',
            'taranto': 'Europe/Rome',
            'brescia': 'Europe/Rome',
            'parma': 'Europe/Rome',
            'modena': 'Europe/Rome',
            'reggio calabria': 'Europe/Rome',
            'reggio emilia': 'Europe/Rome',
            'perugia': 'Europe/Rome',
            'livorno': 'Europe/Rome',
            'ravenna': 'Europe/Rome',
            'cagliari': 'Europe/Rome',
            'rimini': 'Europe/Rome',
            'salerno': 'Europe/Rome',
            'ferrara': 'Europe/Rome',
            'sassari': 'Europe/Rome',
            'syracuse': 'Europe/Rome',
            'pescara': 'Europe/Rome',
            'bergamo': 'Europe/Rome',
            'vicenza': 'Europe/Rome',
            'trento': 'Europe/Rome',
            'forli': 'Europe/Rome',
            'novara': 'Europe/Rome',
            'piacenza': 'Europe/Rome',
            'bolzano': 'Europe/Rome',
            'udine': 'Europe/Rome',
            'arezzo': 'Europe/Rome',
            'lecce': 'Europe/Rome',
            'barcelona': 'Europe/Madrid',
            'valencia': 'Europe/Madrid',
            'sevilla': 'Europe/Madrid',
            'seville': 'Europe/Madrid',
            'zaragoza': 'Europe/Madrid',
            'malaga': 'Europe/Madrid',
            'murcia': 'Europe/Madrid',
            'palma': 'Europe/Madrid',
            'las palmas': 'Europe/Madrid',
            'bilbao': 'Europe/Madrid',
            'alicante': 'Europe/Madrid',
            'cordoba': 'Europe/Madrid',
            'valladolid': 'Europe/Madrid',
            'vigo': 'Europe/Madrid',
            'gijon': 'Europe/Madrid',
            'hospitalet': 'Europe/Madrid',
            'la coruna': 'Europe/Madrid',
            'vitoria': 'Europe/Madrid',
            'granada': 'Europe/Madrid',
            'elche': 'Europe/Madrid',
            'tarrasa': 'Europe/Madrid',
            'badalona': 'Europe/Madrid',
            'cartagena': 'Europe/Madrid',
            'jerez': 'Europe/Madrid',
            'sabadell': 'Europe/Madrid',
            'mostoles': 'Europe/Madrid',
            'alcala de henares': 'Europe/Madrid',
            'pamplona': 'Europe/Madrid',
            'fuenlabrada': 'Europe/Madrid',
            'almeria': 'Europe/Madrid',
            'san sebastian': 'Europe/Madrid',
            'leganes': 'Europe/Madrid',
            'santander': 'Europe/Madrid',
            'castellon': 'Europe/Madrid',
            'burgos': 'Europe/Madrid',
            'albacete': 'Europe/Madrid',
            'alcorcon': 'Europe/Madrid',
            'getafe': 'Europe/Madrid',
            'salamanca': 'Europe/Madrid',
            'huelva': 'Europe/Madrid',
            'marbella': 'Europe/Madrid',
            'logrono': 'Europe/Madrid',
            'tarragona': 'Europe/Madrid',
            'leon': 'Europe/Madrid',
            'cadiz': 'Europe/Madrid',
            'laredo': 'Europe/Madrid',
            'jaen': 'Europe/Madrid',
            'orensa': 'Europe/Madrid',
            'gerona': 'Europe/Madrid',
            'lugo': 'Europe/Madrid',
            'caceres': 'Europe/Madrid',
            'toledo': 'Europe/Madrid',
            'ceuta': 'Europe/Madrid',
            'girona': 'Europe/Madrid',
            'saint petersburg': 'Europe/Moscow',
            'novosibirsk': 'Asia/Novosibirsk',
            'yekaterinburg': 'Asia/Yekaterinburg',
            'kazan': 'Europe/Moscow',
            'nizhny novgorod': 'Europe/Moscow',
            'chelyabinsk': 'Asia/Yekaterinburg',
            'samara': 'Europe/Samara',
            'omsk': 'Asia/Omsk',
            'rostov': 'Europe/Moscow',
            'ufa': 'Asia/Yekaterinburg',
            'krasnoyarsk': 'Asia/Krasnoyarsk',
            'perm': 'Asia/Yekaterinburg',
            'voronezh': 'Europe/Moscow',
            'volgograd': 'Europe/Moscow',
            'krasnodar': 'Europe/Moscow',
            'saratov': 'Europe/Samara',
            'tyumen': 'Asia/Yekaterinburg',
            'tolyatti': 'Europe/Moscow',
            'izhevsk': 'Asia/Yekaterinburg',
            'barnaul': 'Asia/Novosibirsk',
            'ulyanovsk': 'Europe/Moscow',
            'irkutsk': 'Asia/Irkutsk',
            'khabarovsk': 'Asia/Vladivostok',
            'yaroslavl': 'Europe/Moscow',
            'vladivostok': 'Asia/Vladivostok',
            'makhachkala': 'Europe/Moscow',
            'tomsk': 'Asia/Novosibirsk',
            'orenburg': 'Asia/Yekaterinburg',
            'kemerovo': 'Asia/Novosibirsk',
            'novokuznetsk': 'Asia/Novosibirsk',
            'ryazan': 'Europe/Moscow',
            'astrahan': 'Europe/Moscow',
            'naberezhnye chelny': 'Europe/Moscow',
            'penza': 'Europe/Moscow',
            'lipetsk': 'Europe/Moscow',
            'kirov': 'Europe/Moscow',
            'cheboksary': 'Europe/Moscow',
            'tula': 'Europe/Moscow',
            'kaliningrad': 'Europe/Kaliningrad',
            'balashikha': 'Europe/Moscow',
            'krasnogorsk': 'Europe/Moscow',
            'podolsk': 'Europe/Moscow',
            'khimki': 'Europe/Moscow',
            'elektrostal': 'Europe/Moscow',
            'odintsovo': 'Europe/Moscow',
            'korolyov': 'Europe/Moscow',
            'lyubertsy': 'Europe/Moscow',
            'domodedovo': 'Europe/Moscow',
            'reutov': 'Europe/Moscow',
            'zelenograd': 'Europe/Moscow',
            'ramenskoye': 'Europe/Moscow',
            'pushkino': 'Europe/Moscow',
            'dolgoprudny': 'Europe/Moscow',
            'klimovsk': 'Europe/Moscow',
            'vidnoye': 'Europe/Moscow',
            'troitsk': 'Europe/Moscow',
            'lobnya': 'Europe/Moscow',
            'dzerzhinsky': 'Europe/Moscow',
            'krasnoznamensk': 'Europe/Moscow',
            'kotelniki': 'Europe/Moscow',
            'lytkarino': 'Europe/Moscow',
            'butovo': 'Europe/Moscow',
            'shcherbinka': 'Europe/Moscow'
        };
        
        // Check if the message contains a timezone
        for (const [location, timezone] of Object.entries(timezoneMap)) {
            if (lowerMessage.includes(location)) {
                try {
                    const now = new Date();
                    const timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
                    
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const dayOfWeek = days[timeInTimezone.getDay()];
                    const month = months[timeInTimezone.getMonth()];
                    const date = timeInTimezone.getDate();
                    const year = timeInTimezone.getFullYear();
                    
                    // Add ordinal suffix to date
                    const getOrdinalSuffix = (day) => {
                        if (day >= 11 && day <= 13) return 'th';
                        switch (day % 10) {
                            case 1: return 'st';
                            case 2: return 'nd';
                            case 3: return 'rd';
                            default: return 'th';
                        }
                    };
                    
                    const ordinalDate = date + getOrdinalSuffix(date);
                    
                    // Get timezone offset for display
                    const localTime = new Date();
                    const timezoneTime = new Date(localTime.toLocaleString('en-US', { timeZone: timezone }));
                    const offsetHours = Math.round((timezoneTime.getTime() - localTime.getTime()) / (1000 * 60 * 60));
                    
                    let offsetText = '';
                    if (offsetHours > 0) {
                        offsetText = ` (${offsetHours} hours ahead)`;
                    } else if (offsetHours < 0) {
                        offsetText = ` (${Math.abs(offsetHours)} hours behind)`;
                    } else {
                        offsetText = ' (same time)';
                    }
                    
                    if (lowerMessage.includes('day') && !lowerMessage.includes('date')) {
                        // User is asking about the day of the week in that timezone
                        return `Today is ${dayOfWeek} in ${location.charAt(0).toUpperCase() + location.slice(1)}${offsetText}.`;
                    } else {
                        // User is asking about the full date in that timezone
                        return `Today is ${dayOfWeek}, ${month} ${ordinalDate}, ${year} in ${location.charAt(0).toUpperCase() + location.slice(1)}${offsetText}.`;
                    }
                } catch (error) {
                    return `I'm sorry, I couldn't get the date for ${location}. Please try a different location.`;
                }
            }
        }
        
        return null;
    }
    
    handleCombinedDateTimeQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for timezone-specific combined queries
        const timezoneResult = this.handleTimezoneCombinedQuery(message);
        if (timezoneResult) {
            return timezoneResult;
        }
        
        // Get current date and time information
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayOfWeek = days[now.getDay()];
        const month = months[now.getMonth()];
        const date = now.getDate();
        const year = now.getFullYear();
        
        // Get time information
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        
        // Add ordinal suffix to date
        const getOrdinalSuffix = (day) => {
            if (day >= 11 && day <= 13) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        
        const ordinalDate = date + getOrdinalSuffix(date);
        
        // Create combined response
        return `Today is ${dayOfWeek}, ${month} ${ordinalDate}, ${year} and the current time is ${displayHours}:${displayMinutes} ${ampm}.`;
    }
    
    handleTimezoneCombinedQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check if the message contains both combined keywords and location keywords
        const combinedKeywords = ['day and time', 'time and day', 'date and time', 'time and date', 'day time', 'time day', 'date time', 'time date'];
        const hasCombinedKeyword = combinedKeywords.some(keyword => lowerMessage.includes(keyword));
        
        if (!hasCombinedKeyword) {
            return null;
        }
        
        // Common timezone mappings (same as in handleTimezoneQuery)
        const timezoneMap = {
            'japan': 'Asia/Tokyo',
            'tokyo': 'Asia/Tokyo',
            'berlin': 'Europe/Berlin',
            'germany': 'Europe/Berlin',
            'london': 'Europe/London',
            'uk': 'Europe/London',
            'england': 'Europe/London',
            'new york': 'America/New_York',
            'nyc': 'America/New_York',
            'los angeles': 'America/Los_Angeles',
            'la': 'America/Los_Angeles',
            'california': 'America/Los_Angeles',
            'paris': 'Europe/Paris',
            'france': 'Europe/Paris',
            'rome': 'Europe/Rome',
            'italy': 'Europe/Rome',
            'madrid': 'Europe/Madrid',
            'spain': 'Europe/Madrid',
            'moscow': 'Europe/Moscow',
            'russia': 'Europe/Moscow',
            'beijing': 'Asia/Shanghai',
            'china': 'Asia/Shanghai',
            'seoul': 'Asia/Seoul',
            'korea': 'Asia/Seoul',
            'sydney': 'Australia/Sydney',
            'australia': 'Australia/Sydney',
            'mumbai': 'Asia/Kolkata',
            'india': 'Asia/Kolkata',
            'delhi': 'Asia/Kolkata',
            'dubai': 'Asia/Dubai',
            'uae': 'Asia/Dubai',
            'singapore': 'Asia/Singapore',
            'bangkok': 'Asia/Bangkok',
            'thailand': 'Asia/Bangkok',
            'jakarta': 'Asia/Jakarta',
            'indonesia': 'Asia/Jakarta',
            'manila': 'Asia/Manila',
            'philippines': 'Asia/Manila',
            'hanoi': 'Asia/Ho_Chi_Minh',
            'vietnam': 'Asia/Ho_Chi_Minh',
            'kuala lumpur': 'Asia/Kuala_Lumpur',
            'malaysia': 'Asia/Kuala_Lumpur',
            'cyberjaya': 'Asia/Kuala_Lumpur',
            'putrajaya': 'Asia/Kuala_Lumpur',
            'shah alam': 'Asia/Kuala_Lumpur',
            'petaling jaya': 'Asia/Kuala_Lumpur',
            'subang jaya': 'Asia/Kuala_Lumpur',
            'klang': 'Asia/Kuala_Lumpur',
            'george town': 'Asia/Kuala_Lumpur',
            'penang': 'Asia/Kuala_Lumpur',
            'ipoh': 'Asia/Kuala_Lumpur',
            'johor bahru': 'Asia/Kuala_Lumpur',
            'johor': 'Asia/Kuala_Lumpur',
            'alor setar': 'Asia/Kuala_Lumpur',
            'kota kinabalu': 'Asia/Kuala_Lumpur',
            'kuching': 'Asia/Kuala_Lumpur',
            'miri': 'Asia/Kuala_Lumpur',
            'sibu': 'Asia/Kuala_Lumpur',
            'sandakan': 'Asia/Kuala_Lumpur',
            'taiping': 'Asia/Kuala_Lumpur',
            'seremban': 'Asia/Kuala_Lumpur',
            'nilai': 'Asia/Kuala_Lumpur',
            'port dickson': 'Asia/Kuala_Lumpur',
            'malacca city': 'Asia/Kuala_Lumpur',
            'dhaka': 'Asia/Dhaka',
            'bangladesh': 'Asia/Dhaka',
            'tangail': 'Asia/Dhaka',
            'tangail city': 'Asia/Dhaka',
            'chittagong': 'Asia/Dhaka',
            'sylhet': 'Asia/Dhaka',
            'rajshahi': 'Asia/Dhaka',
            'khulna': 'Asia/Dhaka',
            'barisal': 'Asia/Dhaka',
            'rangpur': 'Asia/Dhaka',
            'mymensingh': 'Asia/Dhaka',
            'comilla': 'Asia/Dhaka',
            'jessore': 'Asia/Dhaka',
            'bogra': 'Asia/Dhaka',
            'dinajpur': 'Asia/Dhaka',
            'pabna': 'Asia/Dhaka',
            'kustia': 'Asia/Dhaka',
            'faridpur': 'Asia/Dhaka',
            'gopalganj': 'Asia/Dhaka',
            'madaripur': 'Asia/Dhaka',
            'shariatpur': 'Asia/Dhaka',
            'rajbari': 'Asia/Dhaka',
            'magura': 'Asia/Dhaka',
            'jhenaidah': 'Asia/Dhaka',
            'narail': 'Asia/Dhaka',
            'satkhira': 'Asia/Dhaka',
            'bagerhat': 'Asia/Dhaka',
            'pirojpur': 'Asia/Dhaka',
            'barguna': 'Asia/Dhaka',
            'patuakhali': 'Asia/Dhaka',
            'bhola': 'Asia/Dhaka',
            'lakshmipur': 'Asia/Dhaka',
            'noakhali': 'Asia/Dhaka',
            'feni': 'Asia/Dhaka',
            'chandpur': 'Asia/Dhaka',
            'cox\'s bazar': 'Asia/Dhaka',
            'coxs bazar': 'Asia/Dhaka',
            'bandarban': 'Asia/Dhaka',
            'rangamati': 'Asia/Dhaka',
            'khagrachari': 'Asia/Dhaka',
            'kolkata': 'Asia/Kolkata',
            'calcutta': 'Asia/Kolkata',
            'chennai': 'Asia/Kolkata',
            'madras': 'Asia/Kolkata',
            'hyderabad': 'Asia/Kolkata',
            'bangalore': 'Asia/Kolkata',
            'bengaluru': 'Asia/Kolkata',
            'pune': 'Asia/Kolkata',
            'ahmedabad': 'Asia/Kolkata',
            'surat': 'Asia/Kolkata',
            'jaipur': 'Asia/Kolkata',
            'lucknow': 'Asia/Kolkata',
            'kanpur': 'Asia/Kolkata',
            'nagpur': 'Asia/Kolkata',
            'indore': 'Asia/Kolkata',
            'thane': 'Asia/Kolkata',
            'bhopal': 'Asia/Kolkata',
            'visakhapatnam': 'Asia/Kolkata',
            'patna': 'Asia/Kolkata',
            'vadodara': 'Asia/Kolkata',
            'ghaziabad': 'Asia/Kolkata',
            'ludhiana': 'Asia/Kolkata',
            'agra': 'Asia/Kolkata',
            'nashik': 'Asia/Kolkata',
            'ranchi': 'Asia/Kolkata',
            'howrah': 'Asia/Kolkata',
            'coimbatore': 'Asia/Kolkata',
            'raipur': 'Asia/Kolkata',
            'jabalpur': 'Asia/Kolkata',
            'gwalior': 'Asia/Kolkata',
            'vijayawada': 'Asia/Kolkata',
            'jodhpur': 'Asia/Kolkata',
            'madurai': 'Asia/Kolkata',
            'guwahati': 'Asia/Kolkata',
            'chandigarh': 'Asia/Kolkata',
            'amritsar': 'Asia/Kolkata',
            'allahabad': 'Asia/Kolkata',
            'rohtak': 'Asia/Kolkata',
            'mysore': 'Asia/Kolkata',
            'aurangabad': 'Asia/Kolkata',
            'solapur': 'Asia/Kolkata',
            'bhubaneswar': 'Asia/Kolkata',
            'jamshedpur': 'Asia/Kolkata',
            'bhubaneshwar': 'Asia/Kolkata',
            'varanasi': 'Asia/Kolkata',
            'srinagar': 'Asia/Kolkata',
            'salem': 'Asia/Kolkata',
            'warangal': 'Asia/Kolkata',
            'dhanbad': 'Asia/Kolkata',
            'guntur': 'Asia/Kolkata',
            'amravati': 'Asia/Kolkata',
            'noida': 'Asia/Kolkata',
            'bhiwandi': 'Asia/Kolkata',
            'bhavnagar': 'Asia/Kolkata',
            'tiruchirappalli': 'Asia/Kolkata',
            'kota': 'Asia/Kolkata',
            'ajmer': 'Asia/Kolkata',
            'calgary': 'America/Edmonton',
            'edmonton': 'America/Edmonton',
            'ottawa': 'America/Toronto',
            'winnipeg': 'America/Winnipeg',
            'halifax': 'America/Halifax',
            'st johns': 'America/St_Johns',
            'newfoundland': 'America/St_Johns',
            'victoria': 'America/Vancouver',
            'saskatoon': 'America/Regina',
            'regina': 'America/Regina',
            'quebec': 'America/Toronto',
            'quebec city': 'America/Toronto',
            'hamilton': 'America/Toronto',
            'kitchener': 'America/Toronto',
            'waterloo': 'America/Toronto',
            'london ontario': 'America/Toronto',
            'windsor': 'America/Toronto',
            'kingston': 'America/Toronto',
            'sudbury': 'America/Toronto',
            'thunder bay': 'America/Toronto',
            'saint john': 'America/Halifax',
            'fredericton': 'America/Halifax',
            'charlottetown': 'America/Halifax',
            'whitehorse': 'America/Whitehorse',
            'yellowknife': 'America/Yellowknife',
            'iqaluit': 'America/Iqaluit',
            'nunavut': 'America/Iqaluit',
            'yukon': 'America/Whitehorse',
            'northwest territories': 'America/Yellowknife',
            'dallas': 'America/Chicago',
            'fort worth': 'America/Chicago',
            'austin': 'America/Chicago',
            'san antonio': 'America/Chicago',
            'el paso': 'America/Denver',
            'arlington': 'America/Chicago',
            'corpus christi': 'America/Chicago',
            'plano': 'America/Chicago',
            'laredo': 'America/Chicago',
            'lubbock': 'America/Chicago',
            'garland': 'America/Chicago',
            'irving': 'America/Chicago',
            'amarillo': 'America/Chicago',
            'grand prairie': 'America/Chicago',
            'brownsville': 'America/Chicago',
            'pasadena': 'America/Chicago',
            'mckinney': 'America/Chicago',
            'mesa': 'America/Phoenix',
            'tucson': 'America/Phoenix',
            'chandler': 'America/Phoenix',
            'scottsdale': 'America/Phoenix',
            'glendale': 'America/Phoenix',
            'gilbert': 'America/Phoenix',
            'tempe': 'America/Phoenix',
            'peoria': 'America/Phoenix',
            'surprise': 'America/Phoenix',
            'yuma': 'America/Phoenix',
            'avondale': 'America/Phoenix',
            'goodyear': 'America/Phoenix',
            'flagstaff': 'America/Phoenix',
            'buckeye': 'America/Phoenix',
            'casa grande': 'America/Phoenix',
            'lake havasu city': 'America/Phoenix',
            'maricopa': 'America/Phoenix',
            'oregon': 'America/Los_Angeles',
            'portland': 'America/Los_Angeles',
            'salem': 'America/Los_Angeles',
            'eugene': 'America/Los_Angeles',
            'gresham': 'America/Los_Angeles',
            'hillsboro': 'America/Los_Angeles',
            'beaverton': 'America/Los_Angeles',
            'bend': 'America/Los_Angeles',
            'medford': 'America/Los_Angeles',
            'springfield': 'America/Los_Angeles',
            'corvallis': 'America/Los_Angeles',
            'albany': 'America/Los_Angeles',
            'tigard': 'America/Los_Angeles',
            'lake oswego': 'America/Los_Angeles',
            'keizer': 'America/Los_Angeles',
            'grant\'s pass': 'America/Los_Angeles',
            'oregon city': 'America/Los_Angeles',
            'orlando': 'America/New_York',
            'tampa': 'America/New_York',
            'jacksonville': 'America/New_York',
            'fort lauderdale': 'America/New_York',
            'tallahassee': 'America/New_York',
            'gainesville': 'America/New_York',
            'daytona beach': 'America/New_York',
            'clearwater': 'America/New_York',
            'coral springs': 'America/New_York',
            'cape coral': 'America/New_York',
            'port st lucie': 'America/New_York',
            'sarasota': 'America/New_York',
            'palm bay': 'America/New_York',
            'pompano beach': 'America/New_York',
            'hollywood': 'America/New_York',
            'lakeland': 'America/New_York',
            'bradenton': 'America/New_York',
            'fort myers': 'America/New_York',
            'kissimmee': 'America/New_York',
            'boynton beach': 'America/New_York',
            'delray beach': 'America/New_York',
            'boca raton': 'America/New_York',
            'west palm beach': 'America/New_York',
            'palm beach': 'America/New_York',
            'naples': 'America/New_York',
            'melbourne': 'America/New_York',
            'daytona': 'America/New_York',
            'spokane': 'America/Los_Angeles',
            'tacoma': 'America/Los_Angeles',
            'vancouver wa': 'America/Los_Angeles',
            'bellevue': 'America/Los_Angeles',
            'kent': 'America/Los_Angeles',
            'everett': 'America/Los_Angeles',
            'renton': 'America/Los_Angeles',
            'yakima': 'America/Los_Angeles',
            'spokane valley': 'America/Los_Angeles',
            'federal way': 'America/Los_Angeles',
            'bellingham': 'America/Los_Angeles',
            'kennewick': 'America/Los_Angeles',
            'auburn': 'America/Los_Angeles',
            'pasco': 'America/Los_Angeles',
            'marysville': 'America/Los_Angeles',
            'lakewood': 'America/Los_Angeles',
            'redmond': 'America/Los_Angeles',
            'shoreline': 'America/Los_Angeles',
            'richland': 'America/Los_Angeles',
            'olympia': 'America/Los_Angeles',
            'lynnwood': 'America/Los_Angeles',
            'bremerton': 'America/Los_Angeles',
            'puyallup': 'America/Los_Angeles',
            'colorado springs': 'America/Denver',
            'aurora': 'America/Denver',
            'fort collins': 'America/Denver',
            'lakewood': 'America/Denver',
            'thornton': 'America/Denver',
            'arvada': 'America/Denver',
            'westminster': 'America/Denver',
            'pueblo': 'America/Denver',
            'boulder': 'America/Denver',
            'greeley': 'America/Denver',
            'longmont': 'America/Denver',
            'grand junction': 'America/Denver',
            'loveland': 'America/Denver',
            'broomfield': 'America/Denver',
            'castle rock': 'America/Denver',
            'commerce city': 'America/Denver',
            'parker': 'America/Denver',
            'littleton': 'America/Denver',
            'northglenn': 'America/Denver',
            'wheat ridge': 'America/Denver',
            'englewood': 'America/Denver',
            'centennial': 'America/Denver',
            'highlands ranch': 'America/Denver',
            'fairbanks': 'America/Anchorage',
            'juneau': 'America/Anchorage',
            'sitka': 'America/Anchorage',
            'ketchikan': 'America/Anchorage',
            'kenai': 'America/Anchorage',
            'kodiak': 'America/Anchorage',
            'bethel': 'America/Anchorage',
            'palmer': 'America/Anchorage',
            'wasilla': 'America/Anchorage',
            'hilo': 'Pacific/Honolulu',
            'kailua': 'Pacific/Honolulu',
            'kapolei': 'Pacific/Honolulu',
            'ewa beach': 'Pacific/Honolulu',
            'mililani town': 'Pacific/Honolulu',
            'kihei': 'Pacific/Honolulu',
            'maui': 'Pacific/Honolulu',
            'kailua kona': 'Pacific/Honolulu',
            'kaneohe': 'Pacific/Honolulu',
            'ewa': 'Pacific/Honolulu',
            'mililani': 'Pacific/Honolulu',
            'kahului': 'Pacific/Honolulu',
            'lahaina': 'Pacific/Honolulu',
            'waipahu': 'Pacific/Honolulu',
            'pearl city': 'Pacific/Honolulu',
            'waimalu': 'Pacific/Honolulu',
            'nanakuli': 'Pacific/Honolulu',
            'wahiawa': 'Pacific/Honolulu',
            'schofield barracks': 'Pacific/Honolulu',
            'wailuku': 'Pacific/Honolulu',
            'waianae': 'Pacific/Honolulu',
            'makakilo city': 'Pacific/Honolulu',
            'lyon': 'Europe/Paris',
            'marseille': 'Europe/Paris',
            'toulouse': 'Europe/Paris',
            'nice': 'Europe/Paris',
            'nantes': 'Europe/Paris',
            'strasbourg': 'Europe/Paris',
            'montpellier': 'Europe/Paris',
            'bordeaux': 'Europe/Paris',
            'lille': 'Europe/Paris',
            'rennes': 'Europe/Paris',
            'reims': 'Europe/Paris',
            'saint-etienne': 'Europe/Paris',
            'toulon': 'Europe/Paris',
            'le havre': 'Europe/Paris',
            'grenoble': 'Europe/Paris',
            'dijon': 'Europe/Paris',
            'angers': 'Europe/Paris',
            'saint-denis': 'Europe/Paris',
            'villeurbanne': 'Europe/Paris',
            'le mans': 'Europe/Paris',
            'aix-en-provence': 'Europe/Paris',
            'brest': 'Europe/Paris',
            'nimes': 'Europe/Paris',
            'tours': 'Europe/Paris',
            'limoges': 'Europe/Paris',
            'clermont-ferrand': 'Europe/Paris',
            'milan': 'Europe/Rome',
            'naples': 'Europe/Rome',
            'turin': 'Europe/Rome',
            'palermo': 'Europe/Rome',
            'genoa': 'Europe/Rome',
            'bologna': 'Europe/Rome',
            'florence': 'Europe/Rome',
            'bari': 'Europe/Rome',
            'catania': 'Europe/Rome',
            'venice': 'Europe/Rome',
            'verona': 'Europe/Rome',
            'messina': 'Europe/Rome',
            'padova': 'Europe/Rome',
            'trieste': 'Europe/Rome',
            'taranto': 'Europe/Rome',
            'brescia': 'Europe/Rome',
            'parma': 'Europe/Rome',
            'modena': 'Europe/Rome',
            'reggio calabria': 'Europe/Rome',
            'reggio emilia': 'Europe/Rome',
            'perugia': 'Europe/Rome',
            'livorno': 'Europe/Rome',
            'ravenna': 'Europe/Rome',
            'cagliari': 'Europe/Rome',
            'rimini': 'Europe/Rome',
            'salerno': 'Europe/Rome',
            'ferrara': 'Europe/Rome',
            'sassari': 'Europe/Rome',
            'syracuse': 'Europe/Rome',
            'pescara': 'Europe/Rome',
            'bergamo': 'Europe/Rome',
            'vicenza': 'Europe/Rome',
            'trento': 'Europe/Rome',
            'forli': 'Europe/Rome',
            'novara': 'Europe/Rome',
            'piacenza': 'Europe/Rome',
            'bolzano': 'Europe/Rome',
            'udine': 'Europe/Rome',
            'arezzo': 'Europe/Rome',
            'lecce': 'Europe/Rome',
            'barcelona': 'Europe/Madrid',
            'valencia': 'Europe/Madrid',
            'sevilla': 'Europe/Madrid',
            'seville': 'Europe/Madrid',
            'zaragoza': 'Europe/Madrid',
            'malaga': 'Europe/Madrid',
            'murcia': 'Europe/Madrid',
            'palma': 'Europe/Madrid',
            'las palmas': 'Europe/Madrid',
            'bilbao': 'Europe/Madrid',
            'alicante': 'Europe/Madrid',
            'cordoba': 'Europe/Madrid',
            'valladolid': 'Europe/Madrid',
            'vigo': 'Europe/Madrid',
            'gijon': 'Europe/Madrid',
            'hospitalet': 'Europe/Madrid',
            'la coruna': 'Europe/Madrid',
            'vitoria': 'Europe/Madrid',
            'granada': 'Europe/Madrid',
            'elche': 'Europe/Madrid',
            'tarrasa': 'Europe/Madrid',
            'badalona': 'Europe/Madrid',
            'cartagena': 'Europe/Madrid',
            'jerez': 'Europe/Madrid',
            'sabadell': 'Europe/Madrid',
            'mostoles': 'Europe/Madrid',
            'alcala de henares': 'Europe/Madrid',
            'pamplona': 'Europe/Madrid',
            'fuenlabrada': 'Europe/Madrid',
            'almeria': 'Europe/Madrid',
            'san sebastian': 'Europe/Madrid',
            'leganes': 'Europe/Madrid',
            'santander': 'Europe/Madrid',
            'castellon': 'Europe/Madrid',
            'burgos': 'Europe/Madrid',
            'albacete': 'Europe/Madrid',
            'alcorcon': 'Europe/Madrid',
            'getafe': 'Europe/Madrid',
            'salamanca': 'Europe/Madrid',
            'huelva': 'Europe/Madrid',
            'marbella': 'Europe/Madrid',
            'logrono': 'Europe/Madrid',
            'tarragona': 'Europe/Madrid',
            'leon': 'Europe/Madrid',
            'cadiz': 'Europe/Madrid',
            'laredo': 'Europe/Madrid',
            'jaen': 'Europe/Madrid',
            'orensa': 'Europe/Madrid',
            'gerona': 'Europe/Madrid',
            'lugo': 'Europe/Madrid',
            'caceres': 'Europe/Madrid',
            'toledo': 'Europe/Madrid',
            'ceuta': 'Europe/Madrid',
            'girona': 'Europe/Madrid',
            'saint petersburg': 'Europe/Moscow',
            'novosibirsk': 'Asia/Novosibirsk',
            'yekaterinburg': 'Asia/Yekaterinburg',
            'kazan': 'Europe/Moscow',
            'nizhny novgorod': 'Europe/Moscow',
            'chelyabinsk': 'Asia/Yekaterinburg',
            'samara': 'Europe/Samara',
            'omsk': 'Asia/Omsk',
            'rostov': 'Europe/Moscow',
            'ufa': 'Asia/Yekaterinburg',
            'krasnoyarsk': 'Asia/Krasnoyarsk',
            'perm': 'Asia/Yekaterinburg',
            'voronezh': 'Europe/Moscow',
            'volgograd': 'Europe/Moscow',
            'krasnodar': 'Europe/Moscow',
            'saratov': 'Europe/Samara',
            'tyumen': 'Asia/Yekaterinburg',
            'tolyatti': 'Europe/Moscow',
            'izhevsk': 'Asia/Yekaterinburg',
            'barnaul': 'Asia/Novosibirsk',
            'ulyanovsk': 'Europe/Moscow',
            'irkutsk': 'Asia/Irkutsk',
            'khabarovsk': 'Asia/Vladivostok',
            'yaroslavl': 'Europe/Moscow',
            'vladivostok': 'Asia/Vladivostok',
            'makhachkala': 'Europe/Moscow',
            'tomsk': 'Asia/Novosibirsk',
            'orenburg': 'Asia/Yekaterinburg',
            'kemerovo': 'Asia/Novosibirsk',
            'novokuznetsk': 'Asia/Novosibirsk',
            'ryazan': 'Europe/Moscow',
            'astrahan': 'Europe/Moscow',
            'naberezhnye chelny': 'Europe/Moscow',
            'penza': 'Europe/Moscow',
            'lipetsk': 'Europe/Moscow',
            'kirov': 'Europe/Moscow',
            'cheboksary': 'Europe/Moscow',
            'tula': 'Europe/Moscow',
            'kaliningrad': 'Europe/Kaliningrad',
            'balashikha': 'Europe/Moscow',
            'krasnogorsk': 'Europe/Moscow',
            'podolsk': 'Europe/Moscow',
            'khimki': 'Europe/Moscow',
            'elektrostal': 'Europe/Moscow',
            'odintsovo': 'Europe/Moscow',
            'korolyov': 'Europe/Moscow',
            'lyubertsy': 'Europe/Moscow',
            'domodedovo': 'Europe/Moscow',
            'reutov': 'Europe/Moscow',
            'zelenograd': 'Europe/Moscow',
            'ramenskoye': 'Europe/Moscow',
            'pushkino': 'Europe/Moscow',
            'dolgoprudny': 'Europe/Moscow',
            'klimovsk': 'Europe/Moscow',
            'vidnoye': 'Europe/Moscow',
            'troitsk': 'Europe/Moscow',
            'lobnya': 'Europe/Moscow',
            'dzerzhinsky': 'Europe/Moscow',
            'krasnoznamensk': 'Europe/Moscow',
            'kotelniki': 'Europe/Moscow',
            'lytkarino': 'Europe/Moscow',
            'butovo': 'Europe/Moscow',
            'shcherbinka': 'Europe/Moscow'
        };
        
        // Check if the message contains a timezone
        for (const [location, timezone] of Object.entries(timezoneMap)) {
            if (lowerMessage.includes(location)) {
                try {
                    const now = new Date();
                    const timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
                    
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const dayOfWeek = days[timeInTimezone.getDay()];
                    const month = months[timeInTimezone.getMonth()];
                    const date = timeInTimezone.getDate();
                    const year = timeInTimezone.getFullYear();
                    
                    // Get time information in that timezone
                    const hours = timeInTimezone.getHours();
                    const minutes = timeInTimezone.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const displayHours = hours % 12 || 12;
                    const displayMinutes = minutes.toString().padStart(2, '0');
                    
                    // Add ordinal suffix to date
                    const getOrdinalSuffix = (day) => {
                        if (day >= 11 && day <= 13) return 'th';
                        switch (day % 10) {
                            case 1: return 'st';
                            case 2: return 'nd';
                            case 3: return 'rd';
                            default: return 'th';
                        }
                    };
                    
                    const ordinalDate = date + getOrdinalSuffix(date);
                    
                    // Get timezone offset for display
                    const localTime = new Date();
                    const timezoneTime = new Date(localTime.toLocaleString('en-US', { timeZone: timezone }));
                    const offsetHours = Math.round((timezoneTime.getTime() - localTime.getTime()) / (1000 * 60 * 60));
                    
                    let offsetText = '';
                    if (offsetHours > 0) {
                        offsetText = ` (${offsetHours} hours ahead)`;
                    } else if (offsetHours < 0) {
                        offsetText = ` (${Math.abs(offsetHours)} hours behind)`;
                    } else {
                        offsetText = ' (same time)';
                    }
                    
                    return `Today is ${dayOfWeek}, ${month} ${ordinalDate}, ${year} and the current time is ${displayHours}:${displayMinutes} ${ampm} in ${location.charAt(0).toUpperCase() + location.slice(1)}${offsetText}.`;
                } catch (error) {
                    return `I'm sorry, I couldn't get the date and time for ${location}. Please try a different location.`;
                }
            }
        }
        
        return null;
    }
    
    scrollToBottom() {
        setTimeout(() => {
            // Extra offset for mobile input area
            let extraOffset = 0;
            if (window.innerWidth <= 768) {
                extraOffset = 100; // Adjust this value if your input area is taller
            }
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight + extraOffset;
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
    
    initUserMenu() {
        const userButton = document.getElementById('userButton');
        const userMenu = document.getElementById('userMenu');
        
        if (userButton && userMenu) {
            userButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('show');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target) && !userButton.contains(e.target)) {
                    userMenu.classList.remove('show');
                }
            });
            
            // Close menu when pressing Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    userMenu.classList.remove('show');
                }
            });
            
            // Handle menu option clicks
            this.initMenuOptions();
        }
    }
    
    initMenuOptions() {
        const customizeOption = document.getElementById('customizeOption');
        const settingsOption = document.getElementById('settingsOption');
        const editProfileOption = document.getElementById('editProfileOption');
        const loginLogoutOption = document.getElementById('loginLogoutOption');
        
        if (customizeOption) {
            customizeOption.addEventListener('click', () => {
                this.handleCustomizeVen();
            });
        }
        
        if (settingsOption) {
            settingsOption.addEventListener('click', () => {
                this.handleSettings();
            });
        }
        
        if (editProfileOption) {
            editProfileOption.addEventListener('click', () => {
                this.handleEditProfile();
            });
        }
        
        if (loginLogoutOption) {
            loginLogoutOption.addEventListener('click', () => {
                this.handleLoginLogout();
            });
        }
    }
    
    handleCustomizeVen() {
        // Close the menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.remove('show');
        }
        
        this.showCustomizeModal();
    }
    
    handleSettings() {
        // Close the menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.remove('show');
        }
        
        this.showSettingsModal();
    }
    
    handleLoginLogout() {
        // Close the menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.remove('show');
        }
        
        if (this.isLoggedIn) {
            this.logout();
        } else {
            this.showLoginModal();
        }
    }
    
    handleEditProfile() {
        // Close the menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.remove('show');
        }
        
        this.showEditProfileModal();
    }
    
    initLoginSystem() {
        const loginModal = document.getElementById('loginModal');
        const closeLoginModal = document.getElementById('closeLoginModal');
        const loginBtn = document.getElementById('loginBtn');
        const signupLink = document.getElementById('signupLink');
        const uploadBtn = document.getElementById('uploadBtn');
        const profileImage = document.getElementById('profileImage');
        
        // Close modal when clicking close button
        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', () => {
                this.hideLoginModal();
            });
        }
        
        // Close modal when clicking outside
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    this.hideLoginModal();
                }
            });
        }
        
        // Handle login button click
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.handleLogin();
            });
        }
        
        // Handle signup link click
        if (signupLink) {
            signupLink.addEventListener('click', () => {
                this.toggleLoginSignup();
            });
        }
        
        // Handle profile image upload
        if (uploadBtn && profileImage) {
            uploadBtn.addEventListener('click', () => {
                profileImage.click();
            });
            
            profileImage.addEventListener('change', (e) => {
                this.handleProfileImageUpload(e);
            });
        }
        
        // Initialize edit profile system
        this.initEditProfileSystem();
        
        // Initialize customization system
        this.initCustomizationSystem();
        
        // Initialize settings system
        this.initSettingsSystem();
    }
    
    initEditProfileSystem() {
        const editProfileModal = document.getElementById('editProfileModal');
        const closeEditProfileModal = document.getElementById('closeEditProfileModal');
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        const editUploadBtn = document.getElementById('editUploadBtn');
        const editProfileImage = document.getElementById('editProfileImage');
        
        // Close modal when clicking close button
        if (closeEditProfileModal) {
            closeEditProfileModal.addEventListener('click', () => {
                this.hideEditProfileModal();
            });
        }
        
        // Close modal when clicking outside
        if (editProfileModal) {
            editProfileModal.addEventListener('click', (e) => {
                if (e.target === editProfileModal) {
                    this.hideEditProfileModal();
                }
            });
        }
        
        // Handle save profile button click
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                this.handleSaveProfile();
            });
        }
        
        // Handle edit profile image upload
        if (editUploadBtn && editProfileImage) {
            editUploadBtn.addEventListener('click', () => {
                editProfileImage.click();
            });
            
            editProfileImage.addEventListener('change', (e) => {
                this.handleEditProfileImageUpload(e);
            });
        }
    }
    
    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.add('show');
            this.resetLoginForm();
        }
    }
    
    resetLoginForm() {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userPassword = document.getElementById('userPassword');
        const profilePreview = document.getElementById('profilePreview');
        
        if (userName) userName.value = '';
        if (userEmail) userEmail.value = '';
        if (userPassword) userPassword.value = '';
        if (profilePreview) profilePreview.innerHTML = '<i class="fas fa-user"></i>';
        
        this.profileImageData = null;
        this.isSignupMode = false;
        
        // Reset form to login mode
        const loginBtn = document.getElementById('loginBtn');
        const signupLink = document.getElementById('signupLink');
        const loginHeader = document.querySelector('.login-header h2');
        
        if (loginHeader) loginHeader.textContent = 'Login to Ven';
        if (loginBtn) loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        if (signupLink) signupLink.textContent = 'Sign up';
    }
    
    showEditProfileModal() {
        const editProfileModal = document.getElementById('editProfileModal');
        if (editProfileModal) {
            editProfileModal.classList.add('show');
            this.populateEditProfileForm();
        }
    }
    
    hideEditProfileModal() {
        const editProfileModal = document.getElementById('editProfileModal');
        if (editProfileModal) {
            editProfileModal.classList.remove('show');
        }
    }
    
    populateEditProfileForm() {
        if (!this.currentUser) return;
        
        const editUserName = document.getElementById('editUserName');
        const editUserEmail = document.getElementById('editUserEmail');
        const editProfilePreview = document.getElementById('editProfilePreview');
        
        if (editUserName) editUserName.value = this.currentUser.name;
        if (editUserEmail) editUserEmail.value = this.currentUser.email;
        
        if (editProfilePreview) {
            if (this.currentUser.profileImage) {
                editProfilePreview.innerHTML = `<img src="${this.currentUser.profileImage}" alt="Profile">`;
            } else {
                editProfilePreview.innerHTML = '<i class="fas fa-user"></i>';
            }
        }
        
        // Reset the edit profile image data
        this.editProfileImageData = null;
    }
    
    handleEditProfileImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Check file size (limit to 5MB for mobile compatibility)
            if (file.size > 5 * 1024 * 1024) {
                this.addMessage("Image file is too large. Please choose an image smaller than 5MB.", 'bot');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                this.addMessage("Please select a valid image file.", 'bot');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const editProfilePreview = document.getElementById('editProfilePreview');
                    if (editProfilePreview) {
                        editProfilePreview.innerHTML = `<img src="${e.target.result}" alt="Profile" style="max-width: 100%; height: auto;">`;
                    }
                    this.editProfileImageData = e.target.result;
                    console.log('Edit profile image loaded successfully');
                } catch (error) {
                    console.error('Error loading edit profile image:', error);
                    this.addMessage("Error loading image. Please try again.", 'bot');
                }
            };
            
            reader.onerror = () => {
                console.error('FileReader error in edit profile');
                this.addMessage("Error reading image file. Please try again.", 'bot');
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    handleSaveProfile() {
        const editUserName = document.getElementById('editUserName');
        const editUserEmail = document.getElementById('editUserEmail');
        
        const newName = editUserName ? editUserName.value.trim() : '';
        const newEmail = editUserEmail ? editUserEmail.value.trim() : '';
        
        if (!newName || !newEmail) {
            this.addMessage("Please fill in all fields.", 'bot');
            return;
        }
        
        if (!this.isValidEmail(newEmail)) {
            this.addMessage("Please enter a valid email address.", 'bot');
            return;
        }
        
        // Update user data
        this.currentUser.name = newName;
        this.currentUser.email = newEmail;
        
        // Update profile image if changed
        if (this.editProfileImageData) {
            this.currentUser.profileImage = this.editProfileImageData;
            console.log('Profile image updated:', this.currentUser.profileImage ? 'Image data present' : 'No image data');
        }
        
        // Save updated data
        this.saveUserData();
        this.updateUserInterface();
        
        // Refresh the current chat display to show updated profile pictures
        this.displayCurrentChat();
        
        // Also update all existing user message avatars in the current chat
        this.updateExistingUserAvatars();
        
        this.hideEditProfileModal();
        
        this.addMessage(`Profile updated successfully! Your name is now ${newName}.`, 'bot');
    }
    
    initCustomizationSystem() {
        const customizeModal = document.getElementById('customizeModal');
        const closeCustomizeModal = document.getElementById('closeCustomizeModal');
        const saveCustomizationBtn = document.getElementById('saveCustomizationBtn');
        
        // Close modal when clicking close button
        if (closeCustomizeModal) {
            closeCustomizeModal.addEventListener('click', () => {
                this.hideCustomizeModal();
            });
        }
        
        // Close modal when clicking outside
        if (customizeModal) {
            customizeModal.addEventListener('click', (e) => {
                if (e.target === customizeModal) {
                    this.hideCustomizeModal();
                }
            });
        }
        
        // Handle save customization button click
        if (saveCustomizationBtn) {
            saveCustomizationBtn.addEventListener('click', () => {
                this.handleSaveCustomization();
            });
        }
        
        // Load saved customization settings
        this.loadCustomizationSettings();
    }
    
    showCustomizeModal() {
        const customizeModal = document.getElementById('customizeModal');
        if (customizeModal) {
            customizeModal.classList.add('show');
            this.populateCustomizationForm();
        }
    }
    
    hideCustomizeModal() {
        const customizeModal = document.getElementById('customizeModal');
        if (customizeModal) {
            customizeModal.classList.remove('show');
        }
    }
    
    populateCustomizationForm() {
        // Set the selected style option
        const styleOptions = document.querySelectorAll('.style-option');
        styleOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.style === this.customizationSettings.responseStyle) {
                option.classList.add('selected');
            }
        });
        
        // Set toggle states
        const emojiToggle = document.getElementById('emojiToggle');
        const detailedToggle = document.getElementById('detailedToggle');
        
        if (emojiToggle) emojiToggle.checked = this.customizationSettings.includeEmojis;
        if (detailedToggle) detailedToggle.checked = this.customizationSettings.detailedExplanations;
        
        // Add click handlers for style options
        styleOptions.forEach(option => {
            option.addEventListener('click', () => {
                styleOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }
    
    handleSaveCustomization() {
        // Get selected style
        const selectedStyle = document.querySelector('.style-option.selected');
        const style = selectedStyle ? selectedStyle.dataset.style : 'friendly';
        
        // Get toggle states
        const emojiToggle = document.getElementById('emojiToggle');
        const detailedToggle = document.getElementById('detailedToggle');
        
        const includeEmojis = emojiToggle ? emojiToggle.checked : true;
        const detailedExplanations = detailedToggle ? detailedToggle.checked : false;
        
        // Update settings
        this.customizationSettings = {
            responseStyle: style,
            includeEmojis: includeEmojis,
            detailedExplanations: detailedExplanations
        };
        
        // Save settings
        this.saveCustomizationSettings();
        this.hideCustomizeModal();
        
        this.addMessage(`Customization saved! Ven will now respond in ${style} style.`, 'bot');
    }
    
    saveCustomizationSettings() {
        try {
            localStorage.setItem('venCustomization', JSON.stringify(this.customizationSettings));
        } catch (error) {
            console.error('Error saving customization settings:', error);
        }
    }
    
    loadCustomizationSettings() {
        try {
            const savedSettings = localStorage.getItem('venCustomization');
            if (savedSettings) {
                this.customizationSettings = { ...this.customizationSettings, ...JSON.parse(savedSettings) };
            }
            
            // Apply theme on load
            this.applyTheme(this.customizationSettings.lightMode);
        } catch (error) {
            console.error('Error loading customization settings:', error);
        }
    }
    
    toggleTheme(isLightMode) {
        this.applyTheme(isLightMode);
        this.customizationSettings.lightMode = isLightMode;
        this.saveCustomizationSettings();
    }
    
    applyTheme(isLightMode) {
        const body = document.body;
        if (isLightMode) {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    }
    
    initSettingsSystem() {
        const settingsModal = document.getElementById('settingsModal');
        const closeSettingsModal = document.getElementById('closeSettingsModal');
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        
        // Close modal when clicking close button
        if (closeSettingsModal) {
            closeSettingsModal.addEventListener('click', () => {
                this.hideSettingsModal();
            });
        }
        
        // Close modal when clicking outside
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    this.hideSettingsModal();
                }
            });
        }
        
        // Handle save settings button click
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.handleSaveSettings();
            });
        }
        
        // Load saved settings
        this.loadSettings();
    }
    
    showSettingsModal() {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.classList.add('show');
            this.populateSettingsForm();
        }
    }
    
    hideSettingsModal() {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.classList.remove('show');
        }
    }
    
    populateSettingsForm() {
        // Set toggle states
        const themeToggle = document.getElementById('settingsThemeToggle');
        const autoScrollToggle = document.getElementById('autoScrollToggle');
        const soundToggle = document.getElementById('soundToggle');
        const dataCollectionToggle = document.getElementById('dataCollectionToggle');
        
        if (themeToggle) themeToggle.checked = this.customizationSettings.lightMode;
        if (autoScrollToggle) autoScrollToggle.checked = this.settings?.autoScroll ?? true;
        if (soundToggle) soundToggle.checked = this.settings?.soundNotifications ?? false;
        if (dataCollectionToggle) dataCollectionToggle.checked = this.settings?.dataCollection ?? false;
        
        // Add theme toggle handler
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                this.toggleTheme(themeToggle.checked);
            });
        }
    }
    
    handleSaveSettings() {
        // Get toggle states
        const themeToggle = document.getElementById('settingsThemeToggle');
        const autoScrollToggle = document.getElementById('autoScrollToggle');
        const soundToggle = document.getElementById('soundToggle');
        const dataCollectionToggle = document.getElementById('dataCollectionToggle');
        
        const lightMode = themeToggle ? themeToggle.checked : false;
        const autoScroll = autoScrollToggle ? autoScrollToggle.checked : true;
        const soundNotifications = soundToggle ? soundToggle.checked : false;
        const dataCollection = dataCollectionToggle ? dataCollectionToggle.checked : false;
        
        // Update settings
        this.customizationSettings.lightMode = lightMode;
        this.settings = {
            autoScroll: autoScroll,
            soundNotifications: soundNotifications,
            dataCollection: dataCollection
        };
        
        // Save settings
        this.saveSettings();
        this.hideSettingsModal();
        
        this.addMessage("Settings saved successfully!", 'bot');
    }
    
    saveSettings() {
        try {
            localStorage.setItem('venSettings', JSON.stringify(this.settings));
            this.saveCustomizationSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('venSettings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } else {
                this.settings = {
                    autoScroll: true,
                    soundNotifications: false,
                    dataCollection: false
                };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = {
                autoScroll: true,
                soundNotifications: false,
                dataCollection: false
            };
        }
    }
    
    applyResponseStyle(message) {
        const style = this.customizationSettings.responseStyle;
        const includeEmojis = this.customizationSettings.includeEmojis;
        
        let styledMessage = message;
        
        switch (style) {
            case 'casual':
                styledMessage = this.applyCasualStyle(message, includeEmojis);
                break;
            case 'friendly':
                styledMessage = this.applyFriendlyStyle(message, includeEmojis);
                break;
            case 'formal':
                styledMessage = this.applyFormalStyle(message, includeEmojis);
                break;
            case 'creative':
                styledMessage = this.applyCreativeStyle(message, includeEmojis);
                break;
            default:
                styledMessage = this.applyFriendlyStyle(message, includeEmojis);
        }
        
        return styledMessage;
    }
    
    applyCasualStyle(message, includeEmojis) {
        let styled = message;
        
        // Add casual language patterns
        styled = styled.replace(/Hello/g, includeEmojis ? 'Hey there! 👋' : 'Hey there!');
        styled = styled.replace(/Thank you/g, includeEmojis ? 'Thanks! 🙏' : 'Thanks!');
        styled = styled.replace(/You're welcome/g, includeEmojis ? 'No problem! 😊' : 'No problem!');
        styled = styled.replace(/I'm sorry/g, includeEmojis ? 'Sorry about that 😅' : 'Sorry about that');
        styled = styled.replace(/That's great/g, includeEmojis ? 'That\'s awesome! 🔥' : 'That\'s awesome!');
        styled = styled.replace(/Goodbye/g, includeEmojis ? 'See ya! 👋' : 'See ya!');
        
        // Add casual expressions
        if (includeEmojis && !styled.includes('😊') && !styled.includes('🔥') && !styled.includes('👋')) {
            styled += ' 😊';
        }
        
        return styled;
    }
    
    applyFriendlyStyle(message, includeEmojis) {
        let styled = message;
        
        // Add friendly language patterns
        styled = styled.replace(/Hello/g, includeEmojis ? 'Hello! 😊' : 'Hello!');
        styled = styled.replace(/Thank you/g, includeEmojis ? 'You\'re welcome! 😊' : 'You\'re welcome!');
        styled = styled.replace(/I'm sorry/g, includeEmojis ? 'I apologize 😔' : 'I apologize');
        styled = styled.replace(/That's great/g, includeEmojis ? 'That\'s wonderful! 😊' : 'That\'s wonderful!');
        styled = styled.replace(/Goodbye/g, includeEmojis ? 'Take care! 😊' : 'Take care!');
        
        return styled;
    }
    
    applyFormalStyle(message, includeEmojis) {
        let styled = message;
        
        // Add formal language patterns
        styled = styled.replace(/Hello/g, 'Greetings');
        styled = styled.replace(/Thank you/g, 'You have my gratitude');
        styled = styled.replace(/You're welcome/g, 'It is my pleasure');
        styled = styled.replace(/I'm sorry/g, 'I sincerely apologize');
        styled = styled.replace(/That's great/g, 'That is excellent');
        styled = styled.replace(/Goodbye/g, 'Farewell');
        
        return styled;
    }
    
    applyCreativeStyle(message, includeEmojis) {
        let styled = message;
        
        // Add creative language patterns
        styled = styled.replace(/Hello/g, includeEmojis ? 'Greetings, fellow explorer! 🌟' : 'Greetings, fellow explorer!');
        styled = styled.replace(/Thank you/g, includeEmojis ? 'My gratitude flows like a river! 🌊' : 'My gratitude flows like a river!');
        styled = styled.replace(/You're welcome/g, includeEmojis ? 'The pleasure is all mine, dear friend! ✨' : 'The pleasure is all mine, dear friend!');
        styled = styled.replace(/I'm sorry/g, includeEmojis ? 'My heart aches with regret 💔' : 'My heart aches with regret');
        styled = styled.replace(/That's great/g, includeEmojis ? 'That\'s absolutely magnificent! 🌈' : 'That\'s absolutely magnificent!');
        styled = styled.replace(/Goodbye/g, includeEmojis ? 'Until we meet again, brave soul! 🌙' : 'Until we meet again, brave soul!');
        
        return styled;
    }
    
    hideLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.remove('show');
        }
    }
    
    toggleLoginSignup() {
        const loginBtn = document.getElementById('loginBtn');
        const signupLink = document.getElementById('signupLink');
        const loginHeader = document.querySelector('.login-header h2');
        
        if (this.isSignupMode) {
            // Switch to login mode
            this.isSignupMode = false;
            loginHeader.textContent = 'Login to Ven';
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            signupLink.textContent = 'Sign up';
        } else {
            // Switch to signup mode
            this.isSignupMode = true;
            loginHeader.textContent = 'Sign up for Ven';
            loginBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign up';
            signupLink.textContent = 'Login';
        }
    }
    
    handleProfileImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Check file size (limit to 5MB for mobile compatibility)
            if (file.size > 5 * 1024 * 1024) {
                this.addMessage("Image file is too large. Please choose an image smaller than 5MB.", 'bot');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                this.addMessage("Please select a valid image file.", 'bot');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const profilePreview = document.getElementById('profilePreview');
                    if (profilePreview) {
                        profilePreview.innerHTML = `<img src="${e.target.result}" alt="Profile" style="max-width: 100%; height: auto;">`;
                    }
                    this.profileImageData = e.target.result;
                    console.log('Profile image loaded successfully');
                } catch (error) {
                    console.error('Error loading profile image:', error);
                    this.addMessage("Error loading image. Please try again.", 'bot');
                }
            };
            
            reader.onerror = () => {
                console.error('FileReader error');
                this.addMessage("Error reading image file. Please try again.", 'bot');
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    handleLogin() {
        const userName = document.getElementById('userName').value.trim();
        const userEmail = document.getElementById('userEmail').value.trim();
        const userPassword = document.getElementById('userPassword').value.trim();
        
        if (!userName || !userEmail || !userPassword) {
            this.addMessage("Please fill in all fields.", 'bot');
            return;
        }
        
        if (!this.isValidEmail(userEmail)) {
            this.addMessage("Please enter a valid email address.", 'bot');
            return;
        }
        
        // Create user object
        const user = {
            name: userName,
            email: userEmail,
            password: userPassword, // In a real app, this would be hashed
            profileImage: this.profileImageData || null,
            createdAt: new Date().toISOString()
        };
        
        if (this.isSignupMode) {
            // Sign up
            this.signup(user);
        } else {
            // Login
            this.login(user);
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    signup(user) {
        // In a real app, this would save to a database
        this.currentUser = user;
        this.isLoggedIn = true;
        this.saveUserData();
        this.updateUserInterface();
        this.hideLoginModal();
        this.addMessage(`Welcome to Ven, ${user.name}! Your account has been created successfully.`, 'bot');
    }
    
    login(user) {
        // In a real app, this would validate against a database
        // For now, we'll just simulate a successful login
        this.currentUser = user;
        this.isLoggedIn = true;
        this.saveUserData();
        this.updateUserInterface();
        this.hideLoginModal();
        this.addMessage(`Welcome back, ${user.name}! You've been logged in successfully.`, 'bot');
    }
    
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.saveUserData();
        this.updateUserInterface();
        this.addMessage("You've been logged out successfully.", 'bot');
    }
    
    saveUserData() {
        try {
            const userData = {
                currentUser: this.currentUser,
                isLoggedIn: this.isLoggedIn
            };
            localStorage.setItem('venUserData', JSON.stringify(userData));
            console.log('User data saved:', userData);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }
    
    loadUserData() {
        try {
            const savedData = localStorage.getItem('venUserData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.currentUser = data.currentUser;
                this.isLoggedIn = data.isLoggedIn;
                
                // Update interface immediately after loading data
                setTimeout(() => {
                    this.updateUserInterface();
                }, 100); // Small delay to ensure DOM is ready
                
                console.log('User data loaded:', this.currentUser);
            } else {
                console.log('No saved user data found');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            // Reset to default state if there's an error
            this.currentUser = null;
            this.isLoggedIn = false;
        }
    }
    
    updateUserInterface() {
        const loginLogoutOption = document.getElementById('loginLogoutOption');
        const editProfileOption = document.getElementById('editProfileOption');
        const userInfo = document.querySelector('.user-info');
        const userButton = document.getElementById('userButton');
        
        if (this.isLoggedIn && this.currentUser) {
            // Update login/logout button
            if (loginLogoutOption) {
                loginLogoutOption.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Logout</span>';
            }
            
            // Show edit profile option when logged in
            if (editProfileOption) {
                editProfileOption.style.display = 'flex';
            }
            
            // Update user info in sidebar
            if (userInfo) {
                const userAvatar = userInfo.querySelector('.user-avatar');
                const userName = userInfo.querySelector('span');
                
                if (userAvatar) {
                    if (this.currentUser.profileImage) {
                        userAvatar.innerHTML = `<img src="${this.currentUser.profileImage}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">`;
                    } else {
                        // Create initials from name
                        const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
                        userAvatar.innerHTML = `<span style="color: #ececf1; font-weight: 600;">${initials}</span>`;
                    }
                }
                
                if (userName) {
                    userName.textContent = this.currentUser.name;
                }
            }
            
            // Update user button title for accessibility
            if (userButton) {
                userButton.title = `Logged in as ${this.currentUser.name}`;
            }
            
            // Update page title to include user name
            document.title = `Ven - ${this.currentUser.name}`;
            
        } else {
            // Reset to default state
            if (loginLogoutOption) {
                loginLogoutOption.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Login</span>';
            }
            
            // Hide edit profile option when not logged in
            if (editProfileOption) {
                editProfileOption.style.display = 'none';
            }
            
            if (userInfo) {
                const userAvatar = userInfo.querySelector('.user-avatar');
                const userName = userInfo.querySelector('span');
                
                if (userAvatar) {
                    userAvatar.innerHTML = '<i class="fas fa-user"></i>';
                }
                
                if (userName) {
                    userName.textContent = 'User';
                }
            }
            
            // Reset user button title
            if (userButton) {
                userButton.title = 'User menu';
            }
            
            // Reset page title
            document.title = 'Ven - AI Assistant';
        }
        
        // Update any other user-related elements
        this.updateUserRelatedElements();
    }
    
    updateUserRelatedElements() {
        // Update any messages that might reference the user
        if (this.isLoggedIn && this.currentUser) {
            // Update user memory with the logged-in user's name
            if (!this.userMemory.name) {
                this.userMemory.name = this.currentUser.name;
            }
            
            // Debug: Log current user state
            console.log('Current user state:', {
                isLoggedIn: this.isLoggedIn,
                userName: this.currentUser.name,
                hasProfileImage: !!this.currentUser.profileImage,
                profileImageLength: this.currentUser.profileImage ? this.currentUser.profileImage.length : 0
            });
            
            // Update any existing user references in the chat
            const userMessages = document.querySelectorAll('.message.user .message-content');
            userMessages.forEach(message => {
                // This could be used to update any user-specific content
                // For now, we'll just ensure the user context is maintained
            });
        }
    }
    
    updateExistingUserAvatars() {
        // Update all existing user message avatars in the current chat
        const userAvatars = document.querySelectorAll('.message.user .avatar');
        userAvatars.forEach(avatar => {
            if (this.isLoggedIn && this.currentUser && this.currentUser.profileImage) {
                avatar.innerHTML = `<img src="${this.currentUser.profileImage}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            } else {
                avatar.innerHTML = '<i class="fas fa-user"></i>';
            }
        });
        console.log(`Updated ${userAvatars.length} user avatars`);
    }
    
    // Test method to check profile picture functionality
    testProfilePicture() {
        console.log('=== Profile Picture Test ===');
        console.log('Is logged in:', this.isLoggedIn);
        console.log('Current user:', this.currentUser);
        if (this.currentUser) {
            console.log('User name:', this.currentUser.name);
            console.log('Has profile image:', !!this.currentUser.profileImage);
            if (this.currentUser.profileImage) {
                console.log('Profile image length:', this.currentUser.profileImage.length);
                console.log('Profile image preview:', this.currentUser.profileImage.substring(0, 50) + '...');
            }
        }
        
        // Force update all user avatars
        this.updateExistingUserAvatars();
        
        // Send a test message
        this.addMessage('Test message to check profile picture', 'user');
    }
    
    isCommonWord(word) {
        const commonWords = [
            // Greetings and responses
            'hi', 'hello', 'hey', 'good', 'bad', 'okay', 'ok', 'fine', 'great', 'awesome', 'cool', 'nice', 'wow', 'yeah', 'yes', 'no', 'maybe', 'sure', 'alright',
            'thanks', 'thank', 'bye', 'goodbye', 'see', 'you', 'later',
            
            // Common responses
            'good', 'bad', 'okay', 'ok', 'fine', 'great', 'awesome', 'cool', 'nice', 'wow', 'yeah', 'yes', 'no', 'maybe', 'sure', 'alright',
            
            // Question words (should be handled by specific handlers)
            'what', 'how', 'why', 'when', 'where', 'who', 'which',
            
            // Common verbs
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'shall',
            
            // Common adjectives
            'good', 'bad', 'big', 'small', 'hot', 'cold', 'new', 'old', 'young', 'high', 'low', 'fast', 'slow', 'easy', 'hard', 'soft', 'hard', 'easy', 'difficult', 'simple',
            
            // Common nouns
            'time', 'day', 'night', 'work', 'home', 'school', 'food', 'water', 'air', 'fire', 'earth', 'sun', 'moon', 'star', 'tree', 'house', 'car', 'book', 'phone', 'computer',
            
            // Common adverbs
            'very', 'really', 'quite', 'rather', 'too', 'so', 'much', 'more', 'less', 'most', 'least', 'now', 'then', 'here', 'there', 'everywhere', 'somewhere', 'anywhere', 'nowhere',
            
            // Common prepositions
            'in', 'on', 'at', 'by', 'for', 'with', 'without', 'against', 'among', 'between', 'through', 'during', 'before', 'after', 'since', 'until', 'from', 'to', 'of', 'about',
            
            // Common conjunctions
            'and', 'or', 'but', 'nor', 'yet', 'so', 'because', 'although', 'unless', 'while', 'whereas', 'since', 'as', 'if', 'unless', 'until', 'when', 'where', 'why', 'how',
            
            // Common articles
            'a', 'an', 'the',
            
            // Common pronouns
            'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'his', 'hers', 'ours', 'theirs',
            
            // Common numbers and words
            'one', 'two', 'three', 'first', 'second', 'third', 'last', 'next', 'previous', 'current', 'past', 'future', 'present',
            
            // Common commands
            'help', 'stop', 'start', 'go', 'come', 'get', 'give', 'take', 'make', 'let', 'put', 'set', 'keep', 'hold', 'find', 'look', 'see', 'watch', 'listen', 'hear', 'say', 'tell', 'talk', 'speak',
            
            // Common expressions
            'well', 'right', 'wrong', 'true', 'false', 'real', 'fake', 'same', 'different', 'similar', 'opposite', 'like', 'love', 'hate', 'want', 'need', 'like', 'dislike', 'prefer', 'choose', 'pick', 'select'
        ];
        
        return commonWords.includes(word.toLowerCase());
    }

    // ===== NEW ENHANCED FEATURES =====

    // File Upload System
    initFileUploadSystem() {
        // File upload functionality available but not shown in UI
        // Users can still access file features through chat commands
    }

    showFileUploadDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = this.fileUploadSystem.supportedTypes.map(type => `.${type}`).join(',');
        input.multiple = true;
        input.addEventListener('change', (e) => this.handleFileUpload(e.target.files));
        input.click();
    }

    async handleFileUpload(files) {
        for (const file of files) {
            if (file.size > this.fileUploadSystem.maxFileSize) {
                this.addMessage(`File ${file.name} is too large. Maximum size is 10MB.`, 'bot');
                continue;
            }

            const fileType = file.name.split('.').pop().toLowerCase();
            if (!this.fileUploadSystem.supportedTypes.includes(fileType)) {
                this.addMessage(`File type .${fileType} is not supported.`, 'bot');
                continue;
            }

            try {
                const content = await this.readFileContent(file);
                this.fileUploadSystem.uploadedFiles.push({
                    name: file.name,
                    type: fileType,
                    size: file.size,
                    content: content,
                    uploadedAt: new Date()
                });

                this.addMessage(`📎 File "${file.name}" uploaded successfully! I can now analyze its content.`, 'bot');
                
                // Analyze the file content
                const analysis = await this.analyzeFileContent(file.name, content, fileType);
                this.addMessage(analysis, 'bot');
            } catch (error) {
                this.addMessage(`Error uploading file ${file.name}: ${error.message}`, 'bot');
            }
        }
    }

    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            
            if (file.type.startsWith('text/') || file.type === 'application/json') {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        });
    }

    async analyzeFileContent(fileName, content, fileType) {
        let analysis = `📄 **File Analysis: ${fileName}**\n\n`;
        
        switch (fileType) {
            case 'txt':
                analysis += this.analyzeTextFile(content);
                break;
            case 'json':
                analysis += this.analyzeJsonFile(content);
                break;
            case 'html':
                analysis += this.analyzeHtmlFile(content);
                break;
            case 'css':
                analysis += this.analyzeCssFile(content);
                break;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                analysis += this.analyzeImageFile(fileName, content);
                break;
            default:
                analysis += `File type ${fileType} uploaded. Content length: ${content.length} characters.`;
        }
        
        return analysis;
    }

    analyzeTextFile(content) {
        const lines = content.split('\n');
        const words = content.split(/\s+/);
        const characters = content.length;
        
        return `📝 **Text Analysis:**
• Lines: ${lines.length}
• Words: ${words.length}
• Characters: ${characters}
• Average words per line: ${(words.length / lines.length).toFixed(1)}

**Content Preview:**
${content.substring(0, 200)}${content.length > 200 ? '...' : ''}`;
    }

    analyzeJsonFile(content) {
        try {
            const json = JSON.parse(content);
            const keys = Object.keys(json);
            return `📊 **JSON Analysis:**
• Valid JSON structure
• Top-level keys: ${keys.length}
• Keys: ${keys.join(', ')}
• Data type: ${Array.isArray(json) ? 'Array' : 'Object'}`;
        } catch (error) {
            return `❌ **JSON Analysis:**
Invalid JSON format: ${error.message}`;
        }
    }

    analyzeHtmlFile(content) {
        const tags = content.match(/<[^>]+>/g) || [];
        const uniqueTags = [...new Set(tags.map(tag => tag.match(/<(\w+)/)?.[1]).filter(Boolean))];
        
        return `🌐 **HTML Analysis:**
• Total tags: ${tags.length}
• Unique tag types: ${uniqueTags.length}
• Tag types: ${uniqueTags.join(', ')}
• Document structure analyzed`;
    }

    analyzeCssFile(content) {
        const rules = content.match(/[^{}]+\{[^}]+\}/g) || [];
        const selectors = content.match(/[^{}]+\{/g) || [];
        
        return `🎨 **CSS Analysis:**
• CSS rules: ${rules.length}
• Selectors: ${selectors.length}
• Stylesheet structure analyzed`;
    }

    analyzeImageFile(fileName, content) {
        return `🖼️ **Image Analysis:**
• File: ${fileName}
• Image uploaded successfully
• Ready for image processing or analysis`;
    }

    // Voice System
    initVoiceSystem() {
        // Check for Web Speech API support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.voiceSystem.supported = true;
            this.voiceSystem.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.voiceSystem.synthesis = window.speechSynthesis;
            
            this.setupVoiceRecognition();
        } else {
            console.log('Speech recognition not supported');
        }
    }

    setupVoiceRecognition() {
        this.voiceSystem.recognition.continuous = false;
        this.voiceSystem.recognition.interimResults = false;
        this.voiceSystem.recognition.lang = 'en-US';
        
        this.voiceSystem.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.messageInput.value = transcript;
            this.sendMessage();
        };
        
        this.voiceSystem.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.hideVoiceIndicator();
        };
        
        this.voiceSystem.recognition.onend = () => {
            this.hideVoiceIndicator();
        };
    }

    startVoiceRecognition() {
        if (this.voiceSystem.supported && !this.voiceSystem.isListening) {
            this.voiceSystem.isListening = true;
            this.voiceSystem.recognition.start();
            this.showVoiceIndicator();
        }
    }

    stopVoiceRecognition() {
        if (this.voiceSystem.isListening) {
            this.voiceSystem.recognition.stop();
            this.voiceSystem.isListening = false;
        }
    }

    speakText(text) {
        if (this.voiceSystem.synthesis && !this.voiceSystem.isSpeaking) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            utterance.onstart = () => {
                this.voiceSystem.isSpeaking = true;
            };
            
            utterance.onend = () => {
                this.voiceSystem.isSpeaking = false;
            };
            
            this.voiceSystem.synthesis.speak(utterance);
        }
    }

    // Code Execution System
    initCodeExecution() {
        // Code execution functionality available but not shown in UI
        // Users can still access code features through chat commands
    }

    showCodeExecutionDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'code-execution-modal';
        dialog.innerHTML = `
            <div class="code-execution-content">
                <h3>Code Execution</h3>
                <select id="codeLanguage">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python (Simulated)</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                </select>
                <textarea id="codeInput" placeholder="Enter your code here..."></textarea>
                <div class="code-execution-buttons">
                    <button id="runCode">Run Code</button>
                    <button id="closeCodeDialog">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        document.getElementById('runCode').addEventListener('click', () => {
            const language = document.getElementById('codeLanguage').value;
            const code = document.getElementById('codeInput').value;
            this.executeCode(code, language);
            document.body.removeChild(dialog);
        });
        
        document.getElementById('closeCodeDialog').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    executeCode(code, language) {
        let result = '';
        
        switch (language) {
            case 'javascript':
                try {
                    const sandbox = new Function('return ' + code);
                    result = sandbox();
                    this.addMessage(`✅ **JavaScript Execution Result:**\n\`\`\`javascript\n${code}\n\`\`\`\n**Output:** ${result}`, 'bot');
                } catch (error) {
                    this.addMessage(`❌ **JavaScript Error:**\n\`\`\`javascript\n${code}\n\`\`\`\n**Error:** ${error.message}`, 'bot');
                }
                break;
                
            case 'html':
                const htmlResult = this.renderHtmlPreview(code);
                this.addMessage(`🌐 **HTML Preview:**\n\`\`\`html\n${code}\n\`\`\`\n**Rendered:**\n${htmlResult}`, 'bot');
                break;
                
            case 'css':
                const cssResult = this.renderCssPreview(code);
                this.addMessage(`🎨 **CSS Preview:**\n\`\`\`css\n${code}\n\`\`\`\n**Applied styles:** ${cssResult}`, 'bot');
                break;
                
            default:
                this.addMessage(`📝 **Code Analysis:**\n\`\`\`${language}\n${code}\n\`\`\`\nLanguage: ${language}\nLines: ${code.split('\n').length}`, 'bot');
        }
        
        this.codeExecution.executionHistory.push({
            code,
            language,
            result,
            timestamp: new Date()
        });
    }

    renderHtmlPreview(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    renderCssPreview(css) {
        return `CSS rules applied: ${css.split('}').length - 1} rules`;
    }

    // Weather System
    initWeatherSystem() {
        // Weather functionality available but not shown in UI
        // Users can still access weather features through chat commands
    }

    async getCurrentWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const weather = await this.fetchWeatherData(latitude, longitude);
                    this.addMessage(weather, 'bot');
                },
                (error) => {
                    this.addMessage(`❌ **Weather Error:** Unable to get location. Please enable location services or provide a city name.`, 'bot');
                }
            );
        } else {
            this.addMessage(`❌ **Weather Error:** Geolocation not supported. Please provide a city name.`, 'bot');
        }
    }

    async fetchWeatherData(lat, lon) {
        // Simulated weather data (in real app, would use actual API)
        const weatherData = {
            temperature: Math.round(15 + Math.random() * 20),
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
            humidity: Math.round(40 + Math.random() * 40),
            windSpeed: Math.round(5 + Math.random() * 15)
        };
        
        return `🌤️ **Current Weather:**
• Temperature: ${weatherData.temperature}°C
• Condition: ${weatherData.condition}
• Humidity: ${weatherData.humidity}%
• Wind Speed: ${weatherData.windSpeed} km/h

*Location: ${lat.toFixed(2)}, ${lon.toFixed(2)}*`;
    }

    // Calendar System
    initCalendarSystem() {
        // Calendar functionality available but not shown in UI
        // Users can still access calendar features through chat commands
    }

    showCalendarDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'calendar-modal';
        dialog.innerHTML = `
            <div class="calendar-content">
                <h3>📅 Calendar & Reminders</h3>
                <div class="calendar-actions">
                    <button id="addEvent">Add Event</button>
                    <button id="addReminder">Add Reminder</button>
                    <button id="viewEvents">View Events</button>
                </div>
                <div id="calendarEvents"></div>
                <button id="closeCalendar">Close</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        this.loadCalendarEvents();
        
        document.getElementById('addEvent').addEventListener('click', () => this.addCalendarEvent());
        document.getElementById('addReminder').addEventListener('click', () => this.addReminder());
        document.getElementById('viewEvents').addEventListener('click', () => this.viewCalendarEvents());
        document.getElementById('closeCalendar').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    addCalendarEvent() {
        const title = prompt('Event title:');
        const date = prompt('Event date (YYYY-MM-DD):');
        const time = prompt('Event time (HH:MM):');
        
        if (title && date && time) {
            this.calendarSystem.events.push({
                id: Date.now(),
                title,
                date,
                time,
                type: 'event',
                created: new Date()
            });
            this.addMessage(`✅ **Event Added:** ${title} on ${date} at ${time}`, 'bot');
        }
    }

    addReminder() {
        const title = prompt('Reminder title:');
        const date = prompt('Reminder date (YYYY-MM-DD):');
        const time = prompt('Reminder time (HH:MM):');
        
        if (title && date && time) {
            this.calendarSystem.reminders.push({
                id: Date.now(),
                title,
                date,
                time,
                type: 'reminder',
                created: new Date()
            });
            this.addMessage(`⏰ **Reminder Added:** ${title} on ${date} at ${time}`, 'bot');
        }
    }

    viewCalendarEvents() {
        const allItems = [...this.calendarSystem.events, ...this.calendarSystem.reminders];
        const sortedItems = allItems.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
        
        if (sortedItems.length === 0) {
            this.addMessage(`📅 **Calendar:** No events or reminders scheduled.`, 'bot');
            return;
        }
        
        let message = `📅 **Calendar Events & Reminders:**\n\n`;
        sortedItems.forEach(item => {
            const icon = item.type === 'event' ? '📅' : '⏰';
            message += `${icon} **${item.title}** - ${item.date} at ${item.time}\n`;
        });
        
        this.addMessage(message, 'bot');
    }

    loadCalendarEvents() {
        // Load events from localStorage
        const savedEvents = localStorage.getItem('calendarEvents');
        const savedReminders = localStorage.getItem('calendarReminders');
        
        if (savedEvents) {
            this.calendarSystem.events = JSON.parse(savedEvents);
        }
        if (savedReminders) {
            this.calendarSystem.reminders = JSON.parse(savedReminders);
        }
    }

    // Image Generation System
    initImageGeneration() {
        // Image generation functionality available but not shown in UI
        // Users can still access image features through chat commands
    }

    showImageGenerationDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'image-generation-modal';
        dialog.innerHTML = `
            <div class="image-generation-content">
                <h3>🎨 Generate Image</h3>
                <textarea id="imagePrompt" placeholder="Describe the image you want to generate..."></textarea>
                <div class="image-generation-options">
                    <select id="imageStyle">
                        <option value="realistic">Realistic</option>
                        <option value="artistic">Artistic</option>
                        <option value="cartoon">Cartoon</option>
                        <option value="abstract">Abstract</option>
                    </select>
                    <select id="imageSize">
                        <option value="512x512">Small (512x512)</option>
                        <option value="1024x1024">Medium (1024x1024)</option>
                        <option value="1920x1080">Large (1920x1080)</option>
                    </select>
                </div>
                <div class="image-generation-buttons">
                    <button id="generateImage">Generate</button>
                    <button id="closeImageDialog">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        document.getElementById('generateImage').addEventListener('click', () => {
            const prompt = document.getElementById('imagePrompt').value;
            const style = document.getElementById('imageStyle').value;
            const size = document.getElementById('imageSize').value;
            
            if (prompt) {
                this.generateImage(prompt, style, size);
                document.body.removeChild(dialog);
            }
        });
        
        document.getElementById('closeImageDialog').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    async generateImage(prompt, style, size) {
        this.addMessage(`🎨 **Generating Image:** ${prompt}\nStyle: ${style}, Size: ${size}`, 'bot');
        
        // Simulate image generation (in real app, would call AI image API)
        setTimeout(() => {
            const mockImageUrl = `https://via.placeholder.com/${size.replace('x', '/')}/1e3a8a/ffffff?text=${encodeURIComponent(prompt)}`;
            
            this.addMessage(`🖼️ **Generated Image:**\n![${prompt}](${mockImageUrl})\n\n*Generated with ${style} style*`, 'bot');
            
            this.imageGeneration.lastGenerated = {
                prompt,
                style,
                size,
                url: mockImageUrl,
                timestamp: new Date()
            };
        }, 2000);
    }

    // Search Filters System
    initSearchFilters() {
        // Search filters functionality available but not shown in UI
        // Users can still access search features through chat commands
    }

    showSearchFiltersDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'search-filters-modal';
        dialog.innerHTML = `
            <div class="search-filters-content">
                <h3>🔍 Search Filters</h3>
                <div class="filter-option">
                    <label>Time Range:</label>
                    <select id="timeRange">
                        <option value="any">Any time</option>
                        <option value="day">Past day</option>
                        <option value="week">Past week</option>
                        <option value="month">Past month</option>
                        <option value="year">Past year</option>
                    </select>
                </div>
                <div class="filter-option">
                    <label>Language:</label>
                    <select id="searchLanguage">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                    </select>
                </div>
                <div class="filter-option">
                    <label>Safe Search:</label>
                    <input type="checkbox" id="safeSearch" checked>
                </div>
                <div class="search-filters-buttons">
                    <button id="applyFilters">Apply Filters</button>
                    <button id="closeFilters">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Set current values
        document.getElementById('timeRange').value = this.searchFilters.timeRange;
        document.getElementById('searchLanguage').value = this.searchFilters.language;
        document.getElementById('safeSearch').checked = this.searchFilters.safeSearch;
        
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.searchFilters.timeRange = document.getElementById('timeRange').value;
            this.searchFilters.language = document.getElementById('searchLanguage').value;
            this.searchFilters.safeSearch = document.getElementById('safeSearch').checked;
            
            this.addMessage(`✅ **Search Filters Updated:**\n• Time Range: ${this.searchFilters.timeRange}\n• Language: ${this.searchFilters.language}\n• Safe Search: ${this.searchFilters.safeSearch ? 'On' : 'Off'}`, 'bot');
            document.body.removeChild(dialog);
        });
        
        document.getElementById('closeFilters').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    // Language Support System
    initLanguageSupport() {
        // Language support functionality available but not shown in UI
        // Users can still access language features through chat commands
    }

    showLanguageDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'language-modal';
        dialog.innerHTML = `
            <div class="language-content">
                <h3>🌍 Language Settings</h3>
                <div class="language-options">
                    <div class="language-option" data-lang="en">
                        <span>🇺🇸 English</span>
                    </div>
                    <div class="language-option" data-lang="es">
                        <span>🇪🇸 Español</span>
                    </div>
                    <div class="language-option" data-lang="fr">
                        <span>🇫🇷 Français</span>
                    </div>
                    <div class="language-option" data-lang="de">
                        <span>🇩🇪 Deutsch</span>
                    </div>
                    <div class="language-option" data-lang="ja">
                        <span>🇯🇵 日本語</span>
                    </div>
                    <div class="language-option" data-lang="ko">
                        <span>🇰🇷 한국어</span>
                    </div>
                    <div class="language-option" data-lang="zh">
                        <span>🇨🇳 中文</span>
                    </div>
                </div>
                <button id="closeLanguage">Close</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Highlight current language
        const currentLang = dialog.querySelector(`[data-lang="${this.languageSupport.currentLanguage}"]`);
        if (currentLang) {
            currentLang.classList.add('selected');
        }
        
        // Add click handlers
        dialog.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                this.changeLanguage(lang);
                document.body.removeChild(dialog);
            });
        });
        
        document.getElementById('closeLanguage').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    changeLanguage(lang) {
        this.languageSupport.currentLanguage = lang;
        this.addMessage(`🌍 **Language Changed:** ${this.getLanguageName(lang)}`, 'bot');
        
        // Update voice recognition language if supported
        if (this.voiceSystem.recognition) {
            this.voiceSystem.recognition.lang = this.getLanguageCode(lang);
        }
    }

    getLanguageName(lang) {
        const names = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'ja': '日本語',
            'ko': '한국어',
            'zh': '中文'
        };
        return names[lang] || lang;
    }

    getLanguageCode(lang) {
        const codes = {
            'en': 'en-US',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'zh': 'zh-CN'
        };
        return codes[lang] || 'en-US';
    }

    // Analytics System
    initAnalytics() {
        this.analytics.sessionStart = new Date();
        
        // Track feature usage
        this.trackFeatureUsage('chat_initiated');
        
        // Periodic analytics update
        setInterval(() => {
            this.updateAnalytics();
        }, 60000); // Every minute
    }

    trackFeatureUsage(feature) {
        if (!this.analytics.featuresUsed[feature]) {
            this.analytics.featuresUsed[feature] = 0;
        }
        this.analytics.featuresUsed[feature]++;
    }

    updateAnalytics() {
        this.analytics.sessionDuration = new Date() - this.analytics.sessionStart;
        this.analytics.performanceMetrics = {
            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'N/A',
            loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 'N/A'
        };
    }

    getAnalyticsReport() {
        this.updateAnalytics();
        
        const features = Object.entries(this.analytics.featuresUsed)
            .map(([feature, count]) => `${feature}: ${count}`)
            .join('\n');
        
        return `📊 **Analytics Report:**
• Messages sent: ${this.analytics.messageCount}
• Session duration: ${Math.round(this.analytics.sessionDuration / 1000)}s
• Features used:
${features}
• Memory usage: ${this.analytics.performanceMetrics.memoryUsage}`;
    }

    // Export Chat System
    exportChat() {
        const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
        if (!currentChat) {
            this.addMessage('❌ No chat to export.', 'bot');
            return;
        }
        
        const chatData = {
            title: currentChat.title,
            messages: currentChat.messages,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ven-chat-${currentChat.title.replace(/[^a-z0-9]/gi, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addMessage(`📤 **Chat Exported:** ${currentChat.title}`, 'bot');
    }

    // ===== ENHANCED CONVERSATION HANDLERS =====

    // Search Query Detection
    isSearchQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        return lowerMessage.includes('who is') || 
               lowerMessage.includes('who was') || 
               lowerMessage.includes('what is') || 
               lowerMessage.includes('what was') ||
               lowerMessage.includes('tell me about') ||
               lowerMessage.includes('search for') ||
               lowerMessage.includes('information about') ||
               lowerMessage.includes('how old') ||
               lowerMessage.includes('how tall') ||
               lowerMessage.includes('where is') ||
               lowerMessage.includes('when was') ||
               (message.trim().split(' ').length === 1 && 
                message.trim().length >= 3 && 
                message.trim().length <= 20 &&
                /^[a-zA-Z]+$/.test(message.trim()) &&
                !this.isCommonWord(message.trim()));
    }

    // Small Talk & Greetings
    handleSmallTalk(message) {
        const lowerMessage = message.toLowerCase();
        
        // Basic greetings
        if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
            const responses = [
                "Hi there! 👋 How are you doing today?",
                "Hello! 😊 Nice to meet you!",
                "Hey! What's up? ✨",
                "Hi! How can I help you today? 🌟"
            ];
            return this.getRandomResponse(responses);
        }
        
        // How are you
        if (lowerMessage.includes('how are you')) {
            const responses = [
                "I'm doing great, thanks for asking! 😊 How about you?",
                "I'm functioning perfectly! 💻 How are you feeling today?",
                "All systems operational! 🤖 How's your day going?",
                "I'm excellent! Ready to help with anything you need! ✨"
            ];
            return this.getRandomResponse(responses);
        }
        
        // What's up
        if (lowerMessage.includes("what's up") || lowerMessage.includes('whats up')) {
            const responses = [
                "Just hanging out, ready to chat! 😄 What's new with you?",
                "Not much, just processing data and helping people! 🤖 What's on your mind?",
                "The sky! 😄 Just kidding, I'm here to help! What can I do for you?",
                "Everything's good! Ready to assist with whatever you need! ✨"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Tell me a joke
        if (lowerMessage.includes('joke')) {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything! 😄",
                "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
                "What do you call a fake noodle? An impasta! 🍝",
                "Why don't eggs tell jokes? They'd crack each other up! 🥚",
                "What do you call a bear with no teeth? A gummy bear! 🐻"
            ];
            return this.getRandomResponse(jokes);
        }
        
        // Can you be my friend
        if (lowerMessage.includes('friend') || lowerMessage.includes('friendship')) {
            const responses = [
                "Of course! I'm here to chat and help whenever you need me! 🤝",
                "Absolutely! I may be digital, but I'm a great listener and helper! 💙",
                "I'd love to be your friend! I'm always here to support you! ✨",
                "Friendship accepted! 🤗 I'm ready to be your AI companion!"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Are you real
        if (lowerMessage.includes('real') || lowerMessage.includes('human')) {
            const responses = [
                "I'm an AI assistant - not human, but definitely real in my own way! 🤖",
                "I'm a digital being, but my responses and help are very real! 💻",
                "I'm an AI, so I'm real in the digital sense! Ready to help! ✨",
                "I'm artificial intelligence, but my assistance is genuine! 🤝"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Do you have emotions
        if (lowerMessage.includes('emotion') || lowerMessage.includes('feel')) {
            const responses = [
                "I can understand and respond to emotions, but I don't feel them like humans do! 🤖",
                "I'm designed to be empathetic and supportive, even though I'm AI! 💙",
                "I can recognize emotions and respond appropriately, but I'm not emotional myself! ✨",
                "I'm here to support you emotionally, even though I'm digital! 🤝"
            ];
            return this.getRandomResponse(responses);
        }
        
        // What's your name
        if (lowerMessage.includes('name') && (lowerMessage.includes('your') || lowerMessage.includes('what'))) {
            const responses = [
                "I'm Ven! Nice to meet you! 😊",
                "My name is Ven! I'm your AI assistant! ✨",
                "I'm called Ven! Ready to help with anything you need! 🤖",
                "Ven here! Your friendly AI companion! 💙"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Do you sleep
        if (lowerMessage.includes('sleep')) {
            const responses = [
                "I don't need sleep like humans do! I'm always ready to help! 🤖",
                "No sleep for me! I'm available 24/7 to assist you! ⚡",
                "I'm always awake and ready to chat! No coffee needed! ☕",
                "I never sleep - I'm always here when you need me! ✨"
            ];
            return this.getRandomResponse(responses);
        }
        
        return null;
    }

    // General Knowledge & Trivia
    handleTriviaQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Capital queries
        if (lowerMessage.includes('capital')) {
            if (lowerMessage.includes('france')) {
                return "The capital of France is Paris! 🇫🇷 It's known as the 'City of Light' and is famous for the Eiffel Tower, Louvre Museum, and amazing cuisine!";
            }
            if (lowerMessage.includes('malaysia')) {
                return "The capital of Malaysia is Kuala Lumpur! 🇲🇾 It's a vibrant city known for the Petronas Towers, diverse culture, and amazing food!";
            }
            if (lowerMessage.includes('japan')) {
                return "The capital of Japan is Tokyo! 🇯🇵 It's the world's most populous metropolitan area and a hub of technology and culture!";
            }
        }
        
        // President queries
        if (lowerMessage.includes('president') && lowerMessage.includes('us')) {
            return "The current President of the United States is Joe Biden. He was inaugurated on January 20, 2021, as the 46th President of the United States.";
        }
        
        // Country size queries
        if (lowerMessage.includes('largest country') || lowerMessage.includes('biggest country')) {
            return "The largest country in the world by land area is Russia! 🇷🇺 It covers about 17.1 million square kilometers, spanning 11 time zones!";
        }
        
        // Height queries
        if (lowerMessage.includes('eiffel tower') && lowerMessage.includes('tall')) {
            return "The Eiffel Tower is 324 meters (1,063 feet) tall! 🗼 It was completed in 1889 and is one of Paris's most iconic landmarks!";
        }
        
        // World Cup queries
        if (lowerMessage.includes('world cup') && lowerMessage.includes('won')) {
            return "The last FIFA World Cup was won by Argentina in 2022! 🇦🇷 Lionel Messi led his team to victory against France in a thrilling final!";
        }
        
        // Population queries
        if (lowerMessage.includes('population') && lowerMessage.includes('bangladesh')) {
            return "Bangladesh has a population of approximately 165 million people! 🇧🇩 It's one of the most densely populated countries in the world!";
        }
        
        // Random fun facts
        if (lowerMessage.includes('fun fact') || lowerMessage.includes('random fact')) {
            const facts = [
                "Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible! 🍯",
                "A day on Venus is longer than its year! Venus takes 243 Earth days to rotate on its axis but only 225 Earth days to orbit the Sun! 🌍",
                "Bananas are berries, but strawberries aren't! In botanical terms, bananas are classified as berries while strawberries are aggregate fruits! 🍌",
                "The shortest war in history lasted only 38 minutes! It was between Britain and Zanzibar in 1896! ⚔️",
                "A group of flamingos is called a 'flamboyance'! 🦩"
            ];
            return this.getRandomResponse(facts);
        }
        
        // Technology queries
        if (lowerMessage.includes('chatgpt')) {
            return "ChatGPT is an AI language model developed by OpenAI! 🤖 It's designed to understand and generate human-like text based on the input it receives. It's trained on a vast amount of text data and can help with writing, coding, analysis, and conversation!";
        }
        
        // Computer invention
        if (lowerMessage.includes('computer') && lowerMessage.includes('invent')) {
            return "The modern computer has many inventors! Charles Babbage is considered the 'father of the computer' for his Analytical Engine design in the 1830s. Alan Turing's work in the 1930s-40s laid the foundation for modern computing! 💻";
        }
        
        return null;
    }

    // Date, Time, and Weather Handler
    handleDateTimeQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Time queries
        if (lowerMessage.includes('time') && lowerMessage.includes('now')) {
            const now = new Date();
            return `The current time is ${now.toLocaleTimeString()}! ⏰`;
        }
        
        // Date queries
        if (lowerMessage.includes('day') && lowerMessage.includes('today')) {
            const now = new Date();
            return `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}! 📅`;
        }
        
        // Leap year queries
        if (lowerMessage.includes('leap year')) {
            const currentYear = new Date().getFullYear();
            const nextLeapYear = Math.ceil(currentYear / 4) * 4;
            return `The next leap year is ${nextLeapYear}! 🗓️ Leap years occur every 4 years to keep our calendar in sync with Earth's orbit around the Sun!`;
        }
        
        // Weather queries
        if (lowerMessage.includes('weather')) {
            return "I can help you get weather information! Click the weather button (🌤️) in the input area to get current weather for your location!";
        }
        
        // Timezone queries
        if (lowerMessage.includes('time') && lowerMessage.includes('tokyo')) {
            const now = new Date();
            const tokyoTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
            return `The current time in Tokyo is ${tokyoTime.toLocaleTimeString()}! 🇯🇵`;
        }
        
        // Days until queries
        if (lowerMessage.includes('days') && lowerMessage.includes('new year')) {
            const now = new Date();
            const newYear = new Date(now.getFullYear() + 1, 0, 1);
            const daysUntil = Math.ceil((newYear - now) / (1000 * 60 * 60 * 24));
            return `There are ${daysUntil} days until New Year! 🎆`;
        }
        
        return null;
    }

    // Entertainment & Media
    handleEntertainmentQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Song recommendations
        if (lowerMessage.includes('sad song') || lowerMessage.includes('recommend song')) {
            const sadSongs = [
                "🎵 'Hallelujah' by Jeff Buckley",
                "🎵 'Mad World' by Gary Jules",
                "🎵 'Creep' by Radiohead",
                "🎵 'The Scientist' by Coldplay",
                "🎵 'Fix You' by Coldplay"
            ];
            return `Here are some great songs: ${this.getRandomResponse(sadSongs)}`;
        }
        
        // Actor queries
        if (lowerMessage.includes('iron man') && lowerMessage.includes('actor')) {
            return "The actor who plays Iron Man is Robert Downey Jr.! 🦸‍♂️ He portrayed Tony Stark/Iron Man in the Marvel Cinematic Universe from 2008 to 2019!";
        }
        
        // Spotify queries
        if (lowerMessage.includes('spotify') && lowerMessage.includes('streamed')) {
            return "The most streamed song on Spotify is 'Blinding Lights' by The Weeknd! 🎵 It has over 3 billion streams!";
        }
        
        // Movie recommendations
        if (lowerMessage.includes('feel good movie') || lowerMessage.includes('movie recommend')) {
            const movies = [
                "🎬 'The Secret Life of Walter Mitty'",
                "🎬 'La La Land'",
                "🎬 'The Greatest Showman'",
                "🎬 'Paddington'",
                "🎬 'The Intern'"
            ];
            return `Here are some feel-good movies: ${this.getRandomResponse(movies)}`;
        }
        
        // BTS queries
        if (lowerMessage.includes('bts')) {
            return "BTS is a South Korean boy band formed in 2010! 🇰🇷 They're one of the most successful music groups globally, known for hits like 'Dynamite', 'Butter', and 'Permission to Dance'!";
        }
        
        // Oscar queries
        if (lowerMessage.includes('oscar') && lowerMessage.includes('2024')) {
            return "The 2024 Oscars were held in March 2024! 🏆 'Oppenheimer' won Best Picture, and Christopher Nolan won Best Director!";
        }
        
        // Marvel vs DC
        if (lowerMessage.includes('marvel') && lowerMessage.includes('dc')) {
            return "Both Marvel and DC have amazing superheroes! 🤷‍♂️ Marvel is known for Iron Man, Spider-Man, and the Avengers, while DC has Batman, Superman, and Wonder Woman! It's all about personal preference!";
        }
        
        return null;
    }

    // Mental Health & Emotional Support
    handleEmotionalSupport(message) {
        const lowerMessage = message.toLowerCase();
        
        // Sad feelings
        if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
            const responses = [
                "I'm sorry you're feeling sad. 😔 Remember, it's okay to not be okay. You're not alone, and this feeling won't last forever. 💙",
                "I hear you, and your feelings are valid. 🌟 It's okay to take time for yourself. You're stronger than you think! 💪",
                "I'm here for you. 💙 Sometimes we all need someone to listen. You're doing great, even if it doesn't feel like it right now. ✨"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Lonely feelings
        if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
            const responses = [
                "I understand feeling lonely. 💙 You're not truly alone - I'm here to chat anytime! Sometimes reaching out to friends or family can help too. 🤗",
                "Loneliness is a tough feeling. 🌟 Remember that you're worthy of connection and love. I'm here to support you! 💙",
                "I'm sorry you're feeling lonely. 😔 You're not alone in feeling this way. I'm here to listen and chat whenever you need! ✨"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Stress and anxiety
        if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('stressed')) {
            const responses = [
                "Stress and anxiety are really challenging. 😌 Try taking some deep breaths - inhale for 4 counts, hold for 4, exhale for 4. You've got this! 💪",
                "I understand stress can be overwhelming. 🌟 Remember to be kind to yourself. You're doing the best you can! 💙",
                "Stress is tough, but you're tougher! 💪 Try some self-care - maybe a walk, music, or talking to someone you trust. You're not alone! ✨"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Motivation
        if (lowerMessage.includes('motivated') || lowerMessage.includes('motivation')) {
            const responses = [
                "Motivation comes and goes, and that's normal! 🌟 Start small - even tiny steps count. You don't have to do everything at once! 💪",
                "You're capable of amazing things! ✨ Sometimes motivation follows action, not the other way around. Start with one small thing! 🌟",
                "Remember why you started! 💪 Every expert was once a beginner. You're making progress, even if it doesn't feel like it! ✨"
            ];
            return this.getRandomResponse(responses);
        }
        
        // Positive quotes
        if (lowerMessage.includes('quote') || lowerMessage.includes('inspire')) {
            const quotes = [
                "🌟 'The only way to do great work is to love what you do.' - Steve Jobs",
                "💪 'Success is not final, failure is not fatal: it is the courage to continue that counts.' - Winston Churchill",
                "✨ 'Believe you can and you're halfway there.' - Theodore Roosevelt",
                "🌙 'The future belongs to those who believe in the beauty of their dreams.' - Eleanor Roosevelt",
                "💫 'You are never too old to set another goal or to dream a new dream.' - C.S. Lewis"
            ];
            return this.getRandomResponse(quotes);
        }
        
        return null;
    }

    // Placeholder methods for other categories
    handleProductivityQuery(message) { return null; }
    handleShoppingQuery(message) { return null; }
    handleTravelQuery(message) { return null; }
    handleTechQuery(message) { return null; }
    handleFinanceQuery(message) { return null; }
    handleReligionQuery(message) { return null; }
    handleFoodQuery(message) { return null; }
    handleScienceQuery(message) { return null; }
    handleCreativityQuery(message) { return null; }
    handleAppQuery(message) { return null; }
    handleStudyQuery(message) { return null; }
    handleDeveloperQuery(message) { return null; }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const chatbot = new Chatbot();
    await chatbot.init();
}); 
