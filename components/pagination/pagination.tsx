import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "@/types";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button
        className="p-2 bg-gray-200 rounded-full"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
      </button>
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentPage === page ? "bg-gray-700 text-white" : "text-gray-700"
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        className="p-2 bg-gray-200 rounded-full"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
