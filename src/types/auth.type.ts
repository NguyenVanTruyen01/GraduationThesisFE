import { IDropdown } from "../types/interface";

export interface IUser {
  name: string | null;
  token: string | null;
  email: string | null;
  user_id: string | null;
  user_name: string | null;
  avatar: string | null;
  user_date_of_bỉrth: string | null;
  CCCD?: string | null;
  role: string | null;
}

interface IData {
  message: string;
  token: string;
  user: IUser
}

export interface IServerLogin {
  statusCode: number;
  data: IData
}

export interface ILoginPayload {
  email: string;
  password: string;
}
export interface IRegisterPayload {
  _id?: string
  email?: string
  user_id?: string
  password?: string
  user_name?: string
  user_avatar?: string
  user_date_of_birth?: string
  user_CCCD?: string
  user_phone?: string
  user_permanent_address?: string
  user_temporary_address?: string
  user_department?: string
  user_faculty?: IDropdown
  user_major?: IDropdown
  role?: IDropdown
  user_status?: boolean
  createdAt?: string
  updatedAt?: string
  __v?: number
  user_average_grade?: number
  user_transcript?: string
}

export interface Topics {
  _id: string
  topic_registration_period: any
  topic_title: string
  topic_description: string
  topic_creator: TopicCreator
  topic_max_members: number
  topic_group_student: any[]
  topic_instructor: any
  topic_reviewer: any
  topic_assembly: any
  topic_teacher_status: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface TopicCreator {
  _id: string
  user_name: string
  user_avatar: string
  user_faculty: string
  user_major: string
}
