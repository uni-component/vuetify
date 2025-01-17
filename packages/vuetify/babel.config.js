const vuetifyPackage = require('./package.json')

module.exports = {
  assumptions: {
    noDocumentAll: true
  },
  ignore: [/\.d\.ts$/],
  presets: [
    ['@babel/preset-env', {
      modules: false,
    }],
    ['@babel/preset-typescript', {
      jsxPragma: 'h',
      jsxPragmaFrag: 'Fragment',
      allowNamespaces: true
    }],
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        'throwIfNamespace': false,
        'runtime': 'classic',
        'pragma': 'h',
        'pragmaFrag': 'Fragment'
      }
    ],
    ['transform-define', {
      __VUETIFY_VERSION__: vuetifyPackage.version,
      __REQUIRED_VUE__: vuetifyPackage.peerDependencies.vue,
    }],
    ['module-resolver', {
      root: ['.'],
      alias: {
        '@': './src',
      },
    }],
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: { node: true },
          modules: 'commonjs',
        }],
      ],
    },
    lib: {
      ignore: ['**/__tests__'],
      plugins: [
        ['babel-plugin-add-import-extension', { extension: 'mjs' }],
        ['./build/babel-plugin-replace-import-extension', { extMapping: {
          '.sass': '.css',
          '.scss': '.css',
        }}],
      ],
    },
  },
}
