const path = require('path')

module.exports = {
  mainSrcDir: 'electron',
  rendererSrcDir: '.',

  webpack: (defaultConfig) => {
    defaultConfig.resolve = {
      ...defaultConfig.resolve,
      alias: {
        ...defaultConfig.resolve.alias,
        '@/config': path.resolve(__dirname, 'config'),
        '@/config/*': path.resolve(__dirname, 'config/*'),
        '@/models': path.resolve(__dirname, 'models'),
        '@/models/*': path.resolve(__dirname, 'models/*'),
        '@/templates': path.resolve(__dirname, 'templates'),
        '@/templates/*': path.resolve(__dirname, 'templates/*'),
        '@/plugins': path.resolve(__dirname, 'plugins'),
        '@/plugins/*': path.resolve(__dirname, 'plugins/*'),
        '@/api': path.resolve(__dirname, 'src/api'),
        '@/api/*': path.resolve(__dirname, 'src/api/*'),
        '@/auth': path.resolve(__dirname, 'src/auth'),
        '@/auth/*': path.resolve(__dirname, 'src/auth/*'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/components/*': path.resolve(__dirname, 'src/components/*'),
        '@/database': path.resolve(__dirname, 'src/database'),
        '@/database/*': path.resolve(__dirname, 'src/database/*'),
        '@/lib': path.resolve(__dirname, 'src/lib'),
        '@/lib/*': path.resolve(__dirname, 'src/lib/*'),
        '@/pages': path.resolve(__dirname, 'src/pages'),
        '@/pages/*': path.resolve(__dirname, 'src/pages/*'),
        '@/route': path.resolve(__dirname, 'src/route'),
        '@/route/*': path.resolve(__dirname, 'src/route/*'),
        '@/services': path.resolve(__dirname, 'src/services'),
        '@/services/*': path.resolve(__dirname, 'src/services/*'),
        '@/store': path.resolve(__dirname, 'src/store'),
        '@/store/*': path.resolve(__dirname, 'src/store/*'),
        '@/styles': path.resolve(__dirname, 'src/styles'),
        '@/styles/*': path.resolve(__dirname, 'src/styles/*')
      }
    }

    return defaultConfig
  }
}
