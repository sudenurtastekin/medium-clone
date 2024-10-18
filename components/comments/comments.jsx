"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Like from "@/components/svgs/like";
import Dislike from "@/components/svgs/dislike";
import Comment from "@/components/svgs/comments";

export default function CommentSection({ postId, currentUserId }) {
  const supabase = createClient();
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [likedComments, setLikedComments] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar durumunu takip eder

  const fetchComments = async () => {
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("*, comment_likes(count)")
      .eq("post_id", postId);

    if (commentsError) {
      console.error("Yorumlar çekilirken hata oluştu:", commentsError);
    } else {
      const formattedComments = commentsData.map((comment) => ({
        ...comment,
        likeCount: comment.comment_likes.length,
      }));
      setComments(formattedComments);
      await fetchLikedComments();
    }
  };

  const fetchLikedComments = async () => {
    const { data, error } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .eq("user_id", currentUserId)
      .eq("post_id", postId);

    if (error) {
      console.error("Beğeniler çekilirken hata oluştu:", error);
    } else {
      const likedSet = new Set(data.map((like) => like.comment_id));
      setLikedComments(likedSet);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      console.error("Yorum boş olamaz");
      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, user_id: currentUserId, content: commentContent }]);

    if (error) {
      console.error("Yorum eklenirken hata:", error.message);
    } else {
      fetchComments();
      setCommentContent("");
    }
  };

  const handleLike = async (commentId) => {
    if (likedComments.has(commentId)) {
      const { error } = await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", currentUserId);

      if (error) {
        console.error("Beğeni geri alınırken hata:", error.message);
      } else {
        setLikedComments((prev) => {
          const newLikedComments = new Set(prev);
          newLikedComments.delete(commentId);
          return newLikedComments;
        });

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likeCount: comment.likeCount - 1 }
              : comment
          )
        );
      }
    } else {
      const { error } = await supabase
        .from("comment_likes")
        .insert([{ comment_id: commentId, user_id: currentUserId, post_id: postId }]);

      if (error) {
        console.error("Beğeni eklenirken hata:", error.message);
      } else {
        setLikedComments((prev) => new Set(prev).add(commentId));

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likeCount: comment.likeCount + 1 }
              : comment
          )
        );
      }
    }
  };

  return (
    <div>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="comment-svg">
        <Comment />
      </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button onClick={() => setIsSidebarOpen(false)} className="close-btn">
          X
        </button>

        <h3>Yorumlar:</h3>
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>Kullanıcı {comment.user_id}:</strong> {comment.content}
              <div>
                <button onClick={() => handleLike(comment.id)} className="likebtn">
                  {likedComments.has(comment.id) ? <Dislike /> : <Like />}
                  <span>{comment.likeCount} </span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="new-comments">
          <input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            required
          />
          <button type="submit" className="yorum-gonder-btn">Gönder</button>
        </form>
      </div>
    </div>
  );
}
