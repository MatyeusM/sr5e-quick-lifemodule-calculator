import { defineStore } from 'pinia';
import metaTypes from '../data/metatypes.json';
import { useAttributeStore } from './attributeStore';

export const useMetaTypeStore = defineStore('metatype', {
  state: () => ({
    metatype: null,
    setup: false,
  }),
  actions: {
    runOnce() {
      if (!this.setup) {
        this.setMetatype(metaTypes[0].name);
        this.setup = true;
      }
    },
    async setMetatype(name) {
      const attributeStore = useAttributeStore();
      // find new metatype
      const newMetaType = metaTypes.find(m => m.name === name);
      if (newMetaType == undefined) return;
      if (this.metatype !== null) { // need to remove the current attribute modifiers
        await attributeStore.removeMinAttributes(this.metatype.attributes);
        await attributeStore.removeMaxAttributes(this.metatype.attributes);
      }
      this.metatype  = newMetaType;
      await attributeStore.addMinAttributes(this.metatype.attributes);
      await attributeStore.addMaxAttributes(this.metatype.attributes);
      attributeStore.adjustAttributesInRange();
    },
  }
});
