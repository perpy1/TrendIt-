"use client";

import { useCallback } from "react";
import { sounds } from "./sounds";

export function useSound() {
  const playClick = useCallback(() => sounds.click(), []);
  const playButtonPress = useCallback(() => sounds.buttonPress(), []);
  const playWindowOpen = useCallback(() => sounds.windowOpen(), []);
  const playWindowClose = useCallback(() => sounds.windowClose(), []);
  const playMinimize = useCallback(() => sounds.minimize(), []);
  const playError = useCallback(() => sounds.error(), []);
  const playNavigate = useCallback(() => sounds.navigate(), []);
  const playHover = useCallback(() => sounds.hover(), []);
  const playStartMenu = useCallback(() => sounds.startMenu(), []);
  const playStartup = useCallback(() => sounds.startup(), []);
  const playExpand = useCallback(() => sounds.expand(), []);
  const playCollapse = useCallback(() => sounds.collapse(), []);

  return {
    playClick,
    playButtonPress,
    playWindowOpen,
    playWindowClose,
    playMinimize,
    playError,
    playNavigate,
    playHover,
    playStartMenu,
    playStartup,
    playExpand,
    playCollapse,
  };
}
