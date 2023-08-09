<template>
  <form style="display: contents;" @submit="confirm">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button type="button" color="medium" @click="cancel">بیخیال</ion-button>
        </ion-buttons>
        <ion-title>درخواست اپلیکیشن</ion-title>
        <ion-buttons slot="end">
          <ion-button type="submit" strong>ارسال</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input required label-placement="floating" label="نام اپلیکیشن" v-model="name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label-placement="floating" label="لینک" v-model="link"></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea label="توضیحات" labelPlacement="floating" v-model="desc"></ion-textarea>
      </ion-item>
    </ion-content>
  </form>
</template>

<script setup lang="ts">
import { IonTextarea, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonInput, modalController } from '@ionic/vue'
import { ref } from 'vue';

const name = ref('')
const link = ref('')
const desc = ref('')

function confirm($event: Event) {
  $event.preventDefault()
  modalController.dismiss({ name: name.value, link: link.value, desc: desc.value }, 'confirm')
}

function cancel() {
  modalController.dismiss(undefined, 'cancel')
}
</script>

<style scoped>
ion-textarea {
  height: 10rem;
}

ion-item {
  --background: transparent;
}
</style>