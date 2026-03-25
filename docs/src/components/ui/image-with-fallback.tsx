/* eslint-disable @next/next/no-img-element */

'use client';

import React, { useState } from 'react';

const ERROR_IMG_SRC = '/images/placeholder.svg';

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`} style={style}>
      <div className="flex h-full w-full items-center justify-center">
        <img src={ERROR_IMG_SRC} alt="Error loading image" className={className} {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  );
}
