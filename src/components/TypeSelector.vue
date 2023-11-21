<script setup>
  import { useMetaTypeStore } from '../stores/metaTypeStore.js';
  import { useQualityStore } from '../stores/qualityStore';
  import metaTypes from '../data/metatypes.json';
  import characterTypes from '../data/characterTypes.json';
  import DropDown from './DropDownMenu.vue';

  const metaTypeStore = useMetaTypeStore();
  metaTypeStore.runOnce();
  const qualityStore = useQualityStore();

  function changeType(characterTypeName) {
    qualityStore.setCharacterType(characterTypeName);
  }

  function handleChange(metaTypeName) {
    metaTypeStore.setMetatype(metaTypeName);
  }
</script>

<template>
  <div class="py-2 flex">
    <div class="px-2">
      <DropDown color="emerald" :options="characterTypes.map((c) => c.name)" @selected="changeType">{{ qualityStore.characterType.name }}</DropDown>
    </div>
    <div class="px-2">
      <DropDown color="emerald" :options="metaTypes.map((m) => m.name)" @selected="handleChange">{{ metaTypeStore.metatype.name }}</DropDown>
    </div>
  </div>
</template>
