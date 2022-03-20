import styles from "../styles/Layout.module.css";

import { Nav, Navbar, NavDropdown, Container, Button } from 'react-bootstrap'

function Footer() {
    return (
        <Navbar className={styles.footer}
            variant="light"
            expand="lg"
            fixed='bottom'
            style={{ backgroundColor: 'rgb(200, 200, 200)' }}>
            <Container>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav style={{ "margin": "auto" }}>
                        <Nav.Link className={styles.footer_link} href="https://fission.io">Fission framework</Nav.Link>
                        <Nav.Link className={styles.footer_link} href="https://github.com/andrmantz/ServerlessFileSharingApp"
                            rel='noopener noreferrer' target='_blank'>
                            Github Repo
                        </Nav.Link>
                        <Nav.Link className={styles.footer_link} href="https://helios.ntua.gr/enrol/index.php?id=955"
                            rel='noopener noreferrer' target='_blank'>
                            Course Materials
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Footer;