interface Metadata {
  title: string
  description: string
  keywords: string
}

export function genAppMetaInfo (defaults: any) {
  const metadata = (genMetaInfo as any)(...Object.values(defaults))

  metadata.link.push(...genLink())
  metadata.meta.push(...genMeta())

  return metadata
}

export function genMetaInfo (
  title: string,
  description: string,
  keywords: string,
) {
  const length = description.length

  description = length <= 117
    ? description
    : `${description.slice(0, 116)}...`

  const options = {
    description,
    keywords,
    title,
  }

  return {
    link: [] as (Record<string, any>[]),
    meta: [
      { key: 'description', name: 'description', content: description },
      { key: 'keywords', name: 'keywords', content: keywords },
      ...genFacebookMetaInfo(),
      ...genOpenGraphMetaInfo(options),
      ...genTwitterMetaInfo(),
    ] as (Record<string, any>[]),
    title,
  }
}

function genFacebookMetaInfo () {
  return parseMeta('fb', { app_id: '542948969434243' })
}

function genLink () {
  const rels = ['preconnect', 'dns-prefetch']
  const hrefs = [
    'https://api.cosmicjs.com/',
    'https://cdn.carbonads.com/',
    'https://srv.carbonads.net/',
    'https://www.google-analytics.com/',
  ]
  const link = [
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/manifest.json' },
    {
      rel: 'search',
      type: 'application/opensearchdescription+xml',
      href: '/search.xml',
      title: 'Vuetify',
    },
  ]

  for (const rel of rels) {
    for (const href of hrefs) {
      link.push({ rel, href })
    }
  }

  return link
}

function genOpenGraphMetaInfo (args: Metadata) {
  return parseMeta('og', {
    description: args.description,
    image: 'https://cdn.vuetifyjs.com/images/logos/vuetify-logo-300.png',
    site_name: 'Vuetify',
    title: args.title,
    type: 'website',
  })
}

function parseMeta (
  prefix: string,
  metadata: Record<string, string>,
) {
  const meta = []

  for (const key in metadata) {
    const content = metadata[key]
    const property = `${prefix}:${key}`

    meta.push({
      key: property,
      property,
      content,
    })
  }

  return meta
}

function genMeta () {
  return [
    { charset: 'utf-8' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5, minimal-ui',
    },
  ]
}

function genTwitterMetaInfo () {
  return parseMeta('twitter', {
    card: 'https://cdn.vuetifyjs.com/images/logos/vuetify-logo-300.png',
    domain: 'https://vuetifyjs.com/',
    site: 'Vuetify',
  })
}
