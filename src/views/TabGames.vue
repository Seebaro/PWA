<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>بازی ها</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="جست و جو" inputmode="search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <app-item tab="games" :app="app"></app-item>
    </ion-content>
  </ion-page>
</template>
  
<script setup lang="ts">
import AppItem from '@/components/AppItem.vue';
import { MAppType, type MApp } from '@/models';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonRefresher, IonRefresherContent } from '@ionic/vue';

const app: MApp = {
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
}

async function handleRefresh($event: CustomEvent) {
  //await 
  window.setTimeout(() => {
    ($event.target as any).complete()
  }, 3000)
  
}
</script>