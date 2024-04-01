"use client"
import React, { useEffect,useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import logo from './logo.jpg'
import './Navbar.css'


const Navbar = () => {
  const[isAdminAuthenticated,setisAdminAuthenticated]=useState(false);

  const checkAdminAuthenticated= async() => {
    try{
      const response=await fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/admin/checkLogin',{
        method:'GET',
        headers:{
          'Content-Type':'/application/json',
        },
        credentials:"include"
      });
      if(response.ok){
        setisAdminAuthenticated(true);
      }
      else{
        setisAdminAuthenticated(false);
      }
    }
    catch(error){
      console.error(error);
      setisAdminAuthenticated(false);
    }
  }
    useEffect(()=>{
      checkAdminAuthenticated();
    },[]);
  
  return (
    <div>
      <div className='navbar'>
        <Image src={logo} alt='logo' width={100} className='logo'/>
        <div className='adminlinks'>
          {isAdminAuthenticated? (
            <>
            <Link href='/pages/addworkout'>Add Workout</Link>
            </>
          ):(
            <>
            {/* Show login/signup for unauthorised admin  */}
            <Link href='/adminauth/login'>Login</Link>
            <Link href='/adminauth/register'>Signup</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
  
}

export default Navbar
