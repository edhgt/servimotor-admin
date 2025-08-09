<template>
  <ion-modal
    :is-open="modelValue"
    :backdrop-dismiss="autoClose"
    :keyboard-close="keyboard"
    :can-dismiss="autoClose"
    :showBackdrop="backdrop"
    :class="[sizeClass]"
  >
    <ion-header>
      <ion-toolbar>
        <template v-if="!$slots.header">
          <ion-title>{{ title }}</ion-title>
          <ion-buttons slot="end">
            <ion-button color="medium" @click="setOpen(false)">Cancelar</ion-button>
          </ion-buttons>
        </template>
        <slot name="header" v-else></slot>
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

<script>
import { computed } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonFooter } from '@ionic/vue';

export default {
  name: 'Modal',
  components: {
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonFooter,
    close,
  },
  emits: ['update:modelValue'],
  props: {
    title: { type: String, default: 'Modal Title' },
    size: { type: String, default: 'md' },
    modelValue: { type: Boolean, default: false },
    autoClose: { type: Boolean, default: true },
    scrollable: { type: Boolean, default: true },
    backdrop: { type: Boolean, default: true },
    keyboard: { type: Boolean, default: true },
    centered: { type: Boolean, default: false },
  },
  setup(props, ctx) {
    const setOpen = (open) => {
      ctx.emit('update:modelValue', open);
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

    return {
      sizeClass,
      setOpen,
    };
  }
}
</script>
