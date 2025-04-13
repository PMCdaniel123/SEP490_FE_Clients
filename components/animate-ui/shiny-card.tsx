import { useCallback, useRef } from "react";

import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/libs/utils";

interface ShinyCardProps {
  className?: string;
  children: React.ReactNode;
}

export default function ShinyCard({ className, children }: ShinyCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!overlayRef.current) {
      return;
    }

    const { width, height } = overlayRef.current?.getBoundingClientRect() ?? {};
    const xOffset = x - width / 2;
    const yOffset = y - height / 2;

    overlayRef.current?.style.setProperty("--x", `${xOffset}px`);
    overlayRef.current?.style.setProperty("--y", `${yOffset}px`);
  }, []);

  useMousePosition(containerRef, update);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-96 overflow-hidden rounded-lg border border-border bg-white text-zinc-200 shadow-lg",
        className
      )}
    >
      <div
        ref={overlayRef}
        // Adjust height & width as required
        className="-z-1 absolute h-64 w-64 rounded-full bg-secondary opacity-0 bg-blend-soft-light blur-3xl transition-opacity group-hover:opacity-20"
        style={{
          transform: "translate(var(--x), var(--y))",
        }}
      />

      {children}
    </div>
  );
}
