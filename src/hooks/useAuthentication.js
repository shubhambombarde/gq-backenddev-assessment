export const UseAuthentication = ({username, password}) => {
  const users = [
    {
      userID: "admin",
      username: "admin",
      password: "pass"
    }
  ]

  return users.find(user => (user.username === username && user.password === password));
};

export default UseAuthentication;