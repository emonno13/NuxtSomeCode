<template>
  <v-menu
    :value="value"
    :close-on-content-click="false"
    :activator="selectedElement"
    offset-y
    top
    :nudge-left="`${centerMenu}`"
  >
    <v-card
      color="transparent"
      class="d-flex justify-center test"
      :elevation="0"
      height="20vh"
      width="25vw"
    >
      <div class="arrow_box">
        <v-row justify="center" class="pt-2">
          <v-col cols="12" xs="4" sm="4" md="4" lg="4">
            <v-img
              :src="selectedEvent.mealImagePath"
              aspect-ratio="2"
              height="11vh"
            />

            <!-- <amplify-s3-image
              v-if="
                selectedEvent.mealImagePath !== null &&
                  selectedEvent.mealImagePath !== ''
              "
              style="--height: 11vh; --width: 100%;"
              :img-key="selectedEvent.mealImagePath"
            /> -->
          </v-col>
          <v-col
            class="pl-0"
            cols="12"
            xs="7"
            sm="7"
            md="7"
            lg="7"
          >
            <p class="ay-color--grey-7 ay-text--info mt-0">
              {{ selectedEvent.recordAt }}
            </p>
            <div class="box">
              <p
                class="line-clamp ay-text--small ay-color--grey-6 mt-0"
              >
                <span v-for="n in 4" :key="n">
                  {{ selectedEvent.euText }}
                  <br>
                </span>
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    selectedElement: {
      type: undefined,
      default: null
    },
    selectedEvent: {
      type: Object,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    centerMenu () {
      return this.$vuetify.breakpoint.width / 11 + 'px'
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="sass" scoped>

.v-menu__content
    box-shadow: none !important
.test
    display: block
    float: left
    width:20%
    padding:0px
    margin:0px
    overflow: hidden
.arrow_box
    height: 80%
    width: 100%
    position: relative
    box-sizing: border-box
    background: #FFFFFF
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)
    &:after
        top: 100%
        left: 45%
        content: ' '
        height: 0
        width: 0
        position: absolute
        pointer-events: none
        box-sizing: border-box
        border-top: 1em solid black
        border-right: 1em solid black
        border-left: 1em solid black
        border-bottom: 1em solid black
        border-color: transparent transparent #FFFFFF #FFFFFF
        transform-origin: 0 0
        transform: rotate(-45deg)
        box-shadow: -3px 3px 3px 0 rgba(0,0,0,0.16)

.block-with-text
  --max-lines:2
  overflow: hidden
  position: relative
  line-height: 1.2em
  max-height: calc(1.2em * var(--max-lines))
  text-align: justify
  margin-right: -1em
  padding-right: 1em
  &:before
    content: '...'
    position: absolute
    right: 3px
    bottom: 0
  &:after
    content: ''
    position: absolute
    right: 0
    width: 1em
    height: 1em
    margin-top: 0.2em
    background: white

.box p
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
.line-clamp
  color: #ABA7A4
</style>
