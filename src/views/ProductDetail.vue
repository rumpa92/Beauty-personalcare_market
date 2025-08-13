<template>
  <div class="product-detail-page" v-if="product">
    <!-- Main Product Section -->
    <div class="main-product-container">
      <div class="product-content">
        <!-- Product Image -->
        <div class="product-image-section">
          <div class="image-container">
            <img :src="product.images[0]" :alt="product.name" class="main-product-image" />
            <div class="image-controls">
              <button class="control-btn prev">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="control-btn next">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Product Information -->
        <div class="product-info-section">
          <h1 class="product-name">{{ product.name }}</h1>
          
          <!-- Rating -->
          <div class="rating-section">
            <div class="stars">
              <i v-for="i in 5" :key="i" 
                 :class="['fas fa-star', { filled: i <= Math.floor(product.rating) }]"></i>
            </div>
            <span class="review-count">({{ product.reviewCount }} Reviews)</span>
          </div>

          <!-- Price -->
          <div class="price-section">
            <span class="current-price">${{ formatPrice(currentPrice) }}</span>
            <span v-if="originalPrice && originalPrice > currentPrice" class="original-price">
              ${{ formatPrice(originalPrice) }}
            </span>
          </div>

          <!-- Color Selection -->
          <div class="selection-group">
            <label class="selection-label">Selected Color: <span class="selected-value">{{ selectedColorName }}</span></label>
            <div class="color-options">
              <button 
                v-for="color in product.colors" 
                :key="color.id"
                @click="selectColor(color)"
                :class="['color-option', { active: selectedColor === color.id }]"
                :style="{ backgroundColor: color.hex }"
                :title="color.name"
              ></button>
            </div>
          </div>

          <!-- Size Selection -->
          <div class="selection-group">
            <div class="size-options">
              <button 
                v-for="size in product.sizes" 
                :key="size.id"
                @click="selectSize(size)"
                :class="['size-option', { active: selectedSize === size.id }]"
              >
                {{ size.value }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="quantity-section">
            <label class="quantity-label">Quantity</label>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" class="quantity-btn">-</button>
              <span class="quantity-value">{{ quantity }}</span>
              <button @click="increaseQuantity" class="quantity-btn">+</button>
              <button @click="removeItem" class="remove-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="addToCart" class="add-to-cart-btn">Add to Cart</button>
            <button @click="openRatingModal" class="rating-review-btn">Rating & Review</button>
          </div>

          <!-- Delivery Info -->
          <div class="delivery-info">
            <div class="delivery-item">
              <div class="delivery-icon">
                <i class="fas fa-truck"></i>
              </div>
              <div class="delivery-text">
                <div class="delivery-title">Free Standard Delivery</div>
                <div class="delivery-subtitle">Estimated delivery: 3-5 business days</div>
              </div>
            </div>
            <div class="delivery-item">
              <div class="delivery-icon">
                <i class="fas fa-undo"></i>
              </div>
              <div class="delivery-text">
                <div class="delivery-title">Free Returns</div>
                <div class="delivery-subtitle">30-day return policy for unworn items</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product details section -->
    <section class="product-details-section">
      <div class="details-container">
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button
            @click="activeTab = 'details'"
            :class="['tab-btn', { active: activeTab === 'details' }]"
          >
            Description
          </button>
          <button
            @click="activeTab = 'care'"
            :class="['tab-btn', { active: activeTab === 'care' }]"
          >
            Additional Information
          </button>
          <button
            @click="activeTab = 'review'"
            :class="['tab-btn', { active: activeTab === 'review' }]"
          >
            Review
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <div v-if="activeTab === 'details'" class="tab-panel">
            <p class="product-description">Experience bold, long-lasting color with our Matte Lipstick Collection designed for all-day wear without drying your lips. Each shade glides on smoothly, delivering rich pigmentation and a soft, velvety finish. From everyday nudes to statement reds, this collection has the perfect color for every mood and occasion. Lightweight, transfer-resistant, and infused with nourishing ingredients to keep your lips comfortable and beautiful all day.</p>
          </div>
          <div v-if="activeTab === 'care'" class="tab-panel">
            <ul class="care-instructions">
              <li v-for="instruction in product.careInstructions" :key="instruction">{{ instruction }}</li>
            </ul>
          </div>
          <div v-if="activeTab === 'review'" class="tab-panel">
            <p class="product-description">Customer reviews will be displayed here.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- You May Also Like -->
    <section class="related-products-section">
      <div class="related-container">
        <h2 class="section-title">Beauty & Personal Care You May Also Like</h2>
        <div class="products-grid">
          <div v-for="product in relatedProducts.slice(0, 5)" :key="product.id" class="product-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <button class="wishlist-btn" :class="{ active: product.isWishlisted }">
                <i class="fas fa-heart"></i>
              </button>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price">${{ product.price }}</div>
              <button @click="addRelatedToCart(product)" class="add-to-cart-btn">Add to cart</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Product Not Found -->
  <div v-else-if="!loading" class="product-not-found">
    <div class="market-container">
      <div class="not-found-content">
        <i class="fas fa-search not-found-icon"></i>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <router-link to="/" class="back-home-btn">
          <i class="fas fa-arrow-left"></i>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductDetail',
  data() {
    return {
      loading: true,
      product: null,
      activeTab: 'details',
      selectedColor: 'red',
      selectedSize: 's',
      quantity: 1,
      
      // Sample fashion product data
      sampleProduct: {
        id: 1,
        name: 'Silk Blend Maxi Dress',
        brand: 'Fashion Brand',
        price: 299.00,
        originalPrice: 399.00,
        category: 'fashion',
        rating: 4.5,
        reviewCount: 238,
        description: 'A stunning silk blend maxi dress perfect for any special occasion. Features a flattering A-line silhouette and elegant drape.',
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop'
        ],
        colors: [
          { id: 'red', name: 'Red', hex: '#DC2626' },
          { id: 'orange', name: 'Orange', hex: '#EA580C' },
          { id: 'blue', name: 'Blue', hex: '#2563EB' },
          { id: 'green', name: 'Green', hex: '#059669' },
          { id: 'purple', name: 'Purple', hex: '#7C3AED' }
        ],
        sizes: [
          { id: 'xxs', value: 'XXS' },
          { id: 'xs', value: 'XS' },
          { id: 's', value: 'S' },
          { id: 'm', value: 'M' },
          { id: 'l', value: 'L' }
        ],
        features: [
          '95% Silk, 5% Elastane',
          'Side slit detail',
          'Adjustable straps',
          'Back zipper closure',
          'Made in Italy'
        ],
        careInstructions: [
          'Dry clean only',
          'Do not bleach',
          'Iron on low heat',
          'Store hanging'
        ]
      },

      ratingBreakdown: [
        { stars: 5, percentage: 60 },
        { stars: 4, percentage: 20 },
        { stars: 3, percentage: 10 },
        { stars: 2, percentage: 7 },
        { stars: 1, percentage: 3 }
      ],

    };
  },
  
  computed: {
    ...mapGetters('products', ['productById', 'allProducts']),

    productId() {
      return parseInt(this.$route.params.id);
    },

    currentPrice() {
      return this.product?.price || 0;
    },

    originalPrice() {
      return this.product?.originalPrice;
    },

    selectedColorName() {
      const color = this.product?.colors?.find(c => c.id === this.selectedColor);
      return color ? color.name : 'Red';
    },

    // Get beauty & personal care products for "You May Also Like"
    relatedProducts() {
      if (!this.product) return [];

      // Filter beauty and personal care products (excluding current product)
      const beautyCategories = ['skincare', 'makeup', 'haircare', 'fragrance', 'tools'];
      return this.allProducts
        .filter(p =>
          p.id !== this.product.id &&
          beautyCategories.includes(p.category)
        )
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          isWishlisted: false // You can connect this to wishlist state later
        }));
    },

    productReviews() {
      return [
        {
          id: 1,
          userName: 'Jane Cooper',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=50&h=50&fit=crop&crop=face',
          rating: 5,
          title: 'Very Good',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
          id: 2,
          userName: 'Jane Cooper',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          rating: 4,
          title: 'Very Good',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
        },
        {
          id: 3,
          userName: 'Jane Cooper',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          rating: 5,
          title: 'Very Good',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        }
      ];
    }
  },
  
  methods: {
    ...mapActions('cart', ['addToCart']),
    
    async loadProduct() {
      this.loading = true;
      try {
        // Get product from store by ID
        let product = this.productById(this.productId);

        if (product) {
          // Enhance the store product with additional data needed for the UI
          this.product = this.enhanceProductData(product);
        } else {
          // Fallback to sample product if ID not found
          this.product = this.sampleProduct;
        }
      } catch (error) {
        console.error('Error loading product:', error);
        this.product = null;
      } finally {
        this.loading = false;
      }
    },
    
    selectColor(color) {
      this.selectedColor = color.id;
    },
    
    selectSize(size) {
      this.selectedSize = size.id;
    },
    
    increaseQuantity() {
      this.quantity++;
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    
    removeItem() {
      this.quantity = 1;
    },
    
    addToCart() {
      console.log('Adding to cart:', {
        product: this.product,
        color: this.selectedColor,
        size: this.selectedSize,
        quantity: this.quantity
      });
    },
    
    openRatingModal() {
      console.log('Opening rating modal');
    },
    
    showAllReviews() {
      console.log('Showing all reviews');
    },
    
    addRelatedToCart(product) {
      console.log('Adding related product to cart:', product);
      // Navigate to the clicked product
      this.$router.push(`/product/${product.id}`);
    },

    enhanceProductData(storeProduct) {
      // Convert store product data to the format expected by the UI
      return {
        ...storeProduct,
        images: [storeProduct.image, storeProduct.image], // Use main image
        colors: storeProduct.colors ? storeProduct.colors.map((color, index) => ({
          id: color.toLowerCase().replace(/\s+/g, '-'),
          name: color,
          hex: this.getColorHex(color)
        })) : [
          { id: 'red', name: 'Red', hex: '#DC2626' },
          { id: 'blue', name: 'Blue', hex: '#2563EB' },
          { id: 'green', name: 'Green', hex: '#059669' }
        ],
        sizes: storeProduct.sizes || [
          { id: 'xs', value: 'XS' },
          { id: 's', value: 'S' },
          { id: 'm', value: 'M' },
          { id: 'l', value: 'L' }
        ],
        features: storeProduct.ingredients || storeProduct.benefits || [
          'Premium quality materials',
          'Dermatologically tested',
          'Suitable for all skin types'
        ],
        careInstructions: [
          'Store in a cool, dry place',
          'Keep away from direct sunlight',
          'For external use only',
          'Discontinue use if irritation occurs'
        ]
      };
    },

    getColorHex(colorName) {
      const colorMap = {
        'Ruby Red': '#DC143C',
        'Berry Bliss': '#8B008B',
        'Nude Rose': '#E6B3B3',
        'Coral Dream': '#FF7F50',
        'Red': '#DC2626',
        'Blue': '#2563EB',
        'Green': '#059669',
        'Purple': '#7C3AED',
        'Orange': '#EA580C',
        'Champagne': '#F7E7CE',
        'Rose Gold': '#E8B4A0',
        'Bronze': '#CD7F32',
        'Pearl': '#F8F6F0'
      };
      return colorMap[colorName] || '#DC2626';
    },

    formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    }
  },
  
  async created() {
    await this.loadProduct();
  },

  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: false
    }
  }
};
</script>

