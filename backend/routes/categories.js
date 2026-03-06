const express = require('express');

const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

router.get('/', categoriesController.getAllCategories);
router.get('/:name', categoriesController.getCategoryByName);

// QUESTION: should we do /:type or ?type=
router.post('/create-category/:type', categoriesController.createCategory);
router.put('/update-category/:type/:id', categoriesController.updateCategory);
router.delete('/delete-category/:type/:id', categoriesController.deleteCategory);

module.exports = router;