const state = {
  products: [
    {
      id: 1,
      name: "Luxury Moisturizing Face Cream",
      brand: "GlowLux",
      price: 89.99,
      originalPrice: 129.99,
      category: "skincare",
      subcategory: "moisturizers",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
      rating: 4.8,
      reviewCount: 1247,
      description: "Premium anti-aging moisturizer with hyaluronic acid and retinol",
      ingredients: ["Hyaluronic Acid", "Retinol", "Vitamin C", "Peptides"],
      benefits: ["Anti-aging", "Hydrating", "Firming", "Brightening"],
      featured: true,
      onSale: true
    },
    {
      id: 2,
      name: "Vitamin C Brightening Serum",
      brand: "VitaGlow",
      price: 65.00,
      category: "skincare",
      subcategory: "serums",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      rating: 4.6,
      reviewCount: 892,
      description: "Potent vitamin C serum for radiant, even-toned skin",
      ingredients: ["Vitamin C", "Niacinamide", "Hyaluronic Acid"],
      benefits: ["Brightening", "Even tone", "Antioxidant protection"],
      featured: true
    },
    {
      id: 3,
      name: "Matte Lipstick Collection",
      brand: "LipLux",
      price: 24.99,
      category: "makeup",
      subcategory: "lips",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
      rating: 4.7,
      reviewCount: 2156,
      description: "Long-lasting matte lipstick in 12 stunning shades",
      colors: ["Ruby Red", "Berry Bliss", "Nude Rose", "Coral Dream"],
      benefits: ["Long-lasting", "Transfer-proof", "Comfortable wear"],
      featured: true
    },
    {
      id: 4,
      name: "Gentle Cleansing Oil",
      brand: "PureClean",
      price: 34.99,
      category: "skincare",
      subcategory: "cleansers",
      image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400",
      rating: 4.9,
      reviewCount: 1834,
      description: "Deep cleansing oil that removes makeup and impurities gently",
      ingredients: ["Jojoba Oil", "Argan Oil", "Vitamin E"],
      benefits: ["Deep cleansing", "Makeup removal", "Nourishing"]
    },
    {
      id: 5,
      name: "Professional Hair Styling Set",
      brand: "StylePro",
      price: 149.99,
      originalPrice: 199.99,
      category: "haircare",
      subcategory: "styling",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
      rating: 4.5,
      reviewCount: 687,
      description: "Complete styling kit with heat protectant and finishing spray",
      benefits: ["Heat protection", "Long-lasting hold", "Shine enhancement"],
      onSale: true
    },
    {
      id: 6,
      name: "Illuminating Highlighter Palette",
      brand: "GlowUp",
      price: 42.00,
      category: "makeup",
      subcategory: "face",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      rating: 4.4,
      reviewCount: 543,
      description: "Multi-dimensional highlighter palette for natural glow",
      shades: ["Champagne", "Rose Gold", "Bronze", "Pearl"],
      benefits: ["Natural glow", "Buildable coverage", "All skin tones"]
    }
  ],
  categories: [
    { id: 'skincare', name: 'Skincare', icon: 'fas fa-leaf' },
    { id: 'makeup', name: 'Makeup', icon: 'fas fa-palette' },
    { id: 'haircare', name: 'Hair Care', icon: 'fas fa-cut' },
    { id: 'fragrance', name: 'Fragrance', icon: 'fas fa-spray-can' },
    { id: 'tools', name: 'Beauty Tools', icon: 'fas fa-brush' }
  ],
  currentProduct: null,
  filters: {
    category: '',
    priceRange: [0, 200],
    brand: '',
    rating: 0,
    onSale: false,
    skinType: '',
    hairType: ''
  },
  sortBy: 'featured',
  searchQuery: ''
};

const getters = {
  products: state => state.products,
  allProducts: state => state.products,
  featuredProducts: state => state.products.filter(product => product.featured),
  onSaleProducts: state => state.products.filter(product => product.onSale),
  productsByCategory: state => category => 
    state.products.filter(product => product.category === category),
  filteredProducts: state => {
    let filtered = [...state.products];
    
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category);
    }
    
    if (state.filters.brand) {
      filtered = filtered.filter(product => product.brand === state.filters.brand);
    }
    
    if (state.filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= state.filters.rating);
    }
    
    if (state.filters.onSale) {
      filtered = filtered.filter(product => product.onSale);
    }
    
    filtered = filtered.filter(product => 
      product.price >= state.filters.priceRange[0] && 
      product.price <= state.filters.priceRange[1]
    );
    
    // Sort products
    switch (state.sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  },
  productById: state => id => state.products.find(product => product.id === parseInt(id)),
  allBrands: state => [...new Set(state.products.map(product => product.brand))],
  categories: state => state.categories,
  currentProduct: state => state.currentProduct
};

const mutations = {
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product;
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query;
  },
  SET_CATEGORY_FILTER(state, category) {
    state.filters.category = category;
  },
  SET_BRAND_FILTER(state, brand) {
    state.filters.brand = brand;
  },
  SET_PRICE_RANGE(state, range) {
    state.filters.priceRange = range;
  },
  SET_RATING_FILTER(state, rating) {
    state.filters.rating = rating;
  },
  SET_SALE_FILTER(state, onSale) {
    state.filters.onSale = onSale;
  },
  SET_SORT_BY(state, sortBy) {
    state.sortBy = sortBy;
  },
  CLEAR_FILTERS(state) {
    state.filters = {
      category: '',
      priceRange: [0, 200],
      brand: '',
      rating: 0,
      onSale: false
    };
    state.searchQuery = '';
  }
};

const actions = {
  setCurrentProduct({ commit }, product) {
    commit('SET_CURRENT_PRODUCT', product);
  },
  searchProducts({ commit }, query) {
    commit('SET_SEARCH_QUERY', query);
  },
  filterByCategory({ commit }, category) {
    commit('SET_CATEGORY_FILTER', category);
  },
  filterByBrand({ commit }, brand) {
    commit('SET_BRAND_FILTER', brand);
  },
  setPriceRange({ commit }, range) {
    commit('SET_PRICE_RANGE', range);
  },
  setRatingFilter({ commit }, rating) {
    commit('SET_RATING_FILTER', rating);
  },
  setSaleFilter({ commit }, onSale) {
    commit('SET_SALE_FILTER', onSale);
  },
  setSortBy({ commit }, sortBy) {
    commit('SET_SORT_BY', sortBy);
  },
  clearAllFilters({ commit }) {
    commit('CLEAR_FILTERS');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
