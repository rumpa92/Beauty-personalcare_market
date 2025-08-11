<template>
  <div class="orders-page market-container">
    <div class="orders-header">
      <h1 class="market-title-xl">My Orders</h1>
      <p class="market-text-light">Track and manage your beauty purchases</p>
    </div>

    <!-- Order Status Filter -->
    <div class="order-filters">
      <div class="filter-tabs">
        <button 
          v-for="status in orderStatuses" 
          :key="status.key"
          @click="activeFilter = status.key"
          class="filter-tab"
          :class="{ active: activeFilter === status.key }"
        >
          <i :class="status.icon"></i>
          {{ status.label }}
          <span v-if="getOrderCountByStatus(status.key)" class="filter-count">
            {{ getOrderCountByStatus(status.key) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Orders List -->
    <div class="orders-content">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-box-open"></i>
        </div>
        <h3>No Orders Found</h3>
        <p>{{ getEmptyStateMessage() }}</p>
        <router-link to="/products" class="market-btn market-btn-primary">
          Start Shopping
        </router-link>
      </div>

      <div v-else class="orders-list">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="order-card market-card"
        >
          <div class="order-header">
            <div class="order-info">
              <h3 class="order-number">Order #{{ order.id }}</h3>
              <div class="order-meta">
                <span class="order-date">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(order.date) }}
                </span>
                <span class="order-total">
                  <i class="fas fa-dollar-sign"></i>
                  ${{ calculateOrderTotal(order).toFixed(2) }}
                </span>
              </div>
            </div>
            <div class="order-status">
              <span 
                class="status-badge" 
                :class="getStatusClass(order.status)"
              >
                <i :class="getStatusIcon(order.status)"></i>
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <div 
              v-for="item in order.items" 
              :key="item.name"
              class="order-item"
            >
              <div class="item-image">
                <img 
                  :src="item.image || 'https://images.unsplash.com/photo-1556229174-f25e97436b3d?w=100'" 
                  :alt="item.name"
                  @error="handleImageError"
                >
              </div>
              <div class="item-details">
                <h4 class="item-name">{{ item.name }}</h4>
                <div class="item-meta">
                  <span class="item-quantity">Qty: {{ item.quantity }}</span>
                  <span class="item-price">${{ item.price.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Information -->
          <div v-if="order.address" class="delivery-info">
            <div class="delivery-header">
              <i class="fas fa-truck"></i>
              <span>Delivery Information</span>
            </div>
            <p class="delivery-address">{{ order.address }}</p>
            <div v-if="order.estimatedDelivery" class="delivery-date">
              <span class="delivery-label">Estimated Delivery:</span>
              <span class="delivery-value">{{ formatDate(order.estimatedDelivery) }}</span>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="order-actions">
            <button 
              v-if="canTrackOrder(order.status)"
              @click="trackOrder(order.id)"
              class="action-btn track-btn"
            >
              <i class="fas fa-map-marker-alt"></i>
              Track Order
            </button>
            
            <button 
              v-if="order.canReschedule && canRescheduleOrder(order.status)"
              @click="rescheduleOrder(order)"
              class="action-btn reschedule-btn"
            >
              <i class="fas fa-calendar-alt"></i>
              Reschedule
            </button>
            
            <button 
              v-if="canReorderItems(order.status)"
              @click="reorderItems(order)"
              class="action-btn reorder-btn"
            >
              <i class="fas fa-redo"></i>
              Reorder
            </button>
            
            <button 
              v-if="canRequestRefund(order.status)"
              @click="requestRefund(order)"
              class="action-btn refund-btn"
            >
              <i class="fas fa-undo"></i>
              Request Refund
            </button>
            
            <button 
              @click="viewOrderDetails(order)"
              class="action-btn details-btn"
            >
              <i class="fas fa-eye"></i>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <div v-if="showRescheduleModal" class="modal-overlay" @click="closeRescheduleModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Reschedule Delivery</h3>
          <button @click="closeRescheduleModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Order #{{ selectedOrder?.id }}</p>
          <div class="reschedule-form">
            <div class="form-group">
              <label class="market-form-label">New Delivery Date</label>
              <input 
                type="date" 
                v-model="rescheduleData.date"
                :min="getMinDeliveryDate()"
                class="market-form-input"
              >
            </div>
            <div class="form-group">
              <label class="market-form-label">Preferred Time</label>
              <select v-model="rescheduleData.time" class="market-form-input">
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                <option value="evening">Evening (5 PM - 8 PM)</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeRescheduleModal" class="market-btn market-btn-secondary">
            Cancel
          </button>
          <button @click="confirmReschedule" class="market-btn market-btn-primary">
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Orders',
  data() {
    return {
      activeFilter: 'all',
      showRescheduleModal: false,
      selectedOrder: null,
      rescheduleData: {
        date: '',
        time: 'afternoon'
      },
      orderStatuses: [
        { key: 'all', label: 'All Orders', icon: 'fas fa-list' },
        { key: 'active', label: 'Active', icon: 'fas fa-clock' },
        { key: 'delivered', label: 'Delivered', icon: 'fas fa-check-circle' },
        { key: 'cancelled', label: 'Cancelled', icon: 'fas fa-times-circle' }
      ]
    };
  },
  computed: {
    ...mapGetters('user', ['userOrders']),
    filteredOrders() {
      if (this.activeFilter === 'all') {
        return this.userOrders;
      } else if (this.activeFilter === 'active') {
        return this.userOrders.filter(order => 
          ['Processing', 'Shipped', 'In Transit', 'Out for Delivery'].includes(order.status)
        );
      } else if (this.activeFilter === 'delivered') {
        return this.userOrders.filter(order => order.status === 'Delivered');
      } else if (this.activeFilter === 'cancelled') {
        return this.userOrders.filter(order => order.status === 'Cancelled');
      }
      return this.userOrders;
    }
  },
  methods: {
    ...mapActions('user', ['rescheduleOrder', 'updateOrderStatus']),
    ...mapActions('ui', ['showNotification']),
    ...mapActions('cart', ['addToCart']),

    getOrderCountByStatus(status) {
      if (status === 'all') return this.userOrders.length;
      if (status === 'active') {
        return this.userOrders.filter(order => 
          ['Processing', 'Shipped', 'In Transit', 'Out for Delivery'].includes(order.status)
        ).length;
      }
      if (status === 'delivered') {
        return this.userOrders.filter(order => order.status === 'Delivered').length;
      }
      if (status === 'cancelled') {
        return this.userOrders.filter(order => order.status === 'Cancelled').length;
      }
      return 0;
    },

    getEmptyStateMessage() {
      if (this.activeFilter === 'all') {
        return "You haven't placed any orders yet. Start exploring our beautiful products!";
      } else if (this.activeFilter === 'active') {
        return "No active orders found.";
      } else if (this.activeFilter === 'delivered') {
        return "No delivered orders found.";
      } else if (this.activeFilter === 'cancelled') {
        return "No cancelled orders found.";
      }
      return "";
    },

    formatDate(date) {
      if (!date) return '';
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(date).toLocaleDateString('en-US', options);
    },

    calculateOrderTotal(order) {
      return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getStatusClass(status) {
      const statusMap = {
        'Processing': 'status-processing',
        'Shipped': 'status-shipped',
        'In Transit': 'status-transit',
        'Out for Delivery': 'status-delivery',
        'Delivered': 'status-delivered',
        'Cancelled': 'status-cancelled'
      };
      return statusMap[status] || 'status-default';
    },

    getStatusIcon(status) {
      const iconMap = {
        'Processing': 'fas fa-clock',
        'Shipped': 'fas fa-shipping-fast',
        'In Transit': 'fas fa-truck',
        'Out for Delivery': 'fas fa-truck-loading',
        'Delivered': 'fas fa-check-circle',
        'Cancelled': 'fas fa-times-circle'
      };
      return iconMap[status] || 'fas fa-info-circle';
    },

    canTrackOrder(status) {
      return ['Shipped', 'In Transit', 'Out for Delivery'].includes(status);
    },

    canRescheduleOrder(status) {
      return ['Processing', 'Shipped'].includes(status);
    },

    canReorderItems(status) {
      return ['Delivered', 'Cancelled'].includes(status);
    },

    canRequestRefund(status) {
      return status === 'Delivered';
    },

    trackOrder(orderId) {
      this.$router.push(`/order-tracking/${orderId}`);
    },

    rescheduleOrder(order) {
      this.selectedOrder = order;
      this.showRescheduleModal = true;
      this.rescheduleData.date = this.formatDateForInput(order.estimatedDelivery);
    },

    closeRescheduleModal() {
      this.showRescheduleModal = false;
      this.selectedOrder = null;
      this.rescheduleData = { date: '', time: 'afternoon' };
    },

    async confirmReschedule() {
      try {
        await this.rescheduleOrder({
          orderId: this.selectedOrder.id,
          newDate: this.rescheduleData.date,
          newTime: this.rescheduleData.time
        });
        
        this.showNotification({
          type: 'success',
          message: 'Delivery rescheduled successfully'
        });
        
        this.closeRescheduleModal();
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to reschedule delivery. Please try again.'
        });
      }
    },

    async reorderItems(order) {
      try {
        for (const item of order.items) {
          await this.addToCart({
            id: item.id || Math.random().toString(36).substr(2, 9),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || 'https://images.unsplash.com/photo-1556229174-f25e97436b3d?w=300'
          });
        }
        
        this.showNotification({
          type: 'success',
          message: `${order.items.length} items added to cart`
        });
        
        this.$router.push('/cart');
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to add items to cart. Please try again.'
        });
      }
    },

    requestRefund(order) {
      this.$router.push(`/refund-request/${order.id}`);
    },

    viewOrderDetails(order) {
      this.showNotification({
        type: 'info',
        message: `Viewing details for Order #${order.id}`
      });
    },

    formatDateForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },

    getMinDeliveryDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    },

    handleImageError(event) {
      event.target.src = 'https://images.unsplash.com/photo-1556229174-f25e97436b3d?w=100';
    }
  }
};
</script>

