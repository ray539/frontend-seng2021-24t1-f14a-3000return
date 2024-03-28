import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function LandingPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">3000 return e-invoice application</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* <Nav className="me-auto">
              <Nav.Link as={Link} to="/user">Go to Dashboard</Nav.Link>
            </Nav> */}
            <Nav className="ms-auto">
              {authContext.currentUser == null ? (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              ) : (
                <Nav.Link>You are already logged in</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mb-5">
        <h1 className="display-2">Welcome to our e-Invoice App!</h1><br></br>
        <p className="lead">What we offer:</p>
        <div className="container overflow-hidden">
          <div className="gy-5">
            <div className="p-3 mb-4">Hassle free e-invoicing</div>
            <div className="p-3 mb-4"> Multiple invoice creation types</div>
            <div className="p-3 mb-4">Secure and fast invoice validation</div>
            <div className="p-3 mb-4">Extra features coming soon!</div>
          </div>
        </div>
      </Container>
      <figure className="text-center">
        <blockquote className="blockquote">
          <p>Our Competitive Pricing Plans</p>
        </blockquote>
        <div className="container text-center">
          <div className="row align-items-start">
            <div className="col">
              Starter <br></br><br></br>
              Free
            </div>
            <div className="col">
              Standard  <br></br><br></br>
              $5/month
            </div>
            <div className="col">
              Premium  <br></br><br></br>
              $8/month
            </div>
          </div>
        </div>
      </figure>
    </>
  );
}
