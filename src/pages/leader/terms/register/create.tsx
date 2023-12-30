import Field from "@/components/field/Field"
import Label from "@/components/label/Label"
import Loading from "@/components/loading/Loading"
import Toggle from "@/components/toggle/Toggle"
import { getToken } from "@/hooks/useGetToken"
import { IDropdown, ISemester } from "@/types/interface"
import { convertDateToNumber, convertDateToYear } from "@/utils/ConvertDate"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import moment from "moment"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { classNames } from "primereact/utils"
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

type Props = {}

interface periodPayload {
  semester: IDropdown
  status: boolean
  termStart: string
  termEnd: string
}

interface semesterPayload {
  school_year_start: string,
  school_year_end: string,
  semesterName: IDropdown
}

const RegisterCreate = (props: Props) => {
  const [semesters, setSemesters] = useState<ISemester[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  const headers = getToken('token')
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/semester/leader/getAll`, { headers });
      if (response.status === 200) {
        setSemesters(response.data.data.semesters);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const semesterDropdown: IDropdown[] = semesters.map((item: ISemester) => {
    return {
      name: `${item.semester} ${item.school_year_start}-${item.school_year_end}`,
      code: item._id
    }
  })

  const { control, watch, setValue, formState: { errors, isSubmitting }, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      semester: "",
      status: true,
      termStart: "",
      termEnd: "",
      school_year_start: "",
      school_year_end: "",
      semesterName: ""
    },
  });
  const watchStatus = watch("status");

  const onSubmit = async (data: periodPayload) => {
    try {
      let dayStart = convertDateToNumber(moment(data.termStart).toISOString());
      let dayEnd = convertDateToNumber(moment(data.termEnd).toISOString());
      if (dayEnd - dayStart < 7) {
        toast.error("Thời gian kết thúc phải cách thời gian bắt đầu 1 tuần.");
        return;
      }

      // Kiểm tra nếu registration_period_start là quá khứ so với ngày hiện tại
      if (dayStart < convertDateToNumber(moment().toISOString())) {
        toast.error("Ngày bắt đầu không thể là quá khứ.");
        return;
      }


      const payload = {
        registration_period_semester: data.semester.code,
        registration_period_start: dayStart,
        registration_period_end: dayEnd,
        registration_period_status: data.status,
      }
      const response = await axios.post(`${BASE_API_URL}/registration_period/leader/createRegistrationPeriod`, payload, { headers });
      if (response.data.statusCode === 200) {
        toast.success("Mở đợt đăng ký thành công");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("Đã có lỗi xảy ra, vui lòng kiểm tra lại");
      } else {
        console.error(error);
      }
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="card ">
        <div className="flex items-center justify-center mb-4 text-center gap-x-4">
          <h5 className="font-bold text-xl ">Mở đợt đăng ký mới</h5>
        </div>
        <form className=" grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit as any)}>
          <Field>
            <Label htmlFor="semester">Học kỳ</Label>
            <Controller
              name="semester"
              control={control}
              rules={{ required: 'Vui lòng chọn học kỳ' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder="Vui lòng chọn"
                  options={semesterDropdown}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={`${classNames({ 'p-invalid': fieldState.error })}  text-sm w-full`}
                />
              )}
            />
          </Field>
          <Field>
            <Label>Trạng thái đợt đăng ký (Mở hoặc đóng)</Label>
            <Toggle on={watchStatus === true}
              onClick={() => {
                setValue("status", !watchStatus);
              }}
            />
          </Field>
          <Field>
            <Label htmlFor="termStart">Thời gian bắt đầu</Label>
            <Controller
              name="termStart"
              control={control}
              rules={{ required: 'Vui lòng chọn ngày sinh' }}
              render={({ field, fieldState }) => (
                <Calendar
                  inputId={field.name}
                  value={field.value as any}
                  onChange={field.onChange}
                  dateFormat="dd/mm/yy"
                  className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                  placeholder="Thời gian bắt đầu"
                />
              )}
            />
          </Field>
          <Field>
            <Label htmlFor="termEnd">Thời gian kết thúc</Label>
            <Controller
              name="termEnd"
              control={control}
              rules={{ required: 'Vui lòng chọn ngày sinh' }}
              render={({ field, fieldState }) => (
                <Calendar
                  inputId={field.name}
                  value={field.value as any}
                  onChange={field.onChange}
                  dateFormat="dd/mm/yy"
                  className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                  placeholder="Thời gian kết thúc"
                />
              )}
            />
          </Field>
          <div className="flex justify-center text-sm gap-x-2">
            <Button disabled={isSubmitting} size="small" type="submit" label="Mở đợt đăng ký" icon="pi pi-plus" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterCreate