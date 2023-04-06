import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { GalleryItem, GalleryItemImage } from './ImageGalleryItem.styled';

export function ImageGalleryItem({
  onImageClick,
  tags,
  largeImageURL,
  webImg,
  isAnchor,
}) {
  const imageRef = useRef(null);

  useEffect(() => {
    if (!isAnchor) return;
    const y =
      imageRef.current.getBoundingClientRect().top + window.pageYOffset - 80;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  }, [isAnchor]);

  const handleClick = () => {
    onImageClick({ largeImageURL, tags });
  };

  return (
    <GalleryItem onClick={handleClick} ref={isAnchor ? imageRef : null}>
      <GalleryItemImage src={webImg} alt={tags} />
    </GalleryItem>
  );
}

ImageGalleryItem.propTypes = {
  webImg: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onImageClick: PropTypes.func.isRequired,
};
