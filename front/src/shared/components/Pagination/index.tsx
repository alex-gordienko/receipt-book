import React from 'react';
import { PaginationContainer, PaginationBlock, PaginationButton, CallPageButton } from './styled';

interface IPaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageSelect: (page: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  onPageSelect
}: IPaginationProps) => {
  const numberOfPages = Math.ceil(totalCount / pageSize);
  const pageNumbers = [...Array(numberOfPages + 1).keys()].slice(1);

  const onClickPage: React.MouseEventHandler<HTMLLIElement> = (event) => {
    onPageSelect(event.currentTarget.value)
  }

  const lastPage = pageNumbers[pageNumbers.length - 1];
  const croppedPages = pageNumbers.slice(1, -1);

  if (!pageNumbers.length || numberOfPages < 2) {
    return null
  }

  const renderMiddlewarePages = () => {
    const leftPagesToRender = currentPage >= 4 ? 2 : currentPage === 3 ? 1 : 0;
    const rightPagesToRender = currentPage <= croppedPages.length - 1 ? 2 : currentPage === croppedPages.length ? 1 : 0;

    const currentPageIndex = croppedPages.findIndex((page: number) => page === currentPage);

    const renderPages = croppedPages.map((page: number, index) => {
      if (index < currentPageIndex - leftPagesToRender || index > currentPageIndex + rightPagesToRender) {
        return null
      }
      return <PaginationButton selected={currentPage === page} onClick={onClickPage} key={page} value={page}>{page}</PaginationButton>
    })
    return (
      <>
        <>{leftPagesToRender && currentPageIndex > 2 ? '...' : null}</>
        <>{renderPages}</>
        <>{rightPagesToRender && currentPageIndex < croppedPages.length - 3 ? '...' : null}</>
      </>
    )
  }

  return (
    <PaginationContainer>
      <PaginationBlock>
        <CallPageButton onClick={() => onPageSelect(currentPage - 1)}>Back</CallPageButton>
        <PaginationButton selected={currentPage === 1} onClick={onClickPage} key={1} value={1}>1</PaginationButton>
        {renderMiddlewarePages()}
        { numberOfPages > 1 ? (
          <PaginationButton selected={currentPage === lastPage} onClick={onClickPage} key={lastPage} value={lastPage}>{lastPage}</PaginationButton>
        ) : null
        }
        <CallPageButton onClick={() => onPageSelect(currentPage + 1)}>Next</CallPageButton>
      </PaginationBlock>
    </PaginationContainer>
  )
}

export default Pagination