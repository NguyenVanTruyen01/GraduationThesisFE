
import Field from "@/components/field/Field"
import Label from "@/components/label/Label"
import Loading from "@/components/loading/Loading"
import { getToken } from "@/hooks/useGetToken"
import { IDropdown, ISemester } from "@/types/interface"
import { convertDateToYear, convertNumberToDate } from "@/utils/ConvertDate"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import moment from "moment"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { classNames } from "primereact/utils"
import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"

type Props = {
  semester: ISemester | undefined
}

interface semesterPayload {
  school_year_start: string,
  school_year_end: string,
  semesterName: IDropdown
}

const LeaderSemesterShow = (props: Props) => {
  const { semester } = props;
  console.log("semester", semester);
  const [semesterDetails, setSemesterDetails] = useState<ISemester>()
  const [loading, setLoading] = useState(true)

  const headers = getToken('token')

  const options: IDropdown[] = [
    { name: 'Học kì 1', code: 'HK1' },
    { name: 'Học kì 2', code: 'HK2' },
    { name: 'Học kì 3', code: 'HK3' }
  ];

  const { control, formState: { isSubmitting }, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      school_year_start: null,
      school_year_end: null,
      semesterName: null
    },
  });

  const fetchSemester = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/semester/leader/findById/${semester?._id}`,
        { headers }
      );
      if (response.data.statusCode === 200) {
        setSemesterDetails(response.data.data.semester);
        setLoading(false);
      }
    } catch (error) {
      // Handle error
    }
  }, [semester?._id]);

  useEffect(() => {
    fetchSemester();
  }, [fetchSemester]);



  const onSubmit = async (data: semesterPayload) => {
    try {
      let start = data?.school_year_start != null ? convertDateToYear(moment(data.school_year_start).toISOString()) : semesterDetails?.school_year_start
      let end = data?.school_year_end != null ? convertDateToYear(moment(data.school_year_end).toISOString()) : semesterDetails?.school_year_end

      if (Number(start) < new Date().getFullYear()) {
        toast.error("Thời gian bắt đầu không thể nhỏ hơn năm hiện tại");
        return;
      }

      if (Number(end) - Number(start) <= 0 || Number(end) - Number(start) > 1) {
        toast.error("Thời gian không hợp lệ");
        return;
      }
      const payload = {
        school_year_start: start,
        school_year_end: end,
        semester: data.semesterName != null ? data.semesterName.code : semesterDetails?.semester
      }
      const response = await axios.patch(`${BASE_API_URL}/semester/leader/updateById/${semester?._id}`, payload, { headers });
      if (response.data.statusCode === 200) {
        toast.success("Cập nhật học kỳ thành công");
      }
    } catch (error) {
      console.error(error
      );

    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="flex items-center justify-center"><div className="card min-w-[450px]">
      <div className="flex items-center justify-center mb-4 text-center gap-x-4">
        <h5 className="font-bold text-xl ">Tạo học kỳ mới</h5>
      </div>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <Field>
          <Label htmlFor="semesterName">Học kỳ</Label>
          <Controller
            name="semesterName"
            control={control}
            render={({ field, fieldState }) => (
              <Dropdown
                id={field.name}
                value={field.value}
                optionLabel="name"
                placeholder={semesterDetails?.semester}
                options={options}
                focusInputRef={field.ref}
                onChange={(e) => field.onChange(e.value)}
                className={`${classNames({ 'p-invalid': fieldState.error })}  text-sm w-full`}
              />
            )}
          />
        </Field>
        <Field>
          <Label htmlFor="school_year_start">Thời gian bắt đầu</Label>
          <Controller
            name="school_year_start"
            control={control}
            render={({ field, fieldState }) => (
              <Calendar
                inputId={field.name}
                value={field.value as any}
                onChange={field.onChange}
                dateFormat="yy"
                view="year"
                className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                placeholder={semesterDetails?.school_year_start}
                showIcon
              />
            )}
          />
        </Field>
        <Field>
          <Label htmlFor="school_year_end">Thời gian kết thúc</Label>
          <Controller
            name="school_year_end"
            control={control}
            render={({ field, fieldState }) => (
              <Calendar
                inputId={field.name}
                value={field.value as any}
                onChange={field.onChange}
                dateFormat="yy"
                view="year"
                className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                placeholder={semesterDetails?.school_year_end}
                showIcon
              />
            )}
          />
        </Field>
        <div className="flex justify-center text-sm gap-x-2">
          <Button disabled={isSubmitting} size="small" type="submit" label="Tạo học kỳ" icon="pi pi-plus" />
        </div>
      </form>
    </div>
    </div>
  )
}

export default LeaderSemesterShow