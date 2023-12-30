import { useCallback, useRef, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import MenuItem from './MenuItem';
import Avatar from '../common/Avatar';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectAuth } from '@/redux/authSlice';
import { toast } from 'react-hot-toast';
import { useClickOutside } from "primereact/hooks";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(selectAuth);
  const token = JSON.parse(localStorage.getItem('token') || '{}');
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  let urlProfile: string = ""

  switch (user?.role) {
    case 'STUDENT':
      urlProfile = "/student/profile"
      break;
    case 'TEACHER':
      urlProfile = "/teacher/profile"
      break;
    case 'LEADER':
      urlProfile = "/leader/profile"
      break;
    default:
      break;
  }
  // if (user?.role && user?.role === 'STUDENT') {
  //   urlProfile = "/student/profile"
  // }
  // if (user?.role && user?.role === 'TEACHER') {
  //   urlProfile = "/teacher/profile"
  // }
  // if (user?.role && user?.role === 'LEADER') {
  //   urlProfile = "/leader/profile"
  // }
  const name = user?.user_name

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
    toast.success("Đăng xuất thành công")
  }

  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);

  useClickOutside(overlayRef, () => {
    setIsOpen(false);
  });

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <div className='relative'>
      <div className='flex flex-row items-center gap-3'>
        <div className='hidden px-4 py-3 text-sm font-semibold text-black transition rounded-full cursor-pointer md:block hover:bg-neutral-100'>
          {name || 'Hey, Guest'}
        </div>
        <div
          onClick={toggleOpen}
          className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition '
        >
          <AiOutlineMenu color="black" />
          <div className='hidden md:block'>
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div ref={overlayRef} className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
          <div className='flex flex-col cursor-pointer'>
            <MenuItem
              label='Thông tin cá nhân'
              onClick={() => navigate(urlProfile)}
            />
            <>
              {token ? (
                <MenuItem label='Log out' onClick={() => handleLogout()} />
              ) : (
                <MenuItem
                  label='Sign in'
                  onClick={() => {
                    navigate('/login');
                  }}
                />
              )}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
