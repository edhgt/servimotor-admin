<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title>{{ $route.meta.title }}</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/vue';
export default {
  name: 'Header',
  components: { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle }
}
</script>