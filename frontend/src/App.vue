<template>
  <div id="app">
    <Navbar />
    <router-view />
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
  computed: mapState(['backdrop', 'message']),
  watch: {
    message: {
      immediate: true,
      deep: true,
      handler (value) {
        if (value.type) this.danger(value.text, value.type)
      }
    }
  },
  methods: {
    danger (text, type) {
      this.$buefy.toast.open({
        message: text,
        type: type,
        duration: 5000,
        // position: 'is-bottom',
        pauseOnHover: true
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';
</style>
