<template>
    <div class="panel-part--wrp">
        <div class="panel-part">
            <div
                class="panel-part--coef-color"
                v-for="(color, idx) in colorHistory.colorPanel"
                :key="'color' + idx"
                :style="`background-color: ${color}`"
            ></div>
        </div>
        <div
            class="panel-part--league"
            :style="colorHistory.color"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const { name } = defineProps(['name'])

const colorHistory = computed(() => store.getters['historyColor/getColorHistory'](name))
</script>

<style scoped>
.panel-part--coef-color {
    width: 16px;
    height: 14px;
    border-radius: 7px;
    box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.25) inset;
}

.panel-part--league {
    width: 100%;
    height: 4px;
    border-radius: 2px;
}

.panel-part--wrp {
    display: flex;
    flex-direction: column;
    grid-gap: 5px;
    padding: 0 10px;
    border-right: 1px solid #f9f9f9;
    border-left: 1px solid #f9f9f9;
}

.panel-part {
    display: flex;
    grid-gap: 9px;
}

.panel-part--wrp:first-of-type {
    border-left: unset;
}

.panel-part--wrp:last-of-type {
    border-right: unset;
}
</style>
