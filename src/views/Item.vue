<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <div class="app-root">
          <div class="title-container">
            <ion-img class="icon" :src="app.icon"></ion-img>
            <div class="title-inner">
              <ion-label style="white-space: normal;">{{ app.title }}</ion-label>
              <ion-note>{{ app.subtitle }}</ion-note>
              <ion-button v-if="!installing" size="small" shape="round">نصب</ion-button>
              <ion-spinner v-else></ion-spinner>
            </div>
          </div>
        </div>
      </ion-item>
      <ion-list>
        <ion-list-header>
          <ion-label>اسکرینشات ها</ion-label>
        </ion-list-header>
        <ion-item>
          <div style="text-align: center; padding-bottom: 0.75rem;">
            <div class="screenshots">
              <div></div>
              <img class="screenshot" v-for="screenshot in app.screenshots" :src="screenshot">
              <div style="flex-shrink: 0;width: 0.1px"></div>
            </div>
          </div>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>درباره</ion-label>
        </ion-list-header>
        <ion-item class="ion-padding">
          <p>{{ app.description }}</p>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { type MApp, MAppType } from '@/models';
import { IonList, IonListHeader, IonPage, IonHeader, IonToolbar, IonContent, IonBackButton, IonButtons, IonItem, IonImg, IonLabel, IonNote, IonButton, IonSpinner } from '@ionic/vue';
import { ref } from 'vue';

const props = defineProps<{
  item: string
}>()

const installing = ref(false)

function install($event: Event) {
  $event.stopPropagation()
  installing.value = true
  window.setTimeout(() => {
    installing.value = false
  }, 3000)
  if(!app.value) return
  const manifestEncoded = encodeURIComponent(app.value.manifest)
  window.location.href = `itms-services://?action=download-manifest&url=${manifestEncoded}`
}

const app = ref<MApp>({
  pk: 1,
  title: 'GTA: SA',
  icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/3d/0c/5e/3d0c5e6d-c7fd-2bd6-d032-c1c251dc018e/AppIcon-1x_U007emarketing-0-7-0-85-220.png/460x0w.png',
  type: MAppType.Game,
  subtitle: 'Explore San Andreas',
  description: `Five years ago, Carl Johnson escaped from the pressures of life in Los Santos, San Andreas, a city tearing itself apart with gang trouble, drugs and corruption. Where filmstars and millionaires do their best to avoid the dealers and gangbangers.


Now, it’s the early 90’s. Carl’s got to go home. His mother has been murdered, his family has fallen apart and his childhood friends are all heading towards disaster.


On his return to the neighborhood, a couple of corrupt cops frame him for homicide. CJ is forced on a journey that takes him across the entire state of San Andreas, to save his family and to take control of the streets.


Rockstar Games brings its biggest release to mobile yet with a vast open-world covering the state of San Andreas and its three major cities – Los Santos, San Fierro and Las Venturas – with enhanced visual fidelity and over 70 hours of gameplay.`,
  screenshots: ['https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/98/dc/ec/98dcec15-6fa3-599a-8879-f0e944c3c981/pr_source.png/626x0w.png', 'https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/72/aa/8d/72aa8d8b-d10e-c56f-415e-4a77ca6d6307/pr_source.png/626x0w.png', 'https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/54/05/a8/5405a8db-cac7-8f2b-7479-1dcb73e76c5d/pr_source.png/626x0w.png', 'https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/14/a8/f1/14a8f1bf-b87f-e1c8-23f3-ac115ea0edcb/pr_source.png/626x0w.png'],
  manifest: 'https://google.com',
})
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
}
</style>