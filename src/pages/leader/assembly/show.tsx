import Loading from "@/components/loading/Loading";
import { getToken } from "@/hooks/useGetToken";
import { IAssembly, ITopic } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import * as React from 'react';
import { useCallback, useEffect, useState } from "react";

interface ILeaderShowAssemblyProps {
  assembly: IAssembly | undefined
}

const LeaderShowAssembly: React.FunctionComponent<ILeaderShowAssemblyProps> = ({ assembly }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [listTopics, setListTopics] = useState<ITopic[]>([])

  const headers = getToken("token")

  const fetchTopicsOfAssembly = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/topics/leader/getTopicByFilter`,
        {
          filter: {
            topic_assembly: assembly?._id,
          },
        },
        { headers }
      );
      console.log("response", response);
      if (response.data.statusCode === 200) {
        setListTopics(response.data.data.topics);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [assembly]);

  useEffect(() => {
    fetchTopicsOfAssembly()
  }, [fetchTopicsOfAssembly])

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base text-900 font-bold">Danh sách đề tài</span>
    </div>
  );
  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng số đề tài: {listTopics ? listTopics.length : 0}</span>
    </div>


  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <DataTable
        className="text-sm"
        value={listTopics}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        header={header}
        footer={footer}
        tableStyle={{ minWidth: '50rem' }}
        selectionMode="single"
        dataKey="_id"
        sortMode="single"
        sortField="createdAt"
        sortOrder={1}
        size="small"
      >
        <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" header="Tên đề tài" />
        <Column field="topic_instructor.user_name" header="GVHD" />
        <Column field="topic_reviewer.user_name" header="GVPB" />
        <Column field="topic_room" header="Phòng" />
        <Column field="topic_date" header="Ngày bảo vệ" />
        <Column field="topic_time_start" header="Bắt đầu" />
        <Column field="topic_time_end" header="Kết thúc" />
      </DataTable>
    </div>
  );
};

export default LeaderShowAssembly;
