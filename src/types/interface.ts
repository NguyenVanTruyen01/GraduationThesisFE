export interface IUser {
  _id: string
  email: string
  user_id: string
  user_name: string
  user_avatar: string
  user_date_of_birth: string
  user_CCCD: string
  user_phone: string
  user_permanent_address: string
  user_temporary_address: string
  user_department: string
  user_faculty: IFaculty
  user_major: IMajor
  role: string
  user_status: boolean
  createdAt: string
  updatedAt: string
  __v: number
  user_average_grade: number
  user_transcript: string
}


export interface IDropdown {
  name: string
  code: string
}

export interface IRegisterPeriod {
  _id: string
  registration_period_semester: RegistrationPeriodSemester
  registration_period_start: number
  registration_period_end: number
  registration_period_status: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface RegistrationPeriodSemester {
  _id: string
  school_year_start: string
  school_year_end: string
  semester: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IGroupStudent {
  _id: string
  group_member: GroupMember[]
  group_max_member: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface GroupMember {
  _id: string
  email: string
  user_id: string
  user_name: string
  user_avatar: string
  user_phone: string
  user_faculty: IFaculty
  user_major: IMajor
}

export interface IMajor {
  _id: string
  major_faculty: IMajorFaculty
  major_title: string
  major_description: string
  training_system: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IMajorFaculty {
  _id: string
  faculty_title: string
}


export interface IFaculty {
  _id: string
  faculty_title: string
  faculty_description: string
  createdAt: string
  updatedAt: string
  __v: number
  faculty_majors: any[]
}

export interface INotification {
  _id: string
  user_notification_title: string
  user_notification_sender: any
  user_notification_recipient: string
  user_notification_content: string
  user_notification_type: any
  user_notification_isRead: boolean
  user_notification_topic: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ITopic {
  _id: string
  topic_registration_period: ITopicRegistrationPeriod
  topic_title: string
  topic_description: string
  topic_creator: ITopicCreator
  topic_max_members: string
  topic_group_student: any[]
  topic_instructor: ITopicInstructor
  topic_reviewer: IReviewer
  topic_assembly: IAssembly
  topic_major: IMajor
  topic_category: ITopicCategory
  topic_teacher_status: string
  topic_advisor_request: any
  topic_defense_request: any
  topic_final_report: any
  createdAt: string
  updatedAt: string
  __v: number
  topic_leader_status: string
}

export interface ITopicRegistrationPeriod {
  _id: string
  registration_period_semester: string
  registration_period_start: number
  registration_period_end: number
  registration_period_status: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ITopicCreator {
  _id: string
  user_name: string
  user_avatar: string
  user_faculty: string
  user_major: string
}

export interface ITopicInstructor {
  email: any
  user_phone: any
  _id: string
  user_name: string
  user_avatar: string
  user_faculty: string
  user_major: string
}

export interface ITopicCategory {
  _id: string
  topic_category_title: string
  topic_category_description: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IReviewer {
  _id: string
  email: string
  password: string
  user_id: string
  user_name: string
  user_avatar: string
  user_date_of_birth: string
  user_CCCD: string
  user_phone: string
  user_permanent_address: string
  user_temporary_address: string
  user_department: string
  user_faculty: string
  user_major: string
  role: string
  user_status: boolean
  createdAt: string
  updatedAt: string
  __v: number
  totalReviewTopics: number
}


export interface ISemester {
  _id: string
  school_year_start: string
  school_year_end: string
  semester: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ITerm {
  registration_period_semester: ISemester
  registration_period_start: number
  registration_period_end: number
  registration_period_status: boolean
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IRubric {
  _id: string
  rubric_name: string
  rubric_category: number
  rubric_topic_category: IRubricTopicCategory
  rubric_evaluations: IRubricEvaluation[]
  rubric_note: string
  rubric_template: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IRubricTopicCategory {
  _id: string
  topic_category_title: string
  topic_category_description: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IRubricEvaluation {
  _id: string
  rubric_id: string
  serial: number
  evaluation_criteria: string
  grading_scale: number
  weight: any
  level_core: any
  note: string
  __v: number
  createdAt: string
  updatedAt: string
}

export interface IRubricEvaluationPayload {
  rubric_id: string
  serial: number
  evaluation_criteria: string
  grading_scale: number
  weight: any
  note: string
}

export interface IAssembly {
  _id: string
  chairman: IChairman
  secretary: ISecretary
  members: IMember[]
  createdAt: string
  updatedAt: string
  assembly_major: string
  __v: number
}

export interface IChairman {
  _id: string
  email: string
  user_id: string
  user_name: string
  user_avatar: string
  user_date_of_birth: string
  user_CCCD: string
  user_phone: string
  user_permanent_address: string
  user_temporary_address: string
  user_department: string
  user_faculty: string
  user_major: string
  role: string
  user_status: boolean
  createdAt: string
  updatedAt: string
  __v: number
  user_average_grade: any
}

export interface ISecretary {
  _id: string
  email: string
  user_id: string
  user_name: string
  user_avatar: string
  user_date_of_birth: string
  user_CCCD: string
  user_phone: string
  user_permanent_address: string
  user_temporary_address: string
  user_department: string
  user_faculty: string
  user_major: string
  role: string
  user_status: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IMember {
  _id: string
  email: string
  user_id: string
  user_name: string
  user_avatar: string
  user_date_of_birth: string
  user_CCCD: string
  user_phone: string
  user_permanent_address: string
  user_temporary_address: string
  user_department: string
  user_faculty: string
  user_major: string
  role: string
  user_status: boolean
  createdAt: string
  updatedAt: string
  __v: number
}
