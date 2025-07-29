<template>
  <ion-page>
    <ion-header ali>
      <ion-toolbar>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-text>
        <h1>Bienvenido nuevamente</h1>
      </ion-text>
      <Form autocomplete="on" @submit="onSubmit">
        <!-- Email -->
        <ion-row>
          <ion-col size-sm="12" size-lg="6" offset-lg="3">
            <Field name="username" rules="required" v-slot="{ field, meta, handleBlur }">
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
              <ion-text color="danger" v-if="meta.touched && meta.valid === false">
                <ErrorMessage name="username" />
              </ion-text>
            </Field>
          </ion-col>
        </ion-row>
    
        <!-- Contraseña -->
         <ion-row>
           <ion-col size-sm="12" size-lg="6" offset-lg="3">
            <Field name="password" rules="required" v-slot="{ field, meta, handleBlur }">
              <ion-item>
                <ion-label position="floating" class="ion-margin-top">Contraseña</ion-label>
                <ion-input
                  type="password"
                  v-bind="field"
                ></ion-input>
              </ion-item>
              <ErrorMessage name="password" />
            </Field>
            </ion-col>
        </ion-row>
    
        <ion-button type="submit" class="ion-margin-top">Iniciar sesión</ion-button>
      </Form>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { 
    IonButton,
    IonContent,
    IonLabel,
    IonHeader,
    IonInput,
    IonItem,
    IonText,
    IonTitle,
    IonToolbar,
    IonPage,
    IonRow,
    IonCol,
} from '@ionic/vue';
import {
  Form,
  Field,
  ErrorMessage,
  defineRule,
  configure,
} from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import es from '@vee-validate/i18n/dist/locale/es.json';
import { localize, setLocale } from '@vee-validate/i18n';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
configure({
  generateMessage: localize({ es }),
});
setLocale('es');

const onSubmit = (values) => {
  console.log('Formulario enviado:', values);
};
</script>
