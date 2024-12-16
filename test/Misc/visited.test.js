import { expect } from 'chai';
import visited from '../../lib/Misc/visited.js';

describe('#visited()', function() {

    before(function() {
        window.story = {
            history: [],
            passage: function(passage) {
                // Return null or passage matching the id.
                if(passage == "Start" || passage == 1) {
                    return { id: 1 };
                } else if(passage == "Test Passage" || passage == 2) {
                    return { id: 2 };
                } else if(passage == "Test Passage 4" || passage == 3) {
                    return { id: 3 };
                } else {
                    return null;
                }
            }
        }
    });

    it('Should return 0 if passage does not exist', function() {
        window.story.history = [1,1];
        expect(visited(7)).to.equal(0);
    });

    it('Should return number of passage visits for single id', function() {
        window.story.history = [1,1];
        expect(visited(1)).to.equal(2);
    });

    it('Should return number of passage visits for single name', function() {
        window.story.history = [1,1];
        expect(visited("Start")).to.equal(2);
    });

});