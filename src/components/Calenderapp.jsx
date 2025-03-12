import React, { useEffect } from 'react'
import { useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
const storeevent = localStorage.getItem("storeeventtask");
const Calenderapp = () => {
    const [selectdate,setselectdate] = useState('');
   const [showeventpopup,setshoweventpop] = useState(false);
   
   const [events,setevents] = useState(JSON.parse(storeevent)||[]);
   const [eventText,seteventtext] = useState('');
   const [eventHour, setEventHour] = useState('');
   const [eventMinutes, setEventMinutes] = useState('');
   const [editEvent ,seteditEvent] = useState(null);
   const [eventPeriod, setEventPeriod] = useState('AM');  
  useEffect(()=>{
    localStorage.setItem("storeeventtask",JSON.stringify(events));
  },[events]);
   const handleeditevent = (eventindex)=>{
    seteditEvent(events[eventindex]);
    setshoweventpop(true);
   }
   useEffect(()=>{
    if (editEvent) {
        setselectdate(editEvent.date);
        setEventHour(editEvent.time.split(':')[0]);
        setEventMinutes(editEvent.time.split(':')[1].split(' ')[0]); 
        setEventPeriod(editEvent.time.split(' ')[1] || 'AM');

        seteventtext(editEvent.text);
  
    }

   },[editEvent]);
   const handledeleteevent = (eventindex) => {
    setevents(events.filter((_, index) => index !== eventindex));
    toast.success("Event deleted successfully!"); 

};

const handleSubmitEvent = () => {
    if (!eventText || !eventHour || !eventMinutes) {
      return  toast.error("Please fill all fields!");
    }
    const newEvent = {
        date: selectdate ? new Date(selectdate).toISOString() : "", 
       
        time: `${eventHour.padStart(2, '0')}:${eventMinutes.padStart(2, '0')} ${eventPeriod}`,  // Include AM/PM
        // time: `${eventHour.padStart(2, '0')}:${eventMinutes.padStart(2, '0')}`,  // Fixed time formatting
        text: eventText,
    };
console.log(newEvent.date);
    if (editEvent) {
        setevents(events.map(event => event === editEvent ? newEvent : event));
        seteditEvent(null); 
        toast.success("Event updated successfully!"); 
    } else {
        setevents([...events, newEvent]);  // Add new event
        toast.success("Event added successfully!");
    }
//reset
    setshoweventpop(false);
    setEventHour('');
    setEventMinutes('');
    seteventtext('');
    setEventPeriod('AM');  
};

const handleAddEvent = (e) => {
    const { name, value } = e.target;
    if (name === "hours") {
        if (value >= 1 && value <= 12) {
            setEventHour(value);
        } else {
            toast.error("Please enter a valid hour between 0 and 12");
        }
    } else if (name === "minutes") {
        if (value >= 0 && value < 60) {
            setEventMinutes(value);
        } else {
            toast.error("Please enter a valid minute between 0 and 59");
        }
    } else if (name === "text") {
        if (value.length <= 60) {
            seteventtext(value);
        } else {
            toast.error("Please enter text below 60 characters");
        }
    }else if (name === "period") {
        setEventPeriod(value);  
    }
};

    const today = new Date();
    const todaydate = today.getDate();
    const todayMonth = today.getMonth();
    const todayyear = today.getFullYear();
    const monthofyear = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
    const [currentMonth,setcurrentMonth] = useState(new Date().getMonth());
    const [currentYear,setcurrentYear] = useState(new Date().getFullYear());
    const handleclickdate = (day)=>{
        const selected = new Date(currentYear,currentMonth,day);
        console.log(selected);
        const today = new Date();
        if(selected>=today || issamedate(selected,today)){
            setselectdate(selected)
            setshoweventpop(true);

        }
        
       
       }
       
       const issamedate = (date1,date2)=>{
        return (
            date1.getFullYear()===date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
       }
   
    const handleNext = ()=>{
        setcurrentMonth((next)=>(next=== 11 ? 0 :next+1));
        setcurrentYear((next)=>(currentMonth===11?next+1:next));

    }
    const handlePrev = ()=>{
  setcurrentMonth((prev)=>(prev===0 ? 11: prev-1));
  setcurrentYear((prev)=>(currentMonth === 0 ? prev-1: prev ))
    }
    const generateCalenderdate = () => {
        if(showeventpopup)return null;
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        let days = [];
    //add space
        for (let day = 0; day < firstDay; day++) {
            days.push(<span key={`empty-${day}`}></span>);
        }
    //add date
        for (let j = 1; j <= lastDay; j++) {
            const isTodaydate = j===todaydate && currentMonth===todayMonth && currentYear===todayyear;
            days.push(<span onClick={()=>handleclickdate(j)}   className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 
                text-sm font-medium cursor-pointer transition-all 
                ${isTodaydate ? "bg-blue-500 text-white rounded-full" : "hover:bg-gray-200 rounded-lg"}`}  key={`${j}`}>{j}</span>);
        }
    
        return days;
    };
    
    
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
        <Toaster position="top-right" />
        
        <div className='container mx-auto p-4 md:p-6 lg:p-8'>
            {/* Header */}
            <header className='mb-8 text-center'>
                <h1 className='text-3xl md:text-4xl font-bold text-slate-800 mb-2'>
                    Calendar & Tasks
                </h1>
                <p className='text-slate-600'>Manage your schedule efficiently</p>
            </header>

            {/* Main Content Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
                {/* Calendar Section - Left Side */}
                <div className='bg-white rounded-2xl shadow-lg w-full h-[500px]'>
                    {/* Calendar Header */}
                    <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6'>
                        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                            <h2 className='text-2xl font-bold'>
                                {monthofyear[currentMonth]} {currentYear}
                            </h2>
                            <div className='flex  items-center gap-4 bg-white/10 rounded-full '>
                                <button 
                                    onClick={handlePrev}
                                    className='p-2 hover:bg-white/20 rounded-full transition-all duration-300'
                                >
                                    <i className='bx bxs-chevron-left text-xl'></i>
                                </button>
                                <button 
                                    onClick={handleNext}
                                    className='p-2 hover:bg-white/20 rounded-full transition-all duration-300'
                                >
                                    <i className='bx bxs-chevron-right text-xl'></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className='p-6 mx-auto max-w-xl'>
                        {/* Days Header */}
                        <div className='grid grid-cols-7 justify-center items-center  gap-2   mb-2'>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className=' py-2 text-sm font-medium text-slate-600'>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className='grid grid-cols-7 justify-center gap-2  items-center '>
                            {generateCalenderdate()}
                        </div>
                    </div>
                </div>

                {/* Tasks Section - Right Side */}
                <div className='bg-white rounded-2xl max-h-[80vh] sm:max-h-[400px] md:max-h-[500px] shadow-lg  flex flex-col'>
                    {/* Tasks Header */}
                    <div className='p-6 border-b border-slate-100'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-2xl font-bold text-slate-800'>Scheduled Events</h2>
                            <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium'>
                                {events.length} Events
                            </span>
                        </div>
                    </div>

                    {/* Tasks List with Scroll */}
                    
                        <div className='space-y-4 flex-1 overflow-y-auto p-6'>
                            {events.map((event, index) => (
                                <div 
                                    key={index}
                                    className='bg-slate-50 rounded-xl p-4'
                                >
                                    <div className='flex justify-between items-start gap-4'>
                                        <div className='flex-1 '>
                                            <h3 className='text-lg font-semibold text-slate-800 mb-2'>
                                                {event.text}
                                            </h3>
                                            <div className='flex items-center gap-4 text-sm text-slate-600'>
                                                <div className='flex items-center gap-1'>
                                                    <i className='bx bx-calendar text-blue-500'></i>
                                                    {/* <span>{`${monthofyear[event.date.getMonth()]} ${event.date.getDate()}`}</span> */}
                                                    <span>{`${monthofyear[new Date(event.date).getMonth()]} ${new Date(event.date).getDate()}`}</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <i className='bx bx-time text-blue-500'></i>
                                                    <span>{event.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <button 
                                                onClick={() => handleeditevent(index)}
                                                className='p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors'
                                            >
                                                <i className="bx bxs-edit-alt text-xl"></i>
                                            </button>
                                            <button 
                                                onClick={() => handledeleteevent(index)}
                                                className='p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors'
                                            >
                                                <i className='bx bxs-trash text-xl'></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {events.length === 0 && (
                                <div className='text-center py-12'>
                                    <div className='text-slate-400 mb-3'>
                                        <i className='bx bx-calendar-x text-6xl'></i>
                                    </div>
                                    <p className='text-slate-500'>No events scheduled yet</p>
                                </div>
                            )}
                        </div>
                    
                </div>
            </div>
        </div>

        {/* Event Popup Modal */}
        {showeventpopup && (
            <div className='fixed  inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center '>
                <div className='bg-white  rounded-2xl shadow-xl p-6 w-full max-w-md'>
                    <div className='flex justify-between items-center mb-6'>
                        <h3 className='text-2xl font-bold text-slate-800'>
                            {editEvent ? 'Edit Event' : 'New Event'}
                        </h3>
                        <button 
                            onClick={() => setshoweventpop(false)}
                            className='text-slate-400 hover:text-slate-600 '
                        >
                            <i className='bx bx-x text-3xl'></i>
                        </button>
                    </div>
                    
                    <div className='space-y-6'>
                        {/* Time Selection */}
                        <div className='grid grid-cols-3 gap-3'>
                            <div className='col-span-1'>
                                <label className='block text-sm font-medium text-slate-700 mb-1'>Hour</label>
                                <input
                                    type="number"
                                    name="hours"
                                    value={eventHour}
                                    onChange={handleAddEvent}
                                    placeholder="1-12"
                                    className='w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                />
                            </div>
                            <div className='col-span-1'>
                                <label className='block text-sm font-medium text-slate-700 mb-1'>Minute</label>
                                <input
                                    type="number"
                                    name="minutes"
                                    value={eventMinutes}
                                    onChange={handleAddEvent}
                                    placeholder="0-59"
                                    className='w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                />
                            </div>
                            <div className='col-span-1'>
                                <label className='block text-sm font-medium text-slate-700 mb-1'>Period</label>
                                <select
                                    name="period"
                                    value={eventPeriod}
                                    onChange={handleAddEvent}
                                    className='w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>

                        {/* Event Description */}
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Event Description</label>
                            <textarea
                                name="text"
                                value={eventText}
                                onChange={handleAddEvent}
                                placeholder="What's the event about?"
                                className='w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none h-32'
                            />
                        </div>
                        
                        <button
                            onClick={handleSubmitEvent}
                            className={`w-full p-4 rounded-xl text-white font-medium transition-all duration-300 ${
                                editEvent 
                                ? 'bg-blue-600 hover:bg-blue-700 ' 
                                : 'bg-blue-600 hover:bg-blue-700 '
                            }`}
                        >
                            {editEvent ? 'Update Event' : 'Add Event'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
}

export default Calenderapp;
