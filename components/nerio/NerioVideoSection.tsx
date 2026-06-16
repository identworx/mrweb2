"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NerioVideo {
  enabled: boolean;
  youtubeUrl: string;
  title: string;
  description: string;
  startSeconds: number | null;
  thumbnailUrl: string | null;
  thumbnailAlt: string | null;
  label: string | null;
}

interface NerioVideoSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  videos: NerioVideo[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function parseYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be"))
      return u.pathname.slice(1).split("/")[0] || null;
    return u.searchParams.get("v") || null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Play icon (SVG triangle inside circle)                             */
/* ------------------------------------------------------------------ */

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-white ml-0.5"
        aria-hidden="true"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Close icon                                                         */
/* ------------------------------------------------------------------ */

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Video modal                                                        */
/* ------------------------------------------------------------------ */

function VideoModal({
  video,
  onClose,
}: {
  video: NerioVideo;
  onClose: () => void;
}) {
  const videoId = parseYouTubeId(video.youtubeUrl);
  const start = video.startSeconds ?? 0;

  /* Close on Escape */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /* Body scroll lock */
  useEffect(() => {
    const scrollY = window.scrollY;
    const { overflow, position, top, width } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
    };
  }, []);

  if (!videoId) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[960px]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-2 md:-top-12 text-white/70 hover:text-white transition-colors duration-200 p-1"
          aria-label="Video schliessen"
          type="button"
        >
          <CloseIcon />
        </button>

        {/* 16:9 video area */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&start=${start}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Title and description below video */}
        <div className="mt-5 px-1">
          <h3 className="font-heading text-white text-lg md:text-xl font-bold tracking-tight">
            {video.title}
          </h3>
          {video.description && (
            <p className="font-body text-white/60 text-sm md:text-base leading-[1.7] mt-2">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/*  Video card                                                         */
/* ------------------------------------------------------------------ */

function VideoCard({
  video,
  onPlay,
}: {
  video: NerioVideo;
  onPlay: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="group text-left w-full bg-[#FAF8F5] border-x border-b border-[#e8e4df] rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(45,45,45,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(45,45,45,0.08)] motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B6D] focus-visible:ring-offset-2"
      aria-label={`Video abspielen: ${video.title}`}
    >
      {/* Thumbnail area (16:9) */}
      <div className="relative aspect-video overflow-hidden">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.thumbnailAlt || video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* Premium placeholder */
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #0C3D40 0%, #1B6B6D 100%)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)",
              }}
            />
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayIcon className="transition-transform duration-300 motion-safe:group-hover:scale-110 opacity-80 group-hover:opacity-100" />
        </div>

        {/* Label badge */}
        {video.label && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0C3D40]/90 text-white font-accent text-[10px] tracking-[0.12em] uppercase rounded">
            {video.label}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 md:p-6">
        <h3 className="font-heading text-anthracite text-base md:text-lg font-bold tracking-tight mb-2 group-hover:text-[#1B6B6D] transition-colors duration-300">
          {video.title}
        </h3>
        {video.description && (
          <p className="font-body text-text-gray text-sm leading-[1.7] mb-3">
            {video.description}
          </p>
        )}
        <p className="font-body text-text-gray/60 text-xs leading-relaxed">
          Mit Klick wird ein YouTube-Video geladen.
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function NerioVideoSection({
  eyebrow,
  title,
  intro,
  videos,
}: NerioVideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<NerioVideo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    setActiveVideo(null);
  }, []);

  const enabledVideos = videos.filter((v) => v.enabled);

  if (enabledVideos.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-5">
          <div className="accent-line" />
          <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
            {eyebrow}
          </p>
        </div>

        {/* Title */}
        <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
          {title}
        </h2>

        {/* Intro */}
        <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12">
          {intro}
        </p>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledVideos.map((video, i) => (
            <VideoCard
              key={`${video.youtubeUrl}-${i}`}
              video={video}
              onPlay={() => setActiveVideo(video)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {mounted && activeVideo && (
        <VideoModal video={activeVideo} onClose={handleClose} />
      )}
    </section>
  );
}
