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
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <router-link
            class="navbar-item button is-light"
            to="/login">
            Log in
          </router-link>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
  <!-- </div> -->
</template>
