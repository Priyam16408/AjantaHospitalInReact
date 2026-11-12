import React from 'react';
import classnames from 'classnames';
import { usePagination } from './usePagination';
import "./pagination.css";

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;



  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });


  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange?.length - 1];
  return (
    <div
      className={classnames('pagination-container', { [className]: className })}
    >
       {/* Left navigation arrow */}
      <td
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </td>
      {paginationRange?.map(pageNumber => {
         
        // If the pageItem is a DOT, render the DOTS unicode character
        // if (pageNumber === DOTS) {
        //   return <li className="pagination-item dots">&#8230;</li>;
        // }
		
        // Render our Page Pills
        return (
          <div
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </div>
        );
      })}
      {/*  Right Navigation arrow */}
      <div
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </div>
    </div>
  );
};

export default Pagination;