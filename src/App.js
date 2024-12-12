import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AuthenticatedApp from "./components/AuthenticatedApp";
import { UserProvider } from "./contexts/UserContext";
import Recommendations from "./pages/Recommendations";

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Navigation />
          <Container className="mt-4">
            <AuthenticatedApp>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/recommendations" element={<Recommendations />} />
              </Routes>
            </AuthenticatedApp>
          </Container>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
