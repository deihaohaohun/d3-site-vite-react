import { Button, Tooltip, Image, Text, ActionIcon } from "@mantine/core";
import { useImmer } from "use-immer";
import {
  IconExposurePlus1,
  IconCheck,
  IconPlayerPlay,
  IconHistory,
} from "@tabler/icons-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { http } from "../utils/fetch";

export type Video = {
  id: string;
  title: string;
  cover: string;
  createdAt?: Date | string;
  type: "Bangumi" | "Documentary" | "Movie";
  total: number;
  current: number;
  status: "Doing" | "Todo" | "Done";
};

export default function Video({
  video,
  removeFunc,
}: {
  video: Video;
  removeFunc: (id: string) => void;
}) {
  const [v, setV] = useImmer(video);

  const updateV = () => {
    setV(v => {
      v.current = v.current + 1;
    });
  };

  const [loading, setLoading] = useState(false);
  const onBtnClicked = async () => {
    switch (v.status) {
      case "Doing":
        setLoading(true);
        try {
          if (v.current === v.total) {
            await http.put(`/videos/finish/${v.id}`);
            removeFunc(v.id);
          } else {
            await http.put(`/videos/${v.id}`);
            updateV();
          }
          toast.success("操作成功！");
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
        return;
      case "Todo":
        try {
          await http.put(`videos/start/${v.id}`);
          removeFunc(v.id);
          toast.success("操作成功！");
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
        return;
      case "Done":
        toast("正在开发...", {
          icon: "❤️",
        });
        return;
    }
  };

  const getAddIcon = () => {
    switch (v.status) {
      case "Doing":
        switch (v.type) {
          case "Bangumi":
          case "Documentary":
            if (v.current === v.total) {
              return <IconCheck />;
            }
            return <IconExposurePlus1 />;
          case "Movie":
            return <IconCheck />;
          default:
            return <IconExposurePlus1 />;
        }
      case "Todo":
        return <IconPlayerPlay />;
      case "Done":
        return <IconHistory />;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Image className="rounded-md overflow-hidden" src={v.cover}></Image>

        {v.status === "Doing" && (
          <div className="absolute bottom-2 left-2">
            <Tooltip
              label={`全 ${v.total} ${v.type === "Bangumi" ? "话" : "集"}`}
            >
              <Button size="xs">
                看到第 {v.current} {v.type === "Bangumi" ? "话" : "集"}
              </Button>
            </Tooltip>
          </div>
        )}
      </div>

      <Text size={"lg"} lineClamp={2}>
        {v.title}
      </Text>

      <ActionIcon
        className="absolute top-2 right-2"
        size="lg"
        radius="md"
        variant="default"
        loading={loading}
        onClick={onBtnClicked}
      >
        {getAddIcon()}
      </ActionIcon>
    </div>
  );
}
