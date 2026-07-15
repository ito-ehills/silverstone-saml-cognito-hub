import React, { useEffect, useState } from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import Routes from "./Routes.tsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <p>You have successfully logged in via SAML.</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <div>
          <h1>Internal Application</h1>
          <p>Please sign in using your corporate credentials.</p>
          {/* This triggers the redirect to your IdP via Cognito */}
          <button onClick={() => signInWithRedirect()}>Sign In with SAML</button>
        </div>
      )}
    </div>
  );


/*

  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold text-muted">Silverstone</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
            <LinkContainer to="/signup">
              <Nav.Link>Signup</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
*/
}
export default App;
