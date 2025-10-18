/**
 * Service Registry - configures the dependency injection container
 * @module ServiceRegistry
 */
import ServiceContainer from './ServiceContainer.js';
import DOMUtils from './DOMUtils.js';
import Passage from './Passage.js';
import Markdown from './Markdown.js';
import State from './State.js';
import History from './History.js';
import Storylets from './Storylets.js';
import Script from './Script.js';
import Sidebar from './Sidebar.js';
import Screen from './Screen.js';
import Storage from './Storage.js';

/**
 * Create and configure the service container
 * @returns {ServiceContainer} Configured service container
 */
export function createServiceContainer() {
  const container = new ServiceContainer();

  // Register utility services as singletons
  container.instance('domUtils', DOMUtils);
  container.instance('markdown', Markdown);
  container.instance('state', State);
  container.instance('history', History);
  container.instance('storylets', Storylets);
  container.instance('script', Script);
  container.instance('screen', Screen);
  container.instance('storage', Storage);

  // Register Passage as a factory (since we create multiple instances)
  container.factory('passage', (name, tags, source) => {
    return new Passage(name, tags, source);
  });

  // Register Sidebar as singleton (since we create an instance)
  container.singleton('sidebar', Sidebar, []);

  return container;
}

/**
 * Global service container instance
 */
let globalContainer = null;

/**
 * Get the global service container
 * @returns {ServiceContainer} Global service container
 */
export function getServiceContainer() {
  if (!globalContainer) {
    globalContainer = createServiceContainer();
  }
  return globalContainer;
}

/**
 * Set the global service container (useful for testing)
 * @param {ServiceContainer} container - Service container to set as global
 */
export function setServiceContainer(container) {
  globalContainer = container;
}

/**
 * Reset the global service container
 */
export function resetServiceContainer() {
  globalContainer = null;
}

export default {
  createServiceContainer,
  getServiceContainer,
  setServiceContainer,
  resetServiceContainer
};