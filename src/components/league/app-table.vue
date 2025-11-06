<template>
  <div class="match-wrp">
    <div class="match-title">
      <div class="match-title--participants">
        {{ props.opponents }}
      </div>
      <div class="match-title--score">
        {{ props.match[0].score_game }}
      </div>
      <!-- <div class="match-title--counter">
        <div class="count" v-for="(color, idx) in colors" :key="'color' + idx">
          <div :style="'background-color: ' + color"></div>
          {{ getColorHistory(props.name, props.opponents, color) }}
        </div>
      </div> -->
    </div>

    <div class="table-wrp">
      <!-- ОСНОВНОЙ РЕЖИМ: две отдельные таблицы -->
      <div v-if="!collapse" class="tables-2col">
        <!-- AKTY -->
        <div class="table" v-if="aktyMatches.length">
            <div class="table-title">akty.com</div>
            <template v-for="(item, index) in aktyMatches" :key="'akty' + index">
            <app-row :item="item" :prev-item="aktyMatches[index+1]" :name="name" :opponents="props.opponents" />
            </template>
        </div>

        <!-- FB -->
        <div class="table table-fb" v-if="fbMatches.length">
            <div class="table-title">fb.com</div>
            <template v-for="(item, index) in fbMatches" :key="'fb' + index">
            <app-row :item="item" :prev-item="fbMatches[index+1]" :name="name" :opponents="props.opponents" />
            </template>
        </div>
      </div>

      <!-- РЕЖИМ ИСТОРИИ: тоже две отдельные таблицы -->
      <div v-else class="tables-2col">
        <!-- AKTY HISTORY -->
        <div class="table" v-if="aktyHistory.length">
            <div class="table-title">akty.com — история</div>
            <template v-for="(color, idx) in aktyHistory" :key="'akty-h' + idx">
            <template v-for="(item, key) in color" :key="'akty-h-item' + key">
                <div
                class="table-row--collapse"
                v-if="key !== 'server_time' && key !== 'total_point' && key !== 'handicap_point_0' && key != 'handicap_point_1' && key !== 'site' && getColor(item)"
                >
                <div class="table-row--item">{{ getKey(key as string, color) }}</div>
                <div class="table-row--item" :style="{ backgroundColor: getColor(item) }">{{ item }}</div>
                <div class="table-row--item time">{{ color.server_time }}</div>
                </div>
            </template>
            </template>
        </div>

        <!-- FB HISTORY -->
        <div class="table table-fb" v-if="fbHistory.length">
            <div class="table-title">fb.com — история</div>
            <template v-for="(color, idx) in fbHistory" :key="'fb-h' + idx">
            <template v-for="(item, key) in color" :key="'fb-h-item' + key">
                <div
                class="table-row--collapse gray"
                v-if="key !== 'server_time' && key !== 'total_point' && key !== 'handicap_point_0' && key != 'handicap_point_1' && key !== 'site' && getColor(item)"
                >
                <div class="table-row--item">{{ getKey(key as string, color) }}</div>
                <div class="table-row--item" :style="{ backgroundColor: getColor(item) }">{{ item }}</div>
                <div class="table-row--item time">{{ color.server_time }}</div>
                </div>
            </template>
            </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import appRow from '@/components/table/app-row.vue'
import { useStore } from 'vuex'
import { computed, ref, toRefs, watch } from 'vue'
import type { LeagueData, RateData } from '@/interfaces';
import { fetchColorHistory } from '@/services';
import { getColor } from '@/services/socketIo';

interface PropsTable {
  name: string,
  opponents: string,
  collapse: boolean,
  match: LeagueData[],
  refresh: boolean
}
const props = defineProps<PropsTable>()
const { name, collapse } = toRefs(props)

const colors = ['#FAFF00', '#FF8A00', '#FF0000', '#9E00FF']

const opponent_0 = ref(props.match[0].opponent_0)
const opponent_1 = ref(props.match[0].opponent_1)

