<template v-if="item">
	<div
		class="table-row"
		:class="{ gray: item?.site === 'fb.com' || item.bookmaker == 'fb' }"
	>
		<div class="table-row--item">{{ item?.time_game || '-' }}</div>
		<div class="table-row--item gray">{{ total_point || '-' }}</div>
		<div
			class="table-row--item clickable"
			:style="`background: ${getColor(total_bet_0)}`"
			@click="total_bet_0 ? handleClick($event, 'total_bet_0', total_point) : ''"
		>
			{{ total_bet_0 || '-' }}
		</div>
		<div
			class="table-row--item clickable"
			:style="`background: ${getColor(total_bet_1)}`"
			@click="total_bet_1 ? handleClick($event, 'total_bet_1', total_point) : ''"
		>
			{{ total_bet_1 || '-' }}
		</div>
		<div class="table-row--item gray">
			{{ handicap_point_0 || '-' }}
		</div>
		<div
			class="table-row--item clickable"
			:style="`background: ${getColor(handicap_bet_0)}`"
			@click="handicap_bet_0 ? handleClick($event, 'handicap_bet_0', handicap_point_0) : ''"
		>
			{{ handicap_bet_0 || '-' }}
		</div>
		<div class="table-row--item gray">
			{{ handicap_point_1 || '-' }}
		</div>
		<div
			class="table-row--item clickable"
			:style="`background: ${getColor(handicap_bet_1)}`"
			@click="handicap_bet_1 ? handleClick($event, 'handicap_bet_1', handicap_point_1) : ''"
		>
			{{ handicap_bet_1 || '-' }}
		</div>
		<div class="table-row--item">
			{{ item?.server_time ? item?.server_time : '-' }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const { item, name, opponents } = defineProps(['item', 'name', 'opponents'])
const store = useStore();

const isPopUpVisible = computed(() => store.getters['popUpModule/isPopUpVisible']);

const opponentsArr = opponents.split('-')

const total_point = computed(() => {
	return item.bookmaker ? item.total_point : item?.rate?.total_point
})

const total_bet_0 = computed(() => {
	return item.bookmaker ? item.total_bet_0 : item?.rate?.total_bet_0
})

const total_bet_1 = computed(() => {
	return item.bookmaker ? item.total_bet_1 : item?.rate?.total_bet_1
})

const handicap_point_0 = computed(() => {
	return item.bookmaker ? item.handicap_point_0 : item?.rate?.handicap_point_0
})

const handicap_bet_0 = computed(() => {
	return item.bookmaker ? item.handicap_bet_0 : item?.rate?.handicap_bet_0
})

const handicap_point_1 = computed(() => {
	return item.bookmaker ? item.handicap_point_1 : item?.rate?.handicap_point_1
})

const handicap_bet_1 = computed(() => {
	return item.bookmaker ? item.handicap_bet_1 : item?.rate?.handicap_bet_1
})

const handleClick = (event: { clientX: number; clientY: number; }, bet: string, bet_filter: string) => {
	if (isPopUpVisible.value) {
		store.dispatch('popUpModule/closePopUp');
	}

	const params = {
		content: {
			site: item.bookmaker || getBookmaker(item.site),
			league: name,
			opponent_0: item.opponent_0 ? item.opponent_0 : opponentsArr[0],
			opponent_1: item.opponent_1 ? item.opponent_1 : opponentsArr[1],
			bet,
			bet_filter: bet_filter.includes('+') ? bet_filter.replace('+', '%2B') : bet_filter
		},
		position: {
			x: event.clientX,
			y: event.clientY
		}
	};
	store.dispatch('popUpModule/fetchAndShowPopUp', params);
};

const getBookmaker = (site: string) => {
	if (site === 'akty.com') {
		return 'ob'
	} else if (site === 'fb.com') {
		return 'fb'
	}
}

const getColor = (
	item: string | undefined,
): string | undefined => {
	if (!item) return
	const itemBuff = +item
	if (itemBuff <= 1.73 && itemBuff >= 1.69) {
		return '#FAFF00'; // Желтый
	}
	else if (itemBuff <= 1.68 && itemBuff >= 1.64) {
		return '#FF8A00'; // Оранжевый
	}
	else if (itemBuff <= 1.63 && itemBuff > 1.59) {
		return '#FF0000'; // Красный
	}
	else if (itemBuff <= 1.59) {
		return '#9E00FF'; // Фиолетовый
	} else {
		return

	}
}
</script>

<style scoped>
.table-row {
	display: grid;
	grid-template-columns: 2fr repeat(7, 1fr) 1fr;
	font-family: Ubuntu;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
}

.table-row.gray {
	background-color: #D0DEEA;
}

.table-row:not(:last-of-type) {
	border-bottom: 1px solid #3e576c;
}

.table-row--item {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 7px;
	min-width: 45px;
}

.table-row--item.gray {
	background-color: #1F2B3E;
	color: #CCE7FF;
}

.table-row--item:not(:last-of-type) {
	border-right: 1px solid #1f2b3e;
}

.clickable {
	cursor: pointer;
}
</style>