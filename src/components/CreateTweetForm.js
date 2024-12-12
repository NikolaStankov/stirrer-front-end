import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../contexts/UserContext";

const TweetForm = ({apiUrl}) => {
  const [tweetContent, setTweetContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (tweetContent.trim().length === 0) {
      setError("Tweet cannot be empty");
    } else if (tweetContent.length > 160) {
      setError("Tweet cannot exceed 160 characters");
    } else {
      setIsLoading(true);
      setError("");
      try {
        const token = await getAccessTokenSilently();
        console.log("Api URL on CreateTweetForm is: ", apiUrl);

        const response = await fetch(`${apiUrl}/tweets-write/tweets`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: tweetContent,
            userId: String(user?.id),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Tweet posted successfully:", data);
        setTweetContent("");
        // You might want to show a success message to the user here
      } catch (error) {
        console.error("Error posting tweet:", error);
        setError("Failed to post tweet. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    setTweetContent(event.target.value);
    if (event.target.value.length > 160) {
      setError("Tweet cannot exceed 160 characters");
    } else {
      setError("");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="tweetContent">
        <Form.Label>Compose your tweet</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={tweetContent}
          onChange={handleChange}
          placeholder="What's happening?"
          maxLength={160}
        />
        <Form.Text className="text-muted">
          {160 - tweetContent.length} characters remaining
        </Form.Text>
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Posting..." : "Tweet"}
      </Button>
    </Form>
  );
};

export default TweetForm;
