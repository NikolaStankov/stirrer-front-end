import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import RecommendationCard from "../components/RecommendationCard";
import { useUser } from "../contexts/UserContext";
import { Spinner, Container } from "react-bootstrap";

const Recommendations = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const apiUrl = process.env.REACT_APP_API_URL;
        console.log("Api url from fetching recommendations", apiUrl);
        const response = await fetch(
          `${apiUrl}/feed/reccomendation/${String(user?.id)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error fetching recommendations: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Recommendations data: ", data);
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [isAuthenticated, getAccessTokenSilently, user?.id]);

  const handleFollow = async (followeeId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      console.log("Api url from handle follow ", apiUrl);

      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiUrl}/feed/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: String(user?.id),
          followeeId: followeeId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error following user: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  };

  if (!isAuthenticated) {
    return <div>Welcome to Stirrer! Please log in to see recommendations.</div>;
  }

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading recommendations...</p>
      </Container>
    );
  }

  return (
    <div>
      {recommendations.length === 0 ? (
        <p>No recommendations available.</p>
      ) : (
        recommendations.map((user) => (
          <RecommendationCard
            key={user.userId}
            userId={user.userId}
            userDisplayName={user.displayName}
            userImage={user.image}
            onFollow={handleFollow}
          />
        ))
      )}
    </div>
  );
};

export default Recommendations;
