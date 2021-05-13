const scraperObject = {
    url: 'https://www.seminovosmovida.com.br/busca/',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        // Wait for the required DOM to be rendered
        await page.waitForSelector('.mgtp-15');
        
        await autoScroll(page);

        let cards = await page.$$('.custom-card');
        let cars = [];
        for(let card of cards){
            let car = {};
            car["Name"] = await card.$eval('span.roboto-bold-font', text => text.textContent);//await page.evaluate(el => el.getAttribute('class'), card);
            car["SubName"] = await card.$eval('span.roboto-light-font', text => text.textContent); 
            car["Amount"] = await card.$eval('span.price-label', text => text.textContent);
            car["Km"] = await card.$eval('span.span-info1', text => text.textContent);
            car["Year"] = await card.$eval('span.span-info', text => text.textContent);
            //car["Automatic"] = await card.$eval('span.span-info:nth-of-type(2)', text => text.textContent);
            car["City"] = await card.$eval('span.capitalize', text => text.textContent);
            car["State"] = await card.$eval('span.Roboto', text => text.textContent);
            cars.push(car);
        }
        console.log(cars.length);
    }
}

async function autoScroll(page){
    let previousHeight = await page.evaluate('document.body.scrollHeight');
    let nextHeight;
    while (previousHeight != nextHeight){
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.keyboard.down('Control');
        await page.keyboard.press('End');
        await page.keyboard.up('Control');
        await sleep(3000);
        nextHeight = await page.evaluate('document.body.scrollHeight');
        console.log(previousHeight);
        console.log(nextHeight);
    }
    
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   

module.exports = scraperObject;