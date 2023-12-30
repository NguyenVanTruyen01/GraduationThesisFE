import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles/suggest-topic.module.scss'
import StudentAPI from '@/apis/student/student.api'
import TopicStudentAPI from '@/apis/student/topic.api'
import { SubmitHandler, useForm } from 'react-hook-form'
import PeriodAPI from '@/apis/student/period.api'
import Notify from '@/utils/Toast'
import TeacherAPI from '@/apis/student/teacher.api'
import MajorAPI from '@/apis/student/major.api'
import TopicCategoryAPI from '@/apis/student/topic_categogy.api'
import Select from 'react-select'
import useStorage from '@/hooks/useStorage';
import { InputText } from 'primereact/inputtext';
import moment from 'moment';
import toast from 'react-hot-toast';
import NotFoundRecord from '../../../assets/images/not_found.png'
import Loading from '@/components/loading/Loading';
import { useNavigate } from "react-router-dom";
type Inputs = {
    topic_title: string
    topic_description: string
    topic_instructor: string
    student_id1: string
    student_id2: string
    student_id3: string
}

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];
const SuggestTopic = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const [listStudent, setListStudent] = useState([])

    const [listTeacher, setListTeacher] = useState([])

    const [period, setPeriod] = useState<string>("")

    const [periodInfo, setPeriodInfo] = useState<any>(null)

    const [selectedOptionStudent1, setSelectedOptionStudent1] = useState<any>(null);
    const [chooseOptionStudent1, setChooseOptionStudent1] = useState<any>(null);

    const [selectedOptionStudent2, setSelectedOptionStudent2] = useState<any>(null);
    const [chooseOptionStudent2, setChooseOptionStudent2] = useState<any>(null);


    const [selectedOptionStudent3, setSelectedOptionStudent3] = useState<any>(null);

    const [selectedOptionTeacher, setSelectedOptionTeacher] = useState<any>(null);
    const [chooseOptionTeacher, setChooseOptionTeacher] = useState<any>(null);

    const [selectedMajor, setSelectedMajor] = useState<any>(null);
    const [chooseOptionMajor, setChooseOptionMajor] = useState<any>(null);

    const [selectedTopicCategory, setSelectedTopicCategory] = useState<any>(null);
    const [chooseTopicCategory, setChooseTopicCategory] = useState<any>(null);



    let userLocal: any = useStorage.GetLocalStorage("user");

    let userOptionSelectDefault: any = userLocal !== null ? JSON.parse(userLocal) : null

    const { register, handleSubmit, watch, formState: { errors }, } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        try {

            console.log("newData:" + data.topic_title)
            console.log("newData:" + data.topic_description)
            console.log("newData:" + chooseOptionTeacher?.value)
            console.log("newData:" + chooseOptionStudent1?.value)
            console.log("newData:" + chooseOptionStudent2?.value)
            console.log("newData:" + userOptionSelectDefault?._id)
            console.log("newData:" + data.topic_title)
            let newData =
            {
                "topic_registration_period": period,
                "topic_title": data.topic_title,
                "topic_description": data.topic_description,
                "topic_instructor": chooseOptionTeacher?.value,
                "topic_major": chooseOptionMajor.value,
                "topic_category": chooseTopicCategory.value,
                "topic_group_student": [userOptionSelectDefault?._id, chooseOptionStudent1 !== null ? chooseOptionStudent1?.value : null, chooseOptionStudent2 !== null ? chooseOptionStudent2?.value : null].filter((item) => item !== null && item.length > 0 && item !== undefined)
            }

            console.log("newData:" + newData)


            await TopicStudentAPI.suggestTopic(newData).then((result: any) => {
                if (result?.statusCode === 200) {
                    toast.success(result?.message)
                    navigate("/student/home")
                }
                else {
                    Notify("Đề xuất đề tài thất bại . Bạn vui lòng kiểm tra lại thông tin .")
                }
            })
                .catch((error) => {
                    Notify(`Đề xuất đề tài thất bại .${error.response?.data?.message}`)
                })

        } catch (error: any) {
            Notify(`Đề xuất đề tài thất bại .${error.response?.data?.message}`)
        }
    }
    const fetchAllStudent = useCallback(async () => {
        return await StudentAPI.getAllStudent()
    }, [])

    const fetchAllTeacher = useCallback(async () => {
        return await TeacherAPI.getAllTeacher();
    }, [])

    const fetchGetPeriod = useCallback(async () => {
        return await PeriodAPI.getPeriod();
    }, [])

    const fetchMajor = useCallback(async () => {
        return await MajorAPI.getAllMajor();
    }, [])

    const fetchTopicCategory = useCallback(async () => {
        return await TopicCategoryAPI.getAllTopicCategory();
    }, [])


    const handleChange1 = (selectedOptionStudent1: any) => {
        setSelectedOptionStudent1(selectedOptionStudent1)
    };
    const handleChange2 = (selectedOptionStudent2: any) => {
        setSelectedOptionStudent2(selectedOptionStudent2)
    };

    const handleChange3 = (selectedOptionStudent3: any) => {
        setSelectedOptionStudent3(selectedOptionStudent3)
    };

    useEffect(() => {
        fetchAllStudent().then((result: any) => {
            if (result?.statusCode === 200) {
                setListStudent(result?.data?.users)

                if (result?.data?.users?.length > 0) {
                    let formatStudent: any = [];
                    for (const x of result?.data?.users) {
                        let item = { value: x?._id, label: x?.user_name + " - " + x?.email }
                        formatStudent.push(item);
                    }
                    setSelectedOptionStudent1(formatStudent)
                    setSelectedOptionStudent2(formatStudent)
                    setSelectedOptionStudent3(formatStudent)
                }
            }
            else {
                Notify("Lỗi server đang bảo trì . Bạn vui lòng quay trở lại sau.");
            }
        })

        fetchMajor().then((result: any) => {
            if (result?.statusCode === 200) {

                console.log("result?.data", result?.data?.majors)

                if (result?.data?.majors?.length > 0) {
                    let formatMajor: any = [];
                    for (const x of result?.data?.majors) {
                        let item = { value: x?._id, label: x?.major_title }
                        formatMajor.push(item);
                    }
                    setSelectedMajor(formatMajor)
                }
            }
        })

        fetchTopicCategory().then((result: any) => {
            if (result?.statusCode === 200) {

                if (result?.data?.topic_categorys?.length > 0) {
                    let formatTopicCategory: any = [];
                    for (const x of result?.data?.topic_categorys) {
                        let item = { value: x?._id, label: x?.topic_category_title }
                        formatTopicCategory.push(item);
                    }
                    setSelectedTopicCategory(formatTopicCategory)
                }
            }
        })

        fetchAllTeacher().then((result: any) => {
            if (result?.statusCode === 200) {
                console.log("Json teacher:" + JSON.stringify(result))
                setListTeacher(result?.data?.users)

                if (result?.data?.users?.length > 0) {
                    let formatTeacher: any = [];
                    for (const x of result?.data?.users) {
                        let item = { value: x?._id, label: x?.user_name + " - " + x?.email }
                        formatTeacher.push(item);
                    }
                    setSelectedOptionTeacher(formatTeacher)
                }
            }
            else {
                Notify("Lỗi server đang bảo trì Teacher. Bạn vui lòng quay trở lại sau.");
            }
        })
            .catch((err: any) => {
                Notify("Lỗi server đang bảo trì Teacher 1. Bạn vui lòng quay trở lại sau.");
            })

        fetchGetPeriod().then((result: any) => {
            if (result?.statusCode === 200) {
                setPeriod(result?.data?.registration_period?._id)
                setPeriodInfo(result?.data?.registration_period)
                setLoading(false)
            }
            else {
                setLoading(false)
                Notify("Hiện tại bạn chưa đến đợt đăng kí bạn vui lòng quay lại sau.")
            }
        }).catch((err) => {
            setLoading(false)
        });

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
                    <div className={styles.suggestTopic} >
                        <div className={`${styles.headerTopic} w-100 item-btw`}>
                            <div className={styles.search}>
                                <h2 className={styles.titleForm}>ĐỀ XUẤT ĐỀ TÀI VỚI GIẢNG VIÊN</h2>
                            </div>
                            <div className={`${styles.info} item-btw`}>

                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-spin pi-cog text-green-500"></i>
                                    </span>
                                    <InputText placeholder="Hoc ky"
                                        disabled
                                        className="text-sm"
                                        value={period !== null ? periodInfo?.registration_period_semester?.semester + " - " + periodInfo?.registration_period_semester?.school_year_start + "/" + periodInfo?.registration_period_semester?.school_year_end : ""}
                                    />
                                </div>

                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-clock text-green-500"></i>
                                    </span>
                                    <InputText
                                        disabled
                                        className="text-sm text-center"
                                        value={moment(periodInfo?.registration_period_start, 'YYYYMMDD').format("DD/MM/YYYY")}
                                    />
                                </div>

                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-clock text-orange-500"></i>
                                    </span>
                                    <InputText
                                        disabled
                                        className="text-sm text-center"
                                        value={moment(periodInfo?.registration_period_end, 'YYYYMMDD').format("DD/MM/YYYY")}
                                    />

                                </div>

                            </div>
                        </div>
                        <div className={styles.mainRegister}>
                            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                                <h2 className={styles.titleForm}>MẪU ĐỀ XUẤT</h2>
                                <div className={`${styles.row1} item-btw`}>
                                    <div className={styles.item}>
                                        <p className={styles.label}>Tên đề tài <span className={styles.require}>*</span></p>
                                        <input className="text-sm outline outline-2 outline-offset-2"  {...register("topic_title")} required placeholder='Bạn vui lòng nhập tên đề tài ....' />
                                    </div>
                                </div>

                                <div className={`${styles.row1} item-btw`}>
                                    <div className={styles.item}>
                                        <p className={styles.label}>Giảng viên hướng dẫn <span className={styles.require}>*</span></p>
                                        <Select
                                            isClearable
                                            isSearchable
                                            name="dog"
                                            className="text-sm"
                                            menuPlacement="top"
                                            options={selectedOptionTeacher}
                                            placeholder="Chọn giảng viên"
                                            onChange={(selectedOption) => {
                                                setChooseOptionTeacher(selectedOption)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={`${styles.row5} item-btw w-100`}>
                                    <div className={styles.item}>
                                        <p className={styles.label}>Chuyên ngành <span className={styles.require}>*</span></p>
                                        <Select
                                            isClearable
                                            isSearchable
                                            name="major"
                                            className="text-sm"
                                            menuPlacement="top"
                                            placeholder="Chọn chuyên ngành"
                                            options={selectedMajor}
                                            onChange={(selectedOption) => {
                                                setChooseOptionMajor(selectedOption)
                                            }}
                                        />

                                    </div>
                                    <div className={styles.item}>
                                        <p className={styles.label}>Loại đề tài <span className={styles.require}>*</span></p>
                                        <Select
                                            isClearable
                                            isSearchable
                                            name="topic_category"
                                            className="text-sm"
                                            menuPlacement="top"
                                            placeholder="Chọn loại đề tài"
                                            options={selectedTopicCategory}
                                            onChange={(selectedOption) => {
                                                setChooseTopicCategory(selectedOption)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={`${styles.row2} `}>
                                    <div className={styles.item}>
                                        <p className={styles.label}>Mô tả chi tiết đề tài<span className={styles.require}>*</span></p>
                                        <textarea className="text-sm"   {...register("topic_description")} required placeholder='Viết mô tả đề tài hoặc tính năng của đề tài ....' />
                                    </div>
                                </div>
                                <div className={`${styles.row3} item-btw w-100`}>
                                    <div className={styles.item}>
                                        <p className={styles.label}>Sinh viên 1</p>
                                        <Select
                                            defaultValue={{
                                                value: userOptionSelectDefault?._id,
                                                label: userOptionSelectDefault?.user_name + " - " + userOptionSelectDefault?.user_id
                                            }}
                                            isDisabled
                                            className="text-sm"
                                            menuPlacement="top"
                                            onChange={handleChange1}
                                            options={selectedOptionStudent1}
                                            isClearable

                                        />

                                    </div>
                                    <div className={styles.item}>
                                        <p className={styles.label}>Sinh viên 2</p>

                                        <Select
                                            isClearable
                                            isSearchable
                                            name="student"
                                            className="text-sm"
                                            menuPlacement="top"
                                            placeholder="Chọn sinh viên"
                                            options={selectedOptionStudent2}
                                            onChange={(selectedOption) => {
                                                setChooseOptionStudent1(selectedOption)
                                            }}
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <p className={styles.label}>Sinh viên 3</p>

                                        <Select
                                            isClearable
                                            isSearchable
                                            name="student3"
                                            className="text-sm"
                                            menuPlacement="top"
                                            placeholder="Chọn sinh viên"
                                            options={selectedOptionStudent3}
                                            onChange={(selectedOption) => {
                                                setChooseOptionStudent2(selectedOption)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.row4}>
                                    <button className={styles.btnRegister}><i className="fa-solid fa-check"></i> GỬI ĐỀ XUẤT</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    :
                    <div className={`${styles.notFoundTopic} item-center`}>
                        <div className={styles.image}>
                            <img src={NotFoundRecord} alt="Not found" >
                            </img>
                            <div className={styles.noty} >KHÔNG CÓ ĐỢT ĐĂNG KÝ!</div>s
                        </div>
                    </div>
            }
        </>
    )
}

export default SuggestTopic