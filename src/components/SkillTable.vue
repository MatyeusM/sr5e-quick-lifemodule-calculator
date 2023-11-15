<script setup>
  import { computed, ref } from 'vue';
  import { useSkillStore } from '../stores/skillsStore';
  import skillGroups from '../data/skillgroups.json';
  import DisplaySkill from './DisplaySkill.vue';
  import { GetSkillGroup } from '../auxiliary';
  const skillStore = useSkillStore();

  // const IsSkillGroup = (groupName) => Object.prototype.hasOwnProperty.call(skillGroups, groupName);

  const formatSkillRating = (rating, additional = false) => {
    var add = additional ? '+' : '';
    if (typeof rating === 'number') {
      return `${add}${rating}`;
    } else if (rating === 'Native') {
      return 'N';
    } else {
      return rating;
    }
  }


  const skillList = computed(() => {
    let validSkills = skillStore.skills
      .map((s) => ({
        name: s.name,
        rating: skillStore.getRating(s.name),
      }))
      .filter((s) => s.rating > 0);


    Object.keys(skillGroups).forEach((groupName) => {
        // find 0'th in valid skills
        const baseSkill = validSkills.find((s) => s.name == skillGroups[groupName][0]);
        if (baseSkill != undefined) { // We found a skill now we need to check the skill rating of all
          const baseRating = baseSkill.rating;
          let validSkillGroup = true;
          for (let i = 1; i < skillGroups[groupName].length && validSkillGroup; i++) {
            const currentSkill = validSkills.find((s) => s.name == skillGroups[groupName][i]);
            if (currentSkill == undefined) {
              validSkillGroup = false;
            } else if (currentSkill.rating != baseRating) {
              validSkillGroup = false;
            }
          }
          if (validSkillGroup) {
            validSkills = validSkills.filter((s) => !skillGroups[groupName].includes(s.name));
            validSkills.push({ name: groupName, rating: baseRating });
          }
        }
      });

      validSkills.sort((a, b) => a.name.localeCompare(b.name));

      return validSkills;
  });

  // array of all skill names that are neither in a skill group nor in skills that are in the skillList
  const nonModuleSkills = computed(() => skillStore.skills
    .filter((s) => !skillList.value.some((sl) => sl.name === s.name || sl.name === GetSkillGroup(s.name)))
    .map((s) => s.name)
    .sort((a, b) => a.localeCompare(b))
  );

  const showAddSkillsDialog = ref(false);
</script>

<template>
  <div class="flex px-1">
    <div @click="showAddSkillsDialog = true" class="font-bold p-1 cursor-pointer hover:text-emerald-300">Skills:</div>
    <div class="p-1">
      <template v-for="skill, idx in skillList" :key="skill.name">
        <DisplaySkill :name="skill.name" :rating="skill.rating" /><template v-if="idx+1 != skillList.length">, </template>
      </template>
    </div>
    <div v-if="showAddSkillsDialog" class="fixed w-full min-h-screen bg-black/50 top-0 left-0 z-50 flex justify-center">
      <div class="bg-slate-900 p-4 max-w-7xl mb-auto">
        <h1 class="text-2xl text-amber-200 border-b border-amber-200">Add Skills</h1>
        <div class="flex flex-wrap p-6 justify-between">
          <span v-for="skill in nonModuleSkills" :key="skill" @click="skillStore.modifySkillIncrease(skill)" class="flex-grow text-center m-1 px-4 py-2 cursor-pointer border border-slate-100 hover:border-emerald-300 hover:text-emerald-300">
            {{ skill }}
          </span>
        </div>
        <div class="flex px-6">
          <button @click="showAddSkillsDialog = false" class="hover:text-emerald-300 bg-transparent hover:bg-slate-800 py-2 px-4 rounded-bl-md border border-slate-100 hover:border-emerald-300 ml-auto mr-1">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div class="flex px-1">
    <div class="font-bold p-1">Languages:</div>
    <div class="p-1">{{ skillStore.languages.map((l) => `${l.name} ${formatSkillRating(l.rating)}`).join(', ') }}</div>
  </div>
  <div class="flex px-1">
    <div class="font-bold p-1">Knowledge:</div>
    <div class="p-1">{{ skillStore.knowledge.map((k) => `${k.name} ${k.rating}`).join(', ') }}</div>
  </div>
</template>