<template>
  <div
    :id="`card${id}parent`"
    :ref="`card${id}parent`"
    :class="[
      disableInteraction.todoId !== id && disableInteraction.status
        ? 'disable-card'
        : '',
      'card-parent',
    ]">
    <div
      :id="`card${id}wrapper`"

      :ref="`card${id}wrapper`"
      data-flip-id="new"
      class="card-wrapper">
      <div
        :ref="`card${id}`"
        class="card has-text-left todo-item"
        :style="{ backgroundColor: lighterColor, boxShadow }">
        <div class="card-content">
          <!-- Actions -->
          <b-dropdown
            v-if="!addingNewTodo"
            v-show="!editModeIsActive"
            aria-role="list"
            :triggers="['hover']"
            class="actions is-clickable">
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
            <b-dropdown-item
              aria-role="listitem"
              @click="deleteTodo(id)">
              Delete
            </b-dropdown-item>
          </b-dropdown>

          <div
            v-if="editModeIsActive || addingNewTodo"
            class="actions m-5 is-flex is-align-items-center">
            <span class="mr-5 has-text-weight-bold">Color: </span>
            <div class="is-relative">
              <ColorElement
                :color="todo.color"
                :border-color="borderColor"
                @click.native="swatchVisible = true" />
              <ColorSwatch
                v-if="swatchVisible"
                :color.sync="todo.color"
                tabindex="0"
                @focusout.native="swatchVisible = false"
                @close-swatch="swatchVisible = false" />
            </div>
          </div>
          <!-- Actions -->

          <div class="mb-5">
            <!-- Header -->
            <div class="mt-3">
              <div
                class="is-flex is-align-content-center"
                :style="{ color: darkerColor }">
                <b-icon
                  v-if="todoIsDone"
                  icon="check-all"
                  size="is-medium"
                  class="mr-4" />
                <component
                  :is="editModeIsActive || addingNewTodo ? 'b-input' : 'h3'"
                  :ref="`title${id}`"
                  v-model="todo.title"
                  placeholder="Title"
                  size="is-large"
                  :autofocus="!addingNewTodo"
                  :class="[
                    todoIsDone ? 'is-step-done' : '',
                    'header has-text-weight-bold is-size-4',
                  ]"
                  @blur="validateTitle">
                  {{ todo.title }}
                </component>
              </div>
              <div
                v-show="titleIsNotValid"
                class="is-family-code is-size-7 has-text-weight-bold has-text-danger pt-3">
                Can't do it! Title is required ¯\_(ツ)_/¯
              </div>
            </div>
            <!-- Header -->
            <div class="mt-3">
              <!-- Due date -->
              <b-datetimepicker
                v-if="editModeIsActive || addingNewTodo"
                v-model="todo.dueDate"
                placeholder="Click to select the due date ..."
                icon="timer-outline"
                class="is-flex-grow-1"
                :datetime-formatter="
                  (t) => this.$dayjs(t).format('dddd, MMMM D, YYYY h:mm A')
                ">
                <template #left>
                  <b-button
                    label="Now"
                    type="is-primary"
                    icon-left="clock"
                    @click="todo.dueDate = new Date()" />
                </template>

                <template #right>
                  <b-button
                    label="Clear"
                    type="is-danger"
                    icon-left="close"
                    outlined
                    @click="todo.dueDate = null" />
                </template>
              </b-datetimepicker>
              <div
                v-else-if="todo.dueDate"
                class="due-date is-flex is-align-items-center pt-2">
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
                <div
                  class="has-text-weight-semibold is-size-7 is-family-monospace">
                  {{ due.date }}
                </div>
              </div>
              <!-- Due date -->
            </div>
          </div>

          <!-- Description -->
          <component
            :is="editModeIsActive || addingNewTodo ? 'b-input' : 'div'"
            v-if="editModeIsActive || addingNewTodo || todo.description"
            v-model="todo.description"
            class="description mb-5"
            placeholder="Description">
            {{ todo.description }}
          </component>
          <!-- Description -->

          <!-- TodoStep -->
          <div :class="[editModeIsActive || addingNewTodo ? 'border-top' : '']">
            <TodoStep
              v-for="(step, index) in todo.steps"
              :key="step.order"
              :index="index"
              :steps-length="todo.steps.length"
              :step="step"
              :steps="todo.steps"
              :edit-mode-is-active="editModeIsActive || addingNewTodo"
              @step:update="updateTodoAndFetch"
              @step:delete="deleteStep"
              @step:add="addStep" />
            <!-- TodoStep -->
          </div>
        </div>

        <footer
          class="card-footer has-text-weight-semibold"
          :style="{ borderColor, backgroundColor: lighterColor }">
          <div
            v-if="!addingNewTodo"
            :class="[
              todoIsDone ? 'is-done' : '',
              'card-footer-item is-clickable done-btn is-flex',
            ]"
            :style="{ borderColor }"
            @click="toggleDone">
            <div
              class="progress-bar"
              :style="{ transform: `scaleX(${progressPercent})` }" />
            <b-icon
              v-if="todoIsDone"
              icon="check-all"
              class="pr-2" />
            <span v-if="!editModeIsActive">
              {{ todoIsDone ? "Completed" : "Mark as complete" }}
            </span>
          </div>

          <div
            v-if="addingNewTodo"

            class="card-footer-item is-clickable done-btn"
            :style="{ borderColor }"
            @click="closeForm">
            Cancel
          </div>
          <div
            v-if="addingNewTodo"
            class="card-footer-item is-clickable done-btn"
            :style="{ borderColor }"
            @click="submitAddTodo">
            Submit
          </div>
        </footer>

        <b-loading
          v-model="isLoading"
          animation="scale"
          :is-full-page="false" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { cloneDeep, isEqual } from 'lodash'
