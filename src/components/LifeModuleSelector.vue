<script setup>
import nationalities from '../data/nationalities.json';
import formativeYears from '../data/formativeYears.json';
import teens from '../data/teens.json';
import furtherEducation from '../data/furtherEducation.json';
import realLife from '../data/realLife.json';
import LifeModuleDialog from './LifeModuleDialog.vue';

</script>

<template>
  <div class="flex items-center p-2">
    <LifeModuleDialog :modules="nationalities" internalName="nationality" name="Nationality" />
    <span class="px-2 text-4xl text-emerald-300 mb-2">&raquo;</span>
    <LifeModuleDialog :modules="formativeYears" internalName="formative" name="Formative Years" />
    <span class="px-2 text-4xl text-emerald-300 mb-2">&raquo;</span>
    <LifeModuleDialog :modules="teens" internalName="teens" name="Teens" />
    <span class="px-2 text-4xl text-emerald-300 mb-2">&raquo;</span>
    <LifeModuleDialog :modules="furtherEducation" internalName="furtherEducation" :allowNull="true" name="Further Education" />
    <span class="px-2 text-4xl text-emerald-300 mb-2">&raquo;</span>
    <LifeModuleDialog :modules="realLife" internalName="realLife" name="Real Life" />
    <span class="px-2 text-4xl text-emerald-300 mb-2">+</span>
    <LifeModuleDialog :modules="realLife" internalName="additionalRealLife" :allowNull="true" name="Real Life" />
  </div>
</template>
