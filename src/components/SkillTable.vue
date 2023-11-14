<script setup>
  import { computed } from 'vue';
  import { useSkillStore } from '../stores/skillsStore';
  import skillGroups from '../data/skillgroups.json';
  import DisplaySkill from './DisplaySkill.vue';
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
</script>

<template>
  <div class="flex px-1">
    <div class="font-bold p-1">Skills:</div>
    <div class="p-1">
      <template v-for="skill, idx in skillList" :key="skill.name">
        <DisplaySkill :name="skill.name" :rating="skill.rating" /><template v-if="idx+1 != skillList.length">, </template>
      </template>
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