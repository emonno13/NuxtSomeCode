<template>
  <v-layout column>
    <v-row class="title" justify="center">
      <h1>
        Login
      </h1>
    </v-row>

    <v-form
      ref="form"
      :v-model="true"
      @submit.prevent
    >
      <v-text-field
        v-model="login.email"
        type="text"
        label="Email"
        outlined
      />
      <v-text-field
        v-model="login.password"
        type="password"
        label="Password"
        outlined
      />

      <v-btn color="yoyo" type="submit" @click="userLogin">
        Submit
      </v-btn>
    </v-form>
  </v-layout>
</template>

<script>

export default {

  layout: 'auth',
  data () {
    return {
      login: {
        email: '',
        password: ''

      },
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      select: null,
      selectRules: [v => !!v || 'Item is required'],
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ]
    }
  },
  methods: {
    userLogin () {
      // try {
      //   const response = await this.$auth.loginWith('local', { data: this.login })
      //   console.log(response)
      //   this.$router.push('/')
      // } catch (err) {
      //   console.log(err.response.data.message)
      // }
      this.validate()
      console.log(this.email, this.password)
      const formData = { email: this.login.email, password: this.login.password }
      this.$store.dispatch('login', formData)
    },
    validate () {
      this.$refs.form.validate()
    }
  }
}
</script>

<style lang="scss" scoped >
  .title {
    margin-bottom: 2rem;
  }
</style>
