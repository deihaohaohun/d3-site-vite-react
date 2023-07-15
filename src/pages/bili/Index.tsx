import {
  Modal,
  ActionIcon,
  Input,
  Radio,
  Group,
  NumberInput,
  Button,
  Image,
  SegmentedControl,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconQuestionMark } from "@tabler/icons-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import Video, { Video as V } from "../../components/Video";
import { http } from "../../utils/fetch";

export default function Index() {
  const data: any = useLoaderData();
  const [opened, { open, close }] = useDisclosure(false);

  const [videos, setVideos] = useState<V[]>(data.videos);
  const getTypedVideos = async (type: string) => {
    const resp = await http.get(`videos/${type}`);
    setVideos(resp.data);
  };

  const form = useForm({
    initialValues: {
      title: "",
      cover: "",
      type: "Bangumi",
      total: 1,
    },
  });
  const createVideo = async () => {
    await http.post("/videos", form.values);
    toast.success("添加视频成功");
    form.reset();
    close();
  };

  const removeVideo = (id: string) => {
    const newVideos = videos.filter(v => v.id !== id);
    setVideos(newVideos);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <SegmentedControl
          data={[
            { label: "在看", value: "Doing" },
            { label: "想看", value: "Todo" },
            { label: "看过", value: "Done" },
          ]}
          color="blue"
          onChange={getTypedVideos}
        />

        <ActionIcon size="lg" radius="md" variant="default" onClick={open}>
          <IconPlus />
        </ActionIcon>
      </div>

      <div className="grid grid-cols-6 gap-4 mt-4">
        {videos.map((v: V) => (
          <Video key={v.id} video={v} removeFunc={removeVideo} />
        ))}
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="添加视频"
        centered
        closeOnClickOutside={false}
      >
        <div className="flex justify-center mb-4">
          {form.values.cover === "" ? (
            <div className="cover rounded-md w-[150px] h-[200px] border-solid border-2 border-sky-400 flex justify-center items-center">
              <ActionIcon size="lg" radius="md">
                <IconQuestionMark />
              </ActionIcon>
            </div>
          ) : (
            <Image maw={150} radius="md" src={form.values.cover}></Image>
          )}
        </div>

        <form>
          <Input
            className="mb-4"
            placeholder="视频名称"
            {...form.getInputProps("title")}
          />
          <Input
            className="mb-4"
            placeholder="封面链接"
            {...form.getInputProps("cover")}
          />
          <Radio.Group className="mb-4" {...form.getInputProps("type")}>
            <Group mt="xs">
              <Radio value="Bangumi" label="番剧" />
              <Radio value="Documentary" label="纪录片" />
              <Radio value="Movie" label="电影" />
            </Group>
          </Radio.Group>
          <NumberInput
            className="mb-4"
            placeholder="分 p 数"
            {...form.getInputProps("total")}
          />
        </form>

        <Group position="right">
          <Button variant="default" onClick={close}>
            取消
          </Button>
          <Button onClick={createVideo}>提交</Button>
        </Group>
      </Modal>
    </>
  );
}
