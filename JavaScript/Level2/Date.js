function dateMethods() {
  const currentDate = new Date();
  console.log("Current Date:", currentDate);

  // Getting various components of the date
  console.log("Date:", currentDate.getDate());//Date: 10
  console.log("Month:", currentDate.getMonth() + 1); // Months are zero-indexed, so adding 1        output=Month: 1
  console.log("Year:", currentDate.getFullYear());//2026
  console.log("Hours:", currentDate.getHours());//22
  console.log("Minutes:", currentDate.getMinutes());//59
  console.log("Seconds:", currentDate.getSeconds());//3

  // Setting components of the date
  currentDate.setFullYear(2022);
  console.log("After setFullYear:", currentDate); //After setFullYear: 2022-01-10T17:29:03.338Z

  currentDate.setMonth(5); // Setting month to June (zero-indexed)
  console.log("After setMonth:", currentDate);//After setMonth: 2022-06-10T17:29:03.338Z

  // Getting and setting time in milliseconds since 1970
  console.log("Time in milliseconds since 1970:", currentDate.getTime());//Time in milliseconds since 1970: 1654882143338

  const newDate = new Date(2023, 8, 15); // Creating a new date 
  console.log("New Date:", newDate);//New Date: 2023-09-14T18:30:00.000Z
}

// Example Usage for Date Methods
dateMethods();

/* 
function Clock(){
    const currentDate = new Date()
    //now for showing time what we need ?? 
    const hrs = currentDate.getHours() 
    const min = currentDate.getMinutes() 
    const sec = currentDate.getSeconds() 

    //final mai inn sab variables ko ek final element bnayenge dom ki help se usme yeh saari values inject kr denge
    //${hrs}:${min}:${sec}
}
*/