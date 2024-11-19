import type { Module } from 'vuex';
import { fetchBetHistroy } from '@/services';

interface PopUpContent {
  [key: string]: number;
}

interface State {
  showPopUp: boolean;
  popUpContent: PopUpContent;
  position: { x: number; y: number } | null;
}

const state = (): State => ({
  showPopUp: false,
  popUpContent: {},
  position: {x:0,y:0}
});

const mutations = {
  openPopUp(state: State, { content, position }: { content: PopUpContent; position: { x: number; y: number } }) {
    state.showPopUp = true;
    state.popUpContent = content;
    state.position = position;
  },
  closePopUp(state: State) {
    state.showPopUp = false;
    state.popUpContent = {};
    state.position = null;
  }
};

interface FetchAndShowPopUpPayload {
	content:{
		site: string;
		league: string;
		opponent_0: string;
		opponent_1: string;
		bet: string,
	}
  	position: {x: number, y: number}
}

const actions = {
  async fetchAndShowPopUp({ commit }: { commit: Function }, payload: FetchAndShowPopUpPayload) {
    try {
      const content = await fetchBetHistroy(payload.content);
      if(Object.keys(content).length){
        commit('openPopUp', { content, position: payload.position });
      }
    } catch (error) {
      console.error('Error fetching bet history:', error);
    }
  },
  closePopUp({ commit }: { commit: Function }) {
    commit('closePopUp');
  }
};

const getters = {
  isPopUpVisible(state: State): boolean {
    return state.showPopUp;
  },
  getPopUpContent(state: State): PopUpContent {
    return state.popUpContent;
  },
  getPopUpPosition(state: State) {
    return state.position;
  }
};

const popUpModule: Module<State, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default popUpModule;
