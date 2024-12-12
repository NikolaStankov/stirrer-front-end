import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
      <Button
        variant="outline-primary"
        className="me-2"
        onClick={() => loginWithRedirect()}
      >
        Log In
      </Button>
    </>
  );
};

export default LoginButton;
