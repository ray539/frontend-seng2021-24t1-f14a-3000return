import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { registerUser } from "../data";
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setShowError(true);
      return;
    }
    const user = registerUser(username, email, password);
    if (user == null) {
      setShowError(true);
      return;
    }
    authContext.setCurrentUser(user);
    navigate("/user");
  };

  return (
    <Container>
      <h1>Register page</h1>
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

        <Form.Group className="mb-3" controlId="formBasicEmail"> {/* Email input field */}
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        {showError && <Alert variant="danger">Passwords do not match or user already exists</Alert>}

        <Button variant="primary" type="submit">
          Register
        </Button>
        <a className="btn btn-primary" href="/" role="button">Back</a>
      </Form>
    </Container>
  );
}
