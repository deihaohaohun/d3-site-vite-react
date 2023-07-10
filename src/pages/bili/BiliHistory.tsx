import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SegmentedControl } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

export default function BiliHistory() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [location, setLocation] = useState("history");
  useEffect(() => {
    if (pathname.includes("statistic")) {
      setLocation("statistic");
    }
  }, []);

  const onNavChange = useCallback((value: string) => {
    value === "history" ? navigate("/bili") : navigate("/bili/statistic");
    setLocation(value);
  }, []);

  return (
    <div className="w-3/5 min-w-[980px] mx-auto pt-4">
      <div className="mb-4">
        <SegmentedControl
          value={location}
          data={[
            { label: "哔哩历史", value: "history" },
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
