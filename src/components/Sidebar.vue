<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Inbox</ion-list-header>
            <ion-note>hi@ionicframework.com</ion-note>
    
            <!-- <ion-menu-toggle :auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle> -->
          </ion-list>
    
          <!-- <ion-list id="labels-list">
            <ion-list-header>Labels</ion-list-header>
    
            <ion-item v-for="(label, index) in labels" lines="none" :key="index">
              <ion-icon aria-hidden="true" slot="start" :ios="bookmarkOutline" :md="bookmarkSharp"></ion-icon>
              <ion-label>{{ label }}</ion-label>
            </ion-item>
          </ion-list> -->
        </ion-content>
      </ion-menu>
      <slot></slot>
    </ion-split-pane>
  </ion-page>
  <!-- <ion-list id="inbox-list">
    <ion-list-header>Inbox</ion-list-header>
    <ion-note>hi@ionicframework.com</ion-note>

    <ion-menu-toggle :auto-hide="false" v-for="(p, i) in appPages" :key="i">
      <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" :detail="false"
        class="hydrated" :class="{ selected: selectedIndex === i }">
        <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
        <ion-label>{{ p.title }}</ion-label>
      </ion-item>
    </ion-menu-toggle>
  </ion-list> -->
  <!-- <ion-list id="inbox-list">
    <ion-list-header>{{ userStore.user?.name }}</ion-list-header>
    <ion-note>{{ userStore.user?.email }}</ion-note>

    <ion-menu-toggle :auto-hide="false" v-for="(menuItem, i) in menu" :key="i">
      <ion-item @click="selectedIndex = i" router-direction="root" :router-link="menuItem.url" lines="none"
        :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
        <ion-icon :name="menuItem.icon"></ion-icon>
        <ion-label>{{ menuItem.label }}</ion-label>
      </ion-item>
    </ion-menu-toggle>
  </ion-list> -->
  <!-- <ion-list id="labels-list" v-if="!menuItem.children">
    <ion-list-header>{{ menuItem.label }}</ion-list-header>

    <ion-item @click="selectedIndex = i" router-direction="root" :router-link="submenu.url" lines="none"
      :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }"
      v-for="(submenu, subIndex) in menuItem.children" :key="submenu.label + subIndex">
      <ion-icon :name="submenu.icon"></ion-icon>
      <ion-label>{{ submenu.label }}</ion-label>
    </ion-item>
  </ion-list> -->
</template>

<script>
import { onMounted, ref } from 'vue';
import {
  IonApp,
  IonPage,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/vue';
import { useUserStore } from '@/store/user';
//import { loadRoleRoutes } from '@/router';

export default {
  name: 'Sidebar',
  components: {
    IonPage,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonSplitPane
  },
  setup() {
    const selectedIndex = ref(0);
    const userStore = useUserStore();
    const menu = ref([]);

    const fullMenu = [
      { permission: null, route: { name: "home" }, icon: "home-outline", label: "Inicio" },
      // { permission: "reservar", route: { name: 'ReservarDocumento' }, icon: "bi-hand-index-thumb", label: "Reservar" },
      // { permission: "busqueda", route: { name: "BuscarDocumento" }, icon: "bi-search", label: "Búsqueda" },
      // { permission: "mis-documentos", route: { name: "MisDocumentos", query: { type: 1 } }, icon: "bi-file-earmark-person", label: "Mis documentos" },
      // { permission: "pendientes", route: { name: "DocumentosPendientes", query: { type: 1 } }, icon: "bi-clock", label: "Pendientes" },
      // {
      //     permission: "configuracion", icon: "bi-gear", label: 'Configuración', children: [
      //         { permission: "correlativos", route: { name: "Correlativos" }, icon: "bi-123", label: "Correlativos" },
      //         { permission: "plantillas", route: { name: "Plantillas" }, icon: "bi-filetype-html", label: "Plantillas" },
      //         { permission: "saludos", route: { name: "saludos" }, icon: "bi-person-raised-hand", label: "Saludos" },
      //         { permission: "dependencias", route: { name: "dependencias" }, icon: "bi-gear", label: "Dependencias" },
      //         { permission: "cargos", route: { name: "cargos" }, icon: "bi-gear", label: "Cargos" },
      //         { permission: "entidades", route: { name: "entidades" }, icon: "bi-buildings", label: "Entidades" },
      //         { permission: "destinatarios", route: { name: "destinatarios" }, icon: "bi-people", label: "Destinatarios" },
      //     ]
      // },
      // {
      //   permission: "administrador", icon: "bi-files", label: 'Administrador', children: [
      //     // { permission: "bitacora", route: { name: "bitacora.index" }, icon: "bi-journal-text", label: "Bitácora" },
      //     // { permission: "documentos", route: { name: "Documentos", query: { type: 1 } }, icon: "bi-files", label: "Documentos" },
      //     // { permission: "reportes", route: { name: "Reportes" }, icon: "bi-file-bar-graph", label: "Reportes" },
      //     // { permission: "Permissions", route: { name: "Permissions" }, icon: "bi-lock", label: "Permisos" },
      //     // { permission: "Roles", route: { name: "Roles" }, icon: "bi-lock", label: "Roles" },
      //     { permission: "users", url: '/', icon: "bi-people", label: "Usuarios" },
      //   ]
      // },
    ];

    const getAvailableMenu = () => {
      const filterMenu = (items) => {
        return items
          .filter(item => {
            if (!item.permission) return true;
            return userStore.user.permissions.some(p => p.name === item.permission);
          })
          .map(item => {
            if (item.children) {
              return {
                ...item,
                children: filterMenu(item.children)
              };
            }
            return item;
          });
      };

      return userStore.isSuperAdmin()
        ? fullMenu
        : filterMenu(fullMenu);
    };

    const setMenu = () => {
      menu.value = getAvailableMenu();
    };

    const setAdminRoutes = async () => {
      await loadRoleRoutes(['admin.routes.js']);
    };

    onMounted(async () => {
      await userStore.fetchUserProfile();
      if (userStore.isSuperAdmin()) {
        await setAdminRoutes();
      }
      setMenu();
    });

    return {
      selectedIndex,
      menu,
      userStore
    };
  }
};
</script>
