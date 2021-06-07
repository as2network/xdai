import express from 'express';
import documentRoutes from './document.route';
const swaggerJson = require('../swagger.json');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.get('/', (req, res) =>
  res.send('Anchoring Api is working!')
);

router.get('/api-docs', (req, res) =>
  res.send(swaggerJson)
);

// mount account routes at /account
router.use('/document', documentRoutes);

export default router;
