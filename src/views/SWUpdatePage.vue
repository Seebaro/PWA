<template>
  <ion-page>
    <ion-content>
      <div class="container ion-padding">
        <Logo class="icon-large"></Logo>
        <h1>آپدیت جدید</h1>
        <p>برای ادامه استفاده از اپ آن را به روز رسانی کنید</p>
        <ion-button @click="$emit('update')" expand="block">به روز رسانی</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue';
import Logo from '@/assets/Logo.vue';

const emits = defineEmits(['update'])
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  height: 100svh;
}
.icon-large {
  width: 8rem;
}
ion-button {
  width: calc(100% - 75px);
  margin-top: 2rem;
}
</style>