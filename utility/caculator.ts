export const  getWeeksDiff= (startDate:any, endDate:any):Number=> {
    const msInWeek = 1000 * 60 * 60 * 24 * 7
    if(endDate - startDate <0){
        return 0
    }
    return Math.round(Math.abs(endDate - startDate) / msInWeek)
}
export const  curentDate= ():String=> {
    let date = new Date()
	let current_date =  date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
    return current_date
}
export const  diff_weeks= (dt2:any, dt1:any) =>
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7)
  return Math.abs(Math.round(diff))
  
 }
