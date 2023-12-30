import Loading from "@/components/loading/Loading";
import { getToken } from "@/hooks/useGetToken";
import { IAssembly, ITopic } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";
import * as React from 'react';
import { useCallback, useEffect, useState } from "react";
import LeaderAssignDetailAssembly from "./assigndetail";
import { Button } from "primereact/button";
import toast from "react-hot-toast";

interface ILeaderAssignAssemblyProps {
  assembly: IAssembly | undefined
}

const headers = getToken("token")
const LeaderAssignAssembly: React.FC<ILeaderAssignAssemblyProps> = ({ assembly }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [showAssign, setShowAssign] = useState<boolean>(false)

  const [listTopic, setListTopic] = useState<ITopic[]>([])
  const [filterTopic, setFilterTopic] = useState<ITopic[]>([])
  const [selectedTopics, setSelectedTopics] = useState<ITopic[]>([])
  const [majorTitle, setMajorTitle] = useState()

  const convertMemberToNode = (member: any) => ({
    expanded: true,
    type: 'person',
    className: 'bg-indigo-500 text-white',
    style: { borderRadius: '12px' },
    data: {
      name: member?.user_name,
      title: "Ủy viên",
    },
  });

  const convertSecretaryToNode = (secretary: any) => ({
    expanded: true,
    type: 'person',
    className: 'bg-indigo-500 text-white',
    style: { borderRadius: '12px' },
    data: {
      name: secretary?.user_name,
      title: "Thư ký",
    },
    children: assembly?.members?.map(convertMemberToNode),
  });

  const convertChairmanToNode = (chairman: any) => ({
    expanded: true,
    type: 'person',
    className: 'bg-indigo-500 text-white',
    style: { borderRadius: '12px' },
    data: {
      name: chairman?.user_name,
      title: "Chủ tịch"
    },
    children: [
      convertSecretaryToNode(assembly?.secretary),
    ],
  });

  const treeData = convertChairmanToNode(assembly?.chairman);
  const [data] = useState<TreeNode[]>([treeData])

  const filterTopics = () => {
    const filteredTopics = listTopic.filter((topic) => {
      const instructorId = topic.topic_instructor?._id;
      const reviewerId = topic.topic_reviewer?._id;
      const chairmanId = assembly?.chairman?._id;
      const secretaryId = assembly?.secretary?._id;
      const topicAssemblyId = topic.topic_assembly?._id;

      return (
        instructorId !== chairmanId &&
        instructorId !== secretaryId &&
        reviewerId !== chairmanId &&
        reviewerId !== secretaryId &&
        topicAssemblyId !== assembly?._id
      );
    });

    setFilterTopic(filteredTopics);
  };

  useEffect(() => {
    filterTopics();
  }, [listTopic]);

  const fetchAllTopic = useCallback(async () => {
    try {
      const response = await axios.post(`${BASE_API_URL}/topics/leader/getTopicByFilter`, {
        filter: {
          topic_teacher_status: "REGISTERED",
          topic_leader_status: "ACTIVE"
        }
      }, { headers })
      if (response.data.statusCode === 200) {
        setListTopic(response.data.data.topics)
        setLoading(false)
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }, []);

  const fetchMajor = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/major/${assembly?.assembly_major}`, { headers })
      if (response.data.statusCode == 200) {
        setMajorTitle(response.data.data.major.major_title)
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }, [assembly?.assembly_major]);

  useEffect(() => {
    fetchAllTopic()
    fetchMajor()
  }, [fetchAllTopic, fetchMajor])

  const nodeTemplate = (node: any) => {
    if (node.type === 'person') {
      return (
        <div className="flex flex-col">
          <div className="flex flex-col items-center">
            <span className="font-bold mb-2">{node.data.name}</span>
            <span>{node.data.title}</span>
          </div>
        </div>
      );
    }
    return node.label;
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base text-900 font-bold">Đề tài : {majorTitle}</span>
    </div>
  );

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <section className="flex">
      <div className="card overflow-x-auto flex">
        <OrganizationChart value={data} nodeTemplate={nodeTemplate} />
        <div>
          <DataTable
            className="text-sm"
            value={filterTopic}
            removableSort
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10]}
            header={header}
            // footer={footer}
            selectionMode="multiple"
            selection={selectedTopics!}
            onSelectionChange={(e) => setSelectedTopics(e.value)}
            dataKey="_id"
            // onRowSelect={onRowSelect}
            tableStyle={{ minWidth: '50rem' }}
            size="small"
            emptyMessage="Không tìm thấy đề tài"
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" sortable header="Tên đề tài" />
            <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_instructor.user_name" sortable header="GVHD" />
            <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_reviewer.user_name" sortable header="GVPB" />
            <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_category.topic_category_title" header="Loại đề tài" />
          </DataTable>
          <div className="flex items-center justify-center mt-4">
            <Button onClick={() => setShowAssign(true)} label="Xác nhận" icon="pi pi-check-circle"/>
          </div>
        </div>
      </div>
      <div>
      </div>
      <Dialog header="Phân công chi tiết" visible={showAssign} style={{ minWidth: 'fit-content' }} onHide={() => setShowAssign(false)}>
        <LeaderAssignDetailAssembly topics={selectedTopics} assemblyId={assembly?._id} />
      </Dialog>
    </section>
  );
};

export default LeaderAssignAssembly;
