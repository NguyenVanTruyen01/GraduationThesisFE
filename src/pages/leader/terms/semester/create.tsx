import Field from "@/components/field/Field"
import Label from "@/components/label/Label"
import { getToken } from "@/hooks/useGetToken"
import { IDropdown } from "@/types/interface"
import { convertDateToYear } from "@/utils/ConvertDate"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import moment from "moment"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { classNames } from "primereact/utils"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"

type Props = {}

interface semesterPayload {
  school_year_start: string,
  school_year_end: string,
  semesterName: IDropdown
}

const SemesterCreate = () => {
  const headers = getToken('token')

  const options: IDropdown[] = [
    { name: 'Học kì 1', code: 'HK1' },
    { name: 'Học kì 2', code: 'HK2' },
    { name: 'Học kì 3', code: 'HK3' }
  ];

  const { control, formState: { isSubmitting }, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      school_year_start: "",
      school_year_end: "",
      semesterName: ""
    },
  });

  const onSemesterSubmit = async (data: semesterPayload) => {
    try {
      let start = convertDateToYear(moment(data.school_year_start).toISOString());
      let end = convertDateToYear(moment(data.school_year_end).toISOString());

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
        semester: data.semesterName.code
      }
      const response = await axios.post(`${BASE_API_URL}/semester/leader/createNewSemester`, payload, { headers });
      if (response.data.statusCode === 200) {
        toast.success("Tạo học kỳ thành công");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("Đã có lỗi xảy ra, vui lòng kiểm tra lại");
      } else {
        console.error(error);
      }
    }
  }

  return (
    <div className="flex items-center justify-center"><div className="card min-w-[450px]">
      <div className="flex items-center justify-center mb-4 text-center gap-x-4">
        <h5 className="font-bold text-xl ">Tạo học kỳ mới</h5>
      </div>
      <form onSubmit={handleSubmit(onSemesterSubmit as any)}>
        <Field>
          <Label htmlFor="semesterName">Học kỳ</Label>
          <Controller
            name="semesterName"
            control={control}
            rules={{ required: 'Vui lòng chọn học kỳ' }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder="Vui lòng chọn"
                  options={options}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={`${classNames({ 'p-invalid': fieldState.error })}  text-sm w-full`}
                />
                {/* {getFormErrorMessage(field.name)} */}
              </>
            )}
          />
        </Field>
        <Field>
          <Label htmlFor="school_year_start">Thời gian bắt đầu</Label>
          <Controller
            name="school_year_start"
            control={control}
            rules={{ required: 'Vui lòng chọn ngày sinh' }}
            render={({ field, fieldState }) => (
                <Calendar
                  inputId={field.name}
                  value={field.value as any}
                  onChange={field.onChange}
                  dateFormat="yy"
                  view="year"
                  className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                  placeholder="Thời gian bắt đầu"
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
            rules={{ required: 'Vui lòng chọn ngày sinh' }}
            render={({ field, fieldState }) => (
              <Calendar
                inputId={field.name}
                value={field.value as any}
                onChange={field.onChange}
                dateFormat="yy"
                view="year"
                className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                placeholder="Thời gian kết thúc"
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

export default SemesterCreate