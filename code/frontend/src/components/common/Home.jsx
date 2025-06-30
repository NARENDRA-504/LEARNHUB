import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Button, Navbar } from 'react-bootstrap';
import AllCourses from './AllCourses';

const Home = () => {
   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary premium-navbar">
            <Container fluid>
               <Navbar.Brand style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                 <span className="brand-premium"><span className="brand-premium-L">L</span>earnhub</span>
                 <span className="brand-quote-premium">your center for skill enhancement</span>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="ms-auto premium-nav-links">
                     <Link className="premium-btn" to={'/'}>Home</Link>
                     <Link className="premium-btn" to={'/login'}>Login</Link>
                     <Link className="premium-btn" to={'/register'}>Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <div id='home-container' className='first-container'>
            <div className="content-home">
               <p>Small App, Big Dreams: <br /> Elevating Your Education</p>
               <Link to={'/register'}><Button variant='warning' className='m-2' size='md'>Explore Courses</Button></Link>
            </div>
         </div>

         <Container className="second-container">
            <h2 className="text-center my-4">Trending Courses</h2>
            <AllCourses />
         </Container>
      </>
   )
}

export default Home


