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
              v-for="i in [1, 2, 3]"
              :key="i" />
          </div>
        </template>

        <b-dropdown-item aria-role="listitem">Edit</b-dropdown-item>
        <b-dropdown-item aria-role="listitem">Delete</b-dropdown-item>
      </b-dropdown>
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
            :class="[
              todoIsDone ? 'is-step-done' : '',
              'has-text-weight-bold is-size-4',
            ]">
            {{ todo.title }}
          </h3>
        </div>
        <span>{{ parseDateRelative(todo.dueDate) }}</span>
      </div>
      <div class="content has-text-weight-semibold">
        {{ todo.description }}
      </div>
      <TodoStep
        v-for="step in todo.steps"
        :key="step.order"
        :step="step"
        @step:update="updateTodoAndFetch" />
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
        :class="[
          todoIsDone ? 'is-done' : '',
          'card-footer-item is-clickable done-btn is-flex',
        ]"
        :style="{ borderColor }"
        @click="toggleDone">
        <b-icon
          v-if="todoIsDone"
          icon="check-all"
          class="pr-2" />
        {{ todoIsDone ? "Completed" : "Mark as complete" }}
      </span>
      <div
        class="progress-bar"
        :style="{ transform: `scaleX(${progressPercent})` }">
        />
      </div>
    </footer>
    <b-loading
      v-model="isLoading"
      animation="scale"
      :is-full-page="false" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import TodoStep from './TodoStep.vue'

export default {
  components: {
    TodoStep
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      todo: []
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
      return (
        this.todo.done && this.todo.steps.every(({ done }) => done)
        // this.todo.done
      )
    },
    progressPercent () {
      const doneSteps = this.todo.steps.filter(({ done }) => done)
      const allSteps = this.todo.steps
      return doneSteps.length / allSteps.length
    }
  },
  created () {
    this.todo = cloneDeep(this.getTodoById()(this.id))
  },
  methods: {
    ...mapActions(['updateTodo']),
    ...mapGetters(['getTodoById']),
    toggleDone () {
      this.todo.done = !this.todo.done
      this.updateTodoAndFetch()
    },
    updateTodoAndFetch () {
      this.updateTodo(this.todo).then(() => {
        Object.assign({}, this.todo, this.getTodoById()(this.id))
      })
    },
    parseDateRelative (date) {
      const diff = Math.abs(this.$dayjs().diff(date, 'day', true))
      const differenceIsADayOrMore = diff >= 0.5

      const parsedDate = differenceIsADayOrMore
        ? this.$dayjs(this.$dayjs(date)).calendar(null, {
          sameElse: 'MMMM D, YYYY h:mm A'
        })
        : this.$dayjs(this.$dayjs(date)).fromNow()

      return `Due date is ${parsedDate}`
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

.card-footer
  position: relative

.progress-bar
  position: absolute
  top: 0
  right: 0
  bottom: 0
  left: 0
  background-color: rgb(0 0 0 / 40%)
  mix-blend-mode: overlay
  transform: scaleX(0)
  transform-origin: 0 0
  transition: transform .2s ease-out

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
