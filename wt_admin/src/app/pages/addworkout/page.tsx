"use client"
import React from 'react'
import './addworkout.css'
import { toast } from 'react-toastify'
import { Astloch } from 'next/font/google';

interface Workout{
    name:string;
    description:string;
    durationInMinutes:number,
    exercises:Exercise[];
}

interface Exercise{
    name:string;
    description:string;
    sets:number;
    reps:number;
}


const page = () => {

    const[workout,setWorkout]=React.useState<Workout>({
        name: '',
        description:'',
        durationInMinutes: 0,
        exercises:[],
    });

    const[exercise,setExercise]= React.useState<Exercise>({
        name:'',
        description:'',
        sets:0,
        reps:0,
    })

    const handleWorkoutChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setWorkout({
            ...workout,
            [e.target.name]:e.target.value
        })
    }
    const handleExerciseChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setExercise({
            ...exercise,
            [e.target.name]:e.target.value
        })
    }

    const addExerciseToWorkout=()=>{
        console.log(exercise);
        if(exercise.name=='' || exercise.description=='' || exercise.sets==0 || exercise.reps==0){
            toast.error('Please Fill all the fields',{
                position:"top-center"
            });
            return;
        }
        setWorkout({
            ...workout,
            exercises:[...workout.exercises,exercise]
        })
        // setExercise({
        //     name:'',
        //     description:'',
        //     sets:0,
        //     reps:0,
        // })

        
    }
    const deleteExerciseFromWorkout=(index:number)=>{
        setWorkout({
            ...workout,
            exercises:workout.exercises.filter((exercise,i)=>i!=index)
        })
    }
    const checkLogin=async()=>{
        const response= await fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/admin/checklogin',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
            credentials:"include"
        });
        if(response.ok){
            console.log("Admin is authenticated");
        }
        else{
            console.log("Admin is not authenticated");
            window.location.href='/adminauth/login'
            
        }
    }
    const saveWorkout=async()=>{
        await checkLogin();
        console.log(workout);
        if(workout.name=='' || workout.description=='' || workout.durationInMinutes==0){
            toast.error('Please fill all the fields',{
                position:"top-center"
            });
            return;
        }
        const response=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(workout),
            credentials:"include"
        });
        if(response.ok){
            const data=await response.json();
            console.log('Workout Created successfully',data);
            toast.success('Workout created successfully',{
                position:"top-center"
            });
        }
        else{
            console.error('Workout creation failed',response.statusText);
            toast.error('Workout creation failed',{
                position:"top-center"
            })
        }
        
    }
  return (
    <div className="formpage">
        <h1 className='title' >Add Workout</h1>
        <input 
            type="text"
            placeholder='Workout Name'
            name='name'
            value={workout.name}
            onChange={handleWorkoutChange}
        />
        <textarea 
            placeholder='Workout Description'
            name="description" cols={50} rows={5}
            value={workout.description}
            onChange={(e)=>{
                setWorkout({
                    ...workout,
                    description:e.target.value
                })
            }}
            />
        <label htmlFor="durationInMinutes">Duration In Minutes</label>
        <input 
            type="number"
            placeholder='Workout Duration'
            name='durationInMinutes'
            value={workout.durationInMinutes}
            onChange={handleWorkoutChange}
            />
         <div
            style={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center'
            }
            }
            >
            <h2 className='title'> Add Exercise to Workout</h2>
            <input 
                type="text" 
                placeholder='Exercise Name'
                name='name'
                value={exercise.name}
                onChange={handleExerciseChange}
                />
            <textarea
                placeholder='Exercise Description'
                name='description'
                value={exercise.description}
                onChange={(e)=>{
                    setExercise({
                        ...exercise,
                        description:e.target.value
                    })
                }}
                cols={50} rows={5}>
            </textarea>
            <label htmlFor="sets">Sets</label>
            <input 
                type="number"
                placeholder='Sets'
                name='sets'
                value={exercise.sets}
                onChange={handleExerciseChange}
                />
            <label htmlFor="reps">Reps</label>
            <input 
                type="number"
                placeholder='Reps'
                name='reps'
                value={exercise.reps}
                onChange={handleExerciseChange}
                />
                <button onClick={(e)=>{
                    addExerciseToWorkout(e)
                }}>Add Exercise</button>
         </div>
         <div className="exercises">
                {
                    workout.exercises.map((exercise,index)=>(
                        <div className="exercise" key={index}>
                            <h2>{exercise.name}</h2>
                            <p>{exercise.description}</p>
                            <p>{exercise.sets}</p>
                            <p>{exercise.reps}</p>
                            <button onClick={()=>deleteExerciseFromWorkout(index)}>Delete</button>
                        </div>
                    ))
                }

         </div>
         <button onClick={(e)=>{
            saveWorkout(e)
         }}>Add Workout</button>
    </div>
  )
  
}

export default page
