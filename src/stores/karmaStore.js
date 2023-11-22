import { defineStore } from 'pinia';
import useAttributeStore from './attributeStore';
import useQualityStore from './qualityStore';
import useLifeModuleStore from './lifeModules';
import useMetaTypeStore from './metaTypeStore';
import usePacksStore from './packsStore';
import useSkillStore from './skillsStore';

const useKarmaStore = defineStore('karma', {
  getters: {
    totalKarmaSpent: () => {
      let karma = 0;
      // metatype
      const { metatype } = useMetaTypeStore();
      if (metatype != null) karma += metatype.cost;
      // add life module cost
      const lifeModules = useLifeModuleStore();
      if (lifeModules.nationality !== null) karma += 15;
      if (lifeModules.formative !== null) karma += 40;
      if (lifeModules.teens !== null) karma += 50;
      if (lifeModules.furtherEducation !== null) karma += lifeModules.furtherEducation.cost;
      if (lifeModules.realLife !== null) karma += 100;
      if (lifeModules.additionalRealLife !== null || (lifeModules.additionalRealLife && lifeModules.additionalRealLife.name !== 'None')) karma += 100;
      // grab the overflow from qualities
      const { getLeftOverValue, getTypeKarma } = useQualityStore();
      karma -= getLeftOverValue; // A negative value means we need to pay to get rid of that quality
      karma += getTypeKarma;
      // add attribute cost
      const attributeStore = useAttributeStore();
      Object.entries(attributeStore.minAttributes).forEach(([key, value]) => {
        karma += (5 / 2) * (attributeStore.attributes[key] - value) * (value + 1 + attributeStore.attributes[key]);
      });
      const skillStore = useSkillStore();
      karma += skillStore.getKarma;
      const packsStore = usePacksStore();
      karma += packsStore.getTotalKarmaSpent;
      return karma;
    },
  }
});

export default useKarmaStore;
