<template>
  <div class="firebase-signin-view">
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center mb-0">Firebase 用户认证</h3>
            </div>
            <div class="card-body">
              
              <!-- 用户已登录状态 -->
              <div v-if="user" class="text-center">
                <div class="alert alert-success">
                  <h5>欢迎！</h5>
                  <p class="mb-2">
                    <strong>用户ID:</strong> {{ user.uid }}
                  </p>
                  <p class="mb-2" v-if="user.email">
                    <strong>邮箱:</strong> {{ user.email }}
                  </p>
                  <p class="mb-2" v-if="user.isAnonymous">
                    <span class="badge bg-warning">匿名用户</span>
                  </p>
                </div>
                <button @click="signOut" class="btn btn-danger">
                  <i class="fa fa-sign-out-alt me-2"></i>
                  登出
                </button>
              </div>

              <!-- 用户未登录状态 -->
              <div v-else>
                <div class="row">
                  
                  <!-- 邮箱登录表单 -->
                  <div class="col-12 mb-4">
                    <h5>邮箱登录</h5>
                    <form @submit.prevent="signInWithEmail">
                      <div class="mb-3">
                        <label for="email" class="form-label">邮箱</label>
                        <input 
                          type="email" 
                          class="form-control" 
                          id="email" 
                          v-model="email" 
                          required
                        >
                      </div>
                      <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input 
                          type="password" 
                          class="form-control" 
                          id="password" 
                          v-model="password" 
                          required
                        >
                      </div>
                      <button type="submit" class="btn btn-primary me-2" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        登录
                      </button>
                      <button type="button" @click="signUpWithEmail" class="btn btn-outline-primary" :disabled="loading">
                        注册
                      </button>
                    </form>
                  </div>

                  <!-- 其他登录方式 -->
                  <div class="col-12">
                    <div class="d-grid gap-2">
                      <button @click="signInAnonymously" class="btn btn-secondary" :disabled="loading">
                        <i class="fa fa-user-secret me-2"></i>
                        匿名登录
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <!-- 错误信息 -->
              <div v-if="error" class="alert alert-danger mt-3">
                <strong>错误:</strong> {{ error }}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth'

export default {
  name: 'FirebaseSigninView',
  setup() {
    const user = ref(null)
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    
    const auth = getAuth()

    // 监听认证状态变化
    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
        if (currentUser) {
          error.value = ''
        }
      })
    })

    // 邮箱登录
    const signInWithEmail = async () => {
      if (!email.value || !password.value) {
        error.value = '请填写邮箱和密码'
        return
      }

      loading.value = true
      error.value = ''

      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        console.log('邮箱登录成功')
      } catch (err) {
        console.error('邮箱登录失败:', err)
        error.value = getErrorMessage(err.code)
      } finally {
        loading.value = false
      }
    }

    // 邮箱注册
    const signUpWithEmail = async () => {
      if (!email.value || !password.value) {
        error.value = '请填写邮箱和密码'
        return
      }

      loading.value = true
      error.value = ''

      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value)
        console.log('邮箱注册成功')
      } catch (err) {
        console.error('邮箱注册失败:', err)
        error.value = getErrorMessage(err.code)
      } finally {
        loading.value = false
      }
    }

    // 匿名登录
    const signInAnonymously = async () => {
      loading.value = true
      error.value = ''

      try {
        await signInAnonymously(auth)
        console.log('匿名登录成功')
      } catch (err) {
        console.error('匿名登录失败:', err)
        error.value = getErrorMessage(err.code)
      } finally {
        loading.value = false
      }
    }

    // 登出
    const signOut = async () => {
      try {
        await firebaseSignOut(auth)
        email.value = ''
        password.value = ''
        console.log('登出成功')
      } catch (err) {
        console.error('登出失败:', err)
        error.value = getErrorMessage(err.code)
      }
    }

    // 错误信息处理
    const getErrorMessage = (errorCode) => {
      switch (errorCode) {
        case 'auth/user-not-found':
          return '用户不存在'
        case 'auth/wrong-password':
          return '密码错误'
        case 'auth/email-already-in-use':
          return '邮箱已被使用'
        case 'auth/weak-password':
          return '密码强度太弱'
        case 'auth/invalid-email':
          return '邮箱格式不正确'
        case 'auth/too-many-requests':
          return '请求过于频繁，请稍后重试'
        default:
          return `认证错误: ${errorCode}`
      }
    }

    return {
      user,
      email,
      password,
      error,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInAnonymously,
      signOut
    }
  }
}
</script>

<style scoped>
.firebase-signin-view {
  min-height: calc(100vh - 120px);
  padding: 20px 0;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
}

.btn {
  border-radius: 25px;
  padding: 10px 20px;
}

.form-control {
  border-radius: 10px;
  padding: 12px 16px;
}

.alert {
  border-radius: 10px;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.badge {
  font-size: 0.75em;
}
</style>
