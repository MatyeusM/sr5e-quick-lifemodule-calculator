import { defineStore } from 'pinia';
import characterTypes from '../data/characterTypes.json';
import useAttributeStore from './attributeStore';

const useQualityStore = defineStore('qualities', {
  state: () => ({
    characterType: characterTypes[0],
    qualities: [],
  }),
  getters: {
    getQualities() {
      // Create a map to store unique qualities with the highest values
      const uniqueQualitiesMap = new Map();

      for (let i = 0; i < this.qualities.length; i += 1) {
        const quality = this.qualities[i];
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
      for (let i = 0; i < uniqueQualities.length; i += 1) {
        const uniqueQuality = uniqueQualities[i];
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
    getTypeKarma() {
      return this.characterType.cost;
    },
  },
  actions: {
    addQualities(qualitiesModifiers) {
      this.qualities.push(...qualitiesModifiers);
    },
    removeQualities(qualitiesModifiers) {
      for (let i = 0; i < qualitiesModifiers.length; i += 1) {
        const modifier = qualitiesModifiers[i];
        const index = this.qualities.findIndex(
          (q) => q.name === modifier.name && q.value === modifier.value
        );

        // Remove the first occurrence of the matching modifier
        if (index !== -1) {
          this.qualities.splice(index, 1);
        }
      }
    },
    async setCharacterType(typeName) {
      const type = characterTypes.find(ct => ct.name === typeName)
      if (type) {
        const attributeStore = useAttributeStore();

        await attributeStore.removeMinAttributes(this.characterType.minAttributes);
        this.characterType = type;
        await attributeStore.addMinAttributes(type.minAttributes);

        attributeStore.adjustAttributesInRange(true);
      }
    },
  }
});

export default useQualityStore;
