<template>
  <!-- Botón para retroceder página -->
  <ion-fab vertical="bottom" horizontal="start" slot="fixed" v-if="prevPageUrl">
    <ion-fab-button @click="goPrevPage">
      <ion-icon name="arrow-up-outline"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- Infinite Scroll hacia adelante -->
  <ion-infinite-scroll
    v-if="nextPageUrl"
    @ionInfinite="loadMore"
    threshold="100px"
  >
    <ion-infinite-scroll-content
      loadingSpinner="bubbles"
      loadingText="Cargando más elementos..."
    ></ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script>
import { IonInfiniteScroll, IonInfiniteScrollContent, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { makeUrlWithPaginate } from "@/utils/pagination";

export default {
  name: "InfinitePagination",
  components: { IonInfiniteScroll, IonInfiniteScrollContent, IonFab, IonFabButton, IonIcon },
  props: {
    from: { type: [Number, String, null], default: null },
    to: { type: [Number, String, null], default: null },
    perPage: { type: [Number, String, null], default: null },
    prevPageUrl: { type: [String, null], default: null },
    nextPageUrl: { type: [String, null], default: null },
  },
  emits: ['change-page'],
  setup(props, { emit }) {
    const loadMore = (event) => {
      if (!props.nextPageUrl) {
        event.target.disabled = true;
        event.target.complete();
        return;
      }

      emit('change-page', makeUrlWithPaginate(props.nextPageUrl, props.perPage));
      setTimeout(() => {
        event.target.complete();
      }, 300);
    };

    const goPrevPage = () => {
      if (props.prevPageUrl) {
        emit('change-page', makeUrlWithPaginate(props.prevPageUrl, props.perPage));
      }
    };

    return { loadMore, goPrevPage };
  }
};
</script>
