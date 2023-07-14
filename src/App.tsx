import "./App.css";

import {
  Header,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { IconSunHigh, IconMoon } from "@tabler/icons-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Header height={60} p="xs">
          <div className="flex justify-between items-center">
            <span>得好好混的小破站</span>
            <ActionIcon
              onClick={() => toggleColorScheme()}
              size="lg"
              radius="md"
              variant="default"
            >
              {colorScheme === "dark" ? <IconMoon /> : <IconSunHigh />}
            </ActionIcon>
          </div>
        </Header>

        <div className="home min-w-[1100px]">
          <Outlet />
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
