import React, { useState, useContext, useEffect } from 'react';
import { Star, Heart, MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/ChargerSideBar.css';
import { FavouritesContext } from '../context/FavouritesContext';
import { UserContext } from '../context/user';
import { submitChargerReview, getChargerReviews, getChargerReviewStats, checkUserReviewStatus, updateChargerReview } from '../services/chargerReviewService';


import { useNavigate } from 'react-router-dom';

export default function ChargerSideBar({ station, onClose }) {
  const [feedback, setFeedback] = useState('');
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
      // For demo purposes, use mock data
      setReviews([
        {
          id: '1',
          userName: 'John Doe',
          userAvatar: 'JD',
          rating: 5,
          comment: 'Great charging station! Fast and reliable.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          timeAgo: '1 day ago'
        },
        {
          id: '2',
          userName: 'Sarah M.',
          userAvatar: 'SM',
          rating: 4,
          comment: 'Good location, but sometimes busy during peak hours.',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          timeAgo: '2 days ago'
        }
      ]);
      setReviewStats({ averageRating: 4.3, totalReviews: 12 });
    } finally {
      setIsLoading(false);
    }
  };

  const estimatedCost =
    kWh && pricePerKWh ? (kWh * pricePerKWh).toFixed(2) : '';

  const handleSubmitReview = async () => {
    if (!userReview.rating || !station?._id || !user?.token) {
      if (!user?.token) {
        alert('Please sign in to submit a review.');
        return;
      }
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
        alert('Review updated successfully!');
      } else {
        // Create new review
        const newReviewData = {
          chargerId: station._id,
          ...reviewData
        };
        await submitChargerReview(newReviewData, user.token);
        alert('Review submitted successfully!');
      }
      
      setUserReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
      setUserHasReviewed(true);
      
      // Reload all charger data
      await loadChargerData();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.message.includes('already reviewed')) {
        alert('You have already reviewed this charger. You can update your existing review.');
      } else {
        alert('Failed to submit review. Please try again.');
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



  const navigate = useNavigate();
  if (!station) return null;

  // Check if station is in favourites
  const isFav = favourites.some(s => s._id === station._id);

  const estimatedCost = kWh && pricePerKWh ? (kWh * pricePerKWh).toFixed(2) : '';

  return (
    <div className="sidebar-container">
      <button className="close-btn" onClick={onClose}>✖</button>

      <div className="sidebar-section">
        <h3>📌 Charger Info</h3>
        <ul>
          <li><strong>Operator:</strong> {station.operator || 'N/A'}</li>
          <li><strong>Type:</strong> {station.connection_type || 'N/A'}</li>
          <li><strong>Power:</strong> {station.power_output || 'N/A'} kW</li>
          <li><strong>Cost:</strong> {station.cost || 'N/A'}</li>
          <li><strong>Access:</strong> {station.access_key_required === 'true' ? 'Restricted' : 'Open'}</li>
        </ul>

<button
  className="booking-btn"
  onClick={() => navigate('/bookingtool', { state: { station } })}
>
  📅 Book this charger
</button>

        <button
          onClick={() => toggleFavourite(station)}
          className="favourite-btn"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "1.8rem"
          }}
        >
          <span style={{ color: isFav ? "red" : "grey" }}>
            {isFav ? "❤️" : "🤍"}
          </span>
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
              <span className="review-count">({reviewStats.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
                alert('✅ Station saved to favorites!');
              } else {
                alert('❌ Station removed from favorites!');
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

        {/* Station Details */}
        <div className="station-details">
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
              placeholder={userHasReviewed ? "Update your review..." : "Write your review..."}
              value={userReview.comment}
              onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
              className="review-textarea"
            />
            <button
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !userReview.rating}
              className="submit-review-btn"
            >
              {isSubmittingReview 
                ? (userHasReviewed ? 'Updating...' : 'Submitting...') 
                : (userHasReviewed ? 'Update Review' : 'Submit Review')
              }
            </button>
          </div>
        )}

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header" onClick={() => setShowReviews(!showReviews)}>
            <h4>Reviews</h4>
            <span className="review-count-badge">{reviews.length}</span>
            {showReviews ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {showReviews && (
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
                      <span className="review-date">{formatDate(review.timeAgo || review.createdAt)}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Charge Estimator */}
        <div className="charge-estimator">
          <h4>Charge Estimator</h4>
          <div className="estimator-inputs">
            <input
              type="number"
              placeholder="Energy (kWh)"
              value={kWh}
              onChange={e => setKWh(e.target.value)}
              className="estimator-input"
            />
            <input
              type="number"
              placeholder="Price per kWh ($)"
              value={pricePerKWh}
              onChange={e => setPricePerKWh(e.target.value)}
              className="estimator-input"
            />
          </div>
          {estimatedCost && (
            <div className="estimated-cost">
              Estimated cost: <strong>${estimatedCost}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
