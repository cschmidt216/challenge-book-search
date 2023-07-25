import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import Navbar from '../components/Navbar';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook] = useMutation(SAVE_BOOK);

  useEffect(() => {
    saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return;
    }

    try {
      await saveBook({
        variables: { newBook: { ...bookToSave } },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className='text-light bg-dark'>
        <div className='container'>
          <h1>Search for Books!</h1>
          <form onSubmit={handleFormSubmit}>
            <div className='form-row'>
              <div className='col-12 col-md-8'>
                <input
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  className='form-control form-control-lg'
                  placeholder='Search for a book'
                />
              </div>
              <div className='col-12 col-md-4'>
                <button type='submit' className='btn btn-success btn-lg btn-block'>
                  Submit Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className='container'>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <div className='row'>
          {searchedBooks.map((book) => (
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
                  {Auth.loggedIn() && (
                    <button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn btn-info btn-block'
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchBooks;