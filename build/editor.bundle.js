/******/ (() => { // webpackBootstrap
(function () {
// Create an element
  const test = document.createElement('p');
  test.innerHTML = 'Future toolbar area!';

  // Watch the body for the loading of CodeMirror
  const targetNode = document.querySelector('body');

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(function (mutationList, observer) {
    for (const mutation of mutationList) {
      const target = mutation.target;
      if (target.className === 'CodeMirror-code') {
        const el = document.querySelector('.passageTags');
        el.after(test);
        break;
      }
    }
  });

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();

/******/ })()
;