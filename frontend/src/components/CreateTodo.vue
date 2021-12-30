<template>
  <div>
    <section class="hero is-medium">
      <div class="hero-body">
        <div class="container has-text-centered">
          <p class="title is-size-1 has-text-weight-normal is-family-code pb-4">
            My Todos !
          </p>
          <p class="subtitle">
            A fun to use todo app to accomplish more and get organized.
          </p>
          <div class="columns is-tablet is-centered pt-5">
            <div class="column is-half">
              <div
                class="is-flex is-justify-content-space-between is-align-items-center">
                <b-input
                  id="search-box"
                  v-model="searchPhraseC"
                  data-flip-id="new"
                  class="is-flex-grow-1 search-box"
                  placeholder="Search for todos in titles and desc..."
                  size="is-medium"
                  rounded
                  autofocus />
                <b-button
                  class="ml-5"
                  size="is-medium"
                  icon-left="plus"
                  rounded
                  @click="AddNewTodo">
                  Add a new one
                </b-button>
              </div>

              <div class="is-relative">
                <TodoCard
                  :id="newTodo.id"
                  class="is-absolute"
                  :todop="newTodo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TodoCard from './TodoCard.vue'
export default {
  components: { TodoCard },
  props: {
    searchPhrase: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newTodo: {
        id: 'new',
        createdAt: null,
        color: '#ffffff',
        title: '',
        description: '',
        dueDate: null,
        done: false,
        steps: [
          {
            order: null,
            text: '',
            done: false
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(['todos']),
    searchPhraseC: {
      get: function () {
        return this.searchPhrase
      },
      set: function (newValue) {
        this.$emit('update:search-phrase', newValue)
      }
    }
  },
  methods: {
    ...mapActions(['updateNewTodo', 'updateCardPoppedUp']),
    AddNewTodo () {
      this.$emit('clear-search')
      this.updateCardPoppedUp({ status: true, todoId: this.newTodo.id })
    }
  }
}
</script>

<style lang="sass" scoped>
.is-absolute
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0

#search-box
  &.popup
    visibility: hidden !important

  &,
  &.flipping
  visibility: visible !important

</style>
