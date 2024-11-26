<template>
	<div class="notification">
		<div class="notification__text">{{ props.text }}</div>
		<div
			class="notification__action"
			@click="store.dispatch('notificationModule/removeNotification', props.idx)"
		>&times;</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore()

const props = defineProps({
	text: {
		type: String,
		default: () => 'Значение не найдено в базе данных, попробуйте позже'
	},
	idx: {
		type: Number,
		default: () => 0
	},
	duration: {
		type: Number,
		default: 10000
	}
})

onMounted(() => {
	setTimeout(() => {
		store.dispatch('notificationModule/removeNotification', props.idx)
	}, props.duration);
});
</script>

<style scoped>
.notification {
	border-radius: 10px;
	background: #F9F9F9;
	box-shadow: 4px 4px 35px 0px rgba(34, 60, 80, 0.2);
	padding: 20px;
	position: relative;
	max-width: 320px;
}

.notification__text {
	color: #2D3643;
	font-family: Ubuntu;
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}

.notification__action {
	position: absolute;
	top: 4px;
	right: 10px;
	font-size: 18px;
	cursor: pointer;
}
</style>