import express from 'express';
import documentCtrl from '../controller/document.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(documentCtrl.save);

router.route('/:referenceId')
  .put(documentCtrl.update)
  .get(documentCtrl.getOneByReferenceId);

router.route('/getByReferenceId/:referenceId')
  .get(documentCtrl.getAllByReferenceId);

router.route('/getbyHash/:hash')
  .get(documentCtrl.getByHash);

export default router;
