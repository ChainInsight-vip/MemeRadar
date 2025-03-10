import { Button, message } from "antd"
import CIModal from "../../Modal"
import { cisLog, getURL } from "../../utils/utils"
import { useState } from "react"
import Requester from "../../network/Requester"
import ciLocalStorage from "../../utils/CILocalStorage"

import './index.scss'

interface IActivityCodeModalProps {
    onDismiss: () => void
    onFinishActivated: () => void
}

export default function ActivityCodeModal(props: IActivityCodeModalProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const [activationCode, setActivationCode] = useState('');
    const [activating, setActivating] = useState(false);
    
    const handleActivate = async () => {
		if (!activationCode) {
			messageApi.info('请输入激活码');
			return;
		}
		
		// start to activate
		setActivating(true);
		const res = await Requester.activateCode(activationCode)
		setActivating(false);
		if (res.code === 0 && res.data) {
      if (res.data.canUse) {
        ciLocalStorage.set({ activationCode: activationCode }, function() {
          cisLog('Value is set to ' + activationCode);
          messageApi.success('激活成功')
          // 激活成功后 展示正常的弹窗
          props.onFinishActivated()
        });
      } else if (res.data.useCount >= 1) {
        messageApi.error('该激活码已被使用')
      } else {
        messageApi.error('激活码有误，请重试')
      }
		} else {
			messageApi.error(res.msg);
		}
	};
    
    return (
        <CIModal onDismiss={props.onDismiss} >
            {contextHolder}
            <div className="ac-container">
                <div className="ac-header">
                    <div className="ac-close-btn" />
                    <div className="ac-title">输入激活码 查看详细数据</div>
                    <img onClick={props.onDismiss} className="ac-close-btn" style={{marginTop: '-4px', marginRight: '-4px'}} src={getURL('images/ico_close.png')} />
                </div>
                <div className="ac-content">
                    <div className="ac-input-container">
                        <input
                            type="text"
                            value={activationCode}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActivationCode(e.target.value)}
                            placeholder="请输入激活码"
                            className="ac-input"
                        />
                        <Button type="text" onClick={handleActivate} className="ac-activate-btn" loading={activating}>激活</Button>
                    </div>
                </div>
                <div className="ac-footer">
                    <span className="ac-footer-tips">进入TG社群，免费领取激活码</span>
                    <a className="ac-tg-group" href="https://t.me/+tDveyOXzyVs2Yzk9" target="_blank">
                        <img src={getURL('images/ico_tg.png')} className="icon-tg"/>
                        <span className='enter-group-title'>进群</span>
                        <img src={getURL('images/ico_next_gray.png')} className="icon-tg-next"/>
                    </a>
                </div>
            </div>

        </CIModal>
    )
}