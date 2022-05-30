"use strict";

const { Builder, By, until, Key } = require("selenium-webdriver");
const chai = require("chai");
const expect = chai.expect;
const chrome = require("selenium-webdriver/chrome");

describe("AP", function () {
  let driver;

  before(async function () {
    let service = new chrome.ServiceBuilder("chromedriver.exe").build();
    chrome.setDefaultService(service);

    driver = await new Builder().forBrowser("chrome").build();
  });

  after(function () {
    return driver.quit();
  });

  it("Opens homepage", async function () {
    await driver.get("http://automationpractice.com/index.php");

    expect(await driver.getCurrentUrl()).to.eq(
      "http://automationpractice.com/index.php"
    );
  });

    it("Goes to registration page ", async function () {
    const login = await driver.findElement(By.className("login"));
    await login.click();

    expect(
      await driver.getCurrentUrl(
        "http://automationpractice.com/index.php?controller=authentication&back=my-account"
      )
    );
  });

  it("Register new user", async function () {
    const email = await driver.findElement(By.id("email_create"));
    // Email adresa treba biti razlicita prilikom svakog pokretanja testa
    email.sendKeys("bob@buttons.152.email");

    const btnCreateAcc = await driver.findElement(By.id("SubmitCreate"));
    await btnCreateAcc.click();

    await driver.wait(until.elementLocated(By.id('account-creation_form')));

    const elementText = await driver.findElement(By.css("h1")).getText();
    expect(elementText.toLowerCase()).to.contain("create an account");

    const title = await driver.findElement(By.id('id_gender1'));
    await title.click();

    const firstName = await driver.findElement(By.id('customer_firstname'));
    await firstName.sendKeys('Bob');

    const lastName = await driver.findElement(By.id('customer_lastname'));
    await lastName.sendKeys('Buttons');

    const passwd = await driver.findElement(By.id('passwd'));
    await passwd.sendKeys('asdf1234');

    const dobDay = await driver.findElement(By.id('days'));
    await dobDay.sendKeys('1');

    const dobMonth = await driver.findElement(By.id('months'));
    await dobMonth.sendKeys('ju');

    const dobYear = await driver.findElement(By.id('years'));
    await dobYear.sendKeys('1980');

    const firstName2 = await driver.findElement(By.id('firstname'));
    await firstName2.sendKeys(
        Key.chord(Key.CONTROL, 'a'),
        Key.DELETE,
        'Bob'
    );

    const lastName2 = await driver.findElement(By.id('lastname'));
    await lastName2.sendKeys(
        Key.chord(Key.CONTROL, 'a'),
        Key.DELETE,
        'Buttons'
    );

    const address = await driver.findElement(By.id('address1'));
    await address.sendKeys('Neimenovana bb');

    const city = await driver.findElement(By.id('city'));
    await city.sendKeys('Novi Sad');

    const state = await driver.findElement(By.id('id_state'));
    await state.sendKeys('alas');

    const zip = await driver.findElement(By.id('postcode'));
    await zip.sendKeys('12345');

    const phone = await driver.findElement(By.id('phone_mobile'));
    await phone.sendKeys('0123456789');

    const btnSubmitAcc = await driver.findElement(By.id("submitAccount"));
    await btnSubmitAcc.click();

    await driver.wait(until.elementLocated(By.className('info-account')));

    const myAccount = await driver.findElement(By.className("page-heading")).getText();
    expect(myAccount.toLowerCase()).to.contain("my account");
  });

  it("Performs logout", async function() {
      const logout = await driver.findElement(By.className('logout'));
      await logout.click;
      expect(await driver.getCurrentUrl(
        'http://automationpractice.com/index.php?controller=authentication&back=my-account'));
        await driver.sleep(10000);
  });

  it('Login exsisting user', async function() {
        const inputEmail = await driver.findElement(By.id("email"));
        inputEmail.sendKeys('bob@buttons.8.email');
        const inputPassword = await driver.findElement(By.id("passwd"));
        inputPassword.sendKeys('asdf1234');
        const signIn = await driver.findElement(By.id('SubmitLogin'));
        await signIn.click();
        await driver.wait(until.elementLocated(By.id('center_column')));
        expect(await driver.findElement(By.css('h1')).getText()).to.contain('MY ACCOUNT');
  });

});