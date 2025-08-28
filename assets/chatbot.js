class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.knowledge = {
            skills: {
                keywords: ['skill', 'technology', 'tools', 'programming'],
                response: "I'm skilled in **Data Analytics** (Power BI, SQL, Python), **Machine Learning** (TensorFlow, PyTorch), and **Cloud Platforms**. I also teach Power BI workshops!"
            },
            projects: {
                keywords: ['project', 'work', 'portfolio', 'built'],
                response: "I've built **Healthcare AI Models**, **Sales Forecasting Systems**, and **Power BI Training Platforms**. Want to know more about any specific project?"
            },
            contact: {
                keywords: ['contact', 'hire', 'email', 'connect'],
                response: "You can download my resume using the button above or connect with me via email. I'm always open to exciting opportunities!"
            },
            default: "I can help you learn about Shakeel's **skills**, **projects**, or how to **contact** him. What would you like to know?"
        };
        this.init();
    }

    init() {
        document.getElementById('chat-toggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('chat-close').addEventListener('click', () => this.closeChat());
        document.getElementById('chat-send').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('hidden', !this.isOpen);
    }

    closeChat() {
        document.getElementById('chat-window').classList.add('hidden');
        this.isOpen = false;
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        await this.delay(800);
        const response = this.generateResponse(message);
        this.addMessage(response, 'bot');
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        if (sender === 'user') {
            messageDiv.className = 'flex justify-end';
            messageDiv.innerHTML = `<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 max-w-[280px]"><p class="text-sm">${message}</p></div>`;
        } else {
            messageDiv.className = 'flex items-start space-x-3';
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">SA</span>
                </div>
                <div class="bg-white rounded-lg p-3 shadow-sm max-w-[280px]">
                    <div class="text-sm">${message}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [category, data] of Object.entries(this.knowledge)) {
            if (category === 'default') continue;
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return data.response;
            }
        }
        
        return this.knowledge.default;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioChatbot();
});
