<script>
  class OptimizedShakeelAI {
  constructor() {
    this.isOpen = false;
    this.isThinking = false;
    this.messages = [];
    this.pageLoadTriggered = false;
    
    // Concise thinking messages
    this.thinkingSteps = [
      "Analyzing your question...",
      "Processing Shakeel's data...", 
      "Generating response..."
    ];
    
    this.elements = {
      container: document.getElementById('ai-chatbot-container'),
      toggle: document.getElementById('chat-toggle'),
      closeBtn: document.getElementById('close-chat'),
      externalMenu: document.getElementById('external-menu'),
      menuBtn: document.getElementById('menu-btn'),
      menuOptions: document.getElementById('menu-options'),
      clearChatBtn: document.getElementById('clear-chat'),
      chatContent: document.getElementById('chat-content'),
      chatInput: document.getElementById('chat-input'),
      sendBtn: document.getElementById('send-message'),
      thinkingAnimation: document.getElementById('thinking-animation'),
      thinkingText: document.getElementById('thinking-text'),
      notificationDot: document.getElementById('notification-dot'),
      welcomeTrigger: document.getElementById('welcome-trigger'),
      triggerClose: document.getElementById('trigger-close')
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.setupPageLoadTrigger();
    this.setupCharacterCount();
    this.setupInputAutoResize();
  }
  
  bindEvents() {
    // Main controls
    this.elements.toggle.addEventListener('click', () => this.toggleChat());
    this.elements.closeBtn.addEventListener('click', () => this.closeChat());
    this.elements.triggerClose.addEventListener('click', () => this.hideTrigger());
    
    // External menu
    this.elements.menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });
    
    this.elements.clearChatBtn.addEventListener('click', () => this.clearChat());
    
    // Close menu when clicking outside
    document.addEventListener('click', () => {
      this.closeMenu();
    });
    
    // Input handling
    this.elements.chatInput.addEventListener('input', (e) => this.handleInput(e));
    this.elements.chatInput.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
    
    // Prompt chips
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', (e) => this.handlePromptClick(e));
    });
    
    // Global escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }
  
  setupPageLoadTrigger() {
    if (!this.pageLoadTriggered) {
      setTimeout(() => {
        this.showWelcomeTrigger();
        this.pageLoadTriggered = true;
      }, 2000);
    }
  }
  
  showWelcomeTrigger() {
    if (this.elements.welcomeTrigger) {
      this.elements.welcomeTrigger.classList.add('show');
      
      setTimeout(() => {
        this.hideTrigger();
      }, 8000);
    }
  }
  
  hideTrigger() {
    if (this.elements.welcomeTrigger) {
      this.elements.welcomeTrigger.classList.remove('show');
    }
  }
  
  setupCharacterCount() {
    const counter = document.querySelector('.character-count');
    if (this.elements.chatInput && counter) {
      this.elements.chatInput.addEventListener('input', () => {
        const count = this.elements.chatInput.value.length;
        counter.textContent = `${count}/2000`;
        
        if (count > 1800) {
          counter.style.color = '#ea4335';
        } else if (count > 1500) {
          counter.style.color = '#fbbc04';
        } else {
          counter.style.color = '';
        }
      });
    }
  }
  
  setupInputAutoResize() {
    if (this.elements.chatInput) {
      this.elements.chatInput.addEventListener('input', () => {
        this.autoResizeInput();
      });
    }
  }
  
  autoResizeInput() {
    const input = this.elements.chatInput;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }
  
  toggleMenu() {
    this.elements.menuOptions.classList.toggle('show');
  }
  
  closeMenu() {
    this.elements.menuOptions.classList.remove('show');
  }
  
  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }
  
  openChat() {
    this.isOpen = true;
    this.elements.container.classList.add('active');
    this.elements.container.setAttribute('aria-hidden', 'false');
    this.elements.externalMenu.classList.add('show');
    this.hideTrigger();
    this.hideNotification();
    this.closeMenu();
    
    setTimeout(() => {
      this.elements.chatInput.focus();
    }, 300);
  }
  
  closeChat() {
    this.isOpen = false;
    this.elements.container.classList.remove('active');
    this.elements.container.setAttribute('aria-hidden', 'true');
    this.elements.externalMenu.classList.remove('show');
    this.closeMenu();
  }
  
  clearChat() {
    if (confirm('Clear all messages?')) {
      this.messages = [];
      this.renderMessages();
      this.showWelcomeSection();
      this.closeMenu();
    }
  }
  
  hideNotification() {
    if (this.elements.notificationDot) {
      this.elements.notificationDot.style.display = 'none';
    }
  }
  
  handleInput(event) {
    const value = event.target.value;
    this.elements.sendBtn.disabled = value.trim().length === 0;
  }
  
  handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  
  handlePromptClick(event) {
    const chip = event.target.closest('.prompt-chip');
    const prompt = chip.dataset.prompt;
    
    if (prompt) {
      chip.style.transform = 'scale(0.95)';
      setTimeout(() => {
        chip.style.transform = '';
      }, 150);
      
      this.elements.chatInput.value = prompt;
      this.elements.chatInput.focus();
      this.elements.sendBtn.disabled = false;
      this.autoResizeInput();
      
      setTimeout(() => {
        this.sendMessage();
      }, 300);
    }
  }
  
  async sendMessage() {
    const messageText = this.elements.chatInput.value.trim();
    if (!messageText || this.isThinking) return;
    
    // Add user message
    this.addMessage({
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      id: this.generateId()
    });
    
    // Clear input
    this.elements.chatInput.value = '';
    this.elements.sendBtn.disabled = true;
    this.autoResizeInput();
    
    // Start thinking animation
    await this.showThinkingAnimation();
    
    try {
      const response = await this.getGeminiStyleResponse(messageText);
      
      this.hideThinkingAnimation();
      this.addMessage({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        id: this.generateId()
      });
    } catch (error) {
      this.hideThinkingAnimation();
      this.addMessage({
        role: 'assistant',
        content: 'I encountered an error. Please try again.',
        timestamp: new Date(),
        id: this.generateId()
      });
    }
  }
  
  async showThinkingAnimation() {
    this.isThinking = true;
    this.elements.thinkingAnimation.classList.add('active');
    let currentStep = 0;
    
    const thinkingInterval = setInterval(() => {
      if (currentStep < this.thinkingSteps.length - 1) {
        currentStep++;
        this.elements.thinkingText.textContent = this.thinkingSteps[currentStep];
      }
    }, 600);
    
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    clearInterval(thinkingInterval);
  }
  
  hideThinkingAnimation() {
    this.isThinking = false;
    this.elements.thinkingAnimation.classList.remove('active');
    this.elements.thinkingText.textContent = this.thinkingSteps[0];
  }
  
  async getGeminiStyleResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
      return `**Power BI Trainer & AR Process Analyst** with 2+ years in data analytics:

• Trained 50+ students (97% satisfaction)
• Reduced processing errors by 15%
• Expert in SQL, Python, BigQuery
• Achieved 20% faster workflows`;
    }
    
    if (lowerMessage.includes('project')) {
      return `**Key Projects:**

🚀 **Amazon Sales Forecasting** - 87% accuracy, $450K savings
🎯 **YouTube Sentiment Analysis** - 95.2% confidence with AI
☁️ **AWS Data Pipeline** - Real-time streaming architecture
🔍 **Customer Churn Analysis** - 85% prediction accuracy`;
    }
    
    if (lowerMessage.includes('tech') || lowerMessage.includes('skill')) {
      return `**Core Tech Stack:**

📊 **Analytics:** Python, SQL, BigQuery
🤖 **ML/AI:** TensorFlow, PyTorch, Gemini API
📈 **Visualization:** Power BI, Tableau
☁️ **Cloud:** AWS, Google Cloud Platform`;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return `**Contact Shakeel:**

📧 **Email:** shakeelahamed6618@gmail.com
💼 **LinkedIn:** linkedin.com/in/shakeel-data  
🐙 **GitHub:** github.com/shakeel-data
📍 **Location:** Chennai, India (Remote available)`;
    }
    
    return `I can help you learn about Shakeel's **experience**, **projects**, **tech stack**, or **contact** information. What interests you most?`;
  }
  
  addMessage(message) {
    this.messages.push(message);
    
    if (message.role === 'user') {
      this.hideWelcomeSection();
    }
    
    this.renderMessage(message);
    this.scrollToBottom();
  }
  
  renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.role}`;
    messageElement.dataset.id = message.id;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    const text = document.createElement('div');
    text.className = 'message-text';
    text.innerHTML = this.formatMessageContent(message.content);
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = this.formatTime(message.timestamp);
    
    bubble.appendChild(text);
    bubble.appendChild(time);
    messageElement.appendChild(bubble);
    
    this.elements.chatContent.appendChild(messageElement);
    
    // Entrance animation
    requestAnimationFrame(() => {
      messageElement.style.opacity = '0';
      messageElement.style.transform = 'translateY(10px)';
      messageElement.style.transition = 'all 0.3s ease-out';
      
      requestAnimationFrame(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
      });
    });
  }
  
  formatMessageContent(content) {
    if (!content) return '';
    
    let formatted = this.escapeHtml(content);
    
    // Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Bullet points with emoji
    formatted = formatted.replace(/^•\s(.+)$/gm, '<div style="margin: 4px 0; padding-left: 16px; position: relative;"><span style="position: absolute; left: 0; color: #1a73e8;">•</span>$1</div>');
    
    // Emoji formatting
    formatted = formatted.replace(/^(🚀|🎯|☁️|🔍|📊|🤖|📈|📧|💼|🐙|📍)\s/gm, '<span style="margin-right: 8px;">$1</span>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  renderMessages() {
    const existingMessages = this.elements.chatContent.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    if (this.messages.length === 0) {
      this.showWelcomeSection();
    } else {
      this.hideWelcomeSection();
      this.messages.forEach(message => this.renderMessage(message));
    }
  }
  
  showWelcomeSection() {
    const welcomeSection = this.elements.chatContent.querySelector('.welcome-section');
    if (welcomeSection) {
      welcomeSection.style.display = 'flex';
    }
  }
  
  hideWelcomeSection() {
    const welcomeSection = this.elements.chatContent.querySelector('.welcome-section');
    if (welcomeSection) {
      welcomeSection.style.display = 'none';
    }
  }
  
  scrollToBottom() {
    setTimeout(() => {
      this.elements.chatContent.scrollTop = this.elements.chatContent.scrollHeight;
    }, 100);
  }
  
  formatTime(timestamp) {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new OptimizedShakeelAI();
});

</script>
