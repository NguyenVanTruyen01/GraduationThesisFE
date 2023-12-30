import * as React from 'react';

interface IPaginationProps {
}

const Pagination: React.FC<IPaginationProps> = (props) => {
  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex">
          <li>
            <a className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#" aria-label="Previous">
              <span aria-hidden="true">«</span>
            </a>
          </li>
          <li>
            <a className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#">1</a>
          </li>
          <li aria-current="page">
            <a className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#">2</a>
          </li>
          <li>
            <a className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#">3</a>
          </li>
          <li>
            <a className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white" href="#" aria-label="Next"><span aria-hidden="true">»</span>
            </a>
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default Pagination;
