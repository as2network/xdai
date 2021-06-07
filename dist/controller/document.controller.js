'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _document = require('../providers/document');

var _document2 = _interopRequireDefault(_document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function save(req, res, next) {
  if (!req.body.hash || !req.body.description) {
    return next(new Error('Document hash and description is required'));
  }
  _document2.default.isHashExists(req.body.hash).then(function (resp) {
    if (resp) {
      var err = new Error('Hash already exists.');
      err.status = 400;
      next(err);
      return;
    }
    _document2.default.createOrUpdate(null, req.body).then(function (resp) {
      res.send(resp);
    }, function (error) {
      next(error);
    });
  }, function (error) {});
} // import db from '../config/sequelize';
// var Document = db.document;

function update(req, res, next) {
  if (!req.params.referenceId) {
    return next(new Error('Document reference id not found'));
  }

  if (!req.body.hash || !req.body.description) {
    return next(new Error('Document hash and description is required'));
  }

  _document2.default.isHashExists(req.body.hash).then(function (resp) {
    if (resp) {
      var err = new Error('Hash already exists.');
      err.status = 400;
      next(err);
      return;
    }

    _document2.default.createOrUpdate(req.params.referenceId, req.body).then(function (resp) {
      res.send(resp);
    }, function (error) {
      next(error);
    });
  });
}

function getAllByReferenceId(req, res, next) {
  if (!req.params.referenceId) {
    return next(new Error('Document reference id not found'));
  }

  _document2.default.isReferenceExists(req.params.referenceId).then(function (resp) {
    if (!resp) {
      var err = new Error('No document found.');
      err.status = 404;
      next(err);
      return;
    }
    _document2.default.getAllByTransaction(req.params.referenceId).then(function (resp) {
      res.send(resp);
    }, function (error) {
      next(new Error('Something went wrong in fetching records'));
    });
  }, function (error) {
    var err = new Error('No document found.');
    err.status = 404;
    next(err);
    return;
  });
}

function getOneByReferenceId(req, res, next) {
  if (!req.params.referenceId) {
    return next(new Error('Document reference id not found'));
  }
  _document2.default.isReferenceExists(req.params.referenceId).then(function (resp) {
    if (!resp) {
      var err = new Error('No document found.');
      err.status = 404;
      next(err);
      return;
    }
    _document2.default.getByTransaction(req.params.referenceId).then(function (resp) {
      res.send(resp);
    }, function (error) {
      next(new Error('Something went wrong in fetching records'));
    });
  }, function (error) {
    var err = new Error('No document found.');
    err.status = 404;
    next(err);
    return;
  });
}

function getByHash(req, res, next) {
  if (!req.params.hash) {
    return next(new Error('Hash not found'));
  }

  _document2.default.isHashExists(req.params.hash).then(function (resp) {
    if (!resp) {
      var err = new Error('No document found.');
      err.status = 404;
      next(err);
      return;
    }

    _document2.default.getByHash(req.params.hash).then(function (resp) {
      res.send(resp);
    }, function (error) {
      next(new Error('Something went wrong in fetching records'));
    });
  });
}

exports.default = {
  save: save,
  update: update,
  getByHash: getByHash,
  getOneByReferenceId: getOneByReferenceId,
  getAllByReferenceId: getAllByReferenceId
};
module.exports = exports['default'];
//# sourceMappingURL=document.controller.js.map
