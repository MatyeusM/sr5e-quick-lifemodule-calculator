import { defineStore } from 'pinia';

export const useQualityStore = defineStore('qualities', {
  state: () => ({
    qualities: [],
  }),
  getters: {
    getQualities() {
      // Create a map to store unique qualities with the highest values
      const uniqueQualitiesMap = new Map();

      for (const quality of this.qualities) {
        const key = quality.name;
        const existingQuality = uniqueQualitiesMap.get(key);

        // Check if the current quality has a higher absolute value
        if (!existingQuality || Math.abs(quality.value) > Math.abs(existingQuality.value)) {
          uniqueQualitiesMap.set(key, quality);
        }
      }

      // Return an array of unique qualities with the highest values
      return Array.from(uniqueQualitiesMap.values());
    },
    getLeftOverValue() {
      // Create a copy of the qualities array
      const qualitiesCopy = [...this.qualities];

      // Remove elements that are in getQualities
      const uniqueQualities = this.getQualities;
      for (const uniqueQuality of uniqueQualities) {
        const index = qualitiesCopy.findIndex(
          (q) => q.name === uniqueQuality.name && q.value === uniqueQuality.value
        );

        // Remove one occurrence of the matching quality
        if (index !== -1) {
          qualitiesCopy.splice(index, 1);
        }
      }

      // Sum over all values that are left
      const leftOverValue = qualitiesCopy.filter(q => q.name !== 'SINner').reduce((sum, quality) => sum + quality.value, 0);

      return leftOverValue;
    },
  },
  actions: {
    addQualities(qualitiesModifiers) {
      this.qualities.push(...qualitiesModifiers);
    },
    removeQualities(qualitiesModifiers) {
      for (const modifier of qualitiesModifiers) {
        const index = this.qualities.findIndex(
          (q) => q.name === modifier.name && q.value === modifier.value
        );

        // Remove the first occurrence of the matching modifier
        if (index !== -1) {
          this.qualities.splice(index, 1);
        }
      }
    },
  }
});
