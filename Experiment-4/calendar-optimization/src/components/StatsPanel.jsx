import React, { useMemo } from "react";

const StatsPanel = ({
  events = [],
  renderCounts = {},
  totalRenders = 0,
  resetCounters,
}) => {

  const performanceStats = useMemo(() => {

    const renderedCards =
      Object.values(renderCounts).filter(
        (count) => count > 0
      ).length;

    /*
     * Cards with exactly one render are considered
     * highly optimized.
     */
    const optimizedCards =
      events.filter(
        (event) =>
          (renderCounts[event.id] || 0) === 1
      ).length;

    const averageRenders =
      events.length > 0
        ? (
            totalRenders /
            events.length
          ).toFixed(1)
        : "0.0";

    return {
      renderedCards,
      optimizedCards,
      averageRenders,
    };

  }, [
    events,
    renderCounts,
    totalRenders,
  ]);

  return (
    <aside className="monitor glass">

      <div className="monitor-heading">

        <div className="monitor-icon">
          〽
        </div>

        <div>

          <span>
            PERFORMANCE
          </span>

          <h2>
            Render Monitor
          </h2>

        </div>

      </div>

      <div className="monitor-stats">

        <div>

          <strong>
            {totalRenders}
          </strong>

          <span>
            total renders logged
          </span>

        </div>

        <div>

          <strong>
            {performanceStats.renderedCards}/
            {events.length}
          </strong>

          <span>
            cards that have rendered
          </span>

        </div>

      </div>

      <div className="performance-summary">

        <div className="summary-card">

          <span>
            OPTIMIZED
          </span>

          <strong>
            {performanceStats.optimizedCards}
          </strong>

          <small>
            cards
          </small>

        </div>

        <div className="summary-card">

          <span>
            AVG. RENDERS
          </span>

          <strong>
            {performanceStats.averageRenders}
          </strong>

          <small>
            per card
          </small>

        </div>

      </div>

      <div className="render-list">

        {events.map((event) => {

          const count =
            renderCounts[event.id] || 0;

          const barWidth = Math.min(
            count * 20,
            100
          );

          return (
            <div
              className="render-row"
              key={event.id}
            >

              <div className="render-label">

                <span
                  className={`mini-dot ${
                    event.color || "purple"
                  }`}
                />

                <span>
                  {event.title}
                </span>

              </div>

              <div className="render-bar">

                <span
                  style={{
                    width: `${barWidth}%`,
                  }}
                />

              </div>

              <strong>
                {count}
              </strong>

            </div>
          );

        })}

      </div>

      <button
        className="reset-button monitor-reset"
        onClick={resetCounters}
      >
        ↻ Reset counters
      </button>

      <div className="monitor-note">

        <span>
          ◆
        </span>

        <p>
          React.memo prevents unnecessary event-card
          renders while useMemo and useCallback help
          keep expensive calculations and handlers stable.
        </p>

      </div>

    </aside>
  );
};

export default React.memo(StatsPanel);