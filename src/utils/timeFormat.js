export default function getTimeString(d) {
    var hour = d.getHours();
    var tod = "am"
    if(hour>=12) {
        hour = hour - 12 
        tod = "pm"
    }
    if(hour===0){
        hour = 12
    }

    var min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    const timestr = hour + ":" + min + tod;
    return timestr

}