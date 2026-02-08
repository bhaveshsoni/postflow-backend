import Post from "../../models/posts.model";
import { IPost } from "../../models/posts.model";
import { postQueue } from "../../queue/post.queue";

export const createPost = async (data: Partial<IPost>) => {
  const post = await Post.create(data);

  const delay =
    new Date(post.scheduledTime).getTime() - Date.now();

  await postQueue.add(
    "publish-post",
    {
      postId: post._id.toString(),
    },
    {
      delay: Math.max(delay, 0),
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: { count: 5000 }, // Keep last 1000 success jobs
      removeOnFail: { count: 5000 },     // Keep last 5000 failed jobs
    }
  );
  return post;
};

export const getUserPosts = async (userId: string) => {
  return await Post.find({ userId }).sort({ createdAt: -1 });
};

export const getPostById = async (postId: string, userId: string) => {
  return await Post.findOne({ _id: postId, userId });
};

export const updatePost = async (
  postId: string,
  userId: string,
  data: Partial<IPost>
) => {
  return await Post.findOneAndUpdate(
    { _id: postId, userId, status: "PENDING" },
    data,
    { new: true }
  );
};

export const deletePost = async (postId: string, userId: string) => {
  return await Post.findOneAndDelete({ _id: postId, userId });
};
