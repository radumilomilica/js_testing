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

    it("Opens shopping cart", async function() {
        const view = await driver.findElement(By.linkText('View shopping cart'));
        await view.click();

        expect(await driver.findElement(By.name('checkout')).getAttribute('value')).to.contain('Checkout');
        await driver.sleep(3000);
    });

    it("Adds item to cart - Starter, 2 items", async function() {
        const xpathPackage = '//h3[contains(text(), "starter")]/ancestor::div[contains(@class, "panel")]';
        const packageName = await driver.findElement(By.xpath(xpathPackage));
        const quantity = await packageName.findElement(By.name('quantity'));
        const options = await quantity.findElements(By.css('option'));

        await Promise.all(options.map(async function(option) {
            const text = await option.getText();
            if (text === '2') {
                await option.click();

                const selectedValue = await quantity.getAttribute('value');
                expect(selectedValue).to.contain('2');

                const orderButton = await packageName.findElement(By.className('btn btn-primary'));
                await orderButton.click();

                const url = await driver.getCurrentUrl();
                expect(url).to.contain('http://shop.qa.rs/order');
            }
        }));
    });

    it("Opens shopping cart", async function() {
        const showCart = await driver.findElement(By.partialLinkText('shopping cart'));
        await showCart.click();

        const url = await driver.getCurrentUrl();
        expect(url).to.contain('http://shop.qa.rs/cart');
        expect(await driver.findElement(By.css('h1')).getText()).to.contain('Order');
    });

    it("Verifies items are in cart - Starter, 2 items", async function() {
        const orderTable = await driver.findElement(By.css('table'));
        const orderRow = await orderTable.findElement(
            By.xpath(
                '//td[contains(., "STARTER")]/parent::tr'
            )
        );
        const orderQty = await orderRow.findElement(By.xpath('//td[2]'));

        expect(await orderQty.getText()).to.eq('2');
    });

    it("Verifies total item price is correct", async function() {
        const orderTable = await driver.findElement(By.css('table'));
        const orderRow = await orderTable.findElement(
            By.xpath(
                '//td[contains(., "STARTER")]/parent::tr'
            )
        );
        const orderQty = await orderRow.findElement(By.xpath('//td[2]'));
        const orderPrice = await orderRow.findElement(By.xpath('//td[3]'));
        const orderTotal = await orderRow.findElement(By.xpath('//td[4]'));

        const price = Number((await orderPrice.getText()).substring(1));
        const total = Number((await orderTotal.getText()).substring(1));
        const qntty = Number(await orderQty.getText());

        const calculatedTotal = qntty * price;

        expect(calculatedTotal).to.be.eq(total);
    });

    it("Performs checkout", async function() {
        const checkoutBtn = await driver.findElement(By.name('checkout'));
        await checkoutBtn.click();

        const url = await driver.getCurrentUrl();
        expect(url).to.contain("http://shop.qa.rs/checkout");
        expect(await driver.findElement(By.css('h2')).getText()).to.contain('(Order #');
    });

    it("Verifies checkout success", async function() {
        const orderSuccess = await driver.findElement(By.css('h2')).getText();

        const orderNum = orderSuccess.replace(/\D/g, '');
        /*
            regex (gore) ili bez regex (dole)

            const orderSuccess2 = orderSuccess.substring(orderSuccess.indexOf('#') + 1);
            const orderNum2 = orderSuccess2.substring(0, orderSuccess2.indexOf(')'));
        */

        const orderHistory = await driver.findElement(By.linkText('Order history'));
        await orderHistory.click();

        expect(await driver.findElement(By.css('h1')).getText()).to.contain('Order History');

        const historyTable = await driver.findElement(By.css('table'));
        const historyRow = await historyTable.findElement(
            By.xpath(`//td[contains(., "#${orderNum}")]/parent::tr`)
        );
        const historyStatus = await historyRow.findElement(By.className('status'));

        expect(await historyStatus.getText()).to.be.eq('Ordered');
    });

});