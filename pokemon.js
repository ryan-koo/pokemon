const puppeteer = require('puppeteer');

const TEST_CARDS = {
    Charizard : 'Charizard SV49/SV94',
    Umbreon : 'Umbreon SV69/SV94',
}

const URLS = {
    tt : 'https://www.trollandtoad.com/',
    tcg : 'https://www.tcgplayer.com/',
}

const SELECTORS = {
    TT : {
        prod_group_menu : '.btn.btn-sm.d-none.d-md-block',
        pokemon_grouping : '.dropdown-item.border-bottom[data-catid="7061"]',
        search_bar : '#search-words',
        card : '.card-text',
        amount : '.d-flex.font-weight-bold.font-default.text-center.align-items-end',
        sale_amount : '#prodContainer > div.row.mt-2 > div.col-12.col-lg-4.col-xl-3.right > div.row.d-none.d-lg-block > div > div > div.card-header.d-flex.align-center.flex-around.p-2 > div.d-flex.font-weight-bold.font-default.text-center.align-items-end > div > span',
        pokemon_card : '.font-weight-bold.font-large.font-md-largest.mt-1',
    },
    TCG : {
        search_bar : '.input',
        card_nums : '.search-result__rarity',
        pagination : '.pagination__arrow'
    }
}

open_browser();

async function open_browser() {
    const browser = await puppeteer.launch({
        defaultViewport : {width : 1000, height : 1000},
        headless : false,
        slowMo : 50,
        devtools : true,
    });
    const page = await browser.newPage();

    let tt_data = await trollandtoad(page);
    console.log(tt_data);

    let tcg_data = await tcg_player(page, tt_data);
    // console.log(tcg_data)
}

async function trollandtoad(page) {
    
    await page.goto(URLS.tt);
    await page.waitForSelector(SELECTORS.TT.prod_group_menu);

    await page.hover(SELECTORS.TT.prod_group_menu);
    await page.click(SELECTORS.TT.pokemon_grouping);
    await page.type(SELECTORS.TT.search_bar, TEST_CARDS.Charizard + '\u000d');
    
    await page.waitForSelector(SELECTORS.TT.card);
    await page.click(SELECTORS.TT.card);

    await page.waitForSelector('.d-flex.font-weight-bold.font-default.text-center.align-items-end');
    await page.waitForSelector('.font-weight-bold.font-large.font-md-largest.mt-1');

    let data = await page.evaluate(async(SELECTORS) => {
        const card_name = /^.*?(?=-)/;
        const card_rarity = /(?<=\-)(.*?)(?=\-)/;
        let amount = document.querySelector(SELECTORS.TT.amount)
            .textContent
            .trim();
        let pokemon_card = card_name.exec(document.querySelector(SELECTORS.TT.pokemon_card)
            .textContent)[0]
            .trim();
        let card_num = card_rarity.exec(document.querySelector(SELECTORS.TT.pokemon_card)
            .textContent)[0]
            .trim();
        
        if(amount.length > 7) {
            amount = document.querySelector(SELECTORS.TT.sale_amount)
                .textContent
                .trim();
        }
        
        data = {
            Source : 'Troll and Toad',
            Amount : amount,
            Pokemon : pokemon_card,
            Card_Number : card_num,
        };

        return data;
    }, SELECTORS);

    return data;
}

async function tcg_player(page, tt_data) {
    await page.goto(URLS.tcg);
    await page.waitForSelector(SELECTORS.TCG.search_bar);

    await page.type(SELECTORS.TCG.search_bar, tt_data.Pokemon + '\u000d');
    await page.waitForSelector(SELECTORS.TCG.pagination);

    let data = await page.evaluate(async (SELECTORS, tt_data) => {
        const card_rarity = /[\da-zA-Z\/]/ // Ask alex about card rarity numbers [A-Z]{1,2}\d{1,2}
        let card_numbers = document.querySelectorAll(SELECTORS.TCG.card_nums);
        let i = 0;
        console.log(card_numbers);
        while(card_rarity.exec(card_numbers[i].textContent) != tt_data.Card_Number) {
            console.log(card_numbers)[i]
            i++;
        }

        card_numbers[i].click()

    }, SELECTORS, tt_data);
}