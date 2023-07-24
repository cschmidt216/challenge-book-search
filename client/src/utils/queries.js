import { gql } from '@apollo/client';

// Query to get the user's data and saved book data
// Used in 'SavedBooks.js' component
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;