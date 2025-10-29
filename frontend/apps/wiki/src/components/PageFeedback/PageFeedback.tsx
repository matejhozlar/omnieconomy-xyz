import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, X, Send } from "lucide-react";
import styles from "./PageFeedback.module.scss";

interface PageFeedbackProps {
  categoryId: string;
  pageSlug: string;
}

type FeedbackState = "idle" | "submitting" | "submitted" | "error";
type Rating = "helpful" | "not_helpful" | null;

export default function PageFeedback({
  categoryId,
  pageSlug,
}: PageFeedbackProps) {
  const [rating, setRating] = useState<Rating>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [state, setState] = useState<FeedbackState>("idle");
  const [hasRated, setHasRated] = useState(false);
  //   const [stats, setStats] = useState({
  //     totalRatings: 0,
  //     helpfulPercentage: 0,
  //   });

  useEffect(() => {
    fetch(`/api/feedback/check/${categoryId}/${pageSlug}`)
      .then((res) => res.json())
      .then((data) => setHasRated(data.hasRated))
      .catch(() => {});

    // fetch(`/api/feedback/stats/${categoryId}/${pageSlug}`)
    //   .then((res) => res.json())
    //   .then((data) => setStats(data))
    //   .catch(() => {});
  }, [categoryId, pageSlug]);

  const handleRating = (selectedRating: Rating) => {
    setRating(selectedRating);

    if (selectedRating === "not_helpful") {
      setShowFeedbackForm(true);
    } else {
      submitFeedback(selectedRating, "");
    }
  };

  const submitFeedback = async (
    selectedRating: Rating,
    feedback: string = ""
  ) => {
    if (!selectedRating) return;

    setState("submitting");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: categoryId,
          page: pageSlug,
          rating: selectedRating,
          feedback: feedback || undefined,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        setState("error");
        return;
      }

      if (data.alreadyRated) {
        setHasRated(true);
        setState("idle");
        return;
      }

      if (response.ok && data.success) {
        setState("submitted");
        setHasRated(true);

        try {
          const statsResponse = await fetch(
            `/api/feedback/stats/${categoryId}/${pageSlug}`
          );
          if (statsResponse.ok) {
            // const statsData = await statsResponse.json();
            // setStats(statsData);
          }
        } catch (statsError) {
          console.error("Failed to fetch updated stats:", statsError);
        }
      } else {
        console.error("Feedback submission failed:", data);
        setState("error");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setState("error");
    }
  };

  const handleFeedbackSubmit = () => {
    submitFeedback(rating, feedbackText);
    setShowFeedbackForm(false);
  };

  const handleSkipFeedback = () => {
    submitFeedback(rating, "");
    setShowFeedbackForm(false);
  };

  if (hasRated && state !== "submitted") {
    return (
      <div className={styles.container}>
        <div className={styles.thankYou}>
          <p>✓ Thanks for your previous feedback!</p>
          {/* {stats.totalRatings > 0 && (
            <p className={styles.stats}>
              {stats.helpfulPercentage}% of {stats.totalRatings} readers found
              this helpful
            </p>
          )} */}
        </div>
      </div>
    );
  }

  if (state === "submitted") {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3>Thank you for your feedback!</h3>
          <p>Your input helps us improve our documentation.</p>
          {/* {stats.totalRatings > 0 && (
            <p className={styles.stats}>
              {stats.helpfulPercentage}% of {stats.totalRatings} readers found
              this helpful
            </p>
          )} */}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.feedbackCard}>
        <h3>Was this page helpful?</h3>

        <div className={styles.ratingButtons}>
          <button
            className={`${styles.ratingButton} ${styles.helpful} ${
              rating === "helpful" ? styles.selected : ""
            }`}
            onClick={() => handleRating("helpful")}
            disabled={state === "submitting"}
          >
            <ThumbsUp size={20} />
            <span>Yes, helpful</span>
          </button>

          <button
            className={`${styles.ratingButton} ${styles.notHelpful} ${
              rating === "not_helpful" ? styles.selected : ""
            }`}
            onClick={() => handleRating("not_helpful")}
            disabled={state === "submitting"}
          >
            <ThumbsDown size={20} />
            <span>Not helpful</span>
          </button>
        </div>

        {state === "error" && (
          <p className={styles.errorMessage}>
            Failed to submit feedback. Please try again.
          </p>
        )}

        {/* {stats.totalRatings > 0 && (
          <p className={styles.stats}>
            {stats.helpfulPercentage}% of {stats.totalRatings} readers found
            this helpful
          </p>
        )} */}
      </div>

      {showFeedbackForm && (
        <div className={styles.feedbackModal}>
          <div className={styles.modalBackdrop} onClick={handleSkipFeedback} />
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={handleSkipFeedback}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3>Help us improve</h3>
            <p>What could we do better? (optional)</p>

            <p className={styles.privacyNote}>
              Your feedback is anonymous and helps improve our documentation.
            </p>

            <textarea
              className={styles.feedbackInput}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what we can improve..."
              rows={4}
              disabled={state === "submitting"}
              autoFocus
            />

            <div className={styles.modalActions}>
              <button
                className={styles.skipButton}
                onClick={handleSkipFeedback}
                disabled={state === "submitting"}
              >
                Skip
              </button>
              <button
                className={styles.submitButton}
                onClick={handleFeedbackSubmit}
                disabled={state === "submitting"}
              >
                <Send size={16} />
                <span>
                  {state === "submitting" ? "Submitting..." : "Submit"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
