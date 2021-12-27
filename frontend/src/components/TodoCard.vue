<template>
  <div
    :ref="`card${id}`"
    class="card has-text-left todo-item"
    :style="{ backgroundColor: lighterColor, boxShadow }">
    <div class="card-content">
      <!-- Actions -->
      <b-dropdown
        v-show="!editModeIsActive"
        aria-role="list"
        :triggers="['hover']"
        class="actions">
        <template #trigger>
          <div class="actions__icon">
            <div
              v-for="i in 3"
              :key="i" />
          </div>
        </template>
        <b-dropdown-item
          aria-role="listitem"
          @click="popUp">
          Edit
        </b-dropdown-item>
        <b-dropdown-item aria-role="listitem">Delete</b-dropdown-item>
      </b-dropdown>
      <!-- Actions -->

      <div class="mb-5">
        <!-- Tags -->
        <b-taglist class="mb-0">
          <b-tag
            v-for="tag in todo.tags"
            :key="tag"
            type="is-light">
            {{ tag }}
          </b-tag>
        </b-taglist>
        <!-- Tags -->

        <!-- Header -->
        <div class="my-3">
          <div
            class="is-flex is-align-content-center"
            :style="{ color: darkerColor }">
            <b-icon
              v-if="todoIsDone"
              icon="check-all"
              size="is-medium"
              class="mr-4" />
            <component
              :is="editModeIsActive ? 'b-input' : 'h3'"
              :ref="`title${id}`"
              v-model="todo.title"
              placeholder="Title"
              size="is-large"
              autofocus
              :class="[
                todoIsDone ? 'is-step-done' : '',
                'header has-text-weight-bold is-size-4',
              ]">
              {{ todo.title }}
            </component>
          </div>
          <div
            v-if="!todo.title.trim()"
            class="is-family-secondary is-size-7 has-text-weight-semibold has-text-danger">
            Can't do it! Title is required ¯\_(ツ)_/¯
          </div>
        </div>
        <!-- <h3
            :class="[
              todoIsDone ? 'is-step-done' : '',
              'has-text-weight-bold is-size-4',
            ]">
            {{ todo.title }}
          </h3> -->
        <!-- Header -->

        <!-- Due date -->
        <div class="due-date is-flex is-align-items-center">
          <div
            v-if="!todoIsDone && due.iconsLength"
            class="due-date__icon mr-2 is-flex is-align-items-center">
            <b-icon
              v-for="n in due.iconsLength"
              :key="n"
              :style="{ color: due.color, width: '10px' }"
              size="is-small"
              icon="exclamation-thick"
              class="pr-0" />
          </div>
          <div class="has-text-weight-semibold is-size-7 is-family-monospace">
            {{ due.date }}
          </div>
        </div>
        <!-- Due date -->
      </div>

      <!-- Description -->
      <div class="content has-text-weight-semibold">
        {{ todo.description }}
      </div>
      <!-- Description -->

      <!-- TodoStep -->
      <TodoStep
        v-for="(step, index) in todo.steps"
        :key="step.order"
        :index="index"
        :todo-id="id"
        :step="step"
        :edit-mode-is-active="editModeIsActive"
        @step:delete="deleteStep" />
      <div
        v-if="editModeIsActive"
        class="is-clickable pt-4"
        @click="addStep">
        <b-icon
          size="is-small"
          icon="plus" />
        <span class="pl-3">list item</span>
      </div>
      <!-- TodoStep -->
    </div>

    <footer
      class="card-footer has-text-weight-semibold"
      :style="{ borderColor }">
      <div
        class="progress-bar"
        :style="{ transform: `scaleX(${progressPercent})` }" />
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
      todo: [],
      due: {
        date: '',
        color: 'yellow',
        iconsLength: 0
      },
      intervalId: null
    }
  },
  computed: {
    ...mapState(['loader', 'cardPoppedUp', 'formIsValid', 'cardIsShaking']),
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
    progressPercent () {
      const doneSteps = this.todo.steps.filter(({ done }) => done)
      const allSteps = this.todo.steps
      return doneSteps.length / allSteps.length
    },
    editModeIsActive () {
      const { status, todoId } = this.cardPoppedUp
      return status && this.id === todoId
    }
  },
  watch: {
    cardPoppedUp: {
      deep: true,
      handler (value) {
        this.togglePopUpCard(value)
      }
    },
    cardIsShaking (value) {
      if (value) {
        this.shake()
      }
    },
    // data: {
    //   immediate: true,
    //   deep: true,
    //   handler(newValue, oldValue) {

    //   }
    // }
    'todo.title' (value) {
      if (this.formIsValid && !value.trim()) {
        this.updateFormIsValid(false)
      } else if (!this.formIsValid && value.trim()) {
        this.updateFormIsValid(true)
      }
    }
  },
  created () {
    this.todo = cloneDeep(this.getTodoById()(this.id))
    this.parseDueDateR()
    this.intervalId = setInterval(() => {
      this.parseDueDateR()
    }, 60000)
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  mounted () {
    this.cardRef = this.$refs[`card${this.id}`]
  },
  methods: {
    ...mapActions([
      'updateTodo',
      'updateBackdrop',
      'updateCardPoppedUp',
      'updateFormIsValid',
      'updateCardIsShaking'
    ]),
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
    parseDueDateR () {
      const diff = this.$dayjs().diff(this.todo.dueDate, 'day', true)
      const toBeVerb = diff > 0 ? 'was' : 'is'

      if (diff >= 0) {
        this.due.color = '#f44336'
        this.due.iconsLength = 3
      } else if (diff < 0 && diff > -1) {
        this.due.color = '#f44336'
        this.due.iconsLength = 2
      } else if (diff <= -1 && diff > -2) {
        this.due.color = '#f44336'
        this.due.iconsLength = 1
      } else if (diff <= -2 && diff > -4) {
        this.due.color = '#fdd835'
        this.due.iconsLength = 1
      }

      const differenceIsADayOrMore = Math.abs(diff) >= 0.5
      const parsedDate = differenceIsADayOrMore
        ? this.$dayjs(this.$dayjs(this.todo.dueDate)).calendar(null, {
          sameElse: 'MMMM D, YYYY h:mm A'
        })
        : this.$dayjs(this.$dayjs(this.todo.dueDate)).fromNow()

      this.due.date = `Due date ${toBeVerb} ${parsedDate}`
    },
    togglePopUpCard ({ status, todoId }) {
      if (todoId !== this.id) return

      // const cardRef = this.$refs[`card${todoId}`]
      const cardFlipState = this.$Flip.getState(this.cardRef)
      const toggleZIndex = () => {
        this.cardRef.style.zIndex = status ? 1000 : 'initial'
        if (status) this.$refs[`title${this.id}`].focus()
        // this.cardRef.style.position = status ? 'fixed' : 'relative'
      }

      this.updateBackdrop(status)

      this.cardRef.style.zIndex = 1000
      // this.cardRef.style.position = 'fixed'

      if (status) {
        this.cardRef.classList.add('pop-up')
      } else {
        this.updateSteps()
        this.updateStepsOrder()
        this.updateTodoAndFetch()

        this.cardRef.classList.remove('pop-up')
      }

      this.$Flip.from(cardFlipState, {
        duration: 0.5,
        ease: 'power4.out',
        absolute: true,
        onComplete: toggleZIndex
      })
    },
    shake () {
      if (this.cardPoppedUp.todoId !== this.id) return
      this.$gsap.fromTo(this.cardRef, { x: -5 }, {
        duration: 0.01,
        x: 5,
        clearProps: 'x',
        repeat: 30,
        onComplete: () => this.updateCardIsShaking(false)
      })
    },
    popUp () {
      this.updateCardPoppedUp({ status: true, todoId: this.id })
    },
    deleteStep (index) {
      this.todo.steps.splice(index, 1)
      // this.updateStepsOrder()
      // this.updateTodoAndFetch()
    },
    addStep () {
      this.todo.steps.push({
        order: this.todo.steps.length + 1,
        text: '',
        done: false
      })

      // this.$refs[`step${this.id}${this.todo.steps.length}`].focus()
      // console.log('x', `step${this.id}${this.todo.steps.length - 1}`)
      // const i = setTimeout(() => {
      //   this.$refs[`step${this.id}${this.todo.steps.length - 2}`].focus()
      //   clearTimeout(i)
      // }, 500)
    },
    updateSteps () {
      this.todo.steps = this.todo.steps.filter(({ text }) => text)
    },
    updateStepsOrder () {
      for (let i = 0; i < this.todo.steps.length; i++) {
        this.todo.steps[i].order = i + 1
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.card,
.loading-overlay
  border-radius: 1em

.card
  position: relative

::v-deep .header
  // margin: .5em 0
  &,
  input
    font-weight: 700 !important
    font-size: 1.5rem !important
    padding: 0
    height: initial
    background-color: initial
    border-color: transparent
    border-width: 0 0 1px 0
    border-radius: 0
    box-shadow: none
    color: currentColor
    &:hover,
    &:focus
      border-color: rgba(0 0 0 / .25)

.pop-up
  position: fixed
  overflow: hidden
  top: 200px
  left: 200px
  right: 200px
  box-shadow: none !important
  // z-index: 1000

.due-date
  min-height: 26px
  &__icon
    position: relative
    margin-right: 5px
    padding: 5px
    &::after
      content: ''
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      background-color: rgb(0 0 0 / 40%)
      mix-blend-mode: overlay
      border-radius: 5px

.actions
  position: absolute
  display: block
  top: 0
  right: 0
  font-size: initial
  padding: 0
  cursor: pointer
  &__icon
    padding: 1em
    div
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
  overflow: hidden

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
