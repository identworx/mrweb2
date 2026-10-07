"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  src: string;
  poster?: string;
}

export default function HeroVideo({ src, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => setReady(true);
    video.addEventListener("canplay", onCanPlay);

    video.load();

    return () => video.removeEventListener("canplay", onCanPlay);
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
