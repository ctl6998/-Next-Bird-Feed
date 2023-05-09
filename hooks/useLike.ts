import axios from "axios";
import { useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";
import { useMemo } from "react";

const useLike = ({ postId, userId }: { postId: string; userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);

  const loginModal = useLoginModal();

  // Check if post had like from current logged in user
  const hasLiked = useMemo(() => {
    const list = fetchedPost?.likedIds || [];

    return list.includes(currentUser?.id);
  }, [fetchedPost, currentUser]);
  // console.log(hasLiked);

  useEffect(() => {
    console.log(`Like status: ${hasLiked}`)
  },[hasLiked, currentUser])

  const toggleLike = useCallback(async () => {

    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      // if (hasLiked) {
      //   request = () => axios.delete(`/api/like/?postId=${postId}`);
      // } else {
      //   request = () => axios.post(`/api/like/?postId=${postId}`);
      //   console.log(`Post ${postId} has like from user ${currentUser.id}`);
      // }
      switch (hasLiked) {
        case true:
          request = () => axios.delete(`/api/like/?postId=${postId}`);
          break;
        case false:
          request = () => axios.post(`/api/like/?postId=${postId}`);
          console.log(`Post ${postId} has like from user ${currentUser.id}`);
          break;
        default:
          console.log("Invalid value for hasLiked");
      }

      if (request) {
      await request();
      }
      mutateFetchedPost();
      mutateFetchedPosts();

      toast.success("Success");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [
    currentUser,
    loginModal,
    hasLiked,
    postId,
    mutateFetchedPost,
    mutateFetchedPosts,
  ]);

  return {
    hasLiked,
    toggleLike,
  };
};

export default useLike;
