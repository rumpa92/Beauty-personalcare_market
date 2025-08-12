<template>
  <div style="padding: 40px; max-width: 800px; margin: 0 auto; background: #f9fafb; min-height: 100vh;">
    
    <!-- Header -->
    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px;">
      <button @click="goBack" style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-weight: 600; color: #6b7280;">
        ← Back
      </button>
      <h1 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0;">Order Details</h1>
    </div>

    <!-- Order Summary -->
    <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap;">
        <div>
          <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Order #{{ orderId }}</h2>
          <p style="color: #6b7280; margin: 0;">Delivered on January 15, 2024</p>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #15803d; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; border: 1px solid #22c55e;">
            ✓ Delivered
          </span>
          <button @click="openRefundModal" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            Request Refund
          </button>
        </div>
      </div>
    </div>

    <!-- Order Items -->
    <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
      <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">Order Items</h3>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div v-for="item in items" :key="item.id" style="display: flex; gap: 16px; padding: 16px; background: #f9fafb; border-radius: 12px; border: 1px solid #f0f0f0;">
          <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
            <img :src="item.image" :alt="item.name" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="flex: 1;">
            <h4 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 4px 0;">{{ item.name }}</h4>
            <p style="font-size: 14px; color: #8b4e9f; margin: 0 0 8px 0; font-weight: 500;">{{ item.brand }}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
              <span style="color: #6b7280;">Qty: {{ item.quantity }}</span>
              <span style="color: #8b4e9f; font-weight: 700;">₹{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Address -->
    <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
      <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">Delivery Address</h3>
      <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #f0f0f0;">
        <h4 style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Rumpa Samanta</h4>
        <p style="color: #6b7280; margin: 0 0 4px 0;">+91 9876543210</p>
        <p style="color: #6b7280; margin: 0;">123 Beauty Lane, Bandra West, Mumbai, Maharashtra - 400001</p>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
      <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">Price Breakdown</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
          <span style="color: #6b7280;">Item Subtotal</span>
          <span style="color: #1f2937; font-weight: 600;">₹2,797.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
          <span style="color: #6b7280;">Tax</span>
          <span style="color: #1f2937; font-weight: 600;">₹252.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
          <span style="color: #6b7280;">Discount</span>
          <span style="color: #22c55e; font-weight: 600;">-₹300.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
          <span style="color: #6b7280;">Shipping Fee</span>
          <span style="color: #1f2937; font-weight: 600;">FREE</span>
        </div>
        <div style="height: 2px; background: linear-gradient(90deg, #f0e6e6, #e9d5ff, #f0e6e6); margin: 8px 0; border-radius: 1px;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700;">
          <span style="color: #1f2937;">Total Amount Paid</span>
          <span style="color: #8b4e9f; font-size: 20px;">₹2,499.00</span>
        </div>
      </div>
    </div>

    <!-- Refund Modal -->
    <div v-if="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;" @click="closeModal">
      <div style="background: white; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);" @click.stop>
        
        <!-- Modal Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 24px 0 24px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 4px 0; background: linear-gradient(135deg, #8b4e9f, #d946b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Refund Request</h2>
            <p style="color: #6b7280; margin: 0;">Only eligible delivered items can be refunded.</p>
          </div>
          <button @click="closeModal" style="width: 36px; height: 36px; border-radius: 50%; background: #f8fafc; border: 1px solid #e5e7eb; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #6b7280;">×</button>
        </div>

        <!-- Modal Content -->
        <div style="padding: 0 24px 24px 24px;">
          
          <!-- Order Info -->
          <div style="background: linear-gradient(135deg, #f8f4f6, #fef8f6); border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #f0e6e6; display: flex; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 14px; color: #6b7280; font-weight: 500;">Order ID:</span>
              <span style="font-size: 16px; color: #1f2937; font-weight: 700;">#{{ orderId }}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 14px; color: #6b7280; font-weight: 500;">Delivery Date:</span>
              <span style="font-size: 16px; color: #1f2937; font-weight: 700;">January 15, 2024</span>
            </div>
          </div>

          <!-- Refund Amount -->
          <div style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 2px solid #bbf7d0; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 700; color: #15803d; margin: 0 0 12px 0;">💰 Refund Amount</h3>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; padding-top: 6px;">
              <span style="color: #15803d;">Total Refund Amount:</span>
              <span style="color: #15803d; font-size: 20px;">₹2,499.00</span>
            </div>
            <p style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px; margin-top: 12px; color: #0369a1; font-size: 12px; line-height: 1.4; margin-bottom: 0;">
              ℹ️ Refund will be processed to your original payment method within 5-7 business days.
            </p>
          </div>

          <!-- Submit Button -->
          <button @click="submitRefund" style="width: 100%; background: linear-gradient(135deg, #8b4e9f, #7c3aed); color: white; border: none; padding: 16px 24px; border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            ✈️ Submit Refund Request
          </button>
          
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;" @click="closeSuccess">
      <div style="background: white; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); text-align: center; padding: 40px 24px;" @click.stop>
        <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
        <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 12px 0;">Refund Request Submitted!</h2>
        <p style="color: #6b7280; margin: 0 0 24px 0; line-height: 1.5;">Your refund request has been submitted. We'll notify you once it's processed.</p>
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span style="color: #6b7280;">Request ID:</span>
            <span style="color: #1f2937; font-weight: 600;">#{{ requestId }}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px;">
            <span style="color: #6b7280;">Expected Processing:</span>
            <span style="color: #1f2937; font-weight: 600;">5-7 business days</span>
          </div>
        </div>
        <button @click="closeSuccess" style="background: linear-gradient(135deg, #8b4e9f, #7c3aed); color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; cursor: pointer;">Got it</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SimpleOrderDetails',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      showSuccess: false,
      requestId: '',
      items: [
        {
          id: 1,
          name: 'Luxury Moisturizing Face Cream',
          brand: 'GlowLux',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=150',
          price: 1299,
          quantity: 1
        },
        {
          id: 2,
          name: 'Vitamin C Brightening Serum',
          brand: 'VitaGlow',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150',
          price: 899,
          quantity: 1
        },
        {
          id: 3,
          name: 'Gentle Foaming Cleanser',
          brand: 'PureClean',
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=150',
          price: 599,
          quantity: 1
        }
      ]
    };
  },
  methods: {
    goBack() {
      this.$router.push('/orders');
    },
    openRefundModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    closeSuccess() {
      this.showSuccess = false;
      this.requestId = '';
    },
    submitRefund() {
      this.requestId = 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
      this.showModal = false;
      this.showSuccess = true;
    }
  }
};
</script>
