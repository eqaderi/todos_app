<template>
  <div class="parent p-3">
    <div class="is-flex is-flex-direction-row-reverse is-flex-wrap-wrap">
      <b-tooltip
        label="Close swatch"
        type="is-dark">
        <button
          class="delete is-medium"
          style="margin: 1.28rem"
          @click="$emit('close-swatch')" />
      </b-tooltip>
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
import { COLORS } from '@/helpers'
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
      colors: COLORS
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
  position: absolute
  top: 50%
  left: 50%
  transform: translateY(-20%) translateX(-80%)
  background-color: #fff
  width: 345px
  border-radius: 1em
  box-shadow: 0px 10px 20px -10px rgb(0 0 0 / 50%)
  z-index: 2
</style>
