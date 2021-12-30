<template>
  <div class="parent p-3">
    <!-- <div class="is-flex is-align-items-center p-4">
      <span class="mr-5 has-text-weight-bold">Color:</span>
      <ColorElement
        :color="colorModel"
        border-color="#ffffff"
        class="p-4" />
    </div> -->
    <div class="is-flex is-flex-wrap-wrap">
      <ColorElement
        v-for="cl in colors"
        :key="cl"
        :color="cl"
        border-color="#ffffff"
        class="m-4"
        @click.native="() => setColor(cl)" />
    </div>
  </div>
</template>

<script>
import ColorElement from './ColorElement.vue'
export default {
  components: {
    ColorElement
  },
  props: {
    color: {
      type: String,
      default: '#ff0000'
    },
    borderColor: {
      type: String,
      default: '#ff0000'
    }
  },
  data () {
    return {
      colors: [
        '#a18cd1',
        '#b12a5b',
        '#84fab0',
        '#8fd3f4',
        '#00f2fe',
        '#667eea',
        '#764ba2',
        '#ee609c',
        '#6a11cb',
        '#2575fc',
        '#646464',
        '#f78a9f',
        '#0fa564'
      ]
    }
  },
  computed: {
    colorModel: {
      get: function () {
        return this.color
      },
      set: function (newValue) {
        this.$emit('update:color', newValue)
      }
    }
  },
  methods: {
    setColor (cl) {
      this.colorModel = cl
    }
  }
}
</script>

<style lang="sass" scoped>
.parent
  background-color: #fff
  width: 345px
  border-radius: 1em
  box-shadow: 0px 10px 20px -10px rgb(0 0 0 / 50%)
</style>
