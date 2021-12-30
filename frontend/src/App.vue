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
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    Navbar,
    BackDrop
  },
  computed: mapState(['backdrop', 'error']),
  watch: {
    error: {
      immediate: true,
      deep: true,
      handler (value) {
        if (value.message) this.danger(value.message)
      }
    }
  },
  methods: {
    ...mapActions(['updateError']),
    danger (message) {
      this.$buefy.toast.open({
        duration: 5000,
        message,
        position: 'is-bottom',
        type: 'is-danger',
        pauseOnHover: true
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';
</style>
