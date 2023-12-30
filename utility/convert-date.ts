export const convertDate = (value:any) => {
    let date = new Date(value)
     return date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate()
}

export const convertDateTime = (time:any) => {
    let hours:string = new Date(time).getHours().toString()
    let minutes:string = new Date(time).getMinutes().toString()
    let date:string = new Date(time).getDate().toString()
    let month:string = (new Date(time).getMonth() + 1).toString()
    const year = new Date(time).getFullYear()
    if (Number(hours) < 10) {
        hours = `0${hours}`
    }
    if (Number(minutes) < 10) {
        minutes = `0${minutes}`
    }
    if (Number(date) < 10) {
        date = `0${date}`
    }
    if (Number(month) < 10) {
        month = `0${month}`
    }
    return `${date}/${month}/${year}  ${hours}:${minutes}`
}
