import defaultSettings from '@/settings'

const title = defaultSettings.title || '演训产品中心API'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
