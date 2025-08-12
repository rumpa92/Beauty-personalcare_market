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

    <!-- Compact Refund Modal -->
    <div v-if="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;" @click="closeModal">
      <div style="background: white; border-radius: 16px; width: 100%; max-width: 420px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2); animation: modalSlideIn 0.3s ease;" @click.stop>

        <!-- Compact Header -->
        <div style="padding: 20px 20px 16px; border-bottom: 1px solid #f0f0f0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 4px; background: linear-gradient(135deg, #8b4e9f, #d946b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Refund Request</h2>
              <p style="color: #6b7280; margin: 0; font-size: 13px;">Quick and secure refunds for eligible delivered items.</p>
            </div>
            <button @click="closeModal" style="width: 32px; height: 32px; border-radius: 50%; background: #f8fafc; border: 1px solid #e5e7eb; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #6b7280;">×</button>
          </div>
        </div>

        <!-- Compact Content -->
        <div style="padding: 20px;">

          <!-- Mini Order Info -->
          <div style="background: #f8f4f6; border-radius: 12px; padding: 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 12px; color: #6b7280; font-weight: 500;">Order #{{ orderId }}</span>
              <div style="font-size: 14px; color: #1f2937; font-weight: 600; margin-top: 2px;">₹2,499.00</div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 12px; color: #6b7280;">Jan 15, 2024</span>
              <div style="font-size: 12px; color: #15803d; font-weight: 600; margin-top: 2px;">✓ Delivered</div>
            </div>
          </div>

          <!-- Compact Form -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 6px; font-size: 14px;">
              Reason for Refund *
            </label>
            <select v-model="refundReason" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #374151; box-sizing: border-box; background: #fff;">
              <option value="">Select a reason</option>
              <option value="defective">Product is defective</option>
              <option value="damaged">Product arrived damaged</option>
              <option value="wrong-item">Wrong item received</option>
              <option value="not-as-described">Not as described</option>
              <option value="allergic-reaction">Allergic reaction</option>
              <option value="quality-issues">Quality issues</option>
              <option value="changed-mind">Changed my mind</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 6px; font-size: 14px;">
              Additional Comments <span style="color: #9ca3af; font-weight: 400;">(Optional)</span>
            </label>
            <textarea
              v-model="refundComments"
              placeholder="Brief description of the issue..."
              style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #374151; box-sizing: border-box; font-family: inherit; resize: vertical; min-height: 80px;"
            ></textarea>
          </div>

          <!-- Compact Info Banner -->
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">💰</span>
            <div>
              <div style="font-size: 14px; color: #0369a1; font-weight: 600;">Refund: ₹2,499.00</div>
              <div style="font-size: 12px; color: #0369a1;">Processed within 5-7 business days</div>
            </div>
          </div>

          <!-- Compact Buttons -->
          <div style="display: flex; gap: 12px;">
            <button @click="closeModal" style="flex: 1; padding: 12px; border: 2px solid #e5e7eb; background: #fff; color: #6b7280; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
              Cancel
            </button>
            <button
              @click="submitRefund"
              :disabled="!refundReason"
              :style="{
                flex: '2',
                padding: '12px',
                background: refundReason ? 'linear-gradient(135deg, #8b4e9f, #7c3aed)' : '#e5e7eb',
                color: refundReason ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: refundReason ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }"
            >
              📋 Submit Request
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;" @click="closeSuccess">
      <div style="background: white; border-radius: 24px; width: 100%; max-width: 500px; box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3); text-align: center; padding: 48px 32px; animation: successSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);" @click.stop>

        <!-- Success Icon -->
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto; animation: successPulse 2s infinite;">
          <span style="font-size: 36px; color: white;">✓</span>
        </div>

        <!-- Success Message -->
        <h2 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">Request Received!</h2>
        <p style="color: #6b7280; margin: 0 0 32px 0; line-height: 1.6; font-size: 16px;">
          Your refund request has been received. You'll be notified once it's processed.
        </p>

        <!-- Request Details -->
        <div style="background: linear-gradient(135deg, #f8f4f6, #fef8f6); border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: left; border: 1px solid #f0e6e6;">
          <h3 style="font-size: 16px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0; text-align: center;">Request Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #f0f0f0; text-align: center;">
              <span style="font-size: 14px; color: #6b7280; font-weight: 500; display: block; margin-bottom: 4px;">Request ID</span>
              <span style="color: #8b4e9f; font-weight: 700; font-size: 16px;">#{{ requestId }}</span>
            </div>
            <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #f0f0f0; text-align: center;">
              <span style="font-size: 14px; color: #6b7280; font-weight: 500; display: block; margin-bottom: 4px;">Processing Time</span>
              <span style="color: #15803d; font-weight: 700; font-size: 16px;">5-7 days</span>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button @click="closeSuccess" style="background: linear-gradient(135deg, #8b4e9f, #7c3aed); color: white; border: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(139, 78, 159, 0.3);">
          Continue Shopping
        </button>
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
      refundReason: '',
      refundComments: '',
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
      this.refundReason = '';
      this.refundComments = '';
    },
    closeSuccess() {
      this.showSuccess = false;
      this.requestId = '';
    },
    submitRefund() {
      if (!this.refundReason) return;

      this.requestId = 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
      this.showModal = false;
      this.showSuccess = true;

      // Reset form
      this.refundReason = '';
      this.refundComments = '';
    }
  }
};
</script>
