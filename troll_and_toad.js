'use strict';

const puppeteer = require('puppeteer');

class Troll_and_Toad {
    constructor(page) {
        this.page = page;
        this.info = this.main();
    }
        
    TEST_CARDS = {
        Charizard : 'Charizard SV49/SV94',
        Umbreon : 'Umbreon SV69/SV94',
    }

    URLS = {
        tt : 'https://www.trollandtoad.com/',
    }

    SELECTORS = {
        prod_group_menu : '.btn.btn-sm.d-none.d-md-block',
        pokemon_grouping : '.dropdown-item.border-bottom[data-catid="7061"]',
        search_bar : '#search-words',
        card : '.card-text',
        amount : '.d-flex.font-weight-bold.font-default.text-center.align-items-end',
        sale_amount : '#prodContainer > div.row.mt-2 > div.col-12.col-lg-4.col-xl-3.right > div.row.d-none.d-lg-block > div > div > div.card-header.d-flex.align-center.flex-around.p-2 > div.d-flex.font-weight-bold.font-default.text-center.align-items-end > div > span',
        pokemon_card : '.font-weight-bold.font-large.font-md-largest.mt-1',
        card_set : '.font-small.font-md-default',
    }

    async main() {
        await this.search();
        return this.scrape();
    }

    async search() {
        await this.page.hover(SELECTORS.TT.prod_group_menu);
        await this.page.click(SELECTORS.TT.pokemon_grouping);
        await this.page.type(SELECTORS.TT.search_bar, TEST_CARDS.Charizard + '\u000d');
        
        await this.page.waitForSelector(SELECTORS.TT.card);
        await this.page.click(SELECTORS.TT.card);
    }

    async scrape() {
        await this.page.waitForSelector('.d-flex.font-weight-bold.font-default.text-center.align-items-end');
        await this.page.waitForSelector('.font-weight-bold.font-large.font-md-largest.mt-1');
    
        let data = await this.page.evaluate(async(SELECTORS) => {
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
                Card_Name : pokemon_card,
                Card_Number : card_num,
                Card_Set : card_set,
            };
    
            return data;
        }, SELECTORS);
    
        return data;
    }
}
