import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import type { Photo } from "@/content/services/types";

/**
 * Authentic job photography with visible captions. Photos are passed in by
 * the page's content file; the component never picks images itself, so it can
 * never surface a stock image or a photo from the wrong pathway.
 */
export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const cols =
    photos.length >= 3 ? "md:grid-cols-3" : photos.length === 2 ? "md:grid-cols-2" : "";

  return (
    <Reveal stagger className={`mt-12 grid gap-6 ${cols}`}>
      {photos.map((photo) => (
        <figure key={photo.src}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-navy-900/10 shadow-sm">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          {photo.caption && (
            <figcaption className="mt-3 text-sm text-charcoal/65">
              {photo.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </Reveal>
  );
}
