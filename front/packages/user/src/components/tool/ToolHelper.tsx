import { useEffect, useState } from "react";

interface ToolHelperProps {
    helper?: string;
}

const ToolHelper = ({ helper }: ToolHelperProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const fadeOutTimeout = setTimeout(() => {
            setIsFadingOut(true); // 4초 후 페이드 아웃 시작
        }, 4000);

        const removeTimeout = setTimeout(() => {
            setIsVisible(false); // 애니메이션이 끝난 후 제거
        }, 5000); // 1초 동안 페이드 아웃 후 제거

        return () => {
            clearTimeout(fadeOutTimeout);
            clearTimeout(removeTimeout);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`tool-helper ${isFadingOut ? "hide" : ""}`}>
            <div>{helper}</div>
        </div>
    );
};

export default ToolHelper;
