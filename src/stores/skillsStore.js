import { defineStore } from 'pinia';
import skillGroups from '../data/skillgroups.json';
import activeskills from '../data/activeskills.json';
import { IsSkillGroup, GetSkillGroupSkills, GetSkillGroup } from '../auxiliary';

const skillArray = [];
Object.keys(activeskills).forEach((attribute) => {
  activeskills[attribute].forEach((skill) => {
    skillArray.push({ name: skill, rating: 0, attribute: attribute.toLowerCase() });
  });
});

export const useSkillStore = defineStore('skills', {
  state: () => ({
    // we actually need to track each skill changes, i do not think there is a smart way about it { name:, rating:, from: }
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
        let tmpRating = state.skills.find(s => s.name === name).rating;
        const parentSkillGroup = GetSkillGroup(name);
        return state.modifiedSkills.reduce((highest, current) => {
          if (current.name === name || current.name === parentSkillGroup) {
            return Math.max(highest, current.rating);
          }
          return highest;
        }, tmpRating);
      };
    },
  },
  actions: {
    addChoices(choiceArray) {
      choiceArray.forEach((choice) => {
        if (!Object.prototype.hasOwnProperty.call(choice, 'activeChoice')) { // no active choice found, time to add one.
          choice.activeChoice = choice.values[0];
        }
        if (choice.type == 'languages') this.addLanguages([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type == 'knowledge') this.addKnowledge([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type == 'activeskills') this.addSkills([{ name: choice.activeChoice, rating: choice.rating }]);
      });
    },
    removeChoices(choiceArray) {
      choiceArray.forEach((choice) => {
        if (!Object.prototype.hasOwnProperty.call(choice, 'activeChoice')) { // no active choice found, time to add one.
          choice.activeChoice = choice.values[0];
        }
        // parse type
        if (choice.type == 'languages') this.removeLanguages([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type == 'knowledge') this.removeKnowledge([{ name: choice.activeChoice, rating: choice.rating }]);
        if (choice.type == 'activeskills') this.removeSkills([{ name: choice.activeChoice, rating: choice.rating }]);
      });
    },
    addLanguages(langArray) {
      for (const lang of langArray) {
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
      for (const lang of langArray) {
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
      for (const know of knowArray) {
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
      for (const know of knowArray) {
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
          const skillToEdit = this.skills.find((s) => s.name == mod.name);
          if (skillToEdit != undefined) {
            skillToEdit.rating += mod.rating;
          } else if (IsSkillGroup(mod.name))  {
            skillGroups[mod.name].forEach((skill) => {
              const skillToEditGrouped = this.skills.find((s) => s.name == skill);
              if (skillToEditGrouped != undefined) {
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
          const skillToEdit = this.skills.find((s) => s.name == mod.name);
          if (skillToEdit != undefined) {
            skillToEdit.rating -= mod.rating;
          } else if (IsSkillGroup(mod.name))  {
            skillGroups[mod.name].forEach((skill) => {
              const skillToEditGrouped = this.skills.find((s) => s.name == skill);
              if (skillToEditGrouped != undefined) {
                  skillToEditGrouped.rating -= mod.rating;
              } else console.error(`Skill: ${skill} not found.`);
            });
          } else { // Need to check if it is a skill group and thus multiple skills
            console.error(`Skill: ${mod.name} not found.`);
          }
        });
      }
    },
    modifySkillDecrease(skill, rating) {
      this.modifiedSkills = this.modifiedSkills.filter(s => !(s.name === skill && s.rating === rating));
    },
    modifySkillIncrease(skill, rating) {
      const maxRating = IsSkillGroup(skill) ? 4 : 7;
      if (rating >= maxRating) return;
      this.modifiedSkills.push({ name: skill, rating: rating + 1, from: rating });
    },
  }
});
