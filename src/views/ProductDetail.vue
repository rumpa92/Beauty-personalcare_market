<template>
  <div class="product-detail-page" v-if="product">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-container">
      <div class="market-container">
        <nav class="breadcrumb">
          <router-link to="/" class="breadcrumb-item">Home</router-link>
          <i class="fas fa-chevron-right"></i>
          <router-link :to="`/category/${product.category}`" class="breadcrumb-item">
            {{ getCategoryName(product.category) }}
          </router-link>
          <i class="fas fa-chevron-right"></i>
          <span class="breadcrumb-item current">{{ product.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Main Product Section -->
    <section class="product-hero">
      <div class="market-container">
        <div class="product-layout">
          <!-- Left: Image Carousel -->
          <div class="product-images">
            <ProductImageCarousel
              :images="product.images"
              :product-name="product.name"
              :product-brand="product.brand"
            />
          </div>

          <!-- Right: Product Information -->
          <div class="product-info">
            <!-- Product Header -->
            <div class="product-header">
              <div class="brand-name">{{ product.brand }}</div>
              <h1 class="product-title">{{ product.name }}</h1>
              
              <!-- Rating and Reviews -->
              <div class="rating-section">
                <div class="rating-display">
                  <div class="stars">
                    <i 
                      v-for="i in 5" 
                      :key="i"
                      class="star"
                      :class="{ filled: i <= Math.floor(product.rating) }"
                    >★</i>
                  </div>
                  <span class="rating-text">{{ product.rating }} ({{ product.reviewCount }} reviews)</span>
                </div>
                <button @click="scrollToReviews" class="view-reviews-btn">
                  View All Reviews
                </button>
              </div>
            </div>

            <!-- Price Section -->
            <div class="price-section">
              <div class="price-display">
                <span class="current-price">₹{{ formatPrice(currentPrice) }}</span>
                <span v-if="originalPrice && originalPrice > currentPrice" class="original-price">
                  ₹{{ formatPrice(originalPrice) }}
                </span>
                <span v-if="discountPercentage" class="discount-badge">
                  {{ discountPercentage }}% OFF
                </span>
              </div>
              <div v-if="product.paymentOptions" class="payment-options">
                <span class="emi-text">or pay ₹{{ formatPrice(Math.ceil(currentPrice / 12)) }}/month</span>
              </div>
            </div>

            <!-- Product Description -->
            <div class="description-section">
              <p class="product-description">{{ product.description }}</p>
            </div>

            <!-- Key Benefits -->
            <div v-if="product.benefits" class="benefits-section">
              <h4 class="benefits-title">Key Benefits</h4>
              <div class="benefits-list">
                <div v-for="benefit in product.benefits" :key="benefit" class="benefit-item">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ benefit }}</span>
                </div>
              </div>
            </div>

            <!-- Variant Selection -->
            <div class="variants-section">
              <VariantSelector
                :sizes="product.sizes"
                :colors="product.colors"
                :bundles="product.bundles"
                :default-size="defaultSize"
                :default-color="defaultColor"
                @variant-change="handleVariantChange"
                @size-selected="handleSizeSelected"
                @color-selected="handleColorSelected"
              />
            </div>

            <!-- Add to Cart Section -->
            <div class="add-to-cart-section">
              <AddToCartButton
                :product="product"
                :selected-variant="selectedVariant"
                :available-stock="availableStock"
                :max-quantity="maxQuantity"
                @added-to-cart="handleAddedToCart"
                @show-cart-confirmation="showCartConfirmation"
              />
            </div>

            <!-- Trust Indicators -->
            <div class="trust-indicators">
              <div class="trust-item">
                <i class="fas fa-shield-alt"></i>
                <div class="trust-content">
                  <div class="trust-title">Authenticity Guaranteed</div>
                  <div class="trust-subtitle">100% genuine products</div>
                </div>
              </div>
              <div class="trust-item">
                <i class="fas fa-truck"></i>
                <div class="trust-content">
                  <div class="trust-title">Free Shipping</div>
                  <div class="trust-subtitle">On orders above ₹499</div>
                </div>
              </div>
              <div class="trust-item">
                <i class="fas fa-undo"></i>
                <div class="trust-content">
                  <div class="trust-title">Easy Returns</div>
                  <div class="trust-subtitle">7-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Details Tabs -->
    <section class="product-details-section">
      <div class="market-container">
        <div class="details-container">
          <!-- Tab Navigation -->
          <div class="tabs-navigation">
            <button 
              v-for="tab in detailTabs" 
              :key="tab.id"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              @click="setActiveTab(tab.id)"
            >
              <i :class="tab.icon"></i>
              {{ tab.title }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- How to Use Tab -->
            <div v-if="activeTab === 'how-to-use'" class="tab-panel">
              <HowToUseSection
                :usage-steps="product.howToUse"
                :quick-ref="product.quickRef"
                :routine-suggestions="product.routineSuggestions"
                :dos-donts="product.dosDonts"
                :faqs="product.faqs"
                :video-tutorial="product.videoTutorial"
              />
            </div>

            <!-- Ingredients Tab -->
            <div v-if="activeTab === 'ingredients'" class="tab-panel">
              <div class="ingredients-content">
                <h3 class="ingredients-title">Key Ingredients</h3>
                <div class="ingredients-grid">
                  <div 
                    v-for="ingredient in product.ingredients" 
                    :key="ingredient.name" 
                    class="ingredient-card"
                  >
                    <div class="ingredient-icon">
                      <i :class="ingredient.icon || 'fas fa-leaf'"></i>
                    </div>
                    <div class="ingredient-info">
                      <h4 class="ingredient-name">{{ ingredient.name }}</h4>
                      <p class="ingredient-benefit">{{ ingredient.benefit }}</p>
                      <div v-if="ingredient.concentration" class="ingredient-concentration">
                        {{ ingredient.concentration }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews Tab -->
            <div v-if="activeTab === 'reviews'" class="tab-panel">
              <RatingsReviews
                :product-id="product.id"
                :brand-name="product.brand"
                :reviews="productReviews"
                @review-submitted="handleReviewSubmitted"
              />
            </div>

            <!-- Shipping & Returns Tab -->
            <div v-if="activeTab === 'shipping'" class="tab-panel">
              <div class="shipping-content">
                <h3>Shipping & Returns</h3>
                
                <div class="shipping-info-grid">
                  <div class="shipping-card">
                    <i class="fas fa-shipping-fast"></i>
                    <h4>Standard Shipping</h4>
                    <p>3-5 business days</p>
                    <span class="shipping-price">Free on orders ₹499+</span>
                  </div>
                  
                  <div class="shipping-card">
                    <i class="fas fa-bolt"></i>
                    <h4>Express Shipping</h4>
                    <p>1-2 business days</p>
                    <span class="shipping-price">₹99</span>
                  </div>
                  
                  <div class="shipping-card">
                    <i class="fas fa-clock"></i>
                    <h4>Same Day</h4>
                    <p>Order by 2 PM</p>
                    <span class="shipping-price">₹199</span>
                  </div>
                </div>

                <div class="returns-info">
                  <h4>Return Policy</h4>
                  <ul>
                    <li>7-day return window from delivery date</li>
                    <li>Items must be unopened and in original packaging</li>
                    <li>Free return pickup available</li>
                    <li>Refund processed within 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Products -->
    <section class="related-products-section">
      <div class="market-container">
        <RelatedProductsCarousel
          :products="relatedProducts"
          section-title="You may also like"
          section-subtitle="Complete your beauty routine with these complementary products"
          @product-click="handleRelatedProductClick"
          @add-to-cart="handleRelatedAddToCart"
        />
      </div>
    </section>

    <!-- Recently Viewed -->
    <section v-if="recentlyViewed.length > 0" class="recently-viewed-section">
      <div class="market-container">
        <RelatedProductsCarousel
          :products="recentlyViewed"
          section-title="Recently Viewed"
          section-subtitle="Products you've looked at recently"
          :show-arrows="true"
          @product-click="handleRelatedProductClick"
        />
      </div>
    </section>

    <!-- Cart Confirmation Modal -->
    <div v-if="showCartModal" class="cart-modal-overlay" @click="closeCartModal">
      <div class="cart-modal" @click.stop>
        <div class="modal-header">
          <i class="fas fa-check-circle success-icon"></i>
          <h3>Added to Cart!</h3>
          <button @click="closeCartModal" class="close-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-content">
          <div class="added-product">
            <img :src="product.images[0]" :alt="product.name" class="added-product-image" />
            <div class="added-product-info">
              <div class="added-product-name">{{ product.name }}</div>
              <div class="added-product-details">
                Quantity: {{ cartModalData.quantity }}
                <span v-if="cartModalData.variant">
                  • {{ cartModalData.variant.size?.value || '' }}
                  {{ cartModalData.variant.color?.name || '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="continueShopping" class="continue-btn">
            Continue Shopping
          </button>
          <button @click="goToCart" class="view-cart-btn">
            <i class="fas fa-shopping-cart"></i>
            View Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Loading product details...</span>
      </div>
    </div>
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
import ProductImageCarousel from '@/components/product/ProductImageCarousel.vue';
import VariantSelector from '@/components/product/VariantSelector.vue';
import AddToCartButton from '@/components/product/AddToCartButton.vue';
import HowToUseSection from '@/components/product/HowToUseSection.vue';
import RatingsReviews from '@/components/product/RatingsReviews.vue';
import RelatedProductsCarousel from '@/components/product/RelatedProductsCarousel.vue';

export default {
  name: 'ProductDetail',
  components: {
    ProductImageCarousel,
    VariantSelector,
    AddToCartButton,
    HowToUseSection,
    RatingsReviews,
    RelatedProductsCarousel
  },
  data() {
    return {
      loading: true,
      product: null,
      activeTab: 'how-to-use',
      selectedVariant: {
        size: null,
        color: null,
        bundle: null
      },
      showCartModal: false,
      cartModalData: {},
      
      // Sample product data - in real app this would come from API
      sampleProduct: {
        id: 1,
        name: 'Hydrating Vitamin C Face Serum',
        brand: 'GlowLux Premium',
        price: 1299,
        originalPrice: 1599,
        category: 'skincare',
        rating: 4.6,
        reviewCount: 324,
        description: 'A powerful vitamin C serum that brightens, hydrates, and protects your skin. Formulated with 20% vitamin C, hyaluronic acid, and natural botanicals for a radiant, youthful glow.',
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'
        ],
        sizes: [
          { id: 'small', value: '15ml', price: 699, originalPrice: 899, stock: 10 },
          { id: 'medium', value: '30ml', price: 1299, originalPrice: 1599, stock: 25, popular: true },
          { id: 'large', value: '50ml', price: 1899, originalPrice: 2299, stock: 15 }
        ],
        colors: [
          { id: 'clear', name: 'Clear', hex: '#f8f9fa', stock: 20 },
          { id: 'amber', name: 'Amber', hex: '#ffc107', stock: 15 },
          { id: 'cobalt', name: 'Cobalt', hex: '#0056b3', stock: 8 }
        ],
        bundles: [
          {
            id: 'serum-moisturizer',
            title: 'Serum + Moisturizer',
            description: 'Complete hydration routine',
            price: 2199,
            originalPrice: 2699,
            discount: 18
          }
        ],
        benefits: [
          '20% Vitamin C for brightening',
          'Hyaluronic acid for deep hydration',
          'Non-comedogenic formula',
          'Dermatologically tested',
          'Suitable for all skin types'
        ],
        howToUse: [
          {
            title: 'Cleanse',
            description: 'Start with clean, dry skin. Use your regular cleanser and pat dry.',
            icon: 'fas fa-soap',
            duration: '1-2 minutes',
            tips: ['Use lukewarm water', 'Pat dry, don\'t rub']
          },
          {
            title: 'Apply Serum',
            description: 'Apply 2-3 drops to face and neck. Gently pat and press into skin.',
            icon: 'fas fa-tint',
            duration: '30 seconds',
            tips: ['Start with less product', 'Focus on problem areas']
          },
          {
            title: 'Moisturize',
            description: 'Follow with your favorite moisturizer to lock in hydration.',
            icon: 'fas fa-snowflake',
            duration: '1 minute'
          },
          {
            title: 'Sun Protection',
            description: 'Always use SPF 30+ during the day when using vitamin C products.',
            icon: 'fas fa-sun',
            warning: 'Essential step to prevent sensitivity'
          }
        ],
        ingredients: [
          { 
            name: 'Vitamin C (L-Ascorbic Acid)', 
            benefit: 'Brightens skin and fights free radicals',
            concentration: '20%',
            icon: 'fas fa-lemon'
          },
          { 
            name: 'Hyaluronic Acid', 
            benefit: 'Deeply hydrates and plumps skin',
            concentration: '2%',
            icon: 'fas fa-tint'
          },
          { 
            name: 'Vitamin E', 
            benefit: 'Antioxidant protection and nourishment',
            concentration: '1%',
            icon: 'fas fa-shield-alt'
          }
        ],
        quickRef: {
          frequency: 'Daily (Morning)',
          timing: 'Morning routine',
          duration: '2-3 minutes',
          results: 'In 2-4 weeks'
        },
        dosDonts: {
          dos: [
            'Start with a patch test',
            'Use sunscreen during the day',
            'Store in a cool, dark place',
            'Use consistently for best results'
          ],
          donts: [
            'Don\'t use with retinol in the same routine',
            'Don\'t apply to wet skin',
            'Don\'t use if pregnant without consulting doctor',
            'Don\'t use more than recommended amount'
          ]
        },
        paymentOptions: true
      },
      
      detailTabs: [
        { id: 'how-to-use', title: 'How to Use', icon: 'fas fa-info-circle' },
        { id: 'ingredients', title: 'Ingredients', icon: 'fas fa-leaf' },
        { id: 'reviews', title: 'Reviews', icon: 'fas fa-star' },
        { id: 'shipping', title: 'Shipping & Returns', icon: 'fas fa-truck' }
      ]
    };
  },
  computed: {
    ...mapGetters('products', ['productById', 'allProducts', 'categories']),
    ...mapGetters('cart', ['cartItems']),
    
    productId() {
      return this.$route.params.id;
    },
    
    currentPrice() {
      if (this.selectedVariant.size) {
        return this.selectedVariant.size.price;
      }
      return this.product?.price || 0;
    },
    
    originalPrice() {
      if (this.selectedVariant.size) {
        return this.selectedVariant.size.originalPrice;
      }
      return this.product?.originalPrice;
    },
    
    discountPercentage() {
      if (this.originalPrice && this.originalPrice > this.currentPrice) {
        return Math.round(((this.originalPrice - this.currentPrice) / this.originalPrice) * 100);
      }
      return null;
    },
    
    availableStock() {
      if (this.selectedVariant.size) {
        return this.selectedVariant.size.stock;
      }
      return this.product?.stock || 50;
    },
    
    maxQuantity() {
      return Math.min(this.availableStock, 10);
    },
    
    defaultSize() {
      if (this.product?.sizes && this.product.sizes.length > 0) {
        // Find popular size or middle option
        const popularSize = this.product.sizes.find(size => size.popular);
        if (popularSize) return popularSize.id;
        
        const middleIndex = Math.floor(this.product.sizes.length / 2);
        return this.product.sizes[middleIndex].id;
      }
      return null;
    },
    
    defaultColor() {
      if (this.product?.colors && this.product.colors.length > 0) {
        return this.product.colors[0].id;
      }
      return null;
    },
    
    productReviews() {
      // Sample reviews - in real app this would come from API
      return [
        {
          id: 1,
          userName: 'Priya Sharma',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          title: 'Amazing Results!',
          text: 'This serum has transformed my skin! I\'ve been using it for 3 weeks and my skin looks so much brighter. The texture is lightweight and absorbs quickly. Definitely worth the investment.',
          date: '2024-01-15',
          verified: true,
          media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop' }
          ],
          helpfulCount: 12,
          expanded: false,
          tags: ['Brightening', 'Effective']
        },
        {
          id: 2,
          userName: 'Ananya Patel',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          rating: 4,
          title: 'Good product overall',
          text: 'Good product overall. I noticed some brightening after 2 weeks of use. The packaging is premium and the dropper works well. Would recommend for those with dull skin.',
          date: '2024-01-10',
          verified: true,
          helpfulCount: 8,
          expanded: false
        }
      ];
    },
    
    relatedProducts() {
      // Filter products from same category or brand
      return this.allProducts
        .filter(p => 
          p.id !== this.product?.id && 
          (p.category === this.product?.category || p.brand === this.product?.brand)
        )
        .slice(0, 8);
    },
    
    recentlyViewed() {
      // Get from localStorage or Vuex store
      const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      return this.allProducts.filter(p => recent.includes(p.id) && p.id !== this.product?.id);
    }
  },
  methods: {
    ...mapActions('products', ['setCurrentProduct']),
    ...mapActions('cart', ['addToCart', 'openCart']),
    
    async loadProduct() {
      this.loading = true;

      try {
        // Try to get from store first
        let product = this.productById(this.productId);

        if (product) {
          // Enhance store product with additional data
          product = this.enhanceStoreProduct(product);
        } else {
          // For demo purposes, use sample product
          if (this.productId === '1') {
            product = this.sampleProduct;
          } else {
            // In real app, make API call here
            throw new Error('Product not found');
          }
        }

        this.product = product;
        this.setCurrentProduct(product);

        // Add to recently viewed
        this.addToRecentlyViewed(product.id);

        // Update page title
        document.title = `${product.name} | Beauty Store`;

      } catch (error) {
        console.error('Error loading product:', error);
        this.product = null;
      } finally {
        this.loading = false;
      }
    },
    
    addToRecentlyViewed(productId) {
      let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      recent = recent.filter(id => id !== productId);
      recent.unshift(productId);
      recent = recent.slice(0, 10); // Keep last 10
      localStorage.setItem('recentlyViewed', JSON.stringify(recent));
    },
    
    setActiveTab(tabId) {
      this.activeTab = tabId;
    },
    
    scrollToReviews() {
      this.setActiveTab('reviews');
      this.$nextTick(() => {
        const reviewsSection = document.querySelector('.product-details-section');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
    
    handleVariantChange(variant) {
      this.selectedVariant = variant;
    },
    
    handleSizeSelected(size) {
      this.selectedVariant.size = size;
    },
    
    handleColorSelected(color) {
      this.selectedVariant.color = color;
    },
    
    handleAddedToCart(data) {
      console.log('Product added to cart:', data);
    },
    
    showCartConfirmation(data) {
      this.cartModalData = data;
      this.showCartModal = true;
    },
    
    closeCartModal() {
      this.showCartModal = false;
      this.cartModalData = {};
    },
    
    continueShopping() {
      this.closeCartModal();
    },
    
    goToCart() {
      this.closeCartModal();
      this.openCart();
      this.$router.push('/cart');
    },
    
    handleRelatedProductClick(product) {
      this.$router.push(`/product/${product.id}`);
    },
    
    handleRelatedAddToCart(product) {
      this.addToCart({
        ...product,
        quantity: 1
      });
    },
    
    handleReviewSubmitted(review) {
      console.log('New review submitted:', review);
      // In real app, update product rating/reviews
    },
    
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-IN').format(price);
    },

    enhanceStoreProduct(product) {
      // Enhance store products with additional data needed for detailed view
      const enhanced = {
        ...product,
        images: product.images || [product.image, product.image, product.image],
        sizes: product.sizes || [
          { id: 'small', value: '30ml', price: Math.round(product.price * 0.7), stock: 15 },
          { id: 'medium', value: '50ml', price: product.price, stock: 25, popular: true },
          { id: 'large', value: '100ml', price: Math.round(product.price * 1.4), stock: 10 }
        ],
        colors: product.colors ? product.colors.map((color, index) => ({
          id: `color-${index}`,
          name: color,
          hex: this.getColorHex(color),
          stock: 20
        })) : null,
        howToUse: product.howToUse || [
          {
            title: 'Apply',
            description: `Apply ${product.name.toLowerCase()} as directed.`,
            icon: 'fas fa-hand-paper'
          },
          {
            title: 'Massage',
            description: 'Gently massage into skin until absorbed.',
            icon: 'fas fa-spa'
          }
        ],
        ingredients: product.ingredients ? product.ingredients.map(ing => ({
          name: ing,
          benefit: 'Provides beneficial properties for skin health',
          icon: 'fas fa-leaf'
        })) : [],
        quickRef: {
          frequency: 'Daily',
          timing: 'Morning & Evening',
          duration: '2-3 minutes',
          results: 'In 2-4 weeks'
        },
        dosDonts: {
          dos: [
            'Use consistently for best results',
            'Apply to clean skin',
            'Store in cool, dry place'
          ],
          donts: [
            'Don\'t use if allergic to ingredients',
            'Don\'t apply to broken skin',
            'Don\'t use past expiration date'
          ]
        }
      };

      return enhanced;
    },

    getColorHex(colorName) {
      const colorMap = {
        'Ruby Red': '#DC143C',
        'Berry Bliss': '#8B008B',
        'Nude Rose': '#E6B3B3',
        'Coral Dream': '#FF7F50',
        'Clear': '#f8f9fa',
        'Amber': '#ffc107',
        'Cobalt': '#0056b3'
      };
      return colorMap[colorName] || '#ec4899';
    }
  },
  
  async created() {
    await this.loadProduct();
  },
  
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      }
    }
  }
};
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf7ff 0%, #f8faff 50%, #fff5f8 100%);
}

