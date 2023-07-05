//@ts-check
/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
  siteUrl: 'https://tanatloc.com',
  generateRobotsTxt: true,
  exclude: [
    '/dashboard',
    '/editor',
    '/error',
    '/login',
    '/password',
    '/project',
    '/signup',
    '/signup/send',
    '/signup/validation',
    '/start',
    '/webgl'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/doc'],
        disallow: [
          '/dashboard',
          '/editor',
          '/error',
          '/login',
          '/password',
          '/project',
          '/signup',
          '/start',
          '/webgl'
        ]
      }
    ]
  }
}

export default sitemapConfig
