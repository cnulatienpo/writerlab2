/**
 * Ray Ray UI Component
 * Provides a chat interface for the Ray Ray writing assistant
 */

class RayRayUI {
  constructor() {
    this.isMinimized = false;
    this.chatHistory = [];
    this.init();
  }

  init() {
    this.createUI();
    this.attachEventListeners();
  }

  createUI() {
    // Create the main container
    const container = document.createElement('div');
    container.id = 'rayray-container';
    container.className = 'rayray-container open';
    
    container.innerHTML = `
      <div class="rayray-box">
        <div class="rayray-header" onclick="rayRayUI.toggleChat()">
          <span class="rayray-icon">🤖</span>
          <span class="rayray-title">Ray Ray</span>
          <span class="rayray-type">${this.getWriterTypeDisplay()}</span>
          <span class="rayray-toggle">▼</span>
        </div>
        <div class="rayray-content">
          <div class="rayray-messages" id="rayray-messages"></div>
          <div class="rayray-input-container">
            <input type="text" id="rayray-input" placeholder="Ask Ray Ray anything about your writing..." />
            <button id="rayray-send" onclick="rayRayUI.sendMessage()">Send</button>
          </div>
          <div class="rayray-controls">
            <button class="rayray-settings" onclick="rayRayUI.showSettings()">⚙️ Settings</button>
            <button class="rayray-quiz" onclick="rayRayUI.retakeQuiz()">📝 Retake Quiz</button>
          </div>
        </div>
      </div>
    `;

    // Add CSS styles
    this.addStyles();

    // Add to page
    document.body.appendChild(container);
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .rayray-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        background: #1c1c1c;
        border-radius: 12px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        z-index: 1000;
        font-family: 'Space Grotesk', sans-serif;
        transition: all 0.3s ease;
      }

      .rayray-container.minimized {
        height: 60px;
        overflow: hidden;
      }

      .rayray-box {
        background: #1c1c1c;
        border-radius: 12px;
        border: 1px solid #333;
      }

      .rayray-header {
        background: #2a2a2a;
        padding: 15px;
        border-radius: 12px 12px 0 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: #f4f4f4;
        user-select: none;
      }

      .rayray-icon {
        margin-right: 10px;
        font-size: 18px;
      }

      .rayray-title {
        font-weight: bold;
        flex: 1;
      }

      .rayray-type {
        font-size: 12px;
        color: #999;
        margin-left: 10px;
      }

      .rayray-toggle {
        margin-left: auto;
        transition: transform 0.3s ease;
      }

      .rayray-container.minimized .rayray-toggle {
        transform: rotate(180deg);
      }

      .rayray-content {
        padding: 15px;
        color: #f4f4f4;
      }

      .rayray-messages {
        height: 200px;
        overflow-y: auto;
        margin-bottom: 15px;
        padding: 10px;
        background: #111;
        border-radius: 8px;
        border: 1px solid #333;
      }

      .rayray-message {
        margin-bottom: 12px;
        line-height: 1.4;
      }

      .rayray-message.user {
        color: #85e1ff;
      }

      .rayray-message.assistant {
        color: #ffe877;
      }

      .rayray-input-container {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }

      .rayray-input-container input {
        flex: 1;
        padding: 10px;
        background: #222;
        border: 1px solid #333;
        border-radius: 6px;
        color: #f4f4f4;
        font-family: inherit;
      }

      .rayray-input-container input:focus {
        outline: none;
        border-color: #85e1ff;
      }

      .rayray-input-container button {
        padding: 10px 15px;
        background: #85e1ff;
        color: #111;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        font-family: inherit;
      }

      .rayray-input-container button:hover {
        background: #70d4ff;
      }

      .rayray-controls {
        display: flex;
        gap: 10px;
        justify-content: space-between;
      }

      .rayray-controls button {
        padding: 8px 12px;
        background: #333;
        color: #f4f4f4;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-family: inherit;
      }