<style scoped>
.orders-page {
  padding: 120px 0 60px;
  min-height: 100vh;
}

.orders-header {
  text-align: center;
  margin-bottom: 40px;
}

.orders-header h1 {
  color: var(--market-text);
  margin-bottom: 8px;
}

.orders-header p {
  font-size: 18px;
  color: var(--market-text-light);
}

/* Order Filters */
.order-filters {
  margin-bottom: 32px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid var(--market-border);
  border-radius: 25px;
  background: var(--market-surface);
  color: var(--market-text);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.filter-tab:hover {
  border-color: var(--market-primary);
  background: var(--market-secondary);
}

.filter-tab.active {
  background: var(--market-gradient);
  color: white;
  border-color: transparent;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  color: var(--market-text-light);
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 24px;
  color: var(--market-text);
  margin-bottom: 12px;
}

.empty-state p {
  color: var(--market-text-light);
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  border: 1px solid var(--market-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.order-card:hover {
  border-color: var(--market-primary);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--market-border);
}

.order-number {
  font-size: 20px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 8px;
}

.order-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: var(--market-text-light);
}

.order-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-processing {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  color: #92400e;
}

.status-shipped {
  background: linear-gradient(135deg, #dbeafe, #3b82f6);
  color: #1e40af;
}

.status-transit {
  background: linear-gradient(135deg, #e0e7ff, #6366f1);
  color: #4338ca;
}

.status-delivery {
  background: linear-gradient(135deg, #fce7f3, #ec4899);
  color: #be185d;
}

.status-delivered {
  background: linear-gradient(135deg, #d1fae5, #10b981);
  color: #065f46;
}

.status-cancelled {
  background: linear-gradient(135deg, #fee2e2, #ef4444);
  color: #991b1b;
}

/* Order Items */
.order-items {
  padding: 20px 24px;
  border-bottom: 1px solid var(--market-border);
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
}

.order-item:not(:last-child) {
  border-bottom: 1px solid var(--market-border);
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
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
  color: var(--market-text);
  margin-bottom: 4px;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--market-text-light);
}

.item-price {
  font-weight: 600;
  color: var(--market-primary);
}

/* Delivery Information */
.delivery-info {
  padding: 20px 24px;
  background: var(--market-secondary);
  border-bottom: 1px solid var(--market-border);
}

.delivery-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 8px;
}

.delivery-address {
  color: var(--market-text-light);
  margin-bottom: 8px;
}

.delivery-date {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.delivery-label {
  color: var(--market-text-light);
}

.delivery-value {
  font-weight: 600;
  color: var(--market-primary);
}

/* Order Actions */
.order-actions {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid var(--market-border);
  border-radius: 8px;
  background: var(--market-surface);
  color: var(--market-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--market-primary);
  background: var(--market-secondary);
  color: var(--market-primary);
}

.track-btn:hover {
  background: linear-gradient(135deg, #dbeafe, #3b82f6);
  color: #1e40af;
  border-color: #3b82f6;
}

.reorder-btn:hover {
  background: linear-gradient(135deg, #d1fae5, #10b981);
  color: #065f46;
  border-color: #10b981;
}

.refund-btn:hover {
  background: linear-gradient(135deg, #fee2e2, #ef4444);
  color: #991b1b;
  border-color: #ef4444;
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
  padding: 20px;
}

.modal-content {
  background: var(--market-surface);
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--market-border);
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--market-text);
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--market-text-light);
  cursor: pointer;
  padding: 4px;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid var(--market-border);
}

.reschedule-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .orders-page {
    padding: 100px 16px 60px;
  }

  .order-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .order-meta {
    flex-direction: column;
    gap: 8px;
  }

  .order-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }

  .filter-tabs {
    flex-direction: column;
    align-items: center;
  }

  .filter-tab {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .item-meta {
    width: 100%;
  }

  .delivery-date {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
