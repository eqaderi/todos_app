<template>
  <!-- <div class="container"> -->
  <b-navbar
    fixed-top
    wrapper-class="container">
    <template #brand>
      <b-navbar-item
        tag="router-link"
        :to="{ path: '/' }">
        <img
          src="@/assets/logo.svg"
          alt="Todos app"
          class="is-full-width">
      </b-navbar-item>
    </template>
    <template #start>
      <router-link
        class="navbar-item"
        to="/">
        Home
      </router-link>
      <router-link
        class="navbar-item"
        to="/about">
        About
      </router-link>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <router-link
            class="button is-primary is-rounded"
            to="/signup">
            Sign up
          </router-link>
          <router-link
            class="navbar-item button is-light is-rounded"
            to="/login">
            Log in
          </router-link>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
  <!-- </div> -->
</template>
