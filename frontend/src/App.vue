<template>
  <div id="app">
    <Navbar />
    <router-view class="mt-6" />
    <BackDrop v-if="backdrop" />
  </div>
</template>

<script>
import Navbar from '@/components/NavBar.vue'
import BackDrop from '@/components/BackDrop.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Navbar,
    BackDrop
  },
  computed: {
    ...mapState(['backdrop'])
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';
</style>
