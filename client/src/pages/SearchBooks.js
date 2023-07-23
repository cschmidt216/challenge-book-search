import React, { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card } from 'react-bootstrap';
import { useMutation } from '@apollo/react-hooks';
import { SAVE_BOOK } from '../utils/mutation';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [saveBook] = useMutation(SAVE_BOOK);

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

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
      return false;
    }
  
    try {
      await saveBook({
        variables: { input: bookToSave },
      });
  
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };
  
  const renderSaveButton = (book) => {
    if (Auth.loggedIn()) {
      const isBookSaved = savedBookIds?.some((savedBookId) => savedBookId === book.bookId);

      return (
        <Button
          disabled={isBookSaved}
          className='btn-block btn-info'
          onClick={() => handleSaveBook(book.bookId)}
        >
          {isBookSaved ? 'This book has already been saved!' : 'Save this Book!'}
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <header className='text-light bg-dark py-5'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </header>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <div className='d-flex flex-wrap justify-content-center'>
          {searchedBooks.map((book) => (
            <Card key={book.bookId} border='dark' style={{ width: '18rem', margin: '10px' }}>
              {book.image && (
                <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
              )}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className='small'>Authors: {book.authors}</p>
                <Card.Text>{book.description}</Card.Text>
                {renderSaveButton(book)}
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
};

export default SearchBooks;