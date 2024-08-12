import {useMapTool} from "@/hooks/useMapTool.tsx";
import {useClockTool} from "@/hooks/useMapTool/useClockTool.ts";
import {useRecoilState} from "recoil";
import {OptionsState} from "@/recoils/Tool.ts";

export const ClockTool = () => {

    const [options, setOptions] = useRecoilState(OptionsState);
    const { slowAnimation, fastAnimation, toggleAnimation, onChangeDate, onChangeSpeed } = useClockTool();

    // 임시 이미지 경로 (추후 내장 이미지로 대체)
    const tempImg = {
        slow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAAOwAAADsAEnxA+tAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABTlJREFUeF7tnVnIblMchz/zFJklcykKRZTZhUSEC8OFOaGUJFzhkgunOCjSQcY7IXJDSjLdINOFociUsY4pMvP8fOeUjrXf793vu6ff/n5PPX37vH3f6b/XXu9aa+/1X2svhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQgjVb4LF4L36AP+D7eBcegxth3zjEaMlh+BiqQP8uuBpX4TbYFw4x2rEZrsA/sFSo63o3rodd4hCjHVvhBfg6/oWlgiyp370UuyhghxgtOQJfxp+wVIBL+R5uiW3iEKMVG+AuuBKnbUqr1DfsaGwahxgt0aDoanwH6zSlk7wfm8QhRksOx3fxNywV0qx+jE3hEKMVG+L+qFuieZvSKnWx5sEhRku2xRvwQ2yqKa1yVhxitGN9PAo/x1JBtGFdHGK0Q02pCvUhbKsprXJaHGK0ZDu8Hb/AtpvSktPgEKMdekJ2En6CpZPuykk4xGiHmtIT8XH8E0sn3KUlHGK0RE3pg/gjlk60D9fFIUY7dsTz8SMsnWCfrsUhRjt0y3QaPoddj5yn1SFGOzSFuRM+in2MmuvoEKMVmgnThMgQm1JXbTgL38bfsXQicTYHjW6Z9sOh3DKN0Vp0mUK0K16G5645Du0wyLQwXfSvMd/69h0Mm6BSlJ7EXPjuHAQa3WvhwpdYCjK2Z69sjEprbjrVKU5vL2yKp+LTmOa+X2vRxIhRzf2teBxurQ9Cr9S6pvNUgB3wDLwJN9cHYRC0XgG0bk0X/hI8EjVBEoZDqxVAD3DuQ93e6TYvDI9WKsBueDZei0p9CsOl8QpwIN6Jh2LdFiN0T6MVYB98E9Pc+1CrAkwawOne/hbMxR8xkyrAmXjC4mEYK1UVQPP2F2Nu8UZO1QXWzlR7Lh6GMVNVAdTvb794GMZMVQXQ1iUZ/C0DqiqAUp+V9x5GTlUFUKbud4uHYcxUVYCf8bPFwzBmqirAL6hcvjByJj02VHLHG7jHv/8KLjT2KFhjgCsxg8ERM6kCiCfwHFyW248tB5aqALodfBhPwedRdwdhmaIng0r51ksLStmocRjWotaAYQ3a4/Y2PB2TDDo8al3TWSqA0N8dj9qj/mTU7GEYBp1UgLUoP1AbImpfvL30Qeidea/pTGgvXFWCrAXs397QDKJagwdw6PvojNlatNFcaDxwED6Cu+uD0CmdjgEmoW7hKtR6gowPuqOXMUAV6hYOwDsw3UI3DpZDUO/Hyd4B7VqLrpsLzTBehMo43lcfhMYZVBdQQvMP2lPgZky30LxWaL3hizjryxLj/7VDTxMvRK1BLJ3QkHSI0RL1W9p44kYccrfgEKM96haUiFL1yvQ+XYtDjNZoaZp2HXsNSyfZl//FIUZ7tDrpevwWSyfbtSUcYrTnYLwHv8fSSXflJBxitEbfNL10+RUsnXgXLoVDjPZoJH4d9pGbOC0OMdqjN3GvwC5H4nVxiNEaPT/YG1/FUmE07Sw4xGiPspOvQC1la+shzbwrpBxitEeJJ9dgG3ML32ATOMRoj/Y3eha1zL1UULP4FDaJQ4zWqMk9D1/AJppc/V9N4xCjNRqAKTfxcpzn/YRfod4X3AYOMY4C7XOgV7+uxlIBTnIVLrWQtgkcYrRGD2i00vkZnLbJfQl3xq5wiNEefVOUm7jU+400qu5rhxSHGO3RSFxL2t5CTeKoD9ZPZf6sRPXNfdNqjBqALHe0kkkrmDSA0mTOr6gB1ac4lAcrDjGGEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCKFTFhb+AVk232599h+EAAAAAElFTkSuQmCC",
        play: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAAOwAAADsAEnxA+tAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABKxJREFUeF7tnUuob2MYh7f7LXKXEMoMUcglDAyIYqAo5ZIYMJBkIBlSnIFjwuAguQzllgkpuRsgt4FLEYdc67hF7jy/9jm1O73n7LP3/7/W/1vr/zz1tPdgtwfv+63vW+u7vN+CiIiIiIiIiIiIiIiIiIiIiIiIiIiIyNTZCc/Ee/Fj/Bk/wQfwLNwDZaTsg+twA/5XmMbwOJ6CMjK2w/uwSvzm/o1rcDeUEZDkX4P/YpXwyvzt23gF7oUyYPbEj7BK9HL+iq/haSgD5QxcydNfmWFhLR6CO6AMiAexSupKTSP6AG/EvFDKQPgcq4Su1j/xQzwVZQAkYVUiJzXDQj4rj8EdURqlSt60zLDwKd6G+6I0SJW4LvwKT8ftURqiSlZXZlh4BNMQHBYaoUpUl2ZY+Brvxv1QZkyVpL5cj+ehs4kzpEpMn/6DT+K56LAwA6qkzMJf8GF0WOiZKhmz9DO8HA9E6YEqCbM2Xwsv4IXoZ2PHVAloxXwxPIYHYZatpQOqwLdmhoUsMmW1UaZMFfAW/Qvfx0tQpkgV7Jbd9Nl4NPrZOAWqIA/BL/B2PBRlAqrgDsX0Bt/hpSirpArs0ExDeBqzvW0XlBVQBXSofoM51OLXwgqoAjl0s8spW9Z3RlmGKoBjMMPCs3gB7oqyBargjckf8FF0WNgCVdDGaA6xXIsHoCyhCtZYzbDwEl6Gnm3cSBWosfs7PodOIkEVoHnxJ7wJD8O5pQrMPJkl59fxeOyVVta3EwRZWPgDj8OclO4Fd7q0RaaQ78Le5gxsAO1xDl60+Gv32ADaIzm5GnvZZ2ADaJMjsJdqaDaANtkfe1lStgG0SZLfS5kbG0Cb5ExC5gY6xwbQJj9idiB3jg2gTb7E3xZ/7RYbQJtkb2EWizrHqeD2SMW0rAlkGOgce4C2yMvfDdhL8lti6crYvJqFoItxLh/KKiDzYnYPv4hn49xSBWYezEUY2Tqemb+5pgrOmM3m0JSisZ7xRqogjdFM7jyBWfK12MQSqmCNzZSrtRzdFqgCNhZzVjAFKa1TvBWqwA3dLOY8hClJ6wUWy1AFcMhmNu8ktHrINlIFcYhaln6VVMEckunu78Fj0e5+FVRBHYKZxcsdRSeiTEAV3NbddDnV3igTUgW4VdPd34k56+9q6pSoAt2amb59BU9GmTJVwFvyXbwSncXriCroLZju/g5MIQfn7jukCv4szTX1T6HdfU9USZiVb2GqevVyNEsWqRLRt6nkdSta5XMGVAnpy5RouR9PQJkRVWL68A3MBdM+9TOmSk6XZi/eLWiZtkaoktSFebtfg7lNXBqiSta0fROPQr/nGyQnYqqkTWomct7B63F3lEb5HqsETmLm7m/GI1Ea5xmskrgac6z6eUydHRkIKZxcJXMlprt/GfO/7O4HRu7o/RarxG6LOXBxHWYvni95AyQbK9ZhldytuQFzrevhKAPnYHwVq0Rvbrr7lFo/H53MGRF5kpf7IsiFC1eh27FGSsbxtZhdOFmoyfien+9hjlj5dj9FWn1hyomaXKCQK9uzUJPqGbmdcz1m0khERERERERERERERERERERERERERERERGTOWVj4H9NJJbebNVBHAAAAAElFTkSuQmCC",
        pause: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAAOwAAADsAEnxA+tAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAA7dJREFUeF7t2M+LVQUYh/ExNcfSUKNxIZHQuKkQxLQ2tgnEok3RpkUto6C/wVbRpkVtWwiC0CrcRVCLBlQsBoIW/sBFkRU0aKGCZurY83LOhUucGebOvNd74H0+8HAO0TS3c79z5tyZkiRJkiRJkiRJkiRJkiRJkqR0D9F2eo1O0AW6SfeHukY/0qd0kLZQfN2Dso6m6Rn6kM7SAt2jwWu8TT/TV/Q27aINpGU8QR/QPC3S8Ju+VPHvfUdv0qM0bjG0QxTjvEFdr6mrX+gjepLU4SmKi3qLui7gcsUIrtBR2kjj9A5dppUOdLi7dJqeJw3ZSp/Tai7qcPH1cQdZT9niJ/8NGr7Nr7Y52kNqvU93qOtijVr87j1M2fbRRer6nqMWd4J4ftlM5cXv/avUdaFWW/yExV0lyyb6hLJGGl2n52iiHuST81LitrqjOU3zNB1oTlPEg9sLlPkUHwN9qzmdnD4M4OX2mGkbPducpthJs81pqiPtcWL6MIDd7TFTfEafaU5TxMfL+NtEtnGMaiR9GEDm7+qB+BSQ+YAVHy3jOSDbY+1xYvowAE2QAyjOARTnAIpzAMU5gOIcQHEOoDgHUJwDKM4BFOcAinMAxTmA4hxAcQ6gOAdQnAMozgEU5wCKcwDFOYDiHEBxDqA4B1CcAyjOARTnAIpzAMU5gOIcQHEOoDgHUJwDKM4BFOcAinMAxTmA4hxAcQ6gOAdQnAMozgEU5wCKcwDFOYDiHEBxDqA4B1CcAyjOARTnAIpzAMU5gOIcQHEOoDgHUJwDKM4BFOcAinMAxTmA4hxAcQ6guD4M4J/2mGmR/m1OU9yju81pqpvtcWL6MIDf2mOm2/RXc5oi3qhrzWmqX9vjxPRhAN+3x0w36FJzmuIqjePNOtUeS5uluMXeT+wn2klZttAx6vpeqy3+n18i4TPKGkH8d96jbK/Q79T1PUctnlG+pK0k7KJvKS5M1wVbafH1x+kRyraJjtJaX2N0nuKnfx0JcSH20zx1XbCVFG/MF7SdxiVG8DGtZQRX6HVaT/qfPXSS/qRRLvJlijfmcRq3DfQunaP4qNn1erq6Tmcoht4bfbwFTVPcHo/Qi7Sb4o19mAZu0QJdpLP0Df1AmZ/9lxM/vfHw+iodor00Q/GwOLim8XeDv+kPik86c/Q1ZX48XbM+/w7aSDGGOMYFH36tcXeIh714w+MPSXE+CfExOl5jjDPuDPEaB68zfurjdUUx2DvtP5MkSZIkSZIkSZIkSZIkSZKkNFNT/wGhPaHsThQcRgAAAABJRU5ErkJggg==",
        fast: "data:image/png;base64,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",
    }

    const closeClockTool= () => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            isOpenClock: false,
        }))
    }


    return options.isOpenClock && (
        <div className="default-layer clock">
            <div className={"close"} onClick={closeClockTool}>close</div>
            <input type="date" name="date" value={options.date} onChange={onChangeDate}/>
            <input type="time" name="time" value={options.time} onChange={onChangeDate}/>
            <div>
                <label>Multiplier</label>
                <input type="range" list="tickmarks" value={options.speed} onChange={onChangeSpeed} min="1" max="4096"/>
                <datalist id="tickmarks">
                    <option value="1"></option>
                    <option value="512"></option>
                    <option value="1024"></option>
                    <option value="2048"></option>
                    <option value="4096"></option>
                </datalist>
                <label>{options.speed}x</label>
            </div>
            <div>
                <button onClick={slowAnimation}>
                    <img className="icon-24 margin-4" src={tempImg.slow} alt="slow"/>
                </button>
                <button onClick={toggleAnimation}>
                    <img className="icon-24 margin-4" src={tempImg.play} alt="play"
                         style={{display: options.isAnimation ? 'none' : 'block'}}/>
                    <img className="icon-24 margin-4" src={tempImg.pause} alt="pause"
                         style={{display: options.isAnimation ? 'block' : 'none'}}/>
                </button>
                <button onClick={fastAnimation}>
                    <img className="icon-24 margin-4" src={tempImg.fast} alt="fast"/>
                </button>
            </div>
        </div>
    )
}
