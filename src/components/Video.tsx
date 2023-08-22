import { Button, Image, Text, ActionIcon, Modal, Group } from "@mantine/core";
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
import { useDisclosure } from "@mantine/hooks";

export type Video = {
  id: string;
  title: string;
  cover: string;
  createdAt?: Date | string;
  type: "Bangumi" | "Documentary" | "Movie";
  total: number;
  current: number;
  status: "Doing" | "Todo" | "Done";
  count?: number;
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
    setV((v) => {
      v.current = v.current + 1;
    });
  };

  const [loading, setLoading] = useState(false);
  const onBtnClicked = async () => {
    switch (v.status) {
      case "Doing":
        setLoading(true);
        open();
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
  const getUpdateText = () => {
    switch (v.type) {
      case "Bangumi":
        return v.current === v.total ? "标记看过?" : "追一话?";
      case "Documentary":
        return "看一集?";
      case "Movie":
        return "标记看过?";
    }
  };

  const [opened, { open, close }] = useDisclosure(false);
  const [updating, setUpdating] = useState(false);
  async function onTodoBtnClicked() {
    setUpdating(true);
    if (v.current === v.total) {
      await http.put(`/videos/finish/${v.id}`);
      removeFunc(v.id);
    } else {
      await http.put(`/videos/${v.id}`);
      updateV();
    }
    setUpdating(false);
    toast.success("操作成功！");
    onTodoCancel();
  }
  function onTodoCancel() {
    setLoading(false);
    close();
  }

  return (
    <div className="relative shadow-md rounded-md p-2">
      <div className="relative h-[200px]">
        <Image
          className="rounded-md overflow-hidden h-full"
          src={v.cover}
        ></Image>

        {v.status === "Doing" && (
          <div className="absolute bottom-2 left-2">
            <Button size="xs">
              看到第 {v.current} {v.type === "Bangumi" ? "话" : "集"}
            </Button>
          </div>
        )}
      </div>

      <Text size="lg" lineClamp={3}>
        {v.title}
      </Text>
      <Text size="sm" className="text-gray-500">
        {`全 ${v.total} ${v.type === "Bangumi" ? "话" : "集"}`}
      </Text>

      <ActionIcon
        className="absolute top-4 right-4"
        size="lg"
        radius="md"
        variant="default"
        loading={loading}
        onClick={onBtnClicked}
      >
        {getAddIcon()}
      </ActionIcon>

      <Modal
        opened={opened}
        withCloseButton={false}
        onClose={onTodoCancel}
        title={getUpdateText()}
      >
        <Group position="right">
          <Button variant="default" onClick={onTodoCancel}>
            取消
          </Button>
          <Button onClick={onTodoBtnClicked} loading={updating}>
            确定
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
