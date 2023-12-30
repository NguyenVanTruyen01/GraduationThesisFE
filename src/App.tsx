import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LeaderGroupDetails from "./pages/leader/group/list";

const DetailHistoryTopic = lazy(() => import('./pages/teacher/topics/history/DetailHistoryTopic'))
const GroupDetailAccepts = lazy(() => import('./pages/teacher/groupdetailaccepts/GroupDetailAccepts'))
const TeacherReadyTopicsShow = lazy(() => import('./pages/teacher/topics/ready/show'))
const HistoryTopic = lazy(() => import('./pages/teacher/topics/history/HistoryTopic'))
const TeacherReviewTopicsShow = lazy(() => import('./pages/teacher/topics/reviewer/show'))
const TeacherTopicsProposedList = lazy(() => import('./pages/teacher/topics/proposed/list'))
const TeacherTopicsMySuggestList = lazy(() => import('./pages/teacher/topics/mysuggest/list'))
const TeacherReviewTopicsList = lazy(() => import('./pages/teacher/topics/reviewer/list'))
const TeacherTopicsPendingList = lazy(() => import('./pages/teacher/topics/pending/list'))
const LeaderTopicsApplicationList = lazy(() => import('./pages/leader/topics/application/list'))
const LeaderActiveTopicsShow = lazy(() => import('./pages/leader/topics/active/show'))
const LeaderTopicPendingShow = lazy(() => import('./pages/leader/topics/pending/show'))
const LeaderTopicsPendingList = lazy(() => import('./pages/leader/topics/pending/list'))
const LeaderApplicationTopicsShow = lazy(() => import('./pages/leader/topics/application/show'))
const LeaderAnalysisTopicsShow = lazy(() => import('./pages/leader/topics/analysis/show'))
const LeaderTopicsAnalysisList = lazy(() => import('./pages/leader/topics/analysis/list'))
const LeaderTopicList = lazy(() => import('./pages/leader/topics/all/list'))
const LeaderTopicsActiveList = lazy(() => import('./pages/leader/topics/active/list'))
const GroupDetailList = lazy(() => import('./pages/teacher/groupstudents/list'))
const TeacherPendingTopicsShow = lazy(() => import('./pages/teacher/topics/pending/show'))
const SignInPage = lazy(() => import('./pages/common/login'))
const SemesterList = lazy(() => import('./pages/leader/terms/semester/list'))
const UserCreate = lazy(() => import('./pages/common/create'))
const StudentList = lazy(() => import('./pages/leader/students/list'))
const LeaderProfile = lazy(() => import('./pages/leader/profile/Profile'))
const TeacherProfile = lazy(() => import('./pages/teacher/profile/Profile'))
const TeacherTopicsReadyList = lazy(() => import('./pages/teacher/topics/ready/list'))
const Topic = lazy(() => import('./pages/student/Topic/Topic'))
const TeacherList = lazy(() => import('./pages/leader/teachers/list'))
const SuggestTopic = lazy(() => import('./pages/student/SuggestTopic/SuggestTopic'))
const RegisterList = lazy(() => import('./pages/leader/terms/register/list'))
const NotFoundPage = lazy(() => import('./pages/common/notfound'))
const TeacherMentorTopicsList = lazy(() => import('./pages/teacher/topics/mentor/list'))
const LayoutException = lazy(() => import('./pages/student/LayoutException/LayoutException'))
const Home = lazy(() => import('./pages/student/Home/Home'))
const DetailTopic = lazy(() => import('./pages/student/DetailTopic/DetailTopic'))
const TeacherMentorTopicsShow = lazy(() => import('./pages/teacher/topics/mentor/show'))
const DashboardLayout = lazy(() => import('./components/modules/dashboard/layout/DashboardLayout'))
const Dashboard = lazy(() => import('./pages/leader/dashboard/Dashboard'))
const LeaderListRubric = lazy(() => import('./pages/leader/rubric/list'))
const LeaderListAssembly = lazy(() => import('./pages/leader/assembly/list'))
const TeacherAllTopicsList = lazy(() => import('./pages/teacher/topics/all/list'))
const TopicCreate = lazy(() => import('./pages/teacher/topics/create'))
const Loading = lazy(() => import('./components/loading/Loading'))
const EditProfile = lazy(() => import('./pages/student/EditProfile/EditProfile'))
const HistoryTopicLeader = lazy(() => import('./pages/leader/history/history'))
const TeacherReviewTopicsAssemblyList = lazy(() => import('./pages/teacher/topics/assembly/Assembly'))
const PreviewScore = lazy(() => import('./pages/student/Home/components/PreviewScore/PreviewScore'))
const LeaderStudentShow = lazy(() => import('./pages/leader/students/show'))
const RegisterCreate = lazy(() => import('./pages/leader/terms/register/create'))
const LeaderTeacherShow = lazy(() => import('./pages/leader/teachers/show'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherAllTopicsList />} />
          <Route path="/teacher/topic/create" element={<TopicCreate />} />
          <Route path="/teacher/topics/proposed" element={<TeacherTopicsProposedList />} />
          <Route path="/teacher/topics/pending" element={<TeacherTopicsPendingList />} />
          <Route path="/teacher/topics/ready" element={<TeacherTopicsReadyList />} />
          <Route path="/teacher/topics/pending/:topicID" element={<TeacherPendingTopicsShow />} />
          <Route path="/teacher/topics/mentor" element={<TeacherMentorTopicsList />} />
          <Route path="/teacher/topics/mentor/:topicID" element={<TeacherMentorTopicsShow />} />
          <Route path="/teacher/group/students/:groupID" element={<GroupDetailList />} />

          <Route path="/teacher/group/students-waitaccept/:topicID" element={<TeacherReadyTopicsShow />} />

          <Route path="/teacher/history/topics/:topicID" element={<DetailHistoryTopic />} />
          <Route path="/teacher/group/detail-waitaccept/:groupID" element={<GroupDetailAccepts />} />


          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/topics/review" element={<TeacherReviewTopicsList />} />
          <Route path="/teacher/topics/review/:id" element={<TeacherReviewTopicsShow />} />
          <Route path="/teacher/topics/mysuggest" element={<TeacherTopicsMySuggestList />} />

          <Route path="/teacher/history-topic" element={<HistoryTopic />} />

          <Route path="/teacher/topics/assembly" element={<TeacherReviewTopicsAssemblyList />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/leader/dashboard" element={<Dashboard />} />
          <Route path="/leader/topics" element={<LeaderTopicList />} />
          <Route path="/leader/topics/pending" element={<LeaderTopicsPendingList />} />
          <Route path="/leader/topics/pending/:topicID" element={<LeaderTopicPendingShow />} />
          <Route path="/leader/topics/active" element={<LeaderTopicsActiveList />} />
          <Route path="/leader/topics/active/:topicID" element={<LeaderActiveTopicsShow />} />

          <Route path="/leader/topics/analysis" element={<LeaderTopicsAnalysisList />} />
          <Route path="/leader/topics/analysis/:topicID" element={<LeaderAnalysisTopicsShow />} />
          <Route path="/leader/topics/application" element={<LeaderTopicsApplicationList />} />
          <Route path="/leader/topics/application/:topicID" element={<LeaderApplicationTopicsShow />} />
          <Route path="/leader/students" element={<StudentList />} />
          <Route path="/leader/students/:studentID" element={<LeaderStudentShow />} />
          <Route path="/leader/teachers" element={<TeacherList />} />
          <Route path="/leader/teachers/:teacherID" element={<LeaderTeacherShow />} />
          <Route path="/leader/user/create" element={<UserCreate />} />
          <Route path="/leader/terms" element={<RegisterList />} />
          <Route path="/leader/terms/create" element={<RegisterCreate />} />
          <Route path="/leader/semesters" element={<SemesterList />} />
          <Route path="/leader/topics/counter" />
          <Route path="/leader/profile" element={<LeaderProfile />} />
          <Route path="/leader/group/students/:groupID" element={<LeaderGroupDetails />} />
          <Route path="/leader/rubric" element={<LeaderListRubric />} />
          <Route path="/leader/history-topic" element={<HistoryTopicLeader />} />
          <Route path="/leader/assembly" element={<LeaderListAssembly />} />

        </Route>
        <Route path="/preview-score" element={<PreviewScore />} />
        <Route element={<DashboardLayout />}>
          <Route path="/student/home" element={<Home />} />
          <Route path="/student/profile" element={<EditProfile />} />
          <Route path="/student/topic" element={<Topic />} />
          <Route path="/student/exception" element={<LayoutException />} />
          <Route path="/student/suggest" element={<SuggestTopic />} />
          <Route path="/student/detail/:id" element={<DetailTopic />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App;
