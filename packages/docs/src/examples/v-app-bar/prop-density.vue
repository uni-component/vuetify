<template>
  <v-layout>
    <v-app-bar density="compact" absolute>
      <v-app-bar-title>Vuetify</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn text>Developer</v-btn>

      <v-btn class="mr-3" text>Help</v-btn>

      <v-divider inset vertical></v-divider>

      <v-btn
        class="mr-4 ml-5"
        color="primary"
        plain
      >
        <v-icon left icon="mdi-handshake-outline"></v-icon>

        <span>John Leider</span>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-card height="50px"></v-card>
    </v-main>
  </v-layout>
</template>
