import { IMajor } from "../../types/interface"
import * as React from 'react';
import { useController } from "react-hook-form";

interface semester {
  _id: string
  school_year_start: string
  school_year_end: string
  semester: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface IDropdownProps {
  major: IMajor[];
  control: any;
  name: string;
  text?: string;
  error?: any
  label?: string
}

const DropdownMajor: React.FC<IDropdownProps> = ({
  major,
  control,
  name,
  text
}:any) => {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  })

  console.log("major", major);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedID = e.target.value
    console.log(selectedID)
    field.onChange(selectedID)
  }

  return (
    <div className=" w-full min-w-[200px]">
      <select className="w-full p-3 text-base font-semibold transition-all border outline-none border-borderColor rounded-xl placeholder:text-text4 focus:outline-none focus:border-primary border-blue-gray-200 text-blue-gray-700 outline outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        id={name}
        {...field}
        onChange={handleSelectChange}
      >
        <option value="">Vui lòng chọn</option>
        <option
          placeholder="Lựa chọn"
          value={major._id}
        >
          {/* {period.registration_period_semester.semester} - Năm học({period.registration_period_semester.school_year_start}-{period.registration_period_semester.school_year_end}) */}
          {

          }
        </option>
      </select>
    </div>
  )
};

export default DropdownMajor;
