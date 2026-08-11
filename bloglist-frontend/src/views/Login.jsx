const Login = ({
    username,
    password,
    handleUsernameChange,
    handlePasswordChange,
    handleLogin,
    notification
  }) => {
    return (
      <div>
        <h2>Log in to application</h2>
  
        {notification && (
          <div>
            {notification.message}
          </div>
        )}
  
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">
              username
            </label>
  
            <input
              id="username"
              value={username}
              onChange={({ target }) =>
                handleUsernameChange(target.value)
              }
            />
          </div>
  
          <div>
            <label htmlFor="password">
              password
            </label>
  
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) =>
                handlePasswordChange(target.value)
              }
            />
          </div>
  
          <button type="submit">
            login
          </button>
        </form>
      </div>
    )
  }
  
  export default Login