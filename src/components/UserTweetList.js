import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../contexts/UserContext"; // Import UserContext hook
import TweetCard from "./TweetCard";

const TweetsHomeFeed = ({apiUrl}) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState("");
  const { user } = useUser(); // Get userId from UserContext
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchTweets = async () => {
      if (user?.id) {
        try {
          const token = await getAccessTokenSilently();
          console.log("Api URL from fecthing feed: ", apiUrl)
          const response = await fetch(
            `${apiUrl}/tweets-read/tweets/user/${String(user.id)}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch tweets");
          }

          const data = await response.json();
          setTweets(data); // Store fetched tweets in state
        } catch (error) {
          console.error("Error fetching tweets:", error);
          setError("Failed to fetch tweets. Please try again.");
        }
      }
    };

    fetchTweets();
  }, [user?.id, getAccessTokenSilently, apiUrl]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <TweetCard
            key={tweet.tweet.tweetId}
            tweet={tweet.tweet}
            isLikedByUser={tweet.isLikedByUser}
            userId={String(user?.id)}
            apiUrl={apiUrl}
          />
        ))
      ) : (
        <p>No tweets found in your feed.</p>
      )}
    </div>
  );
};

export default TweetsHomeFeed;
