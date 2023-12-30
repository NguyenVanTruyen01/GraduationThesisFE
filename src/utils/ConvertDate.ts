

export const convertDate = (value: any) => {
  let date = new Date(value)
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
}



export const convertDateTime = (time: any) => {
  let hours: string = new Date(time).getHours().toString()
  let minutes: string = new Date(time).getMinutes().toString()
  let date: string = new Date(time).getDate().toString()
  let month: string = (new Date(time).getMonth() + 1).toString()
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
export const curentDate = (): String => {
  let date = new Date()
  let current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  return current_date
}

export function convertNumberToDate(number: number) {
  const dateString = number.toString();
  // console.log(dateString);

  // if (dateString.length !== 8) {
  //   throw new Error('Số không hợp lệ, yêu cầu 8 chữ số.');
  // }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  // const date = new Date(`${year}-${month}-${day}`);
  // const date = new Date(`${day}-${month}-${month}`)
  const date = `${day}-${month}-${year}`

  return date;
}

export function convertDateToNumber(dateString: string) {
  // Create a Date object with the input string
  const date = new Date(dateString);

  // Extract the year, month, and day components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();

  // Combine components and convert to a number
  const number = parseInt(`${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`, 10);

  return number;
}

export function convertDateToYear(dateString: string) {
  // Loại bỏ dấu gạch ngang "-"
  const dateWithoutHyphen = dateString.replace(/-/g, '');
  // Chuyển đổi chuỗi thành số nguyên
  const number = parseInt(dateWithoutHyphen, 10);

  const year = parseInt(number.toString().substring(0, 4)) + 1

  return year.toString();
}
