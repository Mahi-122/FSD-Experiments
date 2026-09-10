import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Calendar from "./components/Calendar";
import StatsPanel from "./components/StatsPanel";
import initialEvents from "./data/events";

import "./App.css";

function App() {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState("All");
  const [clock, setClock] = useState(new Date());

  const [optimization, setOptimization] = useState({
    memo: true,
    memoization: true,
    callbacks: true,
  });

  /*
   * IMPORTANT:
   * Render counts are stored in a REF.
   *
   * Updating a ref does NOT cause another React render.
   * This prevents the infinite render loop we had earlier.
   */
  const renderRegistry = useRef({});

  const [renderCounts, setRenderCounts] = useState({});
  const [totalRenders, setTotalRenders] = useState(0);

  /*
   * Used only to deliberately change dependencies
   * when an optimization is OFF.
   */
  const renderVersion = useRef(0);
  renderVersion.current += 1;

  /* =====================================================
     LIVE CLOCK
     ===================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* =====================================================
     EVENT CARD RENDER REPORT
     ===================================================== */

  const reportCardRender = useCallback((eventId) => {
    renderRegistry.current[eventId] =
      (renderRegistry.current[eventId] || 0) + 1;
  }, []);

  /* =====================================================
     UPDATE MONITOR AFTER EVENTS CHANGE
     ===================================================== */

  useEffect(() => {
    /*
     * Take a snapshot of the REF.
     *
     * This runs after the calendar has committed its
     * EventCard renders.
     */
    const snapshot = {
      ...renderRegistry.current,
    };

    const total = Object.values(snapshot).reduce(
      (sum, count) => sum + count,
      0
    );

    setRenderCounts(snapshot);
    setTotalRenders(total);
  }, [events]);

  /* =====================================================
     VISIBLE EVENTS
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
    optimization.memoization
      ? "memoized"
      : renderVersion.current,
  ]);

  /* =====================================================
     EVENT MOVE
     ===================================================== */

  const handleEventMove = useCallback(
    (eventId, newDay, newTime) => {
      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                day: newDay,
                time: newTime,
              }
            : event
        )
      );
    },
    [
      optimization.callbacks
        ? "stable"
        : renderVersion.current,
    ]
  );

  /* =====================================================
     FILTER
     ===================================================== */

  const handleFilterChange = useCallback(
    (event) => {
      setFilter(event.target.value);
    },
    [
      optimization.callbacks
        ? "stable"
        : renderVersion.current,
    ]
  );

  /* =====================================================
     OPTIMIZATION TOGGLE
     ===================================================== */

  const toggleOptimization = useCallback(
    (name) => {
      setOptimization((current) => ({
        ...current,
        [name]: !current[name],
      }));
    },
    []
  );

  /* =====================================================
     RESET
     ===================================================== */

  const resetCounters = useCallback(() => {
    renderRegistry.current = {};
    setRenderCounts({});
    setTotalRenders(0);
  }, []);

  const resetCalendar = useCallback(() => {
    renderRegistry.current = {};

    setEvents(initialEvents);
    setFilter("All");

    setRenderCounts({});
    setTotalRenders(0);
  }, []);

  /* =====================================================
     TIME
     ===================================================== */

  const formattedTime = clock.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );

  const formattedDate = clock.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  /* =====================================================
     PERFORMANCE SCORE
     ===================================================== */

  const performanceScore = useMemo(() => {
    let score = 0;

    if (optimization.memo) score += 34;
    if (optimization.memoization) score += 33;
    if (optimization.callbacks) score += 33;

    return score;
  }, [optimization]);

  /* =====================================================
     UI
     ===================================================== */

  return (
    <div className="app">

      <div className="ambient ambient-purple" />
      <div className="ambient ambient-cyan" />
      <div className="ambient ambient-pink" />

      <header className="topbar glass">

        <div className="brand">

          <div className="brand-logo">
            <span>⌁</span>
          </div>

          <div>
            <h1>
              Calendar Optimization Lab
            </h1>

            <p>
              React rendering & performance experiment
            </p>
          </div>

        </div>

        <div className="topbar-right">

          <div className="system-status">
            <span className="status-dot" />
            SYSTEM OPTIMIZED
          </div>

          <div className="clock">
            <span className="clock-dot" />
            {formattedTime}
          </div>

        </div>

      </header>

      <section className="hero glass">

        <div className="hero-content">

          <span className="eyebrow">
            EXPERIMENT 04 · PERFORMANCE
          </span>

          <h2>
            Interactive
            <br />
            <span>Calendar Optimization</span>
          </h2>

          <p>
            Schedule, reschedule and analyze events through
            an optimized React interface built around
            efficient rendering and reliable testing.
          </p>

          <div className="hero-tags">
            <span>⚡ Fast Rendering</span>
            <span>◈ Memoization</span>
            <span>◇ Drag & Drop</span>
            <span>✓ Tested UI</span>
          </div>

        </div>

        <div className="hero-visual">

          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="calendar-symbol">

            <div className="calendar-top">
              <i />
              <i />
            </div>

            <div className="calendar-grid">
              {Array.from(
                { length: 16 },
                (_, index) => (
                  <span key={index} />
                )
              )}
            </div>

          </div>

        </div>

      </section>

      <section className="controls glass">

        <div className="controls-grid">

          <div className="toggle-item">

            <button
              className={`switch purple ${
                optimization.memo
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                toggleOptimization("memo")
              }
            >
              <span />
            </button>

            <div>
              <h3>React.memo</h3>

              <p>
                Prevent unnecessary component
                re-renders when props remain unchanged.
              </p>
            </div>

          </div>

          <div className="toggle-item">

            <button
              className={`switch blue ${
                optimization.memoization
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                toggleOptimization("memoization")
              }
            >
              <span />
            </button>

            <div>
              <h3>useMemo</h3>

              <p>
                Memoize calculated values so expensive
                filtering work is not repeated unnecessarily.
              </p>
            </div>

          </div>

          <div className="toggle-item">

            <button
              className={`switch cyan ${
                optimization.callbacks
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                toggleOptimization("callbacks")
              }
            >
              <span />
            </button>

            <div>
              <h3>useCallback</h3>

              <p>
                Keep event-handler references stable
                between renders.
              </p>
            </div>

          </div>

        </div>

        <div className="controls-bottom">

          <div className="toggle-item">

            <div>
              <h3>
                Optimization score
              </h3>

              <p>
                {performanceScore}% of optimization
                techniques are currently enabled.
              </p>
            </div>

          </div>

          <button
            className="reset-button"
            onClick={resetCalendar}
          >
            ↻ Reset experiment
          </button>

        </div>

      </section>

      <main className="main-layout">

        <Calendar
          events={visibleEvents}
          filter={filter}
          onEventMove={handleEventMove}
          onFilterChange={handleFilterChange}
          optimization={optimization}
          onCardRender={reportCardRender}
        />

        <StatsPanel
          events={events}
          renderCounts={renderCounts}
          totalRenders={totalRenders}
          resetCounters={resetCounters}
        />

      </main>

      <footer className="footer glass">

        <div className="footer-highlight">
          <span>◆</span>
          Live rendering monitor
          <b>•</b>
          {formattedDate}
        </div>

        <div className="footer-tech">
          <span>React.memo</span>
          <span>useMemo</span>
          <span>useCallback</span>
          <span>Memoized Components</span>
        </div>

        <div className="footer-right">
          Experiment 04 · Calendar Optimization
        </div>

      </footer>

    </div>
  );
}

export default App;