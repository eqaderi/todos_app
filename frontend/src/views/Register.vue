<template>
  <div class="columns is-tablet is-centered">
    <div class="box column is-6 is-5-desktop is-4-widescreen p-6">
      <h1 class="is-size-2 mb-6">Sign up</h1>
      <form @submit.prevent="submitRegister">
        <b-field
          label="Name"
          horizontal>
          <b-input
            v-model="username"
            icon="account-outline"
            type="text"
            expanded />
        </b-field>

        <b-field
          label="Password"
          horizontal>
          <b-input
            v-model="password"
            type="password"
            icon="form-textbox-password"
            expanded
            password-reveal />
        </b-field>
        <b-field class="has-text-right mt-6">
          <button
            class="button is-primary"
            type="submit">
            Sign up
          </button>
        </b-field>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions([
      'register'
    ]),
    submitRegister () {
      this.register({ username: this.username, password: this.password }).then(() => {
        this.$router.push({ name: 'Todos' })
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.label
  min-width: 76px

.is-centered
  height: 100vh
  display: flex
  align-items: center
</style>
