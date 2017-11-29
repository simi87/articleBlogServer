const Articles = require('../models/articles');
exports.getArticles = (req, res, next) => {
    Articles.find({})
        .populate('comments.author')
        .then((articles) => {
            res.statusCode = 200;
            console.log("hello");
            res.setHeader('Content-Type', 'application/json');
            res.json(articles);
        }, (err) => next(err))
        .catch((err) => next(err));
};


exports.postArticles = (req, res, next) => {
    Articles.create(req.body)
        .then((article) => {
            console.log('Article Created', article);
            res.statusCode = 200;
            res.setHeader('content-Type', 'application/json');
            res.json(article)
        }, (err) => next(err))
        .catch((err) => next(err));

};
exports.putArticles = (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation does not supported on articles');
};
exports.deleteArticles = (req, res, next) => {
    Articles.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));

};
exports.getArticlesById = (req, res, next) => {

    Articles.findById(req.params.articleId)
        .populate('comments.author')
        .then((articles) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(articles);
        }, (err) => next(err))
        .catch((err) => next(err));

};
exports.postArticlesById = (req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation does not supported on /articles/' + req.params.articleId);

};
exports.putArticlesById = (req, res, next) => {
    Articles.findByIdAndUpdate(req.params.articleId, {
            $set: req.body
        }, { new: true })
        .then((articles) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(articles);
        }, (err) => next(err))
        .catch((err) => next(err));

};
exports.deleteArticlesById = (req, res, next) => {
    Articles.findByIdAndRemove(req.params.articleId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
};
/**********************************Comments Section******************************/
exports.getAllComments = (req, res, next) => {
    Articles.findById(req.params.articleId)
        .populate('comments.author')
        .then((articles) => {
            if (articles != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(articles.comments);
            } else {
                err = new Error('Article' + req.params.articleId + 'not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
};

exports.postAllComments = (req, res, next) => {
    Articles.findById(req.params.articleId)
        .then((article) => {
                if (article != null) {
                    req.body.author = req.user._id;
                    article.comments.push(req.body);
                    article.save()
                        .then((article) => {
                            res.statusCode = 200;
                            res.setHeader('content-Type', 'application/json');
                            res.json(article);
                        }, (err) => next(err));
                } else {
                    err = new Error('Article' + req.params.articleId + 'not found');
                    err.status = 404;
                    return next(err);
                }
            },
            (err) => next(err))
        .catch((err) => next(err));


};
exports.putAllComments = (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation does not supported on articles/comments');
};
exports.deleteAllComments = (req, res, next) => {
    Articles.findById(req.params.articleId)
        .then((article) => {
            if (article != null) {
                for (var i = (article.comments.length - 1); i >= 0; i--) {
                    article.comments.id(article.comments[i]._id).remove();
                }
                article.save()
                    .then((article) => {
                        res.statusCode = 200;
                        res.setHeader('content-Type', 'application/json');
                        res.json(article);
                    }, (err) => next(err));
            } else {
                err = new Error('Article' + req.params.articleId + 'not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));

};
exports.getEachComment = (req, res, next) => {
    Articles.findById(req.params.articleId)
        .populate('comments.author')
        .then((articles) => {
            if (articles != null && articles.comments.id(req.params.commentId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(articles.comments.id(req.params.commentId));
            } else if (articles == null) {
                err = new Error('Article' + articles.params.articleId + 'not found');
                err.status = 404;
                return next(err);
            } else {
                err = new Error('comment' + req.params.commentId + 'not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));

};
exports.postEachComment = (req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation does not supported on /articles/' + req.params.articleId);

};
exports.putEachComment = (req, res, next) => {
    Articles.findById(req.params.articleId)
        .then((articles) => {
            if (articles != null && articles.comments.id(req.params.commentId) != null) {
                if (req.body.comment) {
                    articles.comments.id(req.params.commentId).comment = req.body.comment;
                }
                articles.save()
                    .then((articles) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(articles);
                    }, (err) => next(err));
            } else if (articles == null) {
                err = new Error('Article' + articles.params.articleId + 'not found');
                err.status = 404;
                return next(err);
            } else {
                err = new Error('comment' + req.params.commentId + 'not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));

};
exports.deleteEachComment = (req, res, next) => {
    Articles.findById(req.params.articleId)
        .then((articles) => {
            if (articles != null && articles.comments.id(req.params.commentId) != null) {
                articles.comments.id(req.params.commentId).remove();
                articles.save()
                    .then((articles) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(articles);
                    }, (err) => next(err));
            } else if (articles == null) {
                err = new Error('Articles ' + req.params.articleId + ' not found');
                err.status = 404;
                return next(err);
            } else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));

};
module.exports = exports;