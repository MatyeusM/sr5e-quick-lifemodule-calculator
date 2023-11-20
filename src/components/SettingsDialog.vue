<script setup>
  import { ref } from 'vue';
  import { useStorage } from '@vueuse/core';
  import CogIcon from 'vue-material-design-icons/Cog.vue';

  const localStoragePacks = useStorage('packs', [], localStorage);
  const settingsDialogOpen = ref(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const uploadedPacks = JSON.parse(e.target.result);

          // Assuming the uploaded data is an array of packs
          if (Array.isArray(uploadedPacks)) {
            localStoragePacks.value = uploadedPacks;
          } else {
            console.error('Invalid format for uploaded data. Please provide an array of packs.');
          }
        } catch (error) {
          console.error('Error parsing uploaded data:', error);
        }
      };
      reader.readAsText(file);
    }
  };
</script>

<template>
  <div class="hover:text-slate-100">
    <cog-icon @click="settingsDialogOpen = true" />
    <div v-if="settingsDialogOpen" class="fixed w-full min-h-screen bg-black/50 top-0 left-0 z-50 flex justify-center text-base text-slate-100">
      <div class="flex flex-col w-2/3 bg-slate-900 p-4 mb-auto" style="margin-top: 5%;">
        <h1 class="text-2xl mb-2 text-amber-200 border-amber-200 border-b">Settings</h1>
        <div class="flex flex-row">
          <p class="px-2 text-amber-200">Upload Packs (Currently: {{ localStoragePacks.length }}):</p>
          <input type="file" @change="handleFileUpload" /> 
          <button @click="localStoragePacks = [];">Remove All Packs</button>
        </div>
        <button class="hover:text-orange-300 bg-transparent hover:bg-slate-800 py-2 px-4 rounded-br-md border border-slate-100 hover:border-orange-300 ml-auto" @click="settingsDialogOpen = false;">Close</button>
      </div>
    </div>
  </div>
</template>