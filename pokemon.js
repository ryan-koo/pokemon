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
        add_to_cart : '#btnAddToCart_FeaturedSeller',
        card_num : '.product-description__value',
    }
}

class Browser {
    constructor() {
        this.browser = await puppeteer.launch({
            defaultViewport : {width : 1000, height : 1080},
            headless : false,
            slowMo : 50,
            devtools : true,
        });

        this.page = await this.browser.newPage();

        this.data = null;
    }

    go_to_troll_and_toad(page) {

    }

    go_to_tcgplayer(page) {

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
