import { defineStore } from 'pinia';

export const usePacksStore = defineStore('packs', {
  state: () => ({
    packs: [],
  }),
  getters: {
    getTotalKarmaSpent() {
      return this.packs.reduce((sum, pack) => sum + pack.cost, 0);
    },
    getTotalEssenceSpent() {
      return this.packs.reduce((sum, pack) => sum + pack.essence, 0);
    },
    getPackNames() {
      return this.packs.map(p => p.name);
    }
  },
  actions: {
    addPack(packData) {
      const idx = this.packs.findIndex(p => p.name == packData.name);
      if (idx == -1) {
        this.packs.push(packData);
      }
    },
    removePack(name) {
      this.packs = this.packs.filter(p => p.name != name);
    },
  }
});
