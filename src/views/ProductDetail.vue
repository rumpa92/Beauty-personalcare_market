<template>
  <div class="product-detail-page" v-if="product">
    <!-- Hero Section with Image and Product Info -->
    <section class="product-hero">
      <div class="market-container-wide">
        <div class="hero-layout">
          <!-- Product Image Gallery -->
          <div class="product-gallery">
            <!-- Main Image Container -->
            <div class="main-image-container">
              <div 
                class="main-image-wrapper" 
                @mousemove="handleMouseMove" 
                @mouseleave="resetZoom"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
              >
                <img 
                  :src="currentImage" 
                  :alt="product.name"
                  class="main-image"
                  :style="zoomStyle"
                  ref="mainImage"
                >
                
                <!-- Premium Share Overlay -->
                <div class="share-overlay">
                  <div class="share-icons">
                    <button 
                      @click="shareVia('whatsapp')" 
                      class="share-btn whatsapp" 
                      title="Share on WhatsApp"
                    >
                      <i class="fab fa-whatsapp"></i>
                    </button>
                    <button 
                      @click="shareVia('instagram')" 
                      class="share-btn instagram" 
                      title="Share on Instagram"
                    >
                      <i class="fab fa-instagram"></i>
                    </button>
                    <button 
                      @click="shareVia('facebook')" 
                      class="share-btn facebook" 
                      title="Share on Facebook"
                    >
                      <i class="fab fa-facebook"></i>
                    </button>
                    <button 
                      @click="copyLink" 
                      class="share-btn copy" 
                      title="Copy Link"
                    >
                      <i class="fas fa-link"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Zoom Indicator -->
                <div v-if="isZooming" class="zoom-indicator">
                  <div class="zoom-icon">
                    <i class="fas fa-search-plus"></i>
                  </div>
                  <span class="zoom-text">Hover to zoom • Pinch to zoom</span>
                </div>
                
                <!-- Navigation Arrows -->
                <button 
                  @click="previousImage" 
                  class="image-nav prev" 
                  :disabled="currentImageIndex === 0"
                  v-if="product.images.length > 1"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button 
                  @click="nextImage" 
                  class="image-nav next" 
                  :disabled="currentImageIndex === product.images.length - 1"
                  v-if="product.images.length > 1"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <!-- Thumbnail Gallery -->
              <div class="thumbnail-gallery" v-if="product.images.length > 1">
                <div class="thumbnails-scroll">
                  <div 
                    v-for="(image, index) in product.images" 
                    :key="index"
                    @click="selectImage(index)"
                    :class="['thumbnail', { active: currentImageIndex === index }]"
                  >
                    <img :src="image" :alt="`${product.name} view ${index + 1}`">
                    <div class="thumbnail-overlay"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Information Panel -->
          <div class="product-info">
            <div class="product-header">
              <!-- Brand & Trust Badges -->
              <div class="brand-trust-row">
                <div class="brand-section">
                  <span class="brand-name">{{ product.brand }}</span>
                  <div class="trust-badges">
                    <div class="trust-badge">
                      <i class="fas fa-shield-check"></i>
                      <span>Authentic</span>
                    </div>
                    <div class="trust-badge">
                      <i class="fas fa-award"></i>
                      <span>Premium</span>
                    </div>
                  </div>
                </div>
                
                <!-- Rating Display -->
                <div class="rating-section">
                  <div class="stars-container">
                    <div class="stars">
                      <i v-for="n in 5" :key="n" 
                         :class="['fas fa-star', { filled: n <= Math.floor(product.rating) }]">
                      </i>
                    </div>
                    <span class="rating-text">{{ product.rating }} ({{ product.reviewCount }} reviews)</span>
                  </div>
                </div>
              </div>
              
              <!-- Product Title -->
              <h1 class="product-title">{{ product.name }}</h1>
              
              <!-- Product Description -->
              <p class="product-description">{{ product.description }}</p>
              
              <!-- Key Benefits Pills -->
              <div v-if="product.benefits" class="benefits-pills">
                <span 
                  v-for="benefit in product.benefits.slice(0, 4)" 
                  :key="benefit"
                  class="benefit-pill"
                >
                  <i class="fas fa-check"></i>
                  {{ benefit }}
                </span>
              </div>
            </div>

            <!-- Premium Pricing Section -->
            <div class="pricing-section">
              <div class="price-display">
                <span class="current-price">${{ getCurrentPrice().toFixed(2) }}</span>
                <span v-if="product.originalPrice && product.originalPrice > getCurrentPrice()" class="original-price">
                  ${{ product.originalPrice.toFixed(2) }}
                </span>
                <span v-if="discountPercentage" class="discount-badge">
                  {{ discountPercentage }}% OFF
                </span>
              </div>
              <div class="price-details">
                <span class="price-per-unit">${{ pricePerMl.toFixed(2) }}/ml</span>
                <span class="savings" v-if="savings">You save ${{ savings.toFixed(2) }}</span>
                <span class="free-shipping">
                  <i class="fas fa-truck"></i>
                  Free shipping on orders over $50
                </span>
              </div>
            </div>

            <!-- Size/Variant Selection -->
            <div v-if="product.sizes" class="variant-section">
              <h3 class="section-label">
                <i class="fas fa-ruler"></i>
                Choose Size
              </h3>
              <div class="size-selector">
                <div 
                  v-for="size in product.sizes" 
                  :key="size.id"
                  @click="selectSize(size)"
                  :class="['size-option', { 
                    selected: selectedSize?.id === size.id,
                    bestseller: size.bestseller,
                    'best-value': size.bestValue 
                  }]"
                >
                  <div class="size-main">
                    <span class="size-volume">{{ size.volume }}</span>
                    <span class="size-price">${{ size.price.toFixed(2) }}</span>
                  </div>
                  <div class="size-badges">
                    <span v-if="size.bestseller" class="size-badge bestseller">
                      <i class="fas fa-crown"></i>
                      Bestseller
                    </span>
                    <span v-if="size.bestValue" class="size-badge best-value">
                      <i class="fas fa-tag"></i>
                      Best Value
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Color Selection -->
            <div v-if="product.colors" class="color-section">
              <h3 class="section-label">
                <i class="fas fa-palette"></i>
                Choose Color
                <span v-if="selectedColor" class="selected-color-name">- {{ selectedColor.name }}</span>
              </h3>
              <div class="color-selector">
                <div 
                  v-for="color in product.colors" 
                  :key="color.id"
                  @click="selectColor(color)"
                  :class="['color-option', { selected: selectedColor?.id === color.id }]"
                  :style="{ backgroundColor: color.hex }"
                  :title="color.name"
                >
                  <div v-if="selectedColor?.id === color.id" class="color-check">
                    <i class="fas fa-check"></i>
                  </div>
                  <div class="color-ring"></div>
                </div>
              </div>
            </div>

            <!-- Add to Cart Section -->
            <div class="add-to-cart-section">
              <!-- Standard Add to Cart -->
              <div v-if="!isInCart" class="cart-add-container">
                <div class="quantity-selector">
                  <label class="qty-label">Quantity:</label>
                  <div class="quantity-controls">
                    <button 
                      @click="decreaseQuantity" 
                      :disabled="quantity <= 1" 
                      class="qty-btn minus"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      v-model.number="quantity" 
                      min="1" 
                      max="10" 
                      class="qty-input"
                    >
                    <button 
                      @click="increaseQuantity" 
                      :disabled="quantity >= 10" 
                      class="qty-btn plus"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                
                <button 
                  @click="addToCart" 
                  :disabled="isAddingToCart || !canAddToCart"
                  :class="['add-to-cart-btn', { loading: isAddingToCart, disabled: !canAddToCart }]"
                >
                  <div class="btn-content">
                    <div v-if="isAddingToCart" class="loading-animation">
                      <div class="loading-dots">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                    <div v-else class="btn-icon">
                      <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="btn-text">
                      <span class="btn-label">{{ isAddingToCart ? 'Adding to Cart...' : 'Add to Cart' }}</span>
                      <span class="btn-price">${{ (getCurrentPrice() * quantity).toFixed(2) }}</span>
                    </div>
                  </div>
                  <div class="btn-shimmer"></div>
                </button>
              </div>

              <!-- Cart Modification (when item is already in cart) -->
              <div v-else class="cart-modify-container">
                <div class="cart-status">
                  <div class="status-icon">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  <div class="status-text">
                    <span class="status-label">In your cart</span>
                    <span class="status-count">{{ cartItemQuantity }} item{{ cartItemQuantity > 1 ? 's' : '' }}</span>
                  </div>
                </div>
                
                <div class="cart-controls">
                  <div class="quantity-modifier">
                    <button @click="updateCartQuantity(-1)" class="qty-mod-btn minus">
                      <i class="fas fa-minus"></i>
                    </button>
                    <span class="cart-quantity">{{ cartItemQuantity }}</span>
                    <button @click="updateCartQuantity(1)" class="qty-mod-btn plus">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  
                  <button @click="removeFromCart" class="remove-btn">
                    <i class="fas fa-trash-alt"></i>
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <!-- Secondary Actions -->
              <div class="secondary-actions">
                <button 
                  @click="toggleWishlist" 
                  :class="['wishlist-btn', { active: isInWishlist }]"
                >
                  <i class="fas fa-heart"></i>
                  <span>{{ isInWishlist ? 'Wishlisted' : 'Add to Wishlist' }}</span>
                </button>
                
                <button @click="buyNow" class="buy-now-btn" :disabled="!canAddToCart">
                  <i class="fas fa-bolt"></i>
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            <!-- Premium Features -->
            <div class="premium-features">
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="fas fa-shipping-fast"></i>
                </div>
                <div class="feature-text">
                  <span class="feature-title">Free Express Shipping</span>
                  <span class="feature-desc">On orders over $75</span>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="fas fa-undo-alt"></i>
                </div>
                <div class="feature-text">
                  <span class="feature-title">30-Day Returns</span>
                  <span class="feature-desc">Hassle-free returns</span>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="fas fa-certificate"></i>
                </div>
                <div class="feature-text">
                  <span class="feature-title">Authenticity Guaranteed</span>
                  <span class="feature-desc">100% genuine products</span>
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
        <!-- Elegant Tab Navigation -->
        <div class="tabs-navigation">
          <div class="tabs-container">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['tab-btn', { active: activeTab === tab.id }]"
            >
              <div class="tab-icon">
                <i :class="tab.icon"></i>
              </div>
              <span class="tab-label">{{ tab.label }}</span>
              <span v-if="tab.id === 'reviews'" class="tab-count">({{ product.reviewCount }})</span>
              <div class="tab-indicator"></div>
            </button>
          </div>
        </div>

        <div class="tab-content-container">
          <!-- How to Use Tab -->
          <div v-show="activeTab === 'howto'" class="tab-panel how-to-use">
            <div class="tab-header">
              <h3 class="tab-title">How to Use</h3>
              <p class="tab-subtitle">Get the most out of your {{ product.name }}</p>
            </div>
            
            <div class="usage-steps">
              <div 
                v-for="(step, index) in product.howToUse" 
                :key="index"
                class="usage-step"
              >
                <div class="step-indicator">
                  <div class="step-number">{{ step.step }}</div>
                  <div class="step-line" v-if="index < product.howToUse.length - 1"></div>
                </div>
                
                <div class="step-content">
                  <div class="step-main">
                    <h4 class="step-title">{{ step.title }}</h4>
                    <p class="step-description">{{ step.description }}</p>
                  </div>
                  
                  <div v-if="step.tips" class="step-tips">
                    <h5 class="tips-title">
                      <i class="fas fa-lightbulb"></i>
                      Pro Tips:
                    </h5>
                    <ul class="tips-list">
                      <li v-for="tip in step.tips" :key="tip">{{ tip }}</li>
                    </ul>
                  </div>
                </div>
                
                <div class="step-visual">
                  <div class="step-icon">
                    <i :class="getStepIcon(step.step)"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Routine Suggestion -->
            <div class="routine-section">
              <h4 class="routine-title">
                <i class="fas fa-clock"></i>
                Recommended Daily Routine
              </h4>
              
              <div class="routine-timeline">
                <div class="routine-time morning">
                  <div class="time-header">
                    <div class="time-icon">
                      <i class="fas fa-sun"></i>
                    </div>
                    <h5 class="time-label">Morning Routine</h5>
                  </div>
                  <div class="routine-steps">
                    <div class="routine-step">
                      <span class="step-order">1</span>
                      <span class="step-product">Gentle Cleanser</span>
                    </div>
                    <div class="routine-step current">
                      <span class="step-order">2</span>
                      <span class="step-product">{{ product.name }}</span>
                    </div>
                    <div class="routine-step">
                      <span class="step-order">3</span>
                      <span class="step-product">Moisturizer</span>
                    </div>
                    <div class="routine-step">
                      <span class="step-order">4</span>
                      <span class="step-product">SPF Protection</span>
                    </div>
                  </div>
                </div>
                
                <div class="routine-time evening">
                  <div class="time-header">
                    <div class="time-icon">
                      <i class="fas fa-moon"></i>
                    </div>
                    <h5 class="time-label">Evening Routine</h5>
                  </div>
                  <div class="routine-steps">
                    <div class="routine-step">
                      <span class="step-order">1</span>
                      <span class="step-product">Makeup Remover</span>
                    </div>
                    <div class="routine-step">
                      <span class="step-order">2</span>
                      <span class="step-product">Gentle Cleanser</span>
                    </div>
                    <div class="routine-step current">
                      <span class="step-order">3</span>
                      <span class="step-product">{{ product.name }}</span>
                    </div>
                    <div class="routine-step">
                      <span class="step-order">4</span>
                      <span class="step-product">Night Moisturizer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ingredients Tab -->
          <div v-show="activeTab === 'ingredients'" class="tab-panel ingredients">
            <div class="tab-header">
              <h3 class="tab-title">Ingredients</h3>
              <p class="tab-subtitle">Science-backed ingredients for optimal results</p>
            </div>
            
            <!-- Key Ingredients Showcase -->
            <div class="key-ingredients-section">
              <h4 class="section-subtitle">
                <i class="fas fa-star"></i>
                Key Active Ingredients
              </h4>
              
              <div class="key-ingredients-grid">
                <div 
                  v-for="ingredient in product.keyIngredients" 
                  :key="ingredient.name"
                  class="key-ingredient-card"
                >
                  <div class="ingredient-header">
                    <div class="ingredient-icon">
                      <i :class="ingredient.icon"></i>
                    </div>
                    <div class="ingredient-info">
                      <h5 class="ingredient-name">{{ ingredient.name }}</h5>
                      <p class="ingredient-description">{{ ingredient.description }}</p>
                    </div>
                  </div>
                  
                  <div class="ingredient-benefits">
                    <span 
                      v-for="benefit in ingredient.benefits" 
                      :key="benefit"
                      class="benefit-tag"
                    >
                      {{ benefit }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Full Ingredients List -->
            <div class="full-ingredients-section">
              <h4 class="section-subtitle">
                <i class="fas fa-list"></i>
                Complete Ingredient List
              </h4>
              
              <div class="ingredients-grid">
                <div 
                  v-for="ingredient in product.ingredients" 
                  :key="ingredient.name"
                  :class="['ingredient-item', ingredient.type]"
                >
                  <div class="ingredient-main">
                    <span class="ingredient-name">{{ ingredient.name }}</span>
                    <span class="ingredient-purpose">{{ ingredient.purpose }}</span>
                  </div>
                  <span v-if="ingredient.concentration" class="ingredient-concentration">
                    {{ ingredient.concentration }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-show="activeTab === 'reviews'" class="tab-panel reviews">
            <!-- Reviews Header -->
            <div class="reviews-header">
              <div class="reviews-summary">
                <div class="rating-overview">
                  <div class="average-rating">
                    <span class="rating-number">{{ product.rating }}</span>
                    <div class="rating-stars">
                      <i v-for="n in 5" :key="n" 
                         :class="['fas fa-star', { filled: n <= Math.floor(product.rating) }]">
                      </i>
                    </div>
                    <span class="rating-subtitle">Based on {{ product.reviewCount }} reviews</span>
                  </div>
                  
                  <div class="rating-breakdown">
                    <div 
                      v-for="rating in [5, 4, 3, 2, 1]" 
                      :key="rating"
                      class="rating-row"
                    >
                      <span class="rating-label">{{ rating }}★</span>
                      <div class="rating-bar">
                        <div 
                          class="rating-fill" 
                          :style="{ width: getRatingPercentage(rating) + '%' }"
                        ></div>
                      </div>
                      <span class="rating-count">{{ getRatingCount(rating) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="review-actions">
                  <button @click="showWriteReview = true" class="write-review-btn">
                    <i class="fas fa-pen"></i>
                    <span>Write a Review</span>
                  </button>
                  
                  <div class="review-filters">
                    <select v-model="reviewFilter" class="filter-select">
                      <option value="all">All Reviews</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                      <option value="photos">With Photos</option>
                      <option value="verified">Verified Purchase</option>
                    </select>
                    
                    <select v-model="reviewSort" class="sort-select">
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews List -->
            <div class="reviews-list">
              <div 
                v-for="review in filteredReviews" 
                :key="review.id"
                class="review-item"
              >
                <div class="review-header">
                  <div class="reviewer-profile">
                    <div class="reviewer-avatar">
                      <img :src="review.userAvatar" :alt="review.userName">
                    </div>
                    <div class="reviewer-details">
                      <h5 class="reviewer-name">{{ review.userName }}</h5>
                      <div class="review-meta">
                        <div class="review-rating">
                          <i v-for="n in 5" :key="n" 
                             :class="['fas fa-star', { filled: n <= review.rating }]">
                          </i>
                        </div>
                        <span class="review-date">{{ formatDate(review.date) }}</span>
                        <span v-if="review.verified" class="verified-badge">
                          <i class="fas fa-check-circle"></i>
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="review-content">
                  <h6 v-if="review.title" class="review-title">{{ review.title }}</h6>
                  <div 
                    :class="['review-text', { expanded: review.isExpanded }]"
                  >
                    <p>{{ review.text }}</p>
                    <button 
                      v-if="review.text.length > 200 && !review.isExpanded"
                      @click="review.isExpanded = true"
                      class="read-more-btn"
                    >
                      Read more
                    </button>
                  </div>
                  
                  <!-- Review Photos -->
                  <div v-if="review.photos && review.photos.length" class="review-photos">
                    <div 
                      v-for="(photo, index) in review.photos" 
                      :key="index"
                      @click="openPhotoModal(photo, review.photos)"
                      class="review-photo"
                    >
                      <img :src="photo.thumbnail" :alt="`Review photo ${index + 1}`">
                      <div class="photo-overlay">
                        <i class="fas fa-expand-alt"></i>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Review Footer -->
                  <div class="review-footer">
                    <div class="helpfulness">
                      <span class="helpful-question">Was this helpful?</span>
                      <div class="helpful-actions">
                        <button 
                          @click="markHelpful(review.id, true)"
                          :class="['helpful-btn', { active: review.userHelpfulVote === true }]"
                        >
                          <i class="fas fa-thumbs-up"></i>
                          <span>{{ review.helpfulCount || 0 }}</span>
                        </button>
                        <button 
                          @click="markHelpful(review.id, false)"
                          :class="['helpful-btn', { active: review.userHelpfulVote === false }]"
                        >
                          <i class="fas fa-thumbs-down"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Load More Reviews -->
            <div v-if="hasMoreReviews" class="load-more-section">
              <button @click="loadMoreReviews" class="load-more-btn">
                <i class="fas fa-chevron-down"></i>
                <span>Load More Reviews</span>
              </button>
            </div>
          </div>

          <!-- Shipping Tab -->
          <div v-show="activeTab === 'shipping'" class="tab-panel shipping">
            <div class="tab-header">
              <h3 class="tab-title">Shipping & Returns</h3>
              <p class="tab-subtitle">Fast, secure delivery with easy returns</p>
            </div>
            
            <div class="shipping-content">
              <div class="shipping-options">
                <h4 class="content-subtitle">
                  <i class="fas fa-shipping-fast"></i>
                  Delivery Options
                </h4>
                
                <div class="shipping-methods">
                  <div class="shipping-method">
                    <div class="method-icon">
                      <i class="fas fa-truck"></i>
                    </div>
                    <div class="method-details">
                      <h5 class="method-name">Standard Delivery</h5>
                      <p class="method-time">3-5 business days</p>
                      <span class="method-price">Free on orders over $50</span>
                    </div>
                  </div>
                  
                  <div class="shipping-method">
                    <div class="method-icon">
                      <i class="fas fa-shipping-fast"></i>
                    </div>
                    <div class="method-details">
                      <h5 class="method-name">Express Delivery</h5>
                      <p class="method-time">1-2 business days</p>
                      <span class="method-price">$9.99</span>
                    </div>
                  </div>
                  
                  <div class="shipping-method">
                    <div class="method-icon">
                      <i class="fas fa-bolt"></i>
                    </div>
                    <div class="method-details">
                      <h5 class="method-name">Same Day Delivery</h5>
                      <p class="method-time">Within 4 hours</p>
                      <span class="method-price">$19.99 (Select areas)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="return-policy">
                <h4 class="content-subtitle">
                  <i class="fas fa-undo-alt"></i>
                  Returns & Exchanges
                </h4>
                
                <div class="policy-grid">
                  <div class="policy-item">
                    <div class="policy-icon">
                      <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="policy-content">
                      <h5>30-Day Returns</h5>
                      <p>Free returns within 30 days of purchase for any reason</p>
                    </div>
                  </div>
                  
                  <div class="policy-item">
                    <div class="policy-icon">
                      <i class="fas fa-exchange-alt"></i>
                    </div>
                    <div class="policy-content">
                      <h5>Easy Exchanges</h5>
                      <p>Swap for different size or color with no extra fees</p>
                    </div>
                  </div>
                  
                  <div class="policy-item">
                    <div class="policy-icon">
                      <i class="fas fa-shield-check"></i>
                    </div>
                    <div class="policy-content">
                      <h5>Buyer Protection</h5>
                      <p>100% authentic products with quality guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Products Section -->
    <section class="related-products-section">
      <div class="market-container">
        <div class="section-header">
          <h3 class="section-title">You May Also Like</h3>
          <p class="section-subtitle">Complete your beauty routine with these perfectly paired products</p>
        </div>
        
        <div class="related-products-carousel">
          <div class="carousel-container" ref="relatedCarousel">
            <div class="products-track" :style="{ transform: `translateX(-${relatedOffset}px)` }">
              <div 
                v-for="relatedProduct in relatedProducts" 
                :key="relatedProduct.id"
                class="related-product-card"
                @click="$router.push(`/product/${relatedProduct.id}`)"
              >
                <div class="product-image">
                  <img :src="relatedProduct.image" :alt="relatedProduct.name">
                  <button 
                    @click.stop="quickAddToCart(relatedProduct)"
                    class="quick-add-btn"
                    :title="'Quick add ' + relatedProduct.name"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                  <div class="product-badges">
                    <span v-if="relatedProduct.onSale" class="product-badge sale">Sale</span>
                    <span v-if="relatedProduct.featured" class="product-badge featured">Featured</span>
                  </div>
                </div>
                
                <div class="product-details">
                  <h5 class="product-name">{{ relatedProduct.name }}</h5>
                  <p class="product-brand">{{ relatedProduct.brand }}</p>
                  
                  <div class="product-rating">
                    <div class="stars">
                      <i v-for="n in 5" :key="n" 
                         :class="['fas fa-star', { filled: n <= Math.floor(relatedProduct.rating) }]">
                      </i>
                    </div>
                    <span class="review-count">({{ relatedProduct.reviewCount }})</span>
                  </div>
                  
                  <div class="product-price">
                    <span class="current-price">${{ relatedProduct.price.toFixed(2) }}</span>
                    <span v-if="relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price" class="original-price">
                      ${{ relatedProduct.originalPrice.toFixed(2) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Carousel Navigation -->
          <button 
            @click="scrollRelated('left')" 
            class="carousel-nav prev"
            :disabled="relatedOffset === 0"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button 
            @click="scrollRelated('right')" 
            class="carousel-nav next"
            :disabled="relatedOffset >= maxRelatedOffset"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Sticky Mobile Cart -->
    <div class="sticky-mobile-cart">
      <div v-if="!isInCart" class="sticky-cart-content">
        <div class="sticky-product-info">
          <img :src="product.images[0]" :alt="product.name" class="sticky-product-image">
          <div class="sticky-product-details">
            <h5>{{ product.name }}</h5>
            <span class="sticky-price">${{ getCurrentPrice().toFixed(2) }}</span>
          </div>
        </div>
        <button 
          @click="addToCart"
          :disabled="isAddingToCart || !canAddToCart"
          class="sticky-add-btn"
        >
          <i v-if="!isAddingToCart" class="fas fa-shopping-bag"></i>
          <div v-else class="mini-loading">
            <div class="mini-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
          {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
        </button>
      </div>
      
      <div v-else class="sticky-cart-content in-cart">
        <div class="sticky-in-cart-info">
          <i class="fas fa-check-circle"></i>
          <span>In Cart ({{ cartItemQuantity }})</span>
        </div>
        <div class="sticky-cart-actions">
          <div class="sticky-qty-controls">
            <button @click="updateCartQuantity(-1)" class="sticky-qty-btn">
              <i class="fas fa-minus"></i>
            </button>
            <button @click="updateCartQuantity(1)" class="sticky-qty-btn">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <button @click="$router.push('/cart')" class="view-cart-btn">
            View Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Write Review Modal -->
    <div v-if="showWriteReview" class="modal-overlay" @click="closeWriteReview">
      <div class="modal-content write-review-modal" @click.stop>
        <div class="modal-header">
          <h3>Write a Review</h3>
          <p class="modal-subtitle">Share your experience with {{ product.name }}</p>
          <button @click="closeWriteReview" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="review-form">
            <!-- Rating Input -->
            <div class="form-group rating-group">
              <label class="form-label">Overall Rating</label>
              <div class="rating-input">
                <i v-for="n in 5" :key="n" 
                   @click="newReview.rating = n"
                   @mouseover="hoverRating = n"
                   @mouseleave="hoverRating = 0"
                   :class="['fas fa-star rating-star', { 
                     filled: n <= (hoverRating || newReview.rating),
                     hover: n <= hoverRating 
                   }]">
                </i>
                <span class="rating-label">
                  {{ getRatingLabel(newReview.rating) }}
                </span>
              </div>
            </div>
            
            <!-- Review Title -->
            <div class="form-group">
              <label class="form-label">Review Title</label>
              <input 
                type="text" 
                v-model="newReview.title" 
                placeholder="Summarize your experience in a few words"
                class="form-input"
                maxlength="100"
              >
            </div>
            
            <!-- Review Text -->
            <div class="form-group">
              <label class="form-label">Your Review</label>
              <textarea 
                v-model="newReview.text" 
                placeholder="Share your detailed thoughts about this product..."
                class="form-textarea"
                rows="5"
                maxlength="1000"
              ></textarea>
              <div class="character-count">
                {{ newReview.text.length }}/1000 characters
              </div>
            </div>
            
            <!-- Photo Upload -->
            <div class="form-group">
              <label class="form-label">Add Photos (Optional)</label>
              <div class="photo-upload-area">
                <input 
                  type="file" 
                  ref="photoInput" 
                  @change="handlePhotoUpload" 
                  multiple 
                  accept="image/*"
                  class="photo-input"
                >
                <button 
                  @click="$refs.photoInput.click()" 
                  class="upload-btn"
                  type="button"
                >
                  <i class="fas fa-camera"></i>
                  <span>Add Photos</span>
                </button>
                <p class="upload-hint">Upload up to 5 photos (Max 5MB each)</p>
                
                <div v-if="newReview.photos && newReview.photos.length" class="uploaded-photos">
                  <div 
                    v-for="(photo, index) in newReview.photos" 
                    :key="index"
                    class="uploaded-photo"
                  >
                    <img :src="photo.preview" :alt="`Upload ${index + 1}`">
                    <button 
                      @click="removePhoto(index)" 
                      class="remove-photo"
                      type="button"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeWriteReview" class="btn-secondary">Cancel</button>
          <button 
            @click="submitReview" 
            :disabled="!canSubmitReview"
            class="btn-primary"
          >
            <i class="fas fa-paper-plane"></i>
            Submit Review
          </button>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div v-if="showPhotoModal" class="photo-modal-overlay" @click="closePhotoModal">
      <div class="photo-modal-content" @click.stop>
        <button @click="closePhotoModal" class="photo-modal-close">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="photo-modal-image">
          <img :src="currentPhoto" alt="Review photo">
        </div>
        
        <div v-if="photoGallery.length > 1" class="photo-modal-nav">
          <button @click="previousPhoto" class="photo-nav-btn prev" :disabled="currentPhotoIndex === 0">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="photo-counter">{{ currentPhotoIndex + 1 }} / {{ photoGallery.length }}</span>
          <button @click="nextPhoto" class="photo-nav-btn next" :disabled="currentPhotoIndex === photoGallery.length - 1">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <Transition name="notification">
      <div v-if="notification.show" :class="['notification-toast', notification.type]">
        <div class="notification-content">
          <i :class="notification.icon"></i>
          <span>{{ notification.message }}</span>
        </div>
        <button @click="hideNotification" class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      // Gallery state
      currentImageIndex: 0,
      isZooming: false,
      zoomPosition: { x: 0, y: 0 },
      touchStart: { x: 0, y: 0 },
      
      // Product selection
      selectedSize: null,
      selectedColor: null,
      quantity: 1,
      
      // Cart state
      isAddingToCart: false,
      cartItemQuantity: 0,
      isInCart: false,
      
      // UI state
      activeTab: 'howto',
      showWriteReview: false,
      showPhotoModal: false,
      currentPhoto: '',
      currentPhotoIndex: 0,
      photoGallery: [],
      
      // Review state
      reviewFilter: 'all',
      reviewSort: 'newest',
      newReview: {
        rating: 0,
        title: '',
        text: '',
        photos: []
      },
      hoverRating: 0,
      
      // Carousel state
      relatedOffset: 0,
      maxRelatedOffset: 0,
      
      // Notification
      notification: {
        show: false,
        type: '',
        message: '',
        icon: ''
      },
      
      // Tab configuration
      tabs: [
        { id: 'howto', label: 'How to Use', icon: 'fas fa-info-circle' },
        { id: 'ingredients', label: 'Ingredients', icon: 'fas fa-leaf' },
        { id: 'reviews', label: 'Reviews', icon: 'fas fa-star' },
        { id: 'shipping', label: 'Shipping', icon: 'fas fa-truck' }
      ],
      
      // Mock related products
      relatedProducts: [
        {
          id: 2,
          name: 'Vitamin C Brightening Serum',
          brand: 'VitaGlow',
          price: 65.00,
          originalPrice: 80.00,
          rating: 4.6,
          reviewCount: 892,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
          onSale: true,
          featured: false
        },
        {
          id: 3,
          name: 'Hyaluronic Acid Moisturizer',
          brand: 'HydraLux',
          price: 45.00,
          rating: 4.8,
          reviewCount: 1156,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
          featured: true
        },
        {
          id: 4,
          name: 'Gentle Foaming Cleanser',
          brand: 'PureClean',
          price: 28.00,
          rating: 4.5,
          reviewCount: 743,
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300'
        },
        {
          id: 5,
          name: 'SPF 50 Daily Sunscreen',
          brand: 'SunGuard',
          price: 32.00,
          rating: 4.7,
          reviewCount: 634,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300'
        },
        {
          id: 6,
          name: 'Niacinamide Pore Refining Serum',
          brand: 'ClearSkin',
          price: 38.00,
          rating: 4.4,
          reviewCount: 521,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300'
        }
      ],
      
      // Mock reviews
      reviews: [
        {
          id: 1,
          userName: 'Emma Wilson',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          rating: 5,
          title: 'Amazing transformation!',
          text: 'This product has completely changed my skin routine. After using it for 6 weeks, I can see a visible difference in my skin texture and brightness. The formula is lightweight, absorbs quickly, and doesn\'t cause any irritation. I\'ve already recommended it to all my friends. Definitely worth the investment!',
          date: new Date('2024-01-15'),
          verified: true,
          helpfulCount: 24,
          userHelpfulVote: null,
          photos: [
            { 
              thumbnail: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200', 
              full: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800' 
            }
          ],
          isExpanded: false
        },
        {
          id: 2,
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          rating: 4,
          title: 'Great product, quick results',
          text: 'I love how lightweight this serum is. It absorbs quickly and doesn\'t leave any residue. I\'ve noticed improvement in my skin texture after just 2 weeks of use. The packaging is also very elegant and feels premium.',
          date: new Date('2024-01-10'),
          verified: true,
          helpfulCount: 18,
          userHelpfulVote: null,
          isExpanded: false
        },
        {
          id: 3,
          userName: 'Maria Garcia',
          userAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
          rating: 5,
          title: 'Holy grail product!',
          text: 'This is my third bottle and I\'m never switching! The formula is perfect for my sensitive skin and I love that it\'s fragrance-free. It plays well with other products in my routine and has helped fade my dark spots significantly. Customer service is also excellent.',
          date: new Date('2024-01-08'),
          verified: true,
          helpfulCount: 31,
          userHelpfulVote: null,
          photos: [
            { 
              thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200', 
              full: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800' 
            },
            { 
              thumbnail: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200', 
              full: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800' 
            }
          ],
          isExpanded: false
        }
      ]
    };
  },
  
  computed: {
    ...mapGetters('products', ['productById']),
    ...mapGetters('user', ['isInWishlist']),
    ...mapGetters('cart', ['cartItems']),
    
    product() {
      const baseProduct = this.productById(this.id);
      if (!baseProduct) return null;

      return {
        ...baseProduct,
        images: [
          baseProduct.image || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'
        ],
        sizes: [
          { 
            id: 'small', 
            volume: '30ml', 
            price: baseProduct.price * 0.7, 
            bestseller: false,
            bestValue: false 
          },
          { 
            id: 'medium', 
            volume: '50ml', 
            price: baseProduct.price, 
            bestseller: true,
            bestValue: false 
          },
          { 
            id: 'large', 
            volume: '100ml', 
            price: baseProduct.price * 1.8, 
            bestseller: false,
            bestValue: true 
          }
        ],
        colors: [
          { id: 'nude', name: 'Nude Beige', hex: '#F5DEB3' },
          { id: 'rose', name: 'Rose Gold', hex: '#E8B4B8' },
          { id: 'coral', name: 'Coral Pink', hex: '#FF7F7F' },
          { id: 'berry', name: 'Berry Red', hex: '#DC143C' }
        ],
        benefits: [
          'Clinically proven results',
          'Suitable for all skin types',
          'Paraben-free formula',
          'Cruelty-free',
          'Dermatologist tested'
        ],
        howToUse: [
          {
            step: 1,
            title: 'Cleanse',
            description: 'Start with clean, dry skin for optimal absorption',
            tips: ['Use lukewarm water', 'Pat skin dry with a clean towel']
          },
          {
            step: 2,
            title: 'Apply',
            description: 'Apply 2-3 drops to face and neck using gentle upward motions',
            tips: ['Use gentle circular motions', 'Avoid the immediate eye area', 'Don\'t forget your neck']
          },
          {
            step: 3,
            title: 'Follow',
            description: 'Follow with moisturizer and always apply SPF during the day',
            tips: ['Wait 1-2 minutes before next step', 'Use SPF 30+ during the day', 'Can be used morning and evening']
          }
        ],
        ingredients: [
          { name: 'Water', purpose: 'Solvent', type: 'base' },
          { name: 'Niacinamide', purpose: 'Active ingredient', type: 'active', concentration: '10%' },
          { name: 'Zinc PCA', purpose: 'Sebum regulation', type: 'active', concentration: '1%' },
          { name: 'Hyaluronic Acid', purpose: 'Hydration boost', type: 'active' },
          { name: 'Glycerin', purpose: 'Humectant', type: 'base' },
          { name: 'Phenoxyethanol', purpose: 'Preservative', type: 'preservative' }
        ],
        keyIngredients: [
          {
            name: 'Niacinamide (10%)',
            description: 'A powerful form of Vitamin B3 that helps regulate sebum production, minimize the appearance of pores, and improve skin texture',
            benefits: ['Pore minimizing', 'Oil control', 'Brightening', 'Anti-aging'],
            icon: 'fas fa-leaf'
          },
          {
            name: 'Zinc PCA (1%)',
            description: 'Natural mineral compound that helps control excess oil production and provides gentle anti-inflammatory benefits',
            benefits: ['Sebum control', 'Anti-inflammatory', 'Antimicrobial'],
            icon: 'fas fa-shield-alt'
          },
          {
            name: 'Hyaluronic Acid',
            description: 'Molecular hydration powerhouse that can hold up to 1000x its weight in water for intense moisture',
            benefits: ['Deep hydration', 'Plumping effect', 'Barrier repair'],
            icon: 'fas fa-tint'
          }
        ]
      };
    },
    
    currentImage() {
      return this.product?.images[this.currentImageIndex] || '';
    },
    
    getCurrentPrice() {
      return () => {
        if (this.selectedSize) {
          return this.selectedSize.price;
        }
        return this.product?.price || 0;
      };
    },
    
    discountPercentage() {
      if (this.product?.originalPrice && this.product?.originalPrice > this.getCurrentPrice()) {
        const discount = ((this.product.originalPrice - this.getCurrentPrice()) / this.product.originalPrice) * 100;
        return Math.round(discount);
      }
      return null;
    },
    
    savings() {
      if (this.product?.originalPrice && this.product?.originalPrice > this.getCurrentPrice()) {
        return this.product.originalPrice - this.getCurrentPrice();
      }
      return null;
    },
    
    pricePerMl() {
      const volume = this.selectedSize ? parseInt(this.selectedSize.volume) : 50;
      return this.getCurrentPrice() / volume;
    },
    
    canAddToCart() {
      return this.product && (!this.product.sizes || this.selectedSize);
    },
    
    zoomStyle() {
      if (!this.isZooming) return {};
      return {
        transform: `scale(2.5)`,
        transformOrigin: `${this.zoomPosition.x}% ${this.zoomPosition.y}%`,
        cursor: 'zoom-in'
      };
    },
    
    filteredReviews() {
      let filtered = [...this.reviews];
      
      if (this.reviewFilter !== 'all') {
        if (this.reviewFilter === 'photos') {
          filtered = filtered.filter(review => review.photos && review.photos.length > 0);
        } else if (this.reviewFilter === 'verified') {
          filtered = filtered.filter(review => review.verified);
        } else {
          filtered = filtered.filter(review => review.rating === parseInt(this.reviewFilter));
        }
      }
      
      switch (this.reviewSort) {
        case 'oldest':
          filtered.sort((a, b) => a.date - b.date);
          break;
        case 'highest':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case 'helpful':
          filtered.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
          break;
        default:
          filtered.sort((a, b) => b.date - a.date);
      }
      
      return filtered;
    },
    
    canSubmitReview() {
      return this.newReview.rating > 0 && this.newReview.text.trim().length >= 10;
    },
    
    hasMoreReviews() {
      return this.reviews.length > 6;
    }
  },
  
  watch: {
    id: {
      immediate: true,
      handler(newId) {
        if (newId && this.product) {
          this.initializeProduct();
        }
      }
    }
  },
  
  mounted() {
    this.calculateMaxOffset();
    window.addEventListener('resize', this.calculateMaxOffset);
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateMaxOffset);
  },
  
  methods: {
    ...mapActions('cart', ['addToCart', 'updateCart', 'removeFromCart']),
    ...mapActions('user', ['toggleWishlist', 'addToRecentlyViewed']),
    ...mapActions('ui', ['showNotification']),
    
    initializeProduct() {
      // Initialize default selections
      if (this.product?.sizes) {
        this.selectedSize = this.product.sizes.find(size => size.bestseller) || this.product.sizes[0];
      }
      
      if (this.product?.colors) {
        this.selectedColor = this.product.colors[0];
      }
      
      // Check cart status
      this.checkCartStatus();
      
      // Add to recently viewed
      if (this.product) {
        this.addToRecentlyViewed(this.product);
      }
    },
    
    checkCartStatus() {
      const cartItem = this.cartItems.find(item => item.id === this.product?.id);
      this.isInCart = !!cartItem;
      this.cartItemQuantity = cartItem ? cartItem.quantity : 0;
    },
    
    // Image gallery methods
    selectImage(index) {
      this.currentImageIndex = index;
    },
    
    previousImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },
    
    nextImage() {
      if (this.currentImageIndex < this.product.images.length - 1) {
        this.currentImageIndex++;
      }
    },
    
    handleMouseMove(event) {
      this.isZooming = true;
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      this.zoomPosition = { x, y };
    },
    
    resetZoom() {
      this.isZooming = false;
      this.zoomPosition = { x: 0, y: 0 };
    },
    
    // Touch handlers for mobile zoom
    handleTouchStart(event) {
      if (event.touches.length === 1) {
        this.touchStart = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }
    },
    
    handleTouchMove(event) {
      if (event.touches.length === 1) {
        const rect = event.target.getBoundingClientRect();
        const x = ((event.touches[0].clientX - rect.left) / rect.width) * 100;
        const y = ((event.touches[0].clientY - rect.top) / rect.height) * 100;
        this.zoomPosition = { x, y };
        this.isZooming = true;
      }
    },
    
    handleTouchEnd() {
      setTimeout(() => {
        this.isZooming = false;
      }, 300);
    },
    
    // Selection methods
    selectSize(size) {
      this.selectedSize = size;
    },
    
    selectColor(color) {
      this.selectedColor = color;
    },
    
    // Quantity methods
    increaseQuantity() {
      if (this.quantity < 10) this.quantity++;
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
    },
    
    // Cart methods
    async addToCart() {
      if (!this.canAddToCart) return;
      
      this.isAddingToCart = true;
      
      try {
        await this.addToCart({
          ...this.product,
          selectedSize: this.selectedSize,
          selectedColor: this.selectedColor,
          quantity: this.quantity
        });
        
        this.showSuccessNotification('Added to cart!', 'fas fa-check-circle');
        this.checkCartStatus();
        this.animateAddToCart();
        
      } catch (error) {
        this.showErrorNotification('Failed to add to cart');
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    async updateCartQuantity(change) {
      try {
        const newQuantity = this.cartItemQuantity + change;
        if (newQuantity <= 0) {
          await this.removeFromCart(this.product.id);
          this.showSuccessNotification('Removed from cart');
        } else {
          await this.updateCart({
            productId: this.product.id,
            quantity: newQuantity
          });
        }
        this.checkCartStatus();
      } catch (error) {
        this.showErrorNotification('Failed to update cart');
      }
    },
    
    async removeFromCart() {
      try {
        await this.removeFromCart(this.product.id);
        this.showSuccessNotification('Removed from cart');
        this.checkCartStatus();
      } catch (error) {
        this.showErrorNotification('Failed to remove from cart');
      }
    },
    
    animateAddToCart() {
      // Enhanced cart animation
      const productImg = this.$refs.mainImage;
      const cartIcon = document.querySelector('.cart-btn') || document.querySelector('.sticky-add-btn');
      
      if (productImg && cartIcon) {
        const flyingImg = productImg.cloneNode();
        flyingImg.style.cssText = `
          position: fixed;
          z-index: 9999;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
        `;
        
        const productRect = productImg.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        
        flyingImg.style.left = productRect.left + 'px';
        flyingImg.style.top = productRect.top + 'px';
        
        document.body.appendChild(flyingImg);
        
        setTimeout(() => {
          flyingImg.style.left = cartRect.left + 'px';
          flyingImg.style.top = cartRect.top + 'px';
          flyingImg.style.transform = 'scale(0.1)';
          flyingImg.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
          document.body.removeChild(flyingImg);
        }, 900);
      }
    },
    
    async buyNow() {
      if (this.canAddToCart) {
        await this.addToCart();
        this.$router.push('/checkout');
      }
    },
    
    async toggleWishlist() {
      try {
        const result = await this.toggleWishlist(this.product);
        this.showSuccessNotification(result.message);
      } catch (error) {
        this.showErrorNotification('Failed to update wishlist');
      }
    },
    
    // Share methods
    shareVia(platform) {
      const url = window.location.href;
      const text = `Check out this amazing ${this.product.name} from ${this.product.brand}!`;
      
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case 'instagram':
          this.copyLink();
          this.showInfoNotification('Link copied! Paste it in your Instagram story');
          break;
      }
    },
    
    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.showSuccessNotification('Link copied to clipboard!');
      } catch (error) {
        this.showErrorNotification('Failed to copy link');
      }
    },
    
    // Review methods
    getRatingPercentage(rating) {
      const total = this.reviews.length;
      const count = this.reviews.filter(r => r.rating === rating).length;
      return total > 0 ? (count / total) * 100 : 0;
    },
    
    getRatingCount(rating) {
      return this.reviews.filter(r => r.rating === rating).length;
    },
    
    markHelpful(reviewId, helpful) {
      const review = this.reviews.find(r => r.id === reviewId);
      if (review) {
        if (review.userHelpfulVote === helpful) {
          review.userHelpfulVote = null;
          if (helpful) review.helpfulCount = Math.max(0, (review.helpfulCount || 1) - 1);
        } else {
          if (review.userHelpfulVote === true) review.helpfulCount = Math.max(0, (review.helpfulCount || 1) - 1);
          review.userHelpfulVote = helpful;
          if (helpful) review.helpfulCount = (review.helpfulCount || 0) + 1;
        }
      }
    },
    
    loadMoreReviews() {
      this.showInfoNotification('Loading more reviews...');
    },
    
    closeWriteReview() {
      this.showWriteReview = false;
      this.newReview = {
        rating: 0,
        title: '',
        text: '',
        photos: []
      };
      this.hoverRating = 0;
    },
    
    handlePhotoUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) { // 5MB limit
          if (this.newReview.photos.length < 5) { // Max 5 photos
            const reader = new FileReader();
            reader.onload = (e) => {
              this.newReview.photos.push({
                file,
                preview: e.target.result
              });
            };
            reader.readAsDataURL(file);
          }
        }
      });
    },
    
    removePhoto(index) {
      this.newReview.photos.splice(index, 1);
    },
    
    async submitReview() {
      if (!this.canSubmitReview) return;
      
      try {
        // Mock submission - in real app, would send to backend
        const newReview = {
          id: Date.now(),
          userName: 'You',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          rating: this.newReview.rating,
          title: this.newReview.title,
          text: this.newReview.text,
          date: new Date(),
          verified: true,
          helpfulCount: 0,
          userHelpfulVote: null,
          photos: this.newReview.photos.map(photo => ({
            thumbnail: photo.preview,
            full: photo.preview
          })),
          isExpanded: false
        };
        
        this.reviews.unshift(newReview);
        this.closeWriteReview();
        this.showSuccessNotification('Review submitted successfully!');
        
      } catch (error) {
        this.showErrorNotification('Failed to submit review');
      }
    },
    
    getRatingLabel(rating) {
      const labels = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      };
      return labels[rating] || 'Rate this product';
    },
    
    // Photo modal methods
    openPhotoModal(photo, gallery) {
      this.currentPhoto = photo.full;
      this.photoGallery = gallery;
      this.currentPhotoIndex = gallery.findIndex(p => p.full === photo.full);
      this.showPhotoModal = true;
    },
    
    closePhotoModal() {
      this.showPhotoModal = false;
      this.currentPhoto = '';
      this.photoGallery = [];
    },
    
    previousPhoto() {
      if (this.currentPhotoIndex > 0) {
        this.currentPhotoIndex--;
        this.currentPhoto = this.photoGallery[this.currentPhotoIndex].full;
      }
    },
    
    nextPhoto() {
      if (this.currentPhotoIndex < this.photoGallery.length - 1) {
        this.currentPhotoIndex++;
        this.currentPhoto = this.photoGallery[this.currentPhotoIndex].full;
      }
    },
    
    // Related products carousel
    calculateMaxOffset() {
      this.$nextTick(() => {
        const carousel = this.$refs.relatedCarousel;
        if (carousel) {
          const containerWidth = carousel.offsetWidth;
          const trackWidth = carousel.querySelector('.products-track')?.scrollWidth || 0;
          this.maxRelatedOffset = Math.max(0, trackWidth - containerWidth);
        }
      });
    },
    
    scrollRelated(direction) {
      const scrollAmount = 320; // Card width + gap
      if (direction === 'left') {
        this.relatedOffset = Math.max(0, this.relatedOffset - scrollAmount);
      } else {
        this.relatedOffset = Math.min(this.maxRelatedOffset, this.relatedOffset + scrollAmount);
      }
    },
    
    async quickAddToCart(product) {
      try {
        await this.addToCart(product);
        this.showSuccessNotification(`${product.name} added to cart!`);
      } catch (error) {
        this.showErrorNotification('Failed to add product to cart');
      }
    },
    
    // Utility methods
    getStepIcon(step) {
      const icons = {
        1: 'fas fa-soap',
        2: 'fas fa-hand-holding-heart',
        3: 'fas fa-sun'
      };
      return icons[step] || 'fas fa-circle';
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    // Notification methods
    showSuccessNotification(message, icon = 'fas fa-check-circle') {
      this.notification = {
        show: true,
        type: 'success',
        message,
        icon
      };
      setTimeout(() => this.hideNotification(), 4000);
    },
    
    showErrorNotification(message, icon = 'fas fa-exclamation-circle') {
      this.notification = {
        show: true,
        type: 'error',
        message,
        icon
      };
      setTimeout(() => this.hideNotification(), 4000);
    },
    
    showInfoNotification(message, icon = 'fas fa-info-circle') {
      this.notification = {
        show: true,
        type: 'info',
        message,
        icon
      };
      setTimeout(() => this.hideNotification(), 4000);
    },
    
    hideNotification() {
      this.notification.show = false;
    }
  }
};
</script>

