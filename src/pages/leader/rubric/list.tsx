import Loading from "@/components/loading/Loading";
import { getToken } from "@/hooks/useGetToken";
import { IDropdown, IRubric, IRubricEvaluation, IRubricEvaluationPayload, ITopicCategory } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableRowEditCompleteEvent, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import * as React from 'react';
import { useCallback, useEffect, useState } from "react";
import RubricAssign from "./assign";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import toast from "react-hot-toast";
import LeaderCreateRubric from "./create";
import LeaderCreateEvaluation from "./create_evaluation";

interface ICreateRubricProps {
}

const LeaderListRubric: React.FC<ICreateRubricProps> = (props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [showEvaluation, setShowEvaluation] = useState<boolean>(false)
  const [showDetailsEvaluation, setShowDetailsEvaluation] = useState<boolean>(false)
  const [showAssignRubric, setShowAssignRubric] = useState<boolean>(false)
  const [rubricId, setRubricId] = useState<string>("")
  const [selectedRubric, setSelectedRubric] = useState<IRubric>()
  const [totalEvaluation, setTotalEvaluation] = useState<number>(1)
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [topicCategory, setTopicCategory] = useState<ITopicCategory[]>([])
  const [rubricEvaluation, setRubricEvaluation] = useState<IRubricEvaluation[]>([])
  const [rubricList, setRubricList] = useState<IRubric[]>([])
  const [evaluationValues, setEvaluationValues] = useState<IRubricEvaluationPayload[]>([])



  const headers = getToken('token')

  const textEditor = (options: any) => {
    return <InputText className="w-full" type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)} />;
  };

  const numberEditor = (options: any) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    let _rubricEvaluation: any = [...rubricEvaluation]
    let { newData, index } = e
    console.log("e", e);
    console.log("newData", newData);
    let payload = {
      rubric_id: newData.rubric_id,
      evaluation_criteria: newData.evaluation_criteria,
      grading_scale: Number(newData.grading_scale),
      weight: Number(newData.weight),
    }
    _rubricEvaluation[index] = newData

    // Calculate the total weight after the edit operation
    const newTotalWeight = _rubricEvaluation.reduce((sum: any, item: any) =>
      sum + (item.weight)
      , 0);

    console.log("newTotalWeight", newTotalWeight);

    // Check if the total weight is equal to 100
    if (newTotalWeight !== 100) {
      toast.error("Tổng trọng số phải bằng 100");
      return;
    }
    const response = await axios.patch(`${BASE_API_URL}/rubric_evaluation/leader/updateById/${e.data._id}`, payload, { headers })
    if (response.data.statusCode == 200) {
      toast.success("Cập nhật thành công")
      setRubricEvaluation(_rubricEvaluation)
    } else {
      toast.error("Có lỗi xảy ra trong quá trình xử lý")
    }
  };
  const fetchData = useCallback(async () => {
    try {
      const category = await axios.get(`${BASE_API_URL}/topic_category/getAll`, { headers })
      const rubric = await axios.get(`${BASE_API_URL}/rubric/leader/findAll`, { headers })
      if (category.status === 200) {
        setTopicCategory(category.data.data.topic_categorys)
        setLoading(false)
      }
      if (rubric.status == 200) {
        setRubricList(rubric.data.data.rubrics)
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        // toast.error("Chưa có đợt đăng ký");
        window.history.back()
      } else {
        console.error(error);
      }
    }
  }, [setLoading, setTopicCategory, setRubricList]);

  const handleDelete = async (rubricID: string) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/rubric/leader/deleteById/${rubricID}`, { headers })
      setRubricList((prevRubrics) => prevRubrics.filter((rubric) => rubric._id !== rubricID));
      if (response.data.statusCode == 200) {
        toast.success("Xóa thành công")
      } else {
        toast.error(response.data.message)
      }

    } catch (error: any) {
      console.error("error", error);
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const topicCategories: IDropdown[] = topicCategory.map((item: ITopicCategory) => {
    return {
      name: item.topic_category_title,
      code: item._id
    }
  })

  const getSeverity = (rubric_category: number) => {
    switch (rubric_category) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'info';
    }
  };

  const rubricCategoryBodyTemplate = (rubric: IRubric) => {
    return (
      <Tag value={rubric.rubric_category === 1 && "Hướng dẫn" || rubric.rubric_category === 2 && "Phản biện" || rubric.rubric_category === 3 && "Hội đồng"} severity={getSeverity(rubric.rubric_category)} />
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base text-900 font-bold">Phiếu đánh giá</span>
      <div className="flex items-end gap-x-2">
        <Button size="small" icon="pi pi-plus" raised label="Phân công rubric" onClick={() => setShowAssignRubric(true)} />
        <Button size="small" icon="pi pi-plus" raised label="Tạo mới rubric" onClick={() => setOpen(true)} />
      </div>
    </div>
  );
  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng số phiếu đánh giá: {rubricList ? rubricList.length : 0}</span>
    </div>

  const actionBodyTemplate = (rubric: IRubric) => {
    return (
      <div className="flex justify-center gap-4 cursor-pointer">
        {rubric && rubric?.rubric_evaluations?.length <= 0 && <span className="pi pi-pencil hover:text-lime-500 cursor-pointer" onClick={() => {
          setShow(true)
          setRubricId(rubric._id)
        }} />}
        <span className="pi pi-eye hover:text-lime-500 cursor-pointer" onClick={() => {
          setShowDetailsEvaluation(true)
          setRubricEvaluation(rubric.rubric_evaluations)
          setRubricId(rubric._id)
        }} />
        <span className="pi pi-trash hover:text-amber-700 cursor-pointer" onClick={() => { handleDelete(rubric._id) }} />
      </div>
    );
  };

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <section className="card m-[1rem]">
      <Dialog header="Tạo phiếu đánh giá" visible={open} style={{ minWidth: '500px' }} onHide={() => setOpen(false)}>
        <LeaderCreateRubric />
      </Dialog>
      <DataTable
        className="text-sm"
        value={rubricList}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        header={header}
        footer={footer}
        tableStyle={{ minWidth: '50rem' }}
        selectionMode="single"
        selection={selectedRubric!}
        onSelectionChange={(e) => setSelectedRubric(e.value)}
        dataKey="_id"
        sortMode="single"
        sortField="createdAt"
        sortOrder={1}
      >
        <Column field="rubric_name" style={{ maxWidth: 200 }} align="left" sortable header="Tên phiếu" />
        <Column field="rubric_category" align="center" header="Dành cho" body={rubricCategoryBodyTemplate} />
        <Column field="rubric_evaluations.length" align="center" header="Tiêu chí" />
        <Column header="Hành động" align="center" body={actionBodyTemplate} />
      </DataTable>

      <Dialog header="Tiêu chí của phiếu đánh giá" visible={showDetailsEvaluation} style={{ minWidth: '50rem' }} onHide={() => {
        setShowDetailsEvaluation(false)
        setSelectedRubric(undefined)
      }}>
        {
          rubricEvaluation?.length > 0 ?
            <DataTable className="text-sm" value={rubricEvaluation} removableSort rows={10} rowsPerPageOptions={[5, 10]} tableStyle={{ minWidth: '50rem' }} dataKey="_id" onRowEditComplete={onRowEditComplete} editMode="row" >
              <Column field="serial" style={{ maxWidth: 20 }} align="center" header="STT" />
              <Column field="evaluation_criteria" editor={(options) => textEditor(options)} align="left" header="Tên tiêu chí" />
              <Column field="grading_scale" editor={(options) => numberEditor(options)} align="center" header="Thang điểm" />
              <Column field="weight" editor={(options) => numberEditor(options)} align="center" header="Trọng số" />
              <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable> : <span>Chưa có tiêu chí</span>
        }
      </Dialog>

      <Dialog header="Số lượng tiêu chí" visible={show} style={{ maxWidth: '400px' }} onHide={() => setShow(false)}>
        <div className="flex flex-col gap-y-2 mt-3">
          <InputNumber value={totalEvaluation} onValueChange={(e: InputNumberValueChangeEvent) => setTotalEvaluation(e.value as any)} showButtons buttonLayout="horizontal" step={1}
            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
        </div>
        <div className="flex items-center justify-center mt-4">
          <Button size="small" label="Xác nhận" icon="pi pi-plus" onClick={() => {
            setShow(false);
            setShowEvaluation(true)
          }}
          />
        </div>
      </Dialog>

      <Dialog header="Tạo tiêu chí" visible={showEvaluation} style={{ minWidth: 'fit-content' }} onHide={() => {
        setShowEvaluation(false)
        setActiveIndex(0)
        setTotalEvaluation(1)
        setEvaluationValues([])
      }} >
        <LeaderCreateEvaluation totalEvaluation={totalEvaluation} rubricId={rubricId} />
      </Dialog>
      <Dialog header="Gán phiếu đánh giá" visible={showAssignRubric} style={{ minWidth: 'fit-content' }} onHide={() => setShowAssignRubric(false)}>
        <RubricAssign rubricList={rubricList} />
      </Dialog>
    </section>
  );
};

export default LeaderListRubric;
