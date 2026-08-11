import styled from 'styled-components'

const LoginContainer = styled.div`
  max-width: 450px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`

const LoginTitle = styled.h2`
  margin-bottom: 25px;
  color: #111827;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-weight: 600;
  color: #374151;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`

const LoginButton = styled.button`
  margin-top: 5px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`

const Login = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleLogin
}) => {
  return (
    <LoginContainer>
      <LoginTitle>
        Log in to application
      </LoginTitle>

      <Form onSubmit={handleLogin}>
        <Field>
          <Label htmlFor="username">
            username
          </Label>

          <Input
            id="username"
            value={username}
            onChange={({ target }) =>
              handleUsernameChange(target.value)
            }
          />
        </Field>

        <Field>
          <Label htmlFor="password">
            password
          </Label>

          <Input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) =>
              handlePasswordChange(target.value)
            }
          />
        </Field>

        <LoginButton type="submit">
          login
        </LoginButton>
      </Form>
    </LoginContainer>
  )
}

export default Login