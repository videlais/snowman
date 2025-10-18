/**
 * Service Container for dependency injection
 * Manages service instances and their dependencies
 * @class ServiceContainer
 */
class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.factories = new Map();
  }

  /**
   * Register a service constructor
   * @param {string} name - Service name
   * @param {Function} constructor - Service constructor function
   * @param {Array<string>} dependencies - Array of dependency names
   */
  register(name, constructor, dependencies = []) {
    this.services.set(name, {
      constructor,
      dependencies,
      isSingleton: false
    });
  }

  /**
   * Register a singleton service
   * @param {string} name - Service name
   * @param {Function} constructor - Service constructor function
   * @param {Array<string>} dependencies - Array of dependency names
   */
  singleton(name, constructor, dependencies = []) {
    this.services.set(name, {
      constructor,
      dependencies,
      isSingleton: true
    });
  }

  /**
   * Register a factory function
   * @param {string} name - Service name
   * @param {Function} factory - Factory function
   * @param {Array<string>} dependencies - Array of dependency names
   */
  factory(name, factory, dependencies = []) {
    this.factories.set(name, { factory, dependencies });
  }

  /**
   * Register an instance directly
   * @param {string} name - Service name
   * @param {*} instance - Service instance
   */
  instance(name, instance) {
    this.singletons.set(name, instance);
  }

  /**
   * Resolve a service by name
   * @param {string} name - Service name
   * @returns {*} Service instance
   */
  resolve(name) {
    // Check for existing singleton
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Check for factory
    if (this.factories.has(name)) {
      const { factory, dependencies } = this.factories.get(name);
      const resolvedDeps = dependencies.map(dep => this.resolve(dep));
      return factory(...resolvedDeps);
    }

    // Check for registered service
    if (this.services.has(name)) {
      const service = this.services.get(name);
      const resolvedDeps = service.dependencies.map(dep => this.resolve(dep));
      const instance = new service.constructor(...resolvedDeps);

      // Store singleton if needed
      if (service.isSingleton) {
        this.singletons.set(name, instance);
      }

      return instance;
    }

    throw new Error(`Service '${name}' not found in container`);
  }

  /**
   * Check if a service is registered
   * @param {string} name - Service name
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name) || 
           this.singletons.has(name) || 
           this.factories.has(name);
  }

  /**
   * Get all registered service names
   * @returns {Array<string>}
   */
  getServiceNames() {
    return [
      ...this.services.keys(),
      ...this.singletons.keys(),
      ...this.factories.keys()
    ];
  }

  /**
   * Clear all services (useful for testing)
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
    this.factories.clear();
  }
}

export default ServiceContainer;