<template>
    <div class="pagination">
        <div
            class="pagintaion__item"
            v-for="page in pagesCount"
            :key="'page' + page"
            @click="handleChangePage(page)"
            :class="{ active: Number($route.query.page) === page }"
        >
            {{ page }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{ countItems: number; limit: number }>()

const emit = defineEmits<{
    (event: 'changePage', page: number): void
}>()

const pagesCount = computed(() => {
    return Math.ceil(props.countItems / props.limit)
})

const handleChangePage = (page: number) => {
    router.push({ query: { page } })
    if (Number(router.currentRoute.value.query.page) !== page) {
        emit('changePage', (page - 1) * 10)
    }
}
</script>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    grid-gap: 8px;
}

.pagintaion__item {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    background: #e8eff5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1f2b3e;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.pagintaion__item.active {
    background: #1f2b3e;
    color: #ffffff;
}
</style>
