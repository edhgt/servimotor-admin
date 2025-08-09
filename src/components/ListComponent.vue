<template>
  <div class="ion-padding">
    <!-- Controles -->
    <div class="controls" v-if="searchable || paginable">
      <ion-select v-if="paginable" v-model="perPage" interface="popover" @ionChange="handlePerPageChange">
        <ion-select-option v-for="size in [5, 10, 15, 20, 50, 100]" :key="size" :value="size">
          {{ size }} por página
        </ion-select-option>
      </ion-select>
      <ion-searchbar v-if="searchable" v-model="searchQuery" placeholder="Buscar..."></ion-searchbar>
    </div>

    <!-- Selector de vista -->
    <ion-segment v-model="viewMode">
      <ion-segment-button value="list">
        <ion-icon :icon="listOutline"></ion-icon>
      </ion-segment-button>
      <ion-segment-button value="grid">
        <ion-icon :icon="gridOutline"></ion-icon>
      </ion-segment-button>
    </ion-segment>

    <!-- Vista Lista (adaptada con lógica de tabla) -->
    <ion-list :inset="true" v-if="viewMode === 'list'">
      <ion-item-sliding v-for="(item, index) in itemsFiltered" :key="item.id">
        <ion-item lines="full" detail="false" button @click="openDetail(item)">
          <ion-thumbnail slot="start" v-if="item.img">
            <img :src="item.img" :alt="item.title" />
          </ion-thumbnail>
          <ion-label>
            <!-- Campo principal -->
            <h2>
              <slot :name="columns[0].key" :value="item[columns[0].key]" :item="item">
                {{ item[columns[0].key] }}
              </slot>
            </h2>
            <!-- Campos secundarios -->
            <p v-for="column in columns.slice(1, columns.length - 1)" :key="column.key">
              <strong>{{ column.label }}:</strong>
              <slot :name="column.key" :value="item[column.key]" :item="item">
                <template v-if="column.key.includes('_at')">{{ formatDate(item[column.key]) }}</template>
                <template v-else-if="typeof item[column.key] === 'object'">{{ item[column.key]?.name }}</template>
                <template v-else>{{ item[column.key] }}</template>
              </slot>
            </p>
          </ion-label>
        </ion-item>

        <!-- Acciones al deslizar -->
        <ion-item-options side="end" v-if="$slots.actions">
          <ion-item-option>
            <slot name="actions" :item="item" :index="index"></slot>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>

      <ion-item v-if="!itemsFiltered.length">
        <ion-label class="ion-text-center">
          <slot name="emptyText" v-if="$slots.emptyText"></slot>
          <span v-else>No se encontraron datos.</span>
        </ion-label>
      </ion-item>
    </ion-list>

    <!-- Vista Grid -->
    <ion-grid v-else-if="viewMode === 'grid'">
      <ion-row>
        <ion-col size="6" size-sm="4" size-md="3" v-for="(item, index) in itemsFiltered" :key="item.id">
          <ion-card button>
            <ion-thumbnail slot="start" v-if="item.img">
              <img :src="item.img" :alt="item.title" />
            </ion-thumbnail>
            <ion-card-header>
              <ion-card-title>
                <slot :name="columns[0].key" :value="item[columns[0].key]" :item="item">
                  {{ item[columns[0].key] }}
                </slot>
              </ion-card-title>
              <!-- Campo principal -->
              <!-- Campos secundarios -->
              <p v-for="column in columns.slice(1, columns.length - 1)" :key="column.key">
                <slot :name="column.key" :value="item[column.key]" :item="item">
                  <template v-if="column.key.includes('_at')">{{ formatDate(item[column.key]) }}</template>
                  <template v-else-if="typeof item[column.key] === 'object'">{{ item[column.key]?.name }}</template>
                  <template v-else>{{ item[column.key] }}</template>
                </slot>
              </p>
            </ion-card-header>
            <div class="ion-padding" v-if="$slots.actions">
              <slot name="actions" :item="item" :index="index"></slot>
            </div>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>

    <!-- Paginación -->
    <PaginationControls v-if="paginable" :from="laravelResponse.meta.from" :to="laravelResponse.meta.to"
      :per-page="laravelResponse.meta.per_page" :prev-page-url="laravelResponse.links.prev"
      :first-page-url="laravelResponse.links.first" :next-page-url="laravelResponse.links.next"
      @change-page="handlePageChange" />
  </div>
</template>

<script setup>
import {
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonThumbnail,
} from '@ionic/vue'
import { listOutline, gridOutline } from 'ionicons/icons'
import { ref, computed, toRef } from 'vue'
import { formatDate } from '@/utils/dateUtils'
import PaginationControls from '@/components/PaginationControls.vue'

const props = defineProps({
  laravelResponse: { type: Object, required: true, default: { data: [], meta: { per_page: 5 }, links: { first: '', next: '', prev: ''} } },
  columns: { type: Array, required: true },
  searchable: { type: Boolean, default: true },
  paginable: { type: Boolean, default: true }
})
const emit = defineEmits(['change-page'])

const perPage = ref(props.laravelResponse.meta.per_page);
const viewMode = ref('list')
const searchQuery = ref('')
const laravelResponse = toRef(props, 'laravelResponse')

const itemsFiltered = computed(() => {
  if (!searchQuery.value) return laravelResponse.value.data
  const query = searchQuery.value.toLowerCase()
  return laravelResponse.value.data.filter(item =>
    props.columns.some(column => {
      const value = item[column.key]
      if (value == null) return false
      return value.toString().toLowerCase().includes(query)
    })
  )
})

function handlePageChange(url) {
  emit('change-page', url)
}
function handlePerPageChange() {
  const url = `${laravelResponse.value.meta.path}?page=${laravelResponse.value.meta.current_page}&per_page=${perPage.value}`
  emit('change-page', url)
}
</script>

<style scoped>
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

ion-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}
</style>
