<template>
  <div class="order-details-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="market-container">
        <div class="header-content">
          <button @click="goBackToOrders" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <div class="header-main">
            <h1 class="page-title">Order Details</h1>
            <p class="page-subtitle">Track your order and manage details</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Summary Section -->
    <div class="order-summary-section">
      <div class="market-container">
        <div class="summary-card">
          <div class="summary-header">
            <div class="order-meta">
              <h2 class="order-id">Order #{{ orderDetails.orderId }}</h2>
              <p class="order-date">{{ formatDate(orderDetails.orderDate) }}</p>
            </div>
            <div class="order-status-container">
              <span :class="['order-status-badge', getStatusClass(orderDetails.status)]">
                <i :class="getStatusIcon(orderDetails.status)"></i>
                {{ orderDetails.status }}
              </span>
              <!-- Refund Button - Only show for delivered orders -->
              <button
                v-if="orderDetails.status === 'Delivered'"
                @click="requestRefund"
                class="refund-button"
              >
                <i class="fas fa-undo"></i>
                Request Refund
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Items List -->
    <div class="order-items-section">
      <div class="market-container">
        <div class="items-card">
          <h3 class="section-title">Order Items</h3>
          <div class="items-list">
            <div 
              v-for="item in orderDetails.items" 
              :key="item.id"
              class="item-row"
            >
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-details">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-brand">{{ item.brand }}</p>
                <div class="item-meta">
                  <span class="item-quantity">Qty: {{ item.quantity }}</span>
                  <span class="item-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Address Section -->
    <div class="address-section">
      <div class="market-container">
        <div class="address-card">
          <div class="address-header">
            <h3 class="section-title">Delivery Address</h3>
          </div>
          <div class="address-content">
            <div class="address-info">
              <h4 class="recipient-name">{{ orderDetails.deliveryAddress.name }}</h4>
              <p class="recipient-phone">+91 {{ orderDetails.deliveryAddress.phone }}</p>
              <p class="recipient-address">
                {{ orderDetails.deliveryAddress.street }}, 
                {{ orderDetails.deliveryAddress.city }}, 
                {{ orderDetails.deliveryAddress.state }} - {{ orderDetails.deliveryAddress.pincode }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Price Breakdown Section -->
    <div class="price-breakdown-section">
      <div class="market-container">
        <div class="breakdown-card">
          <h3 class="section-title">Price Breakdown</h3>
          <div class="breakdown-list">
            <div class="breakdown-item">
              <span class="breakdown-label">Item Subtotal</span>
              <span class="breakdown-value">₹{{ orderDetails.pricing.subtotal }}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">Tax</span>
              <span class="breakdown-value">₹{{ orderDetails.pricing.tax }}</span>
            </div>
            <div v-if="orderDetails.pricing.discount > 0" class="breakdown-item discount">
              <span class="breakdown-label">Discount</span>
              <span class="breakdown-value">-₹{{ orderDetails.pricing.discount }}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">Shipping Fee</span>
              <span class="breakdown-value">
                {{ orderDetails.pricing.shipping === 0 ? 'FREE' : '₹' + orderDetails.pricing.shipping }}
              </span>
            </div>
            <div class="breakdown-divider"></div>
            <div class="breakdown-item total">
              <span class="breakdown-label">Total Amount Paid</span>
              <span class="breakdown-value">₹{{ orderDetails.pricing.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailsFixed',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderDetails: null,
      // Mock orders data - should match the Orders component
      ordersData: [
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
        },
        {
          id: '10231',
          date: new Date('2024-01-08'),
          status: 'Cancelled',
          total: 799,
          items: [
            {
              id: 7,
              name: 'Exfoliating Face Scrub',
              brand: 'GentleGlow',
              image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
              price: 799,
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
            subtotal: 799,
            tax: 72,
            discount: 72,
            shipping: 0,
            total: 799
          }
        }
      ]
    };
  },
  mounted() {
    this.loadOrderDetails();
  },
  methods: {
    goBackToOrders() {
      this.$router.push('/orders');
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getStatusClass(status) {
      const classes = {
        'Processing': 'processing',
        'Confirmed': 'confirmed',
        'Shipped': 'shipped',
        'Out for Delivery': 'out-for-delivery',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      };
      return classes[status] || 'processing';
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
    }
  }
};
</script>

<style scoped>
.order-details-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf8f6 0%, #f8f4f6 100%);
  padding-top: 150px;
  padding-bottom: 40px;
}

