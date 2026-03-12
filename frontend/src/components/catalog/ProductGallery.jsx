import { useState } from 'react';
import { resolveMediaUrl } from '../../lib/media';

export function ProductGallery({ images = [], title }) {
  const [active, setActive] = useState(0);
  const gallery = images.length ? images : ['/icon-512.svg'];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800">
        <img
          src={resolveMediaUrl(gallery[active])}
          alt={title}
          className="aspect-square w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = '/icon-512.svg';
          }}
        />
      </div>
      <div className="flex snap-x gap-3 overflow-x-auto pb-1">
        {gallery.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(index)}
            className={`overflow-hidden rounded-2xl border ${index === active ? 'border-brand-600' : 'border-transparent'}`}
          >
            <img
              src={resolveMediaUrl(image)}
              alt={`${title} ${index + 1}`}
              className="h-20 w-20 object-cover"
              onError={(event) => {
                event.currentTarget.src = '/icon-192.svg';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
