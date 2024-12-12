import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";

const RecommendationCard = ({
  userId,
  userDisplayName,
  userImage,
  onFollow,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    try {
      await onFollow(userId);
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body className="d-flex align-items-center">
        {/* User Image */}
        <img
          src={
            userImage
              ? `data:image/png;base64,${userImage}`
              : "/default-profile.png" // Fallback to a default image
          }
          alt={userDisplayName}
          className="rounded-circle"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            marginRight: "15px",
          }}
        />

        {/* User Details */}
        <div style={{ flex: 1 }}>
          <Card.Title>{userDisplayName}</Card.Title>
        </div>

        {/* Follow Button */}
        <Button
          variant={isFollowing ? "success" : "primary"}
          disabled={isFollowing}
          onClick={handleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default RecommendationCard;
