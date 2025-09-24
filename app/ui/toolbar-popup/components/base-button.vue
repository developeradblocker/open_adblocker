<template>
  <button
    type="button"
    class="base-button"
    :disabled="disabled"
    :class="{'base-button--disabled': disabled}"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  disabled?: boolean
}>()
</script>

<style scoped lang="less">
.base-button {
  width: 100%;
  margin: 0;
  padding: 8px 12px;
  color: #FFF;
  text-align: center;
  background: #3C384C;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;

  &:hover {
    background: #302D3A;
  }
}

.base-button--disabled {
  cursor: not-allowed;
  background: var(--disabled-bg-color);

  &:hover {
    background: var(--disabled-bg-color);
  }
}
</style>
