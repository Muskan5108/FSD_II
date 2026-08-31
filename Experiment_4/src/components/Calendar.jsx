import { useMemo, useState } from "react";

import Day, { MemoizedDay } from "./Day";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialPosts = [
  {
    id: 1,
    title: "Product Launch",
    platform: "Instagram",
    day: "Monday",
  },
  {
    id: 2,
    title: "New Blog Post",
    platform: "LinkedIn",
    day: "Monday",
  },

  {
    id: 3,
    title: "Weekend Offer",
    platform: "Facebook",
    day: "Tuesday",
  },
  {
    id: 4,
    title: "Customer Story",
    platform: "Instagram",
    day: "Tuesday",
  },

  {
    id: 5,
    title: "Monthly Update",
    platform: "LinkedIn",
    day: "Wednesday",
  },
  {
    id: 6,
    title: "Product Tips",
    platform: "Instagram",
    day: "Wednesday",
  },

  {
    id: 7,
    title: "Team Update",
    platform: "LinkedIn",
    day: "Thursday",
  },
  {
    id: 8,
    title: "New Feature",
    platform: "Instagram",
    day: "Thursday",
  },

  {
    id: 9,
    title: "Special Offer",
    platform: "Facebook",
    day: "Friday",
  },
  {
    id: 10,
    title: "Behind The Scenes",
    platform: "Instagram",
    day: "Friday",
  },

  {
    id: 11,
    title: "Weekly News",
    platform: "LinkedIn",
    day: "Saturday",
  },
  {
    id: 12,
    title: "Customer Review",
    platform: "Facebook",
    day: "Saturday",
  },

  {
    id: 13,
    title: "Coming Soon",
    platform: "Instagram",
    day: "Sunday",
  },
  {
    id: 14,
    title: "Final Update",
    platform: "LinkedIn",
    day: "Sunday",
  },
];

function Calendar({
  optimized,
  onDragDrop,
}) {
  const [posts, setPosts] =
    useState(initialPosts);

  const [draggedPost, setDraggedPost] =
    useState(null);

  /*
    useMemo:
    Posts ko days ke according group karta hai.
  */

  const postsByDay = useMemo(() => {
    const result = {};

    days.forEach((day) => {
      result[day] = posts.filter(
        (post) => post.day === day
      );
    });

    return result;
  }, [posts]);

  const handleDragStart = (post) => {
    setDraggedPost(post);
  };

  const handleDrop = (destinationDay) => {
    if (!draggedPost) {
      return;
    }

    const sourceDay = draggedPost.day;

    if (sourceDay === destinationDay) {
      setDraggedPost(null);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === draggedPost.id
          ? {
              ...post,
              day: destinationDay,
            }
          : post
      )
    );

    // Monitoring update
    onDragDrop(
      sourceDay,
      destinationDay
    );

    setDraggedPost(null);
  };

  return (
    <div className="calendar">

      {days.map((day) => {

        const DayComponent = optimized
          ? MemoizedDay
          : Day;

        return (
          <DayComponent
            key={day}
            day={day}
            posts={postsByDay[day]}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        );

      })}

    </div>
  );
}

export default Calendar;