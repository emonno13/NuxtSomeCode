<template>
  <v-text-field
    :value="value"
    :rules="ruleInput"
    :label="label"
    :class="{normalInput:true, greenInput: required}"
    :color="required ? '#ffc0cb' : 'black'"
    outlined
    dense
    hide-details
    @input="$emit('input',$event)"
  />
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'label', 'rules', 'inputName', 'required'],
  data () {
    return {}
  },
  computed: {
    ruleInput () {
      return this.rules
    }
  }
}
</script>

<style lang="scss" scoped>
// ghi đè style mặc định của v-text-fieald
// .normalInput.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)>.v-input__control>.v-input__slot fieldset {
//     color: rgba(0,0,0,.38) !important;
//     border: 2px solid;
// }
// .normalInput.v-text-field--outlined.v-input--is-focused fieldset{
//     color: rgba(0,0,0,.38) !important;
//     border: 2px solid;
// }
// .greenInput.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)>.v-input__control>.v-input__slot fieldset {
//     color: green !important;
//     border: 2px solid;
// }
// .greenInput.v-text-field--outlined.v-input--is-focused fieldset{
//     color:green !important;
//     border: 2px solid;
// }
</style>
