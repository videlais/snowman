const { expect } = require('chai');
const hasVisited = require("../../lib/Misc/hasVisited.js");

describe('#hasVisited()', function() {

    beforeEach(function() {
        window.story = new Story($('tw-storydata'));
        window.story.start($('tw-story'));
    });

    it('Should return false if no arguments passed', function() {
        expect(hasVisited()).to.equal(false);
    });

    it('Should return false if window.story is not defined', function() {
        window.story = undefined;
        expect(hasVisited("Test")).to.equal(false);
    });

    it('Should return false if window.story.history is not defined', function() {
        window.story.history = undefined;
        expect(hasVisited("Test")).to.equal(false);
    });

    it('Should return true if passage name visited', function() {
        window.story.history = ["Start"];
        expect(hasVisited("Start")).to.equal(true);
    });

    it('Should return false if passage name not visited', function() {
        window.story.history = [];
        expect(hasVisited("Start")).to.equal(false);
    });

    it('Should return false if passage name not visited', function() {
        window.story.history = [];
        expect(hasVisited("Random")).to.equal(false);
    });

    it('Should return true if multiple passage names visited', function() {
        window.story.history = ["Test Passage", "Test Passage 4"];
        expect(hasVisited("Test Passage", "Test Passage 4")).to.equal(true);
    });

    it('Should return false if any multiple passage names not visited', function() {
        window.story.history = ["Random", "Another"];
        expect(hasVisited("Random", "Another")).to.equal(false);
    });
});