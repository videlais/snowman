/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
(function() {
    let el = document.querySelector('.frame');
    el.addEventListener( "dblclick", () => {
        const textarea = document.createElement("p");
        textarea.innerHTML = "Hey there!";
        const content = document.querySelector('.expand');
        const parent = content.parentNode;
        parent.insertBefore(textarea, content);
    });
}.call(eval('this')));
/******/ })()
;