import TodoStep from './TodoStep.vue'
import ColorElement from './ColorElement.vue'
import ColorSwatch from './ColorSwatch.vue'

export default {
  components: {
    TodoStep,
    ColorElement,
    ColorSwatch
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    todop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      todo: {},
      titleIsNotValid: false,
      due: {
        date: '',
        color: 'yellow',
        iconsLength: 0
      },
      intervalId: null,
      todoInfoBeforePop: {},
      searchBoxRef: null,
      cardWrapperRef: null,
      swatchVisible: false
    }
  },
  computed: {
    ...mapState([
      'loader',
      'cardPoppedUp',
      'formValidationStatus',
      'cardIsShaking',
      'message',
      'disableInteraction',
      'newTodo'
    ]),
    isLoading () {
      return this.loader.status && this.loader.todoId === this.todo.id
    },
    lighterColor () {
      return this.$color(this.todo.color).lighten(0.44)
      // return this.todo.color
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
      if (this.addingNewTodo) return 'none'
      const outside = `0 .5em 1.5em -.1em ${this.lighterColor}`
      const inside = `inset 0 0 .25em 1em ${this.borderColor.alpha(0.05)}`
      return this.editModeIsActive ? `${inside}` : `${inside}, ${outside}`
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
    },
    addingNewTodo () {
      return this.id === 'new'
    }
  },
  watch: {
    cardPoppedUp: {
      deep: true,
      handler (value) {
        if (this.addingNewTodo) {
          this.toggleNewPopUpCard(value)
        } else {
          this.togglePopUpCard(value)
        }
      }
    },
    cardIsShaking: {
      deep: true,
      handler ({ status, todoId }) {
        if (status && todoId === this.id) {
          this.shake()
        }
      }
    },
    todop: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        if (!isEqual(newValue, oldValue)) {
          this.todo = cloneDeep(newValue)
        }
      }
    },
    'todo.title' (value) {
      if (!this.editModeIsActive || this.addingNewTodo) return
      if (this.formValidationStatus.status && !value.trim()) {
        this.updateFormValidationStatus({ status: false, todoId: this.id })
      } else if (!this.formValidationStatus.status && value.trim()) {
        this.updateFormValidationStatus({ status: true, todoId: this.id })
      }
    }
  },
  created () {
    this.parseDueDate()
    this.intervalId = setInterval(() => {
      this.parseDueDate()
    }, 60000)
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  mounted () {
    this.popUpContainerRef = document.getElementById('pop-up-container')
    this.searchBoxRef = document.getElementById('search-box')
    this.cardParentRef = document.getElementById(`card${this.id}parent`)
    this.cardWrapperRef = document.getElementById(`card${this.id}wrapper`)

    if (this.addingNewTodo) {
      // this.popUpContainerRef.style.visibility = 'visible'
      this.popUpContainerRef.appendChild(this.cardWrapperRef)
      this.cardWrapperRef.style.display = 'none'
    }
  },
  methods: {
    ...mapActions([
      'updateTodo',
      'updateBackdrop',
      'updateCardPoppedUp',
      'updateFormValidationStatus',
      'updateCardIsShaking',
      'updateDisableInteraction',
      'updateNewTodo',
      'addTodo',
      'deleteTodo'
    ]),
    toggleDone () {
      if (this.editModeIsActive) return
      this.todo.done = !this.todo.done
      this.updateTodoAndFetch()
    },
    updateTodoAndFetch () {
      this.updateDisableInteraction({ status: true, todoId: this.id })
      this.updateTodo(this.todo).finally(() => {
        this.todo = cloneDeep(this.todop)
        this.parseDueDate()
      })
    },

    parseDueDate () {
      if (!this.todo.dueDate) return
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
      } else {
        this.due.color = ''
        this.due.iconsLength = 0
      }

      const differenceIsADayOrMore = Math.abs(diff) >= 0.5
      const parsedDate = differenceIsADayOrMore
        ? this.$dayjs(this.$dayjs(this.todo.dueDate)).calendar(null, {
          sameElse: 'dddd, MMMM D, YYYY h:mm A'
        })
        : this.$dayjs(this.$dayjs(this.todo.dueDate)).fromNow()

      this.due.date =
        parsedDate === 'NaN years ago'
          ? null
          : `Due date ${toBeVerb} ${parsedDate}`
    },

    toggleNewPopUpCard ({ status, todoId }) {
      if (todoId !== this.id) return

      const cardFlipState = this.$Flip.getState(`#search-box, #card${this.id}wrapper`)
      this.updateBackdrop(status)
      if (status) {
        this.todoInfoBeforePop = cloneDeep(this.todo)
        this.searchBoxRef.classList.add('popup')
        this.cardWrapperRef.style.display = 'block'

        this.addStep()
      } else {
        this.searchBoxRef.classList.remove('popup')
        this.cardWrapperRef.style.display = 'none'
        this.restForm()
        // this.todo = cloneDeep(this.todoInfoBeforePop)
        // if (!isEqual(this.todo, this.todoInfoBeforePop)) {
        // //   // this.updateStepsOrder()
        // //   // this.updateTodoAndFetch()
        // //   // this.parseDueDate()
        // }
      }

      this.$Flip.from(cardFlipState, {
        duration: 0.27,
        props: 'backgroundColor,border',
        ease: 'power2.out',
        absolute: true,
        fade: true,
        zIndex: 2000,
        toggleClass: 'flipping',
        scale: true
      })
    },
    togglePopUpCard ({ status, todoId }) {
      if (todoId !== this.id) return

      const cardFlipState = this.$Flip.getState(this.cardWrapperRef)
      this.updateBackdrop(status)

      if (status) {
        this.todoInfoBeforePop = cloneDeep(this.todo)
        this.cardParentRef.style.height = `${this.cardParentRef.offsetHeight}px`
        this.popUpContainerRef.appendChild(this.cardWrapperRef)
        this.addStep()
      } else {
        this.cardParentRef.appendChild(this.cardWrapperRef)
        this.todo.steps.pop()

        if (!isEqual(this.todo, this.todoInfoBeforePop)) {
          this.updateStepsOrder()
          this.updateTodoAndFetch()
          this.parseDueDate()
        }
      }

      const onComplete = () => {
        if (status) {
          this.$refs[`title${this.id}`].focus()
        } else {
          this.cardParentRef.style.height = 'initial'
        }
      }

      this.$Flip.from(cardFlipState, {
        // paused: true,
        targets: this.cardWrapperRef,
        duration: 0.27,
        ease: 'power2.out',
        absolute: true,
        zIndex: 2000,
        toggleClass: 'flipping',
        onComplete,
        scale: true
      })
    },
    shake () {
      this.$gsap.fromTo(
        this.cardWrapperRef,
        { x: -5 },
        {
          duration: 0.01,
          x: 5,
          clearProps: 'x',
          repeat: 30,
          onComplete: () =>
            this.updateCardIsShaking({ status: false, todoId: null })
        }
      )
    },
    async submitAddTodo () {
      this.validateTitle()
      if (this.titleIsNotValid) {
        this.shake()
        return
      }
      try {
        this.todo.steps.pop()
        await this.addTodo(this.todo)
        this.closeForm()
      } catch (error) {
      }
    },
    closeForm () {
      this.updateBackdrop(false)
      this.updateCardPoppedUp({
        status: false,
        todoId: this.cardPoppedUp.todoId
      })
      this.restForm()
    },
    restForm () {
      this.titleIsNotValid = false
      this.todo = cloneDeep(this.todoInfoBeforePop)
    },
    popUp () {
      this.updateCardPoppedUp({ status: true, todoId: this.id })
    },
    deleteStep (index) {
      this.todo.steps.splice(index, 1)
    },
    addStep () {
      this.todo.steps.push({
        order: this.todo.steps.length + 1,
        text: '',
        done: false
      })
      this.updateStepsOrder()
    },
    updateStepsOrder () {
      for (let i = 0; i < this.todo.steps.length; i++) {
        this.todo.steps[i].order = i + 1
      }
    },
    validateTitle () {
      // if (!this.editModeIsActive || this.addingNewTodo) return
      this.titleIsNotValid = !this.todo.title.trim()
    }
  }
}
</script>
<style lang="sass" scoped>
.disable-card
  position: relative
  pointer-events: none
  opacity: .9
  .is-clickable
    pointer-events: none !important
  .card
    box-shadow: none !important
  &::after
    content: ''
    position: absolute
    left:0
    right:0
    top:0
    bottom:0
    z-index:1
    background: transparent

