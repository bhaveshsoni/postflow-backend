import { Router } from "express";
import { protect } from "../../common/middleware/auth.middleware";
import * as postController from "./post.controller";
const router = Router(); 
 

router.use(protect);

router.post("/", postController.createPost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;
