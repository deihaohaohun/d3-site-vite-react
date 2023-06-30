import "./App.css";

import { Header, MantineProvider } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { IconSunHigh, IconMoon } from "@tabler/icons-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function App() {
  const [theme, setTheme] = useState({ colorScheme: "dark" });

  const toggleTheme = () => {
    if (theme.colorScheme === "dark") {
      setTheme({ colorScheme: "light" });
    } else {
      setTheme({ colorScheme: "dark" });
    }
  };

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <Header height={60} p="xs">
        <div className="flex justify-between items-center">
          <span>dhhh</span>
          <ActionIcon
            onClick={toggleTheme}
            size="lg"
            radius="md"
            variant="default"
          >
            {theme.colorScheme === "dark" ? <IconMoon /> : <IconSunHigh />}
          </ActionIcon>
        </div>
      </Header>

      <div className="home min-w-[1100px]">
        <Outlet />
      </div>
    </MantineProvider>
  );
}
