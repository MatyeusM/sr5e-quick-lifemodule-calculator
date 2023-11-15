<script setup>
import AttributeTable from './components/AttributeTable.vue';
import EquipmentTable from './components/EquipmentTable.vue';
import KarmaInformation from './components/KarmaInformation.vue';
import LifeModuleSelector from './components/LifeModuleSelector.vue';
import TypeSelector from './components/TypeSelector.vue';
import QualityTable from './components/QualityTable.vue';
import SkillTable from './components/SkillTable.vue';

</script>

<template>
  <div class="bg-slate-800 text-slate-100 min-w-full min-h-screen">
    <div class="m-auto max-w-7xl min-h-screen bg-slate-900 p-4">
      <header>
        <h1 class="text-2xl mb-2 text-amber-200 border-b border-amber-200">SR5e Life Module Calculator</h1>
      </header>

      <main>
        <KarmaInformation />
        <TypeSelector />
        <LifeModuleSelector />
        <AttributeTable />
        <QualityTable />
        <SkillTable />
        <EquipmentTable />
      </main>
    </div>
  </div>
</template>
