<script setup>
  import { computed } from 'vue';
  import useQualityStore from '../stores/qualityStore';
  
  const qualityStore = useQualityStore();

  const qualityList = computed(() => {
    const validQualities = qualityStore.getQualities;
    validQualities.sort((a, b) => a.name.localeCompare(b.name));
    return validQualities;
  });
</script>

<template>
  <div class="flex p-1">
    <div class="font-bold p-1">Qualities:</div>
    <div class="p-1">{{ qualityList.map((quality) => `${quality.name} (${Math.abs(quality.value)})`).join(', ') }}</div>
  </div>
</template>
