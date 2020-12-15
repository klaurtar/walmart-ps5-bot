exports.checkURL = async (page, expectedURL, fn) => {
    try {
    const currentURL = await page.url();
    console.log(currentURL);
    if (currentURL == expectedURL) {
        console.log(expectedURL + ' has passed.');
        return
    };
    if (currentURL != expectedURL) {
        if (currentURL.includes('blocked')) {
            console.log('CAPTCHA required');
            await page.waitForNavigation();
        } else {
            console.log('rerunning fn');
            await fn();
        }
    }
    } catch (err) {
        console.log(err);
    }
};