import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Calendar.css';

function Calendar({ isConnected, eventData, onDateRangeChange }) { // Define the Calendar component that takes props: isConnected, eventData, and onDateRangeChange
    // State variables to store unique dates, min and max dates, selected from and to dates, modal visibility, highlighted dates, and available hours
  const [uniqueTMin, setUniqueTMin] = useState([]); // Stores unique minimum dates 
  const [uniqueTMax, setUniqueTMax] = useState([]); // Stores unique maximum dates.
  const [minDate, setMinDate] = useState(null); // Sets custom user defined min date
  const [maxDate, setMaxDate] = useState(null); // Sets custom user defined max date
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromModal, setShowFromModal] = useState(false); // Controls visibility of 'FROM' modal dialogs.
  const [showToModal, setShowToModal] = useState(false); // Controls visibility of 'TO' modal dialogs.
  const [highlightedDates, setHighlightedDates] = useState([]); // Stores highlighted date ranges.
  const [availableHours, setAvailableHours] = useState(new Set()); // Stores hours available for selection.

   // Function to format date string into a human-readable format (YYYY-MM-DD HH:00)
  const formatDate = (dateStr) => { 
    const year = `20${dateStr.slice(0, 2)}`; // Extract year
    const month = dateStr.slice(2, 4); // Extract month
    const day = dateStr.slice(4, 6);  // Extract day
    const hour = dateStr.slice(7, 9);  // Extract hour
    return `${year}-${month}-${day} ${hour}:00`;  // Return formatted date
  };

  // Function to extract available hours from eventData
  const extractAvailableHours = () => {
    const hoursSet = new Set();
    eventData.forEach(item => {
        const tMinHour = parseInt(item.t_min[0].slice(7, 9), 10);  // Extract hour from t_min (24-hour format)
        const tMaxHour = parseInt(item.t_max[0].slice(7, 9), 10);  // Extract hour from t_max (24-hour format)
        
        // Add the hours (in 24-hour format) to the set
        hoursSet.add(tMinHour);  
        hoursSet.add(tMaxHour);  
    });
    return hoursSet;
};

  // Function to filter available time slots in the calendar
  const filterAvailableTime = (time) => {
    const hour = time.getHours();  // Get the hour in 24-hour format (e.g., 15 for 3 PM)
    return availableHours.has(hour); // Only allow hours present in availableHours set
  };

  // useEffect hook to handle changes when eventData updates, and set the unique date values
  useEffect(() => {
    const tMinSet = new Set();  // A set to store unique 't_min' dates
    const tMaxSet = new Set();  // A set to store unique 't_max' dates

    // Extract available hours from eventData
    const hoursSet = extractAvailableHours();
    setAvailableHours(hoursSet);  // Update state with available hours

    // Iterate over eventData to extract unique 't_min' and 't_max' dates
    eventData.forEach(item => {
      const tMin = formatDate(item.t_min[0]);  // Format 't_min' date
      const tMax = formatDate(item.t_max[0]);  // Format 't_max' date
      tMinSet.add(tMin);  // Add formatted 't_min' date to set
      tMaxSet.add(tMax);  // Add formatted 't_max' date to set
    });

    // Convert the sets into arrays
    const tMinArray = Array.from(tMinSet);
    const tMaxArray = Array.from(tMaxSet);

    // Set the unique date values in state
    setUniqueTMin(tMinArray);
    setUniqueTMax(tMaxArray);

    // Merge both sets into one array and sort it
    const allDates = [...tMinArray, ...tMaxArray];
    const sortedDates = allDates.sort();  // Sort all dates in ascending order

    // Set the minimum and maximum dates for the calendar
    setMinDate(sortedDates[0]);
    setMaxDate(sortedDates[sortedDates.length - 1]);

    // Set the from and to date to the minimum and maximum sorted dates
    setFromDate(new Date(sortedDates[0]));
    setToDate(new Date(sortedDates[sortedDates.length - 1]));
  }, [eventData]); // Dependency array, runs when eventData changes

  // Functions to control the visibility of the FROM date modal
  const openFromModal = () => setShowFromModal(true);
  const closeFromModal = () => setShowFromModal(false);

  // Functions to control the visibility of the TO date modal
  const openToModal = () => setShowToModal(true);
  const closeToModal = () => setShowToModal(false);

  // Function to set the FROM date and display the highlighted date range
  const handleSetFrom = () => {
    // Once the "FROM" date is set, prepare the highlighted dates
    setHighlightedDates([new Date(fromDate), new Date(toDate)]);
    console.log("FROM Date:", fromDate);  // Log the selected FROM date
    setShowFromModal(false);  // Close the FROM modal
    setShowToModal(true);  // Open the TO modal
  };

  // Function to set the TO date, finalize the date range, and notify parent component
  const handleSetTo = () => {
    // Once the "TO" date is set, finalize the range
    // console.log("FROM Date:", fromDate);
    console.log("TO Date:", toDate);  // Log the selected TO date
    setHighlightedDates(generateHighlightedDates(fromDate, toDate));  // Highlight the full date range
    setShowToModal(false);  // Close the TO modal
    if (onDateRangeChange) {// If the parent component provided onDateRangeChange function, call it as it is passed Graph.js
        onDateRangeChange(fromDate, toDate);
    }
  };

  // Function to reset the FROM and TO dates and remove highlighted dates
  const handleCancel = () => {
    setFromDate(null);
    setToDate(null);
    setHighlightedDates([]);  // Clear the highlighted dates
  };

  // Function to reset the FROM and TO dates to the minimum and maximum values and highlight the full range
  const handleReset = () => {
    setFromDate(new Date(minDate));
    setToDate(new Date(maxDate));
    setHighlightedDates([new Date(minDate), new Date(maxDate)]);  // Highlight the full range
  };

  // Function to generate an array of highlighted dates between the start and end date
  const generateHighlightedDates = (start, end) => {
    const highlighted = []; // Array to store highlighted dates
    let currentDate = new Date(start);  // Start from the FROM date
    while (currentDate <= end) {  // Loop through all the dates from start to end
      highlighted.push(new Date(currentDate));  // Add each date to the highlighted array
      currentDate.setDate(currentDate.getDate() + 1);   // Move to the next day
    }
    return highlighted;  // Return the array of highlighted dates
  };

  // Function to handle mouse hover over the TO date to dynamically highlight the date range
  const handleMouseOver = (date) => {
    if (fromDate) {  // If FROM date is set
      const hoveredDate = new Date(date);  // Get the hovered date
      if (hoveredDate >= fromDate) {  // Only highlight if the hovered date is after the FROM date
        setHighlightedDates(generateHighlightedDates(fromDate, hoveredDate));  // Highlight from the FROM date to hovered date
      }
    }
  };

  return (
    <div className="calendar-container">
    {/* Button to open the FROM date modal */}
      <button
        className={`calendar-button ${!isConnected ? 'disabled' : ''}`}   // Disable if not connected
        disabled={!isConnected}   // Button is disabled if not connected
        onClick={openFromModal}   // Opens FROM modal when clicked
      >
        FROM
      </button>
      {/* Button to open the TO date modal, only if FROM date is set */}
      <button
        className={`calendar-button ${!isConnected ? 'disabled' : ''}`}   // Disable if not connected
        disabled={!isConnected || !fromDate}   // Disable until FROM date is selected
        onClick={openToModal} // Only open TO modal after FROM date is set
      >
        TO
      </button>

      {/* FROM Calendar Modal */}
      {showFromModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={closeFromModal}>✖</span>
            <h3>Select FROM Date</h3>
            <DatePicker
              selected={fromDate}   // Show the currently selected FROM date
              onChange={setFromDate}   // Update FROM date when user selects a date
              includeDates={uniqueTMin.map(date => new Date(date))}   // Show only available FROM dates
              minDate={new Date(minDate)}   // Set minimum date for calendar
              maxDate={new Date(maxDate)}   // Set maximum date for calendar
              showTimeSelect  // Allow selecting time along with date
              timeIntervals={60} // Time selection intervals of 60 minutes
              dateFormat="yyyy-MM-dd HH:mm"   // Date format with time
              className="date-picker"   // Apply custom CSS
              highlightDates={highlightedDates} // Highlight the date range in FROM calendar when the user again clicks on the FROM
              // Added condition for enabling/disabling time slots based on available hours
              filterTime={filterAvailableTime}
            />
            <div className="button-group">
              {/* Buttons for setting, canceling, or resetting the FROM date */}
              <button onClick={handleSetFrom} className="action-button set">SET</button>
              <button onClick={handleCancel} className="action-button cancel">CANCEL</button>
              <button onClick={handleReset} className="action-button reset">RESET</button>
            </div>
          </div>
        </div>
      )}

      {/* TO Calendar Modal */}
      {showToModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={closeToModal}>✖</span>
            <h3>Select TO Date</h3>
            <DatePicker
              selected={toDate}   // Show the currently selected TO date
              onChange={setToDate}   // Update TO date when user selects a date
              includeDates={uniqueTMax.map(date => new Date(date))}   // Show only available TO dates
              minDate={new Date(minDate)}   // Ensure TO date is after FROM date
              maxDate={new Date(maxDate)}   // Set maximum date for calendar
              showTimeSelect   // Allow selecting time along with date
              timeIntervals={60}   // Time selection intervals of 60 minutes
              dateFormat="yyyy-MM-dd HH:mm"  // Date format with time
              className="date-picker"   // Apply custom CSS
            //   highlightDates={highlightedDates}   // Clear highlighted range when calendar is closed
              onMouseOver={(date) => handleMouseOver(date)} // Add onMouseOver for live highlighting
              highlightDates={highlightedDates} // Highlight the date range in TO calendar as well
              // Added condition for enabling/disabling time slots based on available hours
              filterTime={filterAvailableTime}
            />
            <div className="button-group">
              {/* Buttons for setting or canceling the TO date */}
              <button onClick={handleSetTo} className="action-button set">SET</button>
              <button onClick={handleCancel} className="action-button cancel">CANCEL</button>
              <button onClick={handleReset} className="action-button reset">RESET</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
