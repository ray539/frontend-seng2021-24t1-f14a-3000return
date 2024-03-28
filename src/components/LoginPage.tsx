import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { logInAndGetUser } from "../data";
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const user = logInAndGetUser(username, password);
    if (user == null) {
      setShowError(true);
      return;
    }
    authContext.setCurrentUser(user);
    navigate("/user");
  };

  return (
    <Container>
      <h1 className="display-2">Login</h1><br></br>
      <Form onSubmit={handleSubmit} onFocus={() => setShowError(false)}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {showError && <Alert variant="danger">Incorrect username or password!</Alert>}

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <a className="btn btn-primary" href="/" role="button">Back</a>

    </Container>
  );
}
