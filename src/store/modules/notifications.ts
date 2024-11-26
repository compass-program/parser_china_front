import { type Module } from 'vuex';

interface Notification {
  text: string;
}

interface NotificationState {
  notificationsList: Notification[];
}

const state: NotificationState = {
  notificationsList: [],
};

const mutations = {
	addNotification(state: NotificationState, notification: Notification) {
    state.notificationsList.push(notification);
  },
  	removeNotification(state: NotificationState, index: number) {
    state.notificationsList.splice(index, 1);
  },
};

const actions = {
  addNotification({ commit }: { commit: Function }, notification: Notification) {
    commit('addNotification', notification);
  },
  removeNotification({ commit }: { commit: Function }, index: number) {
    commit('removeNotification', index);
  },
};

const getters = {
  notificationsList: (state: NotificationState) => state.notificationsList,
};

const notificationModule: Module<NotificationState,any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default notificationModule;
