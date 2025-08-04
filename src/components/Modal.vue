<template>
  <ion-modal
    :is-open="modelValue"
    :backdrop-dismiss="autoClose"
    :keyboard-close="keyboard"
    :can-dismiss="autoClose"
    :showBackdrop="backdrop"
    @didDismiss="handleDismiss"
    :class="['custom-modal', sizeClass, { 'modal-centered': centered }]"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title v-if="!$slots.header">{{ title }}</ion-title>
        <slot name="header" v-else></slot>
        <ion-buttons slot="end" v-if="autoClose">
          <ion-button @click="closeModal">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <slot name="autoClose" v-else></slot>
      </ion-toolbar>
    </ion-header>

    <ion-content :scroll-y="scrollable">
      <slot></slot>
    </ion-content>

    <ion-footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </ion-footer>
  </ion-modal>
</template>

<script setup>
import { watch, computed } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonFooter } from '@ionic/vue';
import { close } from 'ionicons/icons';

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, default: 'Modal Title' },
  size: { type: String, default: 'md' },
  modelValue: { type: Boolean, default: false },
  autoClose: { type: Boolean, default: true },
  scrollable: { type: Boolean, default: true },
  backdrop: { type: Boolean, default: true },
  keyboard: { type: Boolean, default: true },
  centered: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
  emit('update:modelValue', false);
};

const handleDismiss = () => {
  emit('update:modelValue', false);
};

const sizeClass = computed(() => {
  const sizes = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    fullscreen: 'modal-fullscreen',
  };
  return sizes[props.size] || '';
});
</script>

<style scoped>
.custom-modal.modal-sm {
  --width: 300px;
}
.custom-modal.modal-md {
  --width: 500px;
}
.custom-modal.modal-lg {
  --width: 700px;
}
.custom-modal.modal-xl {
  --width: 900px;
}
.custom-modal.modal-fullscreen {
  --width: 100%;
  --height: 100%;
}
.modal-centered {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
