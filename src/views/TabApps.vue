<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>اپلیکیشن ها</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="جست و جو" inputmode="search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonRefresher, IonRefresherContent } from '@ionic/vue';

async function handleRefresh($event: CustomEvent) {
  //await 
  window.setTimeout(() => {
    ($event.target as any).complete()
  }, 3000)
  
}
</script>