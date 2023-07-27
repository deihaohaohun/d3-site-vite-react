import BScroll from "@better-scroll/core";
import { useEffect, useRef } from "react";
import { BackgroundImage, Text } from "@mantine/core";

export default function Index() {
  const wrapper = useRef(null);
  useEffect(() => {
    new BScroll(wrapper.current!, {
      scrollX: true,
      probeType: 3, // listening scroll event
    });
  }, []);

  const arr = new Array(10).fill(0);

  return (
    <div>
      <div
        className="h-[240px] w-full overflow-hidden whitespace-nowrap"
        ref={wrapper}
      >
        <div className="inline-block h-full">
          {arr.map((i, idx) => (
            <div
              key={idx}
              className="w-[360px] inline-block h-full mr-2 rounded-md overflow-hidden relative"
            >
              <BackgroundImage
                className="h-full blur-sm"
                src="https://api.likepoems.com/img/pixiv"
              />
              <Text className="absolute translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 text-3xl text-white">
                2023-07-19
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
