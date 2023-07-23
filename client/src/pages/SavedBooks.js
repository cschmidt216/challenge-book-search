import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ME } from '../utils/query';
import { REMOVE_BOOK } from '../utils/mutation';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || [];

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });

      removeBookId(bookId); // Remove book's id from localStorage upon success
    } catch (err) {
      console.error(err);
    }
  };

  // Render loading message while data is being fetched
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <header className='text-light bg-dark py-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </header>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <div className='d-flex flex-wrap justify-content-center'>
          {userData.savedBooks.map((book) => (
            <Card key={book.bookId} border='dark' style={{ width: '18rem', margin: '10px' }}>
              {book.image && (
                <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
              )}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className='small'>Authors: {book.authors}</p>
                <Card.Text>{book.description}</Card.Text>
                <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
};

export default SavedBooks;