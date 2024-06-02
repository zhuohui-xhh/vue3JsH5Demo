<script setup></script>

<template>
  <van-row class="header">
    <van-col span="2" class="flex-column-align-center">
      <van-icon class="aa" name="arrow-left" />
    </van-col>
    <van-col span="18" class="flex-column-align-center">支付宝</van-col>
    <van-col span="2" class="flex-column-align-center"></van-col>
  </van-row>
</template>

<style scoped lang="scss">
.header {
  color: $red;
  width: 750px;
  height: 48px;
  background-color: red;
  color: #fff;
  ::v-deep .van-col {
    display: flex;
    font-size: 30px;
    .van-icon-arrow-left {
      font-size: 30px;
    }
  }
}
</style>
