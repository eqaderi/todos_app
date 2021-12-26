<template>
  <div class="columns is-tablet is-centered">
    <div class="box column is-6 is-5-desktop is-4-widescreen p-6">
      <h1 class="is-size-2 mb-6">Log in</h1>
      <form>
        <b-field
          label="Name"
          horizontal>
          <b-input
            v-model="name"
            icon="account-outline"
            type="text"
            expanded />
        </b-field>

        <b-field
          label="Email"
          horizontal>
          <b-input
            type="email"
            icon="email-outline"
            value="john@"
            maxlength="30"
            expanded />
        </b-field>

        <b-field
          label="Password"
          horizontal>
          <b-input
            type="password"
            icon="form-textbox-password"
            value="iwantmytreasure"
            expanded
            password-reveal />
        </b-field>
        <b-field class="has-text-right mt-6">
          <button class="button is-primary">Log in</button>
        </b-field>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: 'John Silver'
    }
  }
}
</script>
<style lang="scss" scoped>
.label {
  min-width: 76px;
}
</style>
