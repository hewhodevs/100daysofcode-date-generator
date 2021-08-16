// ------------------------------------------
//* #### Page elements ####
// ------------------------------------------
const datePicker = document.getElementById('start');
const scheduleButton = document.getElementById('schedule-button');
const scheduleArea = document.getElementById('schedule');


// ------------------------------------------
//* #### Event Listeners ####
// ------------------------------------------
// Make schedule on button click
scheduleButton.addEventListener('click', scheduleButtonClick = () => {
  const daysOff = getDaysOff();
  const startDate = new Date(datePicker.value);
  const schedule = makeSchedule(startDate, daysOff);
  displaySchedule(schedule);
});


// ------------------------------------------
//* #### Functions ####
// ------------------------------------------
// func getDaysOff
// returns an array of integers representing days off in a week.
// Sunday=0, Monday=1, ..., Saturday=6
function getDaysOff() {
  let daysOff = [];
  // HTMLCollection of all checkbox elements with the class .day-off__input
  const daysOffInputs = document.getElementsByClassName('day-off__input');
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
// returns a new incremented date object. Does not mutate passed params.
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