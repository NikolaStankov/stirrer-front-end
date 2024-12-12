import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Heart, HeartFill, ChatDots } from "react-bootstrap-icons";
import { useAuth0 } from "@auth0/auth0-react";

const TweetCard = ({ tweet, isLikedByUser, userId, apiUrl }) => {
  const [liked, setLiked] = useState(isLikedByUser);
  const [likeCount, setLikeCount] = useState(tweet.interactionData.likes || 0);
  const [commentsToShow, setCommentsToShow] = useState(5);
  const [comments, setComments] = useState(
    tweet.interactionData.comments || []
  );
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

  const handleLike = async () => {
    const token = await getAccessTokenSilently();
    const url = liked
      ? `${apiUrl}/interactions/unlike`
      : `${apiUrl}/interactions/like`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tweetId: tweet.tweetId,
        userId: userId,
      }),
    });

    if (response.ok) {
      setLiked(!liked);
      setLikeCount(likeCount + (liked ? -1 : 1));
    }
  };

  const handleCommentInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${apiUrl}/interactions/comment`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tweetId: tweet.tweetId,
            userId: userId,
            comment: newComment,
          }),
        });

        if (response.ok) {
          const createdComment = await response.json(); // Assuming the API returns the created comment
          setComments([createdComment, ...comments]); // Add the new comment to the top of the list
          setNewComment(""); // Clear the input field
        } else {
          console.error("Failed to post comment:", response.statusText);
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  const loadMoreComments = () => {
    setCommentsToShow(commentsToShow + 5);
  };

  const toggleCommentsVisibility = () => {
    setShowComments(!showComments);
  };

  const displayedComments = comments.slice(0, commentsToShow);

  return (
    <Card className="mb-3">
      <Card.Body>
        {/* User Info with Profile Image */}
        <div className="d-flex align-items-center mb-3">
          <img
            src={
              `data:image/png;base64,${tweet.userImage}` ||
              "/default-profile.png"
            }
            alt={tweet.userDisplayName}
            className="rounded-circle"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              marginRight: "15px",
            }}
          />
          <div>
            <Card.Title className="mb-0">
              {tweet.userDisplayName || "Unknown User"}
            </Card.Title>
          </div>
        </div>

        {/* Tweet Content */}
        <Card.Text>{tweet.content}</Card.Text>

        {/* Like and Comment Buttons */}
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-primary"
            onClick={handleLike}
            className="d-flex align-items-center"
          >
            {liked ? <HeartFill color="red" /> : <Heart />}
            <span className="ml-2">{likeCount}</span>
          </Button>
          <Button
            variant="link"
            onClick={toggleCommentsVisibility}
            className="d-flex align-items-center"
          >
            <ChatDots />
            <span className="ml-2">Comments</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-3">
            <h6>Comments:</h6>
            <ul className="list-unstyled">
              {displayedComments.map((comment) => (
                <li key={comment.id} className="d-flex align-items-start mb-3">
                  {/* User's Profile Image */}
                  <img
                    src={
                      `data:image/png;base64,${comment.userImage}` ||
                      "/default-profile.png"
                    }
                    alt={comment.userDisplayName || "User"}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      marginRight: "15px",
                    }}
                  />
                  <div>
                    {/* User's Display Name and Comment */}
                    <strong>
                      {comment.userDisplayName || "Unknown User"}:
                    </strong>
                    <span> {comment.comment}</span>
                    <br />
                    {/* Timestamp */}
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
            {comments.length > commentsToShow && (
              <Button
                variant="link"
                onClick={loadMoreComments}
                className="text-primary"
                disabled={commentsToShow >= comments.length}
              >
                See more
              </Button>
            )}
          </div>
        )}

        {/* Comment Input Form */}
        {showComments && (
          <Form onSubmit={handleComment} className="mt-3">
            <Form.Group controlId="commentInput">
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={handleCommentInputChange}
                placeholder="Write a comment..."
                maxLength={500}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Post Comment
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default TweetCard;
