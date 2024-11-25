// user.routes.js
router.get('/profile', getProfile);

router.put('/profile', updateProfile);
router.get('/profile/ratings', getUserRatings);
router.get('/profile/recent-ratings', getRecentRatings);