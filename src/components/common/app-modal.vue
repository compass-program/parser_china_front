<template>
	<div
		class="modal-overlay"
		@click.self="emit('close')"
	>
		<div class="modal-content">
			<div
				class="modal-content__action"
				@click="emit('close')"
			> &#65794;</div>
			<div class="modal-content--wrp">

				<div
					class="modal-content__item"
					v-for="(row, idx) in props.content"
					:key="'item' + idx"
				> {{ row }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	content: String[]
}>()

const emit = defineEmits<{
	(e: 'close'): void
}>()
</script>

<style scoped>
.modal-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-self: center;
	justify-content: center;
}

.modal-content {
	background-color: #fff;
    padding: 25px;
	border-radius: 20px;
	max-width: 60vw;
	margin: auto;
	position: relative;
}

.modal-content--wrp {
	max-height: 600px;
	overflow-y: auto;

}

.modal-content__item {
	padding: 3px 10px;
}

.modal-content__item:not(:last-of-type) {
	border-bottom: 1px solid #ccc;
}

.modal-content__action {
	cursor: pointer;
	position: absolute;
	top: -4px;
	right: 13px;
	font-size: 24px;
}
</style>