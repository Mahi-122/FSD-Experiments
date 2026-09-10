import React, { useEffect, useRef } from "react";

function EventCardContent({
  event,
  onDragStart,
  onDragEnd,
  onRender,
}) {
  const renderCount = useRef(0);

  renderCount.current += 1;

  useEffect(() => {
    if (event?.id != null) {
      onRender?.(event.id);
    }

    console.log(
      `EventCard rendered: ${event?.title} | render #${renderCount.current}`
    );
  });

  if (!event) {
    return null;
  }

  const colorClass = event.color
    ? `event-${event.color}`
    : "event-purple";

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData(
      "eventId",
      String(event.id)
    );

    onDragStart?.(event);
  };

  const handleDragEnd = () => {
    onDragEnd?.(event);
  };

  return (
    <div
      className={`event-card ${colorClass}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title={`${event.title} — ${event.time}`}
    >

      <div className="event-color-line" />

      <div className="drag-dots">
        •••
      </div>

      <div className="event-time">
        {event.time}
      </div>

      <div className="event-title">
        {event.title}
      </div>

      {event.category && (
        <div className="event-category">
          {event.category}
        </div>
      )}

    </div>
  );
}

const MemoizedEventCard = React.memo(
  EventCardContent
);

function EventCard({
  memoEnabled = true,
  ...props
}) {
  if (memoEnabled) {
    return (
      <MemoizedEventCard {...props} />
    );
  }

  return (
    <EventCardContent {...props} />
  );
}

export default EventCard;