// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/blog');

const router = express.Router();

/**
 * /blog
 * http://localhost:3000/api/blog
 */


router.post('/add-blog', controller.addBlog);
router.get('/get-all-blogs', controller.getAllBlogs);
router.get('/get-blog-by-blog-id/:blogId', controller.getBlogByBlogId);
router.get('/get-single-blog-by-slug/:slug', controller.getSingleBlogBySlug);
router.put('/edit-blog-by-blog', controller.editBlogData);
router.delete('/delete-blog-by-id/:blogId', controller.deleteBlogByBlogId);

// Export All router..
module.exports = router;