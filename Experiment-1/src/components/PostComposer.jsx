import { useState } from "react";

function PostComposer() {

  const platforms = {
    Twitter: 280,
    Instagram: 2200,
    LinkedIn: 3000
  };

  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");

  const limit = platforms[platform];

  return (
    <div className="composer">

      <h2>Social Media Post Composer</h2>

      <select
        value={platform}
        onChange={(e)=>setPlatform(e.target.value)}
      >
        {
          Object.keys(platforms).map((item)=>(
            <option key={item}>
              {item}
            </option>
          ))
        }
      </select>


      <textarea
        placeholder="Write your post..."
        value={post}
        onChange={(e)=>setPost(e.target.value)}
      />


      <p>
        Characters: {post.length}/{limit}
      </p>


      {
        post.length > limit ?
        <p className="error">
          Character limit exceeded!
        </p>
        :
        <p className="success">
          Post is valid
        </p>
      }


      <button disabled={post.length > limit}>
        Publish
      </button>

    </div>
  )
}

export default PostComposer;