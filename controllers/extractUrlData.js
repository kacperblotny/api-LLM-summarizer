const puppeteer = require('puppeteer')

async function extractUrlData(url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    const text = await page.evaluate(() => {
      // only extract text
      const bodyText = document.body.innerText

      return bodyText.replace(/\s+/g, ' ').trim()
    })

    return text
  } catch (error) {
    return ''
  } finally {
    await browser.close()
  }
}

module.exports = {
  extractUrlData,
}
