<script setup>
  import { ref, computed } from 'vue';
  import { useStorage } from '@vueuse/core';
  import { usePacksStore } from '../stores/packsStore';
  import dataPacks from '../data/packs.json';

  const packsDialagOpen = ref(false);

  const categories = ['Core', 'Weapon and Ammo', 'Armor', 'Cyber', 'Lifestyle', 'Color', 'Vehicle', 'Decker', 'Drone', 'Magic'];
  const selectedCategory = ref(categories[0]);
  
  const packsStore = usePacksStore();

  const localStoragePacks = useStorage('packs', [], localStorage);
  const packs = computed(() => {
    return [...dataPacks, ...localStoragePacks.value];
  });
  </script>

<template>
  <div class="flex px-1" v-if="!packsStore.packs.every(p => p.augments.length === 0)">
    <div class="font-bold p-1">Augmentations:</div>
    <div class="p-1">{{ packsStore.packs.map(p => p.augments.join(', ')).filter(s => s != '').join(', ') }}</div>
  </div>
  <div class="flex px-1" v-if="!packsStore.packs.every(p => p.vehicles.length === 0)">
    <div class="font-bold p-1">Vehicles:</div>
    <div class="p-1">{{ packsStore.packs.map(p => p.vehicles.join(', ')).filter(s => s != '').join(', ') }}</div>
  </div>
  <div class="flex px-1" v-if="!packsStore.packs.every(p => p.items.length === 0)">
    <div class="font-bold p-1">Gear:</div>
    <div class="p-1">{{ packsStore.packs.map(p => p.items.join(', ')).filter(s => s != '').join(', ') }}</div>
  </div>
  <div class="flex px-1">
    <div class="font-bold p-1 cursor-pointer hover:text-emerald-300" @click="packsDialagOpen = true">Packs:</div>
    <div class="p-1">
      <template v-for="pack, idx in packsStore.packs" :key="`${pack.name}-remove`">
        <span class="cursor-pointer hover:text-amber-300" @click="() => packsStore.removePack(pack.name)">{{ pack.name }}</span><template v-if="idx+1 != packsStore.packs.length">,&nbsp;</template>
      </template>
    </div>
  </div>
  <div v-if="packsDialagOpen" class="fixed w-full min-h-screen bg-black/50 top-0 left-0 z-50 flex justify-center">
    <div class="w-2/3 bg-slate-900 p-4 mb-auto" style="margin-top: 5%;">
      <h1 class="text-2xl mb-2 text-amber-200 border-amber-200 border-b">Packs ({{ packsStore.getTotalKarmaSpent }} Karma)</h1>
      <div class="flex mt-1 p-1">
        <div class="w-1/3 min-w-1/3 mr-3 overflow-auto">
          <div 
            v-for="cat in categories" 
            :key="cat" 
            class="text-center p-1 cursor-pointer border hover:bg-slate-800"
            :class="{ 'text-amber-200 border-amber-200': cat == selectedCategory, 'border-transparent': cat != selectedCategory }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </div>
        </div>
        <div class="grow overflow-auto" style="max-height: 50vh; max-width: 66%;">
          <div
            v-for="pack in packs.filter(p => p.category == selectedCategory && !packsStore.getPackNames.includes(p.name))"
            class="border-slate-100 border p-2 mb-2"
            :key="pack.name">
            <h1 class="uppercase mb-1 text-amber-200 flex">
              <span>{{ pack.name }} PACK</span>
              <button type="button" class="ml-auto px-2 hover:text-amber-100" @click="() => packsStore.addPack(pack)">Add ({{ pack.cost }} Karma)</button>
            </h1>
            <p v-if="pack.items.length > 0">{{ pack.items.join(', ') }}</p>
            <p v-if="pack.augments.length > 0">{{ pack.augments.join(', ') }}</p>
            <p v-if="pack.vehicles.length > 0">{{ pack.vehicles.join(', ') }}</p>
          </div>
        </div>
      </div>
      <div class="flex">
        <button type="button" class="hover:text-orange-300 bg-transparent hover:bg-slate-800 py-2 px-4 rounded-br-md border border-slate-100 hover:border-orange-300 ml-auto" @click="packsDialagOpen = false">Close</button>
      </div>
    </div>
  </div>
</template>