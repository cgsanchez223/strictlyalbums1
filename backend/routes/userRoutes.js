// Route not in use at the moment - will probably delete. It is not needed right now.
router.get('/profile', getProfile);

router.put('/profile', updateProfile);
router.get('/profile/ratings', getUserRatings);
router.get('/profile/recent-ratings', getRecentRatings);