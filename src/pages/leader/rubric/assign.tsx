import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { getToken } from "@/hooks/useGetToken";
import { IDropdown, IRegisterPeriod, IRubric, ISemester } from "@/types/interface";
import { convertNumberToDate } from "@/utils/ConvertDate";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IRubricAssignProps {
  rubricList: IRubric[]
}

const RubricAssign: React.FC<IRubricAssignProps> = ({ rubricList }) => {
  const [listPeriod, setListPeriod] = useState<IRegisterPeriod[]>([])
  const [listSemesters, setListSemesters] = useState<ISemester[]>([])
  const [semesterId, setSemesterId] = useState<IDropdown>()
  const headers = getToken("token")

  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      rubric_instructor: "",
      rubric_reviewer: "",
      rubric_assembly: "",
      topic_registration_period: ""
    },
  })

  const fetchAllSemester = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/semester/leader/getAll`, { headers });
      if (response.data.statusCode === 200) {
        setListSemesters(response.data.data.semesters);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  }, []);

  const fetchPeriod = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/registration_period/leader/getByFilter`,
        {
          filter: {
            registration_period_semester: semesterId?.code,
          },
        },
        { headers }
      );
      if (response.data.statusCode === 200) {
        setListPeriod(response.data.data.registration_periods);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  }, [semesterId?.code]);


  const rubricDropdown: IDropdown[] = rubricList?.map((item: IRubric) => {
    return {
      name: item.rubric_name,
      code: item._id
    }
  })

  const semesterDropdown: IDropdown[] = listSemesters.map((item: ISemester) => {
    return {
      name: `${item.semester} ${item.school_year_start} - ${item.school_year_end}`,
      code: item._id
    }
  })

  const periodDropdown: IDropdown[] = listPeriod.map((item: IRegisterPeriod) => {
    return {
      name: `${convertNumberToDate(item.registration_period_start)} -> ${convertNumberToDate(item.registration_period_end)}`,
      code: item._id
    }
  })

  const rubricCategories: IDropdown[] = [
    { name: 'Giảng viên hướng dẫn', code: 'rubric_instructor' },
    { name: 'Giảng viên phản biện', code: 'rubric_reviewer' },
    { name: 'Hội đồng bảo vệ', code: 'rubric_assembly' }
  ]
  useEffect(() => {
    fetchAllSemester();
  }, [fetchAllSemester]);

  useEffect(() => {
    if (semesterId) {
      fetchPeriod();
    }
  }, [fetchPeriod, semesterId]);


  const onAssignRubric = async (values: any) => {
    console.log("values", values);
    const payload = {
      filter: {
        topic_registration_period: values.topic_registration_period.code
      },
      data: {
        rubric_instructor: values.rubric_instructor.code,
        rubric_reviewer: values.rubric_reviewer.code,
        rubric_assembly: values.rubric_assembly.code
      }
    }
    const response = await axios.post(`${BASE_API_URL}/topics/leader/updateManyTopicsByFilter`, payload, { headers })
    if (response.data.statusCode == 200) {
      toast.success(response.data.message)
    }
  }

  return (
    <section className="mt-5">
      <form onSubmit={handleSubmit(onAssignRubric)}>
        <div className="form-layout mb-3">
          <Field>
            <Label htmlFor="semesterId">Học kì</Label>
            <Dropdown id="semesterId" value={semesterId} onChange={(e) => { setSemesterId(e.value) }} options={semesterDropdown} optionLabel="name" placeholder="Chọn học kỳ" className="w-full md:w-14rem" />
          </Field>
          <Field>
            <Label htmlFor="topic_registration_period">Chọn đợt đăng ký</Label>
            <Controller
              name="topic_registration_period"
              control={control}
              rules={{ required: 'Vui lòng chọn' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder="Vui lòng chọn"
                  disabled={!semesterId}
                  options={periodDropdown}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={`${classNames({ 'p-invalid': fieldState.error })} text-sm w-full`}
                />
              )}
            />
          </Field>
        </div>
        <div className="form-layout2">
          <Field>
            <Label htmlFor="rubric_instructor">Hướng dẫn</Label>
            <Controller
              name="rubric_instructor"
              control={control}
              rules={{ required: 'City is required.' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder="Chọn phiếu đánh giá"
                  options={rubricDropdown}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={`${classNames({ 'p-invalid': fieldState.error })} w-full border border-borderColor`}
                />
              )}
            />
          </Field>
          <Field>
            <Label htmlFor="rubric_reviewer">Phản biện</Label>
            <Controller
              name="rubric_reviewer"
              control={control}
              rules={{ required: 'City is required.' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder="Chọn phiếu đánh giá"
                  options={rubricDropdown}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={`${classNames({ 'p-invalid': fieldState.error })} w-full border border-borderColor`}
                />
              )}
            />
          </Field>
          <Field>
            <Label htmlFor="rubric_assembly">Hội đồng</Label>
            <Controller
              name="rubric_assembly"
              control={control}
              rules={{ required: 'City is required.' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder="Chọn phiếu đánh giá"
                  options={rubricDropdown}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={`${classNames({ 'p-invalid': fieldState.error })} w-full border border-borderColor`}
                />
              )}
            />
          </Field>
        </div>
        <div className="flex flex-wrap items-center justify-center font-normal mt-5">
          <Button size="small" type="submit" label="Gán phiếu đánh giá" icon="pi pi-plus" />
        </div>
      </form>
    </section>
  );
};

export default RubricAssign;
