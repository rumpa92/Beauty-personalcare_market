<template>
  <div class="order-details-minimal">
    <div class="container">
      <h1>Order Details - {{ orderId }}</h1>
      <div class="content-box">
        <h2>Order Information</h2>
        <p>Order Status: Out for Delivery</p>
        <p>Order Date: January 15, 2024</p>
        <p>Total: ₹2,471</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailsMinimal',
  props: {
    orderId: String
  }
};
</script>

<style scoped>
.order-details-minimal {
  padding-top: 40px;
  padding-bottom: 40px;
  min-height: 100vh;
  background: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  margin-top: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  color: #374151;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .order-details-minimal {
    padding-top: 120px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .content-box {
    padding: 24px;
  }
}
</style>
