<template>
  <v-app dark="">
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      height="100%"
    >
      <v-layout column>
        <v-app-bar height="50%" color="red lighten-1">
          <h1 class="white--text ml-5">
            QLNNL
          </h1>
          <h1 v-if="!$route.params.id" class="white--text ml-5">
            {{ $nuxt.$route.name }}
          </h1>
          <h1 v-else class="white--text ml-5">
            {{ $nuxt.$route.name.replace('id','')+ $route.params.id }}
          </h1>
        </v-app-bar>
        <v-app-bar height="50%" color="blue lighten-2">
          <template v-for="route in routes">
            <!-- <div v-if="route.name === 'Category'" :key="route.name">
              <a class="text-decoration-none white--text ml-5">{{ route.name }}</a>
            </div> -->
            <v-menu v-if="route.name === 'Category'" :key="route.name" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <a
                  v-bind="attrs"
                  class="text-decoration-none ml-5"
                  v-on="on"
                >{{ route.name }}</a>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in categoryList"
                  :key="index"
                >
                  <v-list-item-title>
                    <nuxt-link
                      :to="item.path"
                      class="text-decoration-none"
                    >
                      {{ item.name }}
                    </nuxt-link>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <div v-else :key="route.name">
              <nuxt-link
                :to="route.path"
                exact
                class=" text-decoration-none ml-5"
              >
                {{ route.name }}
              </nuxt-link>
            </div>
          </template>
        </v-app-bar>
      </v-layout>
    </v-app-bar>
    <v-main>
      <!-- <v-container>
        <nuxt />
      </v-container> -->
      <nuxt />
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  middleware: 'authenticated',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      routes: [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'About', path: '/about' },
        { name: 'Chart', path: '/chart' },
        { name: 'Calendar', path: '/calendar' },
        { name: 'Category', path: '/null' },
        { name: 'CSV', path: '/csv' }
      ],
      categoryList: [
        { name: 'Fashion', path: '/category/fashion' },
        { name: 'Foods', path: '/category/foods' },
        { name: 'Art', path: '/category/art' },
        { name: 'Music', path: '/category/music' }
      ]
    }
  },
  computed: {
    routeName () {
      return this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
a:hover {
  color: red ;
}
.nuxt-link-exact-active {
    font-weight: bold;
    color: red ;
    display: block
}
</style>
