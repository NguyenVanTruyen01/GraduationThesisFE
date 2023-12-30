import Container from '../common/Container';
import Search from './Search';
import UserMenu from './UserMenu';

const Navbar = () => {
  return (
    <div className='fixed z-10 w-full bg-white shadow-sm'>
      <div className='py-4 border-b-[1px]'>
        <Container>
          <div className='flex items-center justify-between gap-3 md:gap-0'>
            {/* <Logo /> */}
            <img
              loading='lazy'
              alt='Logo'
              className='w-[150px] h-[32px] hidden cursor-pointer md:block'
              src='https://fhqutex.hcmute.edu.vn/pluginfile.php/1/theme_maker/logo/1622737813/logo%20CLC.png'
            />
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
