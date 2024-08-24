import express from "express"
import { inviteController } from "~/controllers/inviteController"
import { authMiddleware } from "~/middlewares/authMiddleware"
const router = express.Router()

router.get('/:id', authMiddleware.isAuthorized, inviteController.detailInvite)
router.get('/', authMiddleware.isAuthorized, inviteController.getAllInvite)
router.post('/add-invite', authMiddleware.isAuthorized, inviteController.createInvite)
router.put('/update-invite/:id', authMiddleware.isAuthorized, inviteController.updateInvite)
// router.put('/:id', authMiddleware.isAuthorized, inviteController.updateInvite)


export const inviteRoute = router