<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-row>
        <ion-col size-sm="12">
          <h1 class="ion-text-center">{{ APP_NAME }}</h1>
          <form autocomplete="on" @submit.prevent="onSubmit">
            <!-- Email -->
            <Field name="username" rules="required" label="usuario" v-slot="{ field }">
              <ion-item>
                <ion-input
                  autocomplete="username"
                  :autofocus="true"
                  type="text"
                  v-bind="field"
                  label-placement="floating"
                  label="Usuario"
                >
                </ion-input>
              </ion-item>
            </Field>
            <ErrorMessage name="username" />
            <!-- Contraseña -->
            <Field name="password" rules="required" label="contraseña" v-slot="{ field }">
              <ion-item>
                <ion-input
                  type="password"
                  v-bind="field"
                  label-placement="floating"
                  label="Contraseña"
                ></ion-input>
              </ion-item>
            </Field>
            <ErrorMessage name="password" />
            <ion-button type="submit" class="ion-margin-top">Iniciar sesión</ion-button>
          </form>
        </ion-col>
      </ion-row>
      <ion-text>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonText,
    IonPage,
    IonRow,
    IonCol,
} from '@ionic/vue';
import {
  useForm,
  Field,
  ErrorMessage,
  defineRule,
  configure,
} from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import es from '@vee-validate/i18n/dist/locale/es.json';
import { localize, setLocale } from '@vee-validate/i18n';
import { setErrorsToFields } from '@/utils/form';
import { useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import { useUserStore } from '@/store/user';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
configure({
  generateMessage: localize({ es }),
});
setLocale('es');

const router = useRouter();
const {values: loginForm, handleSubmit, setFieldError } = useForm();
const APP_NAME = import.meta.env.VITE_APP_NAME.toUpperCase();
const userStore = useUserStore();

const onSubmit = handleSubmit(() => {
  axios.post('/login', loginForm).then(response => {
    userStore.setUser(response.data);
    router.push({name: 'home'});
  }).catch(error => {
    setErrorsToFields(error.response.data.errors, setFieldError);
  });
});

</script>
