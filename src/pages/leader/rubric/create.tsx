import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { getToken } from "@/hooks/useGetToken";
import { IDropdown } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ILeaderCreateRubricProps {
}

const LeaderCreateRubric: React.FC<ILeaderCreateRubricProps> = (props) => {

  const headers = getToken('token')

  const categories: IDropdown[] = [
    { name: 'Giảng viên hướng dẫn', code: '1' },
    { name: 'Giảng viên phản biện', code: '2' },
    { name: 'Hội đồng bảo vệ', code: '3' }
  ];

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      rubric_name: "",
      rubric_category: "",
      rubric_evaluations: [],
      rubric_note: "",
    },
  })


  const onSubmitRubric = async (values: any) => {
    console.log("values", values);
    const payload = {
      rubric_name: values.rubric_name,
      rubric_evaluations: [],
      rubric_note: values.rubric_note,
      rubric_topic_category: values.rubric_topic_category?.code,
      rubric_category: values.rubric_category?.code,
    }

    try {
      const response = await axios.post(`${BASE_API_URL}/rubric/leader/create`, payload, { headers })
      if (response.data.statusCode == 200) {
        toast.success(response.data.message)
        window.location.reload()
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitRubric)}>
        <div className=" flex flex-col gap-y-2 mt-3">
          <Field>
            <Label htmlFor="rubric_name">Tên phiếu đánh giá</Label>
            <Controller
              name="rubric_name"
              control={control}
              rules={{ required: 'Vui lòng nhập tên' }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  value={field.value}
                  className={`${classNames({ 'p-invalid': fieldState.error })} w-full text-sm`}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Nhập tên phiếu đánh giá"
                />
              )}
            />
          </Field>
          <Field>
            <Label htmlFor="rubric_category">Phiếu đánh giá dành cho</Label>
            <Controller
              name="rubric_category"
              control={control}
              rules={{ required: 'Vui lòng chọn' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder="Vui lòng chọn"
                  options={categories}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={`${classNames({ 'p-invalid': fieldState.error })} text-sm w-full`}
                />
              )}
            />
          </Field>
          <Field>
            <Label htmlFor="rubric_note">Mô tả</Label>
            <Controller
              name="rubric_note"
              control={control}
              rules={{ required: 'Description is required.' }}
              render={({ field, fieldState }) => (
                <InputTextarea
                  id={field.name}
                  {...field}
                  rows={4}
                  cols={30}
                  className={`${classNames({ 'p-invalid': fieldState.error })} text-sm w-full`}
                  placeholder="Nhập mô tả"
                />
              )}
            />

          </Field>
        </div>
        <div className="flex items-center justify-center">
          <Button size="small" type="submit" label="Tạo mới" icon="pi pi-plus" />
        </div>
      </form>
    </div>
  );
};

export default LeaderCreateRubric;
