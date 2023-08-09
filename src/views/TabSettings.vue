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
          <ion-label slot="end">{{ userStore.username }}</ion-label>
        </ion-item>
        <ion-item button :detailIcon="logOut" @click="logoutOpen = true">
          <ion-alert
            header="از خروج اطمینان دارید؟"
            :buttons="alertButtons"
            :is-open="logoutOpen"
            @didDismiss="logoutOpen = false"
          ></ion-alert>
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonNote, IonAlert, modalController, AlertButton, toastController } from '@ionic/vue';
import SubmitAppModal from '@/components/SubmitAppModal.vue'
import { logOut, checkmark, close } from 'ionicons/icons'
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { AxiosError } from 'axios';
import { useApplicationStore } from '@/stores/application';

const userStore = useUserStore()
const applicationStore = useApplicationStore()

const alertButtons: AlertButton[] = [
  {
    text: 'نه',
    role: 'cancel',
    handler: () => {},
  },
  {
    text: 'بله',
    role: 'destructive',
    handler: () => {
      userStore.logout()
    },
  },
];

const logoutOpen = ref(false)

async function submitApp() {
  const modal = await modalController.create({
    component: SubmitAppModal,
  })
  modal.present()
  const { data, role } = await modal.onWillDismiss()
  if (role === 'confirm') {
    const dataTyped = data as {name: string, link?: string, desc?: string}
    try {
      await applicationStore.suggest(dataTyped.name, dataTyped.link, dataTyped.desc)
      const toast = await toastController.create({
        message: 'ارسال شد!',
        duration: 1500,
        position: 'top',
        icon: checkmark
      });
      await toast.present();
    } catch (err) {
      const error = err as AxiosError
      const toast = await toastController.create({
        message: 'خطا در ارسال پیشنهاد، لطفا مجددا تلاش کنید.',
        duration: 3000,
        position: 'top',
        icon: close
      });
      await toast.present();
    }
  }
}
</script>
