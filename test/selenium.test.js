const webdriver = require('selenium-webdriver');
const { By, Key, until } = require('selenium-webdriver')

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

// Naprednija sintaksa importovanja klasa iz neke biblioteke
// const { assert, expect } = require('chai');

describe('Selenium tests', function() {
    let driver;

    before(function() {
        driver = new webdriver.Builder().forBrowser('chrome').build();
    });

    after(async function() {
        await driver.quit();
    });

    it('Open qa.rs website', async function() {
        await driver.get('https://qa.rs');

        const pageTitle = await driver.getTitle();

        expect(pageTitle).to.contain('QA.rs');
        assert.equal(pageTitle, 'Edukacija za QA testere - QA.rs');
    });