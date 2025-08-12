<template>
  <div class="order-details-container">
    
    <!-- Header -->
    <div class="header-section">
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <div>
        <h1>Order Details</h1>
        <p>Track your order and manage details</p>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="order-summary">
      <div class="summary-header">
        <div>
          <h2>Order #{{ orderData.id }}</h2>
          <p>{{ formatDate(orderData.date) }}</p>
        </div>
        <div class="status-section">
          <span :class="['status-badge', getStatusClass(orderData.status)]">
            <i :class="getStatusIcon(orderData.status)"></i>
            {{ orderData.status }}
          </span>
          <!-- Refund Button - Only for delivered orders -->
          <button 
            v-if="orderData.status === 'Delivered'" 
            @click="requestRefund"
            class="refund-btn"
          >
            <i class="fas fa-undo"></i>
            Request Refund
          </button>
        </div>
      </div>
    </div>

    <!-- Order Items -->
    <div class="order-items">
      <h3>Order Items</h3>
      <div class="items-list">
        <div 
          v-for="item in orderData.items" 
          :key="item.id"
          class="item-card"
        >
          <div class="item-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p class="item-brand">{{ item.brand }}</p>
            <div class="item-meta">
              <span>Qty: {{ item.quantity }}</span>
              <span class="item-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Address -->
    <div class="delivery-address">
      <h3>Delivery Address</h3>
      <div class="address-content">
        <h4>{{ orderData.deliveryAddress.name }}</h4>
        <p>+91 {{ orderData.deliveryAddress.phone }}</p>
        <p>
          {{ orderData.deliveryAddress.street }}, 
          {{ orderData.deliveryAddress.city }}, 
          {{ orderData.deliveryAddress.state }} - {{ orderData.deliveryAddress.pincode }}
        </p>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="price-breakdown">
      <h3>Price Breakdown</h3>
      <div class="breakdown-list">
        <div class="breakdown-item">
          <span>Item Subtotal</span>
          <span>₹{{ orderData.pricing.subtotal.toFixed(2) }}</span>
        </div>
        <div class="breakdown-item">
          <span>Tax</span>
          <span>₹{{ orderData.pricing.tax.toFixed(2) }}</span>
        </div>
        <div v-if="orderData.pricing.discount > 0" class="breakdown-item">
          <span>Discount</span>
          <span class="discount">-₹{{ orderData.pricing.discount.toFixed(2) }}</span>
        </div>
        <div class="breakdown-item">
          <span>Shipping Fee</span>
          <span>{{ orderData.pricing.shipping === 0 ? 'FREE' : '₹' + orderData.pricing.shipping.toFixed(2) }}</span>
        </div>
        <div class="breakdown-divider"></div>
        <div class="breakdown-item total">
          <span>Total Amount Paid</span>
          <span>₹{{ orderData.pricing.total.toFixed(2) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'OrderDetailsWorking',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderData: null,
      // Mock orders data - same as in Orders page
      orders: [
        {
          id: '10234',
          date: new Date('2024-01-15'),
          status: 'Delivered',
          total: 2499,
          items: [
            {
              id: 1,
              name: 'Luxury Moisturizing Face Cream',
              brand: 'GlowLux',
              image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
              price: 1299,
              quantity: 1
            },
            {
              id: 2,
              name: 'Vitamin C Brightening Serum',
              brand: 'VitaGlow',
              image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
              price: 899,
              quantity: 1
            },
            {
              id: 3,
              name: 'Gentle Foaming Cleanser',
              brand: 'PureClean',
              image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300',
              price: 599,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 2797,
            tax: 252,
            discount: 300,
            shipping: 0,
            total: 2499
          }
        },
        {
          id: '10233',
          date: new Date('2024-01-12'),
          status: 'Processing',
          total: 1899,
          items: [
            {
              id: 4,
              name: 'Hyaluronic Acid Moisturizer',
              brand: 'HydraLux',
              image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300',
              price: 999,
              quantity: 1
            },
            {
              id: 5,
              name: 'SPF 50 Daily Sunscreen',
              brand: 'SunGuard',
              image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300',
              price: 899,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 1898,
            tax: 171,
            discount: 170,
            shipping: 0,
            total: 1899
          }
        },
        {
          id: '10232',
          date: new Date('2024-01-10'),
          status: 'Confirmed',
          total: 1299,
          items: [
            {
              id: 6,
              name: 'Niacinamide Pore Refining Serum',
              brand: 'ClearSkin',
              image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
              price: 1299,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 1299,
            tax: 117,
            discount: 117,
            shipping: 0,
            total: 1299
          }
        }
      ]
    };
  },
  mounted() {
    this.loadOrder();
  },
  methods: {
    loadOrder() {
      this.orderData = this.orders.find(order => order.id === this.orderId);
      if (!this.orderData) {
        this.$router.push('/orders');
      }
    },
    goBack() {
      this.$router.push('/orders');
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getStatusClass(status) {
      return status.toLowerCase().replace(' ', '-');
    },
    getStatusIcon(status) {
      const icons = {
        'Processing': 'fas fa-clock',
        'Confirmed': 'fas fa-check',
        'Shipped': 'fas fa-shipping-fast',
        'Out for Delivery': 'fas fa-truck',
        'Delivered': 'fas fa-check-circle',
        'Cancelled': 'fas fa-times-circle'
      };
      return icons[status] || 'fas fa-clock';
    },
    requestRefund() {
      if (confirm('Are you sure you want to request a refund for this order?')) {
        alert('Refund request submitted! You will receive an email confirmation shortly.');
      }
    }
  }
};
</script>

<style scoped>
.order-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f9fafb;
  min-height: 100vh;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: #f9fafb;
}

.header-section h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-section p {
  color: #6b7280;
  margin: 4px 0 0 0;
  font-size: 14px;
}

.order-summary,
.order-items,
.delivery-address,
.price-breakdown {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.summary-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.summary-header p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.processing {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
}

.status-badge.confirmed {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.status-badge.shipped {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #5b21b6;
  border: 1px solid #8b5cf6;
}

.status-badge.out-for-delivery {
  background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%);
  color: #c2410c;
  border: 1px solid #f97316;
}

.status-badge.delivered {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #15803d;
  border: 1px solid #22c55e;
}

.status-badge.cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #ef4444;
}

.refund-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.refund-btn:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
}

h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.item-brand {
  font-size: 14px;
  color: #8b4e9f;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-meta span:first-child {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #8b4e9f;
}

.address-content {
  background: #f9fafb;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}

.address-content h4 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.address-content p {
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.6;
}

.address-content p:last-child {
  color: #374151;
  font-size: 16px;
  margin: 0;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.breakdown-item span:first-child {
  color: #6b7280;
  font-weight: 500;
}

.breakdown-item span:last-child {
  font-weight: 600;
  color: #1f2937;
}

.breakdown-item .discount {
  color: #22c55e;
}

.breakdown-divider {
  height: 2px;
  background: linear-gradient(90deg, #f0e6e6 0%, #e9d5ff 50%, #f0e6e6 100%);
  margin: 8px 0;
  border-radius: 1px;
}

.breakdown-item.total {
  font-size: 18px;
  font-weight: 700;
}

.breakdown-item.total span:first-child {
  color: #1f2937;
}

.breakdown-item.total span:last-child {
  color: #8b4e9f;
  font-size: 20px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .order-details-container {
    padding: 20px 16px;
  }
  
  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .status-section {
    width: 100%;
    justify-content: space-between;
  }
  
  .item-card {
    gap: 12px;
    padding: 16px;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
  }
}
</style>
