'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;
chai.should();

describe("Promise test", function() {
    it("Tests a resolved promise", async function() {
        const promise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(123);
            }, 5000);
        });

        expect(await promise).to.equal(123);
    });

    it("Tests a rejected promise", async function() {
        const promise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error('Promise rejected'));
            }, 3000);
        });

        await expect(promise).to.eventually.be.rejectedWith('Promise rejected');
    });
    /*

    new Promise(function(resolve, reject) {
        const request = Http.get('instagram/followers');

        if (request.status === 200) {
            resolve(request);
        } else {
            reject(new Error(request.error));
        }
    });

    await expect(promise).to.eventually.have.property('follower-count');

    */
});