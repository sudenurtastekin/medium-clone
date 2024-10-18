import { createClient } from "@/utils/supabase/server";
import LikeButton from "@/components/likes-btn/LikeButton";
import BookmarkButton from "@/components/BookmarkButton/page";
import "./allPost.css";

export default async function PostsPage() {
  const supabase = createClient();
  const { data: posts, error } = await supabase.from("posts").select();

  if (error) {
    console.error(error);
    return <div>Bir hata oluştu.</div>;
  }

  return (
    <div className="allPost">
      <h1>Tüm Gönderiler</h1>
      <ul>
        {posts.map(post => (
          <div className="Posts">
            <li key={post.id}>
              <div className="posts-title"><a href={`/posts/${post.id}`}>{post.title}</a> <br /></div>
                <div className="post-buttons">
                  <LikeButton />
                  <BookmarkButton />
                </div>
            </li>
            <hr />
          </div>
        ))}
      </ul>
    </div>
  );
}
