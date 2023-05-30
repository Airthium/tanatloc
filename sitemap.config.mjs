//@ts-check
/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
  siteUrl: 'https://tanatloc.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }]
  }
}

export default sitemapConfig
