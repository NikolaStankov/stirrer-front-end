import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const ProfileCompletion = ({ onComplete }) => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleProfileCompletion = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const token = await getAccessTokenSilently();
      let imageId = null;

      // Step 1: Upload profile picture if provided
      if (profilePicture) {
        if (profilePicture.size > 5 * 1024 * 1024) {
          throw new Error("File size exceeds 5MB limit");
        }

        const imageData = new FormData();
        imageData.append("file", profilePicture);
        imageData.append("userId", user.sub);

        console.log("FormData keys:", [...imageData.keys()]);
        console.log("File details:", {
          name: profilePicture.name,
          type: profilePicture.type,
          size: profilePicture.size,
        });

        const imageResponse = await fetch(
          "http://localhost:3333/users/upload-image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: imageData,
          }
        );

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(
            `Failed to upload profile picture: ${
              errorData.message || imageResponse.statusText
            }`
          );
        }

        const imageResult = await imageResponse.json();
        imageId = imageResult.id; // Save the image ID
      }

      // Step 2: Save user data with the image ID
      const userData = {
        username: username,
        displayName: displayName,
        auth0UserId: user.sub,
        imageId,
      };

      const userResponse = await fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to save user data");
      }

      setSuccess(true);
      console.log("User profile completed successfully");
      onComplete();
    } catch (error) {
      console.error("Profile completion error:", error);
      setError("Failed to complete profile. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setProfilePicture(file);
    } else {
      setProfilePicture(null);
      e.target.value = "";
      setError("Please select a valid image file (JPEG, PNG, or GIF).");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2 className="mb-4">Complete Your Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">Profile completed successfully!</Alert>
          )}
          <Form onSubmit={handleProfileCompletion}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDisplayName">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProfilePicture">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif"
              />
              <Form.Text className="text-muted">
                Upload a JPEG, PNG, or GIF image for your profile picture.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Complete Profile
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileCompletion;
