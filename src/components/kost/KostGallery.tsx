"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface KostGalleryProps {
  images: string[];
  name: string;
}

export function KostGallery({ images, name }: KostGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video rounded-2xl bg-gray-800 flex items-center justify-center">
        <p className="text-gray-500">Tidak ada foto</p>
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[380px] md:h-[480px]">
        {/* Main image */}
        <div
          className="col-span-4 md:col-span-3 row-span-2 relative cursor-pointer overflow-hidden"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex]}
            alt={`${name} - foto ${activeIndex + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/60 text-xs text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails (desktop only) */}
        {images.slice(0, 2).map((img, i) => (
          <div
            key={i}
            className="hidden md:block relative cursor-pointer overflow-hidden"
            onClick={() => setActiveIndex(i)}
          >
            <Image
              src={img}
              alt={`${name} thumbnail ${i + 1}`}
              fill
              className={cn(
                "object-cover hover:scale-105 transition-transform duration-300",
                activeIndex === i && "ring-2 ring-violet-500"
              )}
            />
            {i === 1 && images.length > 3 && (
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              >
                <span className="text-white font-semibold text-sm">+{images.length - 3} foto</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeIndex]}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          {/* Dot indicators */}
          <div className="absolute bottom-6 flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  activeIndex === i ? "bg-violet-400 w-6" : "bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
