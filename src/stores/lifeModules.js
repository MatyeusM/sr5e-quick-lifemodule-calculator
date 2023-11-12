import { defineStore } from 'pinia';
import nationalities from '../data/nationalities.json';
import formativeYears from '../data/formativeYears.json';
import teens from '../data/teens.json';
import realLife from '../data/realLife.json';
import { useAttributeStore } from './attributeStore';
import { useQualityStore } from './qualityStore';
import { useSkillStore } from './skillsStore';
import { cloneDeep } from '../auxiliary';

export const useLifeModuleStore = defineStore('lifeModule', {
  state: () => ({
    nationality: null,
    formative: null,
    teens: null,
    furtherEducation: null,
    realLife: null,
    additionalRealLife: null,
    setup: false,
  }),
  actions: {
    runOnce() {
      if (!this.setup) {
        this.setLifeModule("nationality", nationalities[0]);
        this.setLifeModule("formative", formativeYears[0]);
        this.setLifeModule("teens", teens[0]);
        this.setLifeModule("realLife", realLife[0]);
        this.setup = true;
      }
    },
    async setLifeModule(type, lifeModule) {
      const attributeStore = useAttributeStore();
      const skillStore = useSkillStore();
      const qualityStore = useQualityStore();
      // process type
      const oldLifeModule = this[type];
      if (oldLifeModule) {
        await attributeStore.removeMinAttributes(oldLifeModule.attributes);
        await skillStore.removeSkills(oldLifeModule.skills);
        await qualityStore.removeQualities(oldLifeModule.qualities);
        await skillStore.removeLanguages(oldLifeModule.languages);
        await skillStore.removeKnowledge(oldLifeModule.knowledge);
        await skillStore.removeChoices(oldLifeModule.choices);
      }
      // remove attrs
      this[type] = cloneDeep(lifeModule);
      // add attrs
      if (lifeModule != null) {
        await attributeStore.addMinAttributes(lifeModule.attributes);
        await skillStore.addSkills(lifeModule.skills);
        await qualityStore.addQualities(lifeModule.qualities);
        await skillStore.addLanguages(lifeModule.languages);
        await skillStore.addKnowledge(lifeModule.knowledge);
        await skillStore.addChoices(lifeModule.choices);
      }
      attributeStore.adjustAttributesInRange();
    },
  }
});
