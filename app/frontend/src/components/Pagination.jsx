import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, paginate, className = "mt-16 flex justify-center gap-2 md:gap-3" }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={className}>
      <Button
        variant="secondary"
        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center p-0 disabled:opacity-30"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={20} />
      </Button>

      {[...Array(totalPages)].map((_, i) => (
        <Button
          key={i + 1}
          variant={currentPage === i + 1 ? 'primary' : 'secondary'}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center p-0 font-bold ${
            currentPage === i + 1 ? 'shadow-xl shadow-primary/30' : ''
          }`}
          onClick={() => paginate(i + 1)}
        >
          {i + 1}
        </Button>
      ))}

      <Button
        variant="secondary"
        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center p-0 disabled:opacity-30"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};

export default Pagination;
