import { useRecoilValue } from 'recoil'
import { LoadingStateType, loadingState } from '../recoils/Spinner'
import './Spinner.css'

export default function LoadingSpinner() {
    const {loading, msg} = useRecoilValue<LoadingStateType>(loadingState);
    return (
        <div id="myModal" className="modal" style={{display: `${loading ? 'block' : 'none'}`}}>
            <div className="modal-spinner-wrapper">
                <div className="spinner-full"></div>
            </div>
        </div>
    )
}