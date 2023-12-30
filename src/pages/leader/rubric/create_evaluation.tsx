import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { getToken } from "@/hooks/useGetToken";
import { IRubricEvaluationPayload } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { Steps } from "primereact/steps";
import { classNames } from "primereact/utils";
import * as React from 'react';
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ILeaderCreateEvaluationProps {
  totalEvaluation: number
  rubricId: string
}

const headers = getToken("token")

const LeaderCreateEvaluation: React.FunctionComponent<ILeaderCreateEvaluationProps> = ({ totalEvaluation, rubricId }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [evaluationValues, setEvaluationValues] = useState<IRubricEvaluationPayload[]>([]);
  const [weightValues, setWeightValues] = useState<number[]>([])
  const [totalWeight, setTotalWeight] = useState<number>(0)

  const items: MenuItem[] = Array.from({ length: totalEvaluation }, (_, index) => ({
    label: `Tiêu chí ${index + 1}`,
    command: (event) => {
      setActiveIndex(index)
    },
  }));

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      rubric_id: "",
      serial: null,
      evaluation_criteria: "",
      grading_scale: null,
      weight: null,
      note: "",
    },
  })

  const onSubmit = async (values: any) => {
    const evalValues = {
      rubric_id: rubricId,
      serial: activeIndex + 1,
      evaluation_criteria: values.evaluation_criteria,
      grading_scale: values.grading_scale,
      weight: values.weight,
      note: values.note
    }

    const newWeightValues = [...weightValues];
    newWeightValues[activeIndex] = values.weight;
    setWeightValues(newWeightValues);

    const newTotalWeight = newWeightValues.reduce((sum, weight) => sum + (weight || 0), 0);
    setTotalWeight(newTotalWeight);

    setEvaluationValues((prevEvaluationValues) => [
      ...(prevEvaluationValues || []),
      evalValues
    ]);

    if (activeIndex < totalEvaluation - 1) {
      setActiveIndex(activeIndex + 1)
      reset({ evaluation_criteria: "", note: "", grading_scale: null, weight: null });
      return;
    }

    if (newTotalWeight !== 100) {
      toast.error("Tổng trọng số phải bằng 100%")
      setEvaluationValues([])
      setActiveIndex(0)
      reset({ evaluation_criteria: "", note: "", grading_scale: null, weight: null });
      return;
    }
    evaluationValues.push(evalValues)

    try {
      const response = await axios.post(`${BASE_API_URL}/rubric_evaluation/leader/createManyEvaluation`, evaluationValues, { headers })
      if (response.data.statusCode == 200) {
        toast.success("Tạo tiêu chí thành công")
        setActiveIndex(0)
        setEvaluationValues([])
        reset({ evaluation_criteria: "", note: "", grading_scale: null, weight: null })
        window.location.reload()
      } else {
        toast.error("Tạo tiêu chí không thành công")
      }
    } catch (error) {
      console.error("error", error);
      toast.error("Tạo tiêu chí không thành công")
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex flex-col gap-y-2 mt-3">
          <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} />
          <Field>
            <Label htmlFor="evaluation_criteria">Tên tiêu chí</Label>
            <Controller
              name="evaluation_criteria"
              control={control}
              rules={{ required: 'Vui lòng nhập' }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  value={field.value}
                  className={`${classNames({ 'p-invalid': fieldState.error })}  w-full text-sm`}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Nhập tên tiêu chí"
                />
              )}
            />
          </Field>
          <Field>
            <Label htmlFor="note">Mô tả tiêu chí</Label>
            <Controller
              name="note"
              control={control}
              rules={{ required: 'Vui lòng nhập mô tả' }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  value={field.value}
                  className={`${classNames({ 'p-invalid': fieldState.error })}  w-full text-sm`}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Nhập mô tả tiêu chí"
                />
              )}
            />
          </Field>
          <div className="form-layout">
            <Field>
              <Label htmlFor="grading_scale">Thang điểm</Label>
              <Controller
                name="grading_scale"
                control={control}
                rules={{
                  required: 'Nhập thang điểm.',
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    id={field.name}
                    inputRef={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={(e) => field.onChange(e)}
                    placeholder="Nhập thang điểm"
                    useGrouping={false}
                    max={10}
                    min={5}
                    inputClassName={classNames({ 'p-invalid': fieldState.error })}
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="weight">Trọng số (%)</Label>
              <Controller
                name="weight"
                control={control}
                rules={{
                  required: 'Nhập trọng số.',
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    id={field.name}
                    inputRef={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={(e) => field.onChange(e)}
                    placeholder="Nhập trọng số"
                    useGrouping={false}
                    inputClassName={classNames({ 'p-invalid': fieldState.error })}
                    suffix="%"
                    min={5}
                    max={100}
                  />
                )}
              />
            </Field>
          </div>
        </div>
        <div className="flex items-center justify-center mt-3">
          <Button
            size="small"
            type="submit"
            label={`${activeIndex + 1 === totalEvaluation ? 'Tạo tiêu chí' : 'Tiếp tục'}`}
            icon={`${activeIndex + 1 === totalEvaluation ? 'pi pi-plus' : 'pi pi-angle-double-right'}`}
            iconPos="right"
          />
        </div>
      </form>
    </div>
  );
};

export default LeaderCreateEvaluation;
