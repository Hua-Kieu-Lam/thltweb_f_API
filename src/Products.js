import React, { Fragment, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios"

export default function Products() {

    const [data, setData] = useState([]);

    const [show, setShow] = useState(false);

    const [id, setId] = useState()
    const [name, setName] = useState('')
    const [price, setPrice] = useState()
    const [description, setDescription] = useState('')

    const [editName, setEditName] = useState('')
    const [editPrice, setEditPrice] = useState()
    const [editDescription, setEditDescription] = useState('')

    useEffect(() => {
        getData()
    }, []);

    const getData = () => {
        axios.get('https://localhost:7075/api/ProductAPI')
            .then((result) => {
                setData(result.data)
            })
            .catch((err) => {
                alert(err)
            })
    }

    const handleEdit = (id) => {
        setId(id);
        handleShow()
        axios.get(`https://localhost:7075/api/ProductAPI/${id}`)
            .then((result) => {
                setEditName(result.data.name)
                setEditPrice(result.data.price)
                setEditDescription(result.data.description)
            })
            .catch((err) => {
                alert(err)
            })
    }
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            axios.delete(`https://localhost:7075/api/ProductAPI/${id}`)
                .then((result) => {
                    alert('Product deleted successfully')
                    getData()
                })
                .catch((err) => {
                    alert(err)
                })
        }
    }


    const handleUpdate = () => {
        const url = `https://localhost:7075/api/ProductAPI/${id}`
        const data = {
            "id": id,
            "name": editName,
            "price": editPrice,
            "description": editDescription
        }
        axios.put(url, data)
            .then((result) => {
                getData()
                clear()
            })
            .catch((err) => {
                alert(err)
            })
    }
    const handleSave = () => {
        const url = "https://localhost:7075/api/ProductAPI"
        const data = {
            "name": name,
            "price": price,
            "description": description
        }
        axios.post(url, data)
            .then((result) => {
                getData()
                clear()
            })
            .catch((err) => {
                alert(err)
            })
    }
    const clear = () => {
        setName('')
        setPrice('')
        setDescription('')
        setEditName('')
        setEditPrice('')
        setEditDescription('')
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className='p-5' style={{ width: '100%' }}>
            <h1 className='text-center'>Thông tin về sách</h1>
            <Container>
                <Row className='mt-3'>
                    <Col>
                        <input type='text' className='form-control' placeholder='Nhap ten'
                            value={name} onChange={(e) => setName(e.target.value)}
                        >
                        </input>
                    </Col>
                    <Col>
                        <input type='number' className='form-control' placeholder='Nhap gia'
                            value={price} onChange={(e) => setPrice(e.target.value)}
                        ></input>
                    </Col>

                </Row>
                <Col className='mt-3'>
                    <input type='text' className='form-control' placeholder='Nhap mo ta'
                        value={description} onChange={(e) => setDescription(e.target.value)}
                    ></input>
                </Col>
                <Col className='mt-3'>
                    <button className='btn btn-primary' onClick={() => handleSave()}>Lưu thông tin</button>
                </Col>
            </Container>
            <br></br>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <Fragment key={index}>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                        <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            </Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Loading...</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type='text' className='form-control' placeholder='Nhap ten'
                                value={editName} onChange={(e) => setEditName(e.target.value)}
                            >
                            </input>
                        </Col>
                        <Col>
                            <input type='text' className='form-control' placeholder='Nhap gia'
                                value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                            ></input>
                        </Col>
                        <Col>
                            <input type='text' className='form-control' placeholder='Nhap mo ta'
                                value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                            ></input>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => { handleClose(); handleUpdate() }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}