import CIModal from "../../Modal"
import { getURL } from "../../utils/utils"
import './index.scss'

interface IBasicInfoModalProps {
    onDismiss: () => void
    tokenName: string
    narrate: string
    devInsiderInfo: any
    twitterInfo: any
    renderEmptyTabel: any
}

export default function BasicInfoModal(props: IBasicInfoModalProps) {
    const { renderEmptyTabel, twitterInfo, devInsiderInfo } = props;
    return (
        <CIModal onDismiss={props.onDismiss} >
            <div className="bi-container">
                {/* header */}
                <div className="bi-header">
                    <div className="bi-title">{props.tokenName}</div>
                    <img onClick={props.onDismiss} className="ac-close-btn" src={getURL('images/ico_close.png')} />
                </div>
                <div className="bi-seperator" />
                {/* content */}
                <div className="bi-content">
                    <div className='bi-token-desc-info'>
                        <div className='bi-item-title'>代币叙事</div>
                        <div className='bi-token-desc'>{props.narrate}</div>
                    </div>
                    <div className='bi-footer-info'>
                        {/* dev 信息 */}
                        <div className='bi-dev-info'>
                            <div className='bi-item-title'>DEV信息</div>
                            <div className='bi-his-pump-count'>
                                {`历史发盘 ${devInsiderInfo ? devInsiderInfo.dev_histories_count : '-'} 次`}
                            </div>
                            <div className='bi-wallet-money'>
                                钱包资金<span className='bi-desc-value'>{devInsiderInfo ? (devInsiderInfo.balance || '0').toLocaleString('en-US') : '-'} {devInsiderInfo?.balance_symbol || ''}</span>
                            </div>
                        </div>
                        {/* 推特信息 */}
                        <div className='bi-twitter-info'>
                            <div className='bi-item-title'>推特信息<span className="bi-itme-title-sub">(以Dexscreener 上认证的X为准)</span></div>
                            <div>
                                <div className='bi-twitter-change-name-count'>
                                    {twitterInfo ? `推特改名${twitterInfo.nameHistories?.length || 0}次` : '暂无推特数据'}
                                    <span style={{marginLeft: '8px'}}>
                                    {twitterInfo ? `删推${twitterInfo.pumpScamCount?.length || 0}次` : ''}
                                    </span>
                                </div>
                                {twitterInfo?.quality ?
                                    <div className='bi-fans-info'>
                                        <div className='bi-fans-label'>粉丝<span className='bi-desc-value'>{twitterInfo.quality && twitterInfo.quality.followersCount >= 0 ? Number(twitterInfo.quality.followersCount).toLocaleString('en-US') : '-'}</span></div>
                                        <div className='bi-fans-label'>大V关注<span className='bi-desc-value'>{twitterInfo.quality && twitterInfo.quality.smartFollowersCount >= 0 ? twitterInfo.quality.smartFollowersCount.toLocaleString('en-US') : '-'}</span></div>
                                    </div> :
                                    <div style={{ borderRadius: '8px', overflow: 'hidden', marginTop: '4px' }}>{renderEmptyTabel()}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CIModal>
    )
}