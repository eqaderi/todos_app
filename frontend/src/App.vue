<template>
  <div id="app">
    <Navbar />
    <router-view class="mt-6" />
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/NavBar.vue'

export default {
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';
</style>
