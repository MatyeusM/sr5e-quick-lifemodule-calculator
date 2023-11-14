<script setup>
  import { ref, computed } from 'vue';
  import { GetSkillGroup, IsSkillGroup, GetSkillGroupSkills } from '../auxiliary';
  import { useSkillStore } from '../stores/skillsStore';
  const skillStore = useSkillStore();

  const props = defineProps({
    name: String,
    rating: Number,
  });

  const IsGroup = computed(() => IsSkillGroup(props.name));
  const Group = computed(() => IsGroup.value ? props.name : GetSkillGroup(props.name));
  const GroupRating = computed(() => IsGroup.value ? props.rating : skillStore.getRating(Group.value));
  const HasGroup = computed(() => Group.value !== null);
  const OtherGroupSkills = computed(() => 
    GetSkillGroupSkills(IsGroup.value ? props.name : Group.value)
      .filter(s => s !== props.name)
      .map(s => ({ name: s, rating: skillStore.getRating(s) }))
  );
  const EnableGroup = computed(() => {
    if (!IsGroup.value && !HasGroup.value) return false;
    const firstRating = IsGroup.value ? OtherGroupSkills.value[0].rating : props.rating;
    return OtherGroupSkills.value.every(s => s.rating === firstRating);
  });

  const isDropdownOpen = ref(false);

  function handleWheel(skill, rating, event) {
    const delta = event.deltaY > 0 ? 1 : -1;
    if (IsSkillGroup(skill) && !EnableGroup.value) return;
    if (delta === 1)
      skillStore.modifySkillDecrease(skill);
    else if(delta === -1)
      skillStore.modifySkillIncrease(skill, rating);
  }
</script>

<template>
  <div v-if="isDropdownOpen" class="fixed w-full min-h-screen bg-black/50 top-0 left-0 z-40" />
  <span class="relative">
    <span @click="isDropdownOpen = true" class="hover:text-slate-300 cursor-pointer">{{ name }} {{ rating }}</span>
    <div v-if="isDropdownOpen" class="z-50 left-0 p-2 w-60 origin-top-left border border-white absolute bg-slate-900" style="margin-top: -30px;">
      <div v-if="!IsGroup" @wheel="handleWheel(name, rating, $event)" class="text-lg text-amber-200">
        {{ name }} {{ rating }}
      </div>
      <div v-if="IsGroup || HasGroup" @wheel="handleWheel(Group, GroupRating, $event)" :class="{ 'text-lg text-amber-200 border-b border-amber-200': IsGroup && EnableGroup, 'border-b border-slate-100': !IsGroup && EnableGroup, 'text-slate-400 border-b border-slate-100': !EnableGroup }">
        {{ Group }} {{ GroupRating }}
      </div>
      <div v-for="groupSkill in OtherGroupSkills" :key="groupSkill" @wheel="handleWheel(groupSkill.name, groupSkill.rating, $event)" class="pl-8">
        {{ groupSkill.name }} {{ groupSkill.rating }}
      </div>
      <div class="flex pt-4">
        <button @click="isDropdownOpen = false"  class="hover:text-emerald-300 bg-transparent hover:bg-slate-800 py-1 px-2 border border-slate-100 hover:border-emerald-300 ml-auto mr-1">
          Confirm
        </button>
      </div>
    </div>
  </span>
</template>