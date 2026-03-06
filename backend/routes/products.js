const express = require('express');

const router = express.Router();
const productsController = require('../controllers/productsController');

router.get('/', productsController.getAllProducts);
router.get('/search', productsController.searchProducts);
router.get('/low-stock', productsController.getLowStockProducts);
router.get('/product/:id', productsController.getProductById);
// QUESTION: Do we want to have separate endpoints for category and subcategory filtering, or combine into one endpoint with optional query parameters?

router.get('/:category/:subcategory', productsController.getProductsBySubcategory);
router.get('/:category', productsController.getProductsByCategory);

// QUESTION: Should we have /admin for admin controls in each router (e.g. /products/admin/ for product management) or have all admin controls in a separate router (e.g. /admin/products, /admin/orders, etc.)?

router.post('/admin/create-product', productsController.createProduct);
router.put('/admin/update-product/:id', productsController.updateProduct);
router.delete('/admin/delete-product/:id', productsController.deleteProduct);

module.exports = router;