const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js')
const verifyRole = require('../middlewares/verifyRole.js');


const {createCategory, updateCategory,deleteCategory, getAllCategories}= require('../controllers/categoryCtrl.js');



router
    .route('/')
    .post(verifyToken, verifyRole(["admin"]),createCategory)
    .get(getAllCategories)
router.put('/:id',verifyToken, verifyRole(["admin"]),updateCategory)
router.delete('/:id',verifyToken, verifyRole(["admin"]),deleteCategory)
router






module.exports = router