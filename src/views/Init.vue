<template>
  <div id="app" style="height: 100%">
    <div class="$style.appWrapper">
      RPC Server Initializing...
    </div>
  </div>
</template>

<script>
export default {
  async created () {
    while (true) {
      try {
        let connected = await this.$rpcClient.checkConnection()
        if (connected) {
          this.$router.push({
            name: 'home'
          })
          break
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style module>
  .app-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
