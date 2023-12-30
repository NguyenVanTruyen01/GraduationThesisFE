import FormGroup from '@/components/common/FormGroup';
import IconEyeToggle from '@/components/icons/IconEyeToggle';
import Input from '@/components/input/Input';
import Label from '@/components/label/Label';
import useToggleValue from '@/hooks/useToggleValue';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/app/hooks';
import { setUser } from '@/redux/authSlice';
import { useEffect } from 'react';
import { getUserLogin }
  from "@/utils/auth";
import { ILoginPayload, IUser } from "@/types/auth.type";
import Button from "@/components/button";

const schema = Yup.object({
  email: Yup.string()
    .email('Vui lòng nhập email đúng định dạng')
    .max(255, 'Số lượng quá lớn, vui lòng nhập lại')
    .required('Bạn cần nhập vào email'),
  password: Yup.string()
    .required('Bạn cần nhập mật khẩu')
    .min(6, 'Bạn cần nhập mật khẩu ít nhất 6 kí tự')
    .max(255, 'Số lượng quá lớn, vui lòng nhập lại'),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { value: showPassword, handleToggleValue: handleTogglePassword } =
    useToggleValue()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILoginPayload>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });


  const roleToRouteMap: any = {
    STUDENT: '/student/home',
    TEACHER: '/teacher/dashboard',
    LEADER: '/leader/dashboard',
  }

  let emailErrors: number = Number(errors?.email?.message?.length);
  let passwordErrors: number = Number(errors?.password?.message?.length)

  const user: IUser | null = JSON.parse(localStorage.getItem('user') || '{}')
  useEffect(() => {
    if (user?.role) {
      navigate(roleToRouteMap[user.role])
    }
  }, [])


  const handleSignIn = async (values: ILoginPayload) => {
    const data = await getUserLogin(values);

    if (data === null) {
      toast.error("Server hiện đang bảo trì . Bạn vui lòng quay trở lại sau . ")
    }

    if (data.statusCode === 200) {
      dispatch(setUser(data.data))
      toast.success("Đăng nhập thành công")
      const userRole: string = data.data.user.role
      const routeForRole = roleToRouteMap[userRole]
      if (routeForRole) {
        navigate(routeForRole);
      } else {
        navigate('*');
      }
    }
    else if (data.statusCode === 400) {
      toast.error("Sai email hoặc mật khẩu")

    }
    else {
      toast.error("Server hiện đang bảo trì . Bạn vui lòng quay trở lại sau . ")
    }
  };

  return (
    <div className='w-full min-h-screen bg-bgColor '>
      <motion.div className='flex items-center justify-center w-full min-h-screen login-container'>
        <motion.section
          className='flex items-center justify-center flex-1 left-section'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <motion.div
            className='bg-white rounded-3xl shadow w-full max-w-[556px] px-5 py-8 lg:px-12 lg:py-12 mx-auto'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <motion.div
              className='flex-col items-center justify-center mb-8'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1 }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <p className='mb-2 text-5xl font-bold text-center'>Đăng nhập</p>
              <p className='text-base font-semibold text-center text-fifth'>
                Bạn cần đăng nhập để tiếp tục
              </p>
            </motion.div>
            <motion.form
              onSubmit={handleSubmit(handleSignIn)}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1 }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <FormGroup>
                <Label htmlFor='email'>Địa chỉ email của bạn</Label>
                <Input
                  name='email'
                  type='email'
                  control={control}
                  placeholder='Nhập địa chỉ email...'
                ></Input>
                {emailErrors > 0 && (
                  <span className='text-sm font-semibold pointer-events-none text-error error-input'>
                    {errors.email?.message}
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor='password'>Mật khẩu của bạn</Label>
                <Input
                  name='password'
                  control={control}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu...'
                >
                  <IconEyeToggle
                    open={showPassword}
                    onClick={handleTogglePassword}
                  />
                </Input>
                {passwordErrors > 0 && (
                  <span className='text-sm font-semibold pointer-events-none text-error error-input'>
                    {errors.password?.message}
                  </span>
                )}
              </FormGroup>
              <Button
                className='mx-auto px-10 text-sm transition-opacity hover:bg-opacity-90 hover:text-black'
                kind='primary'
                type='submit'
              >
                Đăng nhập
              </Button>
            </motion.form>
          </motion.div>
        </motion.section>
        <motion.section
          className='flex-1 right-section'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <img className='' src='src/assets/images/login-image.png' alt='' />
        </motion.section>
      </motion.div>
    </div>
  );
};

export default SignInPage;
