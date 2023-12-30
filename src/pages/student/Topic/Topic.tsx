import { useCallback, useEffect, useState } from 'react'
import styles from './styles/styles.module.scss'
import Register from './components/Register/Register'
import DetailRegister from './components/DetailRegister/DetailRegister'
import { Link, useParams } from 'react-router-dom'
import TopicStudentAPI from '@/apis/student/topic.api'
import PeriodAPI from '@/apis/student/period.api'
import Notify from '@/utils/Toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import NotFoundRecord from '../../../assets/images/not_found.png'
import Image from '@/components/image/Image'
import React from 'react'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import moment from 'moment'
import Loading from '@/components/loading/Loading'

const Topic = () => {

  const [loading, setLoading] = useState(true)

  const [listTopic, setListTopic] = useState([])

  const [period, setPeriod] = useState<any>(null)

  let [openFormRegister, setOpenFormRegister] = useState<Boolean>(false)

  let [openDetailRegister, setOpenDetailRegister] = useState<Boolean>(false)

  const [globalFilterValue, setGlobalFilterValue] = useState<any>('');

  const [filters, setFilters] = useState<any>(null);

  const handleOpenFormRegister = () => {
    setOpenFormRegister(true)
  }
  const handleCloseFormRegister = () => {
    setOpenFormRegister(false)
  }

  const handleOpenFormDetailRegister = () => {
    setOpenDetailRegister(true)
  }

  const handleCloseFormDetailRegister = () => {
    setOpenDetailRegister(false)
  }

  const fetchAllTopic = useCallback(async () => {
    return await TopicStudentAPI.getAllTopicTeacher();
  }, [])

  const fetchGetPeriod = useCallback(async () => {
    return await PeriodAPI.getPeriod();
  }, [])

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Link to={`/student/detail/${rowData._id} `}>
        <button className={`${styles.editBtn} item-center`}>
          <i className="fa-solid fa-pen hover:text-blue-500" />
        </button>
      </Link>
    );
  }

  const countGroupStudent = (topic: any) => {
    return (
      <span>{topic?.topic_group_student.length > 0 ? topic?.topic_group_student.length : 0}</span>
    )
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-base text-900 font-bold">Danh sách đề tài</span>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          className="p-inputtext-sm"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Tìm kiếm" /
        >
      </span>
    </div>
  );

  const footer = `Tổng cộng ${listTopic ? listTopic.length : 0} đề tài.`;

  useEffect(() => {

    fetchAllTopic()
      .then((result: any) => {
        console.log("sdsdsd")
        if (result?.statusCode === 200) {
          console.log("Test" + JSON.stringify(result))
          setListTopic(result?.data?.topics)
        }
      })

    fetchGetPeriod().then((result: any) => {
      if (result?.statusCode === 200) {
        setLoading(false)
        setPeriod(result?.data?.registration_period)
      }
      else {
        setLoading(false)
        Notify("Hiện tại chưa mở đợt đăng kí nào . Bạn vui lòng quay trở lại sau.");
      }
    }).catch(error => {
      setLoading(false)
    })

    initFilters();

  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <>
      {
        period ?
          <>
            <div className={`${styles.headerTopic} w-100 item-btw text-sm`}>
              <div className={styles.search}>
                <h3 className={styles.title}>DANH SÁCH ĐỀ TÀI</h3>
              </div>
              <div className={`${styles.info} item-btw`}>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-spin pi-cog text-green-500"></i>
                  </span>
                  <InputText placeholder="Hoc ky"
                    disabled
                    className="text-sm"
                    value={period !== null ? period?.registration_period_semester?.semester + " - " + period?.registration_period_semester?.school_year_start + "/" + period?.registration_period_semester?.school_year_end : ""}
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock text-green-500"></i>
                  </span>
                  <InputText
                    disabled
                    className="text-sm text-center"
                    value={moment(period?.registration_period_start, 'YYYYMMDD').format("DD/MM/YYYY")}
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock text-orange-500"></i>
                  </span>
                  <InputText
                    disabled
                    className="text-sm text-center"
                    value={moment(period?.registration_period_end, 'YYYYMMDD').format("DD/MM/YYYY")}
                  />
                </div>

              </div>

              <div className={styles.listBtn}>
                <Link to="/student/suggest"><button className={styles.btnCreate} onClick={handleOpenFormRegister}><i className="fa-solid fa-book"></i> &nbsp; Đề xuất </button></Link>
              </div>
            </div>
            <div className={styles.topic}>
              <>
                <div className={styles.listTable}>

                  <DataTable
                    className="rounded-xl text-sm"
                    value={listTopic}
                    removableSort
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10]}
                    header={header}
                    footer={footer}
                    filters={filters}
                    globalFilterFields={[
                      'topic_title',
                      'topic_creator.user_name',
                      'topic_max_members',
                      'topic_major.major_title',
                      'topic_category.topic_category_title'
                    ]}
                    emptyMessage="Chưa có đề tài nào."
                    tableStyle={{ minWidth: '50rem' }}>
                    <Column style={{ minWidth: '8rem' }} header="Ghi danh" body={actionBodyTemplate} className='text-center' />
                    <Column style={{ minWidth: '20rem' }} field="topic_title" sortable header="Tên đề tài" />
                    <Column style={{ minWidth: '10rem' }} field="topic_creator.user_name" sortable header="GVHD " />
                    <Column style={{ minWidth: '12rem' }} field="topic_major.major_title" sortable header="Chuyên ngành" />
                    <Column style={{ minWidth: '10rem' }} field="topic_category.topic_category_title" sortable header="Loại đề tài" />
                    <Column style={{ minWidth: '10rem' }} field="topic_max_members" sortable header="Tối đa SVTT" />
                    <Column style={{ minWidth: '10rem' }} field="topic_max_members" body={countGroupStudent} sortable header="Số nhóm đã đăng ký" />
                  </DataTable>
                </div>
              </>
            </div>
          </>
          :
          <div className={`${styles.notFoundTopic} item-center`}>
            <div className={styles.image}>
              <img src={NotFoundRecord} alt="Not found" >
              </img>
              <div className={styles.noty} >KHÔNG CÓ ĐỢT ĐĂNG KÝ!</div>s
            </div>
          </div>
      }
      {openFormRegister === true ? <Register handleClose={handleCloseFormRegister} /> : <></>}
      {openDetailRegister === true ? <DetailRegister handleClose={handleCloseFormDetailRegister} /> : <></>}
    </>
  )
}

export default Topic