import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState();

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const response = await axios.get(
        `http://localhost:3004/books/${id}?_expand=category`
      );
      setBook(response.data);
    };

    fetchBook();
  }, [id]);

  if (!book) return <h1>Loading...</h1>;

  return (
    <div className="container">
      <div className="card my-2">
        <div className="card-header">
          <h1>{book.name}</h1>
        </div>
        <div className="card-body">
          <ul>
            <li>ID: {book.id}</li>
            <li>Price: {book.price}</li>
            <li>Category: {book.category.name}</li>
            <li>Created at: {book.createdAt}</li>
          </ul>
          <NavLink to={'/'}>Back to Home</NavLink>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
