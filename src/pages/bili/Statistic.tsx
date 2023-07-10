import CalHeatmap from "cal-heatmap";
// Optionally import the CSS
import "cal-heatmap/cal-heatmap.css";
import { useEffect } from "react";

export default function Statistic() {
  useEffect(() => {
    const cal: CalHeatmap = new CalHeatmap();

    cal.paint({
      itemSelector: "#history-heatmap",
      date: { start: new Date("2023-01-01") },
      range: 12,
      domain: {
        type: "month",
      },
      subDomain: { type: "day", radius: 2 },
    });
  }, []);

  return (
    <>
      <h1>追番热力图</h1>
      <div className="mx-auto w-4/5" id="history-heatmap"></div>
    </>
  );
}
