import { BASE_API_URL } from "@/utils/globalVariables";

const Avatar = () => {

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const avatar = user?.user_avatar
  return (
    <img
      className='rounded-full'
      height='30'
      width='30'
      alt='avatar'
      src={avatar !== null ? `${BASE_API_URL}/${avatar}` : "/public/avatar.jpg"}
      style={{objectFit: "cover", width: '30px', height: '30px'}}

    />
  );
};

export default Avatar;
