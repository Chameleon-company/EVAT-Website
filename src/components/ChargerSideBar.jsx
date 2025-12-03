import React, { useState, useContext, useEffect } from 'react';
import { Star, Heart, MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/ChargerSideBar.css';
import { FavouritesContext } from '../context/FavouritesContext';
import SideBarBookingTool from '../components/SideBarBookingTool';
import { UserContext } from '../context/user';
import {
  submitChargerReview, getChargerReviews, getChargerReviewStats,
  checkUserReviewStatus, updateChargerReview, getUsername
} from '../services/chargerReviewService';
import { toast } from "react-toastify";


export default function ChargerSideBar({ station, onClose }) {
  const [kWh, setKWh] = useState('');
  const [pricePerKWh, setPricePerKWh] = useState('');
  const { favourites, toggleFavourite } = useContext(FavouritesContext);
  const { user } = useContext(UserContext);
  const [isFav, setIsFav] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // New states for reviews
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [existingUserReview, setExistingUserReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [kms, setKms] = useState('');
  const [carEfficiency, setCarEfficiency] = useState('');
  const [evPricePerKWh, setEvPricePerKWh] = useState('');
  const [evpricePerKWh, setevPricePerKWh] = useState('');

  useEffect(() => {
    if (!station) return;
    const found = favourites.some((s) =>
      (typeof s === 'object' ? s._id : s) === station._id
    );
    setIsFav(found);

    // Load reviews and stats for this charger
    loadChargerData();
  }, [favourites, station, user]);

  const loadChargerData = async () => {
    if (!station?._id) return;

    setIsLoading(true);
    try {
      // Load reviews and stats in parallel
      const [reviewsResponse, statsResponse] = await Promise.all([
        getChargerReviews(station._id),
        getChargerReviewStats(station._id)
      ]);

      // Change the username value
      if (user?.token) { // User is signed in
        for (var i in reviewsResponse['data']['reviews']) { // Replace the username value with the first name
          var username = await getUsername(reviewsResponse['data']['reviews'][i]['userId'], user.token);
          reviewsResponse['data']['reviews'][i]['userName'] = username['data']['firstName'] || '';
        }
      }
      else { // User is not signed in
        for (var i in reviewsResponse['data']['reviews']) { 
          reviewsResponse['data']['reviews'][i]['userName'] = ''; // Blank out username
        }
      }

      setReviews(reviewsResponse.data?.reviews || []);
      setReviewStats(statsResponse.data || { averageRating: 0, totalReviews: 0 });

      // Check if user has already reviewed this charger
      if (user?.token) {
        try {
          const userStatusResponse = await checkUserReviewStatus(station._id, user.token);
          setUserHasReviewed(userStatusResponse.data?.hasReviewed || false);
          setExistingUserReview(userStatusResponse.data?.userReview || null);

          // If user has reviewed, populate the form with their existing review
          if (userStatusResponse.data?.userReview) {
            setUserReview({
              rating: userStatusResponse.data.userReview.rating,
              comment: userStatusResponse.data.userReview.comment
            });
            setExistingUserReview(userStatusResponse.data.userReview);
          }
        } catch (error) {
          console.error('Error checking user review status:', error);
          // Continue without user review status
        }
      }
    } catch (error) {
      console.error('Error loading charger data:', error);
      // If error occurs, show no reviews
      setReviews([{}]);
      setReviewStats({ averageRating: 0, totalReviews: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const estimatedCost =
    kWh && pricePerKWh ? (kWh * pricePerKWh).toFixed(2) : '';

  const handleSubmitReview = async () => {
    // Prevent submitting a review if one of these aren't present
    if (!userReview.rating || !userReview.comment || !station?._id || !user?.token) {
      if (!user?.token) { // Is user signed in?
        alert('Please sign in to submit a review.');
        return;
      }
      return;
    }

    if (userReview.comment.length <= 4) { // Prevent small or empty comments
      toast.error(
        <div>
          Comment must be at least 5 characters!
        </div>,
        { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "review-error-comment" }
      );
      return;
    } else if (userReview.comment.length >= 256) {
      toast.error(
        <div>
          Comment must be less than 256 characters!
        </div>,
        { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "review-error-comment" }
      );
    }

    if (user.rating < 0 || user.rating > 5) { // Prevent malformed reviews
      toast.error(
        <div>
          Rating must be between 1 and 5!
        </div>,
        { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "review-error-rating" }
      );
      return;
    }


    setIsSubmittingReview(true);
    try {
      const reviewData = {
        rating: userReview.rating,
        comment: userReview.comment
      };

      if (userHasReviewed && existingUserReview) {
        // Update existing review
        await updateChargerReview(existingUserReview.id, reviewData, user.token);
        toast.success(
          <div>
            Review Updated Successfully!
          </div>,
          { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "review-success" }
        );
      } else {
        // Create new review
        const newReviewData = {
          chargerId: station._id,
          ...reviewData
        };
        await submitChargerReview(newReviewData, user.token);
        toast.success(
          <div>
            Review Submitted Successfully!
          </div>,
          { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "review-success" })
      }

      setUserReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
      setUserHasReviewed(true);

      // Reload all charger data
      await loadChargerData();

    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.message.includes('already reviewed')) {
        toast.error(
          <div>
            You have already reviewed this charger. You can update your existing review
          </div>,
          { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "review-error-existing" }
        );
      } else {
        toast.error(
          <div>
            Failed to submit review. Please try again.
          </div>,
          { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "review-error-unknown" }
        );
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatDate = (dateString) => {
    // If the API already provides timeAgo, use it
    if (typeof dateString === 'string' && dateString.includes('ago')) {
      return dateString;
    }

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (!station) return null;

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-content">
        {/* Station Header */}
        <div className="station-header">
          <h2 className="station-name">{station.operator || 'Charging Station'}</h2>
          <div className="station-rating">
            <div className="rating-display">
              <span className="rating-number">{reviewStats.averageRating.toFixed(1)}</span>
              <div className="stars-display">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= Math.round(reviewStats.averageRating) ? '#fbbf24' : '#d1d5db'}
                    color={star <= Math.round(reviewStats.averageRating) ? '#fbbf24' : '#d1d5db'}
                  />
                ))}
              </div>
              <span
                className="review-count clickable-text"
                onClick={() => setShowReviews(!showReviews)}
              >
                ({reviewStats.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sidebar-section">
          <div className="action-buttons">
            <button
              onClick={async () => {
                if (!user?.token) {
                  alert('Please sign in to save favorites.');
                  return;
                }
                try {
                  await toggleFavourite(station);
                  setIsFav((prev) => !prev);
                  console.log('Favorite toggled successfully');

                  // Show success message
                  if (!isFav) {
                    alert('Station saved to favorites!');
                  } else {
                    alert('Station removed from favorites!');
                  }
                } catch (error) {
                  console.error('Error toggling favorite:', error);
                  alert('Failed to save favorite. Please try again.');
                }
              }}
              className={`action-btn ${isFav ? 'favourite-active' : 'favourite-btn'}`}
            >
              <Heart size={18} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : '#374151'} />
              <span>{isFav ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => {
                if (!user?.token) {
                  alert('Please sign in to review this charger.');
                  return;
                }
                // If user has reviewed, populate form with existing review data
                if (userHasReviewed && existingUserReview) {
                  setUserReview({
                    rating: existingUserReview.rating,
                    comment: existingUserReview.comment
                  });
                } else {
                  // Reset form for new review
                  setUserReview({ rating: 0, comment: '' });
                }
                setShowReviewForm(!showReviewForm);
              }}
              className={`action-btn review-btn ${userHasReviewed ? 'reviewed' : ''}`}
            >
              <Star size={18} fill={userHasReviewed ? '#fbbf24' : 'none'} color={userHasReviewed ? '#fbbf24' : '#374151'} />
              <span>{userHasReviewed ? 'Update Review' : 'Review'}</span>
            </button>
          </div>
        </div>

        {/* Station Details */}
        <div className="sidebar-section">
          <div className="detail-item">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{station.connection_type || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Power:</span>
            <span className="detail-value">{station.power_output || 'N/A'} kW</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Cost:</span>
            <span className="detail-value">{station.cost || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Access:</span>
            <span className="detail-value">{station.access_key_required === 'true' ? 'Restricted' : 'Open'}</span>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="sidebar-section">
            <div className="review-form">
              <h4>{userHasReviewed ? 'Update your review' : 'Rate this charger'}</h4>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className="rating-star"
                    fill={star <= userReview.rating ? '#fbbf24' : '#d1d5db'}
                    color={star <= userReview.rating ? '#fbbf24' : '#d1d5db'}
                    onClick={() => setUserReview(prev => ({ ...prev, rating: star }))}
                  />
                ))}
              </div>
              <textarea
                required minLength="5" maxLength="255"
                placeholder={userHasReviewed ? "Update your review..." : "Write your review..."}
                value={userReview.comment}
                onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                className="review-textarea"
              />
              {/* Min/Max character information*/}
              <p className={(userReview.comment.length <= 4) ? "review-charCount-invalid" : "review-charCount-valid"}>
                {userReview.comment.length}/255
              </p>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview || !userReview.rating || userReview.comment.length <= 4 || userReview.comment.length >= 255}
                className="submit-review-btn"
              >
                {isSubmittingReview
                  ? (userHasReviewed ? 'Updating...' : 'Submitting...')
                  : (userHasReviewed ? 'Update Review' : 'Submit Review')
                }
              </button>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {showReviews && (
          <div className="sidebar-section">
            <div className="section-header">See all reviews</div>
            <div className="reviews-list">
              {isLoading ? (
                <div className="loading-reviews">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="no-reviews">No reviews yet. Be the first to review this charger!</div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.userAvatar || review.userName?.charAt(0) || 'U'}
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">{review.userName || 'Anonymous'}</span>
                          {/* Usernames are hardcoded when a review is made making it a bad idea to use it from the charger_reviews
                          as a user can update their username and it not be updated elsewhere. The best practice would be to lookup
                          user id and use the firstName parameter, this doesnt exist on some old accounts at the moment */}
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                fill={star <= review.rating ? '#fbbf24' : '#d1d5db'}
                                color={star <= review.rating ? '#fbbf24' : '#d1d5db'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="review-date">{formatDate(review.createdAt)}</span> {/* Unable to validate this */}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}


        {/* Booking Tool */}
        <div className="sidebar-section">
          <div className="section-header">Book this Charger</div>
          <SideBarBookingTool stationName={station?.operator || "Unknown"} />

          {/* EV Cost Estimator */}
          <div className="sidebar-section">
            <div className="section-header">EV Cost Calculator</div>
            <div className="estimator-inputs">
              <input
                type="number"
                className="estimator-input"
                placeholder="Avg. kms you want to drive"
                value={kms}
                onChange={e => setKms(e.target.value)}
                min="1"
              />
              <input
                type="number"
                className="estimator-input"
                placeholder="Car Efficiency (km/kWh)"
                value={carEfficiency}
                onChange={e => setCarEfficiency(e.target.value)}
                min="0.1"
                step="0.1"
              />
              <input
                type="number"
                className="estimator-input"
                placeholder="Electricity Cost ($ per kWh)"
                value={evPricePerKWh}
                onChange={e => setEvPricePerKWh(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>
            {kms && carEfficiency && evPricePerKWh && (
              <div className="estimated-cost">
                Estimated Electric Cost for the usage: <strong>
                  ${((parseFloat(kms) / parseFloat(carEfficiency)) * parseFloat(evPricePerKWh)).toFixed(2)}
                </strong>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}
