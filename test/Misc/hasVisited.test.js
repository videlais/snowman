import { expect } from 'chai';
import hasVisited from '../../lib/Misc/hasVisited.js';

describe('#hasVisited()', function() {

    beforeEach(function() {
        window.story = {
            history: [],
            passage: function(passage) {
                // Return null or passage matching the id.
                if(passage == "Start") {
                    return { id: 1 };
                } else if(passage == "Test Passage") {
                    return { id: 2 };
                } else if(passage == "Test Passage 4") {
                    return { id: 3 };
                } else {
                    return null;
                }
            }
        }
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
        window.story.history = [1];
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
        window.story.history = [2, 3];
        expect(hasVisited("Test Passage", "Test Passage 4")).to.equal(true);
    });

    it('Should return false if any multiple passage names not visited', function() {
        window.story.history = [2];
        expect(hasVisited("Random", "Another")).to.equal(false);
    });
});