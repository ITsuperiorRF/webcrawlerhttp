const { normalizeURL, UrlFromHTML } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL strip protocole', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
    const input = 'http://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const baseURL = "https://blog.boot.dev"
    const actual = UrlFromHTML(inputHTML, baseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="/path/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const baseURL = "https://blog.boot.dev"
    const actual = UrlFromHTML(inputHTML, baseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML both', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="/path2/">
                Boot.dev Blog path 1
            </a>
            <a href="https://blog.boot.dev/path1/">
                Boot.dev Blog path 2
            </a>
        </body>
    </html>
    `
    const baseURL = "https://blog.boot.dev"
    const actual = new Set(UrlFromHTML(inputHTML, baseURL))
    const expected = new Set(["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"])
    expect(actual).toEqual(expected)
})
test('getURLsFromHTML invalid', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="invalid">
                invalid URL
            </a>
        </body>
    </html>
    `
    const baseURL = "https://blog.boot.dev"
    const actual = UrlFromHTML(inputHTML, baseURL)
    const expected = []
    expect(actual).toEqual(expected)
})