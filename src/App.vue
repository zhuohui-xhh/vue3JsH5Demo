<script setup>
console.log(import.meta.env.VITE_APP_TITLE)
// import { showToast } from 'vant'
showToast('No need to import showToast')
showDialog({
  title: '标题',
  message: '代码是写出来给人看的，附带能在机器上运行。'
}).then(() => {
  // on close
})
</script>

<template>
  <div class="name">123123123</div>
  <van-button>默认按钮</van-button>
  <!-- <van-button type="primary">主要按钮</van-button> -->
  <!-- <van-button type="info">信息按钮</van-button>
  <van-button type="warning">警告按钮</van-button>
  <van-button type="danger">危险按钮</van-button> -->
</template>

<style scoped lang="scss">
.name {
  color: $red;
}
</style>
