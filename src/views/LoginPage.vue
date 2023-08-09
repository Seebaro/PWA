<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>ورود</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form style="display: contents;" @submit="submit">
        <ion-item lines="full">
          <ion-label class="input-label" position="floating">نام کاربری</ion-label>
          <ion-input v-model="username" @keyup="error = undefined" required type="text" autocomplete="off" autocorrect="off" autocapitalize="off"></ion-input>
        </ion-item>
        <ion-item lines="full">
          <ion-label class="input-label" position="floating">رمز عبور</ion-label>
          <ion-input v-model="password" @keyup="error = undefined" required type="password"></ion-input>
        </ion-item>
        <div class="spacer"></div>
        <div v-if="error">{{ error }}</div>
        <div class="spacer"></div>
        <ion-button v-if="!loading" type="submit" expand="block" size="default">
          ورود
        </ion-button>
        <ion-spinner v-else></ion-spinner>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonSpinner } from '@ionic/vue';
import { AxiosError } from 'axios';
import { ref } from 'vue';

const userStore = useUserStore()

const loading = ref(false)
const error = ref<AxiosError>()

const username = ref('')
const password = ref('')

async function submit($event: Event) {
  if (loading.value) return
  $event.preventDefault()
  error.value = undefined
  loading.value = true
  try {
    await userStore.login(username.value, password.value)
  } catch (err) {
    error.value = err as AxiosError
  }
  loading.value = false
}
</script>

<style scoped>
ion-input {
  direction: ltr;
}
.spacer {
  height: 1.5rem;
}
ion-spinner {
  margin: .5rem auto;
  display: block;
}
</style>