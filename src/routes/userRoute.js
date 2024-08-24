import express from 'express'
const router = express.Router()
import { userController } from "~/controllers/userController"
import { authMiddleware } from '~/middlewares/authMiddleware'
import { userValidation } from "~/validations/userValidation"

router.get('/', authMiddleware.isAuthorized, userController.users)
router.get('/:id', authMiddleware.isAuthorized, userController.userDetail)
router.post('/sign-up', userValidation.singUp, userController.singUp)
router.post('/sign-in', userValidation.signIn, userController.signIn)
router.put('/refresh-token', userController.refreshToken)
router.post('/logout', authMiddleware.isAuthorized, userController.logout)
router.post('/forgot-password/email', userController.ForgotPasswordEmail)
router.post('/forgot-password/verify-otp', userController.ForgotPasswordVerifyOtp)
router.post('/forgot-password/reset-password', userController.ForgotPasswordReset)
                           


                        

// router.get('/:id', userController.detailUser)
// router.put('/:id', userValidation.update, userController.updateUser)
// router.put('/supports/moving_card', userValidation.moveCardToDifferentColumn, userController.moveCardToDifferentColumn)

export const userRoute = router
