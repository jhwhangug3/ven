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
        
        // Voice input functionality
        this.initVoiceInput();
        
        // New chat functionality
        this.initNewChat();
        
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
        
        // Check for Nahin searches first (highest priority)
        if (this.isNahinSearch(message)) {
            return this.getNahinInfo(message);
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
        
        // Check for exact matches for generic responses
        for (const [key, responses] of Object.entries(this.responses)) {
            if (lowerMessage.includes(key)) {
                return this.getRandomResponse(responses);
            }
        }
        
        // If no predefined response, search for information online
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
        
        // Generic search results for other topics
        return [
            {
                title: `${cleanQuery} - Information and Resources`,
                content: `Information about ${cleanQuery} is available from various sources online. This topic has been discussed and analyzed by experts in the field, with different perspectives and approaches being considered. For the most current and detailed information, check recent sources or specialized websites.`,
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
            return `I don't have a clear definition for "${cleanQuery}" in my knowledge base. This term might be:\n\n• A very recent concept or term\n• A local or specialized term\n• Something that's spelled differently\n\nYou could try searching online or providing more context about what you're looking for.`;
        }
        
        return `I couldn't find specific information about "${cleanQuery}". You might want to try:\n\n• Checking the spelling\n• Using different search terms\n• Looking up more recent sources`;
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
    
    startNewChat() {
        // Clear chat messages
        this.chatMessages.innerHTML = '';
        
        // Add welcome message
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'message bot-message';
        welcomeMessage.innerHTML = `
            <div class="message-wrapper">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        Hello! I'm Ven, your AI assistant. How can I help you today?
                    </div>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(welcomeMessage);
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.sendButton.disabled = true;
        
        // Focus on input
        this.messageInput.focus();
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Add to chat history (if we had a chat history feature)
        this.addToChatHistory('New Chat');
    }
    
    addToChatHistory(title) {
        // This would add the chat to the sidebar history
        // For now, we'll just log it
        console.log('New chat started:', title);
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
}); 
