<template>
  <div class="columns is-tablet">
    <div
      v-for="id in todoIds"
      :key="id"
      class="column is-6 is-4-desktop is-3-widescreen">
      <TodoCard :id="id" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { cloneDeep } from 'lodash'
import TodoCard from '@/components/TodoCard.vue'
export default {
  components: {
    TodoCard
  },
  computed: {
    // ...mapState(['todos']),
    ...mapGetters(['todoIds'])
  },
  beforeMount () {
    this.loadTodos()
  },
  methods: {
    ...mapActions(['loadTodos'])
  }
}
</script>
