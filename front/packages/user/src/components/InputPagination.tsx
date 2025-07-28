import {Pagination} from "@/types/PrintArea.ts";
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";

interface InputPaginationProps {
  pagination: Pagination;
  setPagination: Dispatch<SetStateAction<Pagination>>;
}

const InputPagination = ({ pagination, setPagination }: InputPaginationProps) => {
  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);
  const [inputPage, setInputPage] = useState(pagination.page + 1);

  useEffect(() => {
    setInputPage(pagination.page + 1);
  }, [pagination.page]);

  const handleMove = () => {
    const target = Math.max(1, Math.min(totalPages, inputPage));
    setPagination(prev => ({ ...prev, page: target - 1 }));
  };

  const renderPages = () => {
    const pages: ReactNode[] = [];
    const start = Math.max(0, pagination.page - 2);
    const end = Math.min(totalPages, start + 5);

    for (let i = start; i < end; i++) {
      const isActive = i === pagination.page;
      pages.push(
        <button
          key={i}
          onClick={() => setPagination(prev => ({
            ...prev,
            page: i
          }))}
          className={`page-btn ${isActive ? "active" : ""}`}
        >
          {i + 1}
        </button>
      );
    }

    if (end < totalPages) {
      pages.push(<span key="ellipsis">...</span>);
      pages.push(
        <button
          key="last"
          onClick={() => setPagination(prev => ({
            ...prev,
            page: totalPages - 1
          }))}
          className="page-btn"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="input-pagination">
      <div className="page-nav-row">
        <button onClick={() => setPagination(p => ({...p, page: p.page - 1}))} disabled={pagination.page === 0}>
          &lt; 이전
        </button>
        <button onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                disabled={pagination.page >= totalPages - 1}>
          다음 &gt;
        </button>
      </div>

      <div className="page-number-row">
        {renderPages()}
      </div>

      <div className="page-control-row">
        <div className="page-size-box">
          <select
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination(prev => ({
                ...prev,
                pageSize: Number(e.target.value),
                page: 0,
              }))
            }
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}개씩 보기
              </option>
            ))}
          </select>
        </div>
        <div className="goto-box">
          <input
            type="number"
            value={inputPage}
            onChange={(e) => setInputPage(Number(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && handleMove()}
          />
          <button onClick={handleMove}>이동</button>
        </div>
      </div>
    </div>
  );
};

export default InputPagination;
