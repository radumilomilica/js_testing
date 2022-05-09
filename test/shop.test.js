const webdriver = require('selenium-webdriver');
const { By, Key, until } = require('selenium-webdriver')

const chai = require('chai');
const { urlContains } = require('selenium-webdriver/lib/until');
const assert = chai.assert;
const expect = chai.expect;

describe('shop.qa.rs tests', function() {
    let driver;

    before(function() {
        driver = new webdriver.Builder().forBrowser('chrome').build();
    });

    after(async function() {
        await driver.quit();
    });

    it("Verify homepage is open", async function() {
        await driver.get("http://shop.qa.rs/");

        const titleElement = await driver.findElement(By.css(`h1`));
        const titleContent = await titleElement.getText();
        expect(titleContent).to.contain(`(QA) Shop`);
        //isto kao iznad samo krace
        //expect(await driver.findElement(By.css(`h1`)).getText()).to.contain(`(QA) Shop`);

        const divElement = await driver.findElement(By.xpath('//*[@class="row" and contains(., "ORDER YOUR BUGS")]'));
        expect(await divElement.isDisplayed()).to.be.true;

  
    });
     // Domaći

     it("Verify registration page is open", async function() {
        await driver.get("http://shop.qa.rs/");  
    
     const registration = await driver.findElement(By.xpath('//*[@class="col-sm-6 text-center" and contains(., "Register")]'));
     registration.click();
     await driver.wait(until.elementLocated(By.name("register")));
     await driver.sleep(2000);
    });
});