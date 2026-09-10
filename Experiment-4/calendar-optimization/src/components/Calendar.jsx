import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import EventCard from "./EventCard";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const FILTER_OPTIONS = [
  "All",
  "Meeting",
  "Deadline",
  "Focus block",
  "Personal",
];

const CalendarBase = ({
  events = [],
  filter = "All",
  onEventMove,
  onFilterChange,
  optimization = {},
  onCardRender,
}) => {
  const {
    memo = true,
    memoization = true,
    callbacks = true,
  } = optimization;

  const [draggedEvent, setDraggedEvent] =
    useState(null);

  const [dragOverSlot, setDragOverSlot] =
    useState(null);

  const calendarRenderCount = useRef(0);
  calendarRenderCount.current += 1;

  console.log(
    `Calendar rendered: ${calendarRenderCount.current}`
  );

  /* =====================================================
     USEMEMO
     ===================================================== */

  const visibleEvents = useMemo(() => {
    if (filter === "All") {
      return events;
    }

    return events.filter(
      (event) =>
        event.category?.toLowerCase() ===
        filter.toLowerCase()
    );
  }, [
    events,
    filter,
    memoization
      ? "memo-on"
      : calendarRenderCount.current,
  ]);

  /* =====================================================
     FIND EVENT
     ===================================================== */

  const getEventForSlot = useCallback(
    (day, time) => {
      return visibleEvents.find(
        (event) =>
          event.day === day &&
          event.time === time
      );
    },
    [
      visibleEvents,
      callbacks
        ? "callback-on"
        : calendarRenderCount.current,
    ]
  );

  /* =====================================================
     DRAG START
     ===================================================== */

  const handleDragStart = useCallback(
    (event) => {
      setDraggedEvent(event);
    },
    [
      callbacks
        ? "callback-on"
        : calendarRenderCount.current,
    ]
  );

  /* =====================================================
     DRAG END
     ===================================================== */

  const handleDragEnd = useCallback(
    () => {
      setDraggedEvent(null);
      setDragOverSlot(null);
    },
    [
      callbacks
        ? "callback-on"
        : calendarRenderCount.current,
    ]
  );

  /* =====================================================
     DRAG OVER
     ===================================================== */

  const handleDragOver = useCallback(
    (e, day, time) => {
      e.preventDefault();

      if (!draggedEvent) {
        return;
      }

      e.dataTransfer.dropEffect = "move";

      setDragOverSlot(
        `${day}-${time}`
      );
    },
    [
      draggedEvent,
      callbacks
        ? "callback-on"
        : calendarRenderCount.current,
    ]
  );

  /* =====================================================
     DROP
     ===================================================== */

  const handleDrop = useCallback(
    (e, day, time) => {
      e.preventDefault();

      if (!draggedEvent) {
        return;
      }

      const oldDay = draggedEvent.day;
      const oldTime = draggedEvent.time;

      if (
        oldDay === day &&
        oldTime === time
      ) {
        handleDragEnd();
        return;
      }

      const destinationEvent =
        visibleEvents.find(
          (event) =>
            event.day === day &&
            event.time === time &&
            event.id !== draggedEvent.id
        );

      if (destinationEvent) {
        handleDragEnd();
        return;
      }

      onEventMove?.(
        draggedEvent.id,
        day,
        time
      );

      handleDragEnd();
    },
    [
      draggedEvent,
      visibleEvents,
      onEventMove,
      handleDragEnd,
    ]
  );

  /* =====================================================
     FILTER
     ===================================================== */

  const handleFilterChange = useCallback(
    (e) => {
      onFilterChange?.(e);
    },
    [
      onFilterChange,
      callbacks
        ? "callback-on"
        : calendarRenderCount.current,
    ]
  );

  return (
    <section className="calendar-panel glass">

      <div className="panel-heading">

        <div>

          <div className="section-label">
            <span className="section-icon">
              ▦
            </span>

            WEEK VIEW
          </div>

          <p>
            Drag events between days and time slots
            to reschedule them instantly.
          </p>

        </div>

        <div className="category-legend">

          <span className="legend-meeting">
            Meeting
          </span>

          <span className="legend-deadline">
            Deadline
          </span>

          <span className="legend-focus">
            Focus block
          </span>

          <span className="legend-personal">
            Personal
          </span>

        </div>

      </div>

      <div className="calendar-tools">

        <div className="tool-info">

          <strong>
            {events.length}
          </strong>

          <span>
            Total Events
          </span>

          <strong>
            {visibleEvents.length}
          </strong>

          <span>
            Visible
          </span>

        </div>

        <div className="filter-box">

          <label htmlFor="calendar-filter">
            Filter Events
          </label>

          <select
            id="calendar-filter"
            value={filter}
            onChange={handleFilterChange}
          >
            {FILTER_OPTIONS.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </select>

        </div>

      </div>

      <div className="calendar-wrapper">

        <div className="calendar">

          <div className="time-column">

            <div className="calendar-corner">
              TIME
            </div>

            {TIME_SLOTS.map(
              (time) => (
                <div
                  className="time-label"
                  key={time}
                >
                  {time}
                </div>
              )
            )}

          </div>

          {DAYS.map((day) => (

            <div
              className="day-column"
              key={day}
            >

              <div className="day-header">
                {day.slice(0, 3)}
              </div>

              {TIME_SLOTS.map(
                (time) => {

                  const event =
                    getEventForSlot(
                      day,
                      time
                    );

                  const slotKey =
                    `${day}-${time}`;

                  const isDragOver =
                    dragOverSlot ===
                    slotKey;

                  return (
                    <div
                      key={slotKey}
                      className={`calendar-slot ${
                        isDragOver
                          ? "drag-ready"
                          : ""
                      }`}
                      onDragOver={(e) =>
                        handleDragOver(
                          e,
                          day,
                          time
                        )
                      }
                      onDragLeave={() =>
                        setDragOverSlot(null)
                      }
                      onDrop={(e) =>
                        handleDrop(
                          e,
                          day,
                          time
                        )
                      }
                    >

                      {event ? (
                        <EventCard
                          event={event}
                          onDragStart={
                            handleDragStart
                          }
                          onDragEnd={
                            handleDragEnd
                          }
                          memoEnabled={memo}
                          onRender={
                            onCardRender
                          }
                        />
                      ) : (
                        <span
                          className="empty-slot"
                          aria-hidden="true"
                        />
                      )}

                    </div>
                  );
                }
              )}

            </div>

          ))}

        </div>

      </div>

      <div className="calendar-tip">

        <span>
          ✦
        </span>

        <p>
          Drag any event card into another time
          slot. The schedule will update immediately.
        </p>

      </div>

    </section>
  );
};

/* =====================================================
   CALENDAR MEMO
   ===================================================== */

const MemoizedCalendar = React.memo(
  CalendarBase
);

function Calendar(props) {
  const memoEnabled =
    props.optimization?.memo !== false;

  if (memoEnabled) {
    return (
      <MemoizedCalendar {...props} />
    );
  }

  return (
    <CalendarBase {...props} />
  );
}

export default Calendar;