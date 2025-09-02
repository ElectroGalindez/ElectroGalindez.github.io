// src/components/ImageFallback.jsx
import React, { useState } from 'react';
import '../styles/ImageFallback.css';

function ImageFallback({ src, alt, className, fallbackSrc = '/placeholders/product-fallback.jpg' }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc !== fallbackSrc && !hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}

export default ImageFallback;