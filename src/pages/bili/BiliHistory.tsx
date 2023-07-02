import { useLoaderData } from "react-router-dom";
import {
  Button,
  Group,
  Input,
  Modal,
  NumberInput,
  Radio,
  SegmentedControl,
  Tooltip,
} from "@mantine/core";
import { Text, Image, ActionIcon } from "@mantine/core";
import {
  IconPlus,
  IconExposurePlus1,
  IconQuestionMark,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function BiliHistory() {
  let data: any = useLoaderData();
  const [opened, { open, close }] = useDisclosure(false);

  let videos = data.videos;

  return (
    <div className="w-3/5 min-w-[980px] mx-auto pt-4">
      <div className="mb-4">
        <SegmentedControl
          data={[
            { label: "哔哩历史", value: "react" },
            { label: "统计数据", value: "ng" },
          ]}
          color="blue"
        />
      </div>
      <div className="flex justify-between items-center">
        <SegmentedControl
          data={[
            { label: "Doing", value: "react" },
            { label: "Todo", value: "ng" },
            { label: "Done", value: "vue" },
          ]}
          color="blue"
        />

        <ActionIcon size="lg" radius="md" variant="default" onClick={open}>
          <IconPlus />
        </ActionIcon>
      </div>

      <div className="grid grid-cols-6 gap-2 mt-4">
        {videos.map((v: any) => (
          <div key={v.id} className="relative">
            <div className="relative">
              <Image
                className="rounded-md overflow-hidden"
                src={v.cover}
              ></Image>

              <div className="absolute bottom-2 left-2">
                <Tooltip label={`全 ${v.total} 话`}>
                  <Button size="xs">看到 {v.current} 话</Button>
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
            >
              <IconExposurePlus1 />
            </ActionIcon>
          </div>
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
          <div className="cover rounded-md w-[150px] h-[200px] border-solid border-2 border-sky-400 flex justify-center items-center">
            <ActionIcon size="lg" radius="md">
              <IconQuestionMark />
            </ActionIcon>
          </div>
          {/* <Image
            maw={150}
            radius="md"
            src={
              "https://i0.hdslb.com/bfs/bangumi/image/5cf6b70e4fa7a6d2c3d680b8f0c8fe42f1ca964a.jpg@271w_361h.webp"
            }
          ></Image> */}
        </div>

        <Input className="mb-4" placeholder="视频名称" />
        <Input className="mb-4" placeholder="封面链接" />
        <Radio.Group className="mb-4">
          <Group mt="xs">
            <Radio value="react" label="番剧" />
            <Radio value="svelte" label="纪录片" />
            <Radio value="ng" label="电影" />
          </Group>
        </Radio.Group>
        <NumberInput className="mb-4" placeholder="分 p 数" />

        <Group position="right">
          <Button variant="default" onClick={close}>
            取消
          </Button>
          <Button>提交</Button>
        </Group>
      </Modal>
    </div>
  );
}
