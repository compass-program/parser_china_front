<template>
  <form class="form" @submit.prevent="handleSave">
    <div class="form__title-wrp">
      <div class="form__title">Коэффициент гандикапа</div>
    </div>

    <div class="form__row">
      <label class="label">Текущий коэффициент</label>
      <input
        type="number"
        step="0.01"
        min="0"
        v-model.number="value"
        placeholder="Напр. 0.50"
      />
    </div>

    <span v-if="errorMsg" class="form__error-msg">{{ errorMsg }}</span>
    <button class="form__btn" type="submit">Изменить</button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdmin } from '@/services/admin'
import { useStore } from 'vuex'

const { getHandicap, setHandicap } = useAdmin()
const store = useStore()

const value = ref<number>(0.5)
const errorMsg = ref<string>('')

onMounted(async () => {
  const { data } = await getHandicap()
  if (data?.value !== undefined) value.value = data.value
})

const handleSave = async () => {
  if (!value.value || value.value <= 0) {
    errorMsg.value = 'Значение должно быть больше 0'
    return
  }
  const { status, error } = await setHandicap(value.value)
  if (status === 200) {
    store.dispatch('notificationModule/addNotification', { text: 'Handicap обновлён.' })
    errorMsg.value = ''
  } else if (error) {
    errorMsg.value = error
  }
}
</script>

<style scoped>
.form {
  clip-path: polygon(49% 0, 100% 0, 100% 74%, 50% 74%, 50% 100%, 25% 100%, 0 100%, 0% 43%, 0 0);
  background: var(--LightBlue, #d0deea);
  padding: 40px;
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  min-width: 480px;
}
.form__title-wrp { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.form__title { color:#1f2b3e; font-family: Ubuntu; font-size: 24px; font-weight: 700; }
.form__row { display:flex; flex-direction:column; grid-gap:8px; }
.label { color:#1f2b3e; font-size:14px; opacity:.8; }
input { padding: 14px 24px; border-radius: 3px; background: #fff; border: none; outline: none; }
.form__error-msg { color:#f53636; font-size:14px; }
.form__btn {
    padding: 11px 28px;
    border-radius: 3px;
    color: #fff;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    max-width: 40%;
    margin-top: 16px;
    cursor: pointer;
    background: #1f2b3e;
    transition: 0.3s;
}

.form__btn:hover {
    background: #3e4e69;
}
</style>
