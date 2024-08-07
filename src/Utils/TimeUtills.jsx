function convertTo12Hour(time) {

    if(!time) {
        return `--:-- --`;
    }

    // Split the time string into its components
    let [hours, minutes, seconds] = time.split(":");

    // Convert hours from string to number
    hours = parseInt(hours);

    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Adjust hours for 12-hour format
    hours = hours % 12 || 12; // Modulo 12 and handle the case for 0 hours

    // Return the formatted time
    return `${hours}:${minutes} ${period}`;
}

export default convertTo12Hour;