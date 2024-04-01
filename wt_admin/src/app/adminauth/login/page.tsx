"use client"
import React,{useState} from 'react'
import '../auth.css'
import { ToastContainer,toast } from 'react-toastify'
const SigninPage = () => {
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const handleLogin= async()=>{
        try{
            const response=await fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/admin/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({email,password}),
                credentials:'include'
            });
            const data= await response.json();
            if(data.ok){
                
                console.log('Admin Login successful',data);
                toast.success('Admin Login successful',{
                    position:"top-center"
                });
                window.location.href ='/pages/addworkout';
            }
            else{
                console.error('Admin login failed',response.statusText);
                toast.error('Admin Login Failed',{
                    position:"top-center"
                });
            }
        }
        catch(error){
            toast.error('An error occured during Login');
            console.log('An error occured during Login',error);
            
        }
    }
  return (
    <div className="formpage">
        <input 
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
             />
        <input 
            type="password"
            placeholder='password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default SigninPage
