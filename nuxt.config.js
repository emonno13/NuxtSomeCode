
export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  ssr: false,
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: 'https://vexere-api-060197.herokuapp.com/api/'
  },
  auth: {
    // strategies: {
    //   local: {
    //     endpoints: {
    //       login: { url: 'users/login', method: 'post', propertyName: 'data.token' }
    //       // user: { url: 'me', method: 'get', propertyName: 'data' },
    //       // logout: false
    //     },
    //     tokenRequired: false,
    //     tokenType: false
    //   }
    // }
  },
  /*
  ** Content module configuration
  ** See https://content.nuxtjs.org/configuration
  */
  content: {},
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    // defaultAssets: false,
    theme: {
      options: {
        customProperties: true
      },
      dark: false,
      themes: {
        dark: {
          yoyo: '#BA68C',
          primary: '#4caf50',
          secondary: {
            base: '#ff8c00',
            lighten3: '#ffb700',
            darken3: '#ff6200'
          },
          tertiary: {
            base: '#4682bf',
            lighten3: '#4696bf',
            darken3: '#466ebf'
          },
          accent: '#9c27b0'
        },
        light: {
          yoyo: '#BA68C',
          primary: '#4caf50',
          secondary: {
            base: '#ff8c00',
            lighten3: '#ffb700',
            darken3: '#ff6200'
          },
          tertiary: {
            base: '#4682bf',
            lighten3: '#4696bf',
            darken3: '#466ebf'
          },
          accent: '#9c27b0'
        }
      }
    }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
