<script setup>
import { ref } from 'vue'
import { isAuthenticated } from '../services/authService'
import { useRouter } from 'vue-router'

const router = useRouter()

// Check if user is authenticated
if (!isAuthenticated.value) {
  router.push('/firebase-signin')
}

const to = ref('')
const subject = ref('')
const message = ref('')
const attachments = ref([])
const isLoading = ref(false)
const statusMessage = ref('')
const statusType = ref('') // 'success' or 'error'

// Handle file upload
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      attachments.value.push({
        filename: file.name,
        content: e.target.result.split(',')[1], // Get base64 content
        size: file.size
      })
    }
    reader.readAsDataURL(file)
  })
}

// Remove attachment
const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Send email function
const sendEmail = async () => {
  if (!to.value || !subject.value || !message.value) {
    statusMessage.value = 'Please fill in all required fields'
    statusType.value = 'error'
    return
  }

  isLoading.value = true
  statusMessage.value = ''

  try {
    // Call Firebase Cloud Function
    const functionUrl = 'https://us-central1-week7-zhenbang-zhao.cloudfunctions.net/sendEmail'
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to.value,
        subject: subject.value,
        text: message.value,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <p>${message.value.replace(/\n/g, '<br>')}</p>
        </div>`,
        attachments: attachments.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      statusMessage.value = 'Email sent successfully!'
      statusType.value = 'success'
      // Clear form
      to.value = ''
      subject.value = ''
      message.value = ''
      attachments.value = []
    } else {
      statusMessage.value = 'Failed to send email: ' + (data.error || 'Unknown error')
      statusType.value = 'error'
    }
  } catch (error) {
    console.error('Error sending email:', error)
    statusMessage.value = 'Error sending email: ' + error.message
    statusType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card">
          <div class="card-header">
            <h2 class="mb-0">
              <i class="bi bi-envelope"></i> Send Email
            </h2>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="sendEmail">
              <!-- Recipient -->
              <div class="mb-3">
                <label for="to" class="form-label">To: *</label>
                <input
                  type="email"
                  class="form-control"
                  id="to"
                  v-model="to"
                  placeholder="recipient@example.com"
                  required
                  :disabled="isLoading"
                >
              </div>

              <!-- Subject -->
              <div class="mb-3">
                <label for="subject" class="form-label">Subject: *</label>
                <input
                  type="text"
                  class="form-control"
                  id="subject"
                  v-model="subject"
                  placeholder="Enter email subject"
                  required
                  :disabled="isLoading"
                >
              </div>

              <!-- Message -->
              <div class="mb-3">
                <label for="message" class="form-label">Message: *</label>
                <textarea
                  class="form-control"
                  id="message"
                  v-model="message"
                  rows="8"
                  placeholder="Enter your message here..."
                  required
                  :disabled="isLoading"
                ></textarea>
              </div>

              <!-- Attachments -->
              <div class="mb-3">
                <label for="attachments" class="form-label">Attachments:</label>
                <input
                  type="file"
                  class="form-control"
                  id="attachments"
                  @change="handleFileUpload"
                  multiple
                  :disabled="isLoading"
                >
                <small class="text-muted">You can select multiple files</small>
              </div>

              <!-- Attachment list -->
              <div v-if="attachments.length > 0" class="mb-3">
                <label class="form-label">Attached files:</label>
                <ul class="list-group">
                  <li
                    v-for="(attachment, index) in attachments"
                    :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <i class="bi bi-paperclip"></i>
                      {{ attachment.filename }}
                      <span class="text-muted ms-2">({{ formatFileSize(attachment.size) }})</span>
                    </span>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      @click="removeAttachment(index)"
                      :disabled="isLoading"
                    >
                      Remove
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Status message -->
              <div
                v-if="statusMessage"
                :class="['alert', statusType === 'success' ? 'alert-success' : 'alert-danger']"
                role="alert"
              >
                {{ statusMessage }}
              </div>

              <!-- Submit button -->
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Sending...
                  </span>
                  <span v-else>
                    <i class="bi bi-send"></i> Send Email
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Info card -->
        <div class="card mt-4">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-info-circle"></i> Email Configuration
            </h5>
            <p class="card-text">
              This email service uses Firebase Cloud Functions with Nodemailer.
              To enable email sending, configure your email service credentials in the Firebase Functions environment.
            </p>
            <p class="card-text text-muted small mb-0">
              <strong>Note:</strong> For Gmail, you need to use an App Password instead of your regular password.
              Visit your Google Account settings to generate one.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 10px;
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 15px 20px;
  border-radius: 10px 10px 0 0;
}

.card-header h2 {
  font-size: 1.5rem;
}

textarea {
  resize: vertical;
}

.list-group-item {
  border-radius: 5px;
  margin-bottom: 5px;
}

.bi {
  margin-right: 5px;
}
</style>

