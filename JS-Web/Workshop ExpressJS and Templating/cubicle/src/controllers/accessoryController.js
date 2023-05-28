const router = require('express').Router();
const Accessory = require('../models/Accessory');
const { isAuthenticated } = require('../middlewares/authMiddlewares');
router.get('/create',isAuthenticated, (req, res) => {
    res.render('accessory/createAccessory');
});
// URL: http://localhost:5000/accessories
router.post('/create', async (req, res) => {
    try {
        const { name, imageUrl, description } = req.body;
        await Accessory.create({ name, imageUrl, description })
        res.redirect('/');
    } catch (error) {
        res.redirect('/');
        console.log(error.message);
    }

})
module.exports = router;