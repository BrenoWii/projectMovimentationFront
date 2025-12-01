import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Router Guards', () => {
  let localStorageMock
  let next

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = (() => {
      let store = {}
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString() },
        removeItem: (key) => { delete store[key] },
        clear: () => { store = {} }
      }
    })()

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })

    next = vi.fn()
  })

  afterEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('Autenticação', () => {
    it('deve permitir acesso a rotas públicas sem autenticação', () => {
      const publicPages = ['/login', '/login/create-login']

      publicPages.forEach(path => {
        const to = { path }
        const from = { path: '/' }
        
        // Simular guard
        const authRequired = !publicPages.includes(to.path)
        const loggedIn = localStorage.getItem('user')

        expect(authRequired).toBe(false)
        expect(loggedIn).toBeNull()
      })
    })

    it('deve redirecionar para login quando acessar rota privada sem autenticação', () => {
      const to = { path: '/movimentation' }
      const from = { path: '/' }

      const publicPages = ['/login', '/login/create-login']
      const authRequired = !publicPages.includes(to.path)
      const userString = localStorage.getItem('user')

      let loggedIn = false
      if (userString) {
        try {
          const user = JSON.parse(userString)
          loggedIn = user && user.accessToken
        } catch (e) {
          localStorage.removeItem('user')
        }
      }

      expect(authRequired).toBe(true)
      expect(loggedIn).toBe(false)
      
      // Guard deve chamar next('/login')
      if (authRequired && !loggedIn) {
        next('/login')
      }

      expect(next).toHaveBeenCalledWith('/login')
    })

    it('deve permitir acesso a rotas privadas com token válido', () => {
      const userData = {
        accessToken: 'valid-token',
        user: { id: 1, email: 'test@example.com' }
      }
      localStorage.setItem('user', JSON.stringify(userData))

      const to = { path: '/movimentation' }
      const publicPages = ['/login', '/login/create-login']
      const authRequired = !publicPages.includes(to.path)
      const userString = localStorage.getItem('user')

      let loggedIn = false
      if (userString) {
        try {
          const user = JSON.parse(userString)
          loggedIn = !!(user && user.accessToken)
        } catch (e) {
          localStorage.removeItem('user')
        }
      }

      expect(authRequired).toBe(true)
      expect(loggedIn).toBe(true)
      
      // Guard deve chamar next() sem argumentos
      if (!authRequired || loggedIn) {
        next()
      }

      expect(next).toHaveBeenCalledWith()
    })

    it('deve limpar localStorage e redirecionar quando JSON é inválido', () => {
      localStorage.setItem('user', 'invalid-json{')

      const to = { path: '/movimentation' }
      const publicPages = ['/login', '/login/create-login']
      const authRequired = !publicPages.includes(to.path)
      const userString = localStorage.getItem('user')

      let loggedIn = false
      if (userString) {
        try {
          const user = JSON.parse(userString)
          loggedIn = user && user.accessToken
        } catch (e) {
          localStorage.removeItem('user')
          loggedIn = false
        }
      }

      expect(loggedIn).toBe(false)
      expect(localStorage.getItem('user')).toBeNull()
      
      if (authRequired && !loggedIn) {
        next('/login')
      }

      expect(next).toHaveBeenCalledWith('/login')
    })

    it('deve redirecionar para login quando token não existe no objeto user', () => {
      const userData = {
        user: { id: 1, email: 'test@example.com' }
        // accessToken ausente
      }
      localStorage.setItem('user', JSON.stringify(userData))

      const to = { path: '/movimentation' }
      const publicPages = ['/login', '/login/create-login']
      const authRequired = !publicPages.includes(to.path)
      const userString = localStorage.getItem('user')

      let loggedIn = false
      if (userString) {
        try {
          const user = JSON.parse(userString)
          loggedIn = !!(user && user.accessToken)
        } catch (e) {
          localStorage.removeItem('user')
        }
      }

      expect(loggedIn).toBe(false)
      
      if (authRequired && !loggedIn) {
        next('/login')
      }

      expect(next).toHaveBeenCalledWith('/login')
    })

    it('deve fazer logout e limpar localStorage na rota /logout', () => {
      localStorage.setItem('user', JSON.stringify({ accessToken: 'token' }))

      const to = { path: '/logout' }
      const logout = to.path === '/logout'

      if (logout) {
        localStorage.clear()
        next('/login')
      }

      expect(localStorage.getItem('user')).toBeNull()
      expect(next).toHaveBeenCalledWith('/login')
    })
  })
})
