<template>
	<div class="notifications__list">
		<TheNotification
			v-for="(notification, idx) in notifications_list"
			:key="'notification' + idx"
			:text="notification.text"
			:idx="idx"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TheNotification from './theNotification.vue';
import { useStore } from 'vuex';

const store = useStore()

const notifications_list = computed(() => store.getters['notificationModule/notificationsList'])
</script>

<style scoped>
.notifications__list {
	position: absolute;
	bottom: 10px;
	right: 10px;
	max-width: 320px;
	display: flex;
	flex-direction: column;
	width: 100%;
	grid-gap: 8px;
}
</style>