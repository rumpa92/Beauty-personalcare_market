<template>
  <div class="how-to-use-section">
    <div class="usage-steps">
      <div 
        v-for="instruction in instructions" 
        :key="instruction.step"
        class="step-card"
      >
        <div class="step-number">{{ instruction.step }}</div>
        <div class="step-content">
          <h4 class="step-title">{{ instruction.title }}</h4>
          <p class="step-description">{{ instruction.description }}</p>
          
          <div v-if="instruction.tips" class="step-tips">
            <h5>Pro Tips:</h5>
            <ul>
              <li v-for="tip in instruction.tips" :key="tip">{{ tip }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="routine-suggestions">
      <h3>Recommended Routine</h3>
      <div class="routine-timeline">
        <div class="timeline-item morning">
          <div class="timeline-icon">
            <i class="fas fa-sun"></i>
          </div>
          <div class="timeline-content">
            <h4>Morning Routine</h4>
            <ol>
              <li>Gentle cleanser</li>
              <li>This product</li>
              <li>Moisturizer with SPF</li>
            </ol>
          </div>
        </div>
        
        <div class="timeline-item evening">
          <div class="timeline-icon">
            <i class="fas fa-moon"></i>
          </div>
          <div class="timeline-content">
            <h4>Evening Routine</h4>
            <ol>
              <li>Oil cleanser</li>
              <li>Water-based cleanser</li>
              <li>This product</li>
              <li>Night moisturizer</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <div class="usage-video">
      <h3>Watch How to Apply</h3>
      <div class="video-placeholder" @click="playVideo">
        <div class="play-button">
          <i class="fas fa-play"></i>
        </div>
        <span>How to get the most out of your product</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowToUseSection',
  props: {
    instructions: {
      type: Array,
      required: true
    }
  },
  methods: {
    playVideo() {
      // Placeholder for video functionality
      console.log('Play instructional video');
    }
  }
};
</script>

<style scoped>
.how-to-use-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.usage-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-card {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--gray-200);
  transition: all 0.2s ease;
}

.step-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.step-description {
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: 16px;
}

.step-tips {
  background: var(--gray-50);
  border-radius: 8px;
  padding: 16px;
}

.step-tips h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 8px;
}

.step-tips ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.step-tips li {
  position: relative;
  padding-left: 20px;
  color: var(--gray-600);
  font-size: 14px;
  margin-bottom: 4px;
}

.step-tips li::before {
  content: '💡';
  position: absolute;
  left: 0;
  top: 0;
}

.routine-suggestions h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 24px;
}

.routine-timeline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.timeline-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--gray-200);
}

.timeline-item.morning {
  border-left: 4px solid #fbbf24;
}

.timeline-item.evening {
  border-left: 4px solid #6366f1;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
}

.morning .timeline-icon {
  background: #fbbf24;
}

.evening .timeline-icon {
  background: #6366f1;
}

.timeline-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 12px;
}

.timeline-content ol {
  padding-left: 20px;
  color: var(--gray-600);
}

.timeline-content li {
  margin-bottom: 4px;
}

.usage-video h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
}

.video-placeholder {
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  border-radius: 12px;
  padding: 60px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px dashed var(--primary-300);
}

.video-placeholder:hover {
  background: linear-gradient(135deg, var(--primary-200), var(--primary-300));
  transform: translateY(-2px);
}

.play-button {
  width: 80px;
  height: 80px;
  background: var(--primary-500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 32px;
  transition: transform 0.2s ease;
}

.video-placeholder:hover .play-button {
  transform: scale(1.1);
}

.video-placeholder span {
  color: var(--primary-700);
  font-weight: 500;
}

@media (max-width: 768px) {
  .routine-timeline {
    grid-template-columns: 1fr;
  }
  
  .step-card {
    flex-direction: column;
    text-align: center;
  }
  
  .step-number {
    align-self: center;
  }
}
</style>
