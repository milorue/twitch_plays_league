const puppeteer = require('puppeteer');

(async (test) => {
    const browser = await puppeteer.launch()

    const page = await browser.newPage();

    await page.setViewport({
        width: 2000,
        height: 1000,
        deviceScaleFactor: 1
    })

    await page.goto('https://github.com/Joao-Henrique/React_Express_App_Medium_Tutorial')
    await page.screenshot({path: 'test.png'})
    
})

();