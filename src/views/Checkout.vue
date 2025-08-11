<template>
  <div class="checkout-page">
    <!-- Progress Steps -->
    <div class="checkout-progress">
      <div class="market-container">
        <div class="progress-steps">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            :class="['progress-step', { 
              active: currentStep === index + 1, 
              completed: currentStep > index + 1 
            }]"
          >
            <div class="step-circle">
              <i v-if="currentStep > index + 1" class="fas fa-check"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-info">
              <span class="step-title">{{ step.title }}</span>
              <span class="step-description">{{ step.description }}</span>
            </div>
            <div v-if="index < steps.length - 1" class="step-connector"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="checkout-content">
      <div class="market-container">
        <div class="checkout-layout">
          <!-- Main Content -->
          <div class="checkout-main">
            <!-- Step 1: Shipping Address -->
            <div v-if="currentStep === 1" class="checkout-section">
              <div class="section-header">
                <h2 class="section-title">
                  <i class="fas fa-map-marker-alt"></i>
                  Shipping Address
                </h2>
                <p class="section-description">Choose where your beauty essentials should be delivered</p>
              </div>

              <!-- Saved Addresses -->
              <div v-if="savedAddresses.length > 0" class="address-selection">
                <h3 class="subsection-title">Saved Addresses</h3>
                <div class="addresses-grid">
                  <div 
                    v-for="address in savedAddresses" 
                    :key="address.id"
                    :class="['address-card', { selected: selectedAddress?.id === address.id }]"
                    @click="selectAddress(address)"
                  >
                    <div class="address-header">
                      <div class="address-type-badge" :class="address.type.toLowerCase()">
                        <i :class="getAddressIcon(address.type)"></i>
                        <span>{{ address.type }}</span>
                      </div>
                      <button @click.stop="editAddress(address)" class="edit-address-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                    
                    <div class="address-content">
                      <h4 class="recipient-name">{{ address.name }}</h4>
                      <p class="address-line">{{ address.street }}</p>
                      <p class="address-line">{{ address.city }}, {{ address.state }} {{ address.pincode }}</p>
                      <p class="phone-number">
                        <i class="fas fa-phone"></i>
                        {{ address.phone }}
                      </p>
                    </div>
                    
                    <div v-if="address.isDefault" class="default-indicator">
                      <i class="fas fa-star"></i>
                      <span>Default</span>
                    </div>
                  </div>

                  <!-- Add New Address Card -->
                  <div class="add-address-card" @click="showAddressModal = true">
                    <div class="add-address-content">
                      <div class="add-icon">
                        <i class="fas fa-plus"></i>
                      </div>
                      <h4>Add New Address</h4>
                      <p>Deliver to a different address</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Addresses State -->
              <div v-else class="no-addresses">
                <div class="empty-state">
                  <div class="empty-icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <h3>No saved addresses</h3>
                  <p>Add your first address to continue with checkout</p>
                  <button @click="showAddressModal = true" class="add-first-address-btn">
                    <i class="fas fa-plus"></i>
                    Add Address
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 2: Payment Method -->
            <div v-if="currentStep === 2" class="checkout-section">
              <div class="section-header">
                <h2 class="section-title">
                  <i class="fas fa-credit-card"></i>
                  Payment Method
                </h2>
                <p class="section-description">Choose your preferred payment option</p>
              </div>

              <!-- Payment Options -->
              <div class="payment-methods-grid">
                <!-- Credit/Debit Cards -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'card' }]" @click="selectPayment('card')">
                  <div class="payment-header">
                    <div class="payment-icon">
                      <i class="fas fa-credit-card"></i>
                    </div>
                    <h3>Credit/Debit Card</h3>
                    <div class="card-brands">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png" alt="American Express" />
                    </div>
                  </div>
                  <p class="payment-description">Safe and secure payment with your card</p>
                </div>

                <!-- UPI -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'upi' }]" @click="selectPayment('upi')">
                  <div class="payment-header">
                    <div class="payment-icon upi">
                      <i class="fas fa-qrcode"></i>
                    </div>
                    <h3>UPI</h3>
                    <div class="payment-brands">
                      <img src="https://logos-world.net/wp-content/uploads/2020/12/Paytm-Logo.png" alt="Paytm" />
                      <img src="https://logowik.com/content/uploads/images/phonepe6531.jpg" alt="PhonePe" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/200px-Google_Pay_Logo_%282020%29.svg.png" alt="Google Pay" />
                    </div>
                  </div>
                  <p class="payment-description">Fast & secure UPI payments</p>
                </div>

                <!-- Digital Wallets -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'wallet' }]" @click="selectPayment('wallet')">
                  <div class="payment-header">
                    <div class="payment-icon wallet">
                      <i class="fas fa-wallet"></i>
                    </div>
                    <h3>Digital Wallets</h3>
                    <div class="payment-brands">
                      <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png" alt="PayPal" />
                      <img src="https://developer.apple.com/assets/elements/badges/apple-pay-mark.svg" alt="Apple Pay" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/200px-Google_Pay_Logo_%282020%29.svg.png" alt="Google Pay" />
                    </div>
                  </div>
                  <p class="payment-description">Quick payment with your wallet</p>
                </div>

                <!-- Net Banking -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'netbanking' }]" @click="selectPayment('netbanking')">
                  <div class="payment-header">
                    <div class="payment-icon netbanking">
                      <i class="fas fa-university"></i>
                    </div>
                    <h3>Net Banking</h3>
                    <div class="payment-brands">
                      <span class="bank-text">HDFC</span>
                      <span class="bank-text">SBI</span>
                      <span class="bank-text">ICICI</span>
                    </div>
                  </div>
                  <p class="payment-description">Secure banking gateway</p>
                </div>
              </div>

              <!-- Payment Form -->
              <div v-if="selectedPayment" class="payment-form-section">
                <!-- Card Form -->
                <div v-if="selectedPayment === 'card'" class="payment-form">
                  <h3 class="form-title">Card Details</h3>
                  <div class="card-form">
                    <div class="form-group">
                      <label>Card Number</label>
                      <div class="card-input-wrapper">
                        <input 
                          type="text" 
                          v-model="cardDetails.number" 
                          placeholder="1234 5678 9012 3456"
                          @input="formatCardNumber"
                          class="card-number-input"
                        />
                        <div class="detected-card-brand">
                          <i :class="getCardBrandIcon(cardDetails.number)"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label>Expiry Date</label>
                        <input 
                          type="text" 
                          v-model="cardDetails.expiry" 
                          placeholder="MM/YY"
                          @input="formatExpiry"
                        />
                      </div>
                      <div class="form-group">
                        <label>CVV</label>
                        <input 
                          type="password" 
                          v-model="cardDetails.cvv" 
                          placeholder="123"
                          maxlength="4"
                        />
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label>Cardholder Name</label>
                      <input 
                        type="text" 
                        v-model="cardDetails.name" 
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div class="save-card-option">
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="cardDetails.saveCard" />
                        <span class="checkmark"></span>
                        <span class="checkbox-text">
                          <i class="fas fa-shield-alt"></i>
                          Save this card for future purchases
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- UPI Form -->
                <div v-if="selectedPayment === 'upi'" class="payment-form">
                  <h3 class="form-title">UPI Payment</h3>
                  <div class="upi-form">
                    <div class="form-group">
                      <label>UPI ID</label>
                      <input 
                        type="text" 
                        v-model="upiDetails.id" 
                        placeholder="yourname@paytm"
                      />
                    </div>
                    
                    <div class="upi-apps-section">
                      <h4>Or choose your UPI app</h4>
                      <div class="upi-apps-grid">
                        <div 
                          v-for="app in upiApps" 
                          :key="app.id"
                          :class="['upi-app', { selected: selectedUpiApp === app.id }]"
                          @click="selectedUpiApp = app.id"
                        >
                          <img :src="app.logo" :alt="app.name" />
                          <span>{{ app.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Wallet Form -->
                <div v-if="selectedPayment === 'wallet'" class="payment-form">
                  <h3 class="form-title">Digital Wallet</h3>
                  <div class="wallet-options-grid">
                    <div 
                      v-for="wallet in walletOptions" 
                      :key="wallet.id"
                      :class="['wallet-option', { selected: selectedWallet === wallet.id }]"
                      @click="selectedWallet = wallet.id"
                    >
                      <img :src="wallet.logo" :alt="wallet.name" />
                      <span>{{ wallet.name }}</span>
                      <div class="wallet-features">
                        <span v-for="feature in wallet.features" :key="feature" class="feature-tag">
                          {{ feature }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Net Banking Form -->
                <div v-if="selectedPayment === 'netbanking'" class="payment-form">
                  <h3 class="form-title">Select Your Bank</h3>
                  <div class="banks-grid">
                    <div 
                      v-for="bank in banks" 
                      :key="bank.id"
                      :class="['bank-option', { selected: selectedBank === bank.id }]"
                      @click="selectedBank = bank.id"
                    >
                      <div class="bank-logo">
                        <img :src="bank.logo" :alt="bank.name" />
                      </div>
                      <span class="bank-name">{{ bank.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Discount Section -->
              <div class="discount-section">
                <h3 class="form-title">
                  <i class="fas fa-tags"></i>
                  Discounts & Coupons
                </h3>
                
                <div class="coupon-input-section">
                  <div class="coupon-input">
                    <input 
                      type="text" 
                      v-model="couponCode" 
                      placeholder="Enter coupon code"
                      :disabled="appliedCoupon"
                    />
                    <button 
                      @click="applyCoupon" 
                      :disabled="!couponCode || appliedCoupon"
                      class="apply-coupon-btn"
                    >
                      {{ appliedCoupon ? 'Applied' : 'Apply' }}
                    </button>
                  </div>
                  
                  <div v-if="appliedCoupon" class="applied-coupon">
                    <div class="coupon-success">
                      <i class="fas fa-check-circle"></i>
                      <span>{{ appliedCoupon.code }} applied • Save ₹{{ appliedCoupon.discount.toFixed(2) }}</span>
                    </div>
                    <button @click="removeCoupon" class="remove-coupon-btn">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                
                <div v-if="availableCoupons.length > 0 && !appliedCoupon" class="available-coupons">
                  <h4>Available Offers</h4>
                  <div class="coupons-grid">
                    <div 
                      v-for="coupon in availableCoupons" 
                      :key="coupon.code"
                      class="coupon-card"
                      @click="applyCouponCode(coupon.code)"
                    >
                      <div class="coupon-badge">
                        {{ coupon.discount }}% OFF
                      </div>
                      <div class="coupon-content">
                        <h5>{{ coupon.title }}</h5>
                        <p>{{ coupon.description }}</p>
                        <div class="coupon-code">
                          <span>Code: {{ coupon.code }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="checkout-navigation">
              <button 
                v-if="currentStep > 1" 
                @click="previousStep" 
                class="nav-btn secondary"
              >
                <i class="fas fa-arrow-left"></i>
                Back
              </button>
              
              <button 
                v-if="currentStep === 1" 
                @click="nextStep" 
                :disabled="!selectedAddress"
                class="nav-btn primary"
              >
                Continue to Payment
                <i class="fas fa-arrow-right"></i>
              </button>
              
              <button 
                v-if="currentStep === 2" 
                @click="placeOrder" 
                :disabled="!canPlaceOrder || isPlacingOrder"
                :class="['place-order-btn', { loading: isPlacingOrder }]"
              >
                <div class="btn-content">
                  <div v-if="isPlacingOrder" class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                  </div>
                  <div v-else class="btn-icon">
                    <i class="fas fa-lock"></i>
                  </div>
                  <div class="btn-text">
                    <span>{{ isPlacingOrder ? 'Processing...' : 'Place Order' }}</span>
                    <span class="btn-amount">₹{{ orderTotal.toFixed(2) }}</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="order-summary-sidebar">
            <div class="summary-card">
              <h3 class="summary-title">
                <i class="fas fa-receipt"></i>
                Order Summary
              </h3>
              
              <!-- Cart Items -->
              <div class="cart-items-preview">
                <div 
                  v-for="item in cartItems" 
                  :key="item.id"
                  class="cart-item-preview"
                >
                  <div class="item-image">
                    <img :src="item.image" :alt="item.name" />
                    <span class="quantity-badge">{{ item.quantity }}</span>
                  </div>
                  <div class="item-details">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.brand }}</p>
                    <span class="item-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Price Breakdown -->
              <div class="price-breakdown">
                <div class="price-row">
                  <span>Subtotal ({{ cartItemCount }} items)</span>
                  <span>₹{{ cartSubtotal.toFixed(2) }}</span>
                </div>
                
                <div class="price-row">
                  <span>Shipping</span>
                  <span v-if="shippingCost === 0" class="free-badge">FREE</span>
                  <span v-else>₹{{ shippingCost.toFixed(2) }}</span>
                </div>
                
                <div class="price-row">
                  <span>Tax ({{ taxRate }}%)</span>
                  <span>₹{{ taxAmount.toFixed(2) }}</span>
                </div>
                
                <div v-if="appliedCoupon" class="price-row discount">
                  <span>Discount ({{ appliedCoupon.code }})</span>
                  <span>-₹{{ appliedCoupon.discount.toFixed(2) }}</span>
                </div>
                
                <div class="price-divider"></div>
                
                <div class="price-row total">
                  <span>Total Amount</span>
                  <span>₹{{ orderTotal.toFixed(2) }}</span>
                </div>
              </div>
              
              <!-- Security Features -->
              <div class="security-features">
                <div class="security-item">
                  <i class="fas fa-shield-check"></i>
                  <span>100% Secure Payments</span>
                </div>
                <div class="security-item">
                  <i class="fas fa-undo-alt"></i>
                  <span>Easy Returns & Exchanges</span>
                </div>
                <div class="security-item">
                  <i class="fas fa-truck"></i>
                  <span>Free Shipping on ₹999+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Modal -->
    <div v-if="showAddressModal" class="modal-overlay" @click="closeAddressModal">
      <div class="modal-content address-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingAddress ? 'Edit Address' : 'Add New Address' }}</h3>
          <button @click="closeAddressModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveAddress" class="address-form">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  v-model="addressForm.name" 
                  placeholder="Enter your full name"
                  required 
                />
              </div>
              <div class="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  v-model="addressForm.phone" 
                  placeholder="+91 9876543210"
                  required 
                />
              </div>
            </div>
            
            <div class="form-group">
              <label>Street Address *</label>
              <input 
                type="text" 
                v-model="addressForm.street" 
                placeholder="House number, street name, area"
                required 
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>City *</label>
                <input 
                  type="text" 
                  v-model="addressForm.city" 
                  placeholder="Enter city"
                  required 
                />
              </div>
              <div class="form-group">
                <label>State *</label>
                <select v-model="addressForm.state" required>
                  <option value="">Select State</option>
                  <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Pincode *</label>
                <input 
                  type="text" 
                  v-model="addressForm.pincode" 
                  placeholder="123456"
                  pattern="[0-9]{6}"
                  required 
                />
              </div>
            </div>
            
            <div class="form-group">
              <label>Address Type</label>
              <div class="address-type-options">
                <label 
                  v-for="type in addressTypes" 
                  :key="type.value"
                  :class="['address-type-option', { selected: addressForm.type === type.value }]"
                  @click="addressForm.type = type.value"
                >
                  <i :class="type.icon"></i>
                  <span>{{ type.label }}</span>
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="addressForm.isDefault" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Set as default address</span>
              </label>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button @click="closeAddressModal" class="btn-secondary">Cancel</button>
          <button @click="saveAddress" :disabled="!isAddressFormValid" class="btn-primary">
            {{ editingAddress ? 'Update Address' : 'Save Address' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <Transition name="slide-up">
      <div v-if="showOrderSuccess" class="order-success-overlay">
        <div class="success-content">
          <div class="success-animation">
            <div class="checkmark-circle">
              <i class="fas fa-check"></i>
            </div>
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order #{{ orderNumber }} has been confirmed</p>
          <div class="success-actions">
            <button @click="goToOrders" class="btn-primary">View Orders</button>
            <button @click="continueShopping" class="btn-secondary">Continue Shopping</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Checkout',
  data() {
    return {
      currentStep: 1,
      showAddressModal: false,
      editingAddress: null,
      selectedAddress: null,
      selectedPayment: null,
      selectedUpiApp: null,
      selectedWallet: null,
      selectedBank: null,
      couponCode: '',
      appliedCoupon: null,
      isPlacingOrder: false,
      showOrderSuccess: false,
      orderNumber: '',
      
      // Form data
      addressForm: {
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home',
        isDefault: false
      },
      
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: '',
        saveCard: false
      },
      
      upiDetails: {
        id: ''
      },
      
      // Steps configuration
      steps: [
        {
          id: 1,
          title: 'Shipping',
          description: 'Address & delivery'
        },
        {
          id: 2,
          title: 'Payment',
          description: 'Secure checkout'
        }
      ],
      
      // Address data
      addressTypes: [
        { value: 'home', label: 'Home', icon: 'fas fa-home' },
        { value: 'work', label: 'Work', icon: 'fas fa-briefcase' },
        { value: 'other', label: 'Other', icon: 'fas fa-map-marker-alt' }
      ],
      
      states: [
        'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 'Haryana', 
        'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan', 
        'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
      ],
      
      savedAddresses: [
        {
          id: 1,
          name: 'Rumpa Samanta',
          phone: '+91 9876543210',
          street: '123 Beauty Lane, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          type: 'home',
          isDefault: true
        },
        {
          id: 2,
          name: 'Rumpa Samanta',
          phone: '+91 9876543210',
          street: '456 Corporate Plaza, Suite 200',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002',
          type: 'work',
          isDefault: false
        }
      ],
      
      // Payment data
      upiApps: [
        {
          id: 'paytm',
          name: 'Paytm',
          logo: 'https://logos-world.net/wp-content/uploads/2020/12/Paytm-Logo.png'
        },
        {
          id: 'phonepe',
          name: 'PhonePe',
          logo: 'https://logowik.com/content/uploads/images/phonepe6531.jpg'
        },
        {
          id: 'gpay',
          name: 'Google Pay',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/200px-Google_Pay_Logo_%282020%29.svg.png'
        }
      ],
      
      walletOptions: [
        {
          id: 'paypal',
          name: 'PayPal',
          logo: 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png',
          features: ['Buyer Protection', 'Fast Checkout']
        },
        {
          id: 'applepay',
          name: 'Apple Pay',
          logo: 'https://developer.apple.com/assets/elements/badges/apple-pay-mark.svg',
          features: ['Touch ID', 'Secure']
        },
        {
          id: 'googlepay',
          name: 'Google Pay',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/200px-Google_Pay_Logo_%282020%29.svg.png',
          features: ['Quick Pay', 'Rewards']
        }
      ],
      
      banks: [
        {
          id: 'hdfc',
          name: 'HDFC Bank',
          logo: 'https://via.placeholder.com/60x40/004C8F/FFFFFF?text=HDFC'
        },
        {
          id: 'sbi',
          name: 'State Bank of India',
          logo: 'https://via.placeholder.com/60x40/1F4E79/FFFFFF?text=SBI'
        },
        {
          id: 'icici',
          name: 'ICICI Bank',
          logo: 'https://via.placeholder.com/60x40/EE7203/FFFFFF?text=ICICI'
        },
        {
          id: 'axis',
          name: 'Axis Bank',
          logo: 'https://via.placeholder.com/60x40/8B1538/FFFFFF?text=AXIS'
        }
      ],
      
      // Coupons
      availableCoupons: [
        {
          code: 'BEAUTY20',
          title: '20% Off Beauty Products',
          description: 'Get 20% off on orders above ₹999',
          discount: 20,
          minOrder: 999
        },
        {
          code: 'FIRST15',
          title: 'First Order Special',
          description: '15% off for new customers',
          discount: 15,
          minOrder: 499
        },
        {
          code: 'SAVE10',
          title: '₹100 Off',
          description: 'Flat ₹100 off on any order',
          discount: 100,
          type: 'flat',
          minOrder: 799
        }
      ]
    };
  },
  
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartSubtotal', 'cartItemCount']),
    
    shippingCost() {
      return this.cartSubtotal >= 999 ? 0 : 49;
    },
    
    taxRate() {
      // Dynamic tax based on selected address state
      const stateTaxRates = {
        'Maharashtra': 18,
        'Karnataka': 18,
        'Delhi': 18,
        'Gujarat': 18
      };
      return this.selectedAddress ? (stateTaxRates[this.selectedAddress.state] || 18) : 18;
    },
    
    taxAmount() {
      return (this.cartSubtotal * this.taxRate) / 100;
    },
    
    discountAmount() {
      if (!this.appliedCoupon) return 0;
      
      if (this.appliedCoupon.type === 'flat') {
        return this.appliedCoupon.discount;
      } else {
        return (this.cartSubtotal * this.appliedCoupon.discount) / 100;
      }
    },
    
    orderTotal() {
      return Math.max(0, this.cartSubtotal + this.shippingCost + this.taxAmount - this.discountAmount);
    },
    
    canPlaceOrder() {
      return this.selectedAddress && this.selectedPayment && this.isPaymentValid();
    },
    
    isAddressFormValid() {
      return this.addressForm.name && 
             this.addressForm.phone && 
             this.addressForm.street && 
             this.addressForm.city && 
             this.addressForm.state && 
             this.addressForm.pincode;
    }
  },
  
  methods: {
    ...mapActions('ui', ['showNotification']),
    ...mapActions('cart', ['clearCart']),
    
    // Address methods
    selectAddress(address) {
      this.selectedAddress = address;
    },
    
    editAddress(address) {
      this.editingAddress = address;
      this.addressForm = { ...address };
      this.showAddressModal = true;
    },
    
    closeAddressModal() {
      this.showAddressModal = false;
      this.editingAddress = null;
      this.resetAddressForm();
    },
    
    resetAddressForm() {
      this.addressForm = {
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home',
        isDefault: false
      };
    },
    
    saveAddress() {
      if (!this.isAddressFormValid) return;
      
      if (this.editingAddress) {
        // Update existing address
        const index = this.savedAddresses.findIndex(addr => addr.id === this.editingAddress.id);
        this.savedAddresses[index] = { ...this.addressForm, id: this.editingAddress.id };
      } else {
        // Add new address
        const newAddress = { ...this.addressForm, id: Date.now() };
        this.savedAddresses.push(newAddress);
      }
      
      // Set as default if checked
      if (this.addressForm.isDefault) {
        this.savedAddresses.forEach(addr => {
          addr.isDefault = addr.id === (this.editingAddress?.id || Date.now());
        });
      }
      
      this.selectedAddress = this.savedAddresses.find(addr => 
        addr.id === (this.editingAddress?.id || Date.now())
      );
      
      this.closeAddressModal();
      this.showNotification({
        type: 'success',
        message: 'Address saved successfully!'
      });
    },
    
    getAddressIcon(type) {
      const icons = {
        home: 'fas fa-home',
        work: 'fas fa-briefcase',
        other: 'fas fa-map-marker-alt'
      };
      return icons[type] || icons.other;
    },
    
    // Payment methods
    selectPayment(method) {
      this.selectedPayment = method;
      // Reset selections when changing payment method
      this.selectedUpiApp = null;
      this.selectedWallet = null;
      this.selectedBank = null;
    },
    
    formatCardNumber() {
      let value = this.cardDetails.number.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      if (formattedValue.length <= 19) {
        this.cardDetails.number = formattedValue;
      }
    },
    
    formatExpiry() {
      let value = this.cardDetails.expiry.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      this.cardDetails.expiry = value;
    },
    
    getCardBrandIcon(number) {
      const firstDigit = number.replace(/\s/g, '').charAt(0);
      switch (firstDigit) {
        case '4': return 'fab fa-cc-visa';
        case '5': return 'fab fa-cc-mastercard';
        case '3': return 'fab fa-cc-amex';
        default: return 'fas fa-credit-card';
      }
    },
    
    isPaymentValid() {
      switch (this.selectedPayment) {
        case 'card':
          return this.cardDetails.number.replace(/\s/g, '').length >= 13 && 
                 this.cardDetails.expiry.length === 5 && 
                 this.cardDetails.cvv.length >= 3 && 
                 this.cardDetails.name.trim().length > 0;
        case 'upi':
          return this.upiDetails.id.includes('@') || this.selectedUpiApp;
        case 'wallet':
          return this.selectedWallet;
        case 'netbanking':
          return this.selectedBank;
        default:
          return false;
      }
    },
    
    // Coupon methods
    applyCoupon() {
      const coupon = this.availableCoupons.find(c => c.code === this.couponCode.toUpperCase());
      if (coupon) {
        if (this.cartSubtotal < coupon.minOrder) {
          this.showNotification({
            type: 'error',
            message: `Minimum order amount ₹${coupon.minOrder} required for this coupon`
          });
          return;
        }
        
        this.appliedCoupon = { ...coupon };
        this.showNotification({
          type: 'success',
          message: `Coupon ${coupon.code} applied successfully!`
        });
      } else {
        this.showNotification({
          type: 'error',
          message: 'Invalid coupon code'
        });
      }
    },
    
    applyCouponCode(code) {
      this.couponCode = code;
      this.applyCoupon();
    },
    
    removeCoupon() {
      this.appliedCoupon = null;
      this.couponCode = '';
    },
    
    // Navigation
    nextStep() {
      if (this.currentStep === 1 && this.selectedAddress) {
        this.currentStep = 2;
      }
    },
    
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep = 1;
      }
    },
    
    // Order placement
    async placeOrder() {
      if (!this.canPlaceOrder) return;
      
      this.isPlacingOrder = true;
      
      try {
        // Simulate order processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        this.orderNumber = 'ORD' + Date.now();
        this.isPlacingOrder = false;
        this.showOrderSuccess = true;
        
        // Clear cart after successful order
        this.clearCart();
        
        // Hide success modal after 5 seconds
        setTimeout(() => {
          this.showOrderSuccess = false;
          this.$router.push('/orders');
        }, 5000);
        
      } catch (error) {
        this.isPlacingOrder = false;
        this.showNotification({
          type: 'error',
          message: 'Failed to place order. Please try again.'
        });
      }
    },
    
    goToOrders() {
      this.showOrderSuccess = false;
      this.$router.push('/orders');
    },
    
    continueShopping() {
      this.showOrderSuccess = false;
      this.$router.push('/');
    }
  },
  
  mounted() {
    // Auto-select default address
    if (this.savedAddresses.length > 0) {
      this.selectedAddress = this.savedAddresses.find(addr => addr.isDefault) || this.savedAddresses[0];
    }
  }
};
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-bottom: 2rem;
}

