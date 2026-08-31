function PostCard({
  post,
  onDragStart,
}) {
  return (
    <div
      className="post-card"
      draggable
      onDragStart={() =>
        onDragStart(post)
      }
    >

      <div className="post-title">
        {post.title}
      </div>

      <div className="post-platform">
        {post.platform}
      </div>

      <div className="drag-text">
        ↕ Drag me
      </div>

    </div>
  );
}

export default PostCard;