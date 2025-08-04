<template>
  <ion-card>
    <!-- Header con búsqueda y selección de página -->
    <ion-card-header v-if="searchable || paginable">
      <ion-grid>
        <ion-row class="ion-align-items-center">
          <ion-col size="12" size-md="6" v-if="paginable">
            <ion-select
              interface="popover"
              v-model="laravelResponse.per_page"
              @ionChange="handlePerPageChange"
              label="Filas por página"
            >
              <ion-select-option v-for="size in [5, 10, 15, 20, 50, 100]" :key="size" :value="size">
                {{ size }} por página
              </ion-select-option>
            </ion-select>
          </ion-col>

          <ion-col size="12" size-md="6" v-if="searchable">
            <ion-searchbar
              v-model="searchQuery"
              debounce="300"
              placeholder="Buscar..."
              mode="md"
            />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-header>

    <!-- Cuerpo estilo tabla -->
    <ion-card-content>
      <ion-grid>
        <ion-row class="table-header ion-text-bold">
          <ion-col v-for="column in columns" :key="column.key">
            {{ column.label }}
          </ion-col>
          <ion-col v-if="$slots.actionTitle">
            <slot name="actionTitle" />
          </ion-col>
          <ion-col v-else>
            Acciones
          </ion-col>
        </ion-row>

        <ion-row
          v-for="(item, index) in itemsFiltered"
          :key="item.id"
          class="table-row"
        >
          <ion-col v-for="column in columns" :key="column.key">
            <slot :name="column.key" :value="item[column.key]" :item="item">
              <template v-if="column.key.includes('_at')">{{ formatDate(item[column.key]) }}</template>
              <template v-else-if="typeof item[column.key] === 'object'">{{ item[column.key]?.name }}</template>
              <template v-else>{{ item[column.key] }}</template>
            </slot>
          </ion-col>

          <ion-col>
            <slot name="actions" :item="item" :index="index" />
          </ion-col>
        </ion-row>

        <!-- Sin datos -->
        <ion-row v-if="!itemsFiltered.length">
          <ion-col :size="12" class="ion-text-center">
            <slot name="emptyText" v-if="$slots.emptyText" />
            <template v-else>No se encontraron datos.</template>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>

  <!-- Paginación -->
  <Pagination
    :from="laravelResponse.from"
    :to="laravelResponse.to"
    :per-page="laravelResponse.per_page"
    :prev-page-url="laravelResponse.prev_page_url"
    :next-page-url="laravelResponse.next_page_url"
    @change-page="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref, computed, toRef } from 'vue';
import { IonCard, IonCardHeader, IonCardContent, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonSearchbar } from '@ionic/vue';
import Pagination from '@/components/Pagination.vue';
import { formatDate } from '@/utils/dateUtils';

interface Column {
  key: string;
  label: string;
  thClass?: string;
  thStyle?: string;
}

const props = defineProps<{
  laravelResponse: {
    data: any[];
    per_page: number;
    path?: string;
    from?: number;
    to?: number;
    current_page?: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
  };
  columns: Column[];
  searchable?: boolean;
  paginable?: boolean;
  containOptions?: boolean;
}>();

const emit = defineEmits(['change-page']);

const searchQuery = ref('');

const itemsFiltered = computed(() => {
  if (!searchQuery.value) return props.laravelResponse.data;

  const query = searchQuery.value.toLowerCase();

  return props.laravelResponse.data.filter((item) =>
    props.columns.some((column) => {
      const value = item[column.key];
      if (value == null) return false;
      return value.toString().toLowerCase().includes(query);
    })
  );
});

const handlePageChange = (url: string) => {
  emit('change-page', url);
};

const handlePerPageChange = () => {
  const page = props.laravelResponse.current_page || 1;
  const url = `${props.laravelResponse.path}?page=${page}`;
  emit('change-page', url);
};
</script>

<style scoped>
.table-header {
  border-bottom: 1px solid var(--ion-color-medium);
  padding: 0.5rem 0;
}

.table-row {
  border-bottom: 1px solid var(--ion-color-light);
  padding: 0.5rem 0;
}
</style>
