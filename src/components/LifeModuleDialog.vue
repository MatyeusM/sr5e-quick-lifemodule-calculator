<script setup>
  import { ref, computed, watch } from 'vue'
  import { useLifeModuleStore } from '../stores/lifeModules';
  import { cloneDeep } from '../auxiliary';
  import DropDownMenu from './DropDownMenu.vue';

  const lifeModuleStore = useLifeModuleStore();
  lifeModuleStore.runOnce();

  const props = defineProps({
    name: {
      type: String,
      default: 'Nationality',
    },
    internalName: {
      type: String,
      default: 'nationality',
    },
    modules: {
      type: Array,
      default: () => []
    },
    allowNull: {
      type: Boolean,
      default: false,
    },
  });

  const formatAttribute = (key, value) => `${key.charAt(0).toUpperCase() + key.slice(1)} +${value}`;
  const formatQuality = (key, value) => `${key} (${Math.abs(value)})`;
  const formatSkillRating = (rating, additional = false) => {
    const plusSign = additional ? '+' : '';
    if (typeof rating === 'number') return `${plusSign}${rating}`; 
    if (rating === 'Native') return 'N';
    return rating;
  }
  const formatSkill = (key, value, additional = false) => `${key} ${formatSkillRating(value, additional)}`;


  const dialogOpen = ref(false);
  // eslint-disable-next-line vue/no-setup-props-destructure
  const currentModule = ref(cloneDeep(lifeModuleStore[props.internalName]));
  
  function setLifeModule() {
    dialogOpen.value = false;
    if (currentModule.value != null) {
      currentModule.value.choices.forEach((choice) => {
        if (!Object.prototype.hasOwnProperty.call(choice, 'activeChoice')) {
          // eslint-disable-next-line no-param-reassign
          [choice.activeChoice] = choice.values;
        }
      });
    }
    lifeModuleStore.setLifeModule(props.internalName, currentModule.value);
  }

  watch(() => lifeModuleStore[props.internalName], (newModule) => {
    if (newModule != null) {
      currentModule.value = cloneDeep(newModule);
    }
  });

  const selectedModuleName = computed(() => (lifeModuleStore[props.internalName] == null) ? '+' : lifeModuleStore[props.internalName].name);
  const currentModuleName = computed(() => (currentModule.value == null) ? '' : currentModule.value.name);
  const currentModuleChoices = computed(() => (currentModule.value == null) ? [] : currentModule.value.choices);
</script>

<template>
  <button type="button" class="hover:text-emerald-300 bg-transparent hover:bg-slate-800 py-2 px-4 rounded-tl-md rounded-br-md border border-slate-100 hover:border-emerald-300" @click="dialogOpen = true;">
    {{ selectedModuleName }}
  </button>
  <div v-if="dialogOpen" class="fixed w-full min-h-screen bg-black/50 top-0 left-0 z-50 flex justify-center">
    <div class="w-2/3 bg-slate-900 p-4 mb-auto" style="margin-top: 5%;">
      <h1 class="text-2xl mb-2 text-amber-200 border-amber-200 border-b">{{ name }}</h1>
      <div class="flex mt-1 p-1">
        <div class="w-1/3 min-w-1/3 mr-3 overflow-auto" style="max-height: 50vh;">
          <div
            v-if="allowNull"
            class="text-center p-1 cursor-pointer border hover:bg-slate-800"
            :class="{ 'text-amber-200 border-amber-200': currentModule == null, 'border-transparent': currentModule != null }"
            @click="currentModule = null"
          >
            None
          </div>
          <div 
            v-for="module in modules" 
            :key="module.name" 
            class="text-center p-1 cursor-pointer border hover:bg-slate-800"
            :class="{ 'text-amber-200 border-amber-200': currentModuleName == module.name, 'border-transparent': currentModuleName != module.name }"
            @click="currentModule = cloneDeep(module)"
          >
            {{ module.name }}
          </div>
        </div>
        <div class="grow" style="max-width: 66%;">
          <div v-if="currentModule != null" class="border-slate-100 border p-2 mb-1">
            <h1 class="uppercase mb-1 text-amber-200">General Information</h1>
            <div><i>Attributes:</i>&nbsp;
              <template v-for="key, index in Object.keys(currentModule.attributes)" :key="key">
                {{ formatAttribute(key, currentModule.attributes[key]) }}<template v-if="index !== Object.keys(currentModule.attributes).length - 1">, </template>
              </template>
            </div>
            <div><i>Qualities:</i>&nbsp;
              <template v-for="value, index in currentModule.qualities" :key="value.name">
                {{ formatQuality(value.name, value.value) }}<template v-if="index !== currentModule.qualities.length - 1">, </template>
              </template>
            </div>
            <div><i>Skills:</i>&nbsp;
              <template v-for="value, index in currentModule.skills" :key="value.name">
                {{ formatSkill(value.name, value.rating, true) }}<template v-if="index !== currentModule.skills.length - 1">, </template>
              </template>
            </div>
            <div><i>Languages:</i>&nbsp;
              <template v-for="value, index in currentModule.languages" :key="value.name">
                {{ formatSkill(value.name, value.rating, true) }}<template v-if="index !== currentModule.languages.length - 1">, </template>
              </template>
            </div>
            <div><i>Knowledge Skills:</i>&nbsp;
              <template v-for="value, index in currentModule.knowledge" :key="value.name">
                {{ formatSkill(value.name, value.rating, true) }}<template v-if="index !== currentModule.knowledge.length - 1">, </template>
              </template>
            </div>
          </div>
          <div class="border-slate-100 border p-2 mb-1" v-for="choice, index in currentModuleChoices" :key="`choice-${index}`">
            <h1 class="uppercase mb-1 text-amber-200">Choice #{{ index+1 }}</h1>
            <div v-if="choice.type == 'languages'">
              <i>Languages:</i>&nbsp;
              <DropDownMenu color="amber" :options="choice.values" @selected="(value) => choice.activeChoice = value">
                {{formatSkill(choice.activeChoice || choice.values[0], choice.rating, true)}}
              </DropDownMenu>
            </div>
            <div v-if="choice.type == 'activeskills'">
              <i>Skills:</i>&nbsp;
              <DropDownMenu color="amber" :options="choice.values" @selected="(value) => choice.activeChoice = value">
                {{formatSkill(choice.activeChoice || choice.values[0], choice.rating, true)}}
              </DropDownMenu>
            </div>
          </div>
        </div>
      </div>

      <div class="flex">
        <button type="button" class="hover:text-emerald-300 bg-transparent hover:bg-slate-800 py-2 px-4 rounded-bl-md border border-slate-100 hover:border-emerald-300 ml-auto mr-1" @click="setLifeModule">Confirm</button>
        <button type="button" class="hover:text-orange-300 bg-transparent hover:bg-slate-800 py-2 px-4 rounded-br-md border border-slate-100 hover:border-orange-300" @click="dialogOpen = false">Cancel</button>
      </div>
    </div>
  </div>
</template>
