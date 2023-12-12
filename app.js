// client/src/App.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';

function App() {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoggedIn(!!token);
        if (token) {
            fetchExpenses();
        }
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:3001/expenses', {
                headers: { Authorization: localStorage.getItem('token') },
            });
            setExpenses(response.data);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        }
    };

    const addExpense = async () => {
        try {
            await axios.post(
                'http://localhost:3001/expenses',
                { description, amount },
                { headers: { Authorization: localStorage.getItem('token') } }
            );
            fetchExpenses();
            setDescription('');
            setAmount('');
        } catch (error) {
            console.error('Failed to add expense:', error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/expenses/${id}`, {
                headers: { Authorization: localStorage.getItem('token') },
            });
            fetchExpenses();
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/login', {
                username,
                password,
            });

            const token = response.headers.authorization;
            localStorage.setItem('token', token);

            setLoggedIn(true);
            fetchExpenses();
        } catch (error) {
            setErrorMessage('Invalid username or password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setExpenses([]);
    };

    return (
        <Container className="mt-3">
            <h2>Expense Tracker</h2>
            {loggedIn ? (
                <div>
                    <Button variant="danger" onClick={handleLogout} className="mb-3">
                        Logout
                    </Button>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={addExpense}>
                            Add Expense
                        </Button>
                    </Form>
                    <ListGroup className="mt-3">
                        {expenses.map((expense) => (
                            <ListGroup.Item key={expense._id}>
                                {expense.description} - ${expense.amount}
                                <Button
                                    variant="danger"
                                    className="ms-2"
                                    onClick={() => deleteExpense(expense._id)}
                                >
                                    Delete
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            ) : (
                <div>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleLogin}>
                            Login
                        </Button>
                    </Form>
                    {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
                </div>
            )}
        </Container>
    );
}

export default App;