      .rayray-controls button:hover {
        background: #444;
      }

      .rayray-thinking {
        color: #999;
        font-style: italic;
      }
    `;
    document.head.appendChild(style);
  }

  attachEventListeners() {
    const input = document.getElementById('rayray-input');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
  }

  toggleChat() {
    const container = document.getElementById('rayray-container');
    container.classList.toggle('minimized');
    this.isMinimized = !this.isMinimized;
  }

  async sendMessage() {
    const input = document.getElementById('rayray-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message to chat
    this.addMessage('user', message);
    input.value = '';

    // Show thinking indicator
    this.addMessage('assistant', 'Ray Ray is thinking...', 'rayray-thinking');

    try {
      // Get personalized response from Ray Ray
      const response = await rayRay.getPersonalizedFeedback(message);
      
      // Remove thinking indicator
      this.removeLastMessage();
      
      // Add Ray Ray's response
      this.addMessage('assistant', response);
      
    } catch (error) {
      console.error('Error getting Ray Ray response:', error);
      this.removeLastMessage();
      this.addMessage('assistant', "Sorry, I'm having trouble right now. Please try again!");
    }
  }

  addMessage(sender, content, className = '') {
    const messagesContainer = document.getElementById('rayray-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `rayray-message ${sender} ${className}`;
    messageDiv.textContent = `${sender === 'user' ? 'You' : 'Ray Ray'}: ${content}`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  removeLastMessage() {
    const messagesContainer = document.getElementById('rayray-messages');
    const lastMessage = messagesContainer.lastElementChild;
    if (lastMessage) {
      messagesContainer.removeChild(lastMessage);
    }
  }

  getWriterTypeDisplay() {
    const type = rayRay.getCurrentWriterType();
    const types = rayRay.getAvailableTypes();
    const typeInfo = types.find(t => t.id === type);
    return typeInfo ? typeInfo.name.split('/')[0].trim() : 'Default';
  }

  showSettings() {
    const types = rayRay.getAvailableTypes();
    const currentType = rayRay.getCurrentWriterType();
    
    let options = types.map(type => 
      `<option value="${type.id}" ${type.id === currentType ? 'selected' : ''}>${type.name}</option>`
    ).join('');

    const settingsHTML = `
      <div id="rayray-settings-modal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
      ">
        <div style="
          background: #1c1c1c;
          padding: 30px;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          color: #f4f4f4;
        ">
          <h3 style="margin-top: 0;">Ray Ray Settings</h3>
          <p>Choose your writer type to get personalized feedback:</p>
          <select id="writer-type-select" style="
            width: 100%;
            padding: 10px;
            margin: 15px 0;
            background: #222;
            color: #f4f4f4;
            border: 1px solid #333;
            border-radius: 6px;
          ">
            ${options}
          </select>
          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button onclick="rayRayUI.closeSettings()" style="
              padding: 10px 20px;
              background: #333;
              color: #f4f4f4;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            ">Cancel</button>
            <button onclick="rayRayUI.saveSettings()" style="
              padding: 10px 20px;
              background: #85e1ff;
              color: #111;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-weight: bold;
            ">Save</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', settingsHTML);
  }

  async saveSettings() {
    const select = document.getElementById('writer-type-select');
    const newType = select.value;
    
    await rayRay.changeWriterType(newType);
    
    // Update the UI
    const typeDisplay = document.querySelector('.rayray-type');
    typeDisplay.textContent = this.getWriterTypeDisplay();
    
    this.closeSettings();
    this.addMessage('assistant', `Settings updated! I'm now personalized for ${this.getWriterTypeDisplay()} writers.`);
  }

  closeSettings() {
    const modal = document.getElementById('rayray-settings-modal');
    if (modal) {
      modal.remove();
    }
  }

  retakeQuiz() {
    window.location.href = '/quiz.html';
  }
}

// Initialize Ray Ray UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.rayRayUI = new RayRayUI();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RayRayUI;
}