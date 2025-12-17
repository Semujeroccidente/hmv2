// Helper seguro para localStorage que funciona tanto en cliente como en servidor

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key)
    }
    return null
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value)
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
  },
  
  clear: (): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
    }
  }
}

// Helper para sessionStorage también
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem(key)
    }
    return null
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, value)
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(key)
    }
  },
  
  clear: (): void => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.clear()
    }
  }
}