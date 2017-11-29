const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../../config/authenticate');

const controller = require('../controllers/article.controller');
const articleRouter = express.Router();
articleRouter.use = (bodyParser.json());

articleRouter.route('/').get(controller.getArticles)
    .post(authenticate.verifyUser, controller.postArticles)
    .put(authenticate.verifyUser, controller.putArticles)
    .delete(authenticate.verifyUser, controller.deleteArticles);

articleRouter.route('/:articleId').get(controller.getArticlesById)
    .post(authenticate.verifyUser, controller.postArticlesById)
    .put(authenticate.verifyUser, controller.putArticlesById)
    .delete(authenticate.verifyUser, controller.deleteArticlesById);

articleRouter.route('/:articleId/comments').get(controller.getAllComments)
    .post(authenticate.verifyUser, controller.postAllComments)
    .put(authenticate.verifyUser, controller.putAllComments)
    .delete(authenticate.verifyUser, controller.deleteAllComments);

articleRouter.route('/:articleId/comments/:commentId').get(controller.getEachComment)
    .post(authenticate.verifyUser, controller.postEachComment)
    .put(authenticate.verifyUser, controller.putEachComment)
    .delete(authenticate.verifyUser, controller.deleteEachComment);

module.exports = articleRouter;