import { useEffect, useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import UserTweetList from "../components/UserTweetList";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../contexts/UserContext";
import { Spinner, Container } from "react-bootstrap";
import ReplayEventsButton from "../components/ReplayEventsButton";

const Profile = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [profileImage, setProfileImage] = useState(null);
  const { user } = useUser();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        if (user && user.imageId) {
          const profilePicUrl = await fetchUserProfilePic(
            accessToken,
            user.imageId
          );
          setProfileImage(profilePicUrl);
        }
      } catch (e) {
        console.error(e.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user]);

  const fetchUserProfilePic = async (token, imageId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(
        `${apiUrl}/users/profile-image-byid/${imageId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching profile image: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  if (!isAuthenticated) {
    return <div>Welcome to Stirrer! Please log in to see your profile.</div>;
  }

  if (!user) {
    return (
      <Container className="d-flex flex-column align-items-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your profile...</p>
      </Container>
    );
  }
  return (
    <>
      <ProfileInfo profileImage={profileImage} />
      <ReplayEventsButton />
      <UserTweetList apiUrl={apiUrl} />
    </>
  );
};

export default Profile;
