import { BiSearch } from 'react-icons/bi';

const Search = () => {
  return (
    <div className='border-[1px] w-full md:w-auto rounded-full shadow-sm hover:shadow-md transition cursor-pointer py-2'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600'>
          <input
            className='max-w-[300px]'
            type='text'
            placeholder='Search for your topics'
          />
          <div className='p-2 text-white rounded-full bg-rose-500'>
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