/* Progress Steps */
.checkout-progress {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 0;
}

.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.progress-step.active .step-circle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
}

.progress-step.completed .step-circle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.step-info {
  text-align: center;
}

.step-title {
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.step-description {
  font-size: 0.875rem;
  color: #9ca3af;
}

.step-connector {
  position: absolute;
  top: 30px;
  left: 60%;
  right: -60%;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.progress-step.completed .step-connector {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

/* Main Layout */
.checkout-content {
  padding: 3rem 0;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.checkout-main {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Section Headers */
.section-header {
  margin-bottom: 3rem;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.section-title i {
  color: #667eea;
}

.section-description {
  color: #6b7280;
  font-size: 1.125rem;
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
}

/* Address Section */
.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.address-card {
  position: relative;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.address-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.address-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.address-type-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.address-type-badge.home {
  background: #fef3c7;
  color: #92400e;
}

.address-type-badge.work {
  background: #dbeafe;
  color: #1e40af;
}

.address-type-badge.other {
  background: #f3e8ff;
  color: #7c3aed;
}

.edit-address-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.edit-address-btn:hover {
  color: #667eea;
  background: #f3f4f6;
}

.address-content {
  margin-bottom: 1rem;
}

.recipient-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.address-line {
  color: #6b7280;
  margin-bottom: 0.25rem;
  line-height: 1.5;
}

.phone-number {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-weight: 500;
  margin-top: 0.75rem;
}

.phone-number i {
  color: #667eea;
}

.default-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0 12px 0 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.add-address-card {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-address-card:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.add-address-content {
  text-align: center;
}

.add-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.add-address-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.add-address-content p {
  color: #6b7280;
}

/* No Addresses State */
.no-addresses {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 2rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.add-first-address-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-first-address-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Payment Methods */
.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.payment-method-card {
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.payment-method-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.payment-method-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.payment-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}

.payment-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.payment-icon.upi {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.payment-icon.wallet {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.payment-icon.netbanking {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.payment-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.card-brands,
.payment-brands {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-brands img,
.payment-brands img {
  height: 24px;
  width: auto;
  border-radius: 4px;
}

.payment-brands .bank-text {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.payment-description {
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
}

/* Payment Forms */
.payment-form-section {
  margin-bottom: 3rem;
}

.payment-form {
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-title i {
  color: #667eea;
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.card-input-wrapper {
  position: relative;
}

.card-number-input {
  padding-right: 3rem !important;
}

.detected-card-brand {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #9ca3af;
}

.save-card-option {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-label input:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
}

.checkbox-text i {
  color: #10b981;
}

/* UPI Form */
.upi-apps-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.upi-apps-section h4 {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1rem;
}

.upi-apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.upi-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.upi-app:hover {
  border-color: #667eea;
}

.upi-app.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.upi-app img {
  height: 32px;
  width: auto;
}

.upi-app span {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

/* Wallet Options */
.wallet-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.wallet-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.wallet-option:hover {
  border-color: #667eea;
}

.wallet-option.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.wallet-option img {
  height: 40px;
  width: auto;
}

.wallet-option span {
  font-weight: 500;
  color: #374151;
}

.wallet-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.feature-tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Banks Grid */
.banks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.bank-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.bank-option:hover {
  border-color: #667eea;
}

.bank-option.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.bank-logo img {
  height: 32px;
  width: auto;
}

.bank-name {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  text-align: center;
}

/* Discount Section */
.discount-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
}

.coupon-input-section {
  margin-bottom: 2rem;
}

.coupon-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.coupon-input input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
}

.coupon-input input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.apply-coupon-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.apply-coupon-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.apply-coupon-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.applied-coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ecfdf5;
  border: 1px solid #10b981;
  border-radius: 12px;
  padding: 1rem;
}

.coupon-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #059669;
  font-weight: 500;
}

.coupon-success i {
  color: #10b981;
}

.remove-coupon-btn {
  background: none;
  border: none;
  color: #059669;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.remove-coupon-btn:hover {
  background: rgba(16, 185, 129, 0.1);
}

.available-coupons h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.coupons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.coupon-card {
  position: relative;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.coupon-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.coupon-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0 10px 0 12px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 1;
}

.coupon-content h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.coupon-content p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.coupon-code {
  background: #f3f4f6;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Order Summary Sidebar */
.order-summary-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-title i {
  color: #667eea;
}

.cart-items-preview {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 2rem;
}

.cart-item-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cart-item-preview:last-child {
  margin-bottom: 0;
}

.item-image {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quantity-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #667eea;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.item-details p {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.item-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.price-breakdown {
  margin-bottom: 2rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.price-row:last-child {
  margin-bottom: 0;
}

.price-row span:first-child {
  color: #6b7280;
}

.price-row span:last-child {
  font-weight: 500;
  color: #374151;
}

.price-row.discount span:last-child {
  color: #10b981;
}

.price-row.total {
  font-size: 1.125rem;
  font-weight: 600;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.price-row.total span {
  color: #111827;
}

.free-badge {
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.price-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
}

.security-features {
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.security-item:last-child {
  margin-bottom: 0;
}

.security-item i {
  color: #10b981;
  width: 16px;
}

/* Navigation */
.checkout-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.nav-btn.secondary {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.nav-btn.secondary:hover {
  background: #e5e7eb;
}

.nav-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.place-order-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
  width: 100%;
  justify-content: center;
}

.place-order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
}

.place-order-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.place-order-btn.loading {
  pointer-events: none;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-icon,
.loading-spinner {
  font-size: 1.25rem;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.btn-amount {
  font-size: 1.25rem;
  font-weight: 700;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.address-type-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.address-type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.address-type-option:hover {
  border-color: #667eea;
}

.address-type-option.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.address-type-option i {
  font-size: 1.25rem;
  color: #667eea;
}

.address-type-option span {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.btn-secondary,
.btn-primary {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Success Overlay */
.order-success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.success-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.success-animation {
  margin-bottom: 2rem;
}

.checkmark-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto;
  animation: successPulse 0.6s ease;
}

.success-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.success-content p {
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes successPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .order-summary-sidebar {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .progress-steps {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step-connector {
    display: none;
  }
  
  .checkout-main {
    padding: 2rem;
  }
  
  .addresses-grid,
  .payment-methods-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .coupon-input {
    flex-direction: column;
  }
  
  .checkout-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-btn,
  .place-order-btn {
    width: 100%;
    justify-content: center;
  }
  
  .address-type-options {
    grid-template-columns: 1fr;
  }
  
  .success-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .checkout-progress {
    padding: 1rem 0;
  }
  
  .progress-step {
    gap: 0.5rem;
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .checkout-main {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .modal-content {
    margin: 0.5rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.5rem;
  }
  
  .success-content {
    padding: 2rem;
  }
  
  .checkmark-circle {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .success-content h2 {
    font-size: 1.5rem;
  }
}
</style>
