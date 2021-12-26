<template>
  <div
    class="card has-text-left is-relative"
    :style="{ backgroundColor: lighterColor, boxShadow }">
    <div class="card-content">
      <b-tooltip
        class="delete-tooltip"
        label="Delete this item"
        type="is-dark">
        <button class="delete" />
      </b-tooltip>
      <div class="mb-5">
        <span class="is-uppercase is-size-7">{{ todo.type }}</span>
        <div
          class="is-flex is-align-content-center"
          :style="{ color: darkerColor }">
          <b-icon
            v-if="todoIsDone"
            icon="check-all"
            size="is-medium"
            class="mr-4" />
          <h3
            :class="[ todoIsDone ? 'is-step-done' : '', 'has-text-weight-bold is-size-4']">
            {{ todo.title }}
          </h3>
        </div>
      </div>
      <div class="content has-text-weight-semibold">{{ todo.description }}</div>
      <TodoStep
        v-for="(step, index) in todo.steps"
        :key="step.order"
        :value="todo.steps[index]"
        @input="value => updateStep(value, index)" />
    </div>
    <footer
      class="card-footer has-text-weight-semibold"
      :style="{ borderColor }">
      <span
        class="card-footer-item is-clickable"
        :style="{ borderColor }">
        Edit
      </span>
      <span
        :class="[todoIsDone ? 'is-done' : '', 'card-footer-item is-clickable done-btn is-flex']"
        :style="{ borderColor, boxShadow: boxShadow2(todoIsDone) }"
        @click="toggleDone">
        <b-icon
          v-if="todoIsDone"
          icon="check-all"
          class="pr-2" />
        {{ todoIsDone ? 'Completed' : 'Mark as complete' }}
      </span>
    </footer>
    <b-loading
      v-model="isLoading"
      animation="scale"
      :is-full-page="false" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TodoStep from './TodoStep.vue'

export default {
  components: {
    TodoStep
  },
  props: {
    todo: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState(['loader']),
    isLoading () {
      return this.loader.status && this.loader.todoId === this.todo.id
    },
    lighterColor () {
      return this.$color(this.todo.color).lighten(0.42)
    },
    darkerColor () {
      return this.$color(this.todo.color).darken(0.5).desaturate(0.2)
    },
    borderColor () {
      return this.$color(this.todo.color)
        .darken(0.1)
        .desaturate(0.5)
        .alpha(0.5)
    },
    boxShadow () {
      const outside = `0 .5em 1.5em -.1em ${this.lighterColor}`
      const inside = `inset 0 0 .25em 1em ${this.borderColor.alpha(0.05)}`
      return `${inside}, ${outside}`
    },
    todoIsDone () {
      return this.todo.done && this.todo.steps.every(({ done }) => done)
    },
    model: {
      get () {
        return this.todo
      }
    }
  },
  methods: {
    ...mapActions(['updateTodo']),
    toggleDone () {
      this.todo.done = !this.todo.done
      this.updateTodo(this.todo)
    },
    updateStep (value, index) {
      this.todo.steps[index] = value
      this.updateTodo(this.todo)
    },
    boxShadow2 (done) {
      return done ? `inset 0 0 .2em .2em ${this.borderColor.alpha(0.3)}` : ''
    }
  }
}
</script>
<style lang="sass" scoped>
.card
  border-radius: 1em
  overflow: hidden

  &:hover
    .delete-tooltip
      opacity: 1
      transform: scale(1)

.delete-tooltip
  position: absolute
  display: block
  top: 1em
  right: 1em
  font-size: initial
  opacity: 0
  transform: scale(.5)
  transition: opacity .2s ease-out, transform .2s ease-out

.done-btn
  border-bottom-right-radius: 1em
.is-done
  background-color: rgb(0 0 0 / 10%)
</style>
