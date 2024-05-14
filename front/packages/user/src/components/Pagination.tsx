import {FC} from "react";
import {SetterOrUpdater} from "recoil";

type PaginationProps = {
    page: number;
    totalPages: number;
    pagePerCount?: number;
    handler: SetterOrUpdater<number> | ((pageNum: number) => void);
    zeroBase?: boolean;
    styleProps?: React.CSSProperties;
    className?: string;
};

const Pagination: FC<PaginationProps> = ({
    page: currentPage,
    totalPages,
    pagePerCount = 10,
    handler,
    zeroBase = true,
    styleProps = {},
    className = 'paging',
}) => {
    if(zeroBase) currentPage++
    const baseNumber = zeroBase ? 0 : 1;
    const getPageProps = (num:number):number => zeroBase ? num-1 : num;

    if(pagePerCount > totalPages) pagePerCount = totalPages;
    //const pageGroup = Math.ceil(currentPage/pagePerCount);
    const pagePerGroup = 6;
    const pageGroup = Math.ceil(currentPage / pagePerGroup);

    /*
    let lastNumber = pageGroup * pagePerCount;
    if(lastNumber > totalPages) lastNumber = totalPages;

    const firstNumber = lastNumber - (pagePerCount-1);
    */

    const firstNumber = (pageGroup - 1) * pagePerGroup + 1;
    let lastNumber = pageGroup * pagePerGroup;
    if (lastNumber > totalPages) lastNumber = totalPages;

    const next = lastNumber + 1;
    const prev = firstNumber - 1;

    //const pageNumbers = Array.from( { length: (lastNumber-firstNumber) + 1 }, ( _, k)=>k+firstNumber);
    const pageNumbers = Array.from({ length: lastNumber - firstNumber + 1 }, (_, k) => k + firstNumber);

    return (
        <div className={className}>
            {
                currentPage !== 1 ?
                <button type="button" className="start" onClick={()=>handler(baseNumber)}></button>
                :<></>
            }
            {
                prev > 0 ?
                <button type="button" className="pre"onClick={()=>handler(getPageProps(prev))}></button>
                :<></>
            }
            {
                pageNumbers.map((num) => <button type="button" key={num} className={num === currentPage ? 'current':''} onClick={()=>handler(getPageProps(num))}>{num}</button>)
            }
            {
                next < totalPages ?
                <button type="button" onClick={()=>handler(getPageProps(next))} className="next"></button>
                :<></>
            }
            {
                currentPage !== totalPages ?
                <button type="button" className="end" onClick={()=>handler(getPageProps(totalPages))}></button>
                :<></>
            }
        </div> 
    )
}

export default Pagination;