<template>
  <v-app-bar
    id="app-bar"
    :color="dark ? undefined : 'white'"
    app
    class="v-bar--underline"
    elevation="1"
  >
    <logo :alt="lgAndUp" />

    <v-spacer />

    <learn-menu />
    <support-menu />
    <team-link />
    <language-menu />
    <settings-toggle />
  </v-app-bar>
</template>

<script lang="ts">
  // Utilities
  import { defineComponent } from 'vue'
  import { useDisplay } from 'vuetify/lib/composables/display.mjs'

  export default defineComponent({
    name: 'AppBar',

    setup () {
      const { lgAndUp } = useDisplay()

      // data
      const dark = false

      return {
        dark,
        lgAndUp,
      }
    },

  })
</script>
