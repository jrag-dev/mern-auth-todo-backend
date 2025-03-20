export const getUserInfo = (user) => {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
  }
}