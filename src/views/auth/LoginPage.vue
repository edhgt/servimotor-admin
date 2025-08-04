<template>
  <ion-page>
    <ion-content>
      <ion-row>
        <ion-col size-md="6" offset-md="3" size="12" class="ion-padding">
          <ion-thumbnail class="thumbnail-center">
            <img src="/public/logo.jpg" alt="Ionic logo ion-text-rounded" loading="lazy">
          </ion-thumbnail>
        </ion-col>
        <ion-col size-md="6" offset-md="3" size="12">
          <ion-card>
            <ion-card-header class="ion-text-center">
              <ion-card-title> Bienvenido a {{ APP_NAME }} </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form autocomplete="on" @submit.prevent="onSubmit">
                <ion-list>
                  <ion-item>
                    <Field name="username" rules="required" label="usuario" v-slot="{ field }">
                      <ion-input label-placement="stacked" autocomplete="username" :autofocus="true" type="text" v-bind="field" label="Usuario">
                        <ion-icon slot="start" :icon="personOutline" aria-hidden="true"></ion-icon>
                      </ion-input>
                    </Field>
                  </ion-item>
                  <ErrorMessage name="username" />
                  <ion-item>
                    <Field name="password" rules="required" label="contraseña" v-slot="{ field }">
                      <ion-input label-placement="stacked" type="password" v-bind="field" label="Contraseña">
                        <ion-icon slot="start" :icon="lockClosedOutline" aria-hidden="true"></ion-icon>
                        <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                      </ion-input>
                    </Field>
                  </ion-item>
                  <ErrorMessage name="password" />
                  <ion-button type="submit" class="ion-padding-top" shape="round" color="primary"> Iniciar sesión </ion-button>
                </ion-list>
              </form>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCol,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonThumbnail,
} from '@ionic/vue';
import { personOutline, lockClosedOutline } from 'ionicons/icons';
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
const { values: loginForm, handleSubmit, setFieldError } = useForm();
const APP_NAME = import.meta.env.VITE_APP_NAME;
const userStore = useUserStore();

const onSubmit = handleSubmit(() => {
  axios.post('../login', loginForm).then(response => {
    userStore.setUser(response.data);
    router.push({ name: 'home' });
  }).catch(error => {
    setErrorsToFields(error.response.data.errors, setFieldError);
  });
});

</script>

<style>
  .thumbnail-center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto; /* centra horizontalmente */
    width: 120px; /* opcional: puedes ajustar al tamaño deseado */
    height: 120px; /* opcional */
  }
  .thumbnail-center img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 14px;
  }
</style>
