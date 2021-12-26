<template>
  <div
    class="card has-text-left is-relative"
    :style="{ backgroundColor: lighterColor, boxShadow }">
    <div class="card-content">
      <!-- <b-tooltip
        class="delete-tooltip"
        label="Delete this item"
        type="is-dark">
        <button class="delete" />
      </b-tooltip> -->

      <b-dropdown
        :triggers="['hover']"
        aria-role="list"
        class="actions">
        <template #trigger>
          <div class="actions__icon">
            <div
              v-for="i in [1,2,3]"
              :key="i" />
          </div>
        </template>

        <b-dropdown-item aria-role="listitem">Edit</b-dropdown-item>
        <b-dropdown-item aria-role="listitem">Delete</b-dropdown-item>
      </b-dropdown>
      <div class="mb-5">
        <span class="is-uppercase is-size-7">{{ todoCopy.type }}</span>
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
            {{ todoCopy.title }}
          </h3>
        </div>
      </div>
      <div class="content has-text-weight-semibold">{{ todoCopy.description }}</div>
      <TodoStep
        v-for="(step, index) in todoCopy.steps"
        :key="step.order"
        :step.sync="step"
        @update:step="value => updateStep(value, index)" />
    </div>
    <footer
      class="card-footer has-text-weight-semibold"
      :style="{ borderColor }">
      <!-- <span
        class="card-footer-item is-clickable"
        :style="{ borderColor }">
        Edit
      </span> -->
      <span
        :class="[todoIsDone ? 'is-done' : '', 'card-footer-item is-clickable done-btn is-flex']"
        :style="{ borderColor }"
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
import { cloneDeep } from 'lodash'
import TodoStep from './TodoStep.vue'

export default {
  components: {
    TodoStep
  },
  props: {
    todo: {
      type: Object,
      default: () => ({
        id: null,
        createdAt: null,
        type: null,
        color: null,
        title: null,
        description: null,
        steps: [
          {
            order: null,
            text: null,
            done: null
          }
        ],
        dueDate: null,
        done: null
      })
    }
  },
  data () {
    return {
      todoCopy: cloneDeep(this.todo)
    }
  },
  computed: {
    ...mapState(['loader']),
    isLoading () {
      return this.loader.status && this.loader.todoId === this.todoCopy.id
    },
    lighterColor () {
      return this.$color(this.todoCopy.color).lighten(0.42)
    },
    darkerColor () {
      return this.$color(this.todoCopy.color).darken(0.5).desaturate(0.2)
    },
    borderColor () {
      return this.$color(this.todoCopy.color)
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
      return this.todoCopy.done && this.todoCopy.steps.every(({ done }) => done)
    }
  },
  watch: {
    todo: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        this.todoCopy = cloneDeep(newValue)
      }
    }
  },
  methods: {
    ...mapActions(['updateTodo']),
    toggleDone () {
      this.todoCopy.done = !this.todoCopy.done
      this.updateTodo(this.todoCopy)
    },
    updateStep (value, index) {
      this.todoCopy.steps[index] = value
      this.updateTodo(this.todoCopy)
    }
  }
}
</script>
<style lang="sass" scoped>
.card,
.loading-overlay
  border-radius: 1em

.actions
  position: absolute
  display: block
  top: 0
  right: 0
  font-size: initial
  padding: 1em 1em 1em 2em
  cursor: pointer
  &__icon div
    height: .25em
    width: .25em
    border-radius: .25em
    background-color: #2c3e50
    margin-bottom: .25em
    transform: rotateY(0deg)
    transition: transform .2s ease-out
    &:nth-child(2)
      transition-delay: .1s
    &:nth-child(3)
      transition-delay: .2s
  &:hover
    .actions__icon div
      transform: rotateY(180deg)

.done-btn
  border-bottom-right-radius: 1em
  position: relative
  &::after
    content: ''
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    box-shadow: rgb(0 0 0) 0px 4px 6px -2px inset
    background-color: rgb(0 0 0 / 20%)
    mix-blend-mode: overlay
    opacity: 0
    transition: opacity 0s linear .1s
  &:focus,
  &:active
    &::after
      opacity: 1
      transition-delay: 0s

.is-done
  &::after
    opacity: 1
</style>
