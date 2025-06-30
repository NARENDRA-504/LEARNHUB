import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import {
   MDBCol,
   MDBInput,
   MDBRow,
} from "mdb-react-ui-kit";

const AllCourses = () => {
   const navigate = useNavigate()
   const user = useContext(UserContext)
   const [allCourses, setAllCourses] = useState([]);
   const [filterTitle, setFilterTitle] = useState('');
   const [filterType, setFilterType] = useState('');

   const [showModal, setShowModal] = useState(Array(allCourses.length).fill(false));
   const [cardDetails, setCardDetails] = useState({
      cardholdername: '',
      cardnumber: '',
      cvvcode: '',
      expmonthyear: '',
   })

   const handleChange = (e) => {
      setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })
   }


   const handleShow = (courseIndex, coursePrice, courseId, courseTitle) => {
      if (coursePrice == 'free') {
         handleSubmit(courseId)
         return navigate(`/courseSection/${courseId}/${courseTitle}`)
      } else {

         const updatedShowModal = [...showModal];
         updatedShowModal[courseIndex] = true;
         setShowModal(updatedShowModal);
      }
   };

   // Function to handle closing the modal for a specific course
   const handleClose = (courseIndex) => {
      const updatedShowModal = [...showModal];
      updatedShowModal[courseIndex] = false;
      setShowModal(updatedShowModal);
   };

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcourses`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
   }, []);

   const isPaidCourse = (course) => {
      // Check if C_price contains a number
      return /\d/.test(course.C_price);
   };

   const handleSubmit = async (courseId) => {
      try {
         const res = await axiosInstance.post(`api/user/enrolledcourse/${courseId}`, cardDetails, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message);
            navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
         } else {
            alert(res.data.message);
            navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }

   return (
      <>
         <div className=" mt-4 filter-container text-center">
            <p className="mt-3">Serach By: </p>
            <input
               type="text"
               placeholder="title"
               value={filterTitle}
               onChange={(e) => setFilterTitle(e.target.value)}
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
               <option value="">All Courses</option>
               <option value="Paid">Paid</option>
               <option value="Free">Free</option>
            </select>
         </div>
         <div className='p-2 course-container'>
            {allCourses?.length > 0 ? (
               allCourses
                  .filter(
                     (course) =>
                        filterTitle === '' ||
                        course.C_title?.toLowerCase().includes(filterTitle?.toLowerCase())
                  )
                  .filter((course) => {
                     if (filterType === 'Free') {
                        return !isPaidCourse(course);
                     } else if (filterType === 'Paid') {
                        return isPaidCourse(course);
                     } else {
                        return true;
                     }
                  })
                  .map((course, index) => (
                     <div
                        key={course._id}
                        className="course futuristic-card"
                        style={{ width: '370px', margin: '22px', borderRadius: '22px', background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)', boxShadow: '0 0 32px #00e0ff55, 0 2px 12px #1e90ff22', padding: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', minHeight: '180px', minWidth: '270px' }}
                        onMouseEnter={e => {
                          e.currentTarget.querySelector('.futuristic-card-front').style.opacity = '0';
                          e.currentTarget.querySelector('.futuristic-card-front').style.filter = 'blur(2.5px) brightness(1.1)';
                          e.currentTarget.querySelector('.futuristic-card-front').style.pointerEvents = 'none';
                          e.currentTarget.querySelector('.futuristic-card-back').style.opacity = '1';
                          e.currentTarget.querySelector('.futuristic-card-back').style.filter = 'none';
                          e.currentTarget.querySelector('.futuristic-card-back').style.pointerEvents = 'auto';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.querySelector('.futuristic-card-front').style.opacity = '1';
                          e.currentTarget.querySelector('.futuristic-card-front').style.filter = 'none';
                          e.currentTarget.querySelector('.futuristic-card-front').style.pointerEvents = 'auto';
                          e.currentTarget.querySelector('.futuristic-card-back').style.opacity = '0';
                          e.currentTarget.querySelector('.futuristic-card-back').style.filter = 'none';
                          e.currentTarget.querySelector('.futuristic-card-back').style.pointerEvents = 'none';
                        }}
                     >
                        {/* Front side: Only course name */}
                        <div
                          className="futuristic-card-front"
                          style={{
                            width: '100%',
                            height: '180px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
                            borderRadius: '22px',
                            zIndex: 2,
                            position: 'relative',
                            transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1), filter 0.5s cubic-bezier(.4,0,.2,1)',
                            opacity: 1,
                            pointerEvents: 'auto',
                          }}
                        >
                          <h2 style={{ color: 'rgba(0,255,255,0.92)', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '1.5px', textShadow: '0 2px 16px #00e0ff88', margin: 0, padding: 0, textAlign: 'center' }}>{course.C_title}</h2>
                        </div>
                        {/* Back side: Details, shown on hover */}
                        <div
                          className="futuristic-card-back"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                            borderRadius: '22px',
                            zIndex: 3,
                            opacity: 0,
                            pointerEvents: 'none',
                            transition: 'opacity 0.6s cubic-bezier(.4,0,.2,1), filter 0.6s cubic-bezier(.4,0,.2,1)',
                            filter: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '38px 22px 22px 22px',
                          }}
                        >
                          <div style={{ color: '#b3e0ff', fontSize: 13, marginBottom: 6, fontWeight: 500 }}>{course.C_categories}</div>
                          <div style={{ color: '#7fffd4', fontSize: 12, marginBottom: 10 }}>by: <span style={{ fontWeight: 600 }}>{course.C_educator}</span></div>
                          <div style={{ color: '#00e0ff', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Price: <span style={{ color: '#fff', fontWeight: 500 }}>{course.C_price}</span></div>
                          <div style={{ color: '#00e0ff', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Enrolled: <span style={{ color: '#fff', fontWeight: 500 }}>{course.enrolled}</span></div>
                          {user.userLoggedIn === true ?
                            <>
                              <Button
                                className="mt-2"
                                variant='outline-info'
                                size='sm'
                                style={{ fontWeight: 700, borderRadius: 10, marginTop: 12, borderWidth: 2, borderColor: '#00e0ff', color: '#00e0ff', boxShadow: '0 0 12px #00e0ff55', background: 'rgba(0,255,255,0.08)', letterSpacing: '1px' }}
                                onClick={() => handleShow(index, course.C_price, course._id, course.C_title)}
                              >
                                Enroll Now
                              </Button>
                              <Modal show={showModal[index]} onHide={() => handleClose(index)}>
                                <Modal.Header closeButton>
                                  <Modal.Title>
                                    Payment for {course.C_title} Course
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <p style={{ fontSize: 15 }}>Educator: {course.C_educator}</p>
                                  <p style={{ fontSize: 15 }}>Price: {course.C_price}</p>
                                  <Form onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSubmit(course._id)
                                  }}>
                                    <MDBInput className='mb-2' label="Card Holder Name" name='cardholdername' value={cardDetails.cardholdername} onChange={handleChange} type="text" size="md"
                                      placeholder="Cardholder's Name" contrast required />
                                    <MDBInput className='mb-2' name='cardnumber' value={cardDetails.cardnumber} onChange={handleChange} label="Card Number" type="number" size="md"
                                      minLength="0" maxLength="16" placeholder="1234 5678 9012 3457" required />
                                    <MDBRow className="mb-4">
                                      <MDBCol md="6">
                                        <MDBInput name='expmonthyear' value={cardDetails.expmonthyear} onChange={handleChange} className="mb-2" label="Expiration" type="text" size="md"
                                          placeholder="MM/YYYY" required />
                                      </MDBCol>
                                      <MDBCol md="6">
                                        <MDBInput name='cvvcode' value={cardDetails.cvvcode} onChange={handleChange} className="mb-2" label="Cvv" type="number" size="md" minLength="3"
                                          maxLength="3" placeholder="●●●" required />
                                      </MDBCol>
                                    </MDBRow>
                                    <div className="d-flex justify-content-end">
                                      <Button className='mx-2' variant="secondary" onClick={() => handleClose(index)}>
                                        Close
                                      </Button>
                                      <Button variant="primary" type='submit'>
                                        Pay Now
                                      </Button>
                                    </div>
                                  </Form>
                                </Modal.Body>
                              </Modal>
                            </>
                            : <Link to={'/login'}><Button
                              className="mt-2"
                              variant='outline-info'
                              size='sm'
                              style={{ fontWeight: 700, borderRadius: 10, marginTop: 12, borderWidth: 2, borderColor: '#00e0ff', color: '#00e0ff', boxShadow: '0 0 12px #00e0ff55', background: 'rgba(0,255,255,0.08)', letterSpacing: '1px' }}
                            >
                              Enroll Now
                            </Button></Link>}
                        </div>
                        {/* Futuristic glowing border effect */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '22px',
                          pointerEvents: 'none',
                          zIndex: 1,
                          boxShadow: '0 0 0 2px #00e0ff55, 0 0 32px 8px #00e0ff22',
                          border: '2px solid transparent',
                          background: 'linear-gradient(120deg,rgba(0,224,255,0.13),rgba(44,83,100,0.13))',
                          opacity: 0.7,
                          transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1)'
                        }} />
                     </div>
                  ))
            ) : (
               <p>No courses at the moment</p>
            )}
         </div>
      </>
   );
};

export default AllCourses;
