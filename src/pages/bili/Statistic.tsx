import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
// Optionally import the CSS
import "cal-heatmap/cal-heatmap.css";
import { useEffect } from "react";
import { http } from "../../utils/fetch";
import dayjs from "dayjs/esm/index.js";
import "dayjs/locale/zh-cn";

export default function Statistic() {
  useEffect(() => {
    http.get("/histories").then(resp => {
      const data = resp.data;
      const dateMap = new Map<string, number>();
      for (const { when } of data) {
        const date = dayjs(when).format("YYYY-MM-DD");
        if (dateMap.has(date)) {
          let num = dateMap.get(date) ?? 0;
          num++;
          dateMap.set(date, num);
        } else {
          dateMap.set(date, 1);
        }
      }
      const source = [];
      for (const [date, value] of dateMap) {
        source.push({ date, value });
      }
      const max = Math.max(...source.map(s => s.value));

      const cal: CalHeatmap = new CalHeatmap();

      cal.paint(
        {
          itemSelector: "#history-heatmap",
          data: {
            source,
            x: "date",
            y: "value",
            defaultValue: 0,
          },
          defaultValue: 0,
          date: { start: new Date("2023-01-01") },
          range: 12,
          scale: {
            color: {
              scheme: "BuPu",
              type: "linear",
              domain: [0, max],
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
              text: (timestamp: number, value: number) => {
                const date = dayjs(timestamp).format("YYYY-MM-DD");
                return `${date} 追了 ${value} 话`;
              },
            },
          ],
        ]
      );
    });
  }, []);

  return (
    <>
      <h1>追番热力图</h1>
      <div className="mx-auto w-4/5" id="history-heatmap"></div>
    </>
  );
}
