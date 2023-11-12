<script setup>
import AttributeTable from './components/AttributeTable.vue';
import EquipmentTable from './components/EquipmentTable.vue';
import KarmaInformation from './components/KarmaInformation.vue';
import LifeModuleSelector from './components/LifeModuleSelector.vue';
import MetaTypeSelector from './components/MetaTypeSelector.vue';
import QualityTable from './components/QualityTable.vue';
import SkillTable from './components/SkillTable.vue';

</script>

<template>
  <div class="bg-slate-900 text-slate-100 min-w-full min-h-screen">
    <div class="m-auto w-2/3 p-4">
      <header>
        <h1 class="text-2xl mb-2 text-amber-200">SR5e Quick Life Module Generator</h1>
      </header>

      <main>
        <KarmaInformation />
        <MetaTypeSelector />
        <LifeModuleSelector />
        <AttributeTable />
        <QualityTable />
        <SkillTable />
        <EquipmentTable />
      </main>
    </div>
  </div>
</template>
