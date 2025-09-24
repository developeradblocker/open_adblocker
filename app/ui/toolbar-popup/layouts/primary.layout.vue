<template>
  <div class="primary-layout">
    <div class="primary-layout__header">
      <slot name="header"/>
    </div>
    <div class="primary-layout__content">
      <slot v-if="!loading" name="content"/>
      <div v-else class="primary-layout__loader">
        <h3 class="primary-layout__loader-header">Loading</h3>
        <BaseSvg
          class="primary-layout__loader-icon"
          src="../icons/loader.svg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ loading?: boolean }>(), { loading: false })

</script>

<style scoped lang="less">
.primary-layout {
  height: 100%;
}

.primary-layout__loader {
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  color: var(--secondary-color);
}

.primary-layout__loader-header {
  margin: 0 0 22px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.primary-layout__loader-icon {
  fill: var(--secondary-color);
  width: 32px;
  height: 32px;
  animation: rotate 1.5s linear infinite;
}
</style>
