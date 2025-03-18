import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { toast } from 'react-toastify';

const BookEdit = () => {
  const { id } = useParams();
  const [book, setBook] = useState();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const response = await axios.get(`http://localhost:3004/books/${id}`);
      setBook(response.data);
    };

    const fetchCategories = async () => {
      const response = await axios.get(`http://localhost:3004/categories`);
      setCategories(response.data);
    };

    fetchBook();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevState) => ({
      ...prevState,
      [name]:
        name === 'categoryId' || name === 'price' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3004/books/${id}`, book);
      toast.success('Updated book successfully.');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  if (!book) return <h1>Loading...</h1>;

  return (
    <>
      <h1>Book Edit</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={book.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            name="price"
            id="price"
            value={book.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="createdAt">Created At:</label>
          <input
            type="date"
            name="createdAt"
            id="createdAt"
            value={book.createdAt}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="categoryid">Category:</label>
          <select
            name="categoryId"
            id="categoryId"
            value={book.categoryId}
            onChange={handleChange}
          >
            {categories.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Update</button>
        <NavLink to="/">Back to Home</NavLink>
      </form>
    </>
  );
};

export default BookEdit;
