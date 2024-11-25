const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizeCurrentURL = normalizeURL(currentURL)
    if (pages[normalizeCurrentURL] > 0) {
        pages[normalizeCurrentURL]++
        return pages
    }

    pages[normalizeCurrentURL] = 1
    console.log(`actively crawling: ${currentURL}`)

    try {
        const resp = await fetch(currentURL)

        if (resp.status > 399){
            console.log(`error in fetch with status code: ${resp.status}, on page: ${currentURL}`)
            return
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")){
            console.log(`error in fetch with content-type (non html): ${contentType}, on page: ${currentURL}`)
            return pages
        }

        const htmlBody = await resp.text()

        const nextURLs = UrlFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages)
        }

    } catch(error) {
        console.log(`error in fetch: ${error.message}, on page: ${currentURL}`)
    }
    return pages
}

function UrlFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkEL = dom.window.document.querySelectorAll('a')
    for (const Elem of linkEL) {
        if (Elem.href.slice(0, 1) === '/') {
            // relative
            try {
                const urlObj = new URL(`${baseURL}${Elem.href}`)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with relative url: ${err.message}`)
            }
        } else {
            // absolute
            try {
                const urlObj = new URL(Elem.href)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with absolute url: ${err.message}`)
            }
        }}
    return urls
}

function normalizeURL(urlString) {
    url = new URL(urlString)
    url1 = `${url.hostname}${url.pathname}`
    if (url1.length > 0 && url1.slice(-1) === '/') {
        return url1.slice(0, -1)
    }
    return url1
}

module.exports = {
    normalizeURL,
    UrlFromHTML,
    crawlPage
}