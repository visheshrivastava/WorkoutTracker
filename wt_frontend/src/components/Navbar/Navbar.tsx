"use client"
import React from 'react'
import logo from '@/assets/logo.jpg'
import { IoIosBody } from 'react-icons/io'
import './Navbar.css'
import Image from 'next/image'
import Link from 'next/link'
import AuthPopup from '../AuthPopup/AuthPopup'
import { cookies } from 'next/headers'

const Navbar = () => {
    const [isloggedin, setIsloggedin] = React.useState<boolean>(false)
    const [showpopup, setShowpopup] = React.useState<boolean>(false)

    const checklogin = async () => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/checklogin', {
            method: 'POST',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setIsloggedin(data.ok)
        })
        .catch(err => {
            console.log(err)
        })
    }

    React.useEffect(() => {
        checklogin()
    }, [showpopup])

    const handleLogout = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/logout', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                setIsloggedin(false);
                setShowpopup(false); // Close the popup if it's open
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <nav>
            <Image src={logo} alt="Logo" />
            <Link href='/'>Home</Link>
            {isloggedin ?
                <button onClick={(e)=>{
                    window.location.href='/'
                }}>Logout</button> :
                <button onClick={() => setShowpopup(true)}>Login</button>
            }
            {showpopup && <AuthPopup setShowpopup={setShowpopup} />}
        </nav>
    )
}

export default Navbar
