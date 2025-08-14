<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Sidebar Navigation -->
      <aside class="profile-sidebar">
        <div class="profile-header">
          <div class="avatar-section">
            <div class="user-avatar">
              <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="Profile Avatar">
              <div v-else class="avatar-placeholder">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ userProfile.name || 'Beauty Enthusiast' }}</h3>
              <p class="user-email">{{ userProfile.email || 'user@example.com' }}</p>
              <div class="member-badge">
                <i class="fas fa-crown"></i>
                <span>Premium Member</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav class="profile-navigation">
          <a 
            v-for="item in navigationItems" 
            :key="item.id"
            @click="activeSection = item.id"
            :class="['nav-item', { active: activeSection === item.id }]"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <button @click="logout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="profile-content">
        <!-- Personal Feed Section -->
        <div v-if="activeSection === 'feed'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-star"></i>
              Your Personalized Feed
            </h2>
            <p class="section-description">
              Curated products based on your preferences, skin profile, and purchase history
            </p>
          </div>
          
          <!-- AI Recommendations -->
          <div class="feed-section">
            <h3 class="feed-section-title">
              <i class="fas fa-magic"></i>
              AI-Powered Recommendations
            </h3>
            <div class="products-grid">
              <ProductCard 
                v-for="product in personalizedRecommendations" 
                :key="product.id"
                :product="product"
                :show-reason="true"
              />
            </div>
          </div>

          <!-- Recently Viewed -->
          <div class="feed-section" v-if="recentlyViewedItems.length">
            <h3 class="feed-section-title">
              <i class="fas fa-clock"></i>
              Recently Viewed
            </h3>
            <div class="recently-viewed-carousel">
              <div 
                v-for="item in recentlyViewedItems.slice(0, 6)" 
                :key="item.id"
                class="recently-viewed-item"
                @click="$router.push(`/product/${item.id}`)"
              >
                <img :src="item.image" :alt="item.name">
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p class="price">${{ item.price }}</p>
                  <span class="viewed-time">{{ formatViewTime(item.viewedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Based on Your Skin Type -->
          <div class="feed-section" v-if="userProfile.skinType">
            <h3 class="feed-section-title">
              <i class="fas fa-leaf"></i>
              Perfect for {{ userProfile.skinType }} Skin
            </h3>
            <div class="products-grid">
              <ProductCard 
                v-for="product in skinTypeRecommendations" 
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </div>

        <!-- Customer Support Section -->
        <div v-if="activeSection === 'customer-support'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-headset"></i>
              Customer Support
            </h2>
            <p class="section-description">
              Get help with your beauty questions, orders, and account issues
            </p>
          </div>

          <div class="support-options">
            <div class="support-card" @click="activeSection = 'faq-help'">
              <div class="support-icon">
                <i class="fas fa-question-circle"></i>
              </div>
              <div class="support-content">
                <h3>FAQ & Help Center</h3>
                <p>Find quick answers to common questions about beauty products, orders, and more</p>
                <div class="support-stats">
                  <span>📚 50+ Articles</span>
                  <span>⚡ Instant Search</span>
                </div>
              </div>
              <i class="fas fa-chevron-right support-arrow"></i>
            </div>

            <div class="support-card" @click="activeSection = 'ticketing'">
              <div class="support-icon">
                <i class="fas fa-ticket-alt"></i>
              </div>
              <div class="support-content">
                <h3>Submit a Ticket</h3>
                <p>Need personalized help? Create a support ticket and our beauty experts will assist you</p>
                <div class="support-stats">
                  <span>🎫 Track Status</span>
                  <span>📎 Attach Images</span>
                </div>
              </div>
              <i class="fas fa-chevron-right support-arrow"></i>
            </div>

            <div class="support-card" @click="openAIChat">
              <div class="support-icon">
                <i class="fas fa-robot"></i>
              </div>
              <div class="support-content">
                <h3>AI Beauty Assistant</h3>
                <p>Chat with our AI assistant for instant beauty advice and product recommendations</p>
                <div class="support-stats">
                  <span>🤖 24/7 Available</span>
                  <span>✨ Beauty Expert</span>
                </div>
              </div>
              <i class="fas fa-chevron-right support-arrow"></i>
            </div>
          </div>

          <div class="quick-help">
            <h3>Quick Help</h3>
            <div class="quick-help-grid">
              <div class="quick-help-item">
                <i class="fas fa-shipping-fast"></i>
                <span>Track Order</span>
              </div>
              <div class="quick-help-item">
                <i class="fas fa-undo"></i>
                <span>Return Item</span>
              </div>
              <div class="quick-help-item">
                <i class="fas fa-credit-card"></i>
                <span>Payment Help</span>
              </div>
              <div class="quick-help-item">
                <i class="fas fa-user-circle"></i>
                <span>Account Issues</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div v-if="activeSection === 'notifications'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-bell"></i>
              Notifications
            </h2>
          </div>
          
          <div class="notifications-container">
            <!-- Notification Settings -->
            <div class="notification-settings">
              <h3>Notification Preferences</h3>
              <div class="setting-group">
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.orderUpdates"
                      @change="updateNotificationSettings"
                    >
                    <span class="checkmark"></span>
                    Order Updates
                  </label>
                  <p class="setting-description">Get notified about order status changes</p>
                </div>
                
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.promotions"
                      @change="updateNotificationSettings"
                    >
                    <span class="checkmark"></span>
                    Promotions & Offers
                  </label>
                  <p class="setting-description">Receive exclusive deals and discounts</p>
                </div>
                
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.newProducts"
                      @change="updateNotificationSettings"
                    >
                    <span class="checkmark"></span>
                    New Product Launches
                  </label>
                  <p class="setting-description">Be first to know about new arrivals</p>
                </div>
                
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.stockAlerts"
                      @change="updateNotificationSettings"
                    >
                    <span class="checkmark"></span>
                    Stock Alerts
                  </label>
                  <p class="setting-description">Get notified when wishlist items are back in stock</p>
                </div>
              </div>
            </div>

            <!-- Recent Notifications -->
            <div class="recent-notifications">
              <h3>Recent Notifications</h3>
              <div class="notification-list">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  :class="['notification-item', notification.type, { unread: !notification.read }]"
                >
                  <div class="notification-icon">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <h4>{{ notification.title }}</h4>
                    <p>{{ notification.message }}</p>
                    <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                  </div>
                  <button 
                    v-if="!notification.read"
                    @click="markAsRead(notification.id)"
                    class="mark-read-btn"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Language Settings -->
        <div v-if="activeSection === 'language'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-globe"></i>
              Language & Region
            </h2>
          </div>
          
          <div class="language-settings">
            <div class="setting-group">
              <h3>Language Preference</h3>
              <div class="language-options">
                <div 
                  v-for="language in availableLanguages" 
                  :key="language.code"
                  :class="['language-option', { active: selectedLanguage === language.code }]"
                  @click="changeLanguage(language.code)"
                >
                  <div class="language-flag">
                    <img :src="language.flag" :alt="language.name">
                  </div>
                  <div class="language-info">
                    <h4>{{ language.name }}</h4>
                    <p>{{ language.nativeName }}</p>
                  </div>
                  <div class="language-check" v-if="selectedLanguage === language.code">
                    <i class="fas fa-check"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="setting-group">
              <h3>Currency & Region</h3>
              <div class="form-group">
                <label>Currency</label>
                <select v-model="selectedCurrency" @change="updateCurrency" class="form-select">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Country/Region</label>
                <select v-model="selectedCountry" @change="updateCountry" class="form-select">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy & Terms -->
        <div v-if="activeSection === 'privacy'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-shield-alt"></i>
              Privacy & Terms
            </h2>
          </div>
          
          <div class="privacy-content">
            <div class="privacy-section">
              <h3>Data & Privacy Controls</h3>
              <div class="privacy-controls">
                <div class="control-item">
                  <div class="control-info">
                    <h4>Personalization</h4>
                    <p>Allow us to personalize your experience based on your activity</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="privacySettings.personalization">
                    <span class="slider"></span>
                  </label>
                </div>
                
                <div class="control-item">
                  <div class="control-info">
                    <h4>Analytics</h4>
                    <p>Help us improve our service by sharing anonymous usage data</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="privacySettings.analytics">
                    <span class="slider"></span>
                  </label>
                </div>
                
                <div class="control-item">
                  <div class="control-info">
                    <h4>Marketing Communications</h4>
                    <p>Receive personalized marketing emails and recommendations</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="privacySettings.marketing">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="legal-links">
              <h3>Legal Information</h3>
              <div class="link-grid">
                <a href="/privacy-policy" class="legal-link">
                  <i class="fas fa-file-alt"></i>
                  <span>Privacy Policy</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="/terms-of-service" class="legal-link">
                  <i class="fas fa-gavel"></i>
                  <span>Terms of Service</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="/cookie-policy" class="legal-link">
                  <i class="fas fa-cookie-bite"></i>
                  <span>Cookie Policy</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="/data-request" class="legal-link">
                  <i class="fas fa-download"></i>
                  <span>Download My Data</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Deletion -->
        <div v-if="activeSection === 'account-deletion'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-user-times"></i>
              Account Deletion
            </h2>
          </div>
          
          <div class="deletion-content">
            <div class="warning-card">
              <div class="warning-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="warning-text">
                <h3>This action cannot be undone</h3>
                <p>Deleting your account will permanently remove all your data, including:</p>
                <ul>
                  <li>Order history and tracking information</li>
                  <li>Saved addresses and payment methods</li>
                  <li>Wishlist and recently viewed items</li>
                  <li>Beauty profile and quiz results</li>
                  <li>Reviews and ratings</li>
                </ul>
              </div>
            </div>
            
            <div class="deletion-form" v-if="!deletionRequested">
              <h3>Request Account Deletion</h3>
              <form @submit.prevent="requestAccountDeletion">
                <div class="form-group">
                  <label>Reason for leaving (optional)</label>
                  <select v-model="deletionReason" class="form-select">
                    <option value="">Select a reason</option>
                    <option value="privacy">Privacy concerns</option>
                    <option value="not-useful">Not useful anymore</option>
                    <option value="too-many-emails">Too many emails</option>
                    <option value="found-alternative">Found an alternative</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div class="form-group" v-if="deletionReason === 'other'">
                  <label>Please specify</label>
                  <textarea 
                    v-model="deletionComment" 
                    class="form-textarea"
                    placeholder="Tell us more about your reason for leaving..."
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="confirmDeletion" required>
                    <span class="checkmark"></span>
                    I understand that this action cannot be undone
                  </label>
                </div>
                
                <div class="form-actions">
                  <button type="button" @click="activeSection = 'feed'" class="btn btn-outline">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-danger"
                    :disabled="!confirmDeletion"
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
            
            <div class="deletion-requested" v-else>
              <div class="success-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <h3>Deletion Request Submitted</h3>
              <p>We've received your account deletion request. Your account will be deleted within 30 days. You can cancel this request anytime before the deletion date.</p>
              <button @click="cancelDeletionRequest" class="btn btn-primary">
                Cancel Deletion Request
              </button>
            </div>
          </div>
        </div>

        <!-- Refund History -->
        <div v-if="activeSection === 'refunds'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-money-bill-wave"></i>
              Refund History
            </h2>
          </div>
          
          <div class="refunds-container">
            <div class="refunds-summary">
              <div class="summary-card">
                <h3>Total Refunds</h3>
                <div class="summary-value">${{ totalRefunds }}</div>
              </div>
              <div class="summary-card">
                <h3>This Year</h3>
                <div class="summary-value">${{ yearlyRefunds }}</div>
              </div>
              <div class="summary-card">
                <h3>Pending</h3>
                <div class="summary-value">${{ pendingRefunds }}</div>
              </div>
            </div>
            
            <div class="refunds-list">
              <div 
                v-for="refund in refundHistory" 
                :key="refund.id"
                class="refund-item"
              >
                <div class="refund-header">
                  <div class="refund-info">
                    <h4>Order #{{ refund.orderId }}</h4>
                    <span class="refund-date">{{ formatDate(refund.date) }}</span>
                  </div>
                  <div class="refund-amount">${{ refund.amount }}</div>
                  <div :class="['refund-status', refund.status.toLowerCase()]">
                    {{ refund.status }}
                  </div>
                </div>
                
                <div class="refund-details">
                  <p><strong>Reason:</strong> {{ refund.reason }}</p>
                  <p><strong>Method:</strong> {{ refund.method }}</p>
                  <p v-if="refund.notes"><strong>Notes:</strong> {{ refund.notes }}</p>
                </div>
                
                <div class="refund-actions">
                  <button @click="viewRefundDetails(refund)" class="btn btn-outline btn-sm">
                    View Details
                  </button>
                  <button 
                    v-if="refund.status === 'Pending'"
                    @click="contactSupport(refund)"
                    class="btn btn-outline btn-sm"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Management -->
        <div v-if="activeSection === 'delivery'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-truck"></i>
              Delivery Management
            </h2>
          </div>
          
          <div class="delivery-container">
            <div class="active-orders">
              <h3>Active Orders</h3>
              <div 
                v-for="order in activeOrders" 
                :key="order.id"
                class="order-card"
              >
                <div class="order-header">
                  <div class="order-info">
                    <h4>Order #{{ order.id }}</h4>
                    <span class="order-date">Placed {{ formatDate(order.date) }}</span>
                  </div>
                  <div :class="['order-status', order.status.toLowerCase().replace(' ', '-')]">
                    {{ order.status }}
                  </div>
                </div>
                
                <div class="delivery-info">
                  <div class="delivery-timeline">
                    <div class="timeline-item">
                      <strong>Estimated Delivery:</strong>
                      <span>{{ formatDate(order.estimatedDelivery) }}</span>
                    </div>
                    <div class="timeline-item">
                      <strong>Delivery Address:</strong>
                      <span>{{ order.address }}</span>
                    </div>
                  </div>
                  
                  <div class="delivery-actions" v-if="order.canReschedule">
                    <button @click="rescheduleDelivery(order)" class="btn btn-outline btn-sm">
                      <i class="fas fa-calendar-alt"></i>
                      Reschedule Delivery
                    </button>
                    <button @click="trackOrder(order)" class="btn btn-primary btn-sm">
                      <i class="fas fa-map-marker-alt"></i>
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Delivery Preferences -->
            <div class="delivery-preferences">
              <h3>Delivery Preferences</h3>
              <div class="preference-group">
                <div class="preference-item">
                  <label class="preference-label">
                    <input 
                      type="checkbox" 
                      v-model="deliveryPreferences.contactless"
                    >
                    <span class="checkmark"></span>
                    Contactless Delivery
                  </label>
                </div>
                
                <div class="preference-item">
                  <label class="preference-label">
                    <input 
                      type="checkbox" 
                      v-model="deliveryPreferences.leaveAtDoor"
                    >
                    <span class="checkmark"></span>
                    Leave at Door
                  </label>
                </div>
                
                <div class="preference-item">
                  <label class="preference-label">
                    <input 
                      type="checkbox" 
                      v-model="deliveryPreferences.callOnArrival"
                    >
                    <span class="checkmark"></span>
                    Call on Arrival
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label>Preferred Delivery Time</label>
                <select v-model="deliveryPreferences.preferredTime" class="form-select">
                  <option value="">No preference</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                  <option value="evening">Evening (6 PM - 9 PM)</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Special Instructions</label>
                <textarea 
                  v-model="deliveryPreferences.instructions"
                  class="form-textarea"
                  placeholder="Any special delivery instructions..."
                ></textarea>
              </div>
              
              <button @click="saveDeliveryPreferences" class="btn btn-primary">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Reschedule Delivery Modal -->
    <div v-if="showRescheduleModal" class="modal-overlay" @click="closeRescheduleModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Reschedule Delivery</h3>
          <button @click="closeRescheduleModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="order-summary">
            <h4>Order #{{ selectedOrder?.id }}</h4>
            <p>Current delivery date: {{ formatDate(selectedOrder?.estimatedDelivery) }}</p>
          </div>
          
          <div class="calendar-section">
            <h4>Select New Date</h4>
            <div class="date-options">
              <div 
                v-for="date in availableDates" 
                :key="date.value"
                :class="['date-option', { selected: newDeliveryDate === date.value }]"
                @click="newDeliveryDate = date.value"
              >
                <div class="date-day">{{ date.day }}</div>
                <div class="date-date">{{ date.date }}</div>
              </div>
            </div>
          </div>
          
          <div class="time-section">
            <h4>Select Time Slot</h4>
            <div class="time-options">
              <div 
                v-for="time in availableTimeSlots" 
                :key="time.value"
                :class="['time-option', { selected: newDeliveryTime === time.value }]"
                @click="newDeliveryTime = time.value"
              >
                {{ time.label }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeRescheduleModal" class="btn btn-outline">
            Cancel
          </button>
          <button 
            @click="confirmReschedule" 
            class="btn btn-primary"
            :disabled="!newDeliveryDate || !newDeliveryTime"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProductCard from '../components/product/ProductCard.vue';

export default {
  name: 'Profile',
  components: {
    ProductCard
  },
  data() {
    return {
      activeSection: 'feed',
      deletionRequested: false,
      deletionReason: '',
      deletionComment: '',
      confirmDeletion: false,
      showRescheduleModal: false,
      selectedOrder: null,
      newDeliveryDate: '',
      newDeliveryTime: '',
      selectedLanguage: 'en',
      selectedCurrency: 'USD',
      selectedCountry: 'US',
      notificationSettings: {
        orderUpdates: true,
        promotions: true,
        newProducts: false,
        stockAlerts: true
      },
      privacySettings: {
        personalization: true,
        analytics: true,
        marketing: false
      },
      deliveryPreferences: {
        contactless: false,
        leaveAtDoor: false,
        callOnArrival: true,
        preferredTime: '',
        instructions: ''
      },
      navigationItems: [
        { id: 'feed', label: 'Personal Feed', icon: 'fas fa-star' },
        { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell', badge: '3' },
        { id: 'customer-support', label: 'Customer Support', icon: 'fas fa-headset' },
        { id: 'language', label: 'Language & Region', icon: 'fas fa-globe' },
        { id: 'privacy', label: 'Privacy & Terms', icon: 'fas fa-shield-alt' },
        { id: 'account-deletion', label: 'Account Deletion', icon: 'fas fa-user-times' },
        { id: 'refunds', label: 'Refund History', icon: 'fas fa-money-bill-wave' },
        { id: 'delivery', label: 'Delivery Management', icon: 'fas fa-truck' }
      ],
      availableLanguages: [
        { code: 'en', name: 'English', nativeName: 'English', flag: 'https://flagcdn.com/w20/us.png' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'https://flagcdn.com/w20/es.png' },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: 'https://flagcdn.com/w20/it.png' }
      ],
      notifications: [
        {
          id: 1,
          type: 'order',
          title: 'Order Shipped',
          message: 'Your order #12345 has been shipped and is on its way!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false
        },
        {
          id: 2,
          type: 'promotion',
          title: 'Special Offer',
          message: '20% off on all skincare products this weekend!',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: false
        },
        {
          id: 3,
          type: 'stock',
          title: 'Back in Stock',
          message: 'The Vitamin C Serum from your wishlist is now available!',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: true
        }
      ],
      refundHistory: [
        {
          id: 1,
          orderId: '12345',
          amount: 45.99,
          status: 'Completed',
          reason: 'Product damaged',
          method: 'Original payment method',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          notes: 'Refund processed successfully'
        },
        {
          id: 2,
          orderId: '12340',
          amount: 29.99,
          status: 'Pending',
          reason: 'Wrong item received',
          method: 'Store credit',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          notes: 'Processing refund...'
        }
      ],
      activeOrders: [
        {
          id: '12346',
          status: 'In Transit',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          address: '123 Beauty St, Glamour City, GC 12345',
          canReschedule: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters('user', [
      'userProfile', 
      'recentlyViewedItems', 
      'personalizedProducts'
    ]),
    ...mapGetters('products', ['allProducts']),
    personalizedRecommendations() {
      // Enhanced AI-powered recommendations based on multiple factors
      if (!this.allProducts || !Array.isArray(this.allProducts)) {
        return [];
      }

      const userProfile = this.userProfile || {};
      const preferences = userProfile.preferences || { brands: [], categories: [] };

      return this.allProducts.filter(product => {
        // Factor in skin type, preferences, and purchase history
        const skinTypeMatch = userProfile.skinType &&
          product.suitableFor?.includes(userProfile.skinType);
        const brandPreference = preferences.brands.length === 0 ||
          preferences.brands.includes(product.brand);
        const categoryPreference = preferences.categories.length === 0 ||
          preferences.categories.includes(product.category);

        return skinTypeMatch || brandPreference || categoryPreference;
      }).slice(0, 8);
    },
    skinTypeRecommendations() {
      const userProfile = this.userProfile || {};
      if (!userProfile.skinType || !this.allProducts || !Array.isArray(this.allProducts)) return [];
      return this.allProducts.filter(product =>
        product.suitableFor?.includes(userProfile.skinType)
      ).slice(0, 6);
    },
    totalRefunds() {
      return this.refundHistory.reduce((sum, refund) => sum + refund.amount, 0).toFixed(2);
    },
    yearlyRefunds() {
      const thisYear = new Date().getFullYear();
      return this.refundHistory
        .filter(refund => refund.date.getFullYear() === thisYear)
        .reduce((sum, refund) => sum + refund.amount, 0)
        .toFixed(2);
    },
    pendingRefunds() {
      return this.refundHistory
        .filter(refund => refund.status === 'Pending')
        .reduce((sum, refund) => sum + refund.amount, 0)
        .toFixed(2);
    },
    availableDates() {
      const dates = [];
      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
          value: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          date: date.getDate()
        });
      }
      return dates;
    },
    availableTimeSlots() {
      return [
        { value: 'morning', label: '9:00 AM - 12:00 PM' },
        { value: 'afternoon', label: '12:00 PM - 6:00 PM' },
        { value: 'evening', label: '6:00 PM - 9:00 PM' }
      ];
    }
  },
  mounted() {
    // Check for settings tab in query params
    if (this.$route.query.tab === 'settings') {
      this.activeSection = 'notifications'; // Map settings to notifications
    }
  },
  methods: {
    ...mapActions('user', ['updateNotificationSettings']),
    ...mapActions('ui', ['showNotification']),
    formatViewTime(timestamp) {
      const now = new Date();
      const viewed = new Date(timestamp);
      const diffMs = now - viewed;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHours > 0) return `${diffHours}h ago`;
      return 'Just now';
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getNotificationIcon(type) {
      const icons = {
        order: 'fas fa-box',
        promotion: 'fas fa-tag',
        stock: 'fas fa-boxes',
        system: 'fas fa-cog'
      };
      return icons[type] || 'fas fa-bell';
    },
    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    changeLanguage(languageCode) {
      this.selectedLanguage = languageCode;
      this.showNotification({
        type: 'success',
        message: 'Language updated successfully'
      });
    },
    updateCurrency() {
      this.showNotification({
        type: 'success',
        message: 'Currency updated successfully'
      });
    },
    updateCountry() {
      this.showNotification({
        type: 'success',
        message: 'Country/Region updated successfully'
      });
    },
    requestAccountDeletion() {
      this.deletionRequested = true;
      this.showNotification({
        type: 'info',
        message: 'Account deletion request submitted'
      });
    },
    cancelDeletionRequest() {
      this.deletionRequested = false;
      this.showNotification({
        type: 'success',
        message: 'Account deletion request cancelled'
      });
    },
    rescheduleDelivery(order) {
      this.selectedOrder = order;
      this.showRescheduleModal = true;
    },
    closeRescheduleModal() {
      this.showRescheduleModal = false;
      this.selectedOrder = null;
      this.newDeliveryDate = '';
      this.newDeliveryTime = '';
    },
    confirmReschedule() {
      this.showNotification({
        type: 'success',
        message: 'Delivery rescheduled successfully'
      });
      this.closeRescheduleModal();
    },
    trackOrder(order) {
      this.$router.push(`/order-tracking/${order.id}`);
    },
    saveDeliveryPreferences() {
      this.showNotification({
        type: 'success',
        message: 'Delivery preferences saved'
      });
    },
    viewRefundDetails(refund) {
      // Implementation for viewing refund details
      console.log('View refund details:', refund);
    },
    contactSupport(refund) {
      // Implementation for contacting support
      console.log('Contact support for refund:', refund);
    },
    logout() {
      // Implementation for logout
      this.showNotification({
        type: 'success',
        message: 'Logged out successfully'
      });
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--gray-50);
}

.profile-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  max-width: 1400px;
  margin: 0 auto;
  gap: 32px;
  padding: 32px 20px;
}

/* Sidebar Styles */
.profile-sidebar {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  height: fit-content;
  position: sticky;
  top: 32px;
}

.profile-header {
  padding: 32px 24px 24px;
  border-bottom: 1px solid var(--gray-200);
}

.avatar-section {
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 4px solid var(--primary-100);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 32px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.user-email {
  color: var(--gray-600);
  margin: 0 0 12px;
}

.member-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.profile-navigation {
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: var(--gray-700);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.nav-item:hover {
  background: var(--gray-50);
  color: var(--primary-600);
}

.nav-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  border-left-color: var(--primary-500);
  font-weight: 600;
}

.nav-badge {
  background: var(--primary-500);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
}

.sidebar-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid var(--gray-200);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  color: var(--gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  border-color: var(--red-500);
  color: var(--red-500);
  background: var(--red-50);
}

/* Main Content Styles */
.profile-content {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  min-height: 600px;
}

.content-section {
  padding: 32px;
}

.section-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--gray-200);
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-description {
  color: var(--gray-600);
  font-size: 16px;
  margin: 0;
}

/* Feed Styles */
.feed-section {
  margin-bottom: 48px;
}

.feed-section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.recently-viewed-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.recently-viewed-item {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recently-viewed-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.recently-viewed-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.item-info {
  padding: 12px;
}

.item-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-info .price {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-600);
  margin: 0 0 4px;
}

.viewed-time {
  font-size: 12px;
  color: var(--gray-500);
}

/* Notifications Styles */
.notifications-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.notification-settings,
.recent-notifications {
  background: var(--gray-50);
  padding: 24px;
  border-radius: 12px;
}

.setting-group,
.preference-group {
  margin-top: 16px;
}

.setting-item,
.preference-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--gray-200);
}

.setting-item:last-child,
.preference-item:last-child {
  border-bottom: none;
}

.setting-label,
.preference-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
}

.setting-label input[type="checkbox"],
.preference-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.setting-label input:checked + .checkmark,
.preference-label input:checked + .checkmark {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.setting-label input:checked + .checkmark::after,
.preference-label input:checked + .checkmark::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.setting-description {
  color: var(--gray-600);
  font-size: 14px;
  margin: 4px 0 0;
}

.notification-list {
  margin-top: 16px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
}

.notification-item.unread {
  border-left: 4px solid var(--primary-500);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.notification-item.order .notification-icon {
  background: var(--blue-500);
}

.notification-item.promotion .notification-icon {
  background: var(--green-500);
}

.notification-item.stock .notification-icon {
  background: var(--orange-500);
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.notification-content p {
  color: var(--gray-600);
  margin: 0 0 8px;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: var(--gray-500);
}

.mark-read-btn {
  background: var(--primary-100);
  border: none;
  color: var(--primary-600);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mark-read-btn:hover {
  background: var(--primary-200);
}

/* Language Settings */
.language-settings {
  max-width: 800px;
}

.language-options {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-option:hover {
  border-color: var(--primary-300);
}

.language-option.active {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.language-flag img {
  width: 32px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
}

.language-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 2px;
  color: var(--gray-800);
}

.language-info p {
  color: var(--gray-600);
  margin: 0;
  font-size: 14px;
}

.language-check {
  margin-left: auto;
  color: var(--primary-500);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--gray-700);
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-500);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* Privacy Settings */
.privacy-content {
  max-width: 800px;
}

.privacy-controls {
  margin-top: 16px;
}

.control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid var(--gray-200);
}

.control-item:last-child {
  border-bottom: none;
}

.control-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.control-info p {
  color: var(--gray-600);
  margin: 0;
  font-size: 14px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: 0.2s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-500);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.legal-links {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--gray-200);
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.legal-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  text-decoration: none;
  color: var(--gray-700);
  transition: all 0.2s ease;
}

.legal-link:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
  color: var(--primary-600);
}

.legal-link i:last-child {
  margin-left: auto;
  font-size: 12px;
}

/* Account Deletion */
.deletion-content {
  max-width: 600px;
}

.warning-card {
  display: flex;
  gap: 16px;
  background: var(--red-50);
  border: 1px solid var(--red-200);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.warning-icon {
  color: var(--red-500);
  font-size: 24px;
  flex-shrink: 0;
}

.warning-text h3 {
  color: var(--red-700);
  margin: 0 0 12px;
}

.warning-text p {
  color: var(--red-600);
  margin: 0 0 12px;
}

.warning-text ul {
  color: var(--red-600);
  margin: 0;
  padding-left: 20px;
}

.warning-text li {
  margin-bottom: 4px;
}

.deletion-form h3 {
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.deletion-requested {
  text-align: center;
  padding: 32px;
}

.success-icon {
  color: var(--green-500);
  font-size: 48px;
  margin-bottom: 16px;
}

.deletion-requested h3 {
  color: var(--gray-800);
  margin-bottom: 16px;
}

.deletion-requested p {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 24px;
}

/* Refunds */
.refunds-container {
  max-width: 1000px;
}

.refunds-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.summary-card {
  background: var(--gray-50);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.summary-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-600);
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-800);
}

.refunds-list {
  margin-top: 24px;
}

.refund-item {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  background: white;
}

.refund-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.refund-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.refund-date {
  font-size: 14px;
  color: var(--gray-600);
}

.refund-amount {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
}

.refund-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.refund-status.completed {
  background: var(--green-100);
  color: var(--green-700);
}

.refund-status.pending {
  background: var(--orange-100);
  color: var(--orange-700);
}

.refund-details {
  margin-bottom: 16px;
}

.refund-details p {
  margin: 8px 0;
  color: var(--gray-600);
}

.refund-actions {
  display: flex;
  gap: 12px;
}

/* Delivery Management */
.delivery-container {
  max-width: 1000px;
}

.active-orders {
  margin-bottom: 32px;
}

.order-card {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  background: white;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.order-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.order-date {
  font-size: 14px;
  color: var(--gray-600);
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.order-status.in-transit {
  background: var(--blue-100);
  color: var(--blue-700);
}

.delivery-info {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: end;
}

.timeline-item {
  margin-bottom: 8px;
}

.timeline-item strong {
  display: inline-block;
  width: 140px;
  color: var(--gray-700);
}

.delivery-actions {
  display: flex;
  gap: 12px;
}

.delivery-preferences {
  background: var(--gray-50);
  padding: 24px;
  border-radius: 12px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
}

.modal-header h3 {
  margin: 0;
  color: var(--gray-800);
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--gray-500);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.order-summary {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--gray-50);
  border-radius: 8px;
}

.order-summary h4 {
  margin: 0 0 4px;
  color: var(--gray-800);
}

.calendar-section,
.time-section {
  margin-bottom: 24px;
}

.calendar-section h4,
.time-section h4 {
  margin: 0 0 16px;
  color: var(--gray-800);
}

.date-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
}

.date-option {
  text-align: center;
  padding: 12px 8px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-option:hover {
  border-color: var(--primary-300);
}

.date-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.date-day {
  font-size: 12px;
  color: var(--gray-600);
  margin-bottom: 4px;
}

.date-date {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
}

.time-options {
  display: grid;
  gap: 12px;
}

.time-option {
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.time-option:hover {
  border-color: var(--primary-300);
}

.time-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

/* Button Styles */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-600);
}

.btn-outline {
  background: white;
  color: var(--gray-700);
  border: 2px solid var(--gray-300);
}

.btn-outline:hover {
  border-color: var(--primary-500);
  color: var(--primary-600);
}

.btn-danger {
  background: var(--red-500);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: var(--red-600);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .profile-sidebar {
    position: static;
  }
  
  .notifications-container {
    grid-template-columns: 1fr;
  }
  
  .delivery-info {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .delivery-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
  
  .content-section {
    padding: 24px 16px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .recently-viewed-carousel {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .refunds-summary {
    grid-template-columns: 1fr;
  }
  
  .refund-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .form-actions,
  .refund-actions,
  .delivery-actions {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .date-options {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 24px;
  }
  
  .feed-section-title {
    font-size: 18px;
  }
  
  .date-options {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
