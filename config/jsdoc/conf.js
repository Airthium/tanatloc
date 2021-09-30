module.exports = {
  source: {
    include: ['.'],
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
  plugins: ['plugins/markdown'],
  opts: {
    destination: './doc',
    recurse: true,
    readme: 'README.md',
    template: './node_modules/air-jsdoc-template'
  },
  templateOptions: {
    icon: './public/images/icon.png',
    title: 'Tanatloc',
    subTitle: 'See the world the way it really is!',
    // staticDirectories: ['./public'],
    // favicon: './public/images/icon.png',
    // title: `
    // <div style='display: flex; flex-direction: column; align-items: space-around; padding: 16px;'>
    //   <div style='display: flex; justify-content: space-around; align-items: center;'>
    //     <img alt='Tanatloc' src='./public/images/icon.png' width='64px' height='64px'/>Tanatloc
    //   </div>
    //   <div style='display: flex; justify-content: center; color: gray; font-size: small;'>
    //     See the world the way it really is!
    //   </div>
    // </div>
    // `,
    footer: 'Tanatloc - See the world the way it really is! - Copyright © 2021'
    // menu: [
    //   {
    //     title: '[private] Github repository',
    //     id: 'github',
    //     link: 'https://github.com/Airthium/tanatloc-ssr'
    //   },
    //   {
    //     title: '[private] SonarCloud',
    //     id: 'sonarcloud',
    //     link: 'https://sonarcloud.io/project/overview?id=Airthium_tanatloc-ssr'
    //   }
    // ]
  }
}
