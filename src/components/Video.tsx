import { Button, Tooltip, Image, Text, ActionIcon } from "@mantine/core";
import { useImmer } from "use-immer";
import { IconExposurePlus1, IconCheck } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type Video = {
  id: string;
  title: string;
  cover: string;
  createdAt?: Date | string;
  type: "Bangumi" | "Documentary" | "Movie";
  total: number;
  current: number;
};

export default function Video({ video }: { video: Video }) {
  const [v, setV] = useImmer(video);

  const updateV = () => {
    setV(v => {
      v.current = v.current + 1;
    });
  };

  const [loading, setLoading] = useState(false);
  const onBtnClicked = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/videos/${v.id}`);
      toast.success("操作成功！");
      updateV();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getAddIcon = () => {
    switch (v.type) {
      case "Bangumi":
      case "Documentary":
        return <IconExposurePlus1 />;
      case "Movie":
        return <IconCheck />;
      default:
        return <IconExposurePlus1 />;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Image className="rounded-md overflow-hidden" src={v.cover}></Image>

        <div className="absolute bottom-2 left-2">
          <Tooltip
            label={`全 ${v.total} ${v.type === "Bangumi" ? "话" : "集"}`}
          >
            <Button size="xs">
              看到 {v.current} {v.type === "Bangumi" ? "话" : "集"}
            </Button>
          </Tooltip>
        </div>
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
