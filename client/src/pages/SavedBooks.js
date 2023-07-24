import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

const SavedBooks = () => {
  // Fetch user data and manage state with useQuery
  const { loading, data } = useQuery(GET_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  // Function to delete a book from the database and localStorage
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await removeBook({ variables: { bookId } });
      console.log('Deleted record: ', response);
      
      if (error) {
        console.log(error);
      }

      // Remove the book from LocalStorage
      removeBookId(bookId);
    } catch (err) {
      // Display any caught errors here
      console.error(err);
    }
  };

  // Show a loading message if data isn't available yet
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='jumbotron text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} xs={12} sm={6} md={4} lg={3}>
                <Card border='dark' className='mb-4'>
                  {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;