<template>
  <b-navbar
    fixed-top
    wrapper-class="container">
    <template #start>
      <router-link
        class="navbar-item"
        to="/todos">
        Todos
      </router-link>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <router-link
            v-if="!currentUser.access_token && $route.name !== 'Register'"
            class="button is-primary is-rounded"
            to="/register">
            Sign up
          </router-link>
          <router-link
            v-if="!currentUser.access_token && $route.name !== 'Login'"
            class="navbar-item button is-light is-rounded"
            to="/login">
            Log in
          </router-link>
          <button
            v-if="currentUser.access_token"
            class="navbar-item button is-light is-rounded"
            @click="logout">
            Log out
          </button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: mapState(['currentUser']),
  methods: mapActions(['logout'])
}
</script>
