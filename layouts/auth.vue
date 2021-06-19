<template>
  <v-app dark>
    <v-container>
      <v-main>
        <nuxt />
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
export default {
  middleware: 'notAuthenticated'
}
</script>

<style>

</style>
