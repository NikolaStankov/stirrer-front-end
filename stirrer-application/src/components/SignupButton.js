import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const SignupButton = () => {
  const { logout } = useAuth0();

  return (
    <>
      <Button
        variant="primary"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log out
      </Button>
    </>
  );
};

export default SignupButton;
