<template>
  <div class="product-image-carousel">
    <!-- Main Image Display -->
    <div class="main-image-container">
      <div 
        class="main-image"
        @mousemove="handleMouseMove"
        @mouseleave="hideZoom"
        @click="openFullscreen"
      >
        <img 
          :src="currentImage" 
          :alt="productName"
          ref="mainImage"
          class="main-img"
        >
        
        <!-- Zoom Lens -->
        <div 
          v-if="showZoom" 
          class="zoom-lens"
          :style="lensStyle"
        ></div>
      </div>

      <!-- Zoom Result -->
      <div 
        v-if="showZoom" 
        class="zoom-result"
        :style="zoomStyle"
      ></div>

      <!-- Image Navigation Arrows -->
      <button 
        v-if="images.length > 1"
        @click="previousImage" 
        class="nav-arrow prev"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button 
        v-if="images.length > 1"
        @click="nextImage" 
        class="nav-arrow next"
      >
        <i class="fas fa-chevron-right"></i>
      </button>

      <!-- Image Indicators -->
      <div v-if="images.length > 1" class="image-indicators">
        <span 
          v-for="(image, index) in images" 
          :key="index"
          class="indicator"
          :class="{ active: currentIndex === index }"
          @click="setCurrentImage(index)"
        ></span>
      </div>

      <!-- Fullscreen Button -->
      <button @click="openFullscreen" class="fullscreen-btn">
        <i class="fas fa-expand"></i>
      </button>
    </div>

    <!-- Thumbnail Gallery -->
    <div class="thumbnail-gallery">
      <button 
        v-for="(image, index) in images" 
        :key="index"
        class="thumbnail"
        :class="{ active: currentIndex === index }"
        @click="setCurrentImage(index)"
      >
        <img :src="image" :alt="`${productName} view ${index + 1}`">
      </button>
    </div>

    <!-- Fullscreen Modal -->
    <div v-if="fullscreenOpen" class="fullscreen-modal" @click="closeFullscreen">
      <div class="fullscreen-content" @click.stop>
        <button @click="closeFullscreen" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="fullscreen-image-container">
          <img 
            :src="currentImage" 
            :alt="productName"
            class="fullscreen-image"
          >
          
          <button 
            v-if="images.length > 1"
            @click="previousImage" 
            class="fullscreen-nav prev"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button 
            v-if="images.length > 1"
            @click="nextImage" 
            class="fullscreen-nav next"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="fullscreen-thumbnails">
          <button 
            v-for="(image, index) in images" 
            :key="index"
            class="fullscreen-thumbnail"
            :class="{ active: currentIndex === index }"
            @click="setCurrentImage(index)"
          >
            <img :src="image" :alt="`View ${index + 1}`">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductImageCarousel',
  props: {
    images: {
      type: Array,
      required: true
    },
    productName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      showZoom: false,
      fullscreenOpen: false,
      lensPosition: { x: 0, y: 0 },
      zoomPosition: { x: 0, y: 0 }
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex] || this.images[0];
    },
    lensStyle() {
      return {
        left: this.lensPosition.x + 'px',
        top: this.lensPosition.y + 'px'
      };
    },
    zoomStyle() {
      return {
        backgroundImage: `url(${this.currentImage})`,
        backgroundPosition: `-${this.zoomPosition.x}px -${this.zoomPosition.y}px`,
        backgroundSize: '400% 400%'
      };
    }
  },
  methods: {
    setCurrentImage(index) {
      this.currentIndex = index;
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    previousImage() {
      this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    },
    handleMouseMove(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const lensSize = 100;
      const lensX = Math.max(0, Math.min(x - lensSize / 2, rect.width - lensSize));
      const lensY = Math.max(0, Math.min(y - lensSize / 2, rect.height - lensSize));
      
      this.lensPosition = { x: lensX, y: lensY };
      
      // Calculate zoom position
      const zoomFactor = 4;
      this.zoomPosition = {
        x: x * zoomFactor - 150,
        y: y * zoomFactor - 150
      };
      
      this.showZoom = true;
    },
    hideZoom() {
      this.showZoom = false;
    },
    openFullscreen() {
      this.fullscreenOpen = true;
      document.body.style.overflow = 'hidden';
    },
    closeFullscreen() {
      this.fullscreenOpen = false;
      document.body.style.overflow = '';
    }
  },
  mounted() {
    // Auto-advance images every 5 seconds when not interacting
    this.autoAdvanceInterval = setInterval(() => {
      if (!this.showZoom && !this.fullscreenOpen) {
        this.nextImage();
      }
    }, 5000);
  },
  beforeDestroy() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
    }
    document.body.style.overflow = '';
  }
};
</script>

<style scoped>
.product-image-carousel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image-container {
  position: relative;
  aspect-ratio: 1;
  background: var(--gray-50);
  border-radius: 12px;
  overflow: hidden;
  cursor: zoom-in;
}

.main-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.zoom-lens {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid var(--primary-500);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  backdrop-filter: blur(2px);
}

.zoom-result {
  position: absolute;
  top: 0;
  right: -320px;
  width: 300px;
  height: 300px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  background-repeat: no-repeat;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-700);
  opacity: 0;
  backdrop-filter: blur(10px);
}

.main-image-container:hover .nav-arrow {
  opacity: 1;
}

.nav-arrow:hover {
  background: white;
  color: var(--primary-600);
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow.prev {
  left: 16px;
}

.nav-arrow.next {
  right: 16px;
}

.image-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.indicator.active {
  background: var(--primary-500);
  transform: scale(1.2);
}

.fullscreen-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-700);
  opacity: 0;
  backdrop-filter: blur(10px);
}

.main-image-container:hover .fullscreen-btn {
  opacity: 1;
}

.fullscreen-btn:hover {
  background: white;
  color: var(--primary-600);
}

.thumbnail-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--gray-50);
}

.thumbnail:hover {
  border-color: var(--primary-300);
}

.thumbnail.active {
  border-color: var(--primary-500);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fullscreen Modal */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.fullscreen-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.close-btn {
  position: absolute;
  top: -60px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.fullscreen-image-container {
  position: relative;
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.fullscreen-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.fullscreen-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.fullscreen-nav.prev {
  left: -80px;
}

.fullscreen-nav.next {
  right: -80px;
}

.fullscreen-thumbnails {
  display: flex;
  gap: 12px;
  justify-content: center;
  overflow-x: auto;
  padding: 8px;
}

.fullscreen-thumbnail {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--gray-800);
}

.fullscreen-thumbnail:hover {
  border-color: rgba(255, 255, 255, 0.6);
}

.fullscreen-thumbnail.active {
  border-color: var(--primary-400);
}

.fullscreen-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .zoom-result {
    display: none;
  }
}

@media (max-width: 768px) {
  .thumbnail-gallery {
    gap: 8px;
  }
  
  .thumbnail {
    width: 60px;
    height: 60px;
  }
  
  .fullscreen-nav.prev {
    left: -60px;
  }
  
  .fullscreen-nav.next {
    right: -60px;
  }
}

@media (max-width: 480px) {
  .thumbnail {
    width: 50px;
    height: 50px;
  }
  
  .fullscreen-nav.prev,
  .fullscreen-nav.next {
    position: relative;
    left: auto;
    right: auto;
    margin: 0 10px;
  }
  
  .fullscreen-image-container {
    flex-direction: column;
  }
}
</style>
