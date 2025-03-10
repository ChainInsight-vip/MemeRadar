import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.scss'
import { getURL } from './utils/utils';

if (location.protocol === "chrome-extension:" && location.pathname === "/popup.html") {
    function Popup() {
        return (
            <div className="popup-container">
                <img className='popup-logo' src={getURL("images/img_popup_logo.png")}></img>
                <div className='popup-title-container'>
                    <div className='popup-title'>打开可自动使用，现已支持：</div>
                    <div className="popup-subtitle">GMGN、AVE、OKX、XXYY、Debot、Logearn、AngryX</div>
                </div>
                <a className="mr-twitter-btn" href="https://x.com/MemeRadar_sol" target="_blank">
                    <img className="mr-twitter-logo" src={getURL("images/ico_popup_x.png")}/>
                    <span className="mr-popup-btn-title">&#64;MemeRadar_sol</span>
                    <img className="mr-popup-next-btn" src={getURL("images/ico_popup_next.png")}/>
                </a>
                <a className="mr-tg-btn" href="https://t.me/+tDveyOXzyVs2Yzk9" target="_blank">
                    <img className="mr-tg-logo" src={getURL("images/ico_popup_tg.png")}/>
                    <span className="mr-popup-btn-title">MemeRadar交流群</span>
                    <img className="mr-popup-next-btn" src={getURL("images/ico_popup_next.png")}/>
                </a>
            </div>
        )
    }
    createRoot(document.getElementById('cis-popup-root')!).render(
        <StrictMode>
            <Popup />
        </StrictMode>,
    )
}
