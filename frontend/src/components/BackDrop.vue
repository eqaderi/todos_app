<template>
  <div
    class="backdrop"
    @click="turnOff" />
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: mapState(['cardPoppedUp', 'formValidationStatus']),
  methods: {
    ...mapActions(['updateBackdrop', 'updateCardPoppedUp', 'updateCardIsShaking']),
    turnOff () {
      if (!this.formValidationStatus.status) {
        this.updateCardIsShaking({ status: true, todoId: this.formValidationStatus.todoId })
        return
      }
      this.updateBackdrop(false)
      this.updateCardPoppedUp({
        status: false,
        todoId: this.cardPoppedUp.todoId
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.backdrop
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 300
  background-color: #000
  opacity: 0.2
</style>
