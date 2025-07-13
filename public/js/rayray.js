/**
 * Ray Ray - Personalized Writing Assistant
 * Loads writer-specific instructions and provides personalized feedback
 */

class RayRay {
  constructor() {
    this.writerInstructions = null;
    this.writerType = null;
    this.apiKey = null;
    this.init();
  }

  async init() {
    // Load writer type from localStorage
    this.writerType = localStorage.getItem('writerType') || 'default';
    
    // Load API key from environment (in production, this would be handled server-side)
    this.apiKey = this.getApiKey();
    
    // Load writer instructions
    await this.loadWriterInstructions();
  }

  getApiKey() {
    // In production, this should be handled server-side for security
    // For now, we'll use a placeholder that should be replaced with server endpoint
    return 'your-deepseek-api-key-here';
  }

  async loadWriterInstructions() {
    try {
      const response = await fetch(`/writer_instructions/${this.writerType}.txt`);
      if (response.ok) {
        this.writerInstructions = await response.text();
      } else {
        // Fallback to default if writer type file doesn't exist
        const defaultResponse = await fetch('/writer_instructions/default.txt');
        this.writerInstructions = await defaultResponse.text();
      }
    } catch (error) {
      console.error('Error loading writer instructions:', error);
      this.writerInstructions = this.getDefaultInstructions();
    }
  }

  getDefaultInstructions() {
    return `You are Ray Ray, a creative writing assistant and supportive writing coach. 
    You help writers brainstorm, develop their ideas, and improve their craft. 
    Be encouraging, insightful, and focused on helping writers discover their own voice.`;
  }

  async getPersonalizedFeedback(userPrompt) {
    if (!this.writerInstructions) {
      await this.loadWriterInstructions();
    }

    // Combine writer instructions with user prompt
    const personalizedPrompt = this.writerInstructions + "\n\n" + userPrompt;

    try {
      // Call the DeepSeek API with personalized prompt
      const response = await this.callDeepSeekAPI(personalizedPrompt);
      return response;
    } catch (error) {
      console.error('Error getting feedback:', error);
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
  }

  async callDeepSeekAPI(prompt) {
    // In production, this should be a server endpoint for security
    // For now, we'll simulate the API call structure
    
    const apiUrl = '/api/deepseek/chat'; // This would be a server endpoint
    
    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: this.writerInstructions
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      
      // Fallback response based on writer type
      return this.generateFallbackResponse(prompt);
    }
  }

  generateFallbackResponse(prompt) {
    const fallbackResponses = {
      explorer: "I love your curiosity! What discovery surprised you most while writing this? Let's explore that further.",
      tester: "Great experiment! What rule or convention are you testing here? How could you push this boundary even further?",
      actor: "I can hear the character's voice coming through. What is this character really feeling beneath the surface?",
      worldbuilder: "The world you're creating feels rich. What's one detail about this setting that only you know?",
      blueprint: "Your structure is solid. How does this piece fit into your larger story framework?",
      thief: "Nice remix! What elements are you borrowing and transforming here? How are you making them your own?",
      feeler: "The emotion comes through powerfully. What's the feeling you're trying to capture at the heart of this?",
      patterner: "I see interesting patterns emerging. What connections or themes are you discovering as you write?",
      transcriber: "You're channeling something authentic. What is the story trying to tell you?",
      thematist: "The deeper meaning is compelling. What question or truth are you exploring through this narrative?",
      default: "This is interesting work! What aspect of this writing are you most curious about? I'd love to help you explore it further."
    };

    return fallbackResponses[this.writerType] || fallbackResponses.default;
  }

  // Method to change writer type
  async changeWriterType(newType) {
    this.writerType = newType;
    localStorage.setItem('writerType', newType);
    await this.loadWriterInstructions();
  }

  // Method to get current writer type
  getCurrentWriterType() {
    return this.writerType;
  }

  // Method to get available writer types
  getAvailableTypes() {
    return [
      { id: 'blueprint', name: 'Blueprint Writer / Scaffold-Builder' },
      { id: 'thief', name: 'Thief / Remixer' },
      { id: 'actor', name: 'Actor' },
      { id: 'patterner', name: 'Patterner' },
      { id: 'explorer', name: 'Explorer' },
      { id: 'feeler', name: 'Feeler' },
      { id: 'tester', name: 'Tester' },
      { id: 'worldbuilder', name: 'Worldbuilder' },
      { id: 'transcriber', name: 'Transcriber' },
      { id: 'thematist', name: 'Thematist / Meaning-Driven' }
    ];
  }
}

// Create global instance
const rayRay = new RayRay();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RayRay;
}