<template>
  <v-menu
    close-delay="100"
    max-height="500"
    open-delay="60"
    :open-on-hover="false"
    transition="slide-y-transition"
    anchor="bottom"
  >
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }" />
    </template>
    <app-sheet>
      <slot v-if="$slots.default" />

      <app-list
        v-else
        :items="items"
      />
    </app-sheet>
  </v-menu>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import AppList from '@/components/app/list/List.vue'

  // Components
  export default defineComponent({
    name: 'AppMenu',

    components: { AppList },

    props: {
      items: {
        type: Array,
        default: () => ([]),
      },
    },
  })
</script>
