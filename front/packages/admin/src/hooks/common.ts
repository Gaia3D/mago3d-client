import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useNotFindId = (returnPath: string) => {
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(id) return
        alert('오류가 발생했습니다.');
        navigate(returnPath);
    }, [id]);
}

export const useToPath = (path: string) => {
    const navigate = useNavigate();
    return () => navigate(path);
}