/* Header Styles */
.page-header {
  background: linear-gradient(135deg, #fff 0%, #fef8f6 100%);
  border-bottom: 1px solid #f0e6e6;
  padding: 24px 0;
  margin-top: -150px;
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 2px solid #f0e6e6;
  border-radius: 12px;
  padding: 12px 16px;
  color: #8b4e9f;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-button:hover {
  background: #f8f4f6;
  border-color: #e0d0e0;
  transform: translateX(-2px);
}

.header-main {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0;
  background: linear-gradient(135deg, #8b4e9f 0%, #d946b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #64748b;
  margin: 4px 0 0 0;
  font-size: 14px;
}

/* Market Container */
.market-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Section Styles */
.order-summary-section,
.order-items-section,
.address-section,
.price-breakdown-section {
  padding: 24px 0;
}

.summary-card,
.items-card,
.address-card,
.breakdown-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #f0e6e6;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(139, 78, 159, 0.1);
  transition: all 0.3s ease;
}

.summary-card:hover,
.items-card:hover,
.address-card:hover,
.breakdown-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(139, 78, 159, 0.15);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0 0 24px 0;
}

/* Order Summary */
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.order-id {
  font-size: 24px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0 0 8px 0;
}

.order-date {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.order-status-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-status-badge {
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

.order-status-badge.processing {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
}

.order-status-badge.confirmed {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.order-status-badge.shipped {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #5b21b6;
  border: 1px solid #8b5cf6;
}

.order-status-badge.out-for-delivery {
  background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%);
  color: #c2410c;
  border: 1px solid #f97316;
}

.order-status-badge.delivered {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #15803d;
  border: 1px solid #22c55e;
}

.order-status-badge.cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #ef4444;
}

/* Order Items */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-row {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.item-row:hover {
  background: #f8f4f6;
  border-color: #e9d5ff;
  transform: translateX(4px);
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

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d1b3d;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.item-variant {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-quantity {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #8b4e9f;
}

/* Address Section */
.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.address-content {
  background: #fafafa;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}

.recipient-name {
  font-size: 18px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0 0 8px 0;
}

.recipient-phone {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.recipient-address {
  font-size: 16px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

/* Price Breakdown */
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

.breakdown-label {
  color: #64748b;
  font-weight: 500;
}

.breakdown-value {
  font-weight: 600;
  color: #2d1b3d;
}

.breakdown-item.discount .breakdown-value {
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

.breakdown-item.total .breakdown-label {
  color: #2d1b3d;
}

.breakdown-item.total .breakdown-value {
  color: #8b4e9f;
  font-size: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-details-page {
    padding-top: 120px;
  }
  
  .page-header {
    margin-top: -120px;
  }
  
  .market-container {
    padding: 0 16px;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .order-status-container {
    width: 100%;
    justify-content: space-between;
  }

  .item-row {
    gap: 12px;
    padding: 16px;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .item-name {
    font-size: 14px;
  }

  .breakdown-item {
    font-size: 14px;
  }

  .breakdown-item.total {
    font-size: 16px;
  }

  .breakdown-item.total .breakdown-value {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }

  .order-id {
    font-size: 20px;
  }

  .summary-card,
  .items-card,
  .address-card,
  .breakdown-card {
    padding: 20px;
    border-radius: 16px;
  }
}
</style>
