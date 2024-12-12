import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Image, Button, Card } from "react-bootstrap";
import { useUser } from "../contexts/UserContext";

const ProfileInfo = ({ profileImage }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { user } = useUser();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <Container className="my-4">
        <Card className="shadow-sm">
          <Card.Body>
            {/* Profile Header */}
            <Row className="align-items-center">
              <Col xs={3} md={2} className="text-center">
                <Image
                  src={profileImage || "/default-profile.png"}
                  alt={user.displayName}
                  roundedCircle
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col xs={9} md={10}>
                <h3 className="mb-0">{user.displayName || "Display Name"}</h3>
                <p className="text-muted">@{user.username || "username"}</p>
              </Col>
            </Row>

            {/* Followers and Following Links */}
            <Row className="mt-4">
              <Col xs={6} md={4} className="text-center">
                <Button variant="link" className="text-decoration-none">
                  <strong>123</strong> Followers
                </Button>
              </Col>
              <Col xs={6} md={4} className="text-center">
                <Button variant="link" className="text-decoration-none">
                  <strong>456</strong> Following
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    )
  );
};

export default ProfileInfo;
