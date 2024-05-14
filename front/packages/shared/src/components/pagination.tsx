import { FC } from "react";
import { SetterOrUpdater } from "recoil";

type PaginationProps = {
    page: number;
    totalPages: number;
    pagePerCount?: number;
    handler: SetterOrUpdater<number> | ((pageNum: number) => void);
    zeroBase?: boolean;
    styleProps?: React.CSSProperties;
};

const Pagination: FC<PaginationProps> = ({
    page,
    totalPages,
    pagePerCount = 10,
    handler,
    zeroBase = true,
    styleProps = {},
}) => {
    const baseNumber = zeroBase ? 0 : 1;

    const currentPage = zeroBase ? page+1 : page;

    const getPageProps = (num:number):number => zeroBase ? num-1 : num;

    if(pagePerCount > totalPages) pagePerCount = totalPages;
    const pageGroup = Math.ceil(currentPage/pagePerCount);

    let lastNumber = pageGroup * pagePerCount;
    if(lastNumber > totalPages) lastNumber = totalPages;

    let firstNumber = lastNumber - (pagePerCount-1);

    const next = lastNumber + 1;
    const prev = firstNumber - 1;

    const pageNumbers = Array.from( { length: (lastNumber-firstNumber) + 1 }, ( _, k)=>k+firstNumber);

    return (
        <div className="pagination" style={styleProps}>
            {
                currentPage !== 1 ?
                <a className="start" onClick={()=>handler(baseNumber)}></a>
                :<></>
            }
            {
                prev > 0 ?
                <a className="pre" onClick={()=>handler(getPageProps(prev))}></a>
                :<></>
            }
            
            {
                pageNumbers.map((num) => <a key={num} onClick={()=>handler(getPageProps(num))} className={num === currentPage ? 'current':'lnk'}>{num}</a>)
            }
            {
                next < totalPages ?
                <a className="next" onClick={()=>handler(getPageProps(next))}></a>
                :<></>
            }
            {
                totalPages > 0 && currentPage !== totalPages ?
                <a className="end" onClick={()=>handler(getPageProps(totalPages))}></a>
                :<></>
            }
		</div>
    )
}

export default Pagination;