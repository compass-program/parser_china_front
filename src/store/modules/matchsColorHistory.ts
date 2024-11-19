import { type Module } from 'vuex';

interface MatchColorHistoryItem {
  [key: string]: number;
}

type LeagueColorHistory = Record<string, MatchColorHistoryItem>;

type MatchColorHistory = Record<string, LeagueColorHistory>;

const state = (): MatchColorHistory => ({
  'IPBL Pro Division': {},
  'Rocket Basketball League': {},
  'IPBL Pro Division Women': {},
  'Rocket Basketball League Women': {},
});

const mutations = {
  setMatchColorHistory(
    state: MatchColorHistory,
    { league, key, color }: { league: string; key: string; color: string }
  ) {
    if (!state[league]) {
      state[league] = {};
    }
    if (!state[league][key]) {
      state[league][key] = {};
    }
    if (!state[league][key][color]) {
      state[league][key][color] = 0;
    }
    state[league][key][color] = ++state[league][key][color];
  },

  removeMatchColorHistory(
    state: MatchColorHistory,
    { league, key }: { league: string; key: string }
  ) {
    if (state[league] && state[league][key]) {
      delete state[league][key];
    }
  },
};

const actions = {
  setMatchColorHistory({ commit }: any, payload: any) {
    commit('setMatchColorHistory', payload);
  },

  removeMatchColorHistory({ commit }: any, payload: any) {
    commit('removeMatchColorHistory', payload);
  },
};

const getters = {
  getColorHistory:
    (state: MatchColorHistory) =>
    (league: string, key: string, color: string) => {
      if (!state[league] || !state[league][key] || !state[league][key][color]) {
        return 0;
      }
      return state[league][key][color];
    },
};

const matchColorHistoryModule: Module<MatchColorHistory, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default matchColorHistoryModule;
