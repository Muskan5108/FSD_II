import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Calendar from "./components/Calendar";
import "./App.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialData = days.map((day) => ({
  name: day,
  changes: 0,
}));

function App() {
  const [memo, setMemo] = useState(true);
  const [callback, setCallback] = useState(true);
  const [useMemoHook, setUseMemoHook] = useState(true);

  const [data, setData] = useState(initialData);

  const optimized =
    memo && callback && useMemoHook;

  const handleDragDrop = (fromDay, toDay) => {
    setData((oldData) => {
      const newData = oldData.map((item) => ({
        ...item,
      }));

      if (optimized) {
        // Optimized:
        // Only source + destination change

        newData.forEach((item) => {
          if (item.name === fromDay) {
            item.changes += 1;
          }

          if (item.name === toDay) {
            item.changes += 1;
          }
        });
      } else {
        // Non-optimized:
        // Calendar + 7 Day components
        // = 8 changes

        newData.forEach((item) => {
          item.changes += 1;
        });
      }

      return newData;
    });
  };

  const totalChanges = data.reduce(
    (sum, item) => sum + item.changes,
    0
  );

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div>
          <h1>📅 Calendar Monitoring Panel</h1>

          <p>
            Interactive Post Scheduling & Render Monitoring
          </p>
        </div>

        <div
          className={
            optimized
              ? "status optimized"
              : "status non-optimized"
          }
        >
          {optimized
            ? "⚡ OPTIMIZED"
            : "🐌 NON-OPTIMIZED"}
        </div>
      </header>


      {/* TOGGLE PANEL */}

      <section className="controls">

        <h2>Rendering Controls</h2>

        <div className="toggles">

          <button
            className={memo ? "active" : ""}
            onClick={() => setMemo(!memo)}
          >
            React.memo
            <span>
              {memo ? " ON" : " OFF"}
            </span>
          </button>

          <button
            className={callback ? "active" : ""}
            onClick={() =>
              setCallback(!callback)
            }
          >
            useCallback
            <span>
              {callback ? " ON" : " OFF"}
            </span>
          </button>

          <button
            className={
              useMemoHook ? "active" : ""
            }
            onClick={() =>
              setUseMemoHook(!useMemoHook)
            }
          >
            useMemo
            <span>
              {useMemoHook ? " ON" : " OFF"}
            </span>
          </button>

        </div>

        <div className="mode">
          Current Mode:

          <strong>
            {optimized
              ? " Optimized"
              : " Non-Optimized"}
          </strong>
        </div>

      </section>


      {/* MONITOR */}

      <section className="monitor">

        <div className="monitor-header">

          <div>
            <h2>📊 Render Monitor</h2>

            <p>
              Changes after drag & drop
            </p>
          </div>

          <div className="total-renders">

            <span>
              Total Changes
            </span>

            <strong>
              {totalChanges}
            </strong>

          </div>

        </div>


        {/* GRAPH */}

        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 20,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />

              <Bar
                dataKey="changes"
                name="Changes"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </section>


      {/* CALENDAR */}

      <section className="calendar-section">

        <h2>📆 Weekly Post Calendar</h2>

        <p className="instruction">
          Drag a card from one day and drop it
          into another day.
        </p>

        <Calendar
          optimized={optimized}
          onDragDrop={handleDragDrop}
        />

      </section>

    </div>
  );
}

export default App;