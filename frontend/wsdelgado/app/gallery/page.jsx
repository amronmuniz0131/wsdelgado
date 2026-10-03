"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { X, ChevronLeft, ChevronRight, Images, ArrowLeft } from "lucide-react";

export default function GalleryPage() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/gallery/read.php`);
        const data = await response.json();
        setAlbums(data.records || []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + selectedAlbum.images.length) % selectedAlbum.images.length
    );
  const nextImage = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % selectedAlbum.images.length
    );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero */}
      <section className="relative py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Gallery</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            A showcase of our craftsmanship and completed projects.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="aspect-[4/3] bg-gray-200 rounded-sm animate-pulse"
              />
            ))}
          </div>
        ) : !selectedAlbum && albums.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            No albums in the gallery yet. Check back soon!
          </p>
        ) : null}

        {/* Albums Grid */}
        {!isLoading && !selectedAlbum && albums.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="group text-left"
              >
                <div className="relative aspect-[4/3] mb-3 overflow-hidden rounded-sm bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={album.cover_image || album.images?.[0]?.image}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                    <Images size={14} />
                    {album.images.length}
                  </span>
                </div>
                <h3 className="font-bold text-lg">{album.title}</h3>
                {album.caption && (
                  <p className="text-sm text-gray-500 line-clamp-2">{album.caption}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Album Detail View */}
        {!isLoading && selectedAlbum && (
          <div>
            <button
              onClick={() => setSelectedAlbum(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Albums
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">{selectedAlbum.title}</h2>
              {selectedAlbum.caption && (
                <p className="text-gray-600 mt-2">{selectedAlbum.caption}</p>
              )}
            </div>

            {selectedAlbum.images.length === 0 ? (
              <p className="text-center text-gray-500 py-16">
                This album has no images.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedAlbum.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => openLightbox(index)}
                    className="group text-left"
                  >
                    <div className="aspect-[4/3] mb-3 overflow-hidden rounded-sm bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.image}
                        alt={img.title || selectedAlbum.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {img.title && <h3 className="font-bold text-lg">{img.title}</h3>}
                    {img.caption && (
                      <p className="text-sm text-gray-500 line-clamp-2">{img.caption}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && selectedAlbum?.images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <button
            className="absolute left-4 p-2 text-white/80 hover:text-white disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            disabled={selectedAlbum.images.length <= 1}
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>

          <figure
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedAlbum.images[lightboxIndex].image}
              alt={selectedAlbum.images[lightboxIndex].title || selectedAlbum.title}
              className="w-full max-h-[80vh] object-contain rounded-sm"
            />
            <figcaption className="text-center text-white mt-4">
              <h3 className="text-xl font-bold">
                {selectedAlbum.images[lightboxIndex].title || selectedAlbum.title}
              </h3>
              {selectedAlbum.images[lightboxIndex].caption && (
                <p className="text-gray-300 mt-1">
                  {selectedAlbum.images[lightboxIndex].caption}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                {lightboxIndex + 1} / {selectedAlbum.images.length}
              </p>
            </figcaption>
          </figure>

          <button
            className="absolute right-4 p-2 text-white/80 hover:text-white disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            disabled={selectedAlbum.images.length <= 1}
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
}
