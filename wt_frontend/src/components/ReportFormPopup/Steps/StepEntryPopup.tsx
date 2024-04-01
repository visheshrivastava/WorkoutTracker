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

interface StepEntryPopupProps {
  setShowStepEntryPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepEntryPopup: React.FC<StepEntryPopupProps> = ({ setShowStepEntryPopup }) => {
  const [date, setDate] = React.useState<any>(dayjs(new Date()));
  const [time,setTime] = React.useState<any>(dayjs(new Date()))
  const [steps, setSteps] = React.useState<any>({
    date:'',
    steps:''
  });

  const saveStepEntry = async () => {
    let tdate=date.format('YYYY-MM-DD')
    let ttime=time.format('HH:mm:ss')
    let datetime=tdate+' '+ttime
    let finaldatetime=new Date(datetime)
    
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/addstepentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: finaldatetime,
        steps: steps,
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        toast.success('Step entry added successfully');
        getStepEntry()
      } else {
        toast.error('Error in adding step entry: ' + data.error);
      }
    })
    .catch(err => {
      toast.error('Error in adding step entry: ' + err.message);
      console.error(err);
    });
  }
  const getStepEntry= async()=>{
    setSteps([])
    fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/steptrack/getstepsbydate',{
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
        console.log(data.data,'step data for date')
        setSteps(data.data)
      }
      else{
        toast.error('Error in getting step data')
      }
    })
    .catch(err=>{
      toast.error('Error in getting step datacatch')
      console.log(err)
    })
  }
    const deleteStepEntry= async(item:any)=>{
        fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/steptrack/deletestepentry',{
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
            toast.success('step entry deleted successfully')
            getStepEntry()
          }
          else{
            toast.error('Error in deleting step entry')
          }
        })
      }
  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button className='close'
          onClick={() => {
            setShowStepEntryPopup(false);
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
          label="Number of Steps Taken"
          variant="outlined"
          color="warning"
          type="number"
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value))}
        />
        <Button variant="contained" color="warning" onClick={saveStepEntry}>
          Save
        </Button>
        <div className="hrline"></div>
        {
          steps.length>0 &&  (<div className="items">
          {
             steps.map((item:any)=>{
              return(
                <div className="item">
                  <h3>{item.steps} </h3>
                  <button onClick={()=>{
                    deleteStepEntry(item)
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

export default StepEntryPopup;
