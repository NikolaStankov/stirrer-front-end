import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileCompletion from "./profile/ProfileCompletion";
import { useUser } from "../contexts/UserContext";
import { Spinner, Container } from "react-bootstrap";

const AuthenticatedApp = ({ children }) => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const { setUser } = useUser();
  const [isProfileCompleted, setIsProfileCompleted] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          console.log(token);

          const response = await fetch(
            `${apiUrl}/users/${user.sub}/profile-status`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch profile status");
          }

          const data = await response.json();
          setIsProfileCompleted(data.profileCompleted);
        } catch (error) {
          console.error("Error checking profile status:", error);
        }
      }
    };

    if (isAuthenticated) {
      checkProfileStatus();
    }
  }, [isAuthenticated, user, getAccessTokenSilently, apiUrl]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user && isProfileCompleted) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${apiUrl}/users/${user.sub}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();
          setUser(userData); // Save the user's info globally
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (isProfileCompleted) {
      fetchUserData();
    }
  }, [
    isAuthenticated,
    user,
    isProfileCompleted,
    getAccessTokenSilently,
    setUser,
    apiUrl,
  ]);

  if (isLoading) {
    return (
      <Container className="d-flex flex-column align-items-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return children; // Render children even when not authenticated
  }

  if (isProfileCompleted === null) {
    return (
      <Container className="d-flex flex-column align-items-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Checking profile status...</p>
      </Container>
    );
  }

  if (!isProfileCompleted) {
    return <ProfileCompletion onComplete={() => setIsProfileCompleted(true)} />;
  }

  return children;
};

export default AuthenticatedApp;
