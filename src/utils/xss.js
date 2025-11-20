import xss from 'xss'

// Create a more permissive whitelist based on defaults
const whiteList = { ...xss.whiteList }

// List of tags that should allow style and class attributes
const tagsWithStyle = [
  'a',
  'address',
  'article',
  'aside',
  'b',
  'bdi',
  'bdo',
  'blockquote',
  'br',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'dd',
  'del',
  'details',
  'div',
  'dl',
  'dt',
  'em',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'i',
  'img',
  'ins',
  'li',
  'main',
  'mark',
  'nav',
  'ol',
  'p',
  'pre',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'section',
  'small',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
]

// Ensure all these tags exist in whitelist and have style/class attributes
tagsWithStyle.forEach((tag) => {
  if (!whiteList[tag]) {
    whiteList[tag] = []
  }
  if (!whiteList[tag].includes('style')) {
    whiteList[tag].push('style')
  }
  if (!whiteList[tag].includes('class')) {
    whiteList[tag].push('class')
  }
})

// Add specific attributes for media and links
if (whiteList.a) whiteList.a.push('href', 'title', 'target')
if (whiteList.img) whiteList.img.push('src', 'alt', 'title', 'width', 'height')
if (whiteList.video) whiteList.video.push('src', 'controls', 'width', 'height')

const myxss = new xss.FilterXSS({
  whiteList,
  css: false, // Disable CSS filtering to allow all styles from the rich text editor
  stripIgnoreTag: true, // Filter out tags not in the whitelist
  stripIgnoreTagBody: ['script'], // Filter out script tag content
})

export default myxss
