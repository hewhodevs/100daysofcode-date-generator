// ------------------------------------------
//* #### Page elements ####
// ------------------------------------------
const datePicker = document.getElementById('start');
const scheduleButton = document.getElementById('schedule-button');
const scheduleArea = document.getElementById('schedule__textarea');
const clearButton = document.getElementById('clear-button');
// css class used in the getDaysOff function to get the HTMLCollection of checkboxes
const checkBoxClassName = "item__checkbox";


// ------------------------------------------
//* #### Event Listeners ####
// ------------------------------------------
// func setTodaysDate
// Set the date picker to todays date by default once the DOM is loaded
document.addEventListener('DOMContentLoaded', setTodaysDate = () => {
  // set date as today's date by default.
  datePicker.value = formatYYYYMMDD(new Date());
});
// ------------------------------------------
// func scheduleButtonClick
// triggers the generation of the 100 days of code schedule
scheduleButton.addEventListener('click', scheduleButtonClick = () => {
  // check what days off the user had selected, if any
  const daysOff = getDaysOff();
  // handle case where user selects to have all days off (i.e. not participating essentially).
  if (daysOff.length === 7) {
    scheduleArea.value = "Enjoy your time off!";
    return;
  }
  // Get their specified start date, generate and display their schedule
  const startDate = new Date(datePicker.value);
  const schedule = makeSchedule(startDate, daysOff);
  displaySchedule(schedule);
});
// ------------------------------------------
// func clearTextArea
// clears the text area schedule when the clear button is clicked
clearButton.addEventListener('click', clearTextArea = () => {
  scheduleArea.value = "";
})

// ------------------------------------------
//* #### Functions ####
// ------------------------------------------
// func formatYYYYMMDD
// Takes a date object, and returns a string formatted as YYYY/MM/DD
function formatYYYYMMDD(date) {
  let utcDate = date.getUTCDate();
  let month = date.getMonth() + 1; // as getMonth starts from 0 for Jan
  let year = date.getFullYear();
  // Add a leading 0 to single digit days / months
  if (utcDate < 10) {
    utcDate = `0${utcDate}`;
  }
  if (month < 10) {
    month = `0${month}`
  }
  return `${year}-${month}-${utcDate}`;
}
// ------------------------------------------
// func getDaysOff
// returns an array of integers representing days off in a week.
// Sunday=0, Monday=1, ..., Saturday=6
function getDaysOff() {
  let daysOff = [];
  // HTMLCollection of all checkbox elements with the class .day-off__input
  const daysOffInputs = document.getElementsByClassName(checkBoxClassName);
  // Pass the HTMLCollection as the "this" value to the forEach method to iterate through it.
  Array.prototype.forEach.call(daysOffInputs, function(dayOff) {
    if (dayOff.checked) {
      // Add the corresponding integer of any checked dayOff to the daysOff array
      daysOff.push(parseInt(dayOff.value));
    }
  });
  return daysOff;
}
// ------------------------------------------
// func incrementDateByDays
// Returns a new date object incremented by the number of days passed
// Does not mutate the passed date param
function incrementDateByDays(date, daysIncrement) {
  // dont mutate passed date, make a copy of it
  let nextDate = new Date(date.valueOf());
  nextDate.setDate(nextDate.getDate() + daysIncrement);
  return nextDate;
}
// ------------------------------------------
// func findNextValidDate
// finds the next valid date that is not a day off, and occurs after the previous date.
// @prevDate - Date object containing the previous date
// @daysOff - array of integers between 0-6 representing weekdays off. Max length of 7.
function findNextValidDate(prevDate, daysOff) {
  // Makes a new date object incremented by 1 day
  let nextDate = incrementDateByDays(prevDate, 1);
  // if nextDate is a day off, keep iterating until a valid next date is found
  while (daysOff.includes(nextDate.getDay())) {
    nextDate = incrementDateByDays(nextDate, 1);
  }
  return nextDate;
}
// ------------------------------------------
// func makeSchedule
// creates an array of 100 dates
// @startDate - a date object specifying start date of YYYY-MM-DD
// @daysOff - array containing corresponding weekday index's for 
// selected days off, if any. Can be empty.
function makeSchedule(startDate, daysOff) {
  let schedule = [startDate];
  let prevDate = new Date(startDate.valueOf());
  // keep adding dates until we have 100 days
  while (schedule.length < 100) {
    // find the next valid date
    const nextDate = findNextValidDate(prevDate, daysOff);
    schedule.push(nextDate);
    // our valid nextDate becomes the new prevDate
    prevDate = new Date(nextDate.valueOf());
  }
  return schedule;
}
// ------------------------------------------
// func displaySchedule
// Prints each day of the 100DaysOfCode schedule, and their corresponding dates
// @schedule - array of ascending dates
function displaySchedule(schedule) {
  // Clear the text area
  scheduleArea.value="";
  // Add each day from the schedule to the text area
  if (schedule.length !== 0) {
    schedule.forEach((date, index) => {
      const day = index + 1;
      const dateString = date.toDateString();
      const displayDate = `Day ${day} - ${dateString}`;
      scheduleArea.value += `${displayDate}\n`;
    });
  }
}


// ------------------------------------------
//* ####### TESTS #######
// ------------------------------------------
//* findNextValidDate() test
// const nextValidDate = findNextValidDate(new Date("2021-08-13"), daysOff); // should return Monday 2021-08-16
// console.log(nextValidDate.toDateString());

//* makeSchedule() test
// console.log("100DaysOfCode Schedule:")
// const schedule = makeSchedule(startDate, daysOff);
// displaySchedule(schedule);

//* formatYYYYMMDD test
// const today = formatYYYYMMDD(new Date('August 2, 2021 23:15:30 GMT+11:00'));
// console.log(today); // should return 2021/08/02