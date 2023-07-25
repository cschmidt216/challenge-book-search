import React from 'react';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Navbar from '../components/Navbar';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const { data } = await removeBook({
        variables: { bookId },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Navbar />
      <div className='text-light bg-dark'>
        <div className='container'>
          <h1>Viewing saved books!</h1>
        </div>
      </div>
      <div className='container'>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <div className='row'>
          {userData.savedBooks.map((book) => (
            <div className='col-md-4' key={book.bookId}>
              <div className='card mb-4'>
                {book.image && (
                  <img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    className='card-img-top'
                  />
                )}
                <div className='card-body'>
                  <h5 className='card-title'>{book.title}</h5>
                  <p className='card-text'>Authors: {book.authors}</p>
                  <p className='card-text'>{book.description}</p>
                  <button
                    className='btn btn-danger btn-block'
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SavedBooks;