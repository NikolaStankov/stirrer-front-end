// src/pages/Home.js
import React from "react";
import CreateTweetForm from "../components/CreateTweetForm";
import TweetsHomeFeed from "../components/TweetsHomeFeed";
import { useAuth0 } from "@auth0/auth0-react";
import { Spinner, Container } from "react-bootstrap";
import { useUser } from "../contexts/UserContext";

const Home = () => {
  const { isAuthenticated } = useAuth0();
  const { user } = useUser();
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log("Api URL on Home page is: ", apiUrl);

  if (!isAuthenticated) {
    return <div>Welcome to Stirrer! Please log in to see tweets.</div>;
  }

  if (!user) {
    return (
      <Container className="d-flex flex-column align-items-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading feed...</p>
      </Container>
    );
  }

  return (
    <div>
      <CreateTweetForm apiUrl={apiUrl} />
      <TweetsHomeFeed apiUrl={apiUrl} />
    </div>
  );
};

export default Home;
