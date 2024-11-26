import { type InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import matchColorHistory from '@/store/modules/matchsColorHistory';
import popUpModule from '@/store/modules/popUp';

import notificationModule from './modules/notifications';

export const store = createStore({
  modules: {
    matchColorHistory,
    popUpModule,
    notificationModule
  }
});

export const key: InjectionKey<Store<RootState>> = Symbol();

export interface RootState {
  matchColorHistory: MatchColorHistory;
}

export function useStore(): Store<RootState> {
  return store;
}

interface ColorHistoryItem {
  colorPanel: string[];
  color: string;
  type?: string;
  time?: string;
}

type LeagueColorHistory = Record<string, ColorHistoryItem[]>;

type MatchColorHistory = Record<string, LeagueColorHistory>;
