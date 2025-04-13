import { useState } from "react";
import PaginationLeftIcon from "../icons/PaginationLeftIcon";
import PaginationRightIcon from "../icons/PaginationRightIcon";

function Pagination({
  total,
  page,
  pageSize,
  onRowsPerChange,
  onPageChange,
  onNextPageClick,
  onPrevPageClick,
  options,
  resetFilters,
}) {
  const totalPages = Math.ceil(total / pageSize);

  function handleChangeOption(e) {
    onRowsPerChange(Number(e.target.value));
  }

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="w-full h-[30px] flex flex-col md:flex-row justify-between items-center">
      {/* Data Info */}
      <div className="text-[#464646] text-xs font-medium poppins-thin">
        {`Showing data ${(page - 1) * pageSize + 1} to ${Math.min(
          page * pageSize,
          total
        )} of ${total} leads`}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto">
        <select
          value={pageSize}
          onChange={handleChangeOption}
          className="h-6 px-2 py-1 bg-[#C9D1DB] rounded border border-[#d3d3d3] text-[#464646] text-xs font-medium"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          className="h-6 px-3 py-1 bg-[#C9D1DB] rounded border border-[#d3d3d3] text-[#464646] text-xs font-medium flex justify-center items-center"
          onClick={onPrevPageClick}
          disabled={page === 1}
        >
          <PaginationLeftIcon />
        </button>

        {getPageNumbers().map((p, index) =>
          p === "..." ? (
            <span key={index} className="text-[#4200a0] text-xs font-medium">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`h-6 px-3 py-1 rounded border text-xs text-[#464646] font-medium flex justify-center items-center ${
                p === page
                  ? "bg-[#C9D1DB] border-[#d3d3d3]"
                  : "bg-transparent border-transparent"
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="h-6 px-3 py-1 bg-[#C9D1DB] rounded border border-[#d3d3d3] text-[#464646] text-xs font-medium flex justify-center items-center"
          onClick={onNextPageClick}
          disabled={page === totalPages}
        >
          <PaginationRightIcon/>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
