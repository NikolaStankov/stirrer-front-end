import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ReplayEventsButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const userRoles = user["https://stirrer.com/roles"] || [];

  const hasAdminRole = isAuthenticated && user && userRoles.includes("Admin");

  console.log(`Is admin is ${hasAdminRole}, the roles are" ${userRoles}`);

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleReplayEvents = async () => {
    if (!hasAdminRole) {
      setError("You do not have permission to replay events.");
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();

      await fetch(`${apiUrl}/events/replay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      alert("Events replayed successfully!");
    } catch (err) {
      setLoading(false);
      setError("Error replaying events.");
      console.error(err);
    }
  };

  return (
    <div>
      {hasAdminRole && (
        <button onClick={handleReplayEvents} disabled={loading}>
          {loading ? "Replaying Events..." : "Replay Events"}
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ReplayEventsButton;
