<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ type === 'game' ? 'بازی ها' : 'اپلیکیشن ها' }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar :disabled="loading" :debounce="500" v-model="searchQuery" @ionInput="search" placeholder="جست و جو" inputmode="search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
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
</style>
  
<script setup lang="ts">
import AppItem from '@/components/AppItem.vue';
import { MAppType, MApp } from '@/models';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonRefresher, IonRefresherContent, IonIcon, IonSpinner, IonButton } from '@ionic/vue';
import { close, cloudOffline, refresh } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useApplicationStore } from '@/stores/application'
import type { AxiosError } from 'axios';
import ContentPlaceholder from '@/assets/ContentPlaceholder.vue'

const searchQuery = ref('')

const items = ref<MApp[]>()
const itemsFiltered = ref<MApp[]>()
const loading = ref(false)
const error = ref<AxiosError>()

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
    items.value = allItems.filter(x => x.type === props.type)
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

onMounted(() => {
  get()
})
</script>