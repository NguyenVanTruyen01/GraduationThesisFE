import Field from "@/components/field/Field"
import Label from "@/components/label/Label"
import Loading from "@/components/loading/Loading"
import Toggle from "@/components/toggle/Toggle"
import { getToken } from "@/hooks/useGetToken"
import { IDropdown, IRegisterPeriod, ISemester } from "@/types/interface"
import { convertDateToNumber, convertNumberToDate } from "@/utils/ConvertDate"
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

type Props = {
  period: IRegisterPeriod | undefined
}

interface periodPayload {
  semester: IDropdown
  status: boolean
  termStart: string
  termEnd: string
}

const LeaderRegisterShow = (props: Props) => {
  const { period } = props;
  const [semesters, setSemesters] = useState<ISemester[]>([])
  const [periodDetails, setPeriodDetails] = useState<IRegisterPeriod>()
  const [loading, setLoading] = useState(true)

  const headers = getToken('token')
  const fetchRegisterPeriod = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/registration_period/leader/findById/${period?._id}`,
        { headers }
      );
      if (response.data.statusCode === 200) {
        setPeriodDetails(response.data.data.registration_period);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Có lỗi trong quá trình xử lý dữ liệu");
    }
  }, [period?._id]);

  useEffect(() => {
    fetchRegisterPeriod();
  }, [fetchRegisterPeriod]);


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
    },
  });
  const watchStatus = watch("status");

  useEffect(()=>{
    console.log("watchStatus", watchStatus);
  }, [watchStatus])

  useEffect(() => {
    console.log("periodDetails", periodDetails);

    // Set the initial value of watchStatus to periodDetails?.registration_period_status
    setValue("status", periodDetails?.registration_period_status || false);
  }, [periodDetails, setValue]);


  const onSubmit = async (data: periodPayload) => {
    console.log("data", data)
    try {
      const payload: any = {
        registration_period_status: data.status
      }

      let dayStart
      let dayEnd

      if (data.termStart !== "") {
        // Kiểm tra nếu registration_period_start là quá khứ so với ngày hiện tại
        dayStart = convertDateToNumber(moment(data.termStart).toISOString());
        if (dayStart < convertDateToNumber(moment().toISOString())) {
          toast.error("Ngày bắt đầu không thể là quá khứ.");
          return;
        }
        payload.registration_period_start = dayStart
      }
      if (data.termEnd !== "") {
        dayEnd = convertDateToNumber(moment(data.termEnd).toISOString());
        payload.registration_period_end = dayEnd
      }

      if (dayEnd && dayStart && dayEnd - dayStart < 7) {
        toast.error("Thời gian kết thúc phải cách thời gian bắt đầu 1 tuần.");
        return;
      }

      const response = await axios.patch(`${BASE_API_URL}/registration_period/leader/updateById/${period?._id}`, payload, { headers });
      if (response.data.statusCode === 200) {
        let _period = {...period}
        _period.registration_period_status = payload.registration_period_status
        _period.registration_period_start = payload.registration_period_start
        _period.registration_period_end = payload.registration_period_end
        toast.success("Cập nhật đợt đăng ký thành công");
        window.location.reload()
      }
    } catch (error) {
      console.log("error", error);
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
          <h5 className="font-bold text-xl ">Chi tiết đợt đăng ký</h5>
        </div>
        <form className=" grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit as any)}>
          <Field>
            <Label htmlFor="semester">Học kỳ</Label>
            <Controller
              name="semester"
              control={control}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  disabled
                  placeholder={`${periodDetails?.registration_period_semester.semester} ${periodDetails?.registration_period_semester.school_year_start}-${periodDetails?.registration_period_semester.school_year_end}`}
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
            <Toggle on={watchStatus}
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
              render={({ field, fieldState }) => (
                <Calendar
                  inputId={field.name}
                  value={field.value as any}
                  onChange={field.onChange}
                  dateFormat="dd/mm/yy"
                  className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                  placeholder={convertNumberToDate(periodDetails?.registration_period_start as any)}
                  showIcon
                />
              )}
            />
          </Field>
          <Field>
            <Label htmlFor="termEnd">Thời gian kết thúc</Label>
            <Controller
              name="termEnd"
              control={control}
              render={({ field, fieldState }) => (
                <Calendar
                  inputId={field.name}
                  value={field.value as any}
                  onChange={field.onChange}
                  dateFormat="dd/mm/yy"
                  className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                  placeholder={convertNumberToDate(periodDetails?.registration_period_end as any)}
                  showIcon
                />
              )}
            />
          </Field>
          <div className="flex justify-center text-sm gap-x-2">
            <Button disabled={isSubmitting} size="small" type="submit" label="Cập nhật" icon="pi pi-plus" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeaderRegisterShow