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

interface SleepEntryPopupProps {
  setShowSleepEntryPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SleepEntryPopup: React.FC<SleepEntryPopupProps> = ({ setShowSleepEntryPopup }) => {
  const [date, setDate] = React.useState<any>(dayjs(new Date()));
  const [time,setTime] = React.useState<any>(dayjs(new Date()))
  const[durationInHrs,setDurationInHrs]=React.useState<any>(
    {
      date:'',
    durationInHrs:''
    }
  )

  const saveSleepEntry = async () => {
    let tdate=date.format('YYYY-MM-DD')
    let ttime=time.format('HH:mm:ss')
    let datetime=tdate+' '+ttime
    let finaldatetime=new Date(datetime)        
    
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/addsleepentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: finaldatetime,
        durationInHrs: durationInHrs,
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        toast.success('Sleep entry added successfully');
        getSleepEntry()
      } else {
        toast.error('Error in adding sleep entry: ' + data.error);
      }
    })
    .catch(err => {
      toast.error('Error in adding sleep entry: ' + err.message);
      console.error(err);
    });
  }
  const getSleepEntry= async()=>{
    setDurationInHrs([])
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/sleeptrack/getsleepbydate',{
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
        console.log(data.data,'sleep data for date')
        setDurationInHrs(data.data)
      }
      else{
        toast.error('Error in getting sleep data')
      }
    })
    .catch(err=>{
      toast.error('Error in getting sleep data catch')
      console.log(err)
    })

  }
  const deleteSleep= async(item:any)=>{
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/sleeptrack/deletesleepentry',{
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
        toast.success('sleep entry deleted successfully')
        getSleepEntry()
      }
      else{
        toast.error('Error in deleting sleep entry')
      }
    })
  }

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button className='close'
          onClick={() => {
            setShowSleepEntryPopup(false);
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
          label="Duration of Sleep (in hours)"
          variant="outlined"
          color="warning"
          type="number"
          value={durationInHrs}
          onChange={(e) => setDurationInHrs(parseFloat(e.target.value))}
        />
        <Button variant="contained" color="warning" onClick={saveSleepEntry}>
          Save
        </Button>
        <div className="hrline"></div>
        {
          durationInHrs.length>0 &&  (<div className="items">
          {
             durationInHrs.map((item:any)=>{
              return(
                <div className="item">
                  <h3>{item.durationInHrs} hrs </h3>
                  <button onClick={()=>{
                    deleteSleep(item)
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

export default SleepEntryPopup;