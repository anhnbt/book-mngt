import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
  });
  const navigate = useNavigate();

  // component được mount vào DOM
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get(
        'http://localhost:3004/books?_expand=category&_sort=price&_order=desc'
      );
      setBooks(response.data);
    };

    const fetchCategories = async () => {
      const response = await axios.get('http://localhost:3004/categories');
      setCategories(response.data);
    };

    fetchBooks();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fetchBooks = async () => {
      // template literals: ``
      const response = await axios.get(
        `http://localhost:3004/books?_expand=category&_sort=price&_order=desc&name_like=${
          form.name
        }${form.category && `&categoryId=${form.category}`}`
      );
      setBooks(response.data);
    };
    fetchBooks();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formatted = dd + '/' + mm + '/' + yyyy;
    return formatted;
  };

  const handleEdit = () => {};

  const handleView = (id) => {
    navigate(`/books/${id}`);
  };

  const handleDelete = async ({ name, id }) => {
    if (window.confirm(`Bạn có muốn xóa sách ${name} không?`)) {
      // await axios.delete(`http://localhost:3004/books/${id}`);
      alert('Xóa thành công!');
      setBooks((prevState) => prevState.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="container">
      <h1>Book List</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              type="search"
              name="name"
              id="name"
              placeholder="Enter book name..."
              value={form.name}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Select
                defaultValue="Choose..."
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value={''}>Choose category...</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col className="d-flex gap-2">
            <Button type="submit" variant="primary">
              Search
            </Button>
            <Button variant="primary" onClick={() => navigate('/books/create')}>
              Add new Book
            </Button>
          </Col>
        </Row>
      </Form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td className="text-center" colSpan={5}>
                No data
              </td>
            </tr>
          ) : (
            books.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  {item.price.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </td>
                <td>{item.category.name}</td>
                <td>{formatDate(item.createdAt)}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => handleView(item.id)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
