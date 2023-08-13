<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-select interface="popover" v-model="sort">
            <ion-select-option value="new">جدید</ion-select-option>
            <ion-select-option value="old">قدیمی</ion-select-option>
            <ion-select-option value="update">آپدیت</ion-select-option>
            <ion-select-option value="a-z">الفبا</ion-select-option>
          </ion-select>
        </ion-buttons>
        <ion-title @click="content?.$el.scrollToTop(200)">{{ type === 'game' ? 'بازی ها' : 'اپلیکیشن ها' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="submitApp()">درخواست</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar :disabled="loading" v-model="searchQuery" @ionInput="search" placeholder="جست و جو" inputmode="search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content ref="content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div class="ion-padding fullpage" v-if="loading">
        <ion-spinner></ion-spinner>
        <span>در حال دریافت</span>
      </div>
      <div class="ion-padding fullpage" v-else-if="error">
        <ion-icon :icon="cloudOffline"></ion-icon>
        <h1>خطا!</h1>
        <span>{{ error }}</span>
        <ion-button @click="get(true)">
          <ion-icon :icon="refresh"></ion-icon>
          تلاش دوباره
        </ion-button>
      </div>
      <div style="display: content;" v-else-if="items && items.length > 0">
        <app-item v-for="item in itemsFiltered" :app="item"></app-item>
      </div>
      <div class="ion-padding fullpage" v-else>
        <ContentPlaceholder style="max-width: calc(100%-50px);"></ContentPlaceholder>
        <span>هنوز اپلیکیشنی در این قسمت آپلود نشده</span>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
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

ion-select {
  color: var(--ion-color-primary);
  --color: var(--ion-color-primary);
  --fill: var(--ion-color-primary);
  padding-inline-start: 0.4rem;
}
ion-select::part(icon) {
  color: var(--ion-color-primary);
}
</style>
  
<script setup lang="ts">
import AppItem from '@/components/AppItem.vue';
import SubmitAppModal from '@/components/SubmitAppModal.vue'
import { MAppType, MApp } from '@/models';
import { IonButtons, IonSelect, IonSelectOption, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonRefresher, IonRefresherContent, IonIcon, IonSpinner, IonButton, toastController, modalController } from '@ionic/vue';
import { checkmark, close, cloudOffline, refresh } from 'ionicons/icons';
import { onMounted, ref, watch } from 'vue';
import { useApplicationStore } from '@/stores/application'
import type { AxiosError } from 'axios';
import ContentPlaceholder from '@/assets/ContentPlaceholder.vue'

const searchQuery = ref('')
const sort = ref<'new' | 'old' | 'update' | 'a-z'>('new')

const items = ref<MApp[]>()
const itemsFiltered = ref<MApp[]>()
const loading = ref(false)
const error = ref<AxiosError>()

const content = ref<InstanceType<typeof IonContent>>()

const props = defineProps<{
  type: MAppType
}>()

const applicationStore = useApplicationStore()

async function get(refresh: boolean = false) {
  if (loading.value) return
  loading.value = true
  error.value = undefined
  searchQuery.value = ''
  try {
    const allItems = await applicationStore.get(refresh)
    items.value = allItems.filter(x => x.type === props.type).sort((x, y) => {
      switch (sort.value) {
      case 'new':
        return (new Date(y.created_at)).getTime() - (new Date(x.created_at)).getTime()
      case 'old':
        return (new Date(x.created_at)).getTime() - (new Date(y.created_at)).getTime()
      case 'update':
        return (new Date(y.updated_at)).getTime() - (new Date(x.updated_at)).getTime()
      case 'a-z':
        return x.title == y.title ? 0 : (x.title > y.title ? 1 : -1)
      }
    })
    itemsFiltered.value = items.value
  } catch (err) {
    error.value = err as AxiosError
  }
  loading.value = false
}

function search() {
  if(!items.value) {
    itemsFiltered.value = []
    return
  }
  const query = searchQuery.value.split(' ').filter(x => x.trim().length > 0)
  if(query.length == 0) {
    itemsFiltered.value = items.value
    return
  }
  itemsFiltered.value = items.value.map(x => {
    return {
      value: x,
      score: query.map(y => (x.title.toLowerCase().includes(y.toLowerCase()) ? 1 : 0) + 0).reduce((a, b) => a + b, 0)
    }
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.value)
}

async function handleRefresh($event: CustomEvent) {
  await get(true)
  const target = $event.target as any
  target.complete()
}

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

watch(() => sort.value, sort => {
  get()
})

onMounted(() => {
  get()
})
</script>