/* Breadcrumb */
.breadcrumb-container {
  background: white;
  border-bottom: 1px solid var(--market-border);
  padding: 16px 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  color: var(--market-text-light);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: var(--market-primary);
}

.breadcrumb-item.current {
  color: var(--market-text);
  font-weight: 500;
}

.breadcrumb i {
  color: var(--market-text-light);
  font-size: 12px;
}

/* Product Hero */
.product-hero {
  padding: 40px 0;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

.product-images {
  position: sticky;
  top: 20px;
}

.product-info {
  padding: 20px 0;
}

/* Product Header */
.product-header {
  margin-bottom: 32px;
}

.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--market-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.product-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--market-text);
  line-height: 1.2;
  margin-bottom: 16px;
}

.rating-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 18px;
  transition: color 0.2s ease;
}

.star.filled {
  color: #fbbf24;
}

.rating-text {
  color: var(--market-text-light);
  font-size: 14px;
}

.view-reviews-btn {
  background: none;
  border: 1px solid var(--market-primary);
  color: var(--market-primary);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.view-reviews-btn:hover {
  background: var(--market-primary);
  color: white;
}

/* Price Section */
.price-section {
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.price-display {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: var(--market-primary);
}

.original-price {
  font-size: 20px;
  color: var(--market-text-light);
  text-decoration: line-through;
}

.discount-badge {
  background: #22c55e;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

.emi-text {
  font-size: 14px;
  color: var(--market-text-light);
}

/* Description */
.description-section {
  margin-bottom: 24px;
}

.product-description {
  color: var(--market-text);
  line-height: 1.6;
  font-size: 16px;
  margin: 0;
}

/* Benefits */
.benefits-section {
  margin-bottom: 32px;
}

.benefits-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 16px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--market-text);
  font-size: 14px;
}

.benefit-item i {
  color: #22c55e;
  font-size: 12px;
}

/* Variants */
.variants-section {
  margin-bottom: 32px;
}

/* Add to Cart */
.add-to-cart-section {
  margin-bottom: 32px;
}

/* Trust Indicators */
.trust-indicators {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--market-secondary);
  border-radius: 12px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trust-item i {
  color: var(--market-primary);
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.trust-content {
  flex: 1;
}

.trust-title {
  font-weight: 600;
  color: var(--market-text);
  font-size: 14px;
  margin-bottom: 2px;
}

.trust-subtitle {
  font-size: 12px;
  color: var(--market-text-light);
}

/* Product Details Section */
.product-details-section {
  padding: 80px 0;
  background: white;
}

.details-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tabs-navigation {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
  border-bottom: 2px solid #f3f4f6;
}

.tab-btn {
  padding: 16px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: var(--market-text-light);
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: var(--market-primary);
}

.tab-btn.active {
  color: var(--market-primary);
  border-bottom-color: var(--market-primary);
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

/* Ingredients Content */
.ingredients-content {
  text-align: center;
}

.ingredients-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 40px;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.ingredient-card {
  background: var(--market-secondary);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.ingredient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.ingredient-icon {
  width: 60px;
  height: 60px;
  background: var(--market-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin: 0 auto 16px;
}

.ingredient-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 8px;
}

.ingredient-benefit {
  color: var(--market-text-light);
  line-height: 1.5;
  margin-bottom: 8px;
}

.ingredient-concentration {
  font-size: 12px;
  font-weight: 600;
  color: var(--market-primary);
  background: rgba(236, 72, 153, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  display: inline-block;
}

/* Shipping Content */
.shipping-content h3 {
  font-size: 32px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 32px;
  text-align: center;
}

.shipping-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.shipping-card {
  background: var(--market-secondary);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.shipping-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.shipping-card i {
  font-size: 32px;
  color: var(--market-primary);
  margin-bottom: 16px;
}

.shipping-card h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 8px;
}

.shipping-card p {
  color: var(--market-text-light);
  margin-bottom: 8px;
}

.shipping-price {
  font-weight: 600;
  color: var(--market-primary);
}

.returns-info {
  background: var(--market-secondary);
  border-radius: 16px;
  padding: 24px;
}

.returns-info h4 {
  font-size: 20px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 16px;
}

.returns-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.returns-info li {
  padding: 8px 0;
  color: var(--market-text);
  position: relative;
  padding-left: 20px;
}

.returns-info li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #22c55e;
  font-weight: bold;
}

/* Related Products */
.related-products-section,
.recently-viewed-section {
  padding: 40px 0;
}

/* Cart Modal */
.cart-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.cart-modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 90vw;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.3s ease;
}

.modal-header {
  padding: 24px 24px 16px;
  text-align: center;
  position: relative;
}

.success-icon {
  font-size: 48px;
  color: #22c55e;
  margin-bottom: 16px;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--market-text);
  margin: 0;
}

.close-modal {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--market-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  padding: 0 24px 16px;
}

.added-product {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: var(--market-secondary);
  border-radius: 12px;
}

.added-product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.added-product-info {
  flex: 1;
}

.added-product-name {
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 4px;
}

.added-product-details {
  font-size: 14px;
  color: var(--market-text-light);
}

.modal-actions {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
}

.continue-btn,
.view-cart-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.continue-btn {
  background: white;
  color: var(--market-text);
  border: 2px solid var(--market-border);
}

.continue-btn:hover {
  border-color: var(--market-primary);
  color: var(--market-primary);
}

.view-cart-btn {
  background: var(--market-gradient);
  color: white;
}

.view-cart-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

/* Loading & Not Found */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  color: var(--market-text);
}

.loading-spinner i {
  font-size: 32px;
  color: var(--market-primary);
}

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
  color: var(--market-text-light);
  margin-bottom: 24px;
}

.not-found-content h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 16px;
}

.not-found-content p {
  color: var(--market-text-light);
  margin-bottom: 32px;
  line-height: 1.6;
}

.back-home-btn {
  background: var(--market-gradient);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .product-images {
    position: static;
  }
}

@media (max-width: 768px) {
  .product-hero {
    padding: 20px 0;
  }
  
  .product-title {
    font-size: 28px;
  }
  
  .current-price {
    font-size: 24px;
  }
  
  .rating-section {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .tabs-navigation {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  
  .tab-btn {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .ingredients-grid {
    grid-template-columns: 1fr;
  }
  
  .shipping-info-grid {
    grid-template-columns: 1fr;
  }
  
  .trust-indicators {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .breadcrumb {
    font-size: 12px;
  }
  
  .product-title {
    font-size: 22px;
  }
  
  .current-price {
    font-size: 20px;
  }
  
  .price-section {
    padding: 16px;
  }
  
  .ingredient-card,
  .shipping-card {
    padding: 16px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
