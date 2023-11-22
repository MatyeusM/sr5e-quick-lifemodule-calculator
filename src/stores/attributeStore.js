import { defineStore } from 'pinia';

const baseMinAttributes = { body: 1, agility: 1, reaction: 1, strength: 1, willpower: 1, logic: 1, intuition: 1, charisma: 1, essence: 6, edge: 1, magic: 0, resonance: 0 };
const baseMaxAttributes = { body: 6, agility: 6, reaction: 6, strength: 6, willpower: 6, logic: 6, intuition: 6, charisma: 6, essence: 6, edge: 6, magic: 6, resonance: 6 };

const useAttributeStore = defineStore('attributes', {
  state: () => ({
    minAttributes: baseMinAttributes,
    maxAttributes: baseMaxAttributes,
    attributes: {...baseMinAttributes}, // make sure attributes and minAttributes refer to different objects
  }),
  actions: {
    increaseAttribute(name) {
      if (Object.prototype.hasOwnProperty.call(this.attributes, name) && this.attributes[name] < this.maxAttributes[name]) {
        this.attributes[name] += 1;
      }
    },
    decreaseAttribute(name) {
      if (Object.prototype.hasOwnProperty.call(this.attributes, name) && this.attributes[name] > this.minAttributes[name]) {
        this.attributes[name] -= 1;
      }
    },
    addMinAttributes(modifiers) {
      if (Array.isArray(modifiers)) {
        for (const modifier of modifiers) {
          const { name, min } = modifier;
          if (!Object.prototype.hasOwnProperty.call(this.minAttributes, name)) {
            console.error(`Attribute ${name} does not exist`);
            continue; // the attribute we try to modify does not exist
          }
          this.minAttributes[name] += min; // apply min
        }
      } else if (typeof modifiers === 'object') {
        for (const [name, min] of Object.entries(modifiers)) {
          if (!Object.prototype.hasOwnProperty.call(this.minAttributes, name)) {
            console.error(`Attribute ${name} does not exist`);
            continue; // the attribute we try to modify does not exist
          }
          this.minAttributes[name] += min; // apply min
        }
      }
    },
    removeMinAttributes(modifiers) {
      if (Array.isArray(modifiers)) {
        for (const modifier of modifiers) {
          const { name, min } = modifier;
          if (!Object.prototype.hasOwnProperty.call(this.minAttributes, name)) {
            console.error(`Attribute ${name} does not exist`);
            continue; // the attribute we try to modify does not exist
          }
          this.minAttributes[name] -= min; // apply min
        }
      } else if (typeof modifiers === 'object') {
        for (const [name, min] of Object.entries(modifiers)) {
          if (!Object.prototype.hasOwnProperty.call(this.minAttributes, name)) {
            console.error(`Attribute ${name} does not exist`);
            continue; // the attribute we try to modify does not exist
          }
          this.minAttributes[name] -= min; // apply min
        }
      }
    },
    adjustAttributesInRange(force = false) {
      // Loop through attributes and adjust if needed
      for (const [name, value] of Object.entries(this.attributes)) {
        if (force || value < this.minAttributes[name]) {
          this.attributes[name] = this.minAttributes[name];
        } else if (value > this.maxAttributes[name]) {
          this.attributes[name] = this.maxAttributes[name];
        }
      }
    },
    addMaxAttributes(modifiers) {
      if (Array.isArray(modifiers)) { // We only need to deal with max modifiers if it is an array
        for (const modifier of modifiers) {
          const { name, max } = modifier;
          if (!Object.prototype.hasOwnProperty.call(this.maxAttributes, name)) {
            console.error(`Attribute ${name} does not exist`);
            continue; // the attribute we try to modify does not exist
          }
          this.maxAttributes[name] += max; // apply min
        }
      }
    },
    removeMaxAttributes(modifiers) {
      if (Array.isArray(modifiers)) { // We only need to deal with max modifiers if it is an array
        for (const modifier of modifiers) {
          const { name, max } = modifier;
          if (!Object.prototype.hasOwnProperty.call(this.maxAttributes, name)) {
            console.error(`Attribute ${name} does not exist`);
            continue; // the attribute we try to modify does not exist
          }
          this.maxAttributes[name] -= max; // apply min
        }
      }
    },
  }
});

export default useAttributeStore;
