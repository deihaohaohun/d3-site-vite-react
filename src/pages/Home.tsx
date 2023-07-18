import { Text, Card, Image, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="w-[980px]">
        <h2>Frontend</h2>
        <Text className="mb-6" size="md">
          Vite, React, React Router, Zustand, Mantine, Cal-Heatmap, Vercel ...
        </Text>
        <h2>Backend</h2>
        <Text className="mb-6" size="md">
          Nestjs, Prisma, MongoDB Atlas, Render ...
        </Text>
      </div>

      <div className="cards grid grid-cols-4 gap-4 w-[980px]">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://d-ssl.dtstatic.com/uploads/blog/202303/17/20230317005620_7bb2a.thumb.300_300_c.jpg_webp"
              height={140}
            />
          </Card.Section>

          <Button
            variant="light"
            fullWidth
            radius="md"
            className="mt-5"
            onClick={() => navigate("/bili")}
          >
            哔哩历史
          </Button>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://d-ssl.dtstatic.com/uploads/blog/202303/17/20230317005620_17580.thumb.300_300_c.jpg_webp"
              height={140}
            />
          </Card.Section>

          <Button
            variant="light"
            fullWidth
            radius="md"
            className="mt-5"
            onClick={() => navigate("/bili")}
          >
            复习笔记
          </Button>
        </Card>
      </div>
    </div>
  );
}