<style scoped>
.product-detail-page {
  background: #f8f9fa;
  min-height: 100vh;
}

/* Purple Header */
.purple-header {
  background: #663399;
  color: white;
  padding: 20px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.category-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

/* Main Product Section */
.main-product-container {
  background: white;
  margin-top: 8px;
  padding: 26px 0 40px;
}

.product-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.product-image-section {
  position: relative;
}

.image-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.main-product-image {
  width: 100%;
  height: 600px;
  object-fit: cover;
  display: block;
}

.image-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
}

.control-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: all;
  color: #333;
  font-size: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: white;
  transform: scale(1.1);
}

/* Product Information */
.product-info-section {
  padding: 20px 0;
}

.product-name {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: #ddd;
  font-size: 18px;
}

.stars i.filled {
  color: #ffc107;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.price-section {
  margin-bottom: 24px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.original-price {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
  margin-left: 12px;
}

/* Selection Groups */
.selection-group {
  margin-bottom: 24px;
}

.selection-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.selected-value {
  font-weight: 700;
}

.color-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.color-option.active {
  border-color: #333;
  transform: scale(1.1);
}

.color-option::after {
  content: '';
  position: absolute;
  inset: -6px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.3s ease;
}

.color-option.active::after {
  border-color: #333;
}

.size-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-option {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
  text-align: center;
}

.size-option:hover {
  border-color: #663399;
}

.size-option.active {
  background: #663399;
  color: white;
  border-color: #663399;
}

/* Quantity Section */
.quantity-section {
  margin-bottom: 32px;
}

.quantity-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-btn {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  border-color: #663399;
  color: #663399;
}

.quantity-value {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.remove-btn {
  background: #ff4757;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #ff3742;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.add-to-cart-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.add-to-cart-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.rating-review-btn {
  background: #663399;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.rating-review-btn:hover {
  background: #552288;
  transform: translateY(-2px);
}

/* Delivery Info */
.delivery-info {
  border-top: 1px solid #eee;
  padding-top: 24px;
}

.delivery-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.delivery-icon {
  width: 50px;
  height: 50px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #663399;
  font-size: 20px;
}

.delivery-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.delivery-subtitle {
  color: #666;
  font-size: 14px;
}

/* Product Details Section */
.product-details-section {
  background: white;
  padding: 60px 0;
  border-top: 1px solid #eee;
  margin-bottom: -4px;
}

.details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
}

.tab-navigation {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  background: none;
  border: none;
  padding: 16px 32px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn.active {
  color: #333;
  border-bottom-color: #663399;
  background: #f8f9fa;
}

.tab-btn:hover {
  color: #333;
}

.tab-content {
  min-height: 0px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

.product-description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 24px;
}

.product-features,
.care-instructions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-features li,
.care-instructions li {
  padding: 8px 0;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.product-features li::before,
.care-instructions li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #663399;
  font-weight: bold;
}

/* Reviews Section */
.reviews-section {
  background: #f8f9fa;
  padding: 60px 0;
}

.reviews-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.reviews-header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 60px;
  margin-bottom: 40px;
  align-items: start;
}

.overall-rating {
  text-align: center;
}

.rating-score {
  font-size: 64px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 8px;
}

.rating-stars {
  margin-bottom: 8px;
}

.rating-stars i {
  color: #ddd;
  font-size: 20px;
  margin: 0 1px;
}

.rating-stars i.filled {
  color: #ffc107;
}

.rating-text {
  color: #666;
  font-size: 14px;
}

.rating-breakdown {
  max-width: 400px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.bar-label {
  font-size: 14px;
  color: #666;
  min-width: 50px;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #ffc107;
  transition: width 0.3s ease;
}

.bar-percentage {
  font-size: 14px;
  color: #666;
  min-width: 35px;
  text-align: right;
}

/* Reviews List */
.reviews-list {
  margin-bottom: 32px;
}

.review-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.review-rating {
  margin-bottom: 4px;
}

.review-rating i {
  color: #ddd;
  font-size: 14px;
}

.review-rating i.filled {
  color: #ffc107;
}

.review-title {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.review-text {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.see-all-btn {
  background: #4a4a9e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
}

.see-all-btn:hover {
  background: #3d3d8a;
  transform: translateY(-2px);
}

/* Related Products */
.related-products-section {
  background: white;
  padding: 60px 0;
  margin-top: -5px;
}

.related-container {
  max-width: 1200px;
  margin: 5px auto 0;
  padding: 0 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.wishlist-btn:hover {
  background: white;
  color: #dc3545;
}

.wishlist-btn.active {
  color: #dc3545;
  background: white;
}

.product-info {
  padding: 20px;
}

.product-card .product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.product-card .add-to-cart-btn {
  width: 100%;
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card .add-to-cart-btn:hover {
  background: #663399;
  color: white;
  border-color: #663399;
}

/* Product Not Found */
.product-not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
  max-width: 400px;
}

.not-found-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 24px;
}

.not-found-content h2 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.not-found-content p {
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.back-home-btn {
  background: #663399;
  color: white;
  text-decoration: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  background: #552288;
  transform: translateY(-2px);
  text-decoration: none;
  color: white;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .main-product-image {
    height: 400px;
  }
  
  .product-name {
    font-size: 28px;
  }
  
  .current-price {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .reviews-header {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .rating-score {
    font-size: 48px;
  }
}

@media (max-width: 480px) {
  .purple-header,
  .main-product-container,
  .product-details-section,
  .reviews-section,
  .related-products-section {
    padding: 20px 0;
  }
  
  .header-container,
  .product-content,
  .details-container,
  .reviews-container,
  .related-container {
    padding: 0 16px;
  }
  
  .products-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
