<template>
  <ion-item button lines="full" :router-link="`/tabs/item/${app.id}`" :detail="false">
    <div class="app-root">
      <div class="title-container">
        <ion-img class="icon" :src="app.icon"></ion-img>
        <div class="title-inner">
          <ion-label>{{ app.title }}</ion-label>
          <ion-note>{{ app.subtitle }}</ion-note>
        </div>
        <ion-button v-if="!installing" size="small" shape="round" @click="install">نصب</ion-button>
        <ion-spinner v-else></ion-spinner>
      </div>
      <div style="text-align: center;" v-if="app.screenshots.length > 0">
        <div class="screenshots">
          <div></div>
          <div 
            class="screenshot"
            v-for="screenshot in app.screenshots"
          >
            <svg :viewBox="`0 0 ${screenshot.width} ${screenshot.height}`"></svg>
            <ion-img class="screenshot-inner" :src="screenshot.image"></ion-img>
          </div>
          <div style="flex-shrink: 0;width: 0.1px"></div>
        </div>
      </div>
      <div v-else style="height: .5rem"></div>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import type { MApp } from '@/models'
import { useApplicationStore } from '@/stores/application';

import { IonItem, IonImg, IonNote, IonLabel, IonButton, IonSpinner, toastController } from '@ionic/vue'
import { ref } from 'vue';
import { close } from 'ionicons/icons';

const props = defineProps<{
  app: MApp,
}>()

const installing = ref(false)
const applicationStore = useApplicationStore()

async function install($event: Event) {
  $event.stopPropagation()
  installing.value = true
  try {
    await applicationStore.download(props.app)
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
  padding-top: 0.5rem;
  padding-bottom: 0;
}
ion-img.icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: .75rem;
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
.title-inner > * {
  font-size: 0.75rem;
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
  height: 12.5rem;
  margin-top: 0.75rem;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline-start: 0.5rem;
}
.screenshot {
  height: 12rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 0.5px solid var(--border-color);
  scroll-snap-align: start;
  background-size: cover;
  position: relative;
}
.screenshot-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.screenshot > svg {
  height: 100%;
}

.title-inner ion-label {
  word-wrap: normal;
  white-space: normal;
}
</style>