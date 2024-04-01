import React from 'react'
import '../popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Console, log } from 'console';
import { toast } from 'react-toastify';
interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}
const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const color = '#ffc20e'
  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time,setTime] = React.useState<any>(dayjs(new Date()))
  const[calorieIntake,setCalorieIntake]=React.useState<any>({
    item:'',
    date:'',
    quantity:'',
    quantityType:"g"
  })
  const[items,setItems]= React.useState<any>([])
  const saveCalorieIntake= async()=>{
    let tdate=date.format('YYYY-MM-DD')
    let ttime=time.format('HH:mm:ss')
    let datetime=tdate+' '+ttime
    let finaldatetime=new Date(datetime)
    console.log(finaldatetime);
    console.log(calorieIntake.item,typeof(finaldatetime),calorieIntake.quantity,typeof(calorieIntake.quantityType));

    
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/calorieintake/addcalorieintake',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body:JSON.stringify({
        item:calorieIntake.item,
        date:finaldatetime,
        quantity:(calorieIntake.quantity),
        quantityType:calorieIntake.quantityType,
      })
      
    })    
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
    
      if(data.ok){
        toast.success('Calorie intake added successfully')
        getCalorieIntake()
      }
      else{
        toast.error('Error in adding calories')
      }
    })
    .catch(err => { 
      toast.error('Error in adding calories catch')
      console.error(err)
    }
    
    )}
  const getCalorieIntake= async()=>{
    setItems([])
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/calorieintake/getcalorieintakebydate',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:"include",
      body:JSON.stringify({
        date:date
      })
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.ok){
        console.log(data.data,'calorie intake data for date')
        setItems(data.data)
      }
      else{
        toast.error('Error in getting calorie intake')
      }
    })
    .catch(err=>{
      toast.error('Error in getting calorie intake catch')
      console.log(err)
    })

  }
  const deleteCalorieIntake= async(item:any)=>{
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/calorieintake/deletecalorieintake',{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json',
      },

      credentials:'include',
      body:JSON.stringify({
        item:item.item,
        date:item.date
      })
    })
    .then(res =>res.json())
    .then(data=>{
      if(data.ok){
        toast.success('Calorie intake deleted successfully')
        getCalorieIntake()
      }
      else{
        toast.error('Error in deleting calorie intake')
      }
    })
  }
  React.useEffect(()=>{
    getCalorieIntake()
  },[date])
const selectedDay=(val:any)=>{
  setDate(val)
}
  return (
    <div className='popupout'>


      <div className='popupbox'>
        <button className='close'
          onClick={() => {
            setShowCalorieIntakePopup(false)
          }}
        >
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Choose Date"
            value={date}
            onChange={(newValue:any)=>{
              selectedDay(newValue);
            }} />
        </LocalizationProvider>
        

        <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning" 
        onChange={(e)=>{
          setCalorieIntake({...calorieIntake,item:e.target.value})
        }}/>
        <TextField id="outlined-basic" label="Food item amount (in gms)" variant="outlined" color="warning" 
        type="number"
        onChange={(e)=>{
          setCalorieIntake({...calorieIntake,quantity:e.target.value})
        }}
        />
        <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock value={time} onChange={(newValue:any) => setTime(newValue)}
            />
          </LocalizationProvider>

        </div>
        <Button variant="contained" color="warning"
        onClick={saveCalorieIntake}>
          Save
        </Button>
        <div className="hrline"></div>
        <div className="items">
          {
            items.map((item:any)=>{
              return(
                <div className="item">
                  <h3>{item.item}</h3>
                  <h3>{item.quantity} {item.quantityType}</h3>
                  <button onClick={()=>{
                    deleteCalorieIntake(item)
                  }}><AiFillDelete/></button>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default CalorieIntakePopup