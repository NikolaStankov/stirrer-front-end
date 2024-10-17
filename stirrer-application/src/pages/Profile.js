import { useEffect } from "react";
import ProfileInfo from "../components/ProfileInfo";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        console.log("Access token is: ", accessToken);
      } catch (e) {
        console.error(e.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently]);

  if (isAuthenticated && user) {
    const userRoles = user["https://stirrer.com/roles"] || [];

    console.log("User Roles: ", userRoles);
  }

  return (
    <>
      <div>This is the profile page</div>
      <ProfileInfo />
    </>
  );
};

export default Profile;
