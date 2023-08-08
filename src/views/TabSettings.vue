<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>تنظیمات</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">تنظیمات</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-list-header>
          <ion-label>حساب کاربری</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-note>نام کاربری</ion-note>
          <ion-label slot="end">ebrahimth</ion-label>
        </ion-item>
        <ion-item button :detailIcon="logOut" @click="logout">
          <ion-label color="danger">
            خروج از حساب
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>عملیات</ion-label>
        </ion-list-header>
        <ion-item button @click="submitApp">
          <ion-label color="primary">
            درخواست اپلیکیشن
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonNote, IonIcon, modalController } from '@ionic/vue';
import SubmitAppModal from '@/components/SubmitAppModal.vue'
import { logOut } from 'ionicons/icons'

function logout() {
  console.log('logout')
}

async function submitApp() {
  const modal = await modalController.create({
    component: SubmitAppModal,
  })
  modal.present()
  const { data, role } = await modal.onWillDismiss()
  console.log(data, role)
}
</script>
