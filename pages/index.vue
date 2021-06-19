<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="text-center">
        <h1>Landing page</h1>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  components: {},
  middleware ({ store, redirect }) {
    if (!store.state.token) {
      return redirect('/login')
    } else {
      return redirect('/dashboard')
    }
  }
}
</script>