<style scoped>
/* Premium Product Detail Page Styles */

.product-detail-page {
  background: linear-gradient(135deg, #faf7f7 0%, #f8f4f8 100%);
  min-height: 100vh;
  padding-top: 100px;
}

/* Hero Section */
.product-hero {
  background: var(--market-surface);
  padding: 60px 0;
  margin-bottom: 60px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.hero-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

/* Premium Image Gallery */
.product-gallery {
  position: sticky;
  top: 120px;
}

.main-image-container {
  position: relative;
  background: var(--market-surface);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.main-image-wrapper {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: zoom-in;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Premium Share Overlay */
.share-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.share-icons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.share-icons:hover {
  opacity: 1;
}

.share-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.share-btn.whatsapp {
  background: linear-gradient(135deg, #25D366, #20b358);
}

.share-btn.instagram {
  background: linear-gradient(135deg, #E4405F, #C13584, #833AB4);
}

.share-btn.facebook {
  background: linear-gradient(135deg, #1877F2, #166fe5);
}

.share-btn.copy {
  background: linear-gradient(135deg, #6B7280, #4B5563);
}

.share-btn:hover {
  transform: translateY(-2px) scale(1.1);
}

/* Zoom Indicator */
.zoom-indicator {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.3s ease;
}

.zoom-icon {
  font-size: 16px;
  opacity: 0.9;
}

.zoom-text {
  font-weight: 500;
  font-size: 13px;
}

/* Navigation Arrows */
.image-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--market-text);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 5;
}

.image-nav:hover:not(:disabled) {
  background: var(--market-surface);
  transform: translateY(-50%) scale(1.1);
  color: var(--market-primary);
}

.image-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-nav.prev {
  left: 20px;
}

.image-nav.next {
  right: 20px;
}

/* Premium Thumbnail Gallery */
.thumbnail-gallery {
  margin-top: 20px;
}

.thumbnails-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0;
}

.thumbnail {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  border: 3px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s ease;
}

.thumbnail.active {
  border-color: var(--market-primary);
  transform: scale(1.05);
}

.thumbnail.active .thumbnail-overlay {
  opacity: 0;
}

.thumbnail:hover .thumbnail-overlay {
  opacity: 0.1;
}

/* Product Information Panel */
.product-info {
  padding: 40px 0;
}

.product-header {
  margin-bottom: 40px;
}

.brand-trust-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.brand-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.trust-badges {
  display: flex;
  gap: 8px;
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--market-secondary), #f0f9ff);
  color: var(--market-primary);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--market-border);
}

.rating-section {
  text-align: right;
}

.stars-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars .fa-star {
  color: #e5e7eb;
  font-size: 16px;
  transition: color 0.2s ease;
}

.stars .fa-star.filled {
  color: #fbbf24;
}

.rating-text {
  font-size: 14px;
  color: var(--market-text-light);
  font-weight: 500;
}

/* Premium Product Title */
.product-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--market-text);
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.product-description {
  font-size: 18px;
  color: var(--market-text-light);
  line-height: 1.6;
  margin-bottom: 24px;
}

/* Benefits Pills */
.benefits-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.benefit-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #065f46;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #a7f3d0;
}

.benefit-pill i {
  font-size: 12px;
  opacity: 0.8;
}

/* Premium Pricing Section */
.pricing-section {
  background: linear-gradient(135deg, #faf7f7, #f5f0f5);
  padding: 32px;
  border-radius: 20px;
  margin-bottom: 40px;
  border: 1px solid var(--market-border);
}

.price-display {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 3rem;
  font-weight: 800;
  color: var(--market-text);
  letter-spacing: -0.02em;
}

.original-price {
  font-size: 1.5rem;
  color: var(--market-text-light);
  text-decoration: line-through;
  opacity: 0.7;
}

.discount-badge {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  color: #92400e;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-details {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.price-per-unit {
  color: var(--market-text-light);
  font-size: 14px;
  font-weight: 500;
}

.savings {
  color: #059669;
  font-weight: 600;
  font-size: 14px;
}

.free-shipping {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--market-primary);
  font-size: 14px;
  font-weight: 600;
}

/* Variant Selection */
.variant-section,
.color-section {
  margin-bottom: 32px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 16px;
}

.selected-color-name {
  color: var(--market-primary);
  font-weight: 500;
}

/* Premium Size Selector */
.size-selector {
  display: grid;
  gap: 12px;
}

.size-option {
  position: relative;
  background: var(--market-surface);
  border: 2px solid var(--market-border);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.size-option::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--market-primary), var(--market-accent));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.size-option:hover {
  border-color: var(--market-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.size-option.selected {
  border-color: var(--market-primary);
  background: var(--market-secondary);
}

.size-option.selected::before {
  opacity: 0.05;
}

.size-main {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.size-volume {
  font-size: 18px;
  font-weight: 700;
  color: var(--market-text);
}

.size-price {
  font-size: 20px;
  font-weight: 800;
  color: var(--market-primary);
}

.size-badges {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
}

.size-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.size-badge.bestseller {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.size-badge.best-value {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

/* Premium Color Selector */
.color-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.color-option::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: transparent;
  border: 3px solid transparent;
  transition: border-color 0.3s ease;
}

.color-option:hover::before {
  border-color: var(--market-text-light);
}

.color-option.selected::before {
  border-color: var(--market-primary);
}

.color-option:hover {
  transform: scale(1.1);
}

.color-check {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.color-ring {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Premium Add to Cart Section */
.add-to-cart-section {
  margin-bottom: 40px;
}

.cart-add-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 16px;
}

.qty-label {
  font-weight: 600;
  color: var(--market-text);
  font-size: 16px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 2px solid var(--market-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--market-surface);
}

.qty-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--market-text);
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--market-secondary);
  color: var(--market-primary);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 44px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  background: transparent;
  color: var(--market-text);
}

.qty-input:focus {
  outline: none;
}

/* Premium Add to Cart Button */
.add-to-cart-btn {
  position: relative;
  background: var(--market-gradient);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 64px;
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.3);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(236, 72, 153, 0.4);
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 32px;
  position: relative;
  z-index: 2;
}

.btn-icon {
  font-size: 20px;
}

.btn-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.btn-label {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-price {
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
}

.btn-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.add-to-cart-btn:hover .btn-shimmer {
  left: 100%;
}

/* Loading Animation */
.loading-animation {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: loadingDots 1.4s infinite both;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.16s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.32s;
}

@keyframes loadingDots {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

/* Cart Modification Styles */
.cart-modify-container {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 2px solid #10b981;
  border-radius: 16px;
  padding: 24px;
}

.cart-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.status-icon {
  color: #059669;
  font-size: 24px;
}

.status-text {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 16px;
  font-weight: 600;
  color: #065f46;
}

.status-count {
  font-size: 14px;
  color: #047857;
}

.cart-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quantity-modifier {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  border: 2px solid #a7f3d0;
  overflow: hidden;
}

.qty-mod-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  transition: background-color 0.2s ease;
}

.qty-mod-btn:hover {
  background: #f0fdf4;
}

.cart-quantity {
  width: 50px;
  text-align: center;
  font-weight: 600;
  color: #065f46;
  padding: 0 8px;
}

.remove-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 2px solid #ef4444;
  color: #dc2626;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #fef2f2;
  color: #b91c1c;
}

/* Secondary Actions */
.secondary-actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.wishlist-btn,
.buy-now-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.wishlist-btn {
  background: var(--market-surface);
  border: 2px solid var(--market-border);
  color: var(--market-text);
}

.wishlist-btn:hover {
  border-color: #ef4444;
  color: #dc2626;
  background: #fef2f2;
}

.wishlist-btn.active {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-color: #ef4444;
  color: #dc2626;
}

.buy-now-btn {
  background: linear-gradient(135deg, #1f2937, #374151);
  border: 2px solid transparent;
  color: white;
}

.buy-now-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #374151, #4b5563);
  transform: translateY(-1px);
}

.buy-now-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Premium Features */
.premium-features {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--market-primary), var(--market-accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.feature-text {
  display: flex;
  flex-direction: column;
}

.feature-title {
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 14px;
  color: var(--market-text-light);
}

/* Product Details Section */
.product-details-section {
  background: var(--market-surface);
  padding: 80px 0;
  margin-top: 60px;
}

/* Premium Tab Navigation */
.tabs-navigation {
  margin-bottom: 60px;
}

.tabs-container {
  display: flex;
  justify-content: center;
  background: var(--market-secondary);
  border-radius: 20px;
  padding: 8px;
  position: relative;
  border: 1px solid var(--market-border);
}

.tab-btn {
  position: relative;
  background: transparent;
  border: none;
  padding: 20px 32px;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--market-text-light);
  font-weight: 600;
  min-width: 160px;
  justify-content: center;
}

.tab-btn:hover {
  color: var(--market-text);
  background: rgba(255, 255, 255, 0.5);
}

.tab-btn.active {
  background: var(--market-surface);
  color: var(--market-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-icon {
  font-size: 18px;
}

.tab-label {
  font-size: 16px;
}

.tab-count {
  background: var(--market-primary);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.tab-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: var(--market-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.tab-btn.active .tab-indicator {
  width: 60%;
}

/* Tab Content */
.tab-content-container {
  min-height: 500px;
}

.tab-panel {
  animation: fadeInUp 0.4s ease;
}

.tab-header {
  text-align: center;
  margin-bottom: 60px;
}

.tab-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.tab-subtitle {
  font-size: 18px;
  color: var(--market-text-light);
  max-width: 600px;
  margin: 0 auto;
}

/* How to Use Styles */
.usage-steps {
  max-width: 800px;
  margin: 0 auto 60px;
}

.usage-step {
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  gap: 32px;
  align-items: start;
  margin-bottom: 48px;
  position: relative;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--market-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
}

.step-line {
  width: 3px;
  height: 40px;
  background: linear-gradient(to bottom, var(--market-primary), var(--market-border));
  border-radius: 2px;
}

.step-content {
  background: var(--market-surface);
  padding: 32px;
  border-radius: 20px;
  border: 1px solid var(--market-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.step-main {
  margin-bottom: 20px;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 12px;
}

.step-description {
  font-size: 16px;
  color: var(--market-text-light);
  line-height: 1.6;
}

.step-tips {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #0c4a6e;
  margin-bottom: 12px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  color: #075985;
  font-size: 14px;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.tips-list li::before {
  content: '•';
  color: #0ea5e9;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.step-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--market-secondary), #f0f9ff);
  color: var(--market-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid var(--market-border);
}

/* Routine Section */
.routine-section {
  background: linear-gradient(135deg, #faf7f7, #f5f0f5);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid var(--market-border);
}

.routine-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 32px;
  text-align: center;
  justify-content: center;
}

.routine-timeline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.routine-time {
  background: var(--market-surface);
  padding: 32px;
  border-radius: 16px;
  border: 1px solid var(--market-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.time-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.time-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

.morning .time-icon {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.evening .time-icon {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.time-label {
  font-size: 20px;
  font-weight: 700;
  color: var(--market-text);
  margin: 0;
}

.routine-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.routine-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--market-secondary);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.routine-step.current {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-color: #f59e0b;
  color: #92400e;
  font-weight: 600;
}

.step-order {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--market-text-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.routine-step.current .step-order {
  background: #f59e0b;
}

.step-product {
  font-size: 14px;
  color: var(--market-text);
}

/* Ingredients Styles */
.key-ingredients-section {
  margin-bottom: 60px;
}

.section-subtitle {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 32px;
  text-align: center;
  justify-content: center;
}

.key-ingredients-grid {
  display: grid;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.key-ingredient-card {
  background: var(--market-surface);
  padding: 32px;
  border-radius: 20px;
  border: 1px solid var(--market-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.key-ingredient-card:hover {
  transform: translateY(-4px);
}

.ingredient-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.ingredient-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--market-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.ingredient-info {
  flex: 1;
}

.ingredient-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 8px;
}

.ingredient-description {
  color: var(--market-text-light);
  line-height: 1.6;
  margin: 0;
}

.ingredient-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.benefit-tag {
  background: linear-gradient(135deg, var(--market-secondary), #f0f9ff);
  color: var(--market-primary);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--market-border);
}

/* Full Ingredients List */
.full-ingredients-section {
  max-width: 800px;
  margin: 0 auto;
}

.ingredients-grid {
  display: grid;
  gap: 12px;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--market-surface);
  border-radius: 12px;
  border: 1px solid var(--market-border);
}

.ingredient-main {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ingredient-name {
  font-weight: 600;
  color: var(--market-text);
}

.ingredient-purpose {
  font-size: 14px;
  color: var(--market-text-light);
  margin-top: 2px;
}

.ingredient-concentration {
  background: var(--market-primary);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.ingredient-item.active {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-color: #f59e0b;
}

/* Reviews Styles */
.reviews-header {
  margin-bottom: 40px;
}

.reviews-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: linear-gradient(135deg, #faf7f7, #f5f0f5);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid var(--market-border);
}

.rating-overview {
  text-align: center;
}

.average-rating {
  margin-bottom: 32px;
}

.rating-number {
  font-size: 4rem;
  font-weight: 800;
  color: var(--market-text);
  display: block;
  line-height: 1;
  margin-bottom: 12px;
}

.rating-stars {
  margin-bottom: 8px;
}

.rating-stars .fa-star {
  font-size: 24px;
  color: #e5e7eb;
  margin: 0 2px;
}

.rating-stars .fa-star.filled {
  color: #fbbf24;
}

.rating-subtitle {
  color: var(--market-text-light);
  font-size: 16px;
  font-weight: 500;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-row {
  display: grid;
  grid-template-columns: 40px 1fr 30px;
  gap: 12px;
  align-items: center;
}

.rating-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--market-text);
}

.rating-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.rating-count {
  font-size: 14px;
  color: var(--market-text-light);
  text-align: right;
}

.review-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: stretch;
}

.write-review-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
}

.write-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.4);
}

.review-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-select,
.sort-select {
  padding: 12px 16px;
  border: 2px solid var(--market-border);
  border-radius: 12px;
  background: var(--market-surface);
  color: var(--market-text);
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus,
.sort-select:focus {
  outline: none;
  border-color: var(--market-primary);
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 40px;
}

.review-item {
  background: var(--market-surface);
  padding: 32px;
  border-radius: 20px;
  border: 1px solid var(--market-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.review-item:hover {
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.reviewer-profile {
  display: flex;
  gap: 16px;
}

.reviewer-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reviewer-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin: 0;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.review-rating .fa-star {
  color: #e5e7eb;
  font-size: 16px;
}

.review-rating .fa-star.filled {
  color: #fbbf24;
}

.review-date {
  color: var(--market-text-light);
  font-size: 14px;
}

.verified-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135d, #ecfdf5, #d1fae5);
  color: #065f46;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #a7f3d0;
}

.review-content {
  margin-bottom: 20px;
}

.review-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 12px;
}

.review-text {
  color: var(--market-text-light);
  line-height: 1.6;
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.review-text.expanded {
  max-height: none;
}

.read-more-btn {
  color: var(--market-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-top: 8px;
}

.review-photos {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.review-photo {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.review-photo:hover {
  transform: scale(1.05);
}

.review-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.review-photo:hover .photo-overlay {
  opacity: 1;
}

.review-footer {
  border-top: 1px solid var(--market-border);
  padding-top: 16px;
}

.helpfulness {
  display: flex;
  align-items: center;
  gap: 16px;
}

.helpful-question {
  color: var(--market-text-light);
  font-size: 14px;
  font-weight: 500;
}

.helpful-actions {
  display: flex;
  gap: 8px;
}

.helpful-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 2px solid var(--market-border);
  color: var(--market-text-light);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.helpful-btn:hover {
  border-color: var(--market-primary);
  color: var(--market-primary);
}

.helpful-btn.active {
  background: var(--market-primary);
  border-color: var(--market-primary);
  color: white;
}

.load-more-section {
  text-align: center;
}

.load-more-btn {
  background: transparent;
  border: 2px solid var(--market-border);
  color: var(--market-text);
  padding: 16px 32px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.load-more-btn:hover {
  border-color: var(--market-primary);
  color: var(--market-primary);
  transform: translateY(-2px);
}

/* Shipping Styles */
.shipping-content {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  gap: 60px;
}

.content-subtitle {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 32px;
}

.shipping-methods {
  display: grid;
  gap: 20px;
}

.shipping-method {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: var(--market-surface);
  border-radius: 16px;
  border: 1px solid var(--market-border);
  transition: all 0.3s ease;
}

.shipping-method:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.method-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: var(--market-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.method-details {
  flex: 1;
}

.method-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 8px;
}

.method-time {
  color: var(--market-text-light);
  margin-bottom: 8px;
  font-size: 16px;
}

.method-price {
  color: var(--market-primary);
  font-weight: 600;
  font-size: 16px;
}

.policy-grid {
  display: grid;
  gap: 20px;
}

.policy-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: var(--market-surface);
  border-radius: 16px;
  border: 1px solid var(--market-border);
}

.policy-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.policy-content {
  flex: 1;
}

.policy-content h5 {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 8px;
}

.policy-content p {
  color: var(--market-text-light);
  line-height: 1.6;
  margin: 0;
}

/* Related Products */
.related-products-section {
  background: linear-gradient(135deg, #faf7f7, #f5f0f5);
  padding: 80px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 18px;
  color: var(--market-text-light);
}

.related-products-carousel {
  position: relative;
  overflow: hidden;
}

.carousel-container {
  overflow: hidden;
  margin: 0 60px;
}

.products-track {
  display: flex;
  gap: 24px;
  transition: transform 0.4s ease;
}

.related-product-card {
  flex: 0 0 300px;
  background: var(--market-surface);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--market-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.related-product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.related-product-card .product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.related-product-card .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-product-card:hover .product-image img {
  transform: scale(1.05);
}

.quick-add-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  color: var(--market-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.related-product-card:hover .quick-add-btn {
  opacity: 1;
  transform: scale(1.1);
}

.product-badges {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.product-badge.sale {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  color: #92400e;
}

.product-badge.featured {
  background: linear-gradient(135deg, #ecfdf5, #10b981);
  color: #065f46;
}

.related-product-card .product-details {
  padding: 24px;
}

.related-product-card .product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 6px;
  line-height: 1.3;
}

.related-product-card .product-brand {
  font-size: 14px;
  color: var(--market-text-light);
  margin-bottom: 12px;
}

.related-product-card .product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.related-product-card .stars .fa-star {
  color: #e5e7eb;
  font-size: 14px;
}

.related-product-card .stars .fa-star.filled {
  color: #fbbf24;
}

.review-count {
  font-size: 13px;
  color: var(--market-text-light);
}

.related-product-card .product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.related-product-card .current-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--market-text);
}

.related-product-card .original-price {
  font-size: 14px;
  color: var(--market-text-light);
  text-decoration: line-through;
}

/* Carousel Navigation */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: var(--market-surface);
  color: var(--market-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.carousel-nav:hover:not(:disabled) {
  background: var(--market-primary);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.carousel-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-nav.prev {
  left: 0;
}

.carousel-nav.next {
  right: 0;
}

/* Sticky Mobile Cart */
.sticky-mobile-cart {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--market-surface);
  border-top: 1px solid var(--market-border);
  padding: 16px 20px;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.sticky-cart-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sticky-cart-content.in-cart {
  justify-content: space-between;
}

.sticky-product-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.sticky-product-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.sticky-product-details h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 4px;
}

.sticky-price {
  font-size: 16px;
  font-weight: 700;
  color: var(--market-primary);
}

.sticky-add-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.sticky-add-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.sticky-add-btn:disabled {
  opacity: 0.7;
}

.mini-loading .mini-dots {
  display: flex;
  gap: 2px;
}

.mini-dots span {
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: loadingDots 1.4s infinite both;
}

.mini-dots span:nth-child(2) {
  animation-delay: 0.16s;
}

.mini-dots span:nth-child(3) {
  animation-delay: 0.32s;
}

.sticky-in-cart-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #059669;
  font-weight: 600;
}

.sticky-cart-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sticky-qty-controls {
  display: flex;
  gap: 8px;
}

.sticky-qty-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid var(--market-border);
  background: var(--market-surface);
  color: var(--market-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.sticky-qty-btn:hover {
  border-color: var(--market-primary);
  color: var(--market-primary);
}

.view-cart-btn {
  background: var(--market-text);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-cart-btn:hover {
  background: var(--market-primary);
}

/* Write Review Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--market-surface);
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.write-review-modal {
  max-width: 700px;
}

.modal-header {
  padding: 32px 32px 24px;
  border-bottom: 1px solid var(--market-border);
  text-align: center;
  position: relative;
}

.modal-header h3 {
  font-size: 28px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 8px;
}

.modal-subtitle {
  color: var(--market-text-light);
  font-size: 16px;
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 40px;
  height: 40px;
  border: none;
  background: var(--market-secondary);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--market-text-light);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--market-border);
  color: var(--market-text);
}

.modal-body {
  padding: 32px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.rating-group {
  align-items: center;
  text-align: center;
}

.form-label {
  font-weight: 600;
  color: var(--market-text);
  font-size: 16px;
}

.rating-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.rating-star {
  font-size: 32px;
  color: #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 4px;
}

.rating-star.filled,
.rating-star.hover {
  color: #fbbf24;
  transform: scale(1.1);
}

.rating-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-primary);
  min-height: 24px;
}

.form-input,
.form-textarea {
  padding: 16px 20px;
  border: 2px solid var(--market-border);
  border-radius: 12px;
  font-size: 16px;
  color: var(--market-text);
  background: var(--market-surface);
  transition: border-color 0.2s ease;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--market-primary);
}

.character-count {
  align-self: flex-end;
  font-size: 14px;
  color: var(--market-text-light);
}

.photo-upload-area {
  border: 2px dashed var(--market-border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: border-color 0.2s ease;
}

.photo-upload-area:hover {
  border-color: var(--market-primary);
}

.photo-input {
  display: none;
}

.upload-btn {
  background: var(--market-secondary);
  border: 2px solid var(--market-border);
  color: var(--market-text);
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  margin: 0 auto;
}

.upload-btn:hover {
  border-color: var(--market-primary);
  color: var(--market-primary);
}

.upload-hint {
  margin-top: 12px;
  color: var(--market-text-light);
  font-size: 14px;
}

.uploaded-photos {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.uploaded-photo {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.modal-footer {
  padding: 24px 32px 32px;
  border-top: 1px solid var(--market-border);
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.btn-secondary,
.btn-primary {
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: var(--market-secondary);
  color: var(--market-text);
  border-color: var(--market-border);
}

.btn-secondary:hover {
  background: var(--market-border);
}

.btn-primary {
  background: var(--market-gradient);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Photo Modal */
.photo-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.photo-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-modal-close {
  position: absolute;
  top: -60px;
  right: 0;
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background-color 0.2s ease;
  backdrop-filter: blur(10px);
}

.photo-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.photo-modal-image {
  max-width: 100%;
  max-height: calc(90vh - 80px);
  border-radius: 12px;
  overflow: hidden;
}

.photo-modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.photo-modal-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 20px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.photo-nav-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.photo-nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.photo-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.photo-counter {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 120px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 400px;
  z-index: 4000;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.notification-toast.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.notification-toast.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.notification-toast.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-content i {
  font-size: 20px;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .hero-layout {
    gap: 60px;
  }
  
  .related-product-card {
    flex: 0 0 280px;
  }
}

@media (max-width: 1024px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .product-gallery {
    position: static;
  }
  
  .reviews-summary {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .routine-timeline {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .tabs-container {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .tab-btn {
    min-width: 140px;
    padding: 16px 24px;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding-top: 80px;
  }
  
  .product-hero {
    padding: 40px 0;
  }
  
  .hero-layout {
    gap: 32px;
  }
  
  .product-title {
    font-size: 2rem;
  }
  
  .pricing-section {
    padding: 24px;
  }
  
  .current-price {
    font-size: 2.5rem;
  }
  
  .size-selector {
    grid-template-columns: 1fr;
  }
  
  .secondary-actions {
    flex-direction: column;
  }
  
  .tabs-container {
    padding: 6px;
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
    justify-content: flex-start;
    min-width: auto;
    padding: 16px 20px;
  }
  
  .tab-title {
    font-size: 2rem;
  }
  
  .usage-step {
    grid-template-columns: 60px 1fr;
    gap: 20px;
  }
  
  .step-visual {
    display: none;
  }
  
  .step-number {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .modal-content {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 20px;
  }
  
  .sticky-mobile-cart {
    display: block;
  }
  
  .carousel-container {
    margin: 0 40px;
  }
  
  .related-product-card {
    flex: 0 0 260px;
  }
}

@media (max-width: 480px) {
  .share-icons {
    flex-direction: row;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    padding: 8px;
    border-radius: 20px;
  }
  
  .share-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .brand-trust-row {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .rating-section {
    text-align: left;
  }
  
  .stars-container {
    align-items: flex-start;
  }
  
  .quantity-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .modal-header h3 {
    font-size: 24px;
  }
  
  .rating-star {
    font-size: 28px;
    margin: 0 2px;
  }
  
  .carousel-container {
    margin: 0 20px;
  }
  
  .related-product-card {
    flex: 0 0 240px;
  }
  
  .notification-toast {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
