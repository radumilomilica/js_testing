const webdriver = require('selenium-webdriver');
const { By, Key, until } = require('selenium-webdriver')

const chai = require('chai');
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

    beforeEach(async function() {
        // Pokrece se pre svakog testa
    });

    afterEach(async function() {
        // Pokrece se nakon svakog testa
    });

    it("Verify homepage is open", async function() {
        await driver.get("http://shop.qa.rs/");

        const titleElement = await driver.findElement(By.css('h1'));
        const titleContent = await titleElement.getText();
        expect(titleContent).to.contain('(QA) Shop');
        // isto kao i iznad, samo krace
        //expect(await driver.findElement(By.css('h1')).getText()).to.contain('(QA) Shop');

        const divElement = await driver.findElement(By.xpath('//*[@class="row" and contains(., "ORDER YOUR BUGS")]'));

        expect(await divElement.isDisplayed()).to.be.true;
    });

    it("Goes to the registration page", async function() {
        const register = await driver.findElement(By.linkText('Register'));
        await register.click();

        expect(await driver.findElement(By.name('register')).getAttribute('value')).to.contain('Register');
    });

    it("Successfully performs registration", async function() {
        const inputIme = await driver.findElement(By.name('ime'));
        inputIme.sendKeys('Bob');

        const inputPrezime = await driver.findElement(By.name('prezime'));
        inputPrezime.sendKeys('Buttons');

        const inputEmail = await driver.findElement(By.name('email'));
        inputEmail.sendKeys('bob.buttons@example.local');

        const inputKorisnicko = await driver.findElement(By.name('korisnicko'));
        inputKorisnicko.sendKeys('bob.buttons');

        const inputLozinka = await driver.findElement(By.name('lozinka'));
        inputLozinka.sendKeys('nekaLozinka123');

        const inputLozinkaOpet = await driver.findElement(By.name('lozinkaOpet'));
        inputLozinkaOpet.sendKeys('nekaLozinka123');

        const buttonRegistracija = await driver.findElement(By.name('register'));
        await buttonRegistracija.click();

        expect(await driver.findElement(By.className('alert alert-success')).getText()).to.contain('Uspeh!');
    });

    it("Goes to login page", async function() {
        const login = await driver.findElement(By.linkText('Login'));
        await login.click();

        expect(await driver.findElement(By.css('h2')).getText()).to.contain('Prijava');
    });

    it("Successfully performs login", async function() {
        const username = await driver.findElement(By.name('username'));
        username.sendKeys('aaa');

        const password = await driver.findElement(By.name('password'));
        password.sendKeys('aaa');

        const login = await driver.findElement(By.name('login'));
        await login.click();

        expect(await driver.findElement(By.css('h2')).getText()).to.contain('Welcome back'); 

    });

    //domaci

    it("Goes to the View shopping cart", async function() {
        const view = await driver.findElement(By.linkText('View shopping cart'));
        await view.click();

        expect(await driver.findElement(By.name('checkout')).getAttribute('value')).to.contain('Checkout');
        await driver.sleep(3000);
    });

});