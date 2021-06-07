// import db from '../config/sequelize';
// var Document = db.document;

import Document from '../providers/document';

function save(req, res, next) {
  if (!req.body.hash || !req.body.description) {
    return next(new Error('Document hash and description is required'))
  }
  Document.isHashExists(req.body.hash).then(resp => {
    if (resp) {
      let err = new Error('Hash already exists.');
      err.status = 400;
      next(err);
      return;
    }
    Document.createOrUpdate(null, req.body).then(resp => {
        res.send(resp);
      }, error => {
        next(error);
      })
    }, error => {

  });
}

function update(req, res, next) {
  if (!req.params.referenceId) {
    return next(new Error('Document reference id not found'));
  }

  if (!req.body.hash || !req.body.description) {
    return next(new Error('Document hash and description is required'))
  }

  Document.isHashExists(req.body.hash).then(resp => {
    if (resp) {
      let err = new Error('Hash already exists.');
      err.status = 400;
      next(err);
      return;
    }

    Document.createOrUpdate(req.params.referenceId, req.body).then(resp => {
      res.send(resp);
    }, error => {
      next(error);
    })
  });
}

function getAllByReferenceId(req, res, next) {
  if (!req.params.referenceId) {
    return next(new Error('Document reference id not found'))
  }

  Document.isReferenceExists(req.params.referenceId).then(resp => {
    if (!resp) {
      let err = new Error('No document found.');
      err.status = 404;
      next(err);
      return;
    }
    Document.getAllByTransaction(req.params.referenceId).then(resp => {
      res.send(resp);
    }, error => {
      next(new Error('Something went wrong in fetching records'))
    })
  }, error => {
      let err = new Error('No document found.');
      err.status = 404;
      next(err);
      return;
  });
}

function getOneByReferenceId(req, res, next) {
  if (!req.params.referenceId) {
    return next(new Error('Document reference id not found'))
  }
  Document.isReferenceExists(req.params.referenceId).then(resp => {
    if (!resp) {
      let err = new Error('No document found.');
      err.status = 404;
      next(err);
      return;
    }
    Document.getByTransaction(req.params.referenceId).then(resp => {
      res.send(resp);
    }, error => {
      next(new Error('Something went wrong in fetching records'))
    })
  }, error => {
      let err = new Error('No document found.');
      err.status = 404;
      next(err);
      return;
  });
}

function getByHash(req, res, next) {
  if (!req.params.hash) {
    return next(new Error('Hash not found'))
  }

  Document.isHashExists(req.params.hash).then(resp => {
    if (!resp) {
      let err = new Error('No document found.');
      err.status = 404;
      next(err);
      return;
    }

    Document.getByHash(req.params.hash).then(resp => {
      res.send(resp);
    }, error => {
      next(new Error('Something went wrong in fetching records'))
    })
  });
}

export default {
  save,
  update,
  getByHash,
  getOneByReferenceId,
  getAllByReferenceId
}