<template>
  <div class="related-products-carousel">
    <div class="carousel-header">
      <h2>You May Also Like</h2>
      <div class="carousel-controls">
        <button @click="scrollLeft" class="carousel-btn prev" :disabled="scrollPosition <= 0">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button @click="scrollRight" class="carousel-btn next" :disabled="scrollPosition >= maxScroll">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div class="carousel-container" ref="carouselContainer">
      <div class="products-scroll" ref="productsScroll">
        <ProductCard 
          v-for="product in relatedProducts" 
          :key="product.id"
          :product="product"
          class="carousel-product"
        />
      </div>
    </div>

    <div class="pairs-well-section">
      <h3>Pairs Well With</h3>
      <div class="pairs-grid">
        <div 
          v-for="combo in pairingCombos" 
          :key="combo.id"
          class="combo-card"
        >
          <div class="combo-products">
            <div class="main-product">
              <img :src="product.image" :alt="product.name">
              <span>This Product</span>
            </div>
            <div class="plus-icon">+</div>
            <div class="paired-product">
              <img :src="combo.product.image" :alt="combo.product.name">
              <span>{{ combo.product.name }}</span>
            </div>
          </div>
          <div class="combo-benefits">
            <h4>{{ combo.title }}</h4>
            <p>{{ combo.description }}</p>
            <div class="combo-pricing">
              <span class="individual-price">
                Individual: ${{ (product.price + combo.product.price).toFixed(2) }}
              </span>
              <span class="bundle-price">
                Bundle: ${{ combo.bundlePrice.toFixed(2) }}
              </span>
              <span class="savings">
                Save ${{ ((product.price + combo.product.price) - combo.bundlePrice).toFixed(2) }}
              </span>
            </div>
            <button @click="addBundle(combo)" class="add-bundle-btn">
              Add Bundle to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue';

export default {
  name: 'RelatedProductsCarousel',
  components: {
    ProductCard
  },
  props: {
    productId: String,
    category: String
  },
  data() {
    return {
      scrollPosition: 0,
      maxScroll: 0,
      pairingCombos: [
        {
          id: 1,
          title: 'Perfect Hydration Duo',
          description: 'Boost hydration with this powerful combination',
          bundlePrice: 89.99,
          product: {
            id: 'moisturizer-1',
            name: 'Hydrating Moisturizer',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200',
            price: 45.99
          }
        },
        {
          id: 2,
          title: 'Anti-Aging System',
          description: 'Complete routine for youthful-looking skin',
          bundlePrice: 124.99,
          product: {
            id: 'retinol-cream',
            name: 'Retinol Night Cream',
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200',
            price: 79.99
          }
        }
      ]
    };
  },
  computed: {
    relatedProducts() {
      // Mock related products - would come from store in real app
      return [
        { id: 1, name: 'Vitamin C Serum', brand: 'GlowBrand', price: 65.00, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', rating: 4.6 },
        { id: 2, name: 'Hydrating Toner', brand: 'HydraLux', price: 34.99, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300', rating: 4.8 },
        { id: 3, name: 'Night Cream', brand: 'NightGlow', price: 78.00, image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300', rating: 4.7 },
        { id: 4, name: 'Face Cleanser', brand: 'PureClean', price: 29.99, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300', rating: 4.5 },
        { id: 5, name: 'Eye Cream', brand: 'EyeCare', price: 89.99, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', rating: 4.9 }
      ];
    },
    product() {
      // Mock current product - would come from props in real app
      return {
        id: this.productId,
        name: 'Current Product',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200'
      };
    }
  },
  methods: {
    scrollLeft() {
      const container = this.$refs.productsScroll;
      const scrollAmount = 300;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      this.updateScrollPosition();
    },
    scrollRight() {
      const container = this.$refs.productsScroll;
      const scrollAmount = 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      this.updateScrollPosition();
    },
    updateScrollPosition() {
      setTimeout(() => {
        const container = this.$refs.productsScroll;
        this.scrollPosition = container.scrollLeft;
        this.maxScroll = container.scrollWidth - container.clientWidth;
      }, 300);
    },
    addBundle(combo) {
      this.$emit('add-bundle', {
        products: [this.product, combo.product],
        bundlePrice: combo.bundlePrice,
        savings: (this.product.price + combo.product.price) - combo.bundlePrice
      });
    }
  },
  mounted() {
    this.updateScrollPosition();
    window.addEventListener('resize', this.updateScrollPosition);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateScrollPosition);
  }
};
</script>

<style scoped>
.related-products-carousel {
  padding: 40px 0;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.carousel-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
}

.carousel-controls {
  display: flex;
  gap: 8px;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--gray-300);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-600);
}

.carousel-btn:hover:not(:disabled) {
  border-color: var(--primary-500);
  color: var(--primary-500);
}

.carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-container {
  overflow: hidden;
  border-radius: 12px;
}

.products-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.products-scroll::-webkit-scrollbar {
  display: none;
}

.carousel-product {
  flex-shrink: 0;
  width: 280px;
}

.pairs-well-section {
  margin-top: 60px;
}

.pairs-well-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 24px;
}

.pairs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.combo-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid var(--gray-200);
  transition: all 0.3s ease;
}

.combo-card:hover {
  border-color: var(--primary-300);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.combo-products {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.main-product,
.paired-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.main-product img,
.paired-product img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.main-product span,
.paired-product span {
  font-size: 12px;
  color: var(--gray-600);
  text-align: center;
  line-height: 1.2;
}

.plus-icon {
  width: 30px;
  height: 30px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.combo-benefits h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.combo-benefits p {
  color: var(--gray-600);
  margin-bottom: 16px;
  font-size: 14px;
}

.combo-pricing {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.individual-price {
  color: var(--gray-500);
  text-decoration: line-through;
}

.bundle-price {
  font-weight: 700;
  color: var(--gray-800);
  font-size: 16px;
}

.savings {
  color: var(--success-600);
  font-weight: 600;
}

.add-bundle-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-bundle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(var(--primary-500), 0.3);
}

@media (max-width: 768px) {
  .carousel-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .pairs-grid {
    grid-template-columns: 1fr;
  }
  
  .combo-products {
    gap: 12px;
  }
  
  .main-product img,
  .paired-product img {
    width: 60px;
    height: 60px;
  }
}
</style>
