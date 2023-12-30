import Loading from "@/components/loading/Loading";
import { getToken } from "@/hooks/useGetToken";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import './styles/dashboard.component.scss'
interface IDashboardProps {
}

const Dashboard: React.FC<IDashboardProps> = (props) => {
  const navigate = useNavigate()
  const [totalTopics, setTotalTopics] = useState([]);
  const [pendingTopics, setPendingTopics] = useState([])
  const [activeTopics, setActiveTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = getToken('token')

  const fetchData = useCallback(async () => {
    const total = await axios.get(`${BASE_API_URL}/topics/leader/getAll`, { headers });
    const pending = await axios.post(`${BASE_API_URL}/topics/leader/getTopicByFilter`, {
      "filter": {
        "topic_leader_status": "PENDING"
      }
    }, { headers });
    const active = await axios.post(`${BASE_API_URL}/topics/leader/getTopicByFilter`, {
      "filter": {
        "topic_teacher_status": "REGISTERED",
        "topic_leader_status": "ACTIVE"
      }
    }, { headers });

    setTotalTopics(total.data.data.topics);
    setPendingTopics(pending.data.data.topics);
    setActiveTopics(active.data.data.topics);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData()
  }, [fetchData]);

  const handleShowPendingTopics = () => {
    navigate('/leader/topics/pending')
  }
  const handleShowActiveTopics = () => {
    navigate('/leader/topics/active')
  }
  const handleShowAllTopics = () => {
    navigate('/leader/topics')
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <Fragment>
      <div className="pt-5 dashboard-component h-[100vh] px-3">
        <div className="grid grid-cols-4 gap-x-3">
          <div className="card mb-0" onClick={() => { handleShowAllTopics() }}>
            <div className="flex justify-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Tổng số đề tài</span>
                <div className="text-900 font-medium text-xl">{totalTopics.length}</div>
              </div>
              <div className="flex items-center justify-center bg-blue-100 rounded-2xl" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="fa-solid fa-book text-blue-500 text-xl" />
              </div>
            </div>
          </div>
          <div className="card mb-0" onClick={() => { handleShowPendingTopics() }}>
            <div className="flex justify-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Đề tài chờ duyệt</span>
                <div className="text-900 font-medium text-xl">{pendingTopics.length}</div>
              </div>
              <div className="flex items-center justify-center bg-orange-100 rounded-2xl" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="fa-solid fa-file-circle-question text-orange-500 text-xl" />
              </div>
            </div>
          </div>
          <div className="card mb-0" onClick={() => { handleShowActiveTopics() }}>
            <div className="flex justify-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Đề tài thực hiện</span>
                <div className="text-900 font-medium text-xl">{activeTopics.length}</div>
              </div>
              <div className="flex items-center justify-center bg-cyan-100 rounded-2xl" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="fa-solid fa-file-circle-check text-cyan-500 text-xl" />
              </div>
            </div>
          </div>
          <div className="card mb-0" onClick={() => { handleShowActiveTopics() }}>
            <div className="flex justify-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Đề tài hoàn thành</span>
                <div className="text-900 font-medium text-xl">0</div>
              </div>
              <div className="flex items-center justify-center bg-purple-100 rounded-2xl" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="fa-solid fa-circle-check text-purple-500 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
