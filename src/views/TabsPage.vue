<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="apps" href="/tabs/apps">
          <ion-icon aria-hidden="true" :icon="logoAppleAppstore" />
          <ion-label>اپلیکیشن</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="games" href="/tabs/games">
          <ion-icon aria-hidden="true" :icon="gameController" />
          <ion-label>بازی</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon aria-hidden="true" :icon="cog" />
          <ion-label>تنظیمات</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { logoAppleAppstore, gameController, cog } from 'ionicons/icons';
</script>