const colorHistory = ref<RateData[]>([])
const aktyHistory = computed(() => colorHistory.value.filter(i => i.site === 'akty.com'))
const fbHistory   = computed(() => colorHistory.value.filter(i => i.site === 'fb.com'))

watch(() => props.refresh, async (newValue, oldValue) => {
  if (newValue !== oldValue && props.collapse) {
    Promise.allSettled([
      fetchColorHistory('fb.com', props.name, opponent_0.value as string, opponent_1.value as string),
      fetchColorHistory('akty.com', props.name, opponent_0.value as string, opponent_1.value as string)
    ])
      .then(results => {
        const [rFb, rAkty] = results;

        const fb = (rFb.status === 'fulfilled' && Array.isArray(rFb.value))
          ? rFb.value.map(el => ({ ...el, site: 'fb.com' })) : [];

        const akty = (rAkty.status === 'fulfilled' && Array.isArray(rAkty.value))
          ? rAkty.value.map(el => ({ ...el, site: 'akty.com' })) : [];

        const currentTimeMSK = new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Moscow', hour12: false });

        colorHistory.value = [...akty, ...fb]
          .filter(i => i.server_time <= currentTimeMSK)
          .sort((a, b) => b.server_time.localeCompare(a.server_time));
      })
      .catch(err => console.error('Ошибка при обработке запросов:', err));
  } else {
    colorHistory.value = [];
  }
});

const store = useStore()
const getColorHistory = (league: string, key: string, color: string) => {
  return computed(() => store.getters['matchColorHistory/getColorHistory'](league, key, color));
};

const aktyMatches = computed(() => props.match.filter(m => m.site === 'akty.com' || m.bookmaker === 'ob'))
const fbMatches   = computed(() => props.match.filter(m => m.site === 'fb.com'  || m.bookmaker === 'fb'))

const getKey = (key: string, item: RateData) => {
  if (key === 'total_bet_0') return item.total_point + ' O'
  if (key === 'total_bet_1') return item.total_point + ' U'
  if (key === 'handicap_bet_0') return item.handicap_point_0
  if (key === 'handicap_bet_1') return item.handicap_point_1
}
</script>

<style scoped>
.match-title {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-radius: 3px;
  background: var(--LightBlue, #d0deea);
  padding: 3px 10px;
  margin-bottom: 10px;
  color: var(--Blue-Black, #2d3643);
  font-family: Ubuntu;
  font-size: 14px;
  font-weight: 700;
  text-wrap: nowrap;
}
.match-title--score { align-self: center; justify-self: center; }
.match-title--counter { display: flex; align-items: center; gap: 4px; justify-self: flex-end; }
.match-title--counter .count { display: flex; align-items: center; gap: 4px; border-radius: 3px; padding: 2px 4px; background: #1F2B3E; color: #D0DEEA; }
.match-title--counter .count div { width: 16px; height: 14px; border-radius: 7px; }

.table-wrp { max-height: 78%; height: 100%; overflow-y: auto; padding-right: 2px; background: #fff; }

.tables-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.table { border-radius: 3px; background: #fff; border: 2px solid #1f2b3e; display: flex; flex-direction: column; }
.table-title { background: #1f2b3e; color: #d0deea; text-align: center; font-family: Ubuntu; font-size: 12px; font-weight: 700; padding: 6px; }
.table-fb { background: #fff; }
.no-data { text-align: center; padding: 12px; opacity: .7; }

.table-row--item { display: flex; align-items: center; justify-content: center; padding: 7px; }
.table-row--collapse { display: grid; grid-template-columns: 3fr 6fr 1fr; }
.table-row--collapse:not(:last-of-type) { border-bottom: 1px solid #1f2b3e; }
.table-row--collapse.gray { background-color: #D0DEEA; }
.table-row--item.time { font-size: 14px; }
</style>
