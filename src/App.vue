<template>
  <div v-cloak :id="$style.app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style module>
  #app {
    height: 100%;
  }
</style>
