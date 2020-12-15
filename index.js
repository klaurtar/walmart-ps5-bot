const puppeteer = require('puppeteer');
require('dotenv').config();
const userAgent = require('user-agents');
const randomUseragent = require('random-useragent');

const helper = require('./util/helper');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

//const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

const getPS5 = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const userAgent = randomUseragent.getRandom();
  const UA = userAgent;
  console.log(UA);

  // Does not work Opera/9.80 (Android; Opera Mini/9.0.1829/66.318; U; en) Presto/2.12.423 Version/12.16
  // Mozilla/5.0 (Symbian/3; Series60/5.2 NokiaN8-00/014.002; Profile/MIDP-2.1 Configuration/CLDC-1.1; en-us) AppleWebKit/525 (KHTML, like Gecko) Version/3.0 BrowserNG/7.2.6.4 3gpp-gba
  // Mozilla/5.0 (Linux; U; Android 2.0.1; de-de; Milestone Build/SHOLS_U2_01.14.0) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17
  const [page] = await browser.pages();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (
      ['image', 'stylesheet', 'font', 'script'].indexOf(
        request.resourceType()
      ) !== -1
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.setViewport({
    width: 1500 + Math.floor(Math.random() * 100),
    height: 1080 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

  await page.setUserAgent(UA);
  await page.setDefaultNavigationTimeout(0);

  const pageReload = async () => {
    console.log('Looking my lord');
    await page.reload({ waitUntil: ['networkidle2', 'domcontentloaded'] });

    $addToCartButton = await page.$(
      '#add-on-atc-container > div:nth-child(1) > section > div.valign-middle.display-inline-block.prod-product-primary-cta.primaryProductCTA-marker > div.prod-product-cta-add-to-cart.display-inline-block'
    );

    //console.log($addToCartButton);

    if (!$addToCartButton || $addToCartButton === null) await pageReload();
  };

  // Sign in to WalMart
  await signIn(page);

  console.log('Headed to Walmart.com...');

  // const findAddToCart = async (page) => {
  await page.goto('https://www.walmart.com/ip/PlayStation-5-Console/363472942');

  await helper.checkURL(
    page,
    'https://www.walmart.com/ip/PlayStation-5-Console/363472942',
    async function () {
      await addToCart(page);
    }
  );

  let $addToCartButton = await page.$(
    '#add-on-atc-container > div:nth-child(1) > section > div.valign-middle.display-inline-block.prod-product-primary-cta.primaryProductCTA-marker > div.prod-product-cta-add-to-cart.display-inline-block'
  );

  if (!$addToCartButton) await pageReload();

  console.log('Add to cart button was found. Clicking now...');

  await page.click(
    '#add-on-atc-container > div:nth-child(1) > section > div.valign-middle.display-inline-block.prod-product-primary-cta.primaryProductCTA-marker > div.prod-product-cta-add-to-cart.display-inline-block'
  );
  console.log('Add to cart button is clicked');

  await page.waitForTimeout(500);
  // }

  //add to cart

  await addToCart(page);
  console.log('add to cart finished');
  // Checkout

  // 1) Delivery Method
  await page.waitForSelector('.cxo-continue-btn');

  await page.click('.cxo-continue-btn');

  // 2) Confirm Delivery Method
  await page.waitForSelector(
    'body > div.js-content > div > div.checkout-wrapper > div > div.accordion-inner-wrapper > div.checkout-accordion > div > div > div > div:nth-child(2) > div.CXO_module_container > div.CXO_module_body.ResponsiveContainer > div > div > div > div.text-left.Grid > div > div > div > div > div.arrange > div.arrange-fill.u-size-1-12-m > button > span'
  );

  await page.click(
    'body > div.js-content > div > div.checkout-wrapper > div > div.accordion-inner-wrapper > div.checkout-accordion > div > div > div > div:nth-child(2) > div.CXO_module_container > div.CXO_module_body.ResponsiveContainer > div > div > div > div.text-left.Grid > div > div > div > div > div.arrange > div.arrange-fill.u-size-1-12-m > button > span'
  );

  // 3) Type CVV and finish order
  await page.waitForSelector('#cvv-confirm');

  await page.type('#cvv-confirm', process.env.CREDIT_CARD_CVV);

  await page.click('.fulfillment-opts-continue');

  await page.waitForTimeout(5000);

  await browser.close();
};

getPS5();

async function signIn(page) {
  await page.goto('https://www.walmart.com/account/login?tid=0&returnUrl=%2F', {
    waitUntil: 'networkidle0',
  });

  await helper.checkURL(
    page,
    'https://www.walmart.com/account/login?tid=0&returnUrl=%2F',
    async function () {
      await signIn(page);
    }
  );

  await page.type('#email', process.env.WALMART_EMAIL, { delay: 50 });
  await page.type('#password', process.env.WALMART_PASSWORD, { delay: 50 });

  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
}

const addToCart = async (page) => {
  await page.goto('https://www.walmart.com/cart', {
    waitUntil: 'networkidle2',
  });

  await helper.checkURL(
    page,
    'https://www.walmart.com/cart',
    async function () {
      await addToCart(page);
    }
  );

  await page.waitForSelector('.checkoutBtn');
  console.log('In the shopping cart now...');

  await page.evaluate(() => {
    const $checkOutBtn = document.querySelector('.checkoutBtn');
    $checkOutBtn.click();
  });
};
