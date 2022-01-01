<template>
  <div class="has-text-centered">
    <div v-if="todos.length">
      <div class="empty pb-5">
        {{ face }}
      </div>
      <div class="is-size-4 is-family-code pb-5">Can’t find any todos with that phrase.</div>
      <b-button @click="$emit('clear-search')">Clear your search and try again</b-button>
    </div>
    <span
      v-else-if="loader.todoId === 'all' && loader.status === true"
      class="is-size-4 is-family-code">Loading ...</span>
    <span
      v-else
      class="is-size-4 is-family-code">Add some todos to start ... {{ face }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      emojis: [
        '(·.·)',
        '\\(^Д^)/',
        '(>_<)',
        '(˚Δ˚)b',
        "(='X'=)",
        '(^-^*)',
        '(^_^)b',
        '(≥o≤)'
      ],
      face: ''
    }
  },

  computed: mapState(['todos', 'loader']),
  created () {
    this.face = this.emojis[Math.floor(Math.random() * this.emojis.length)]
  }
}
</script>

<style lang="sass" scoped>
.empty
    color: #dadce0
    font-size: 15vw
</style>
