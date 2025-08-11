<template>
  <div class="checkout-page">
    <div class="container">
      <div class="checkout-header">
        <h1 class="page-title">Secure Checkout</h1>
        <div class="checkout-steps">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <span class="step-number">1</span>
            <span class="step-label">Shipping</span>
          </div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <span class="step-number">2</span>
            <span class="step-label">Payment</span>
          </div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <span class="step-number">3</span>
            <span class="step-label">Review</span>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        <div class="checkout-main">
          <!-- Step 1: Shipping Information -->
          <div v-if="currentStep === 1" class="checkout-step shipping-step">
            <div class="step-header">
              <h2>Shipping Information</h2>
              <p>Where should we deliver your beauty products?</p>
            </div>

            <!-- Saved Addresses -->
            <div v-if="savedAddresses.length > 0" class="saved-addresses">
              <h3>Choose a saved address</h3>
              <div class="addresses-grid">
                <div 
                  v-for="address in savedAddresses" 
                  :key="address.id"
                  class="address-card"
                  :class="{ selected: selectedAddress?.id === address.id }"
                  @click="selectAddress(address)"
                >
                  <div class="address-header">
                    <span class="address-type">{{ address.type }}</span>
                    <span v-if="address.isDefault" class="default-badge">Default</span>
                  </div>
                  <div class="address-details">
                    <p class="recipient-name">{{ address.name }}</p>
                    <p class="address-line">{{ address.street }}</p>
                    <p class="address-line">{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
                    <p class="address-phone">{{ address.phone }}</p>
                  </div>
                  <button @click.stop="editAddress(address)" class="edit-address-btn">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Add New Address -->
            <div class="new-address-section">
              <button @click="showAddressForm = !showAddressForm" class="add-address-btn">
                <i class="fas fa-plus"></i>
                Add New Address
              </button>

              <div v-if="showAddressForm" class="address-form">
                <h3>Add New Address</h3>
                <form @submit.prevent="saveAddress">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Full Name *</label>
                      <input type="text" v-model="newAddress.name" required>
                    </div>
                    <div class="form-group">
                      <label>Phone Number *</label>
                      <input type="tel" v-model="newAddress.phone" required>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label>Street Address *</label>
                    <input type="text" v-model="newAddress.street" required>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label>City *</label>
                      <input type="text" v-model="newAddress.city" required>
                    </div>
                    <div class="form-group">
                      <label>State *</label>
                      <select v-model="newAddress.state" required>
                        <option value="">Select State</option>
                        <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>ZIP Code *</label>
                      <input type="text" v-model="newAddress.zipCode" required>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label>Address Type</label>
                    <div class="address-type-options">
                      <label class="radio-option">
                        <input type="radio" v-model="newAddress.type" value="Home">
                        <span>Home</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" v-model="newAddress.type" value="Work">
                        <span>Work</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" v-model="newAddress.type" value="Other">
                        <span>Other</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="form-actions">
                    <button type="button" @click="showAddressForm = false" class="btn-secondary">Cancel</button>
                    <button type="submit" class="btn-primary">Save Address</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Shipping Options -->
            <div v-if="selectedAddress" class="shipping-options">
              <h3>Shipping Options</h3>
              <div class="shipping-methods">
                <label 
                  v-for="method in shippingMethods" 
                  :key="method.id"
                  class="shipping-method"
                  :class="{ selected: selectedShipping === method.id }"
                >
                  <input type="radio" :value="method.id" v-model="selectedShipping">
                  <div class="method-details">
                    <div class="method-info">
                      <h4>{{ method.name }}</h4>
                      <p>{{ method.description }}</p>
                      <span class="delivery-time">{{ method.deliveryTime }}</span>
                    </div>
                    <div class="method-price">
                      <span v-if="method.price === 0">FREE</span>
                      <span v-else>${{ method.price.toFixed(2) }}</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Step 2: Payment Information -->
          <div v-if="currentStep === 2" class="checkout-step payment-step">
            <div class="step-header">
              <h2>Payment Information</h2>
              <p>Choose your preferred payment method</p>
            </div>

            <!-- Payment Methods -->
            <div class="payment-methods">
              <div class="payment-tabs">
                <button 
                  v-for="method in paymentMethods" 
                  :key="method.id"
                  class="payment-tab"
                  :class="{ active: selectedPayment === method.id }"
                  @click="selectedPayment = method.id"
                >
                  <i :class="method.icon"></i>
                  <span>{{ method.name }}</span>
                </button>
              </div>

              <!-- Credit/Debit Card -->
              <div v-if="selectedPayment === 'card'" class="payment-form card-form">
                <div class="form-group">
                  <label>Card Number</label>
                  <div class="card-input">
                    <input 
                      type="text" 
                      v-model="cardDetails.number" 
                      placeholder="1234 5678 9012 3456"
                      @input="formatCardNumber"
                    >
                    <div class="card-brand">
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
                    >
                  </div>
                  <div class="form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      v-model="cardDetails.cvv" 
                      placeholder="123"
                      maxlength="4"
                    >
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" v-model="cardDetails.name" placeholder="John Doe">
                </div>
                
                <div class="save-card">
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="cardDetails.saveCard">
                    <span class="checkmark"></span>
                    <span>Save card for future purchases</span>
                  </label>
                </div>
              </div>

              <!-- Digital Wallets -->
              <div v-if="selectedPayment === 'wallet'" class="payment-form wallet-form">
                <div class="wallet-options">
                  <button 
                    v-for="wallet in digitalWallets" 
                    :key="wallet.id"
                    class="wallet-option"
                    @click="selectedWallet = wallet.id"
                    :class="{ active: selectedWallet === wallet.id }"
                  >
                    <i :class="wallet.icon"></i>
                    <span>{{ wallet.name }}</span>
                  </button>
                </div>
              </div>

              <!-- UPI -->
              <div v-if="selectedPayment === 'upi'" class="payment-form upi-form">
                <div class="form-group">
                  <label>UPI ID</label>
                  <input 
                    type="text" 
                    v-model="upiId" 
                    placeholder="your-upi@paytm"
                  >
                </div>
                
                <div class="upi-apps">
                  <h4>Or pay with UPI apps</h4>
                  <div class="upi-options">
                    <button 
                      v-for="app in upiApps" 
                      :key="app.id"
                      class="upi-app"
                      @click="payWithUPI(app.id)"
                    >
                      <i :class="app.icon"></i>
                      <span>{{ app.name }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Store Wallet -->
              <div v-if="selectedPayment === 'store-wallet'" class="payment-form wallet-balance-form">
                <div class="wallet-balance">
                  <div class="balance-info">
                    <i class="fas fa-wallet"></i>
                    <div>
                      <h4>Store Wallet Balance</h4>
                      <p class="balance-amount">${{ walletBalance.toFixed(2) }}</p>
                    </div>
                  </div>
                  
                  <div v-if="orderTotal > walletBalance" class="insufficient-balance">
                    <p>Insufficient balance. You need ${{ (orderTotal - walletBalance).toFixed(2) }} more.</p>
                    <button @click="addMoneyToWallet" class="add-money-btn">
                      Add Money to Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Discount Codes -->
            <div class="discount-section">
              <h3>Discount Codes & Coupons</h3>
              
              <div class="coupon-input">
                <input 
                  type="text" 
                  v-model="couponCode" 
                  placeholder="Enter coupon code"
                  :disabled="appliedCoupon"
                >
                <button 
                  @click="applyCoupon" 
                  :disabled="!couponCode || appliedCoupon"
                  class="apply-coupon-btn"
                >
                  {{ appliedCoupon ? 'Applied' : 'Apply' }}
                </button>
              </div>
              
              <div v-if="appliedCoupon" class="applied-coupon">
                <div class="coupon-info">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ appliedCoupon.code }} applied - Save ${{ appliedCoupon.discount.toFixed(2) }}</span>
                </div>
                <button @click="removeCoupon" class="remove-coupon">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div v-if="availableCoupons.length > 0" class="available-coupons">
                <h4>Available Coupons</h4>
                <div class="coupons-list">
                  <div 
                    v-for="coupon in availableCoupons" 
                    :key="coupon.code"
                    class="coupon-card"
                    @click="applyCouponCode(coupon.code)"
                  >
                    <div class="coupon-badge">{{ coupon.discount }}% OFF</div>
                    <div class="coupon-details">
                      <h5>{{ coupon.title }}</h5>
                      <p>{{ coupon.description }}</p>
                      <span class="coupon-code">{{ coupon.code }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Order Review -->
          <div v-if="currentStep === 3" class="checkout-step review-step">
            <div class="step-header">
              <h2>Review Your Order</h2>
              <p>Please review your order details before placing the order</p>
            </div>

            <!-- Order Items -->
            <div class="order-items">
              <h3>Order Items</h3>
              <div class="items-list">
                <div v-for="item in cartItems" :key="item.id" class="order-item">
                  <img :src="item.image" :alt="item.name" class="item-image">
                  <div class="item-details">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.brand }}</p>
                    <div class="item-variants" v-if="item.selectedSize || item.selectedVariant">
                      <span v-if="item.selectedSize">Size: {{ item.selectedSize.volume }}</span>
                      <span v-if="item.selectedVariant">{{ item.selectedVariant.shade }}</span>
                    </div>
                  </div>
                  <div class="item-quantity">Qty: {{ item.quantity }}</div>
                  <div class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="review-address">
              <h3>Shipping Address</h3>
              <div class="address-display">
                <p class="recipient-name">{{ selectedAddress.name }}</p>
                <p>{{ selectedAddress.street }}</p>
                <p>{{ selectedAddress.city }}, {{ selectedAddress.state }} {{ selectedAddress.zipCode }}</p>
                <p>{{ selectedAddress.phone }}</p>
              </div>
              <button @click="currentStep = 1" class="edit-btn">Edit</button>
            </div>

            <!-- Payment Method -->
            <div class="review-payment">
              <h3>Payment Method</h3>
              <div class="payment-display">
                <i :class="getSelectedPaymentIcon()"></i>
                <span>{{ getSelectedPaymentName() }}</span>
              </div>
              <button @click="currentStep = 2" class="edit-btn">Edit</button>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="checkout-navigation">
            <button 
              v-if="currentStep > 1" 
              @click="previousStep" 
              class="btn-secondary nav-btn"
            >
              <i class="fas fa-arrow-left"></i>
              Previous
            </button>
            
            <button 
              v-if="currentStep < 3" 
              @click="nextStep" 
              :disabled="!canProceed"
              class="btn-primary nav-btn"
            >
              Next
              <i class="fas fa-arrow-right"></i>
            </button>
            
            <button 
              v-if="currentStep === 3" 
              @click="placeOrder" 
              :disabled="isPlacingOrder"
              class="btn-primary place-order-btn"
            >
              <i v-if="isPlacingOrder" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-lock"></i>
              {{ isPlacingOrder ? 'Placing Order...' : 'Place Order' }}
            </button>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="order-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>
            
            <div class="summary-items">
              <div class="summary-row">
                <span>Subtotal ({{ cartItemCount }} items)</span>
                <span>${{ cartSubtotal.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Shipping</span>
                <span v-if="shippingCost === 0">FREE</span>
                <span v-else>${{ shippingCost.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Tax</span>
                <span>${{ taxAmount.toFixed(2) }}</span>
              </div>
              
              <div v-if="appliedCoupon" class="summary-row discount">
                <span>Discount ({{ appliedCoupon.code }})</span>
                <span>-${{ appliedCoupon.discount.toFixed(2) }}</span>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-row total">
                <span>Total</span>
                <span>${{ orderTotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Security Badges -->
            <div class="security-badges">
              <div class="security-item">
                <i class="fas fa-shield-alt"></i>
                <span>Secure Checkout</span>
              </div>
              <div class="security-item">
                <i class="fas fa-truck"></i>
                <span>Free Returns</span>
              </div>
              <div class="security-item">
                <i class="fas fa-award"></i>
                <span>100% Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Checkout',
  data() {
    return {
      currentStep: 1,
      showAddressForm: false,
      selectedAddress: null,
      selectedShipping: 'standard',
      selectedPayment: 'card',
      selectedWallet: null,
      upiId: '',
      couponCode: '',
      appliedCoupon: null,
      isPlacingOrder: false,
      walletBalance: 125.50,
      newAddress: {
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        type: 'Home'
      },
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: '',
        saveCard: false
      },
      states: [
        'California', 'New York', 'Texas', 'Florida', 'Illinois', 
        'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
      ],
      shippingMethods: [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: 'Delivered in 5-7 business days',
          deliveryTime: '5-7 business days',
          price: 0
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: 'Delivered in 2-3 business days',
          deliveryTime: '2-3 business days',
          price: 12.99
        },
        {
          id: 'overnight',
          name: 'Overnight Delivery',
          description: 'Delivered next business day',
          deliveryTime: 'Next business day',
          price: 24.99
        }
      ],
      paymentMethods: [
        { id: 'card', name: 'Credit/Debit Card', icon: 'fas fa-credit-card' },
        { id: 'wallet', name: 'Digital Wallet', icon: 'fas fa-mobile-alt' },
        { id: 'upi', name: 'UPI', icon: 'fas fa-qrcode' },
        { id: 'store-wallet', name: 'Store Wallet', icon: 'fas fa-wallet' }
      ],
      digitalWallets: [
        { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal' },
        { id: 'applepay', name: 'Apple Pay', icon: 'fab fa-apple-pay' },
        { id: 'googlepay', name: 'Google Pay', icon: 'fab fa-google-pay' }
      ],
      upiApps: [
        { id: 'paytm', name: 'Paytm', icon: 'fas fa-mobile-alt' },
        { id: 'phonepe', name: 'PhonePe', icon: 'fas fa-mobile-alt' },
        { id: 'gpay', name: 'Google Pay', icon: 'fab fa-google-pay' }
      ],
      availableCoupons: [
        {
          code: 'BEAUTY20',
          title: '20% Off',
          description: 'Get 20% off on orders above $50',
          discount: 20,
          minOrder: 50
        },
        {
          code: 'NEWUSER15',
          title: 'New User Special',
          description: '15% off for first-time customers',
          discount: 15,
          minOrder: 0
        },
        {
          code: 'FREESHIP',
          title: 'Free Shipping',
          description: 'Free shipping on any order',
          discount: 0,
          freeShipping: true
        }
      ],
      savedAddresses: [
        {
          id: 1,
          name: 'Rumpa Samanta',
          phone: '+1 234-567-8900',
          street: '123 Beauty Lane, Apt 4B',
          city: 'Los Angeles',
          state: 'California',
          zipCode: '90210',
          type: 'Home',
          isDefault: true
        },
        {
          id: 2,
          name: 'Rumpa Samanta',
          phone: '+1 234-567-8900',
          street: '456 Corporate Plaza, Suite 200',
          city: 'Los Angeles',
          state: 'California',
          zipCode: '90213',
          type: 'Work',
          isDefault: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartSubtotal', 'cartItemCount']),
    shippingCost() {
      if (this.appliedCoupon?.freeShipping) return 0;
      const method = this.shippingMethods.find(m => m.id === this.selectedShipping);
      return method ? method.price : 0;
    },
    taxAmount() {
      // Calculate tax based on address (simplified)
      const taxRate = this.selectedAddress?.state === 'California' ? 0.0875 : 0.08;
      return this.cartSubtotal * taxRate;
    },
    discountAmount() {
      if (!this.appliedCoupon) return 0;
      if (this.appliedCoupon.discount > 0) {
        return (this.cartSubtotal * this.appliedCoupon.discount) / 100;
      }
      return 0;
    },
    orderTotal() {
      return this.cartSubtotal + this.shippingCost + this.taxAmount - this.discountAmount;
    },
    canProceed() {
      if (this.currentStep === 1) {
        return this.selectedAddress && this.selectedShipping;
      }
      if (this.currentStep === 2) {
        return this.selectedPayment && this.isPaymentValid();
      }
      return true;
    }
  },
  methods: {
    ...mapActions('ui', ['showNotification']),
    selectAddress(address) {
      this.selectedAddress = address;
    },
    editAddress(address) {
      this.newAddress = { ...address };
      this.showAddressForm = true;
    },
    saveAddress() {
      if (this.newAddress.id) {
        // Update existing address
        const index = this.savedAddresses.findIndex(addr => addr.id === this.newAddress.id);
        this.savedAddresses[index] = { ...this.newAddress };
      } else {
        // Add new address
        this.newAddress.id = Date.now();
        this.savedAddresses.push({ ...this.newAddress });
      }
      
      this.selectedAddress = { ...this.newAddress };
      this.showAddressForm = false;
      this.resetAddressForm();
      
      this.showNotification({
        type: 'success',
        message: 'Address saved successfully!'
      });
    },
    resetAddressForm() {
      this.newAddress = {
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        type: 'Home'
      };
    },
    formatCardNumber() {
      let value = this.cardDetails.number.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      this.cardDetails.number = formattedValue;
    },
    formatExpiry() {
      let value = this.cardDetails.expiry.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      this.cardDetails.expiry = value;
    },
    getCardBrandIcon(number) {
      const firstDigit = number.charAt(0);
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
          return this.cardDetails.number && this.cardDetails.expiry && 
                 this.cardDetails.cvv && this.cardDetails.name;
        case 'wallet':
          return this.selectedWallet;
        case 'upi':
          return this.upiId;
        case 'store-wallet':
          return this.walletBalance >= this.orderTotal;
        default:
          return false;
      }
    },
    applyCoupon() {
      const coupon = this.availableCoupons.find(c => c.code === this.couponCode);
      if (coupon) {
        if (coupon.minOrder > 0 && this.cartSubtotal < coupon.minOrder) {
          this.showNotification({
            type: 'error',
            message: `Minimum order amount $${coupon.minOrder} required for this coupon`
          });
          return;
        }
        
        this.appliedCoupon = {
          ...coupon,
          discount: coupon.discount > 0 ? (this.cartSubtotal * coupon.discount) / 100 : 0
        };
        
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
    getSelectedPaymentIcon() {
      const method = this.paymentMethods.find(m => m.id === this.selectedPayment);
      return method ? method.icon : 'fas fa-credit-card';
    },
    getSelectedPaymentName() {
      const method = this.paymentMethods.find(m => m.id === this.selectedPayment);
      return method ? method.name : 'Payment Method';
    },
    nextStep() {
      if (this.canProceed && this.currentStep < 3) {
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    async placeOrder() {
      this.isPlacingOrder = true;
      
      try {
        // Simulate order placement
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const orderId = 'ORD' + Date.now();
        
        // Redirect to order confirmation
        this.$router.push(`/order-confirmation/${orderId}`);
        
        this.showNotification({
          type: 'success',
          message: 'Order placed successfully!'
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to place order. Please try again.'
        });
      } finally {
        this.isPlacingOrder = false;
      }
    },
    addMoneyToWallet() {
      // Implementation for adding money to wallet
      console.log('Add money to wallet');
    },
    payWithUPI(appId) {
      // Implementation for UPI payment
      console.log('Pay with UPI app:', appId);
    }
  },
  mounted() {
    // Auto-select first address if available
    if (this.savedAddresses.length > 0) {
      this.selectedAddress = this.savedAddresses.find(addr => addr.isDefault) || this.savedAddresses[0];
    }
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 40px 0;
  min-height: 100vh;
  background: var(--gray-50);
}

.checkout-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 24px;
}

.checkout-steps {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 1;
  color: var(--success-600);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--primary-500);
}

.step.completed .step-number {
  background: var(--success-500);
}

.step-label {
  font-weight: 500;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.checkout-main {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.checkout-step {
  margin-bottom: 40px;
}

.step-header {
  margin-bottom: 32px;
}

.step-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.step-header p {
  color: var(--gray-600);
}

.saved-addresses h3,
.new-address-section h3,
.shipping-options h3,
.payment-methods h3,
.discount-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 20px;
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.address-card {
  position: relative;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.address-card:hover {
  border-color: var(--primary-300);
}

.address-card.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.address-type {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.default-badge {
  background: var(--primary-500);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.address-details p {
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--gray-600);
}

.recipient-name {
  font-weight: 600;
  color: var(--gray-800) !important;
}

.edit-address-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.edit-address-btn:hover {
  color: var(--primary-500);
}

.add-address-btn {
  background: var(--primary-100);
  border: 2px dashed var(--primary-400);
  border-radius: 12px;
  padding: 16px 24px;
  color: var(--primary-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 20px;
}

.add-address-btn:hover {
  background: var(--primary-200);
}

.address-form {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--gray-700);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-500);
}

.address-type-options {
  display: flex;
  gap: 16px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--primary-600);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-200);
}

.shipping-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shipping-method {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shipping-method:hover {
  border-color: var(--primary-300);
}

.shipping-method.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.shipping-method input[type="radio"] {
  margin: 0;
}

.method-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.method-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.method-info p {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 4px;
}

.delivery-time {
  font-size: 12px;
  color: var(--primary-600);
  font-weight: 500;
}

.method-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
}

.payment-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: var(--gray-100);
  border-radius: 12px;
  padding: 4px;
}

.payment-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--gray-600);
  transition: all 0.2s ease;
}

.payment-tab.active {
  background: var(--primary-500);
  color: white;
}

.payment-form {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.card-input {
  position: relative;
}

.card-brand {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: var(--gray-400);
}

.save-card {
  margin-top: 16px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.checkbox-option input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-option input:checked + .checkmark {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.checkbox-option input:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.wallet-options,
.upi-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.wallet-option,
.upi-app {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.wallet-option:hover,
.upi-app:hover {
  border-color: var(--primary-300);
}

.wallet-option.active {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.wallet-balance {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.balance-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.balance-info i {
  font-size: 32px;
  color: var(--primary-500);
}

.balance-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.balance-amount {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-600);
}

.insufficient-balance {
  background: var(--warning-50);
  border: 1px solid var(--warning-200);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.add-money-btn {
  background: var(--warning-500);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
}

.coupon-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.coupon-input input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
}

.apply-coupon-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
}

.apply-coupon-btn:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}

.applied-coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--success-50);
  border: 1px solid var(--success-200);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
}

.coupon-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--success-700);
}

.remove-coupon {
  background: none;
  border: none;
  color: var(--success-600);
  cursor: pointer;
  padding: 4px;
}

.available-coupons h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--gray-800);
}

.coupons-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.coupon-card {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.coupon-card:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px);
}

.coupon-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary-500);
  color: white;
  padding: 8px 16px;
  border-radius: 0 0 0 12px;
  font-size: 12px;
  font-weight: 700;
}

.coupon-details h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.coupon-details p {
  font-size: 12px;
  color: var(--gray-600);
  margin-bottom: 8px;
}

.coupon-code {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
}

.order-items {
  margin-bottom: 32px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--gray-50);
  border-radius: 12px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.item-details p {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 4px;
}

.item-variants {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--gray-500);
}

