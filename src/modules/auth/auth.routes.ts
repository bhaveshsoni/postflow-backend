import { Router } from "express";
import { getFacebookUrl, login, signup, updateToken } from "./auth.controller";
import { getMe, protect } from "../../common/middleware/auth.middleware";
import { loginLimiter } from '../../common/middleware/rateLimiter';
const router = Router();

router.post("/login", loginLimiter, login);
router.get('/me', protect, getMe);
router.post("/signup", signup);
router.get("/facebook/url", getFacebookUrl);
router.post("/facebook/connect", protect, updateToken);


export default router;
