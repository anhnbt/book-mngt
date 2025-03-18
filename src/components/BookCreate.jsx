import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { toast } from 'react-toastify';

const BookCreate = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    createdAt: undefined,
    categoryId: undefined,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(`http://localhost:3004/categories`);
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]:
        name === 'categoryId' || name === 'price' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3004/books`, form);
      console.log(response.data);
      toast.success('Create book successfully.');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="container my-3">
      <div className="card">
        <div className="card-header">
          <h1>Book Create</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-1">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                name="price"
                id="price"
                value={form.price}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-1">
              <label htmlFor="createdAt">Created at</label>
              <input
                type="date"
                name="createdAt"
                id="createdAt"
                value={form.createdAt}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-1">
              <label htmlFor="categoryId">Category</label>
              <select
                className="form-control"
                name="categoryId"
                id="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option>Choose category...</option>
                {categories.map((item) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <Button className="me-2" variant="primary" type="submit">
              Create
            </Button>
            <NavLink to="/">Back to Home</NavLink>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookCreate;
