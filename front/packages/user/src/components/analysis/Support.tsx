import { useState } from "react";
import FrozenArea from "./support/FrozenArea";
import AvenueOfApproach from "./support/AvenueOfApproach";
import Concealment from "./support/Concealment";
import Cover from "./support/Cover";
import EscapeRange from "./support/EscapeRange";

enum Menu {
    FrozenArea,
    Cover,
    Concealment,
    AvenueOfApproach,
    EscapeRange
}
const Support = () => {
    const [collapseMenu, setCollapseMenu] = useState<Menu | null>(null);
    const toggle = (menu: Menu) => {
        if (collapseMenu === menu) {
            setCollapseMenu(null);
        } else {
            setCollapseMenu(menu);
        }
    }
    return (
        <>
        <div className={`${collapseMenu === Menu.FrozenArea ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-30`}
            onClick={()=>{toggle(Menu.FrozenArea)}}>상습 결빙지역 분석</div>
        {
            collapseMenu === Menu.FrozenArea &&
            <FrozenArea />
        }
        <div className={`${collapseMenu === Menu.Cover ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.Cover)}}>엄폐 분석</div>
        {
            collapseMenu === Menu.Cover &&
            <Cover />
        }
        <div className={`${collapseMenu === Menu.Concealment ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.Concealment)}}>은폐 분석</div>
        {
            collapseMenu === Menu.Concealment &&
            <Concealment />
        }
        <div className={`${collapseMenu === Menu.AvenueOfApproach ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.AvenueOfApproach)}}>피아접근로 분석</div>
        {
            collapseMenu === Menu.AvenueOfApproach &&
            <AvenueOfApproach />
        }
        <div className={`${collapseMenu === Menu.EscapeRange ? 'analysisSelect':'analysisunSelect'} width-88 marginTop-10`}
            onClick={()=>{toggle(Menu.EscapeRange)}}>침투 적 도주 범위 분석</div>
        {
            collapseMenu === Menu.EscapeRange &&
            <EscapeRange />
        }
        </>
    )
}

export default Support;