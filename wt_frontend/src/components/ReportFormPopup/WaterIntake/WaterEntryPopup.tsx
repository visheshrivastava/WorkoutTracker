import React from 'react';
import '../popup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';

interface WaterIntakePopupProps {
  setShowWaterIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WaterEntryPopup: React.FC<WaterIntakePopupProps> = ({ setShowWaterIntakePopup }) => {
  const [date, setDate] = React.useState<any>(dayjs(new Date()));
  const [time,setTime] = React.useState<any>(dayjs(new Date()))
  const [amountInMilliliters, setamountInMilliliters] = React.useState<any>({
    date:'',
    amountInMilliliters:''
  });

  const saveWaterIntake = async () => {
    let tdate=date.format('YYYY-MM-DD')
    let ttime=time.format('HH:mm:ss')
    let datetime=tdate+' '+ttime
    let finaldatetime=new Date(datetime) 
    console.log(amountInMilliliters);
         
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/watertrack/addwaterentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: finaldatetime,
        amountInMilliliters: amountInMilliliters,
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        toast.success('Water intake added successfully');
        getWaterEntry()
      } else {
        toast.error('Error in adding water intake: ' + data.error);
      }
    })
    .catch(err => {
      toast.error('Error in adding water intake: ' + err.message);
      console.error(err);
    });
  }
  const getWaterEntry= async()=>{
    setamountInMilliliters([])
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/watertrack/getwaterbydate',{
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
        console.log(data.data,'water intake for date')
        setamountInMilliliters(data.data)
      }
      else{
        toast.error('Error in getting water intake data')
      }
    })
    .catch(err=>{
      toast.error('Error in getting water intake data catch')
      console.log(err)
    })
  }
  const deleteWater= async(item:any)=>{
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/watertrack/deletewaterentry',{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json',
      },

      credentials:'include',
      body:JSON.stringify({
        date:item.date,
      })
    })
    .then(res =>res.json())
    .then(data=>{
      if(data.ok){
        toast.success('water entry deleted successfully')
        getWaterEntry()
      }
      else{
        toast.error('Error in deleting water entry')
      }
    })
  }


  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button className='close'
          onClick={() => {
            setShowWaterIntakePopup(false);
          }}
        >
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Choose Date"
            value={date}
            onChange={(newValue: any) => {
              setDate(newValue);
            }}
          />
        </LocalizationProvider>
        <TextField
          id="outlined-basic"
          label="Amount of Water Intake (in ml)"
          variant="outlined"
          color="warning"
          type="number"
          value={amountInMilliliters}
          onChange={(e) => setamountInMilliliters(parseInt(e.target.value))}
        />
        <Button variant="contained" color="warning" onClick={saveWaterIntake}>
          Save
        </Button>
        <div className="hrline"></div>
        {
          amountInMilliliters.length>0 &&  (<div className="items">
          {
             amountInMilliliters.map((item:any)=>{
              return(
                <div className="item">
                  <h3>{item.amountInMilliliters}ML</h3>
                  <button onClick={()=>{
                    deleteWater(item)
                  }}><AiFillDelete/></button>
                </div>
              )
            })
          }
        </div>
        )}
      </div>
    </div>
  );
}
export default WaterEntryPopup;