<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="loading">
      <div class="ion-padding fullpage">
        <ion-spinner></ion-spinner>
        <span>در حال دریافت</span>
      </div>
    </ion-content>
    <ion-content v-else-if="error">
      <div class="ion-padding fullpage">
        <ion-icon :icon="cloudOffline"></ion-icon>
        <h1>خطا!</h1>
        <span>{{ error }}</span>
        <ion-button @click="get(true)">
          <ion-icon :icon="refresh"></ion-icon>
          تلاش دوباره
        </ion-button>
      </div>
    </ion-content>
    <ion-content v-else-if="app">
      <ion-item>
        <div class="app-root">
          <div class="title-container">
            <ion-img class="icon" :src="app.icon"></ion-img>
            <div class="title-inner">
              <ion-label style="white-space: normal;">{{ app.title }}</ion-label>
              <ion-note>{{ app.subtitle }}</ion-note>
              <ion-button v-if="!installing" size="small" shape="round" @click="install">نصب</ion-button>
              <ion-spinner v-else></ion-spinner>
            </div>
          </div>
        </div>
      </ion-item>
      <ion-list v-if="app.screenshots.length > 0">
        <ion-list-header>
          <ion-label>اسکرینشات ها</ion-label>
        </ion-list-header>
        <ion-item>
          <div style="text-align: center; padding-bottom: 0.75rem;">
            <div class="screenshots">
              <div></div>
              <div 
                class="screenshot"
                v-for="screenshot in app.screenshots"
                :style="`background-image: url('${screenshot.image}');`"
              >
                <svg :viewBox="`0 0 ${screenshot.width} ${screenshot.height}`"></svg>
              </div>
              <div style="flex-shrink: 0;width: 0.1px"></div>
            </div>
          </div>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>درباره</ion-label>
        </ion-list-header>
        <ion-item class="ion-padding" style="display: block;">
          <div>
            <p dir="auto" v-for="line in app.description.split('\n')">{{ line }}</p>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-content v-else></ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import type { MApp, MAppType } from '@/models';
import { useApplicationStore } from '@/stores/application';
import { IonList, IonListHeader, IonPage, IonHeader, IonToolbar, IonContent, IonBackButton, IonButtons, IonItem, IonImg, IonLabel, IonNote, IonButton, IonSpinner, toastController } from '@ionic/vue';
import { close, cloudOffline, refresh } from 'ionicons/icons';
import type { AxiosError } from 'axios';
import { ref, watch } from 'vue';

const applicationStore = useApplicationStore()

const app = ref<MApp>()
const loading = ref(false)
const error = ref<AxiosError>()
const installing = ref(false)

const props = defineProps<{
  item: string
}>()

async function get(refresh: boolean = false) {
  loading.value = true
  error.value = undefined
  try {
    const apps = await applicationStore.get(refresh)
    app.value = apps.find(app => app.id == parseInt(props.item))
  } catch (err) {
    error.value = err as AxiosError
  }
  loading.value = false
}

async function install($event: Event) {
  if(!app.value) return
  installing.value = true
  try {
    await applicationStore.download(app.value)
  } catch (err) {
    const toast = await toastController.create({
      message: 'در زمان ساین کردن خطایی رخ داد.',
      duration: 3000,
      position: 'top',
      icon: close
    });
    await toast.present();
  }
  installing.value = false
}

watch(() => props.item, () => {
  get()
}, { immediate: true })
</script>

<style scoped>
ion-item {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
}
.app-root {
  width: 100%;
  box-sizing: border-box;
  padding-top: 1rem;
  padding-bottom: 0.75rem;
}
ion-img.icon {
  width: 6.5rem;
  height: 6.5rem;
  border-radius: 1.5rem;
  border: 0.5px solid var(--border-color);
  overflow: hidden;
}
.title-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  justify-content: start;
  padding: 0 1rem;
}
.title-inner {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  margin-inline-start: 1rem;
}
ion-button {
  --padding-start: 1rem;
  --padding-end: 1rem
}
.screenshots { 
  width: fit-content;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  overflow: auto;
  height: max-content;
  margin-top: 0.75rem;
  gap: 0.5rem;
  padding: 0 2rem 0.5rem 2rem;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline-start: 0;
}
.screenshot {
  flex-shrink: 0;
  border-radius: 1rem;
  border: 0.5px solid var(--border-color);
  scroll-snap-align: center;
  width: 100%;
  background-size: cover;
}
.screenshot > svg {
  width: 100%;
}

.fullpage {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.fullpage > ion-icon {
  font-size: 5rem;
}
.fullpage ion-button {
  width: calc(100% - 75px);
  position: relative;
  margin-top: 1rem;
}
.fullpage ion-button ion-icon {
  position: absolute;
  inset-inline-start: 0;
}
</style>