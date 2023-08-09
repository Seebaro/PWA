<template>
  <ion-page>
    <ion-content>
      <div class="container ion-padding" v-if="!util.userAgent.iOS">
        <Logo class="icon-large"></Logo>
        <h1>خطا!</h1>
        <p>برای دسترسی به سایت از طریق 
          <span class="highlighted">iPhone</span>
          یا 
          <span class="highlighted">iPad</span>
          خود اقدام کنید</p>
      </div>
      <div class="container ion-padding center" v-else>
        <Logo class="icon-small"></Logo>
        <h5>برای دسترسی به سایت اپلیکیشن را به صفحه اصلی اضافه کنید</h5>
        <div class="grid">
          <div>1.</div>
          <div>روی دکمه
            <span class="highlighted">Share</span>
            در نوار پایین کلیک کنید
          </div>
          <ion-icon class="highlighted" :icon="shareOutline"></ion-icon>

          <div>2.</div>
          <div>گزینه
            <span class="highlighted">Add to Home Screen</span>
            را انتخاب کنید
          </div>
          <ion-icon class="highlighted icon-add" :icon="addOutline"></ion-icon>

          <div>3.</div>
          <div>در قسمت بالا روی
            <span class="highlighted">Add</span>
            کلیک کنید
          </div>
          <div class="highlighted">Add</div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonIcon } from '@ionic/vue';
import { shareOutline, addOutline } from 'ionicons/icons'
import util from '@/util';
import Logo from '@/assets/Logo.vue'
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
.icon-small {
  width: 5rem;
}
.highlighted {
  color: var(--ion-color-primary-tint)
}
.center {
  text-align: center;
}
.center > * {
  line-height: 1.5;
}
.grid {
  display: grid;
  width: 100%;
  padding: 1.2rem 1.2rem;
  grid-template-columns: max-content 1fr max-content;
  align-items: center;
  justify-content: center;
  row-gap: 0.8rem;
  column-gap: 0.3rem;
  font-size: 0.8rem;
  text-align: start;
  line-height: 1;
}
ion-icon {
  font-size: 1.5rem;
}
.icon-add {
  border: 1px solid currentColor; 
  border-radius: 5px; 
  scale: 0.7;
}
</style>