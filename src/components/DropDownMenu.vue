<template>
  <div class="relative inline-block text-left">
    <div>
      <button
        type="button"
        @click="toggleDropdown"
        :aria-expanded="isDropdownOpen.toString()"
        aria-haspopup="true"
        class="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-regular ring-1 ring-inset ring-slate-100"
        :class="[isDropdownOpen ? ((color == 'amber') ? 'bg-slate-800 text-amber-200 ring-amber-200' : 'bg-slate-800 text-emerald-300 ring-emerald-300') : ((color == 'amber') ? 'bg-slate-900 hover:bg-slate-800 text-slate-100 hover:text-amber-200 hover:ring-amber-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-100 hover:text-emerald-300 hover:ring-emerald-300')]"
      >
        <slot></slot>
        <svg
          class="-mr-1 h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 z-10 mt-2 origin-top-right w-48 bg-slate-900 ring-1 focus:outline-none"
        :class="{'ring-amber-200': color == 'amber', 'ring-emerald-300': color != 'amber'}"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="py-1" role="none">
          <a
            v-for="(option, index) in props.options"
            :key="index"
            href="#"
            @click="selectOption(option)"
            class="text-slate-100 block px-4 py-2 text-sm hover:bg-slate-800"
            :class="{'hover:text-amber-200': color == 'amber', 'hover:text-emerald-300': color != 'amber'}"
            role="menuitem"
            :tabindex="-1"  
          >
            {{ option }}
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
  import { ref, watchEffect } from 'vue';

  const isDropdownOpen = ref(false);

  function toggleDropdown(event) {
    event.stopPropagation();
    isDropdownOpen.value = !isDropdownOpen.value;
  }

  watchEffect(() => {
    if (isDropdownOpen.value) document.body.addEventListener('click', closeDropdown);
    return () => { document.body.removeEventListener('click', closeDropdown); };
  });

  function closeDropdown() {
    document.body.removeEventListener('click', closeDropdown);
    isDropdownOpen.value = false;
  }

  const props = defineProps({
    options: Array,
    color: String,
  });

  const emit = defineEmits(['selected']);

  function selectOption(option) {
    isDropdownOpen.value = false;
    emit('selected', option);
  }


  function beforeEnter(el) {
    el.style.transform = 'scaleY(0)';
  }

  function enter(el, done) {
    el.offsetHeight; // Trigger reflow
    el.style.transition = 'transform 100ms';
    el.style.transform = 'scaleY(1)';
    done();
  }

  function leave(el, done) {
    el.style.transition = 'transform 75ms';
    el.style.transform = 'scaleY(0)';
    done();
  }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
