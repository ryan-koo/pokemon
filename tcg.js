class TCGPlayer  {
    
    constructor(browser) {

    }

    async function tcg_player(page, tt_data) {
        await page.goto(URLS.tcg);
        await page.waitForSelector(SELECTORS.TCG.search_bar);
        await page.type(SELECTORS.TCG.search_bar, tt_data.Card_Name + '\u000d');
        await page.waitForSelector(SELECTORS.TCG.pagination);
        await page.evaluate(async (SELECTORS, tt_data) => {
            // Ask alex about card rarity numbers [A-Z]{1,2}\d{1,2}
            const card_rarity = /(?<=#).*/;
            let card_numbers = document.querySelectorAll(SELECTORS.TCG.card_nums);
            for (let i = 0; i < card_numbers.length; i++) {
                card_num = card_rarity.exec(card_numbers[i].textContent);
                if (card_num == tt_data.Card_Number) {
                    return card_numbers[i].click()
                }
            }
        }, SELECTORS, tt_data);
        await page.waitForSelector(SELECTORS.TCG.add_to_cart)
        let data = await page.evaluate((SELECTORS) => {
            const card_number = /[A-Z]*[0-9]*\/[A-Z]*[0-9]*/;
            let amount = document
                .querySelector(SELECTORS.TCG.amount)
                .textContent.trim();
            console.log(amount)
            let pokemon_card = document
                .querySelector(SELECTORS.TCG.pokemon_card)
                .textContent.trim();
            console.log(pokemon_card)
            let card_set = document
                .querySelector(SELECTORS.TCG.card_set)
                .textContent.trim();
            console.log(card_set)
            let card_num = card_number.exec(
                document.querySelector(SELECTORS.TCG.card_num).textContent.trim()
            )[0];
            console.log(card_num)
    
            return {
                Source : 'TCG Player',
                Amount : amount,
                Card_Name : pokemon_card,
                Card_Number : card_num,
                Card_Set : card_set,
            };
        }, SELECTORS);
        return data;
    } 
}