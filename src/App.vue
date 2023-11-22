<script setup>
import AttributeTable from './components/AttributeTable.vue';
import EquipmentTable from './components/EquipmentTable.vue';
import KarmaInformation from './components/KarmaInformation.vue';
import LifeModuleSelector from './components/LifeModuleSelector.vue';
import TypeSelector from './components/TypeSelector.vue';
import QualityTable from './components/QualityTable.vue';
import SkillTable from './components/SkillTable.vue';
import SettingsDialog from './components/SettingsDialog.vue';
import version from './version';

</script>

<template>
  <div class="bg-slate-800 text-slate-100 min-w-full min-h-screen">
    <div class="m-auto max-w-7xl min-h-screen bg-slate-900 p-4">
      <header class="flex place-content-between border-b border-amber-200 text-amber-200 text-2xl mb-2">
        <h1>SR5e Life Module Calculator <span class="text-sm px-1">{{ version }}</span></h1>
        <settings-dialog class="mr-2" />
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
