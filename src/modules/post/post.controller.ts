import { Response } from "express";
import asyncHandler from "express-async-handler"; // <--- 1. Import wrapper
import { AuthRequest } from "../../common/middleware/auth.middleware";
import * as postService from "./post.service";

// 2. Wrap EVERY function with asyncHandler(...)

export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await postService.createPost({
        ...req.body,
        userId: req.user.userId,
    });

    res.status(201).json(post);
});

export const getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const posts = await postService.getUserPosts(req.user.userId);
    res.json(posts);
});

export const getPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    const postId = req.params.id as string;
    const post = await postService.getPostById(
        postId,
        req.user.userId
    );

    if (!post) {
        // 3. Just THROW the error! The wrapper catches it and sends 404.
        res.status(404);
        throw new Error("Post not found");
    }

    res.json(post);
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
    const postId = req.params.id as string;

    const post = await postService.updatePost(
        postId,
        req.user.userId,
        req.body
    );

    if (!post) {
        res.status(400);
        throw new Error("Cannot update post");
    }

    res.json(post);
});

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
    const postId = req.params.id as string;

    await postService.deletePost(postId, req.user.userId);
    res.status(204).send();
});