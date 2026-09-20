import { Router } from 'express';
import { upload } from '../middleware/upload.middleware';
import { protect } from '../middleware/auth.middleware';
import { getEvidenceByIncident, removeEvidence, uploadEvidence, validateEvidence } from '../controllers/evidence.controller';

const router = Router();

router.post('/:incidentId/upload', protect, upload.array('files', 5), uploadEvidence);
router.get('/:incidentId', protect, getEvidenceByIncident);
router.patch('/:evidenceId/validate', protect, validateEvidence);
router.delete('/:evidenceId', protect, removeEvidence);

export default router;
