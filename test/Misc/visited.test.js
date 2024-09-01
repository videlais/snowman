describe('#visited()', function() {

    before(function() {
        window.story = new Story($('tw-storydata'));
        window.story.start($('tw-story'));
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
        expect(visited("Test Passage")).to.equal(2);

    });

    it('Should return lowest number of passage visits for multiple ids', function() {

        window.story.history = [1,1,1,2,2];
        expect(visited(1,2)).to.equal(2);

    });

    it('Should return lowest number of passage visits for multiple names', function() {

        window.story.history = [1,1,1,2,2];
        expect(visited("Test Passage", "Test Passage 2")).to.equal(2);

    });

});