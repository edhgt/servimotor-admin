<template>
    <div class="pagination-container">
        <ion-button fill="outline" size="small" v-if="prevPageUrl" @click="goToPage(firstPageUrl)">
            <ion-icon slot="start" :icon="homeOutline">
            </ion-icon>
        </ion-button>

        <!-- Botón anterior -->
        <ion-button fill="outline" size="small" :disabled="!prevPageUrl" @click="goToPage(prevPageUrl)">
            <ion-icon slot="start" :icon="chevronBackOutline"></ion-icon>
            Anterior
        </ion-button>

        <!-- Botón siguiente -->
        <ion-button fill="outline" size="small" :disabled="!nextPageUrl" @click="goToPage(nextPageUrl)">
            Siguiente
            <ion-icon slot="end" :icon="chevronForwardOutline"></ion-icon>
        </ion-button>
    </div>
</template>

<script>
import { IonButton, IonIcon } from "@ionic/vue";
import { homeOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { makeUrlWithPaginate } from "@/utils/pagination";

export default {
    name: "PaginationControls",
    components: {
        IonButton, IonIcon,
    },
    props: {
        from: { type: [Number, String, null], default: null },
        to: { type: [Number, String, null], default: null },
        perPage: { type: [Number, String, null], default: null },
        firstPageUrl: { type: [String, null], default: null },
        prevPageUrl: { type: [String, null], default: null },
        nextPageUrl: { type: [String, null], default: null },
    },
    emits: ["change-page"],
    setup(props, { emit }) {
        const goToPage = (url) => {
            emit("change-page", makeUrlWithPaginate(url, props.perPage));
        };

        return {
            goToPage,
            homeOutline, chevronBackOutline, chevronForwardOutline
        };
    }
};
</script>

<style scoped>
.pagination-container {
    display: flex;
    justify-content: center;
    gap: 8px;
}
</style>
