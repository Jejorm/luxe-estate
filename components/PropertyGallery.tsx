'use client'

import { useState } from 'react'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [mainImageIndex, setMainImageIndex] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <div className="col-span-1 lg:col-span-8 space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
        <img
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={images[mainImageIndex]}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Premium
          </span>
          <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            New
          </span>
        </div>
        <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
          <span className="material-icons text-sm">grid_view</span>
          View All Photos
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start transition-opacity ${
                mainImageIndex === idx
                  ? 'ring-2 ring-mosque ring-offset-2 ring-offset-background-light opacity-100'
                  : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => setMainImageIndex(idx)}
            >
              <img
                alt={`${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                src={img}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
