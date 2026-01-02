import React, { useState, useContext, useEffect } from 'react';
import { Star, Heart, MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FavouritesContext } from '../context/FavouritesContext';
import SideBarBookingTool from '../components/SideBarBookingTool';
import { UserContext } from '../context/user';
import { submitChargerReview, getChargerReviews, getChargerReviewStats, checkUserReviewStatus, updateChargerReview } from '../services/chargerReviewService';

import '../styles/Buttons.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/Elements.css';
import '../styles/Sidebar.css';
import '../styles/Validation.css';

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

  if (!station) return null;

  return (
    <div className="sidebar">
      <div>
        <button className="btn btn-danger sidebar-btn-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-content">
        {/* Station Header */}
        <div>
          <h4 className='h4 text-center'>{station.operator || 'Charging Station'}</h4>
          <div className="rating-display">
            <span>{reviewStats.averageRating.toFixed(1)}</span>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className='middle'
                  size={16}
                  fill={star <= Math.round(reviewStats.averageRating) ? '#fbbf24' : '#d1d5db'}
                  color={star <= Math.round(reviewStats.averageRating) ? '#fbbf24' : '#d1d5db'}
                />
              ))}
            </div>
            <span
              className="clickable-text middle"
              onClick={() => setShowReviews(!showReviews)}
            >
              ({reviewStats.totalReviews} reviews)
            </span>
          </div>
        </div>

        {/* save favourite button */}
        <div className="sidebar-linebreak" />
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
                // if (!isFav) {
                //   alert('Station saved to favorites!');
                // } else {
                //   alert('Station removed from favorites!');
                // }
              } catch (error) {
                console.error('Error toggling favorite:', error);
                //alert('Failed to save favorite. Please try again.');
              }
            }}
            className={`btn sidebar-btn btn-small ${isFav ? 'favourite' : ''}`}
          >
            <Heart className={`heart-${isFav ? 'full' : 'empty'}`} size={18} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
          
          {/* review button */}
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
            className={`btn sidebar-btn btn-small ${userHasReviewed ? 'reviewed' : ''}`}
          >
            <Star className={`star-${userHasReviewed ? 'full' : 'empty'}`} size={18} />
            <span>{userHasReviewed ? 'Edit Review' : 'Review'}</span>
          </button>
        </div>

        {/* Station Details */}
        <div className="sidebar-linebreak" />
        <div className="sidebar-detail-row">
          <span className="sidebar-detail-label">Type:</span>
          <span className="sidebar-detail-value">{station.connection_type || 'N/A'}</span>
        </div>
        <div className="sidebar-detail-row">
          <span className="sidebar-detail-label">Power:</span>
          <span className="sidebar-detail-value">{station.power_output || 'N/A'} kW</span>
        </div>
        <div className="sidebar-detail-row">
          <span className="sidebar-detail-label">Cost:</span>
          <span className="sidebar-detail-value">{station.cost || 'N/A'}</span>
        </div>
        <div className="sidebar-detail-row">
          <span className="sidebar-detail-label">Access:</span>
          <span className="sidebar-detail-value">{station.access_key_required === 'true' ? 'Restricted' : 'Open'}</span>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div>
            <div className="sidebar-linebreak" />
            <h6>{userHasReviewed ? 'Update your review' : 'Rate this charger'}</h6>
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
              className="full-width"
              placeholder={userHasReviewed ? "Update your review..." : "Write your review..."}
              value={userReview.comment}
              onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
            />
            <button
              className="btn btn-primary btn-small full-width uppercase"
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !userReview.rating}
            >
              {isSubmittingReview
                ? (userHasReviewed ? 'Updating...' : 'Submitting...')
                : (userHasReviewed ? 'Update Review' : 'Submit Review')
              }
            </button>
          </div>
        )}

        {/* Reviews Section */}
        {showReviews && (
          <div>
            <div className="sidebar-linebreak" />
            <h6>Reviews</h6>
            <div>
              {isLoading ? (
                // loading reviews
                <div className="font-italic text-small">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                // no reviews
                <div className="font-italic text-small">No reviews yet. Be the first to review this charger!</div>
              ) : (
                // show reviews
                reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="reviewer">
                      <div className="reviewer-avatar uppercase">
                        {review.userAvatar || review.userName?.charAt(0) || 'U'}
                      </div>
                      <div className="reviewer-details">
                        <div className='reviewer-name'>
                          <span className="text-small">{review.userName || 'Anonymous'}</span>
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
                        <div className="review-time text-tiny">{formatDate(review.timeAgo || review.createdAt)}</div>
                      </div>
                    </div>
                    <p className="review-comment text-small font-italic">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        
        {/* Booking Tool */}
        <div className="sidebar-linebreak" />
        <h6>Book this Charger</h6>
        <SideBarBookingTool stationName={station?.operator || "Unknown"} />
        
        {/* EV Cost Estimator */}
        <div className="sidebar-linebreak" />
        <h6>EV Cost Calculator</h6>
        <div>
          <div className='input-and-label-same-line'>
            <label>Avg. km</label>
            <input
              className="input"
              type="number"
              placeholder="km to drive"
              value={kms}
              onChange={e => setKms(e.target.value)}
              min="1"
            />
          </div>
          <div className='input-and-label-same-line'>
            <label>Car Efficiency</label>
            <input
              className="input"
              type="number"
              placeholder="km/kWh"
              value={carEfficiency}
              onChange={e => setCarEfficiency(e.target.value)}
              min="0.1"
              step="0.1"
            />
          </div>
          <div className='input-and-label-same-line'>
            <label>Electricity Cost</label>
            <input
              className="input"
              type="number"
              placeholder="$ per kWh"
              value={evPricePerKWh}
              onChange={e => setEvPricePerKWh(e.target.value)}
              min="0.01"
              step="0.01"
            />
          </div>
        </div>
        {/* cost form result */}
        {kms && carEfficiency && evPricePerKWh ? (
          <div className="estimated-display font-bold" placeholder='Fill out the form to get a result'>
            Estimated Electric Cost for the usage: 
            ${((parseFloat(kms) / parseFloat(carEfficiency)) * parseFloat(evPricePerKWh)).toFixed(2)}
          </div>
        ) : (
          <div className="estimated-display font-italic">
            Fill out the form to get a result
          </div>
        )}
      </div>
    </div>
  );
}
