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
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconClipboard, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import Video, { Video as V } from "../../components/Video";
import { http } from "../../utils/fetch";
import { nanoid } from "nanoid";

export default function Index() {
  const data: any = useLoaderData();
  const [opened, { open, close }] = useDisclosure(false);

  const [videos, setVideos] = useState<V[]>(data.videos);
  const getTypedVideos = async (type: string) => {
    setCurrent(type);
    const resp = await http.get(`videos/${type}`);
    setVideos(resp.data);
  };

  const [current, setCurrent] = useState("Doing");

  const form = useForm({
    initialValues: {
      title: "",
      cover: "",
      type: "Bangumi",
      total: 1,
    },
    validate: {
      title: (value) => (value.trim() === "" ? "请输入视频名称" : null),
      cover: (value) => (value.trim() === "" ? "请输入视频封面链接" : null),
    },
  });
  const createVideo = async () => {
    const { hasErrors, errors } = form.validate();
    if (!hasErrors) {
      await http.post("/videos", { ...form.values, status: current });
      toast.success("添加视频成功");
      form.reset();
      close();
      await getTypedVideos(current);
    } else {
      const keys = ["title", "cover"];
      for (const k of keys) {
        if (errors[k]) {
          return toast(errors[k] as string, { icon: "😵" });
        }
      }
    }
  };

  const removeVideo = (id: string) => {
    const newVideos = videos.filter((v) => v.id !== id);
    setVideos(newVideos);
  };

  const blob2base64 = async (blob: any) => {
    return new Promise((r) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl?.split(",")[1];
        r(base64);
      };
      reader.readAsDataURL(blob);
    });
  };

  const readImgFromClipboard = () => {
    navigator.permissions.query({ name: "clipboard-read" }).then((result) => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.read().then(async (data) => {
          for (let i = 0; i < data.length; i++) {
            console.log(data[i].types);
            const blob = await data[i].getType("image/png");
            const base64 = await blob2base64(blob);

            const name = nanoid();
            const resp = await http.post(
              `https://gitee.com/api/v5/repos/deihaohaohun/picgo-img-bed/contents/${name}.png`,
              {
                access_token: "3900b0a7dea9a8f5fa67e8c0ed6b8c16",
                content: base64,
                message: `${form.values.title}封面图`,
              }
            );
            form.setFieldValue("cover", resp.data.content.download_url);
          }
        });
      } else {
        toast("读取剪切板失败惹 o.o", { icon: "😂" });
      }
    });
  };

  const addVideo = () => {
    form.reset();
    open();
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

        {["Todo", "Done"].includes(current) && (
          <ActionIcon
            size="lg"
            radius="md"
            variant="default"
            onClick={addVideo}
          >
            <IconPlus />
          </ActionIcon>
        )}
      </div>

      <div className="grid grid-cols-6 gap-4 mt-4">
        {videos.map((v: V) => (
          <Video key={v.id} video={v} removeFunc={removeVideo} />
        ))}
      </div>

      <h3 className="text-center text-2xl">没有更多数据了...</h3>

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
              <Tooltip label="从剪切板中上传">
                <ActionIcon
                  size="lg"
                  radius="md"
                  onClick={readImgFromClipboard}
                >
                  <IconClipboard />
                </ActionIcon>
              </Tooltip>
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
