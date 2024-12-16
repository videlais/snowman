import { expect } from 'chai';
import renderToSelector from '../../lib/Misc/renderToSelector.js';
import { JSDOM } from 'jsdom';
import jquery from 'jquery';
import Story from '../../lib/Story.js';

const defaultHTML =  `<tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
<tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata>
<tw-passagedata pid="2" name="Test Passage 2" tags="tag1 tag2">Hello world 2</tw-passagedata>
<tw-passagedata pid="3" name="Test Passage 3" tags=""><div><p><span>Test</span><p></div></tw-passagedata>
<tw-passagedata pid="4" name="Test Passage 4" tags=""><% print(; %></tw-passagedata>
<tw-passagedata pid="5" name="Test Passage 5" tags="">[[Test Passage]]</tw-passagedata>
<script type="text/twine-javascript">window.scriptRan = true;</script>
<style type="text/twine-css">body { color: blue }</style>
</tw-storydata>`;

// Create a new JSDOM instance.
const dom = new JSDOM(defaultHTML, {url: "https://localhost/", runScripts: "dangerously"});

global.window = dom.window;
global.document = window.document;
global.$ = jquery(window);

describe('#renderToSelector()', function() {

    before(function() {
        window.story = new Story();
    });

    it('Should do nothing when passed nothing', function() {
        expect(renderToSelector() ).to.equal();
    });

    it('Should do nothing when selector does not exist', function() {
        expect(renderToSelector(null) ).to.equal();
    });

    it('Should do nothing when selector and passage do not exist', function() {
        expect(renderToSelector(null, null) ).to.equal();
    });

    it('Should overwrite HTML content with passage content', function() {
        renderToSelector('[name="Test Passage 2"]', "Test Passage");
        expect($('[name="Test Passage 2"]').html()).to.equal("Hello world");
    });

});