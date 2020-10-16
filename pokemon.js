const puppeteer = require('puppeteer');

const TEST_CARDS = {
    Charizard : 'Charizard SV49/SV94',
    Umbreon : 'Umbreon SV69/SV94',
}

const SELECTORS = {
    prod_group_menu : '.btn.btn-sm.d-none.d-md-block',
    pokemon_grouping : '.dropdown-item.border-bottom[data-catid="7061"]',
    search_bar : '#search-words',
    card : '.card-text',
    amount : '.d-flex.font-weight-bold.font-default.text-center.align-items-end',
    sale_amount : '#prodContainer > div.row.mt-2 > div.col-12.col-lg-4.col-xl-3.right > div.row.d-none.d-lg-block > div > div > div.card-header.d-flex.align-center.flex-around.p-2 > div.d-flex.font-weight-bold.font-default.text-center.align-items-end > div > span',
    pokemon_card : '.font-weight-bold.font-large.font-md-largest.mt-1',
}

let card_search = search()

async function search() {
    const browser = await puppeteer.launch({
        defaultViewport : {width : 1000, height : 1000},
        headless : true,
        slowMo : 50,
        devtools : true,
    });
    const page = await browser.newPage();
    await page.goto('https://www.trollandtoad.com/');
    await page.waitForSelector(SELECTORS.prod_group_menu);

    await page.hover(SELECTORS.prod_group_menu);
    await page.click(SELECTORS.pokemon_grouping);
    await page.type(SELECTORS.search_bar, TEST_CARDS.Charizard + '\u000d');
    
    await page.waitForSelector(SELECTORS.card);
    await page.click(SELECTORS.card);

    await page.waitForSelector('.d-flex.font-weight-bold.font-default.text-center.align-items-end');
    await page.waitForSelector('.font-weight-bold.font-large.font-md-largest.mt-1');

    let data = await page.evaluate(async(SELECTORS) => {
        const card_name = /.*(?=-)/
        let amount = document.querySelector(SELECTORS.amount)
            .textContent
            .trim();
        let pokemon_card = card_name.exec(document.querySelector(SELECTORS.pokemon_card)
            .textContent)[0]
            .trim();
        
        if(amount.length > 7) {
            amount = document.querySelector(SELECTORS.sale_amount)
                .textContent
                .trim();
        }
        
        data = {
            Amount : amount,
            Pokemon : pokemon_card,
        };
        return data;
    }, SELECTORS);

    console.log(data);

    await page.close();
}