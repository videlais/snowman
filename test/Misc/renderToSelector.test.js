describe('#renderToSelector()', function() {

    before(function() {
        storyEl = $('tw-storydata');
        story = new Story(storyEl);
        window.story = story;
    });

    it('Should do nothing when passed nothing', function() {
        expect(window.renderToSelector() ).to.equal();
    });

    it('Should do nothing when selector does not exist', function() {
        expect(window.renderToSelector(null) ).to.equal();
    });

    it('Should do nothing when selector and passage do not exist', function() {
        expect(window.renderToSelector(null, null) ).to.equal();
    });

    it('Should overwrite HTML content with passage content', function() {
        window.renderToSelector('[name="Test Passage 2"]', "Test Passage");
        expect($('[name="Test Passage 2"]').html()).to.equal("Hello world");
    });

});