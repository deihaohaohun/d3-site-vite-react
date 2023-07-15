import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
// Optionally import the CSS
import "cal-heatmap/cal-heatmap.css";
import { useEffect } from "react";

export default function Statistic() {
  useEffect(() => {
    const cal: CalHeatmap = new CalHeatmap();

    cal.paint(
      {
        itemSelector: "#history-heatmap",
        data: {
          source: [
            { date: "2023-01-01", value: 3 },
            { date: "2023-01-02", value: 6 },
          ],
          x: "date",
          y: "value",
        },
        date: { start: new Date("2023-01-01") },
        range: 12,
        scale: {
          color: {
            scheme: "BuPu",
            type: "linear",
            domain: [0, 10],
          },
        },
        domain: {
          type: "month",
        },
        subDomain: { type: "day", radius: 2 },
      },
      [
        [
          Tooltip,
          {
            text: (timestamp, value, dayjsDate) =>
              `${value} --- ${dayjsDate.toString()}`,
          },
        ],
      ]
    );
  }, []);

  return (
    <>
      <h1>追番热力图</h1>
      <div className="mx-auto w-4/5" id="history-heatmap"></div>
    </>
  );
}
