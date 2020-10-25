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
        card_set : '.font-small.font-md-default',
    },
    TCG : {
        search_bar : '.input',
        card_nums : '.search-result__rarity',
        pagination : '.pagination__arrow',
        amount : '.seller-spotlight__price',
        pokemon_card : '.product-details__name',
        card_set : '.product-details__set',
        comments_btn : '.btn.btn-block.btn-primary',
    }
}

open_browser();

async function open_browser() {
    const browser = await puppeteer.launch({
        defaultViewport : {width : 1000, height : 1080},
        headless : false,
        slowMo : 50,
        devtools : true,
    });
    const page = await browser.newPage();

    let tt_data = await trollandtoad(page);
    console.log(tt_data);

    let tcg_data = await tcg_player(page, tt_data);
    console.log(tcg_data)
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
        let card_set = document.querySelector(SELECTORS.TT.card_set)
            .textContent
            .trim()
        
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
            Card_Set : card_set,
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

await page.evaluate(async (SELECTORS, tt_data) => {
        const card_rarity = /(?<=#).*/;// Ask alex about card rarity numbers [A-Z]{1,2}\d{1,2}
        let card_numbers = document.querySelectorAll(SELECTORS.TCG.card_nums);
        for(let i = 0; i < card_numbers.length; i++) {
            card_num = card_rarity.exec(card_numbers[i]
                .textContent);
            if(card_num == tt_data.Card_Number) {
                return card_numbers[i].click()
            }
        }
    }, SELECTORS, tt_data);

    await page.waitForSelector(SELECTORS.TCG.comments_btn)
    
    let data = await page.evaluate((SELECTORS) => {
        let amount = document.querySelector(SELECTORS.TCG.amount)
            .textContent
            .trim();
        console.log(amount)
        let pokemon_card = document.querySelector(SELECTORS.TCG.pokemon_card)
            .textContent
            .trim();
        console.log(pokemon_card)
        let card_set = document.querySelector(SELECTORS.TCG.card_set)
            .textContent
            .trim();
        console.log(card_set)

        return {
            Source : 'TCG Player',
            Amount : amount,
            Pokemon : pokemon_card,
            Card_Number : card_num,
            Card_Set : card_set,
        }

    }, SELECTORS);

    return data;
}   