<template>
  <div class="products-page">
    <div class="container">
      <div class="products-header">
        <h1>{{ pageTitle }}</h1>
        <p>{{ products.length }} products found</p>
      </div>
      
      <div class="products-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from '../components/product/ProductCard.vue';

export default {
  name: 'Products',
  components: {
    ProductCard
  },
  props: {
    category: String
  },
  computed: {
    ...mapGetters('products', ['filteredProducts', 'categories']),
    products() {
      if (this.category) {
        return this.$store.getters['products/productsByCategory'](this.category);
      }
      return this.filteredProducts;
    },
    pageTitle() {
      if (this.category) {
        const categoryObj = this.categories.find(cat => cat.id === this.category);
        return categoryObj ? categoryObj.name : 'Products';
      }
      return 'All Products';
    }
  }
};
</script>

<style scoped>
.products-page {
  padding: 40px 0;
}

.products-header {
  text-align: center;
  margin-bottom: 40px;
}

.products-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.products-header p {
  color: var(--gray-600);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
</style>