.border-top
  border-width: 1px 0 0
  border-color: transparent
  border-style: solid
  border-color: rgba(0 0 0 / .05)

.card,
.loading-overlay,
.card-wrapper
  border-radius: 1em

.card-wrapper
  position: relative

.flipping
  // overflow: hidden
// .card
//   // transition: opacity .1s ease
//   opacity: 1
//   .flipping &
//     // transition: opacity 0s ease
//     opacity: 0

.card
  position: relative
  // height: 100%
  &-footer
    position: sticky
    top: 100%
    overflow: hidden
    border-radius: 0 0 1em 1em
    &-item
      // border-radius: 0 0 1em 1em

::v-deep
  .header
    &,
    input
      font-weight: 700 !important
      font-size: 1.5rem !important

  .description
    &,
    input
      font-weight: 700 !important

  input
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
      box-shadow: none
      border-color: rgba(0 0 0 / .25)

  .datepicker
    .dropdown .input[readonly],
    .dropdown-trigger .input[readonly]
      &,
      &:focus
        box-shadow: none
        font-family: monospace !important
        font-weight: bold
        padding: 5px 0 5px 2em

    // .control
    //   > input
    //     font-family: monospace !important
    //     font-weight: bold
    //     padding: 5px 0 5px 2.5em

  .control.has-icons-left .icon,
  .control.has-icons-right .icon
      color: #4a4a4a !important
      height: 2em !important
      left: -.7em !important

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
  // cursor: pointer
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
  // border-bottom-right-radius: 1em
  position: relative
  overflow: hidden
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
