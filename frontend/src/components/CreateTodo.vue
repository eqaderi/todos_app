<template>
  <div>
    <section class="hero is-medium">
      <div class="hero-body">
        <div class="container has-text-centered">
          <p class="title is-size-1 has-text-weight-normal is-family-primary pb-4">
            My Todos !
          </p>
          <p class="subtitle">
            A fun to use todo app to accomplish more and get organized.
          </p>
          <div class="columns is-tablet is-centered pt-5">
            <div
              class="column is-half">
              <div class="is-flex is-justify-content-space-between is-align-items-center">
                <b-input
                  v-model="searchPhraseC"
                  class="is-flex-grow-1"
                  placeholder="Search for todos in titles and desc..."
                  size="is-medium"
                  rounded
                  autofocus />
                <b-button
                  class="ml-5"
                  size="is-medium"
                  icon-left="plus"
                  rounded>
                  Add a new one
                </b-button>
              </div>
            </div>

            <!-- <TodoCard /> -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import TodoCard from './TodoCard.vue'
export default {
  // components: { TodoCard },
  props: {
    searchPhrase: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newTodo: {
        id: 0,
        createdAt: null,
        color: '#ffffff',
        title: '',
        description: '',
        steps: [
          {
            order: null,
            text: '',
            done: false
          }
        ],
        dueDate: null,
        done: false
      }
    }
  },
  computed: {
    searchPhraseC: {
    // getter
      get: function () {
        return this.searchPhrase
      },
      // setter
      set: function (newValue) {
        this.$emit('update:search-phrase', newValue)
      }
    }
  }

}
</script>

<style lang="sass" scoped>

</style>
