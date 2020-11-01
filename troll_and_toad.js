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
            Card_Name : pokemon_card,
            Card_Number : card_num,
            Card_Set : card_set,
        };

        return data;
    }, SELECTORS);

    return data;
}