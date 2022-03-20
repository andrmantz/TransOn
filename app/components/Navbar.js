import React, { useState, useEffect } from 'react';
import { whoAmI, delete_account } from './api';
import { Modal } from 'react-bootstrap';
import { Nav, Navbar, NavDropdown, Container, Button } from 'react-bootstrap'
import styles from '../styles/Layout.module.css'

function NavBar() {

    const [userId, setUserId] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const response = whoAmI();
        if (response) {
            const { userId, userName } = response;
            setUserId(userId);
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = process.env.basepath;
    }

    const del_acc = () => {
        delete_account()
            .then(() => logout())
            .catch()
    }


    return (
        <>
            <Navbar
                variant="light"
                expand="lg"
                sticky='top'
                style={{ backgroundColor: 'rgb(200, 200, 200)' }}>
                <Navbar.Brand style={{ "padding": "0px 10px", "fontSize": "25px" }} href={process.env.basepath} >TransOn</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav>
                        {userId &&
                            <>
                                <Nav.Link className={styles.navbar_link} href="#" style={{ "color": "crimson" }} onClick={handleShow}>Delete Account</Nav.Link>
                                <Nav.Link className={styles.navbar_link} href="#" onClick={logout}>Logout</Nav.Link>
                            </>
                        }
                        {!userId &&
                            <>
                                <Nav.Link className={styles.navbar_link} href={process.env.basepath + "/register"}>Register</Nav.Link>
                                <Nav.Link className={styles.navbar_link} href={process.env.basepath + "/login"}>Login</Nav.Link>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Modal show={show} onHide={handleClose}>

                <Modal.Body>You are about to delete your account permamently. Do you want to proceed?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" style={{ "background-color": "crimson" }} onClick={del_acc}>
                        Yes
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default NavBar;
