<template>
  <ion-button slot="end" size="small" @click="create">Agregar usuario</ion-button>
  <ListComponent :laravel-response="state.laravelResponse" :columns="columns" @change-page="index">
    <template #deleted_at="{ value }">
      <span class="badge text-bg-success" v-if="value == null">Activo</span>
      <span class="badge text-bg-danger" v-else>Inactivo</span>
    </template>
    <template #actions="{ item, index }">
      <button type="button" title="Modificar usuario" @click="edit(item, index)">
        <i class="bi bi-pencil-square"></i>
      </button>
      <button type="button" title="Deshabilitar usuario" @click="destroy(item, index)"
        v-if="item.deleted_at == null">
        <i class="bi bi-trash"></i>
      </button>
      <button type="button" title="Habilitar usuario"
        @click="restore(item.id, index)" v-else>
        <i class="bi bi-check-square"></i>
      </button>
    </template>
  </ListComponent>
  <Modal
    :title="modalFormUser.title"
    :size="modalFormUser.size"
    v-model="modalFormUser.isOpen"
  />
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import { useToast } from "vue-toastification";
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import {
  IonButton,
} from '@ionic/vue';
import Modal from "@/components/Modal.vue";
import Select from "@/components/Select.vue";
import axios from "@/plugins/axios";
import ListComponent from "@/components/ListComponent.vue";

export default {
  name: 'Users',
  components: {
    Form, Field, ErrorMessage,
    'v-select': VueSelect,
    IonButton,
    Modal,
    Select,
    ListComponent
  },
  setup() {
    const toast = useToast();
    const apiUrl = 'users';
    const state = reactive({
      laravelResponse: { data: [], links: {}, meta: { per_page: 5} },
      ldapUsers: [],
      rolesSelected: [],
    });
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre' },
      { key: 'username', label: 'Usuario' },
      { key: 'email', label: 'Correo electrónico' },
      { key: 'deleted_at', label: 'Estado' },
    ];
    const { values: userForm, handleSubmit, setFieldValue, setValues, setFieldError, resetForm, resetField } = useForm();

    const modalImportUser = ref({ title: 'Importar usuario', isOpen: false });
    const modalFormUser = ref({
      title: 'Actualizar usuario',
      size: 'md',
      isOpen: false,
    });
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
      const apiUrlIndex = url ? url : `${apiUrl}?per_page=${state.laravelResponse.meta.per_page}`;
      axios.get(apiUrlIndex).then(response => {
        state.laravelResponse = response.data;
      });
    };

    const create = () => {
      modalFormUser.value.isOpen = true;
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