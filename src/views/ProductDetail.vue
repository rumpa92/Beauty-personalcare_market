<template>
  <div class="product-detail-page" v-if="product">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb-nav">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-item">
            <i class="fas fa-home"></i>
            Home
          </router-link>
          <i class="fas fa-chevron-right"></i>
          <router-link :to="`/products?category=${product.category}`" class="breadcrumb-item">
            {{ formatCategory(product.category) }}
          </router-link>
          <i class="fas fa-chevron-right"></i>
          <span class="breadcrumb-current">{{ product.name }}</span>
        </div>
      </div>
    </nav>

    <div class="container">
      <!-- Main Product Section -->
      <div class="product-main-section">
        <!-- Product Image Carousel -->
        <div class="product-gallery">
          <div class="main-image-container">
            <div class="main-image-wrapper" @mousemove="handleMouseMove" @mouseleave="resetZoom">
              <img 
                :src="currentImage" 
                :alt="product.name"
                class="main-image"
                :style="zoomStyle"
                ref="mainImage"
              >
              
              <!-- Share Icons Overlay -->
              <div class="share-overlay">
                <div class="share-icons">
                  <button @click="shareVia('whatsapp')" class="share-btn whatsapp" title="Share on WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                  </button>
                  <button @click="shareVia('instagram')" class="share-btn instagram" title="Share on Instagram">
                    <i class="fab fa-instagram"></i>
                  </button>
                  <button @click="shareVia('facebook')" class="share-btn facebook" title="Share on Facebook">
                    <i class="fab fa-facebook"></i>
                  </button>
                  <button @click="copyLink" class="share-btn copy" title="Copy Link">
                    <i class="fas fa-link"></i>
                  </button>
                </div>
              </div>
              
              <!-- Zoom Indicator -->
              <div v-if="isZooming" class="zoom-indicator">
                <i class="fas fa-search-plus"></i>
                <span>Hover to zoom</span>
              </div>
            </div>
            
            <!-- Navigation Arrows -->
            <button @click="previousImage" class="image-nav prev" :disabled="currentImageIndex === 0">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="nextImage" class="image-nav next" :disabled="currentImageIndex === product.images.length - 1">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <!-- Thumbnail Gallery -->
          <div class="thumbnail-gallery">
            <div class="thumbnails-container">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                @click="selectImage(index)"
                :class="['thumbnail', { active: currentImageIndex === index }]"
              >
                <img :src="image" :alt="`${product.name} view ${index + 1}`">
              </div>
            </div>
          </div>
        </div>

        <!-- Product Information -->
        <div class="product-info">
          <div class="product-header">
            <div class="brand-rating-row">
              <span class="brand-name">{{ product.brand }}</span>
              <div class="rating-section">
                <div class="stars">
                  <i v-for="n in 5" :key="n" 
                     :class="['fas fa-star', { filled: n <= Math.floor(product.rating) }]">
                  </i>
                </div>
                <span class="rating-text">{{ product.rating }} ({{ product.reviewCount }} reviews)</span>
              </div>
            </div>
            
            <h1 class="product-title">{{ product.name }}</h1>
            <p class="product-description">{{ product.description }}</p>
            
            <!-- Trust Badges -->
            <div class="trust-badges">
              <div class="trust-badge">
                <i class="fas fa-shield-alt"></i>
                <span>100% Authentic</span>
              </div>
              <div class="trust-badge">
                <i class="fas fa-truck"></i>
                <span>Free Shipping</span>
              </div>
              <div class="trust-badge">
                <i class="fas fa-undo"></i>
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>

          <!-- Pricing Section -->
          <div class="pricing-section">
            <div class="price-display">
              <span class="current-price">${{ getCurrentPrice().toFixed(2) }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ${{ product.originalPrice.toFixed(2) }}
              </span>
              <span v-if="discountPercentage" class="discount-badge">
                {{ discountPercentage }}% OFF
              </span>
            </div>
            <div class="price-details">
              <span class="price-per-unit">${{ pricePerMl.toFixed(2) }}/ml</span>
              <span class="savings" v-if="savings">You save ${{ savings.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Size/Variant Selection -->
          <div v-if="product.sizes" class="variant-section">
            <h3 class="section-title">Choose Size</h3>
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
                <div class="size-info">
                  <span class="size-volume">{{ size.volume }}</span>
                  <span class="size-price">${{ size.price.toFixed(2) }}</span>
                </div>
                <div class="size-badges">
                  <span v-if="size.bestseller" class="badge bestseller">
                    <i class="fas fa-crown"></i>
                    Bestseller
                  </span>
                  <span v-if="size.bestValue" class="badge best-value">
                    <i class="fas fa-tag"></i>
                    Best Value
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Color Selection -->
          <div v-if="product.colors" class="color-section">
            <h3 class="section-title">
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
              </div>
            </div>
          </div>

          <!-- Add to Cart Section -->
          <div class="add-to-cart-section">
            <div v-if="!isInCart" class="quantity-cart-row">
              <div class="quantity-selector">
                <label>Qty:</label>
                <div class="quantity-controls">
                  <button @click="decreaseQuantity" :disabled="quantity <= 1" class="qty-btn">
                    <i class="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    v-model.number="quantity" 
                    min="1" 
                    max="10" 
                    class="qty-input"
                  >
                  <button @click="increaseQuantity" :disabled="quantity >= 10" class="qty-btn">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <button 
                @click="addToCart" 
                :disabled="isAddingToCart || !canAddToCart"
                :class="['add-to-cart-btn', { loading: isAddingToCart }]"
              >
                <div v-if="isAddingToCart" class="loading-spinner"></div>
                <i v-else class="fas fa-shopping-bag"></i>
                <span>{{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}</span>
                <span class="btn-price">${{ (getCurrentPrice() * quantity).toFixed(2) }}</span>
              </button>
            </div>

            <!-- Cart Modification (when item is already in cart) -->
            <div v-else class="cart-modification">
              <div class="cart-status">
                <i class="fas fa-check-circle"></i>
                <span>In your cart</span>
              </div>
              <div class="cart-controls">
                <div class="quantity-adjuster">
                  <button @click="updateCartQuantity(-1)" class="qty-btn">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="cart-quantity">{{ cartItemQuantity }}</span>
                  <button @click="updateCartQuantity(1)" class="qty-btn">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <button @click="removeFromCart" class="remove-btn">
                  <i class="fas fa-trash"></i>
                  Remove
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
                <span>{{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}</span>
              </button>
              
              <button @click="buyNow" class="buy-now-btn">
                <i class="fas fa-bolt"></i>
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          <!-- Key Benefits -->
          <div v-if="product.benefits" class="benefits-section">
            <h3 class="section-title">Key Benefits</h3>
            <div class="benefits-grid">
              <div 
                v-for="benefit in product.benefits" 
                :key="benefit"
                class="benefit-item"
              >
                <i class="fas fa-check-circle"></i>
                <span>{{ benefit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="product-details-section">
        <div class="tabs-navigation">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>
            <span v-if="tab.id === 'reviews'" class="tab-count">({{ product.reviewCount }})</span>
          </button>
        </div>

        <div class="tab-content">
          <!-- How to Use Tab -->
          <div v-if="activeTab === 'howto'" class="tab-panel how-to-use">
            <div class="usage-steps">
              <div 
                v-for="(step, index) in product.howToUse" 
                :key="index"
                class="usage-step"
              >
                <div class="step-number">{{ step.step }}</div>
                <div class="step-content">
                  <h4 class="step-title">{{ step.title }}</h4>
                  <p class="step-description">{{ step.description }}</p>
                  <div v-if="step.tips" class="step-tips">
                    <h5>Pro Tips:</h5>
                    <ul>
                      <li v-for="tip in step.tips" :key="tip">{{ tip }}</li>
                    </ul>
                  </div>
                </div>
                <div class="step-icon">
                  <i :class="getStepIcon(step.step)"></i>
                </div>
              </div>
            </div>
            
            <div class="routine-suggestion">
              <h4>Recommended Routine</h4>
              <div class="routine-timeline">
                <div class="routine-time morning">
                  <h5>Morning</h5>
                  <div class="routine-products">
                    <div class="routine-product">Cleanser</div>
                    <div class="routine-product current">{{ product.name }}</div>
                    <div class="routine-product">Moisturizer</div>
                    <div class="routine-product">SPF</div>
                  </div>
                </div>
                <div class="routine-time evening">
                  <h5>Evening</h5>
                  <div class="routine-products">
                    <div class="routine-product">Cleanser</div>
                    <div class="routine-product current">{{ product.name }}</div>
                    <div class="routine-product">Night Cream</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ingredients Tab -->
          <div v-if="activeTab === 'ingredients'" class="tab-panel ingredients">
            <div class="ingredients-list">
              <h4>Full Ingredient List</h4>
              <div class="ingredients-grid">
                <div 
                  v-for="ingredient in product.ingredients" 
                  :key="ingredient.name"
                  :class="['ingredient-item', ingredient.type]"
                >
                  <div class="ingredient-name">{{ ingredient.name }}</div>
                  <div class="ingredient-purpose">{{ ingredient.purpose }}</div>
                  <div v-if="ingredient.concentration" class="ingredient-concentration">
                    {{ ingredient.concentration }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="key-ingredients">
              <h4>Key Active Ingredients</h4>
              <div class="key-ingredients-showcase">
                <div 
                  v-for="keyIngredient in product.keyIngredients" 
                  :key="keyIngredient.name"
                  class="key-ingredient-card"
                >
                  <div class="ingredient-icon">
                    <i :class="keyIngredient.icon"></i>
                  </div>
                  <div class="ingredient-info">
                    <h5>{{ keyIngredient.name }}</h5>
                    <p>{{ keyIngredient.description }}</p>
                    <div class="ingredient-benefits">
                      <span 
                        v-for="benefit in keyIngredient.benefits" 
                        :key="benefit"
                        class="benefit-tag"
                      >
                        {{ benefit }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="tab-panel reviews">
            <!-- Reviews Summary -->
            <div class="reviews-summary">
              <div class="rating-overview">
                <div class="average-rating">
                  <span class="rating-number">{{ product.rating }}</span>
                  <div class="rating-stars">
                    <i v-for="n in 5" :key="n" 
                       :class="['fas fa-star', { filled: n <= Math.floor(product.rating) }]">
                    </i>
                  </div>
                  <span class="rating-text">Based on {{ product.reviewCount }} reviews</span>
                </div>
                
                <div class="rating-breakdown">
                  <div 
                    v-for="rating in [5, 4, 3, 2, 1]" 
                    :key="rating"
                    class="rating-bar"
                  >
                    <span class="rating-label">{{ rating }}★</span>
                    <div class="bar-container">
                      <div 
                        class="bar-fill" 
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
                  Write a Review
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

            <!-- Reviews List -->
            <div class="reviews-list">
              <div 
                v-for="review in filteredReviews" 
                :key="review.id"
                class="review-item"
              >
                <div class="review-header">
                  <div class="reviewer-info">
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
                          Verified Purchase
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="review-actions-menu">
                    <button class="review-menu-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                
                <div class="review-content">
                  <h6 v-if="review.title" class="review-title">{{ review.title }}</h6>
                  <div 
                    :class="['review-text', { expanded: review.isExpanded }]"
                    @click="review.isExpanded = !review.isExpanded"
                  >
                    {{ review.text }}
                    <button 
                      v-if="review.text.length > 200 && !review.isExpanded"
                      class="read-more-btn"
                    >
                      Read more
                    </button>
                  </div>
                  
                  <!-- Review Photos -->
                  <div v-if="review.photos" class="review-photos">
                    <div 
                      v-for="(photo, index) in review.photos" 
                      :key="index"
                      @click="openPhotoModal(photo, review.photos)"
                      class="review-photo"
                    >
                      <img :src="photo.thumbnail" :alt="`Review photo ${index + 1}`">
                    </div>
                  </div>
                  
                  <!-- Review Helpfulness -->
                  <div class="review-footer">
                    <div class="helpfulness">
                      <span class="helpful-text">Was this helpful?</span>
                      <button 
                        @click="markHelpful(review.id, true)"
                        :class="['helpful-btn', { active: review.userHelpfulVote === true }]"
                      >
                        <i class="fas fa-thumbs-up"></i>
                        <span>{{ review.helpfulCount }}</span>
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
            
            <!-- Load More Reviews -->
            <div v-if="hasMoreReviews" class="load-more-section">
              <button @click="loadMoreReviews" class="load-more-btn">
                <i class="fas fa-chevron-down"></i>
                Load More Reviews
              </button>
            </div>
          </div>

          <!-- Shipping & Returns Tab -->
          <div v-if="activeTab === 'shipping'" class="tab-panel shipping">
            <div class="shipping-info">
              <div class="shipping-options">
                <h4>Shipping Options</h4>
                <div class="shipping-methods">
                  <div class="shipping-method">
                    <div class="method-icon">
                      <i class="fas fa-truck"></i>
                    </div>
                    <div class="method-details">
                      <h5>Standard Delivery</h5>
                      <p>3-5 business days</p>
                      <span class="price">Free on orders over $50</span>
                    </div>
                  </div>
                  
                  <div class="shipping-method">
                    <div class="method-icon">
                      <i class="fas fa-shipping-fast"></i>
                    </div>
                    <div class="method-details">
                      <h5>Express Delivery</h5>
                      <p>1-2 business days</p>
                      <span class="price">$9.99</span>
                    </div>
                  </div>
                  
                  <div class="shipping-method">
                    <div class="method-icon">
                      <i class="fas fa-clock"></i>
                    </div>
                    <div class="method-details">
                      <h5>Same Day Delivery</h5>
                      <p>Within 4 hours</p>
                      <span class="price">$19.99 (Select areas)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="return-policy">
                <h4>Returns & Exchanges</h4>
                <div class="policy-details">
                  <div class="policy-item">
                    <i class="fas fa-undo"></i>
                    <div>
                      <h5>30-Day Returns</h5>
                      <p>Free returns within 30 days of purchase</p>
                    </div>
                  </div>
                  
                  <div class="policy-item">
                    <i class="fas fa-exchange-alt"></i>
                    <div>
                      <h5>Easy Exchanges</h5>
                      <p>Exchange for different size or color</p>
                    </div>
                  </div>
                  
                  <div class="policy-item">
                    <i class="fas fa-shield-alt"></i>
                    <div>
                      <h5>Buyer Protection</h5>
                      <p>100% authentic products guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div class="related-products-section">
        <div class="section-header">
          <h3 class="section-title">You May Also Like</h3>
          <p class="section-subtitle">Complete your beauty routine</p>
        </div>
        
        <div class="related-products-carousel">
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
                >
                  <i class="fas fa-plus"></i>
                </button>
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
                  <span>({{ relatedProduct.reviewCount }})</span>
                </div>
                <div class="product-price">
                  <span class="current-price">${{ relatedProduct.price.toFixed(2) }}</span>
                  <span v-if="relatedProduct.originalPrice" class="original-price">
                    ${{ relatedProduct.originalPrice.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation Buttons -->
          <button @click="scrollRelated('left')" class="carousel-nav prev">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button @click="scrollRelated('right')" class="carousel-nav next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Write Review Modal -->
    <div v-if="showWriteReview" class="modal-overlay" @click="closeWriteReview">
      <div class="modal-content write-review-modal" @click.stop>
        <div class="modal-header">
          <h3>Write a Review</h3>
          <button @click="closeWriteReview" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="review-form">
            <div class="form-group">
              <label>Overall Rating</label>
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
              </div>
            </div>
            
            <div class="form-group">
              <label>Review Title</label>
              <input 
                type="text" 
                v-model="newReview.title" 
                placeholder="Summarize your experience"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>Your Review</label>
              <textarea 
                v-model="newReview.text" 
                placeholder="Share your thoughts about this product..."
                class="form-textarea"
                rows="5"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Add Photos (Optional)</label>
              <div class="photo-upload">
                <input 
                  type="file" 
                  ref="photoInput" 
                  @change="handlePhotoUpload" 
                  multiple 
                  accept="image/*"
                  class="photo-input"
                >
                <button @click="$refs.photoInput.click()" class="upload-btn">
                  <i class="fas fa-camera"></i>
                  Add Photos
                </button>
                <div v-if="newReview.photos" class="uploaded-photos">
                  <div 
                    v-for="(photo, index) in newReview.photos" 
                    :key="index"
                    class="uploaded-photo"
                  >
                    <img :src="photo.preview" :alt="`Upload ${index + 1}`">
                    <button @click="removePhoto(index)" class="remove-photo">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeWriteReview" class="btn btn-outline">Cancel</button>
          <button 
            @click="submitReview" 
            :disabled="!canSubmitReview"
            class="btn btn-primary"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div v-if="showPhotoModal" class="modal-overlay photo-modal" @click="closePhotoModal">
      <div class="photo-modal-content" @click.stop>
        <button @click="closePhotoModal" class="photo-modal-close">
          <i class="fas fa-times"></i>
        </button>
        <img :src="currentPhoto" alt="Current photo">
        <div v-if="photoGallery.length > 1" class="photo-nav">
          <button @click="previousPhoto" class="photo-nav-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="photo-counter">{{ currentPhotoIndex + 1 }} / {{ photoGallery.length }}</span>
          <button @click="nextPhoto" class="photo-nav-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Sticky Add to Cart (Mobile) -->
    <div class="sticky-cart-mobile">
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
          <div v-else class="loading-spinner-small"></div>
          {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
        </button>
      </div>
      
      <div v-else class="sticky-cart-content">
        <div class="sticky-in-cart">
          <i class="fas fa-check-circle"></i>
          <span>In Cart ({{ cartItemQuantity }})</span>
        </div>
        <div class="sticky-cart-actions">
          <button @click="updateCartQuantity(-1)" class="sticky-qty-btn">
            <i class="fas fa-minus"></i>
          </button>
          <button @click="updateCartQuantity(1)" class="sticky-qty-btn">
            <i class="fas fa-plus"></i>
          </button>
          <button @click="viewCart" class="view-cart-btn">
            View Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Order Button (if user has pending orders of this product) -->
    <div v-if="hasPendingOrder" class="cancel-order-section">
      <div class="pending-order-info">
        <i class="fas fa-clock"></i>
        <span>You have a pending order for this product</span>
        <button @click="cancelOrder" class="cancel-order-btn">
          <i class="fas fa-times"></i>
          Cancel Order
        </button>
      </div>
    </div>

    <!-- Success/Error Notifications -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      <i :class="notification.icon"></i>
      <span>{{ notification.message }}</span>
      <button @click="notification.show = false" class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
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
      // Image gallery state
      currentImageIndex: 0,
      isZooming: false,
      zoomPosition: { x: 0, y: 0 },
      
      // Product selection state
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
      
      // Notification state
      notification: {
        show: false,
        type: '',
        message: '',
        icon: ''
      },
      
      // Mock data
      tabs: [
        { id: 'howto', label: 'How to Use', icon: 'fas fa-info-circle' },
        { id: 'ingredients', label: 'Ingredients', icon: 'fas fa-leaf' },
        { id: 'reviews', label: 'Reviews', icon: 'fas fa-star' },
        { id: 'shipping', label: 'Shipping', icon: 'fas fa-truck' }
      ],
      
      relatedProducts: [
        {
          id: 2,
          name: 'Vitamin C Brightening Serum',
          brand: 'Glow Labs',
          price: 65.00,
          originalPrice: 80.00,
          rating: 4.6,
          reviewCount: 892,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300'
        },
        {
          id: 3,
          name: 'Hyaluronic Acid Moisturizer',
          brand: 'Hydro Beauty',
          price: 45.00,
          rating: 4.8,
          reviewCount: 1156,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300'
        },
        {
          id: 4,
          name: 'Gentle Cleanser',
          brand: 'Pure Clean',
          price: 28.00,
          rating: 4.5,
          reviewCount: 743,
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300'
        },
        {
          id: 5,
          name: 'SPF 50 Sunscreen',
          brand: 'Sun Shield',
          price: 32.00,
          rating: 4.7,
          reviewCount: 634,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300'
        }
      ],
      
      reviews: [
        {
          id: 1,
          userName: 'Emma Wilson',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          rating: 5,
          title: 'Amazing results!',
          text: 'This product has completely transformed my skin. I\'ve been using it for 3 months and the difference is incredible. My skin is smoother, brighter, and I get so many compliments.',
          date: new Date('2024-01-15'),
          verified: true,
          helpfulCount: 24,
          userHelpfulVote: null,
          photos: [
            { thumbnail: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200', full: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800' }
          ],
          isExpanded: false
        },
        {
          id: 2,
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          rating: 4,
          title: 'Great product, quick results',
          text: 'I love how lightweight this serum is. It absorbs quickly and doesn\'t leave any residue. I\'ve noticed improvement in my skin texture after just 2 weeks of use. The packaging is also very elegant.',
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
          text: 'This is my third bottle and I\'m never switching! The formula is perfect for my sensitive skin and I love that it\'s fragrance-free. It plays well with other products in my routine and has helped fade my dark spots significantly.',
          date: new Date('2024-01-08'),
          verified: true,
          helpfulCount: 31,
          userHelpfulVote: null,
          photos: [
            { thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200', full: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800' },
            { thumbnail: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200', full: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800' }
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
            description: 'Start with clean, dry skin',
            tips: ['Use morning and evening', 'Pat skin dry before application']
          },
          {
            step: 2,
            title: 'Apply',
            description: 'Apply 2-3 drops to face and neck',
            tips: ['Use gentle upward motions', 'Avoid the eye area']
          },
          {
            step: 3,
            title: 'Follow',
            description: 'Follow with moisturizer and SPF',
            tips: ['Always use SPF during the day', 'Allow to absorb before next step']
          }
        ],
        ingredients: [
          { name: 'Water', purpose: 'Solvent', type: 'base' },
          { name: 'Niacinamide', purpose: 'Active ingredient', type: 'active', concentration: '10%' },
          { name: 'Zinc PCA', purpose: 'Sebum regulation', type: 'active', concentration: '1%' },
          { name: 'Hyaluronic Acid', purpose: 'Hydration', type: 'active' },
          { name: 'Phenoxyethanol', purpose: 'Preservative', type: 'preservative' }
        ],
        keyIngredients: [
          {
            name: 'Niacinamide (10%)',
            description: 'A form of Vitamin B3 that helps regulate sebum production and minimize pores',
            benefits: ['Pore minimizing', 'Oil control', 'Brightening'],
            icon: 'fas fa-leaf'
          },
          {
            name: 'Zinc PCA (1%)',
            description: 'Helps control excess oil and reduce shine',
            benefits: ['Sebum control', 'Anti-inflammatory'],
            icon: 'fas fa-shield-alt'
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
      if (this.product?.originalPrice && this.product?.price) {
        const discount = ((this.product.originalPrice - this.getCurrentPrice()) / this.product.originalPrice) * 100;
        return Math.round(discount);
      }
      return null;
    },
    
    savings() {
      if (this.product?.originalPrice && this.product?.price) {
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
        transform: `scale(2)`,
        transformOrigin: `${this.zoomPosition.x}% ${this.zoomPosition.y}%`,
        cursor: 'zoom-in'
      };
    },
    
    filteredReviews() {
      let filtered = [...this.reviews];
      
      // Apply filters
      if (this.reviewFilter !== 'all') {
        if (this.reviewFilter === 'photos') {
          filtered = filtered.filter(review => review.photos && review.photos.length > 0);
        } else if (this.reviewFilter === 'verified') {
          filtered = filtered.filter(review => review.verified);
        } else {
          filtered = filtered.filter(review => review.rating === parseInt(this.reviewFilter));
        }
      }
      
      // Apply sorting
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
          filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
          break;
        default: // newest
          filtered.sort((a, b) => b.date - a.date);
      }
      
      return filtered;
    },
    
    canSubmitReview() {
      return this.newReview.rating > 0 && this.newReview.text.trim().length > 10;
    },
    
    hasMoreReviews() {
      return this.reviews.length > 10;
    },
    
    hasPendingOrder() {
      // Mock logic - check if user has pending orders for this product
      return false; // Would be replaced with actual order checking logic
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
  
  methods: {
    ...mapActions('cart', ['addToCart', 'updateCart', 'removeFromCart']),
    ...mapActions('user', ['toggleWishlist', 'addToRecentlyViewed']),
    
    initializeProduct() {
      // Initialize default selections
      if (this.product?.sizes) {
        this.selectedSize = this.product.sizes.find(size => size.bestseller) || this.product.sizes[0];
      }
      
      if (this.product?.colors) {
        this.selectedColor = this.product.colors[0];
      }
      
      // Check if product is in cart
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
      if (!this.isZooming) {
        this.isZooming = true;
      }
      
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      
      this.zoomPosition = { x, y };
    },
    
    resetZoom() {
      this.isZooming = false;
      this.zoomPosition = { x: 0, y: 0 };
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
        
        this.showNotification('success', 'Added to cart!', 'fas fa-check-circle');
        this.checkCartStatus();
        
        // Add cart animation effect
        this.animateAddToCart();
        
      } catch (error) {
        this.showNotification('error', 'Failed to add to cart', 'fas fa-exclamation-circle');
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    async updateCartQuantity(change) {
      try {
        const newQuantity = this.cartItemQuantity + change;
        if (newQuantity <= 0) {
          await this.removeFromCart(this.product.id);
        } else {
          await this.updateCart({
            productId: this.product.id,
            quantity: newQuantity
          });
        }
        this.checkCartStatus();
      } catch (error) {
        this.showNotification('error', 'Failed to update cart', 'fas fa-exclamation-circle');
      }
    },
    
    async removeFromCart() {
      try {
        await this.removeFromCart(this.product.id);
        this.showNotification('success', 'Removed from cart', 'fas fa-check-circle');
        this.checkCartStatus();
      } catch (error) {
        this.showNotification('error', 'Failed to remove from cart', 'fas fa-exclamation-circle');
      }
    },
    
    animateAddToCart() {
      // Create flying animation from product to cart
      const productImg = this.$refs.mainImage;
      const cartBtn = document.querySelector('.cart-btn');
      
      if (productImg && cartBtn) {
        const flyingImg = productImg.cloneNode();
        flyingImg.style.position = 'fixed';
        flyingImg.style.zIndex = '9999';
        flyingImg.style.width = '50px';
        flyingImg.style.height = '50px';
        flyingImg.style.borderRadius = '50%';
        flyingImg.style.transition = 'all 0.6s ease-in-out';
        
        const productRect = productImg.getBoundingClientRect();
        const cartRect = cartBtn.getBoundingClientRect();
        
        flyingImg.style.left = productRect.left + 'px';
        flyingImg.style.top = productRect.top + 'px';
        
        document.body.appendChild(flyingImg);
        
        setTimeout(() => {
          flyingImg.style.left = cartRect.left + 'px';
          flyingImg.style.top = cartRect.top + 'px';
          flyingImg.style.transform = 'scale(0)';
          flyingImg.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
          document.body.removeChild(flyingImg);
        }, 700);
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
        this.showNotification('success', result.message, 'fas fa-heart');
      } catch (error) {
        this.showNotification('error', 'Failed to update wishlist', 'fas fa-exclamation-circle');
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
          this.showNotification('info', 'Link copied! Paste it in your Instagram story', 'fas fa-copy');
          break;
      }
    },
    
    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.showNotification('success', 'Link copied to clipboard!', 'fas fa-copy');
      } catch (error) {
        this.showNotification('error', 'Failed to copy link', 'fas fa-exclamation-circle');
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
          // Remove vote
          review.userHelpfulVote = null;
          if (helpful) review.helpfulCount--;
        } else {
          // Add/change vote
          if (review.userHelpfulVote === true) review.helpfulCount--;
          review.userHelpfulVote = helpful;
          if (helpful) review.helpfulCount++;
        }
      }
    },
    
    loadMoreReviews() {
      // Implementation for loading more reviews
      this.showNotification('info', 'Loading more reviews...', 'fas fa-spinner');
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
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.newReview.photos.push({
              file,
              preview: e.target.result
            });
          };
          reader.readAsDataURL(file);
        }
      });
    },
    
    removePhoto(index) {
      this.newReview.photos.splice(index, 1);
    },
    
    async submitReview() {
      if (!this.canSubmitReview) return;
      
      try {
        // Mock submission
        const newReview = {
          id: Date.now(),
          userName: 'You',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
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
        this.showNotification('success', 'Review submitted successfully!', 'fas fa-check-circle');
        this.closeWriteReview();
        
      } catch (error) {
        this.showNotification('error', 'Failed to submit review', 'fas fa-exclamation-circle');
      }
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
      this.currentPhotoIndex = 0;
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
    
    // Related products methods
    scrollRelated(direction) {
      const cardWidth = 280;
      const gap = 20;
      const scrollAmount = cardWidth + gap;
      
      if (direction === 'left') {
        this.relatedOffset = Math.max(0, this.relatedOffset - scrollAmount);
      } else {
        const maxOffset = (this.relatedProducts.length - 4) * scrollAmount;
        this.relatedOffset = Math.min(maxOffset, this.relatedOffset + scrollAmount);
      }
    },
    
    async quickAddToCart(product) {
      try {
        await this.addToCart({
          ...product,
          quantity: 1
        });
        this.showNotification('success', `${product.name} added to cart!`, 'fas fa-check-circle');
      } catch (error) {
        this.showNotification('error', 'Failed to add to cart', 'fas fa-exclamation-circle');
      }
    },
    
    // Order management
    cancelOrder() {
      // Implementation for canceling pending orders
      this.showNotification('success', 'Order cancelled successfully', 'fas fa-check-circle');
    },
    
    viewCart() {
      this.$router.push('/cart');
    },
    
    // Utility methods
    formatCategory(category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    getStepIcon(step) {
      const icons = {
        1: 'fas fa-soap',
        2: 'fas fa-hand-sparkles',
        3: 'fas fa-sun'
      };
      return icons[step] || 'fas fa-circle';
    },
    
    showNotification(type, message, icon) {
      this.notification = {
        show: true,
        type,
        message,
        icon
      };
      
      setTimeout(() => {
        this.notification.show = false;
      }, 4000);
    }
  },
  
  mounted() {
    this.initializeProduct();
  }
};
</script>

<style scoped>
/* Base Styles */
.product-detail-page {
  background: linear-gradient(135deg, #fefce8 0%, #fef3f2 25%, #f0f9ff 50%, #fdf2f8 75%, #faf5ff 100%);
  min-height: 100vh;
  padding-bottom: 80px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Breadcrumb */
.breadcrumb-nav {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(236, 72, 153, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6b7280;
}

.breadcrumb-item {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.breadcrumb-item:hover {
  color: #ec4899;
}

.breadcrumb-current {
  color: #374151;
  font-weight: 500;
}

.breadcrumb i.fas.fa-chevron-right {
  font-size: 10px;
  color: #d1d5db;
}

/* Main Product Section */
.product-main-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin: 40px 0;
  align-items: start;
}

/* Product Gallery */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-container {
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1;
}

.main-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: zoom-in;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

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
}

.share-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.share-btn.whatsapp {
  background: rgba(37, 211, 102, 0.9);
  color: white;
}

.share-btn.instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
}

.share-btn.facebook {
  background: rgba(24, 119, 242, 0.9);
  color: white;
}

.share-btn.copy {
  background: rgba(107, 114, 128, 0.9);
  color: white;
}

.share-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.zoom-indicator {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
}

.image-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.image-nav.prev {
  left: 20px;
}

.image-nav.next {
  right: 20px;
}

.image-nav:hover:not(:disabled) {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.image-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.thumbnail-gallery {
  overflow-x: auto;
  padding-bottom: 5px;
}

.thumbnails-container {
  display: flex;
  gap: 12px;
  min-width: max-content;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail.active {
  border-color: #ec4899;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.thumbnail:hover {
  transform: scale(1.05);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.brand-rating-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.brand-name {
  font-size: 14px;
  font-weight: 700;
  color: #ec4899;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: #d1d5db;
  font-size: 16px;
  transition: color 0.2s ease;
}

.stars i.filled {
  color: #fbbf24;
}

.rating-text {
  font-size: 14px;
  color: #6b7280;
}

.product-title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin: 0;
}

.product-description {
  font-size: 18px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.trust-badges {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #059669;
  font-weight: 500;
}

.trust-badge i {
  color: #059669;
}

/* Pricing */
.pricing-section {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(236, 72, 153, 0.1);
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
  color: #ec4899;
}

.original-price {
  font-size: 22px;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.price-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.price-per-unit {
  color: #6b7280;
}

.savings {
  color: #059669;
  font-weight: 600;
}

/* Variant Selection */
.variant-section, .color-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-color-name {
  color: #ec4899;
  font-weight: 500;
}

.size-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-option {
  position: relative;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.size-option:hover {
  border-color: #ec4899;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.size-option.selected {
  border-color: #ec4899;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
}

.size-option.bestseller {
  border-color: #f59e0b;
}

.size-option.best-value {
  border-color: #059669;
}

.size-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.size-volume {
  font-weight: 700;
  color: #1f2937;
  font-size: 16px;
}

.size-price {
  font-size: 14px;
  color: #6b7280;
}

.size-badges {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge.bestseller {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.badge.best-value {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
}

.color-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.color-option.selected {
  border-color: #1f2937;
  transform: scale(1.1);
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2);
}

.color-check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* Add to Cart Section */
.add-to-cart-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.quantity-cart-row {
  display: flex;
  gap: 16px;
  align-items: end;
  margin-bottom: 16px;
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quantity-selector label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.qty-btn {
  background: #f9fafb;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: #ec4899;
  color: white;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-weight: 600;
  color: #374151;
  background: white;
}

.add-to-cart-btn {
  flex: 1;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
  font-size: 16px;
  position: relative;
  overflow: hidden;
}

.add-to-cart-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.add-to-cart-btn:hover:not(:disabled)::before {
  left: 100%;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #db2777, #be185d);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.3);
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.add-to-cart-btn.loading {
  pointer-events: none;
}

.btn-price {
  margin-left: auto;
  font-weight: 700;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Cart Modification */
.cart-modification {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #10b981;
}

.cart-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #059669;
  font-weight: 600;
}

.cart-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.quantity-adjuster {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 8px 16px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

.cart-quantity {
  font-weight: 700;
  color: #374151;
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
}

/* Secondary Actions */
.secondary-actions {
  display: flex;
  gap: 12px;
}

.wishlist-btn, .buy-now-btn {
  flex: 1;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #374151;
}

.wishlist-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.wishlist-btn.active {
  border-color: #ef4444;
  color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.buy-now-btn:hover {
  border-color: #059669;
  color: #059669;
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%);
}

/* Benefits Section */
.benefits-section {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.benefits-grid {
  display: grid;
  gap: 12px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.benefit-item i {
  color: #059669;
  font-size: 16px;
}

/* Product Details Tabs */
.product-details-section {
  margin: 80px 0;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs-navigation {
  display: flex;
  border-bottom: 2px solid #f3f4f6;
  overflow-x: auto;
  background: linear-gradient(135deg, #fafafa 0%, #f9fafb 100%);
}

.tab-btn {
  background: none;
  border: none;
  padding: 20px 32px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  position: relative;
}

.tab-btn:hover {
  color: #ec4899;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.tab-btn.active {
  color: #ec4899;
  border-bottom-color: #ec4899;
  background: white;
}

.tab-count {
  background: #ec4899;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  padding: 40px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* How to Use Tab */
.usage-steps {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 40px;
}

.usage-step {
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  gap: 24px;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
  border-radius: 16px;
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.step-content h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.step-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.step-tips h5 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.step-tips ul {
  margin: 0;
  padding-left: 16px;
}

.step-tips li {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.step-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ec4899;
  font-size: 20px;
}

.routine-suggestion {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
  padding: 32px;
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.routine-suggestion h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.routine-timeline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.routine-time h5 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  text-align: center;
}

.routine-products {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.routine-product {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  color: #6b7280;
  border: 2px solid #f3f4f6;
  transition: all 0.3s ease;
}

.routine-product.current {
  border-color: #ec4899;
  color: #ec4899;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  font-weight: 600;
}

/* Ingredients Tab */
.ingredients-list {
  margin-bottom: 40px;
}

.ingredients-list h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.ingredients-grid {
  display: grid;
  gap: 12px;
}

.ingredient-item {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.ingredient-item:hover {
  border-color: #ec4899;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
}

.ingredient-item.active {
  border-color: #059669;
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
}

.ingredient-name {
  font-weight: 600;
  color: #1f2937;
}

.ingredient-purpose {
  color: #6b7280;
  font-size: 14px;
}

.ingredient-concentration {
  background: #ec4899;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.key-ingredients h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.key-ingredients-showcase {
  display: grid;
  gap: 24px;
}

.key-ingredient-card {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
  border-radius: 16px;
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.ingredient-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.ingredient-info h5 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.ingredient-info p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.ingredient-benefits {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.benefit-tag {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  color: #059669;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(5, 150, 105, 0.2);
}

/* Reviews Tab */
.reviews-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  padding: 32px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
  border-radius: 16px;
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.rating-overview {
  text-align: center;
}

.average-rating {
  margin-bottom: 24px;
}

.rating-number {
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  display: block;
  margin-bottom: 8px;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 8px;
}

.rating-text {
  color: #6b7280;
  font-size: 14px;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-bar {
  display: grid;
  grid-template-columns: 30px 1fr 40px;
  gap: 12px;
  align-items: center;
  font-size: 14px;
}

.rating-label {
  color: #6b7280;
  font-weight: 500;
}

.bar-container {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.rating-count {
  color: #6b7280;
  font-size: 12px;
  text-align: right;
}

.review-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
}

.write-review-btn {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.write-review-btn:hover {
  background: linear-gradient(135deg, #db2777, #be185d);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
}

.review-filters {
  display: flex;
  gap: 12px;
}

.filter-select, .sort-select {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus, .sort-select:focus {
  outline: none;
  border-color: #ec4899;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.review-item:hover {
  border-color: #ec4899;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.reviewer-info {
  display: flex;
  gap: 16px;
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
  color: #1f2937;
  margin: 0 0 8px 0;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-date {
  color: #6b7280;
  font-size: 14px;
}

.verified-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #059669;
  font-size: 12px;
  font-weight: 600;
}

.review-actions-menu {
  position: relative;
}

.review-menu-btn {
  background: none;
  border: none;
  color: #9ca3af;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.review-menu-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.review-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-size: 16px;
}

.review-text {
  color: #374151;
  line-height: 1.6;
  margin: 0 0 16px 0;
  cursor: pointer;
  position: relative;
}

.review-text:not(.expanded) {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  background: none;
  border: none;
  color: #ec4899;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.review-photos {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.review-photo {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e5e7eb;
}

.review-photo:hover {
  transform: scale(1.05);
  border-color: #ec4899;
}

.review-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
}

.helpfulness {
  display: flex;
  align-items: center;
  gap: 12px;
}

.helpful-text {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.helpful-btn {
  background: none;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
}

.helpful-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
}

.helpful-btn.active {
  border-color: #059669;
  color: #059669;
  background: rgba(5, 150, 105, 0.05);
}

.load-more-section {
  text-align: center;
  margin-top: 32px;
}

.load-more-btn {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.load-more-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
}

/* Shipping Tab */
.shipping-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.shipping-options h4, .return-policy h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.shipping-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shipping-method {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
  border-radius: 12px;
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.method-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.method-details h5 {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.method-details p {
  color: #6b7280;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.method-details .price {
  color: #059669;
  font-weight: 600;
  font-size: 14px;
}

.policy-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.policy-item i {
  color: #059669;
  font-size: 20px;
  margin-top: 4px;
}

.policy-item h5 {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.policy-item p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

/* Related Products */
.related-products-section {
  margin: 80px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header .section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.related-products-carousel {
  position: relative;
  overflow: hidden;
  margin: 0 60px;
}

.products-track {
  display: flex;
  gap: 20px;
  transition: transform 0.5s ease;
}

.related-product-card {
  min-width: 280px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  position: relative;
}

.related-product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #ec4899;
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
  transform: scale(1.1);
}

.quick-add-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  opacity: 0;
}

.related-product-card:hover .quick-add-btn {
  opacity: 1;
}

.quick-add-btn:hover {
  background: #ec4899;
  color: white;
  transform: scale(1.1);
}

.related-product-card .product-details {
  padding: 20px;
}

.related-product-card .product-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-size: 16px;
  line-height: 1.3;
}

.related-product-card .product-brand {
  color: #ec4899;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.related-product-card .product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
}

.related-product-card .product-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.related-product-card .current-price {
  font-weight: 700;
  color: #1f2937;
  font-size: 18px;
}

.related-product-card .original-price {
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 14px;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 2px solid #e5e7eb;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.carousel-nav.prev {
  left: 0;
}

.carousel-nav.next {
  right: 0;
}

.carousel-nav:hover {
  border-color: #ec4899;
  color: #ec4899;
  transform: translateY(-50%) scale(1.1);
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
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.write-review-modal {
  max-width: 500px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Review Form */
.review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.rating-input {
  display: flex;
  gap: 4px;
}

.rating-star {
  font-size: 24px;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-star.filled, .rating-star.hover {
  color: #fbbf24;
}

.rating-star:hover {
  transform: scale(1.1);
}

.form-input, .form-textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #ec4899;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.photo-input {
  display: none;
}

.upload-btn {
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6b7280;
  font-weight: 500;
}

.upload-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
}

.uploaded-photos {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.uploaded-photo {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
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
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
}

/* Photo Modal */
.photo-modal {
  background: rgba(0, 0, 0, 0.9);
}

.photo-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.photo-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #374151;
  backdrop-filter: blur(10px);
}

.photo-nav {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 20px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.photo-nav-btn {
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.photo-nav-btn:hover {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.photo-counter {
  color: #374151;
  font-weight: 500;
  font-size: 14px;
}

/* Button Styles */
.btn {
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
}

.btn-outline {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-outline:hover {
  border-color: #ec4899;
  color: #ec4899;
}

.btn-primary {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #db2777, #be185d);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Sticky Mobile Cart */
.sticky-cart-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 16px 20px;
  z-index: 999;
  display: none;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.sticky-cart-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.sticky-product-info {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.sticky-product-image {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
}

.sticky-product-details h5 {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.3;
}

.sticky-price {
  color: #ec4899;
  font-weight: 700;
  font-size: 16px;
}

.sticky-add-btn {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.sticky-add-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

.sticky-in-cart {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #059669;
  font-weight: 600;
  flex: 1;
}

.sticky-cart-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sticky-qty-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.sticky-qty-btn:hover {
  background: #ec4899;
  color: white;
}

.view-cart-btn {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

/* Cancel Order Section */
.cancel-order-section {
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 2px solid #ef4444;
  border-radius: 12px;
  padding: 16px;
  z-index: 999;
  backdrop-filter: blur(10px);
}

.pending-order-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #dc2626;
  font-weight: 500;
  font-size: 14px;
}

.cancel-order-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.cancel-order-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: scale(1.05);
}

/* Notifications */
.notification {
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1001;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease;
  max-width: 400px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
  color: white;
  border: 1px solid #10b981;
}

.notification.error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
  color: white;
  border: 1px solid #ef4444;
}

.notification.info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
  color: white;
  border: 1px solid #3b82f6;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
  margin-left: auto;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-main-section {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .reviews-summary {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .shipping-info {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .routine-timeline {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .related-products-carousel {
    margin: 0 40px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .breadcrumb {
    font-size: 12px;
    gap: 8px;
  }
  
  .product-title {
    font-size: 28px;
  }
  
  .current-price {
    font-size: 28px;
  }
  
  .size-selector {
    grid-template-columns: 1fr 1fr;
  }
  
  .color-selector {
    justify-content: center;
  }
  
  .quantity-cart-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .secondary-actions {
    flex-direction: column;
  }
  
  .tabs-navigation {
    overflow-x: scroll;
  }
  
  .tab-btn {
    padding: 16px 20px;
  }
  
  .tab-panel {
    padding: 24px 16px;
  }
  
  .usage-step {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 16px;
  }
  
  .key-ingredient-card {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 16px;
  }
  
  .related-products-carousel {
    margin: 0 20px;
  }
  
  .sticky-cart-mobile {
    display: block;
  }
  
  .product-detail-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .breadcrumb-nav {
    padding: 12px 0;
  }
  
  .product-main-section {
    margin: 20px 0;
  }
  
  .share-icons {
    flex-direction: row;
    gap: 6px;
  }
  
  .share-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 24px;
  }
  
  .pricing-section, .add-to-cart-section, .benefits-section {
    padding: 16px;
    border-radius: 12px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .size-option {
    padding: 16px;
    min-width: 100px;
  }
  
  .color-option {
    width: 40px;
    height: 40px;
  }
  
  .related-products-carousel {
    margin: 0 10px;
  }
  
  .modal-content {
    width: 95%;
    border-radius: 16px;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 16px;
  }
  
  .notification {
    right: 12px;
    left: 12px;
    max-width: none;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .mega-category-card,
  .product-detail-page,
  .modal-content {
    border: 2px solid;
  }
}

/* Focus styles for keyboard navigation */
button:focus,
input:focus,
select:focus,
textarea:focus,
[tabindex]:focus {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .share-overlay,
  .sticky-cart-mobile,
  .notification,
  .cancel-order-section {
    display: none;
  }
}
</style>
