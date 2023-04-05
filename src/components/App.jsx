import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import api from 'services/api';

import 'react-toastify/dist/ReactToastify.css';
import { Container } from './App.styled';

export function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalData, setModalData] = useState(null);

  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!query) {
      return;
    }
    const options = { query, currentPage };

    setStatus('pending');

    api
      .fetchImages(options)
      .then(({ images, totalImages }) => {
        if (totalImages === 0) {
          setStatus('idle');
          return toast.error(`Sorry, we didn't find any pictures of ${query}`);
        }

        setImages(prevState => [...prevState, ...images]);
        setTotalImages(totalImages);
        setStatus('resolved');
      })
      .catch(error => {
        toast.error(`Sorry something went wrong. ${error.message}`);
        setStatus('rejected');
      });
  }, [query, currentPage]);

  const handleFormSubmit = query => {
    setQuery(query);
    setImages([]);
    setCurrentPage(1);
  };

  const loadMore = () => setCurrentPage(prevState => prevState + 1);

  const toggleModal = (modalData = null) => {
    setModalData(modalData);
  };

  const showButton = status === 'resolved' && totalImages !== images.length;

  return (
    <Container>
      <Searchbar onSubmit={handleFormSubmit} />

      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={toggleModal} />
      )}

      {showButton && <Button onClick={loadMore} />}

      {status === 'pending' && <Loader />}

      {modalData && (
        <Modal onClose={toggleModal}>
          <img src={modalData.largeImageURL} alt={modalData.tags} />
        </Modal>
      )}
      <ToastContainer autoClose={3000} theme="colored" />
    </Container>
  );
}
