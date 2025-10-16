// Jest setup for TextEncoder/TextDecoder globals needed by JSDOM
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;