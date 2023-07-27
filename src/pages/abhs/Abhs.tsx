import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SegmentedControl } from "@mantine/core";
import { useEffect, useState } from "react";

export default function BiliHistory() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [location, setLocation] = useState("abhs");
  useEffect(() => {
    if (pathname.includes("statistic")) {
      setLocation("statistic");
    } else {
      setLocation("abhs");
    }
  }, [pathname]);

  const onNavChange = (value: string) => {
    value === "abhs" ? navigate("/abhs") : navigate("/abhs/statistic");
    setLocation(value);
  };

  return (
    <div className="w-3/5 min-w-[980px] mx-auto pt-4">
      <div className="mb-4">
        <SegmentedControl
          value={location}
          data={[
            { label: "复习笔记", value: "abhs" },
            { label: "统计数据", value: "statistic" },
          ]}
          color="blue"
          onChange={onNavChange}
        />
      </div>
      <Outlet />
    </div>
  );
}
