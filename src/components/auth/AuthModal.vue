<template>
  <div class="auth-overlay" v-if="isVisible" @click="closeModal">
    <div class="auth-modal" @click.stop>
      <!-- Background Animation -->
      <div class="auth-background">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
        </div>
      </div>

      <!-- Close Button -->
      <button @click="closeModal" class="close-btn">
        <i class="fas fa-times"></i>
      </button>

      <!-- Modal Content -->
      <div class="auth-content">
        <!-- Header -->
        <div class="auth-header">
          <div class="auth-logo">
            <div class="logo-icon">
              <i class="fas fa-gem"></i>
            </div>
            <span class="logo-text">Beauty Market</span>
          </div>
          <h2 class="auth-title">{{ isSignUp ? 'Create Your Beauty Account' : 'Welcome Back to Beauty' }}</h2>
          <p class="auth-subtitle">
            {{ isSignUp 
              ? 'Join thousands of beauty enthusiasts and discover your perfect products' 
              : 'Sign in to access your personalized beauty experience' 
            }}
          </p>
        </div>

        <!-- Social Authentication -->
        <div class="social-auth">
          <button @click="signInWithGoogle" class="social-btn google-btn">
            <i class="fab fa-google"></i>
            <span>{{ isSignUp ? 'Sign up' : 'Continue' }} with Google</span>
          </button>
          <button @click="signInWithFacebook" class="social-btn facebook-btn">
            <i class="fab fa-facebook-f"></i>
            <span>{{ isSignUp ? 'Sign up' : 'Continue' }} with Facebook</span>
          </button>
        </div>

        <div class="auth-divider">
          <span>or</span>
        </div>

        <!-- Authentication Form -->
        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- Sign Up Fields -->
          <div v-if="isSignUp" class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <div class="input-wrapper">
                <i class="fas fa-user input-icon"></i>
                <input
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.firstName }"
                  placeholder="Enter your first name"
                  required
                >
              </div>
              <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
            </div>
            
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <div class="input-wrapper">
                <i class="fas fa-user input-icon"></i>
                <input
                  v-model="form.lastName"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.lastName }"
                  placeholder="Enter your last name"
                  required
                >
              </div>
              <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
            </div>
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope input-icon"></i>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ error: errors.email }"
                placeholder="Enter your email address"
                required
              >
            </div>
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <i class="fas fa-lock input-icon"></i>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: errors.password }"
                placeholder="Enter your password"
                required
              >
              <button 
                type="button" 
                @click="togglePassword" 
                class="password-toggle"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            
            <!-- Password Strength Meter (Sign Up) -->
            <div v-if="isSignUp && form.password" class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="strength-text" :class="passwordStrength.class">
                {{ passwordStrength.text }}
              </span>
            </div>
          </div>

          <!-- Confirm Password (Sign Up) -->
          <div v-if="isSignUp" class="form-group">
            <label class="form-label">Confirm Password</label>
            <div class="input-wrapper">
              <i class="fas fa-lock input-icon"></i>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: errors.confirmPassword }"
                placeholder="Confirm your password"
                required
              >
              <button 
                type="button" 
                @click="toggleConfirmPassword" 
                class="password-toggle"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <!-- Beauty Preferences (Sign Up) -->
          <div v-if="isSignUp" class="form-group">
            <label class="form-label">Beauty Interests (Optional)</label>
            <div class="checkbox-group">
              <label v-for="interest in beautyInterests" :key="interest.id" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="interest.id"
                  v-model="form.interests"
                  class="checkbox-input"
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">{{ interest.name }}</span>
              </label>
            </div>
          </div>

          <!-- Remember Me / Forgot Password -->
          <div class="form-options">
            <label v-if="!isSignUp" class="remember-label">
              <input type="checkbox" v-model="form.rememberMe" class="checkbox-input">
              <span class="checkbox-custom"></span>
              <span>Remember me</span>
            </label>
            
            <div v-if="isSignUp" class="terms-checkbox">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="form.agreeToTerms" 
                  class="checkbox-input"
                  required
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  I agree to the <a href="/terms-of-service" target="_blank">Terms of Service</a> 
                  and <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <button 
              v-if="!isSignUp" 
              type="button" 
              @click="showForgotPassword" 
              class="forgot-link"
            >
              Forgot Password?
            </button>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="auth-submit-btn"
            :disabled="isLoading || (isSignUp && !form.agreeToTerms)"
            :class="{ loading: isLoading }"
          >
            <span v-if="!isLoading">
              <i class="fas" :class="isSignUp ? 'fa-user-plus' : 'fa-sign-in-alt'"></i>
              {{ isSignUp ? 'Create Account' : 'Sign In' }}
            </span>
            <span v-else class="loading-content">
              <i class="fas fa-spinner fa-spin"></i>
              {{ isSignUp ? 'Creating Account...' : 'Signing In...' }}
            </span>
          </button>
        </form>

        <!-- Switch Mode -->
        <div class="auth-switch">
          <p>
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <button @click="toggleMode" class="switch-btn">
              {{ isSignUp ? 'Sign In' : 'Sign Up' }}
            </button>
          </p>
        </div>

        <!-- Trust Indicators -->
        <div class="trust-indicators">
          <div class="trust-item">
            <i class="fas fa-shield-alt"></i>
            <span>Secure & Encrypted</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-user-shield"></i>
            <span>Privacy Protected</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-heart"></i>
            <span>Join 100K+ Users</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPasswordModal" class="forgot-password-overlay" @click="closeForgotPassword">
      <div class="forgot-password-modal" @click.stop>
        <div class="forgot-header">
          <h3>Reset Your Password</h3>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        
        <form @submit.prevent="handleForgotPassword" class="forgot-form">
          <div class="form-group">
            <div class="input-wrapper">
              <i class="fas fa-envelope input-icon"></i>
              <input
                v-model="forgotEmail"
                type="email"
                class="form-input"
                placeholder="Enter your email address"
                required
              >
            </div>
          </div>
          
          <div class="forgot-actions">
            <button type="button" @click="closeForgotPassword" class="btn-cancel">
              Cancel
            </button>
            <button type="submit" class="btn-submit" :disabled="!forgotEmail">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    initialMode: {
      type: String,
      default: 'signin' // 'signin' or 'signup'
    }
  },
  data() {
    return {
      isSignUp: this.initialMode === 'signup',
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
      showForgotPasswordModal: false,
      forgotEmail: '',
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        agreeToTerms: false,
        interests: []
      },
      errors: {},
      beautyInterests: [
        { id: 'skincare', name: 'Skincare' },
        { id: 'makeup', name: 'Makeup' },
        { id: 'haircare', name: 'Hair Care' },
        { id: 'fragrance', name: 'Fragrance' },
        { id: 'tools', name: 'Beauty Tools' },
        { id: 'wellness', name: 'Wellness' }
      ]
    };
  },
  computed: {
    passwordStrength() {
      const password = this.form.password;
      if (!password) return { width: '0%', class: '', text: '' };
      
      let score = 0;
      let feedback = [];
      
      // Length check
      if (password.length >= 8) score += 2;
      else feedback.push('at least 8 characters');
      
      // Uppercase check
      if (/[A-Z]/.test(password)) score += 1;
      else feedback.push('uppercase letter');
      
      // Lowercase check
      if (/[a-z]/.test(password)) score += 1;
      else feedback.push('lowercase letter');
      
      // Number check
      if (/\d/.test(password)) score += 1;
      else feedback.push('number');
      
      // Special character check
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
      else feedback.push('special character');
      
      if (score <= 2) {
        return { width: '25%', class: 'weak', text: 'Weak' };
      } else if (score <= 4) {
        return { width: '50%', class: 'medium', text: 'Medium' };
      } else if (score <= 5) {
        return { width: '75%', class: 'good', text: 'Good' };
      } else {
        return { width: '100%', class: 'strong', text: 'Strong' };
      }
    }
  },
  methods: {
    toggleMode() {
      this.isSignUp = !this.isSignUp;
      this.clearForm();
      this.errors = {};
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    
    showForgotPassword() {
      this.showForgotPasswordModal = true;
    },
    
    closeForgotPassword() {
      this.showForgotPasswordModal = false;
      this.forgotEmail = '';
    },
    
    validateForm() {
      this.errors = {};
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }
      
      // Password validation
      if (this.form.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long';
      }
      
      if (this.isSignUp) {
        // Name validations
        if (!this.form.firstName.trim()) {
          this.errors.firstName = 'First name is required';
        }
        if (!this.form.lastName.trim()) {
          this.errors.lastName = 'Last name is required';
        }
        
        // Confirm password validation
        if (this.form.password !== this.form.confirmPassword) {
          this.errors.confirmPassword = 'Passwords do not match';
        }
        
        // Terms validation
        if (!this.form.agreeToTerms) {
          this.errors.terms = 'You must agree to the terms and conditions';
        }
      }
      
      return Object.keys(this.errors).length === 0;
    },
    
    async handleSubmit() {
      if (!this.validateForm()) return;
      
      this.isLoading = true;
      
      try {
        if (this.isSignUp) {
          await this.signUp();
        } else {
          await this.signIn();
        }
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async signUp() {
      // Simulate API call
      await this.delay(2000);
      
      const userData = {
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        interests: this.form.interests
      };
      
      // Store user data
      this.$store.dispatch('user/createAccount', userData);
      
      this.$emit('auth-success', {
        type: 'signup',
        user: userData,
        message: 'Account created successfully! Welcome to Beauty Market!'
      });
      
      this.closeModal();
    },
    
    async signIn() {
      // Simulate API call
      await this.delay(1500);
      
      const userData = {
        email: this.form.email,
        rememberMe: this.form.rememberMe
      };
      
      // Authenticate user
      this.$store.dispatch('user/signIn', userData);
      
      this.$emit('auth-success', {
        type: 'signin',
        user: userData,
        message: 'Welcome back! You have been signed in successfully.'
      });
      
      this.closeModal();
    },
    
    async signInWithGoogle() {
      this.isLoading = true;
      try {
        // Simulate Google OAuth
        await this.delay(1000);
        
        const userData = {
          name: 'Google User',
          email: 'user@gmail.com',
          provider: 'google'
        };
        
        this.$store.dispatch('user/socialSignIn', userData);
        
        this.$emit('auth-success', {
          type: 'social',
          user: userData,
          message: 'Successfully signed in with Google!'
        });
        
        this.closeModal();
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async signInWithFacebook() {
      this.isLoading = true;
      try {
        // Simulate Facebook OAuth
        await this.delay(1000);
        
        const userData = {
          name: 'Facebook User',
          email: 'user@facebook.com',
          provider: 'facebook'
        };
        
        this.$store.dispatch('user/socialSignIn', userData);
        
        this.$emit('auth-success', {
          type: 'social',
          user: userData,
          message: 'Successfully signed in with Facebook!'
        });
        
        this.closeModal();
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async handleForgotPassword() {
      this.isLoading = true;
      try {
        // Simulate password reset API call
        await this.delay(1000);
        
        this.$emit('password-reset-sent', {
          email: this.forgotEmail,
          message: 'Password reset link sent to your email!'
        });
        
        this.closeForgotPassword();
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    handleAuthError(error) {
      this.$emit('auth-error', {
        message: error.message || 'Authentication failed. Please try again.'
      });
    },
    
    clearForm() {
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        agreeToTerms: false,
        interests: []
      };
    },
    
    closeModal() {
      this.$emit('close');
      this.clearForm();
      this.errors = {};
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.showForgotPasswordModal = false;
    },
    
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  
  watch: {
    initialMode(newMode) {
      this.isSignUp = newMode === 'signup';
    }
  }
};
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-modal {
  background: white;
  border-radius: 24px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, 
    var(--primary-500) 0%,
    var(--primary-600) 25%,
    var(--purple-600) 50%,
    var(--pink-500) 75%,
    var(--primary-500) 100%);
  border-radius: 24px 24px 0 0;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 60px;
  height: 60px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 40px;
  height: 40px;
  top: 60%;
  left: 80%;
  animation-delay: 1s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 10%;
  right: 15%;
  animation-delay: 2s;
}

.shape-4 {
  width: 30px;
  height: 30px;
  bottom: 20%;
  left: 20%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.6;
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.auth-content {
  padding: 40px;
  padding-top: 180px;
  position: relative;
  z-index: 5;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 16px rgba(236, 72, 153, 0.3);
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-800);
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.auth-subtitle {
  color: var(--gray-600);
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.social-auth {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 20px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  background: white;
  color: var(--gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.social-btn:hover {
  border-color: var(--gray-300);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
  border-color: #db4437;
  color: #db4437;
}

.facebook-btn:hover {
  border-color: #1877f2;
  color: #1877f2;
}

.auth-divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-200);
}

.auth-divider span {
  background: white;
  color: var(--gray-500);
  padding: 0 16px;
  font-size: 14px;
  position: relative;
}

.auth-form {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 8px;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  font-size: 16px;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 16px 20px 16px 48px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.form-input.error {
  border-color: var(--error-500);
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--gray-600);
}

.error-message {
  display: block;
  color: var(--error-500);
  font-size: 12px;
  margin-top: 4px;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background: var(--error-500);
}

.strength-fill.medium {
  background: var(--warning-500);
}

.strength-fill.good {
  background: #3b82f6;
}

.strength-fill.strong {
  background: var(--success-500);
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.strength-text.weak {
  color: var(--error-500);
}

.strength-text.medium {
  color: var(--warning-500);
}

.strength-text.good {
  color: #3b82f6;
}

.strength-text.strong {
  color: var(--success-500);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.checkbox-label:hover {
  background: var(--gray-50);
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--gray-300);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.checkbox-text {
  font-size: 14px;
  color: var(--gray-700);
}

.checkbox-text a {
  color: var(--primary-600);
  text-decoration: none;
}

.checkbox-text a:hover {
  text-decoration: underline;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--gray-700);
}

.terms-checkbox {
  flex: 1;
}

.forgot-link {
  background: none;
  border: none;
  color: var(--primary-600);
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
}

.forgot-link:hover {
  text-decoration: underline;
}

.auth-submit-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
}

.auth-submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(236, 72, 153, 0.3);
}

.auth-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-switch {
  text-align: center;
  margin-bottom: 24px;
}

.auth-switch p {
  color: var(--gray-600);
  margin: 0;
}

.switch-btn {
  background: none;
  border: none;
  color: var(--primary-600);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  margin-left: 4px;
}

.switch-btn:hover {
  text-decoration: underline;
}

.trust-indicators {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--gray-200);
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.trust-item i {
  color: var(--primary-500);
  font-size: 18px;
}

.trust-item span {
  font-size: 12px;
  color: var(--gray-600);
  font-weight: 500;
}

/* Forgot Password Modal */
.forgot-password-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  backdrop-filter: blur(8px);
}

.forgot-password-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.forgot-header {
  text-align: center;
  margin-bottom: 24px;
}

.forgot-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.forgot-header p {
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
}

.forgot-form {
  margin-bottom: 16px;
}

.forgot-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  flex: 1;
  background: var(--gray-100);
  color: var(--gray-700);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-cancel:hover {
  background: var(--gray-200);
}

.btn-submit {
  flex: 1;
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  background: var(--primary-600);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-modal {
    margin: 10px;
    border-radius: 16px;
  }
  
  .auth-content {
    padding: 24px;
    padding-top: 160px;
  }
  
  .auth-background {
    height: 160px;
  }
  
  .auth-title {
    font-size: 24px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .trust-indicators {
    gap: 16px;
  }
  
  .trust-item span {
    font-size: 11px;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .auth-overlay {
    padding: 10px;
  }
  
  .auth-content {
    padding: 20px;
    padding-top: 140px;
  }
  
  .auth-background {
    height: 140px;
  }
  
  .close-btn {
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }
  
  .social-btn {
    padding: 12px 16px;
    font-size: 15px;
  }
  
  .trust-indicators {
    flex-direction: column;
    gap: 12px;
  }
  
  .trust-item {
    flex-direction: row;
    gap: 8px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .auth-modal,
  .floating-shapes .shape,
  .close-btn,
  .social-btn,
  .form-input,
  .auth-submit-btn {
    animation: none;
    transition: none;
  }
}

/* Focus styles for keyboard navigation */
.close-btn:focus-visible,
.social-btn:focus-visible,
.form-input:focus-visible,
.password-toggle:focus-visible,
.checkbox-label:focus-visible,
.forgot-link:focus-visible,
.auth-submit-btn:focus-visible,
.switch-btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
</style>
