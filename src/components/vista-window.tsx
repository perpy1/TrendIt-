"use client";

import { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { useSound } from "@/lib/use-sound";

interface VistaWindowProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  width?: string;
  height?: string;
  defaultPosition?: { x: number; y: number };
  isPopup?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  showMinimize?: boolean;
  showMaximize?: boolean;
  className?: string;
  bodyClassName?: string;
  maximized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
  id?: string;
}

export function VistaWindow({
  title,
  children,
  icon,
  width,
  height,
  defaultPosition,
  isPopup = false,
  onClose,
  onMinimize,
  showMinimize = true,
  showMaximize = true,
  className = "",
  bodyClassName = "",
  maximized: externalMaximized,
  zIndex = 10,
  onFocus,
  id,
}: VistaWindowProps) {
  const { playWindowClose, playMinimize, playClick } = useSound();
  const [isMaximized, setIsMaximized] = useState(externalMaximized ?? false);
  const [position, setPosition] = useState(defaultPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      onFocus?.();
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        dragOffset.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    },
    [isMaximized, onFocus]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleClose = () => {
    playWindowClose();
    onClose?.();
  };

  const handleMinimize = () => {
    playMinimize();
    onMinimize?.();
  };

  const handleMaximize = () => {
    playClick();
    setIsMaximized(!isMaximized);
  };

  const windowStyle: React.CSSProperties = isMaximized
    ? { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", zIndex }
    : {
        position: isPopup ? "fixed" : defaultPosition ? "absolute" : "relative",
        left: defaultPosition ? position.x : undefined,
        top: defaultPosition ? position.y : undefined,
        width: width || undefined,
        height: height || undefined,
        zIndex,
      };

  const windowContent = (
    <div
      ref={windowRef}
      id={id}
      style={windowStyle}
      className={`vista-window flex flex-col overflow-hidden rounded-lg ${className}`}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className="vista-titlebar flex h-8 shrink-0 cursor-move select-none items-center gap-2 px-2"
        onMouseDown={handleMouseDown}
        onDoubleClick={showMaximize ? handleMaximize : undefined}
      >
        {icon && <span className="flex h-4 w-4 items-center justify-center">{icon}</span>}
        <span className="flex-1 truncate text-xs font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
          {title}
        </span>
        <div className="flex items-center gap-0.5">
          {showMinimize && (
            <button
              onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
              className="vista-btn-minimize flex h-[18px] w-[22px] items-center justify-center rounded-sm text-white hover:brightness-125"
              title="Minimize"
            >
              <svg width="8" height="2" viewBox="0 0 8 2"><rect fill="white" width="8" height="2" /></svg>
            </button>
          )}
          {showMaximize && (
            <button
              onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
              className="vista-btn-maximize flex h-[18px] w-[22px] items-center justify-center rounded-sm text-white hover:brightness-125"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? (
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <rect x="2" y="0" width="6" height="6" fill="none" stroke="white" strokeWidth="1.2" />
                  <rect x="0" y="2" width="6" height="6" fill="none" stroke="white" strokeWidth="1.2" />
                </svg>
              ) : (
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <rect x="0" y="0" width="8" height="8" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
              )}
            </button>
          )}
          {onClose && (
            <button
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="vista-btn-close flex h-[18px] w-[22px] items-center justify-center rounded-sm text-white hover:brightness-125"
              title="Close"
            >
              <svg width="8" height="8" viewBox="0 0 8 8">
                <line x1="0" y1="0" x2="8" y2="8" stroke="white" strokeWidth="1.5" />
                <line x1="8" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.5" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className={`vista-window-body flex-1 overflow-auto ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );

  if (isPopup) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        {windowContent}
      </div>
    );
  }

  return windowContent;
}
