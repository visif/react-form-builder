import xss from 'xss'

const myxss = new xss.FilterXSS({
  whiteList: {
    a: ['href', 'title', 'target'],
    u: [],
    ins: [],
    br: [],
    b: [],
    i: [],
    ol: ['style'],
    ul: ['style'],
    li: [],
    p: ['style'],
    sub: [],
    sup: [],
    div: ['style'],
    em: [],
    strong: [],
    span: ['style'],
  },
})

export default myxss
