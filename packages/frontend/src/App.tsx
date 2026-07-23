import { useEffect, useState } from 'react';
//import Navbar from "react-bootstrap/Navbar";
//import Nav from "react-bootstrap/Nav";
//import { LinkContainer } from "react-router-bootstrap";
import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut, type AuthUser } from 'aws-amplify/auth';
//import { Hub } from 'aws-amplify/utils';
//import Routes from "./Routes.tsx";
import "./App.css";

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);


  async function checkUser() {
    console.log('checkUser...');
    try {
      /* const session = */ await fetchAuthSession({ forceRefresh: true });
      console.log('after fetchAuthSession...');
//      if (session.tokens?.idToken || session.tokens?.accessToken) {
        const currentUser = await getCurrentUser();
        console.log('Successfully authenticated:', currentUser);
//      } else {
//        throw new Error('No valid tokens found');
//      }
      console.log('currentUser: ');
      console.log(currentUser);
      setUser(currentUser);
      await getCustomRoles();
    } catch (err) {
      console.log(err)
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function getCustomRoles() {
    try {
      const session = await fetchAuthSession();
      // Custom attributes are stored within the ID Token's payloads
      console.log("session:", session);
      const customRoles = session.tokens?.idToken?.payload['custom:roles'];
    
      console.log("User Roles:", customRoles);
      return customRoles;
    } catch (error) {
      console.error("Error fetching auth session:", error);
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
