<script setup>
  import { useAttributeStore } from '../stores/attributeStore.js';
  import { usePacksStore } from '../stores/packsStore.js';
  const attributeStore = useAttributeStore();
  const packsStore = usePacksStore();

  function handleWheel(attribute, event) {
    const delta = event.deltaY > 0 ? 1 : -1;
    if (delta === 1)
      attributeStore.decreaseAttribute(attribute);
    else if(delta === -1)
      attributeStore.increaseAttribute(attribute);
  }

  function roundToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
  }

  const attributeOrder = ['body', 'agility', 'reaction', 'strength', 'willpower', 'logic', 'intuition', 'charisma', 'essence', 'edge', 'magic', 'resonance'];
</script>

<template>
  <table class="table-auto mb-2">
    <thead class="uppercase">
      <tr>
        <template v-for="attribute in attributeOrder" :key="attribute">
          <th class="px-2" v-if="attributeStore.attributes[attribute] > 0">
            {{ attribute }}
          </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr>
        <template  v-for="attribute in attributeOrder" :key="attribute">
          <td class="text-center" v-if="attributeStore.attributes[attribute] > 0" @wheel="handleWheel(attribute, $event)">
            <template v-if="attribute == 'essence'">
              {{ roundToTwoDecimals(attributeStore.attributes[attribute] - packsStore.getTotalEssenceSpent) }}
            </template>
            <template v-else>{{ attributeStore.attributes[attribute] }}</template>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
