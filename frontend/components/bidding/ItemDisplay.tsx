'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useBidding } from '@/hooks/useBidding';

export default function ItemDisplay() {
  const { currentHighest } = useBidding();

  const images = ['/watch1.jpg', '/watch2.jpg', '/watch3.jpg'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg flex flex-col h-full overflow-hidden transition-all duration-300">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className="bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-sm">
          Lot 01
        </span>
        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-sm">
          Vintage
        </span>
      </div>

      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
        <Image
          src={images[activeImageIndex]}
          alt={`Rolex Datejust 16030 View ${activeImageIndex + 1}`}
          fill
          className="object-contain p-8 transition-opacity duration-300"
          priority
        />
      </div>

      <div className="flex gap-3 p-6 pb-0 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={img}
            onClick={() => setActiveImageIndex(index)}
            className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
              activeImageIndex === index
                ? 'border-gray-900 shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      <div className="p-6 flex flex-col grow">
        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
          Rolex Datejust 16030
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 grow">
          A classic 36mm steel automatic men’s watch from the 1980s featuring a distinct white
          Buckley dial. Complete with steel bracelet and original clasp. A perfect entry into
          vintage horology.
        </p>

        <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
          <div className="text-left">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
              Starting Price
            </p>
            <p className="text-xl font-medium text-gray-500">$50.00</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
              Current Highest Bid
            </p>
            <p className="text-3xl font-black text-blue-600">
              {' '}
              {currentHighest !== null ? `$${currentHighest.toFixed(2)}` : 'Loading...'}{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
