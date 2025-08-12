<template>
  <transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        
        <div v-if="product" class="product-quick-view">
          <div class="product-image-section">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
              <div v-if="product.onSale" class="sale-badge">Sale</div>
            </div>
          </div>
          
          <div class="product-info-section">
            <div class="product-header">
              <h2 class="product-name">{{ product.name }}</h2>
              <p class="product-brand">{{ product.brand }}</p>
              
              <div class="product-rating">
                <div class="stars">
                  <i 
                    v-for="star in 5" 
                    :key="star"
                    class="fas fa-star"
                    :class="{ active: star <= product.rating }"
                  ></i>
                </div>
                <span class="rating-text">({{ product.reviewCount }} reviews)</span>
              </div>
            </div>
            
            <div class="product-pricing">
              <div class="current-price">${{ product.price.toFixed(2) }}</div>
              <div v-if="product.originalPrice" class="original-price">
                ${{ product.originalPrice.toFixed(2) }}
              </div>
            </div>
            
            <div class="product-description">
              <p>{{ product.description }}</p>
            </div>
            
            <div v-if="product.benefits" class="product-benefits">
              <h4>Key Benefits:</h4>
              <ul>
                <li v-for="benefit in product.benefits.slice(0, 3)" :key="benefit">
                  {{ benefit }}
                </li>
              </ul>
            </div>
            
            <div class="product-actions">
              <div class="quantity-selector">
                <label for="quantity">Quantity:</label>
                <div class="quantity-controls">
                  <button @click="decreaseQuantity" class="qty-btn">
                    <i class="fas fa-minus"></i>
                  </button>
                  <input 
                    id="quantity"
                    type="number" 
                    v-model.number="quantity" 
                    min="1" 
                    max="10"
                    class="quantity-input"
                  >
                  <button @click="increaseQuantity" class="qty-btn">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div class="action-buttons">
                <button
                  @click="handleAddToCart"
                  class="btn btn-primary add-to-cart-btn"
                  :disabled="isAddingToCart"
                >
                  <i class="fas fa-shopping-bag"></i>
                  {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
                </button>
                
                <button 
                  @click="toggleWishlist" 
                  class="btn btn-outline wishlist-btn"
                  :class="{ active: isInWishlist }"
                >
                  <i class="fas fa-heart"></i>
                  {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
                </button>
              </div>
              
              <router-link 
                :to="`/product/${product.id}`" 
                class="btn btn-secondary full-details-btn"
                @click="closeModal"
              >
                View Full Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductQuickView',
  data() {
    return {
      quantity: 1,
      isAddingToCart: false
    };
  },
  computed: {
    ...mapGetters('ui', ['getModal']),
    ...mapGetters('user', ['isInWishlist']),
    isOpen() {
      return this.getModal('productQuickView').open;
    },
    product() {
      return this.getModal('productQuickView').product;
    }
  },
  watch: {
    product(newProduct) {
      if (newProduct) {
        this.quantity = 1;
        this.isAddingToCart = false;
      }
    }
  },
  methods: {
    ...mapActions('ui', ['closeModal', 'showNotification']),
    ...mapActions('cart', ['addToCart']),
    ...mapActions('user', ['toggleWishlist']),
    increaseQuantity() {
      if (this.quantity < 10) {
        this.quantity++;
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    async handleAddToCart() {
      if (!this.product) return;

      this.isAddingToCart = true;

      try {
        await this.addToCart({
          ...this.product,
          quantity: this.quantity
        });

        this.closeModal('productQuickView');
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to add product to cart'
        });
      } finally {
        this.isAddingToCart = false;
      }
    },
    async toggleWishlist() {
      if (!this.product) return;
      
      try {
        const result = await this.toggleWishlist(this.product);
        
        this.showNotification({
          type: 'success',
          message: result.message
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update wishlist'
        });
      }
    }
  }
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter, .modal-leave-to {
  opacity: 0;
}

.modal-enter .modal-content, .modal-leave-to .modal-content {
  transform: scale(0.9);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: scale(1);
  transition: transform 0.3s ease;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--gray-100);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.product-quick-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
}

.product-image-section {
  position: relative;
  background: var(--gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.product-image {
  position: relative;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sale-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--error-500);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.product-info-section {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
  line-height: 1.2;
}

.product-brand {
  color: var(--gray-600);
  font-size: 16px;
  margin-bottom: 16px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: var(--gray-300);
  font-size: 14px;
}

.stars i.active {
  color: var(--warning-500);
}

.rating-text {
  color: var(--gray-500);
  font-size: 14px;
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-price {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-600);
}

.original-price {
  font-size: 20px;
  color: var(--gray-400);
  text-decoration: line-through;
}

.product-description {
  color: var(--gray-600);
  line-height: 1.6;
}

.product-benefits h4 {
  color: var(--gray-800);
  margin-bottom: 8px;
  font-size: 16px;
}

.product-benefits ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.product-benefits li {
  padding: 4px 0;
  color: var(--gray-600);
  position: relative;
  padding-left: 20px;
}

.product-benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success-500);
  font-weight: 600;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.quantity-selector label {
  font-weight: 500;
  color: var(--gray-700);
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  background: var(--gray-100);
  border: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.quantity-input {
  width: 60px;
  height: 36px;
  border: none;
  text-align: center;
  font-weight: 500;
  background: white;
}

.quantity-input:focus {
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.add-to-cart-btn {
  flex: 1;
  gap: 8px;
}

.wishlist-btn {
  flex-shrink: 0;
  gap: 8px;
  min-width: 160px;
}

.wishlist-btn.active {
  background: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

.full-details-btn {
  width: 100%;
  text-align: center;
}

@media (max-width: 768px) {
  .product-quick-view {
    grid-template-columns: 1fr;
  }
  
  .product-image-section {
    padding: 24px;
  }
  
  .product-info-section {
    padding: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
}
</style>
