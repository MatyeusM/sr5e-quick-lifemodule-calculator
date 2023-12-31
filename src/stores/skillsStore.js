import { defineStore } from 'pinia';
import skillGroups from '../data/skillgroups.json';
import activeskills from '../data/activeskills.json';
import { IsSkillGroup, GetSkillGroupSkills, GetSkillGroup } from '../auxiliary';
import useAttributeStore from './attributeStore';

const skillArray = [];
Object.keys(activeskills).forEach((attribute) => {
  activeskills[attribute].forEach((skill) => {
    skillArray.push({ name: skill, rating: 0, attribute: attribute.toLowerCase() });
  });
});

const useSkillStore = defineStore('skills', {
  state: () => ({
    modifiedSkills: [],
    skills: skillArray,
    languages: [],
    knowledge: [],
  }),
  getters: {
    getRating: (state) => {
      return (name) => {
        if (IsSkillGroup(name)) {
          const groupSkillRatings = GetSkillGroupSkills(name).map((n) => state.getRating(n));
          return Math.min(...groupSkillRatings);
        }
        const tmpRating = state.skills.find(s => s.name === name).rating;
        const parentSkillGroup = GetSkillGroup(name);
        return state.modifiedSkills.reduce((highest, current) => {
            if (current.name === name || current.name === parentSkillGroup) {
              return Math.max(highest, current.rating);
            }
            return highest;
          }, tmpRating);
      };
    },
    getKarma: (state) => {
      let karma = 0;
      const processedGroups = [];
      state.modifiedSkills.forEach((modifiedSkill) => {
        const currentGroup = GetSkillGroup(modifiedSkill.name);
        const baseSkillRating = state.skills.find(s => s.name === modifiedSkill.name).rating;
        if (currentGroup !== null) {
          const skillNamesInGroup = GetSkillGroupSkills(currentGroup);
          const minModified = Math.min(...skillNamesInGroup.map(name => state.getRating(name)));
          const maxBase = Math.max(...skillNamesInGroup.map(name => state.skills.find(s => s.name === name).rating));
          // Process the group
          if (!processedGroups.includes(currentGroup)) {
            if (minModified > maxBase) {
              karma += 5 / 2 * (minModified - maxBase) * (1 + minModified + maxBase);
            }
            processedGroups.push(currentGroup);
          }
          // Process the actual skill.
          karma += (modifiedSkill.rating - minModified) * (1 + modifiedSkill.rating + minModified);
          karma += (maxBase - baseSkillRating) * (1 + maxBase + baseSkillRating);
        } else
          karma += (modifiedSkill.rating - baseSkillRating) * (1 + modifiedSkill.rating + baseSkillRating);
      });
      return karma;
    },
  },
  actions: {
    addChoices(choiceArray) {
      choiceArray.forEach((choice) => {
        if (!Object.prototype.hasOwnProperty.call(choice, 'activeChoice')) { // no active choice found, time to add one.
          // eslint-disable-next-line no-param-reassign
          [choice.activeChoice] = choice.values;
        }
        if (choice.type === 'languages') this.addLanguages([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type === 'knowledge') this.addKnowledge([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type === 'activeskills') this.addSkills([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type === 'attributes') {
          const attributeStore = useAttributeStore();
          attributeStore.addMinAttributes({ [choice.activeChoice]: choice.rating });
          attributeStore.adjustAttributesInRange();
        }
      });
    },
    removeChoices(choiceArray) {
      choiceArray.forEach((choice) => {
        if (!Object.prototype.hasOwnProperty.call(choice, 'activeChoice')) { // no active choice found, time to add one.
          // eslint-disable-next-line no-param-reassign
          [choice.activeChoice] = choice.values;
        }
        // parse type
        if (choice.type === 'languages') this.removeLanguages([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type === 'knowledge') this.removeKnowledge([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type === 'activeskills') this.removeSkills([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type === 'attributes') {
          const attributeStore = useAttributeStore();
          attributeStore.removeMinAttributes({ [choice.activeChoice]: choice.rating });
          attributeStore.adjustAttributesInRange();
        }
      });
    },
    addLanguages(langArray) {
      for (let i = 0; i < langArray.length; i += 1) {
        const lang = langArray[i];
        const existingLangIndex = this.languages.findIndex((l) => l.name === lang.name);
        if (existingLangIndex !== -1) {
          const isExistingLangString = typeof this.languages[existingLangIndex].rating === 'string';
          const isNewLangString = typeof lang.rating === 'string';
          if (!isExistingLangString && !isNewLangString)
            this.languages[existingLangIndex].rating += lang.rating;
          else if (isNewLangString)
            this.languages[existingLangIndex].rating = lang.rating;
        } else {
          this.languages.push({...lang});
        }
      }
      this.languages.sort((a, b) => a.name.localeCompare(b.name));
    },
    removeLanguages(langArray) {
      for (let i = 0; i < langArray.length; i += 1) {
        const lang = langArray[i];
        const existingLangIndex = this.languages.findIndex((l) => l.name === lang.name);
        if (existingLangIndex !== -1) {
          const isExistingLangString = typeof this.languages[existingLangIndex].rating === 'string';
          const isNewLangString = typeof lang.rating === 'string';
          if (!isExistingLangString && !isNewLangString)
            this.languages[existingLangIndex].rating -= lang.rating;
          else if (isNewLangString)
            this.languages[existingLangIndex].rating = 0
          if (this.languages[existingLangIndex].rating <= 0) {
            this.languages.splice(existingLangIndex, 1);
          }
        }
      }
    },
    addKnowledge(knowArray) {
      for (let i = 0; i < knowArray.length; i += 1) {
        const know = knowArray[i];
        const existingKnowIndex = this.knowledge.findIndex((l) => l.name === know.name);
        if (existingKnowIndex !== -1) {
          this.knowledge[existingKnowIndex].rating += know.rating;
        } else {
          this.knowledge.push({...know});
        }
      }
      this.knowledge.sort((a, b) => a.name.localeCompare(b.name));
    },
    removeKnowledge(knowArray) {
      for (let i = 0; i < knowArray.length; i += 1) {
        const know = knowArray[i];
        const existingKnowIndex = this.knowledge.findIndex((l) => l.name === know.name);
        if (existingKnowIndex !== -1) {
          this.knowledge[existingKnowIndex].rating -= know.rating;
          if (this.knowledge[existingKnowIndex].rating <= 0) {
            this.knowledge.splice(existingKnowIndex, 1);
          }
        }
      }
    },
    addSkills(skillModifiers) {
      if (Array.isArray(skillModifiers)) {
        skillModifiers.forEach((mod) => {
          const skillToEdit = this.skills.find((s) => s.name === mod.name);
          if (skillToEdit !== undefined) {
            skillToEdit.rating += mod.rating;
          } else if (IsSkillGroup(mod.name))  {
            skillGroups[mod.name].forEach((skill) => {
              const skillToEditGrouped = this.skills.find((s) => s.name === skill);
              if (skillToEditGrouped !== undefined) {
                  skillToEditGrouped.rating += mod.rating;
              } else console.error(`Skill: ${skill} not found.`);
            });
          } else { // Need to check if it is a skill group and thus multiple skills
            console.error(`Skill: ${mod.name} not found.`);
          }
        });
      }
    },
    removeSkills(skillModifiers) {
      if (Array.isArray(skillModifiers)) {
        skillModifiers.forEach((mod) => {
          const skillToEdit = this.skills.find((s) => s.name === mod.name);
          if (skillToEdit !== undefined) {
            skillToEdit.rating -= mod.rating;
          } else if (IsSkillGroup(mod.name))  {
            skillGroups[mod.name].forEach((skill) => {
              const skillToEditGrouped = this.skills.find((s) => s.name === skill);
              if (skillToEditGrouped !== undefined) {
                  skillToEditGrouped.rating -= mod.rating;
              } else console.error(`Skill: ${skill} not found.`);
            });
          } else { // Need to check if it is a skill group and thus multiple skills
            console.error(`Skill: ${mod.name} not found.`);
          }
        });
      }
    },
    modifySkillDecrease(skill) {
      const isGroup = IsSkillGroup(skill);
      if (isGroup) {
        const skillNames = GetSkillGroupSkills(skill);
        skillNames.forEach((sname) => {
          const currentSkill = this.modifiedSkills.find(s => s.name === sname);
          if (currentSkill !== undefined) {
            const minSkillRating = this.skills.find(s => s.name === sname).rating;
            currentSkill.rating -= 1;
            if (currentSkill.rating <= minSkillRating)
              this.modifiedSkills = this.modifiedSkills.filter(s => s.name !== sname);
          }
        });
      } else {
        const currentSkill = this.modifiedSkills.find(s => s.name === skill);
        if (currentSkill !== undefined) {
          const minSkillRating = this.skills.find(s => s.name === skill).rating;
          currentSkill.rating -= 1;
          if (currentSkill.rating <= minSkillRating)
            this.modifiedSkills = this.modifiedSkills.filter(s => s.name !== skill);
        }
      }
    },
    modifySkillIncrease(skill) {
      const isGroup = IsSkillGroup(skill);
      const maxRating = isGroup ? 6 : 7;
      if (isGroup) {
        const skillNames = GetSkillGroupSkills(skill);
        skillNames.forEach((sname) => {
          const currentSkill = this.modifiedSkills.find(s => s.name === sname);
          if (currentSkill === undefined) {
            const { rating } = this.skills.find(s => s.name === sname);
            if (rating < maxRating)
              this.modifiedSkills.push({ name: sname, rating: rating + 1 });
          } else if (currentSkill.rating < maxRating)
            currentSkill.rating += 1;
        });
      } else {
        const currentSkill = this.modifiedSkills.find(s => s.name === skill);
        if (currentSkill === undefined) {
          const { rating } = this.skills.find(s => s.name === skill);
          if (rating < maxRating)
            this.modifiedSkills.push({ name: skill, rating: rating + 1 });
        } else if (currentSkill.rating < maxRating)
          currentSkill.rating += 1;
      }
    },
    resetModifications() {
      this.modifiedSkills = [];
    },
  }
});

export default useSkillStore;
