<script setup>
  import { ref, computed } from 'vue';
  import useQualityStore from '../stores/qualityStore';
  import qualities from '../data/qualities.json';
  
  const qualityStore = useQualityStore();

  const qualityList = computed(() => {
    const validQualities = qualityStore.getQualities;
    validQualities.sort((a, b) => a.name.localeCompare(b.name));
    return validQualities;
  });

  const listOfAddableQualities = computed(() => {
    const addableQualities = qualities.filter((quality) => !qualityList.value.some((entry) => quality.name === entry.name));
    return addableQualities;
  });

  const listOfPositiveAddableQualities = computed(() => {
    const addableQualities = listOfAddableQualities.value.filter((quality) => quality.value > 0 || quality.cost > 0);
    return addableQualities;
  });

  const listOfNegativeAddableQualities = computed(() => {
    const addableQualities = listOfAddableQualities.value.filter((quality) => quality.value < 0 || quality.cost < 0);
    return addableQualities;
  });

  const positiveKarma = computed(() => {
    let karma = 0;
    qualityList.value.forEach((quality) => {
      if (quality.value > 0) {
        karma += quality.value;
      } else if (quality.cost > 0) {
        karma += quality.cost;
      }
    });
    return karma;
  });

  const negativeKarma = computed(() => {
    let karma = 0;
    qualityList.value.forEach((quality) => {
      if (quality.value < 0) {
        karma += quality.value;
      } else if (quality.cost < 0) {
        karma += quality.cost;
      }
    });
    return karma;
  });

  const qualityDialagOpen = ref(false);
</script>

<template>
  <div class="flex p-1">
    <div class="font-bold p-1 cursor-pointer hover:text-emerald-300" @click="qualityDialagOpen = true">Qualities:</div>
    <div class="p-1">
      <template v-for="quality, idx in qualityList" :key="quality.name">
        <span class="cursor-pointer hover:text-amber-300" @click="qualityStore.applyModification({ name: quality.name, cost: quality.value, type: 'remove' })">
          {{ quality.name }} ({{ Math.abs(quality.value !== undefined ? quality.value : quality.cost) }})
        </span>
        <template v-if="idx+1 != qualityList.length">, </template>
      </template>
    </div>
    <div v-if="qualityDialagOpen" class="fixed w-full min-h-screen bg-black/50 top-0 left-0 z-50 flex justify-center">
      <div class="w-2/3 bg-slate-900 p-4 mb-auto" style="margin-top: 5%;">
        <h1 class="text-2xl mb-2 text-amber-200 border-amber-200 border-b">Qualities</h1>
        <div class="flex">
          <div class="w-1/2 pr-2">
            <h2 class="text-lg mb-2 text-green-300">Positive Qualities ({{ positiveKarma }}/25)</h2>
            <div class="flex flex-wrap justify-between max-h-96 overflow-y-auto">
              <template v-for="quality in listOfPositiveAddableQualities" :key="quality.name">
                <span class="flex-grow text-center m-1 px-4 py-2 cursor-pointer border border-slate-100 hover:border-emerald-300 hover:text-emerald-300" @click="qualityStore.applyModification({ ...quality, type: 'add' })">
                  {{ quality.name }} ({{ quality.value !== undefined ? quality.value : quality.cost }})
                </span>
              </template>
            </div>
          </div>
          <div class="w-1/2 pl-2">
            <h2 class="text-lg mb-2 text-red-300">Negative Qualities ({{ Math.abs(negativeKarma) }}/25)</h2>
            <div class="flex flex-wrap justify-between max-h-96 overflow-y-auto">
              <template v-for="quality in listOfNegativeAddableQualities" :key="quality.name">
                <span class="flex-grow text-center m-1 px-4 py-2 cursor-pointer border border-slate-100 hover:border-emerald-300 hover:text-emerald-300" @click="qualityStore.applyModification({ ...quality, type: 'add' })">
                  {{ quality.name }} ({{ quality.value !== undefined ? quality.value : quality.cost }})
                </span>
              </template>
            </div>
          </div>
        </div>
        <div class="flex">
          <button type="button" class="hover:text-orange-300 bg-transparent hover:bg-slate-800 py-2 px-4 rounded-br-md border border-slate-100 hover:border-orange-300 ml-auto" @click="qualityDialagOpen = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
