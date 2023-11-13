<script setup>
  import { computed } from 'vue';
  import { useSkillStore } from '../stores/skillsStore';
  import { GetSkillGroup } from '../auxiliary';
  import skillGroups from '../data/skillgroups.json';
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
      .map((s) => {
        let tmp = { ...s };

        // Check if Skill is in modifiedSkills
        const modifiedSkillRating = skillStore.modifiedSkills
          .filter((ms) => ms.name === s.name)
          .reduce((highest, current) => Math.max(current.rating, highest), 0);

        if (modifiedSkillRating > 0)
          tmp.rating = modifiedSkillRating;

        // Check if Skill has a skill group
        const skillGroupName = GetSkillGroup(s.name);
        if (skillGroupName) {
          // Check if skill group is in modifiedSkills
          const modifiedGroupRating = skillStore.modifiedSkills
            .filter((ms) => ms.name === skillGroupName)
            .reduce((highest, current) => Math.max(current.rating, highest), 0);

          if (modifiedGroupRating > 0)
            tmp.rating = Math.max(tmp.rating, modifiedGroupRating);
        }

        return tmp;
      })
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
        <span class="hover:text-slate-300 cursor-pointer">{{ skill.name }}</span> {{ skill.rating }}<template v-if="idx+1 != skillList.length">, </template>
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