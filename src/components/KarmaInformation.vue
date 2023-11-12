<script setup>
  import { useKarmaStore } from '../stores/karmaStore';
  const karmaStore = useKarmaStore();
</script>

<template>
  <div class="p-2">Karma: {{ karmaStore.totalKarmaSpent }} / 750</div>
</template>
