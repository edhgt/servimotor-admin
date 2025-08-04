<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>List y Grid Example</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-segment v-model="viewMode" class="ion-padding">
        <ion-segment-button value="list">Lista</ion-segment-button>
        <ion-segment-button value="grid">Grid</ion-segment-button>
      </ion-segment>

      <div v-if="viewMode === 'list'">
        <ion-list>
          <ion-item v-for="item in items" :key="item.id" button @click="selectItem(item)">
            <ion-thumbnail slot="start">
              <img :src="item.img" :alt="item.title" />
            </ion-thumbnail>
            <ion-label>
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </ion-label>
            <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
          </ion-item>
        </ion-list>
      </div>

      <div v-else-if="viewMode === 'grid'">
        <ion-grid>
          <ion-row>
            <ion-col size="6" size-sm="4" size-md="3" v-for="item in items" :key="item.id">
              <ion-card button @click="selectItem(item)">
                <img :src="item.img" :alt="item.title" />
                <ion-card-header>
                  <ion-card-title>{{ item.title }}</ion-card-title>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/vue'

import { chevronForwardOutline } from 'ionicons/icons'
import { ref } from 'vue'

const viewMode = ref('list')

const items = [
  { id: 1, title: 'Item 1', description: 'Descripción corta del ítem 1', img: 'https://picsum.photos/100?random=1' },
  { id: 2, title: 'Item 2', description: 'Descripción corta del ítem 2', img: 'https://picsum.photos/100?random=2' },
  { id: 3, title: 'Item 3', description: 'Descripción corta del ítem 3', img: 'https://picsum.photos/100?random=3' },
  { id: 4, title: 'Item 4', description: 'Descripción corta del ítem 4', img: 'https://picsum.photos/100?random=4' },
  { id: 5, title: 'Item 5', description: 'Descripción corta del ítem 5', img: 'https://picsum.photos/100?random=5' },
  { id: 6, title: 'Item 6', description: 'Descripción corta del ítem 6', img: 'https://picsum.photos/100?random=6' },
]

function selectItem(item) {
  toast({
    message: `Seleccionaste ${item.title}`,
    duration: 1500,
    color: 'primary',
  })
}
</script>

<style scoped>
ion-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

ion-item {
  --min-height: 72px;
}

ion-label h2 {
  margin: 0;
  font-weight: 600;
}

ion-label p {
  font-size: 0.9rem;
  color: var(--ion-text-secondary);
  margin-top: 4px;
}
</style>
