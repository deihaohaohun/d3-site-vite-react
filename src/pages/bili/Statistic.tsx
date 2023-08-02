import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import { useEffect, useMemo, useState } from "react";
import { http } from "../../utils/fetch";
import { Button, Image, Text } from "@mantine/core";
import { Video } from "../../components/Video";
import { formatDate } from "../../utils/date";

export default function Statistic() {
  useEffect(() => {
    http.get("/histories").then(resp => {
      const data = resp.data;
      const dateMap = new Map<string, number>();
      for (const { when } of data) {
        // const date = formatDate(when);
        const d = new Date(when);
        const date = `${d.getFullYear()}-${(d.getMonth() + 1 + "").padStart(
          2,
          "0"
        )}-${(d.getDate() + "").padStart(2, "0")}`;
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

      const cal = new CalHeatmap();

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
                const date = formatDate(timestamp);
                return `${date} 追了 ${value} 话`;
              },
            },
          ],
        ]
      );

      cal.on("click", (_event: any, timestamp: number) => {
        setDate(formatDate(timestamp));
      });
    });
  }, []);

  const [date, setDate] = useState("");
  useMemo(async () => {
    if (date !== "") {
      const r = await http.get(`/videos/date/${date}`);
      return setVideos(r.data);
    }
    return [];
  }, [date]);

  const [videos, setVideos] = useState<Video[]>([]);

  return (
    <>
      <h1>追番热力图</h1>
      <div id="history-heatmap"></div>

      <div className="grid grid-cols-6 gap-4 mt-4">
        {videos.map(v => (
          <div key={v.id} className="shadow-md rounded-md p-2">
            <div className="relative">
              <Image
                className="rounded-md overflow-hidden"
                src={v.cover}
              ></Image>

              {v.type !== "Movie" && (
                <Button className="absolute bottom-2 left-2" size="xs">
                  看了 {v.count} 话
                </Button>
              )}
            </div>
            <Text size="lg" lineClamp={2}>
              {v.title}
            </Text>
          </div>
        ))}
      </div>
    </>
  );
}
