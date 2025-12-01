export function getUser (state) {
  return state.user
}

export function getUserName (state) {
  // O backend retorna { user: { firstName, lastName, email, ... } }
  const userData = state.user && state.user.user ? state.user.user : state.user

  if (!userData || Object.keys(userData).length === 0) {
    return 'Usuário'
  }

  // Tentar firstName + lastName, depois email
  if (userData.firstName) {
    return userData.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData.firstName
  }

  return userData.email || userData.login || 'Usuário'
}
