import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authUser } from '../../../src/store/authentication/actions'
import { Notify } from 'quasar'
import mockAxios from '../../../src/Instances/Axios'

// Mock do Axios
vi.mock('../../../src/Instances/Axios', () => ({
  default: {
    post: vi.fn()
  }
}))

// Mock do Quasar Notify
vi.mock('quasar', () => ({
  Notify: {
    create: vi.fn()
  }
}))

describe('Authentication Store - Actions', () => {
  let commit

  beforeEach(() => {
    commit = vi.fn()
    vi.clearAllMocks()
  })

  it('deve fazer login com sucesso e retornar dados do usuário', async () => {
    const mockResponse = {
      data: {
        accessToken: 'fake-token-123',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User'
        }
      }
    }

    mockAxios.post.mockResolvedValue(mockResponse)

    const result = await authUser({ commit }, {
      login: 'test@example.com',
      password: '123456'
    })

    expect(mockAxios.post).toHaveBeenCalledWith('auth/login', {
      login: 'test@example.com',
      password: '123456'
    })
    expect(commit).toHaveBeenCalledWith('USER_LOGIN', mockResponse.data)
    expect(result).toEqual(mockResponse.data)
    expect(result.accessToken).toBe('fake-token-123')
  })

  it('deve retornar null quando não houver accessToken na resposta', async () => {
    const mockResponse = {
      data: {}
    }

    mockAxios.post.mockResolvedValue(mockResponse)

    const result = await authUser({ commit }, {
      login: 'test@example.com',
      password: '123456'
    })

    expect(result).toBeNull()
    expect(commit).not.toHaveBeenCalled()
  })

  it('deve retornar null e mostrar notificação em caso de erro', async () => {
    mockAxios.post.mockRejectedValue(new Error('Credenciais inválidas'))

    const result = await authUser({ commit }, {
      login: 'wrong@example.com',
      password: 'wrong'
    })

    expect(result).toBeNull()
    expect(Notify.create).toHaveBeenCalledWith({
      type: 'negative',
      message: 'Usuário ou senha incorretos'
    })
    expect(commit).not.toHaveBeenCalled()
  })

  it('deve armazenar dados do usuário no localStorage', async () => {
    const mockResponse = {
      data: {
        accessToken: 'fake-token-123',
        user: { id: 1, email: 'test@example.com' }
      }
    }

    mockAxios.post.mockResolvedValue(mockResponse)

    await authUser({ commit }, {
      login: 'test@example.com',
      password: '123456'
    })

    expect(commit).toHaveBeenCalledWith('USER_LOGIN', mockResponse.data)
  })
})
