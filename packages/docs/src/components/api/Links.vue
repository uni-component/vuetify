<template>
  <div class="mb-4 d-flex flex-column">
    <div v-for="link in links" :key="link.name">
      <app-link :href="link.href">{{ link.name }}</app-link>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import pageToApi from '@/data/page-to-api.json'

  export default defineComponent({
    name: 'ApiLinks',

    props: {
      path: String,
    },

    setup (props) {
      const route = useRoute()
      const { locale } = useI18n()

      const links = computed(() => {
        const path = props.path || route.path.replace(`/${locale.value}/`, '').replace(/\/$/, '')
        const apis = pageToApi[path] as string[]

        return apis.map(name => ({
          name,
          href: `/${locale.value}/api/${name}`,
        }))
      })

      return {
        links,
      }
    },
  })
</script>
