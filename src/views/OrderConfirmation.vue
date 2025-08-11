<template>
  <div class="order-confirmation-page">
    <div class="container">
      <div class="confirmation-content">
        <!-- Success Header -->
        <div class="success-header">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. Your order has been confirmed and is being processed.</p>
        </div>

        <!-- Order Details Card -->
        <div class="order-details-card">
          <div class="order-header">
            <h2>Order #{{ orderId }}</h2>
            <div class="order-status">
              <span class="status-badge confirmed">Confirmed</span>
            </div>
          </div>

          <div class="order-timeline">
            <div class="timeline-step completed">
              <div class="step-icon">
                <i class="fas fa-check"></i>
              </div>
              <div class="step-content">
                <h3>Order Confirmed</h3>
                <p>{{ formatDateTime(order.confirmedAt) }}</p>
              </div>
            </div>
            
            <div class="timeline-step pending">
              <div class="step-icon">
                <i class="fas fa-box"></i>
              </div>
              <div class="step-content">
                <h3>Processing</h3>
                <p>Estimated: {{ formatDateTime(order.processingAt) }}</p>
              </div>
            </div>
            
            <div class="timeline-step pending">
              <div class="step-icon">
                <i class="fas fa-truck"></i>
              </div>
              <div class="step-content">
                <h3>Shipped</h3>
                <p>Estimated: {{ formatDateTime(order.shippedAt) }}</p>
              </div>
            </div>
            
            <div class="timeline-step pending">
              <div class="step-icon">
                <i class="fas fa-home"></i>
              </div>
              <div class="step-content">
                <h3>Delivered</h3>
                <p>Estimated: {{ formatDateTime(order.deliveredAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items-section">
            <h3>Items Ordered</h3>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <img :src="item.image" :alt="item.name" class="item-image">
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p class="item-brand">{{ item.brand }}</p>
                  <div class="item-variants" v-if="item.selectedSize || item.selectedVariant">
                    <span v-if="item.selectedSize">Size: {{ item.selectedSize.volume }}</span>
                    <span v-if="item.selectedVariant">{{ item.selectedVariant.shade }}</span>
                  </div>
                  <div class="item-meta">
                    <span class="quantity">Qty: {{ item.quantity }}</span>
                    <span class="price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary-section">
            <h3>Order Summary</h3>
            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span v-if="order.shipping === 0">FREE</span>
                <span v-else>${{ order.shipping.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Tax</span>
                <span>${{ order.tax.toFixed(2) }}</span>
              </div>
              <div v-if="order.discount > 0" class="summary-row discount">
                <span>Discount</span>
                <span>-${{ order.discount.toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Delivery Information -->
          <div class="delivery-info-section">
            <h3>Delivery Information</h3>
            <div class="delivery-details">
              <div class="address-info">
                <h4>Shipping Address</h4>
                <div class="address">
                  <p>{{ order.shippingAddress.name }}</p>
                  <p>{{ order.shippingAddress.street }}</p>
                  <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
                  <p>{{ order.shippingAddress.phone }}</p>
                </div>
              </div>
              
              <div class="shipping-method">
                <h4>Shipping Method</h4>
                <p>{{ order.shippingMethod.name }}</p>
                <p class="delivery-estimate">{{ order.shippingMethod.description }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="payment-info-section">
            <h3>Payment Information</h3>
            <div class="payment-details">
              <div class="payment-method">
                <i :class="getPaymentIcon(order.paymentMethod.type)"></i>
                <span>{{ order.paymentMethod.name }}</span>
              </div>
              <div class="payment-status">
                <span class="status-badge paid">Paid</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="trackOrder" class="btn-primary">
            <i class="fas fa-map-marker-alt"></i>
            Track Order
          </button>
          
          <button @click="downloadInvoice" class="btn-secondary">
            <i class="fas fa-download"></i>
            Download Invoice
          </button>
          
          <button @click="continueShopping" class="btn-outline">
            <i class="fas fa-shopping-bag"></i>
            Continue Shopping
          </button>
        </div>

        <!-- Support Section -->
        <div class="support-section">
          <div class="support-card">
            <div class="support-icon">
              <i class="fas fa-headset"></i>
            </div>
            <div class="support-content">
              <h3>Need Help?</h3>
              <p>Our customer support team is here to assist you with any questions about your order.</p>
              <div class="support-options">
                <button @click="openLiveChat" class="support-btn">
                  <i class="fas fa-comment"></i>
                  Live Chat
                </button>
                <button @click="callSupport" class="support-btn">
                  <i class="fas fa-phone"></i>
                  Call Support
                </button>
                <button @click="emailSupport" class="support-btn">
                  <i class="fas fa-envelope"></i>
                  Email Support
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="recommendations-section">
          <h2>You Might Also Like</h2>
          <div class="recommendations-grid">
            <ProductCard 
              v-for="product in recommendedProducts" 
              :key="product.id"
              :product="product"
              class="recommendation-item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from '../components/product/ProductCard.vue';

export default {
  name: 'OrderConfirmation',
  components: {
    ProductCard
  },
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      order: {
        id: this.orderId,
        confirmedAt: new Date(),
        processingAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 day
        shippedAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 days
        deliveredAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
        items: [
          {
            id: 1,
            name: 'Luxury Moisturizing Face Cream',
            brand: 'GlowLux',
            price: 89.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200',
            selectedSize: { volume: '50ml' }
          },
          {
            id: 2,
            name: 'Vitamin C Brightening Serum',
            brand: 'VitaGlow',
            price: 65.00,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200'
          }
        ],
        subtotal: 219.99,
        shipping: 0,
        tax: 17.60,
        discount: 20.00,
        total: 217.59,
        shippingAddress: {
          name: 'Rumpa Samanta',
          street: '123 Beauty Lane, Apt 4B',
          city: 'Los Angeles',
          state: 'California',
          zipCode: '90210',
          phone: '+1 234-567-8900'
        },
        shippingMethod: {
          name: 'Standard Shipping',
          description: 'Delivered in 5-7 business days'
        },
        paymentMethod: {
          type: 'card',
          name: 'Credit Card ending in 1234'
        }
      }
    };
  },
  computed: {
    ...mapGetters('products', ['featuredProducts']),
    recommendedProducts() {
      return this.featuredProducts.slice(0, 4);
    }
  },
  methods: {
    formatDateTime(date) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    getPaymentIcon(type) {
      const icons = {
        card: 'fas fa-credit-card',
        wallet: 'fas fa-mobile-alt',
        upi: 'fas fa-qrcode',
        'store-wallet': 'fas fa-wallet'
      };
      return icons[type] || 'fas fa-credit-card';
    },
    trackOrder() {
      this.$router.push(`/order-tracking/${this.orderId}`);
    },
    downloadInvoice() {
      // Implementation for downloading invoice
      console.log('Download invoice for order:', this.orderId);
    },
    continueShopping() {
      this.$router.push('/products');
    },
    openLiveChat() {
      // Implementation for opening live chat
      console.log('Open live chat');
    },
    callSupport() {
      // Implementation for calling support
      console.log('Call support');
    },
    emailSupport() {
      // Implementation for email support
      console.log('Email support');
    }
  }
};
</script>

<style scoped>
.order-confirmation-page {
  padding: 40px 0;
  min-height: 100vh;
  background: var(--gray-50);
}

.confirmation-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.success-header {
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: var(--success-500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  font-size: 36px;
  animation: successPulse 1s ease-in-out;
}

@keyframes successPulse {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.success-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 12px;
}

.success-header p {
  font-size: 18px;
  color: var(--gray-600);
  max-width: 500px;
  margin: 0 auto;
}

.order-details-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--gray-200);
}

.order-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.confirmed {
  background: var(--success-100);
  color: var(--success-700);
}

.status-badge.paid {
  background: var(--primary-100);
  color: var(--primary-700);
}

.order-timeline {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
}

.order-timeline::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: var(--gray-300);
  z-index: 1;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.timeline-step.completed .step-icon {
  background: var(--success-500);
}

.timeline-step.pending .step-icon {
  background: var(--gray-300);
  color: var(--gray-500);
}

.step-content {
  text-align: center;
}

.step-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.step-content p {
  font-size: 12px;
  color: var(--gray-500);
}

.order-items-section,
.order-summary-section,
.delivery-info-section,
.payment-info-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--gray-200);
}

.order-items-section:last-child,
.order-summary-section:last-child,
.delivery-info-section:last-child,
.payment-info-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.order-items-section h3,
.order-summary-section h3,
.delivery-info-section h3,
.payment-info-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 20px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--gray-50);
  border-radius: 12px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
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

.item-brand {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 8px;
}

.item-variants {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--gray-500);
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity {
  font-size: 14px;
  color: var(--gray-600);
}

.price {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-600);
}

.summary-details {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 20px;
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
  margin-bottom: 0;
}

.delivery-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.address-info h4,
.shipping-method h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 12px;
}

