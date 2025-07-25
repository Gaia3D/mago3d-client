import React, { useState, useEffect } from "react";

interface Props {
  page: number;
  totalPages: number;
  pageSize: number;
  onChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const InputPagination = ({
 page,
 totalPages,
 pageSize,
 onChange,
 onPageSizeChange,
}: Props) => {
  const [inputPage, setInputPage] = useState(page + 1); // 1-based

  useEffect(() => {
    setInputPage(page + 1);
  }, [page]);

  const handleMove = () => {
    const target = Math.max(1, Math.min(totalPages, inputPage));
    onChange(target - 1);
  };

  const renderPages = () => {
    const pages: React.ReactNode[] = [];
    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages, start + 5);

    for (let i = start; i < end; i++) {
      const isActive = i === page;
      pages.push(
        <button
          key={i}
          onClick={() => onChange(i)}
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
          onClick={() => onChange(totalPages - 1)}
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
      {/* 1. 이전/다음 */}
      <div className="page-nav-row">
        <button onClick={() => onChange(page - 1)} disabled={page === 0}>
          &lt; 이전
        </button>
        <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1}>
          다음 &gt;
        </button>
      </div>

      {/* 2. 페이지 번호 */}
      <div className="page-number-row">{renderPages()}</div>

      {/* 3. 페이지 이동 및 사이즈 선택 */}
      <div className="page-control-row">
        <div className="page-size-box">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
            min={1}
            max={totalPages}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleMove();
            }}
          />
          <span>/ {totalPages}</span>
          <button onClick={handleMove}>이동</button>
        </div>
      </div>
    </div>
  );
};

export default InputPagination;
