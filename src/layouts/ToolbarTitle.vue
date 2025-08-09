<template>
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">{{ $route.meta.title }}</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import {
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
</script>