.address p {
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--gray-600);
}

.shipping-method p {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 4px;
}

.delivery-estimate {
  font-weight: 500;
  color: var(--primary-600);
}

.payment-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gray-50);
  border-radius: 12px;
  padding: 20px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: var(--gray-700);
}

.payment-method i {
  font-size: 20px;
  color: var(--primary-500);
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.btn-primary,
.btn-secondary,
.btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
  font-size: 16px;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-200);
}

.btn-outline {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-500);
}

.btn-outline:hover {
  background: var(--primary-50);
}

.support-section {
  margin-bottom: 40px;
}

.support-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  gap: 24px;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.support-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 24px;
  flex-shrink: 0;
}

.support-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.support-content p {
  color: var(--gray-600);
  margin-bottom: 16px;
}

.support-options {
  display: flex;
  gap: 12px;
}

.support-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.support-btn:hover {
  background: var(--primary-600);
}

.recommendations-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 24px;
  text-align: center;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.recommendation-item {
  transform: scale(0.95);
  transition: transform 0.2s ease;
}

.recommendation-item:hover {
  transform: scale(1);
}

@media (max-width: 768px) {
  .order-confirmation-page {
    padding: 20px 0;
  }
  
  .confirmation-content {
    padding: 0 16px;
  }
  
  .order-details-card {
    padding: 20px;
  }
  
  .order-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .order-timeline {
    flex-direction: column;
    gap: 20px;
  }
  
  .order-timeline::before {
    display: none;
  }
  
  .timeline-step {
    flex-direction: row;
    text-align: left;
  }
  
  .step-content {
    text-align: left;
    margin-left: 16px;
  }
  
  .delivery-details {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .payment-details {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .support-card {
    flex-direction: column;
    text-align: center;
  }
  
  .support-options {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .recommendations-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
