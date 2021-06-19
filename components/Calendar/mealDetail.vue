<template>
  <div class="text-center">
    <v-dialog :value="value" class="mx-auto" max-width="80vh" persistent>
      <v-card>
        <v-container fluid>
          <v-row justify="space-between" align="center" class="px-5">
            <v-btn icon class="visible">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card-title class="ay-color--grey-7 ay-text--basic">
              食事内容
            </v-card-title>
            <v-btn icon @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
          <v-row class="imgContainer" justify="center">
            <v-img
              :src="selectedEvent.mealImagePath"
              aspect-ratio="3"
              contain
            />
            <!-- <amplify-s3-image
              v-if="
                selectedEvent.mealImagePath !== null &&
                  selectedEvent.mealImagePath !== ''
              "
              style="--height: 100%; --width: 100%;"
              :img-key="selectedEvent.mealImagePath"
            /> -->
          </v-row>
          <v-row class="pr-5 pl-5">
            <v-card-text class="d-flex justify-center">
              <span class="ay-color--grey-7 ay-text--basic">
                {{ selectedEvent.recordAt }}
              </span>
            </v-card-text>
            <v-card-text class="d-flex justify-center pt-0">
              <v-btn
                icon
                height="auto"
                width="24"
                class="mx-2"
                disabled
              >
                <v-img :src="selectedEvent.icon" />
              </v-btn>
              <span
                class="ma-0 ay-color--orange ay-text--basic"
                :style="{
                  alignSelf:
                    selectedEvent.icon ===
                    '/Vital/meal/path1606.png'
                      ? 'flex-end'
                      : 'center',
                }"
              >
                {{ selectedEvent.mMealtimeName }}
              </span>
            </v-card-text>
            <v-card-text class="ay-color--grey-7 ay-text--info">
              <span v-for="n in 4" :key="n">
                {{ selectedEvent.euText }}
                <br>
              </span>
            </v-card-text>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import '@aws-amplify/ui-vue'
export default {
  props: {
    selectedEvent: {
      type: Object,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog () {
      this.$emit('eventCloseDialog')
    }
  }
}
</script>

<style lang="sass" scoped>
.visible
    visibility: hidden
.imgContainer
    background: #FBE3C2
</style>
