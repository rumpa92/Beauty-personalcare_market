<template>
  <div class="cart-page">
    <div class="container">
      <h1>Shopping Cart</h1>
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <router-link to="/products" class="btn btn-primary">Continue Shopping</router-link>
      </div>
      <div v-else>
        <p>{{ cartItemCount }} items in cart</p>
        <div class="cart-total">
          <strong>Total: ${{ finalTotal.toFixed(2) }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Cart',
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartItemCount', 'finalTotal'])
  }
};
</script>

<style scoped>
.cart-page {
  padding: 40px 0;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}
</style>
