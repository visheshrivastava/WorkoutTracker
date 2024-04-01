"use client"
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import './ReportPage.css'
import { AiFillEdit } from 'react-icons/ai'
import CaloriIntakePopup from '@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup';
import SleepEntryPopup from '@/components/ReportFormPopup/Sleep/SleepEntryPopup';
import StepEntryPopup from '@/components/ReportFormPopup/Steps/StepEntryPopup';
import WaterEntryPopup from '@/components/ReportFormPopup/WaterIntake/WaterEntryPopup';
import { usePathname } from 'next/navigation';
const page = () => {
    const pathname=usePathname();
    console.log(pathname);
    
    const [showCalorieIntakePopup, setShowCalorieIntakePopup] = React.useState<boolean>(false)
    const [showSleepEntryPopup, setShowSleepEntryPopup] = React.useState<boolean>(false);
    const [showStepEntryPopup,setShowStepEntryPopup]=React.useState<boolean>(false);
    const [showWaterEntryPopup,setShowWaterEntryPopup]=React.useState<boolean>(false);
    return (
        <div>
            <button className='editbutton'
                onClick={() => {
                    if(pathname=='/report/Calorie%20Intake'){
                        setShowCalorieIntakePopup(true)
                    }
                    else if(pathname=='/report/Sleep'){
                        setShowSleepEntryPopup(true)
                    }
                    else if(pathname == '/report/Steps'){
                        setShowStepEntryPopup(true)
                    }
                    else if(pathname == '/report/Water'){
                        setShowWaterEntryPopup(true)
                    }
                }}
            >
                <AiFillEdit />
            </button>
            {showSleepEntryPopup && <SleepEntryPopup setShowSleepEntryPopup={setShowSleepEntryPopup} />}
            {showCalorieIntakePopup &&<CaloriIntakePopup setShowCalorieIntakePopup={setShowCalorieIntakePopup} />}
            {showStepEntryPopup && <StepEntryPopup setShowStepEntryPopup={setShowStepEntryPopup}/>}
            {showWaterEntryPopup && <WaterEntryPopup setShowWaterIntakePopup={setShowWaterEntryPopup}/>}
        /</div>
    )
}

export default page