.item-quantity,
.item-price {
  font-weight: 600;
  color: var(--gray-800);
}

.review-address,
.review-payment {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
}

.review-address h3,
.review-payment h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 12px;
}

.address-display p {
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--gray-600);
}

.payment-display {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: var(--gray-700);
}

.edit-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: 1px solid var(--primary-400);
  color: var(--primary-600);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: var(--primary-50);
}

.checkout-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--gray-200);
}

.nav-btn,
.place-order-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 16px;
}

.place-order-btn {
  background: linear-gradient(135deg, var(--success-500), var(--success-600));
  color: white;
}

.place-order-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(var(--success-500), 0.3);
}

.place-order-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.order-summary {
  position: sticky;
  top: 20px;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.summary-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 20px;
}

.summary-items {
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.summary-row.discount {
  color: var(--success-600);
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
  padding-top: 12px;
  margin-top: 12px;
  border-top: 2px solid var(--gray-200);
}

.summary-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 16px 0;
}

.security-badges {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}

.security-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--gray-600);
}

.security-item i {
  color: var(--success-500);
  font-size: 16px;
  width: 16px;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .order-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 20px 0;
  }
  
  .checkout-main {
    padding: 20px;
  }
  
  .checkout-steps {
    flex-direction: column;
    gap: 16px;
  }
  
  .addresses-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .wallet-options,
  .upi-options {
    grid-template-columns: 1fr;
  }
  
  .coupons-list {
    grid-template-columns: 1fr;
  }
  
  .checkout-navigation {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
