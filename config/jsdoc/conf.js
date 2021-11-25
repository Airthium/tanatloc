module.exports = {
  source: {
    include: ['.'],
    includePattern: '\\.(jsx|js)$',
    exclude: [
      'app',
      'config/jest',
      'config/jsdoc',
      'coverage',
      'dist-server',
      'dist',
      'doc',
      'node_modules',
      '.next',
      'out',
      'modules/three-to-glb/lib/three'
    ],
    excludePattern: '/__tests__/'
  },
  tags: {
    allowUnknownTags: true
  },
  plugins: ['plugins/markdown', 'node_modules/better-docs/typescript'],
  opts: {
    destination: './doc',
    recurse: true,
    readme: 'README.md',
    // template: './node_modules/@airthium/air-jsdoc-template'
    template: 'node_modules/better-docs'
  },
  templateOptions: {
    icon: './public/images/icon.png',
    title: 'Tanatloc',
    subTitle: 'See the world the way it really is!',
    favicon: './public/images/icon.png',
    menu: [
      {
        label: '[private] Github repository',
        link: 'https://github.com/Airthium/tanatloc-ssr'
      },
      {
        label: '[private] SonarCloud',
        link: 'https://sonarcloud.io/project/overview?id=Airthium_tanatloc-ssr'
      }
    ],
    footer: 'Tanatloc - See the world the way it really is! - Copyright © 2021'
  }
}
