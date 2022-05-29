'use strict';

const { Builder, By, until, Key } = require('selenium-webdriver');
const chai = require('chai');
const expect = chai.expect;
const chrome = require('selenium-webdriver/chrome');

describe('DemoQA test', function() {
    let driver;

    before(async function() {
        let service = new chrome.ServiceBuilder('chromedriver.exe').build();
        chrome.setDefaultService(service);

        driver = await new Builder().forBrowser('chrome').build();
    });

    after(function() {
        return driver.quit();
    });

    it("Opens DemoQA homepage", async function() {
        await driver.get('https://demoqa.com/');

        expect(await driver.getCurrentUrl()).to.eq('https://demoqa.com/');
    });

    it("Opens Elements page", async function() {
        const elementsPage = await driver.findElement(
            By.xpath('//h5[contains(., "Elements")]/ancestor::div[contains(@class, "top-card")]')
        );
        await elementsPage.click();

        expect(await driver.getCurrentUrl()).to.eq('https://demoqa.com/elements');
        expect(await driver.findElement(By.className('main-header')).getText()).to.eq('Elements');
    });

    it("Opens Text Box page, fills the form, and submits", async function() {
        const textBoxPage = await driver.findElement(By.id('item-0'));
        await textBoxPage.click();

        expect(await driver.findElement(By.className('main-header')).getText()).to.eq('Text Box');

        const fillUserName = 'John Doe';
        const fillUserEmail = 'john.doe@example.loc';
        const fillCurrentAddress = 'Unknown rd 167 apt 26';
        const fillPermanentAddress = 'Unknown rd 167 apt 26';

        const fullName = await driver.findElement(By.id('userName'));
        fullName.sendKeys(fillUserName);

        const email = await driver.findElement(By.id('userEmail'));
        email.sendKeys(fillUserEmail);

        const currentAddress = await driver.findElement(By.id('currentAddress'));
        currentAddress.sendKeys(fillCurrentAddress);

        const permanentAddress = await driver.findElement(By.id('permanentAddress'));
        permanentAddress.sendKeys(fillPermanentAddress);

        const buttonSubmit = await driver.findElement(By.id('submit'));
        await buttonSubmit.click();

        const output = await driver.findElement(By.id('output'));
        expect(await output.isDisplayed()).to.eq(true);

        const outUserName = await output.findElement(By.id('name'));
        const outUserEmail = await output.findElement(By.id('email'));
        const outCurrentAddress = await output.findElement(By.id('currentAddress'));
        const outPermanentAddress = await output.findElement(By.id('permanentAddress'));

        expect(await outUserName.getText()).to.contain(fillUserName);
        expect(await outUserEmail.getText()).to.contain(fillUserEmail);
        expect(await outCurrentAddress.getText()).to.contain(fillCurrentAddress);
        expect(await outPermanentAddress.getText()).to.contain(fillPermanentAddress);
    });

    it("Opens Radio Button page, and chooses", async function() {
        const radioButton = await driver.findElement(By.id('item-2'));
        await radioButton.click();

        expect(await driver.getCurrentUrl()).to.eq('https://demoqa.com/radio-button');

        const selectYes = await driver.findElement(
            By.xpath('//label[contains(., "Yes")]')
        );
        await selectYes.click();

        let message = await driver.findElement(By.className('text-success'));
        expect(await message.getText()).to.contain('Yes');

        const selectImpressive = await driver.findElement(
            By.xpath('//label[@for="impressiveRadio"]')
        );
        await selectImpressive.click();

        message = await driver.findElement(By.className('text-success'));
        expect(await message.getText()).to.contain('Impressive');
    });

    it("Tests dynamic properties", async function() {
        const dynamicProperties = await driver.findElement(By.id('item-8'))
        await dynamicProperties.click();

        expect(await driver.findElement(By.className('main-header')).getText()).to.eq('Dynamic Properties');

        const buttonEnableAfter = await driver.findElement(By.id('enableAfter'));
        await driver.wait(until.elementIsEnabled(buttonEnableAfter));

        expect(await buttonEnableAfter.isEnabled()).to.be.true;

        const buttonVisibleAfter = await driver.findElement(By.id('visibleAfter'));
        await driver.wait(until.elementIsVisible(buttonVisibleAfter));
        
        expect(await buttonVisibleAfter.isDisplayed()).to.be.true;
    });

    it("Tests web tables", async function() {
        const webTables = await driver.findElement(By.id('item-3'));
        await webTables.click();

        expect(await driver.getCurrentUrl()).to.eq('https://demoqa.com/webtables');

        const edit = await driver.findElement(By.id('edit-record-2'));
        await edit.click();

        const registrationForm = await driver.findElement(By.id('registration-form-modal'));
        await driver.wait(until.elementIsVisible(registrationForm));

        expect(await registrationForm.isDisplayed()).to.be.true;

        const emailElement = await driver.findElement(By.id('userEmail'));
        const email = await emailElement.getAttribute('value');

        const salary = await driver.findElement(By.id('salary'));
        const oldSalary = await salary.getAttribute('value');
        const newSalary = Number(oldSalary) + 1000;

        await salary.sendKeys(
            Key.chord(Key.CONTROL, 'a'),
            Key.DELETE,
            newSalary
        );

        const submit = await driver.findElement(By.id('submit'));
        await submit.click();

        const element = `//div[@role="row" and contains(., "${email}")]`;
        //const element = '//div[@role="row" and contains(., "' + email +'")]';
        // const row = driver.findElement(
        //     By.xpath(element)
        // );

        const cell = await driver.findElement(
            By.xpath(`${element}//div[@role="gridcell"][5]`)
            //By.xpath(element + '//div[@role="gridcell"][5]')
        );

        expect(await cell.getText()).to.eq(newSalary.toString());
    });

    it("Test alerts", async function() {
        await driver.get('https://demoqa.com/alerts');
        expect(await driver.getCurrentUrl()).to.eq('https://demoqa.com/alerts');

        const alertButton = await driver.findElement(By.id('alertButton'));
        await alertButton.click();
        await driver.wait(until.alertIsPresent());

        const alert = await driver.switchTo().alert();
        expect(await alert.getText()).to.contain('You clicked');
        await alert.accept();

        const alertButtonTimer = await driver.findElement(By.id('timerAlertButton'));
        await alertButtonTimer.click();
        await driver.wait(until.alertIsPresent());

        const alertTimed = await driver.switchTo().alert();
        expect(await alertTimed.getText()).to.contain('5 seconds');
        await alertTimed.accept();
    });

    it('Tests confirmations', async function() {
        const confirmButton = await driver.findElement(By.id('confirmButton'));
        await confirmButton.click();
        await driver.wait(until.alertIsPresent());

        let confirmation = await driver.switchTo().alert();
        expect(await confirmation.getText()).to.contain('Do you confirm');

        await confirmation.dismiss();

        let confirmResult = await driver.findElement(By.id('confirmResult'));
        expect(await confirmResult.isDisplayed()).to.be.true;
        expect(await confirmResult.getText()).to.contain('Cancel');

        await confirmButton.click();
        await driver.wait(until.alertIsPresent());

        confirmation = await driver.switchTo().alert();
        expect(await confirmation.getText()).to.contain('Do you confirm');

        await confirmation.accept();
        confirmResult = await driver.findElement(By.id('confirmResult'));
        expect(await confirmResult.isDisplayed()).to.be.true;
        expect(await confirmResult.getText()).to.contain('Ok');
    });

    it("Tests prompts", async function() {
        const promptButton = await driver.findElement(By.id('promtButton'));
        await promptButton.click();
        await driver.wait(until.alertIsPresent());

        const prompt = await driver.switchTo().alert();
        expect(await prompt.getText()).to.contain('enter your name');

        const textToEnter = 'Bob';

        await prompt.sendKeys(textToEnter);
        await prompt.accept();

        const promptResult = driver.findElement(By.id('promptResult'));
        expect(await promptResult.isDisplayed()).to.be.true;
        expect(await promptResult.getText()).to.contain(textToEnter);
    });
});