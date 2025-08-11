/**
 * Ven - Intelligent AI Assistant
 * Frontend JavaScript for Python Flask Backend
 */

class VenChatbot {
    constructor() {
        this.currentUser = null;
        this.currentChatId = null;
        this.isLoggedIn = false;
        this.conversationContext = {};
        
        // DOM elements
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.sidebar = document.getElementById('sidebar');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.chatList = document.getElementById('chatList');
        this.userButton = document.getElementById('userButton');
        this.userMenu = document.getElementById('userMenu');
        
        // Initialize the chatbot
        this.init();
    }
    
    async init() {
        // Check if user is already logged in
        await this.checkAuthStatus();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize UI
        this.initUI();
        
        // Load chat history if user is logged in
        if (this.isLoggedIn) {
            await this.loadChatHistory();
        } else {
            // Show welcome message for guests
            this.addMessage("Hello! I'm Ven, your intelligent AI assistant. I can help you with various tasks, answer questions, and engage in meaningful conversations. How can I assist you today? 😊", 'bot');
        }
        
        // Focus on input
        this.messageInput.focus();
    }
    
    initEventListeners() {
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key handling
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
            this.sendButton.disabled = !this.messageInput.value.trim();
        });
        
        // Hamburger menu
        this.hamburgerMenu.addEventListener('click', () => this.toggleSidebar());
        
        // New chat
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
        
        // User menu
        this.userButton.addEventListener('click', () => this.toggleUserMenu());
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.sidebar.contains(e.target) && 
                !this.hamburgerMenu.contains(e.target) &&
                this.sidebar.classList.contains('open')) {
                this.closeSidebar();
            }
        });
        
        // Initialize modals
        this.initModals();
    }
    
    initUI() {
        // Update user display
        this.updateUserDisplay();
        
        // Initialize hamburger menu visibility
        if (window.innerWidth <= 768) {
            this.hamburgerMenu.style.display = 'flex';
        } else {
            this.hamburgerMenu.style.display = 'none';
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                this.hamburgerMenu.style.display = 'flex';
            } else {
                this.hamburgerMenu.style.display = 'none';
                this.closeSidebar();
            }
        });
    }
    
    initModals() {
        // Login modal
        const loginModal = document.getElementById('loginModal');
        const closeLoginModal = document.getElementById('closeLoginModal');
        const showSignup = document.getElementById('showSignup');
        
        closeLoginModal.addEventListener('click', () => this.hideModal(loginModal));
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal(loginModal);
            this.showModal(document.getElementById('signupModal'));
        });
        
        // Signup modal
        const signupModal = document.getElementById('signupModal');
        const closeSignupModal = document.getElementById('closeSignupModal');
        const showLogin = document.getElementById('showLogin');
        
        closeSignupModal.addEventListener('click', () => this.hideModal(signupModal));
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal(signupModal);
            this.showModal(loginModal);
        });
        
        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));
        
        // Other modals
        this.initOtherModals();
    }
    
    initOtherModals() {
        // Edit profile modal
        const editProfileModal = document.getElementById('editProfileModal');
        document.getElementById('closeEditProfileModal').addEventListener('click', () => this.hideModal(editProfileModal));
        
        // Customize modal
        const customizeModal = document.getElementById('customizeModal');
        document.getElementById('closeCustomizeModal').addEventListener('click', () => this.hideModal(customizeModal));
        
        // Settings modal
        const settingsModal = document.getElementById('settingsModal');
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.hideModal(settingsModal));
        
        // Insights modal
        const insightsModal = document.getElementById('insightsModal');
        document.getElementById('closeInsightsModal').addEventListener('click', () => this.hideModal(insightsModal));
        
        // Suggestions modal
        const suggestionsModal = document.getElementById('suggestionsModal');
        document.getElementById('closeSuggestionsModal').addEventListener('click', () => this.hideModal(suggestionsModal));
        
        // Initialize insights and suggestions buttons
        document.getElementById('insightsBtn').addEventListener('click', () => this.showInsights());
        document.getElementById('suggestionsBtn').addEventListener('click', () => this.showSuggestions());
    }
    
    async checkAuthStatus() {
        try {
            // Check if user is logged in (you can implement session checking here)
            const userData = localStorage.getItem('ven_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message to UI
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.sendButton.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send message to backend
            const response = await this.sendMessageToBackend(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            if (response && response.text) {
                this.addMessage(response.text, 'bot');
            } else {
                this.addMessage("I'm sorry, I encountered an error. Please try again.", 'bot');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage("I'm sorry, I encountered an error. Please try again.", 'bot');
        }
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    async sendMessageToBackend(message) {
        const payload = {
            message: message,
            user_id: this.currentUser?.id,
            chat_id: this.currentChatId
        };
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'user') {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();
        
        messageContent.appendChild(messageTime);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'message-content';
        typingContent.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async startNewChat() {
        if (!this.isLoggedIn) {
            this.showModal(document.getElementById('loginModal'));
            return;
        }
        
        try {
            const response = await fetch('/api/chat/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: this.currentUser.id })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.currentChatId = data.chat_id;
                
                // Clear chat messages
                this.chatMessages.innerHTML = '';
                
                // Add welcome message
                this.addMessage("Hello! I'm Ven, your intelligent AI assistant. How can I help you today? 😊", 'bot');
                
                // Update chat list
                await this.loadChatHistory();
                
                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            }
        } catch (error) {
            console.error('Error starting new chat:', error);
        }
    }
    
    async loadChatHistory() {
        if (!this.isLoggedIn) return;
        
        try {
            const response = await fetch(`/api/user/${this.currentUser.id}/chats`);
            if (response.ok) {
                const data = await response.json();
                this.updateChatList(data.chats);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }
    
    updateChatList(chats) {
        this.chatList.innerHTML = '';
        
        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            if (chat.id === this.currentChatId) {
                chatItem.classList.add('active');
            }
            
            chatItem.innerHTML = `
                <div class="chat-item-content">
                    <div class="chat-title">${chat.title}</div>
                    <div class="chat-date">${new Date(chat.created_at).toLocaleDateString()}</div>
                </div>
                <button class="delete-chat-btn" title="Delete chat">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            // Add click event for switching to chat
            const chatContent = chatItem.querySelector('.chat-item-content');
            chatContent.addEventListener('click', () => this.switchToChat(chat.id));
            
            // Add click event for delete button
            const deleteBtn = chatItem.querySelector('.delete-chat-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteChat(chat.id);
            });
            
            this.chatList.appendChild(chatItem);
        });
    }
    
    async switchToChat(chatId) {
        this.currentChatId = chatId;
        
        try {
            const response = await fetch(`/api/chat/${chatId}/history`);
            if (response.ok) {
                const data = await response.json();
                
                // Clear current display
                this.chatMessages.innerHTML = '';
                
                // Display messages
                data.messages.forEach(msg => {
                    this.addMessage(msg.content, msg.sender);
                });
                
                // Update chat list
                await this.loadChatHistory();
                
                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            }
        } catch (error) {
            console.error('Error switching to chat:', error);
        }
    }
    
    async deleteChat(chatId) {
        if (!confirm('Are you sure you want to delete this chat?')) return;
        
        try {
            // You can implement chat deletion API here
            console.log('Deleting chat:', chatId);
            
            // Update chat list
            await this.loadChatHistory();
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    }
    
    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        this.hamburgerMenu.classList.toggle('active');
    }
    
    closeSidebar() {
        this.sidebar.classList.remove('open');
        this.hamburgerMenu.classList.remove('active');
    }
    
    toggleUserMenu() {
        this.userMenu.classList.toggle('show');
    }
    
    updateUserDisplay() {
        const userDisplayName = document.getElementById('userDisplayName');
        const loginLogoutOption = document.getElementById('loginLogoutOption');
        const editProfileOption = document.getElementById('editProfileOption');
        
        if (this.isLoggedIn && this.currentUser) {
            userDisplayName.textContent = this.currentUser.username;
            loginLogoutOption.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Logout</span>';
            editProfileOption.style.display = 'block';
            
            // Update event listeners
            loginLogoutOption.onclick = () => this.logout();
            editProfileOption.onclick = () => this.showEditProfile();
        } else {
            userDisplayName.textContent = 'Guest';
            loginLogoutOption.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Login</span>';
            editProfileOption.style.display = 'none';
            
            // Update event listeners
            loginLogoutOption.onclick = () => this.showModal(document.getElementById('loginModal'));
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data;
                this.isLoggedIn = true;
                
                // Store user data
                localStorage.setItem('ven_user', JSON.stringify(data));
                
                // Update UI
                this.updateUserDisplay();
                this.hideModal(document.getElementById('loginModal'));
                
                // Load chat history
                await this.loadChatHistory();
                
                // Start new chat
                await this.startNewChat();
                
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    }
    
    async handleSignup(e) {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                alert('Account created successfully! Please login.');
                
                // Switch to login modal
                this.hideModal(document.getElementById('signupModal'));
                this.showModal(document.getElementById('loginModal'));
                
                // Clear form
                e.target.reset();
                
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed. Please try again.');
        }
    }
    
    async logout() {
        try {
            const response = await fetch('/api/user/logout', {
                method: 'POST'
            });
            
            if (response.ok) {
                // Clear user data
                this.currentUser = null;
                this.isLoggedIn = false;
                this.currentChatId = null;
                localStorage.removeItem('ven_user');
                
                // Update UI
                this.updateUserDisplay();
                
                // Clear chat
                this.chatMessages.innerHTML = '';
                this.addMessage("Hello! I'm Ven, your intelligent AI assistant. I can help you with various tasks, answer questions, and engage in meaningful conversations. How can I assist you today? 😊", 'bot');
                
                // Clear chat list
                this.chatList.innerHTML = '';
                
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed. Please try again.');
        }
    }
    
    showEditProfile() {
        if (!this.isLoggedIn) return;
        
        const modal = document.getElementById('editProfileModal');
        const usernameInput = document.getElementById('editUsername');
        
        usernameInput.value = this.currentUser.username;
        
        this.showModal(modal);
    }
    
    async showInsights() {
        if (!this.isLoggedIn || !this.currentChatId) {
            alert('Please login and start a conversation to see insights.');
            return;
        }
        
        const modal = document.getElementById('insightsModal');
        this.showModal(modal);
        
        try {
            // You can implement insights API here
            const insightsContent = document.getElementById('insightsContent');
            insightsContent.innerHTML = `
                <div class="insights-content">
                    <h3>Conversation Analysis</h3>
                    <p>This feature will provide detailed insights about your conversation patterns, topics discussed, and engagement metrics.</p>
                    <p>Coming soon! 🚀</p>
                </div>
            `;
        } catch (error) {
            console.error('Error loading insights:', error);
        }
    }
    
    async showSuggestions() {
        const modal = document.getElementById('suggestionsModal');
        this.showModal(modal);
        
        try {
            // You can implement suggestions API here
            const suggestionsContent = document.getElementById('suggestionsContent');
            suggestionsContent.innerHTML = `
                <div class="suggestions-content">
                    <h3>Suggested Responses</h3>
                    <p>This feature will provide intelligent response suggestions based on your conversation context.</p>
                    <p>Coming soon! 💡</p>
                </div>
            `;
        } catch (error) {
            console.error('Error loading suggestions:', error);
        }
    }
    
    showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VenChatbot();
});
