const { chromium } = require('playwright')

async function extractUrlData(url) {
  let browser
  try {
    browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    const text = await page.evaluate(() => {
      return document.body.innerText.replace(/\s+/g, ' ').trim()
    })
    console.log(text)

    return text
  } catch (error) {
    return ''
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

module.exports = {
  extractUrlData,
}

// // const puppeteer = require('puppeteer')

// async function extractUrlData(url) {
//   return url
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()

//   try {
//     await page.goto(url, { waitUntil: 'domcontentloaded' })

//     const text = await page.evaluate(() => {
//       // only extract text
//       const bodyText = document.body.innerText

//       return bodyText.replace(/\s+/g, ' ').trim()
//     })

//     return text
//   } catch (error) {
//     return ''
//   } finally {
//     await browser.close()
//   }
// }

// module.exports = {
//   extractUrlData,
// }
