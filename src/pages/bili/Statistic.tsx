import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import { useEffect, useState } from "react";
import { http } from "../../utils/fetch";
import { Button, Image, Text } from "@mantine/core";
import { Video } from "../../components/Video";
import { formatDate } from "../../utils/date";

export default function Statistic() {
  useEffect(() => {
    http.get("/histories").then(resp => {
      const dateMap = new Map<string, number>();
      const videosOfDate = new Map<string, string[]>();
      const data = resp.data;
      for (const { when, videoId } of data) {
        const date = formatDate(when);
        if (dateMap.has(date)) {
          let num = dateMap.get(date) ?? 0;
          num++;
          dateMap.set(date, num);
        } else {
          dateMap.set(date, 1);
        }
        if (videosOfDate.has(date)) {
          const ids = videosOfDate.get(date) ?? [];
          videosOfDate.set(date, [...ids, videoId]);
        } else {
          videosOfDate.set(date, [videoId]);
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

      cal.on("click", async (_event: any, timestamp: number) => {
        let ids = videosOfDate.get(formatDate(timestamp)) ?? [];
        let uniqueIds = Array.from(new Set(ids));
        const query = uniqueIds.map(id => `ids=${id}`).join("&");
        const r = await http.get(`/videos?${query}`);
        let videos: Video[] = r.data;
        for (let v of videos) {
          v.count = 0;
          for (let id of ids) {
            if (id === v.id) v.count++;
          }
        }
        return setVideos(videos);
      });
    });
  }, []);

  const [videos, setVideos] = useState<Video[]>([]);

  return (
    <>
      <h1>追番热力图</h1>
      <div id="history-heatmap"></div>

      <div className="grid grid-cols-6 gap-4 mt-4">
        {videos.map(v => (
          <div key={v.id} className="shadow-md rounded-md p-2">
            <div className="relative h-[200px]">
              <Image
                className="rounded-md overflow-hidden h-full"
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
