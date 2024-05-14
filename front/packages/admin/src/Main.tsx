import ReactDOM from 'react-dom/client'
import { RecoilRoot, RecoilEnv } from 'recoil'
import App from './App'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
ReactDOM.createRoot(document.getElementById('container') as HTMLElement).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
)