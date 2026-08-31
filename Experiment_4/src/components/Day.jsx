import { memo } from "react";
import PostCard from "./PostCard";

function Day({
  day,
  posts,
  onDragStart,
  onDrop,
}) {
  return (
    <div
      className="day"
      onDragOver={(event) =>
        event.preventDefault()
      }
      onDrop={() => onDrop(day)}
    >

      <div className="day-header">

        <h2>{day}</h2>

        <span>
          {posts.length} Posts
        </span>

      </div>

      <div className="posts">

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDragStart={onDragStart}
          />
        ))}

      </div>

    </div>
  );
}

export const MemoizedDay = memo(Day);

export default Day;