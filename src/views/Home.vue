<template>
  <div>
    <div :class="$style.header">Electron Python</div>
    <el-card :body-style="{ padding: '0px'}" style="margin: 0 20px; border-color: transparent;">
      <div slot="header">
        <span style="font-size: 18px;">Get Current Time | </span>This is an example to call RPC server API
      </div>
      <div style="padding: 20px;">
        <div style="font-size: 20px; margin-bottom: 12px;">{{currentTime}}</div>
        <div>
          <el-button type="primary" @click="getCurrentTime">GET</el-button>
        </div>
      </div>
    </el-card>
    <div :class="$style.brands">
      <i class="fas fa-atom"></i>
      <i class="fab fa-vuejs"></i>
      <i class="fab fa-python"></i>
    </div>
  </div>
</template>

<script>
import { manageError } from '@/utils'

export default {
  data () {
    let currentTime = 'Not Get Yet'
    return {
      currentTime
    }
  },
  methods: {
    getCurrentTime () {
      this.$rpcClient.request({
        route: ':example:get-current-time'
      }).then(result => {
        this.currentTime = result
      }).catch(err => {
        manageError(this, err)
      })
    }
  }
}
</script>

<style lang="scss" module>
  .header {
    font-size: 36px;
    text-align: center;
    padding: 24px;
    color: $--color-primary;
  }
  .brands {
    display: flex;
    justify-content: space-between;
    width: 400px;
    padding: 40px;
    margin: auto;
    color: $--color-primary-light-9;
  }
  .brands i {
    font-size: 80px;
  }
</style>
