<script setup>
import { ref } from 'vue'
import axios from 'axios'

// DeepSeek API configuration
const DEEPSEEK_API_KEY = 'sk-65c9bfc072084966baccfdb34360e56b'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// Component state
const userInput = ref('')
const isLoading = ref(false)
const conversationHistory = ref([])

// Send message to DeepSeek API
const sendMessage = async () => {
  if (!userInput.value.trim()) return

  isLoading.value = true

  // Add user message to history
  const userMessage = userInput.value
  conversationHistory.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date().toLocaleTimeString()
  })

  try {
    // Call DeepSeek API
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful book assistant. Provide book recommendations, analysis, and answer questions about books and literature.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    )

    // Add AI response to history
    conversationHistory.value.push({
      role: 'assistant',
      content: response.data.choices[0].message.content,
      timestamp: new Date().toLocaleTimeString()
    })

  } catch (error) {
    console.error('Error:', error)
    conversationHistory.value.push({
      role: 'assistant',
      content: 'Error: Unable to get response. Please try again.',
      timestamp: new Date().toLocaleTimeString(),
      isError: true
    })
  } finally {
    isLoading.value = false
    userInput.value = ''
  }
}

// Clear conversation
const clearConversation = () => {
  conversationHistory.value = []
  userInput.value = ''
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">AI Book Assistant</h1>
        <p class="text-center text-muted">
          Powered by DeepSeek AI - Ask about books and get recommendations
        </p>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-8 offset-md-2">
        <!-- Conversation History -->
        <div class="card mb-3">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Conversation</h5>
            <button
              class="btn btn-sm btn-outline-light"
              @click="clearConversation"
              v-if="conversationHistory.length > 0"
            >
              Clear
            </button>
          </div>
          <div class="card-body chat-container">
            <div v-if="conversationHistory.length === 0" class="text-center text-muted py-5">
              <p>Start a conversation with the AI assistant</p>
            </div>
            
            <div
              v-for="(message, index) in conversationHistory"
              :key="index"
              class="message-bubble"
              :class="{ 
                'user-message': message.role === 'user', 
                'ai-message': message.role === 'assistant', 
                'error-message': message.isError 
              }"
            >
              <div class="message-header">
                <strong>{{ message.role === 'user' ? 'You' : 'AI' }}</strong>
                <span class="timestamp">{{ message.timestamp }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>

            <!-- Loading indicator -->
            <div v-if="isLoading" class="message-bubble ai-message">
              <div class="message-header">
                <strong>AI</strong>
              </div>
              <div class="message-content">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Thinking...
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="sendMessage">
              <div class="mb-3">
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="userInput"
                  placeholder="Ask about books, get recommendations, or discuss literature..."
                  :disabled="isLoading"
                ></textarea>
              </div>
              <div class="text-end">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!userInput.trim() || isLoading"
                >
                  <span v-if="isLoading">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Sending...
                  </span>
                  <span v-else>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  background-color: #275fda;
  color: white;
}

.chat-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
}

.message-bubble {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 8px;
}

.user-message {
  background-color: #275fda;
  color: white;
  margin-left: 15%;
}

.ai-message {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  margin-right: 15%;
}

.error-message {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.timestamp {
  font-size: 0.8rem;
  opacity: 0.7;
}

.message-content {
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}
</style>

