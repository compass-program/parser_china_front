<template>
	<div
		v-if="isPopUpVisible"
		class="popup"
		@click.self="closePopup"
	>
		<div
			class="popup-content"
			:style="{ left: `${position.x}px`, top: `${position.y}px` }"
			ref="popupContent"
		>
			<span
				class="close"
				@click="store.dispatch('popUpModule/closePopUp');"
			>&times;</span>
			<div
				v-for="(bet, key, idx) in betHistory"
				:key="'bet' + idx"
				class="popup-content__row"
			>
				<span>{{ key }}</span>
				<span
					v-for="(item, index) in bet"
					:key="'item' + index"
					:class="{ 'red': item && typeof item === 'string' && item.includes('-'), 'green': item && typeof item === 'string' && !item.includes('-') }"
				>{{ item ? item : '-' }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isPopUpVisible = computed(() => store.getters['popUpModule/isPopUpVisible']);
const position = computed(() => store.getters['popUpModule/getPopUpPosition']);
const betHistory = computed(() => store.getters['popUpModule/getPopUpContent']);
const popupContent = ref(null);

const closePopup = () => {
	store.dispatch('popUpModule/closePopUp');
};

const handleClickOutside = (event) => {
	if (popupContent.value && !popupContent.value.contains(event.target)) {
		closePopup();
	}
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.popup-content {
	position: absolute;
	background-color: white;
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	max-width: 300px;
	max-height: 400px;
	overflow: auto;
	background-color: #F4F7FA;
}

.popup-content__row {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 24px;
}

span {
	text-align: center;
}

span.red {
	color: red;
}

.close {
	cursor: pointer;
	float: right;
	position: absolute;
	top: -4px;
	right: 10px;
	font-size: 23px;
}
</style>
