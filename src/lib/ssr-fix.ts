// Fix para localStorage en SSR - Comprehensive Storage mock
if (typeof window === 'undefined') {
  // Create a proper Storage implementation
  class ServerStorage implements Storage {
    private store: Map<string, string> = new Map();

    get length(): number {
      return this.store.size;
    }

    clear(): void {
      this.store.clear();
    }

    getItem(key: string): string | null {
      return this.store.get(key) ?? null;
    }

    key(index: number): string | null {
      const keys = Array.from(this.store.keys());
      return keys[index] ?? null;
    }

    removeItem(key: string): void {
      this.store.delete(key);
    }

    setItem(key: string, value: string): void {
      this.store.set(key, value);
    }

    // Make it iterable
    [Symbol.iterator](): IterableIterator<string> {
      return this.store.keys();
    }
  }

  // Check if we need to polyfill (missing or incomplete)
  const needsLocalStoragePolyfill = typeof global.localStorage === 'undefined' || typeof global.localStorage.getItem !== 'function';
  const needsSessionStoragePolyfill = typeof global.sessionStorage === 'undefined' || typeof global.sessionStorage.getItem !== 'function';

  if (needsLocalStoragePolyfill) {
    Object.defineProperty(global, 'localStorage', {
      value: new ServerStorage(),
      writable: true, // Allow overwriting if needed by other tools
      enumerable: true,
      configurable: true
    });
  }

  if (needsSessionStoragePolyfill) {
    Object.defineProperty(global, 'sessionStorage', {
      value: new ServerStorage(),
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
}