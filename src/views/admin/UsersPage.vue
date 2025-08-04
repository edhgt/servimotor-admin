<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.meta.title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.meta.title }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <button class="btn btn-primary float-end" @click="create">
        <i class="bi bi-person-up"></i>
        Agregar usuario
      </button>
      <SimplePaginatedTable :laravel-response="state.laravelResponse" :columns="columns" @change-page="index">
        <template #deleted_at="{ value }">
          <span class="badge text-bg-success" v-if="value == null">Activo</span>
          <span class="badge text-bg-danger" v-else>Inactivo</span>
        </template>
        <template #actions="{ item, index }">
          <button type="button" class="btn btn-primary btn-sm" title="Modificar usuario" @click="edit(item, index)">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm" title="Deshabilitar usuario" @click="destroy(item, index)"
            v-if="item.deleted_at == null">
            <i class="bi bi-trash"></i>
          </button>
          <button type="button" class="btn btn-success btn-sm" title="Habilitar usuario"
            @click="restore(item.id, index)" v-else>
            <i class="bi bi-check-square"></i>
          </button>
        </template>
      </SimplePaginatedTable>
    </ion-content>
  </ion-page>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import { useToast } from "vue-toastification";
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import SimplePaginatedTable from "@/components/SimplePaginatedTable.vue";
import Modal from "@/components/Modal.vue";
import Select from "@/components/Select.vue";
import axios from "@/plugins/axios";

export default {
  name: 'Users',
  components: {
    Form, Field, ErrorMessage,
    'v-select': VueSelect,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    SimplePaginatedTable,
    Modal,
    Select,
  },
  setup() {
    const toast = useToast();
    const apiUrl = '/api/users';
    const state = reactive({
      laravelResponse: { per_page: 5, data: [] },
      ldapUsers: [],
      rolesSelected: [],
    });
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre' },
      { key: 'description', label: 'Descripción' },
      { key: 'username', label: 'Usuario' },
      { key: 'email', label: 'Correo electrónico' },
      { key: 'created_at', label: 'Fecha creación' },
      { key: 'updated_at', label: 'Fecha actualiación' },
      { key: 'deleted_at', label: 'Estado' },
    ];
    const { values: userForm, handleSubmit, setFieldValue, setValues, setFieldError, resetForm, resetField } = useForm();

    const modalImportUser = ref({ title: 'Importar usuario', isVisible: false });
    const modalFormUser = ref({ title: 'Actualizar usuario', isVisible: false });
    const ldapSearch = ref({
      types: [
        { code: 'samaccountname', label: 'Usuario' },
        { code: 'cn', label: 'Nombre' },
      ], searching: false
    });
    const user = ref();

    const searchUsers = (values) => {
      ldapSearch.value.searching = true;
      axios.get(apiUrl, {
        params: {
          filter: true,
          type: values.type.code,
          value: values.value
        }
      }).then((response) => {
        state.ldapUsers = response.data;
        ldapSearch.value.searching = false;
      }).catch(() => {
        ldapSearch.value.searching = false;
      })
    };

    const index = (url = undefined) => {
      const apiUrlIndex = url ? url : `${apiUrl}?per_page=${state.laravelResponse.per_page}`;
      axios.get(apiUrlIndex).then(response => state.laravelResponse = response.data);
    };
    const create = () => {
      modalImportUser.value.isVisible = true;
      ldapSearch.value.searching = false;
      state.ldapUsers = [];
      resetForm();
    };

    const store = (ldapUser, index) => {
      const confirmStoreUser = confirm(`Desea agregar a ${ldapUser.name} <${ldapUser.email}>`)
      if (!confirmStoreUser) return;
      const apiUrl = '/api/users';
      axios.post(apiUrl, ldapUser)
        .then(response => {
          state.laravelResponse.data.unshift(response.data);
          resetForm();
          state.ldapUsers.splice(index, 1);
          toast.success(`Se sincronizó el usuario ${response.data.name} <${response.data.email}>`);
          edit(response.data, 0);
        })
    };

    const getRolesByUserId = (id) => {
      axios.get(`${apiUrl}/${id}`, { params: { roles: true } }).then(response => {
        const roles = response.data.map(r => r.id);
        if (roles.length > 0) {
          setFieldValue('roles', roles);
        }
      });
    }

    const edit = (item, index) => {
      resetForm();
      user.value = item;
      setValues(user.value);
      setFieldValue('index', index);
      setFieldValue('is_director', Boolean(user.value.is_director));
      getRolesByUserId(user.value.id);
      modalImportUser.value.isVisible = false;
      modalFormUser.value.isVisible = true;
    };

    const update = handleSubmit(() => {
      axios.patch(`${apiUrl}/${userForm.id}`, userForm)
        .then(response => {
          state.laravelResponse.data[userForm.index] = response.data;
          toast.info(`Usuario ${userForm.name} <${userForm.email}> actualizado`);
          modalFormUser.value.isVisible = false;
        })
        .catch(error => {
          if (error.response.data.errors) {
            Object.entries(error.response.data.errors).forEach(([key, value]) => {
              setFieldError(key, value);
            });
          }
        });

    });

    const destroy = (item, index) => {
      const userToDelete = `${item.name} <${item.email}>`;
      const confirmDeleteUser = confirm(
        `¿Está seguro de que desea deshabilitar a ${userToDelete}?\n\n` +
        'Podrá restaurarlo más adelante.'
      );
      if (confirmDeleteUser) {
        axios.delete(`${apiUrl}/${item.id}`).then(() => {
          state.laravelResponse.data[index].deleted_at = new Date().toDateString();

          toast.info(`Se deshabilitó a: ${userToDelete}`);

        });
      }
    };

    const restore = (id, index) => {
      axios.post(`${apiUrl}/${id}/restore`).then(() => {
        state.laravelResponse.data[index].deleted_at = null;
      });
    };

    onMounted(() => {
      index();
    });
    return {
      state,
      columns,
      modalImportUser,
      modalFormUser,
      ldapSearch,
      user,
      searchUsers,
      index,
      create,
      store,
      edit,
      update,
      destroy,
      restore
    };
  }
}
</script>