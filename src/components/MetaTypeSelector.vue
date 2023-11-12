<script setup>
  import { useMetaTypeStore } from '../stores/metaTypeStore.js';
  import metaTypes from '../data/metatypes.json';
  import DropDown from './DropDownMenu.vue';

  const metaTypeStore = useMetaTypeStore();
  metaTypeStore.runOnce();

  function handleChange(metaTypeName) {
    metaTypeStore.setMetatype(metaTypeName);
  }
</script>

<template>
  <div class="p-2">
    <DropDown color="emerald" :options="metaTypes.map((m) => m.name)" @selected="handleChange">Metatype: {{ metaTypeStore.metatype.name }}</DropDown>
  </div>
</template>
