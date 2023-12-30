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
  semesters: semester[]
  control: any;
  name: string;
  text?: string;
  error?: any
  label?: string
}

const Dropdown: React.FC<IDropdownProps> = ({
  semesters,
  control,
  name,
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  })

  console.log(semesters);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedID = e.target.value
    console.log(selectedID)
    field.onChange(selectedID)
  }

  return (
    <div className="relative h-10 w-full min-w-[200px]">
      <select className="w-full px-6 py-4 text-base font-semibold transition-all border outline-none border-borderColor rounded-xl placeholder:text-text4 focus:outline-none focus:border-primary border-blue-gray-200 text-blue-gray-700 outline outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        id={name}
        {...field}
        onChange={handleSelectChange}
      >
        <option value="">Vui lòng chọn</option>
        {
          semesters?.map((semester) => {
            return (
              <option
                key={semester._id}
                placeholder="Lựa chọn"
                value={semester._id}
              >
                {semester.semester} - Năm học({semester.school_year_start}-{semester.school_year_end})
              </option>
            )
          })
        }
      </select>
    </div>
  )
};

export default Dropdown;
