const express = require('express');

const router = express.Router();
const productsController = require('../controllers/productsController');

router.get('/', productsController.getAllProducts);
router.get('/search', productsController.searchProducts);
router.get('/product/:id', productsController.getProductById);
// QUESTION: Do we want to have separate endpoints for category and subcategory filtering, or combine into one endpoint with optional query parameters?
router.get('/:category/:subcategory', productsController.getProductsBySubcategory);
router.get('/:category', productsController.getProductsByCategory);

router.post('/create-product', productsController.createProduct);
router.put('/update-product/:id', productsController.updateProduct);
router.delete('/delete-product/:id', productsController.deleteProduct);

module.exports = router;