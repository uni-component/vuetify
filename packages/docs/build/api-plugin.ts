// Imports
import fs from 'fs'
import path, { resolve } from 'path'
import { startCase } from 'lodash'
import rimraf from 'rimraf'
import { getCompleteApi } from '@vuetify/api-generator'
import locales from '../src/i18n/locales.json'
import pageToApi from '../src/data/page-to-api.json'
import type { Plugin } from 'vite'

const localeList = locales
  .filter(item => item.enabled)
  .map(item => item.alternate || item.locale)

function genApiLinks (component: string, header: string) {
  const links = (Object.keys(pageToApi) as (keyof typeof pageToApi)[])
    .filter(page => pageToApi[page].includes(component))
    .reduce<string[]>((acc, href) => {
      const name = href.split('/')[1]
      acc.push(`- [${startCase(name)}](/${href})`)
      return acc
    }, [])

  if (!links.length || !header) return ''

  const section = [
    `## ${header} {#links}`,
    links.join('\n'),
  ]

  return `${section.join('\n\n')}\n\n`
}

function genFrontMatter (component: string) {
  const fm = [
    `title: ${component} API`,
    `description: API for the ${component} component.`,
    `keywords: ${component}, api, vuetify`,
  ]

  return `---\nmeta:\n${fm.map(s => '  ' + s).join('\n')}\n---`
}

function genHeader (component: string) {
  const header = [
    genFrontMatter(component),
    `# ${component} API`,
    // '<entry-ad />', TODO: enable when component exists
  ]

  return `${header.join('\n\n')}\n\n`
}

function genFooter () {
  const footer = [
    '<backmatter />',
  ]

  return `${footer.join('\n\n')}\n`
}

const sanitize = (str: string) => str.replace(/\$/g, '')

function loadMessages (locale: string) {
  const prefix = path.resolve('./src/i18n/messages/')
  const fallback = require(path.join(prefix, 'en.json'))

  try {
    const messages = require(path.join(prefix, `${locale}.json`))

    return {
      ...fallback['api-headers'],
      ...(messages['api-headers'] || {}),
    }
  } catch (err) {
    return fallback['api-headers']
  }
}

function createMdFile (component: string, data: Record<string, any>, locale: string) {
  const messages = loadMessages(locale)
  let str = ''

  str += genHeader(component)
  str += genApiLinks(component, messages.links)

  for (const section of ['props', 'functions', 'events', 'slots', 'sass', 'options', 'argument', 'modifiers']) {
    if (Array.isArray(data[section]) && data[section].length) {
      str += `## ${messages[section]} {#${section}}\n\n`
      str += `<api-section name="${component}" section="${section}" />\n\n`
    }
  }

  str += genFooter()

  return str
}

function writeFile (componentName: string, componentApi: Record<string, any>, locale: string) {
  const folder = `src/api/${locale}`

  if (!fs.existsSync(resolve(folder))) {
    fs.mkdirSync(resolve(folder), { recursive: true })
  }

  fs.writeFileSync(resolve(`${folder}/${sanitize(componentName)}.md`), createMdFile(componentName, componentApi, locale))
}

function writeData (componentName: string, componentApi: Record<string, any>) {
  const folder = `src/api/data`

  if (!fs.existsSync(resolve(folder))) {
    fs.mkdirSync(resolve(folder), { recursive: true })
  }

  fs.writeFileSync(resolve(`${folder}/${componentName}.json`), JSON.stringify(componentApi, null, 2))
}

function generateFiles () {
  const api: Record<string, any>[] = getCompleteApi(localeList)

  for (const locale of localeList) {
    const pages = {} as Record<string, any>

    for (const item of api) {
      writeFile(item.name, item, locale)

      pages[`/${locale}/api/${sanitize(item.name)}/`] = item.name
    }

    fs.writeFileSync(resolve(`src/api/${locale}/pages.json`), JSON.stringify(pages, null, 2))
    fs.writeFileSync(resolve(`src/api/${locale}.js`), `export default require.context('./${locale}', true, /\\.md$/)`)
  }

  for (const item of api) {
    writeData(item.name, item)
  }

  fs.writeFileSync(resolve(`src/api/sass.json`), JSON.stringify([
    ...api.filter(item => item && item.sass && item.sass.length > 0).map(item => item.name),
  ]))
}

export default function Api (): Plugin {
  return {
    name: 'vuetify:api',
    configResolved () {
      rimraf.sync(resolve('src/api'))

      generateFiles()
    },
  }
}
