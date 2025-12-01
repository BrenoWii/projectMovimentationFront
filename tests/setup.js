import { vi } from 'vitest'

// Mock do Quasar
global.Quasar = {
  Notify: {
    create: vi.fn()
  }
}

// Mock do localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

global.localStorage = localStorageMock
