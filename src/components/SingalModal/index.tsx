import CIModal from "../../Modal"
import { formatTime, getURL } from "../../utils/utils"
import './index.scss'

interface ISingalModalProps {
    onDismiss: () => void
    tokenName: string
    renderEmptyTabel: any
    tgCallChannelInfo: any
    renderTableFooter: any
    alertChanceInfo: any
    kolCallInfo: any
}

export default function SingalModal(props: ISingalModalProps) {
    const { alertChanceInfo, kolCallInfo, renderEmptyTabel, renderTableFooter, tgCallChannelInfo, onDismiss } = props;

    return (
        <CIModal onDismiss={onDismiss} >
            <div className="cis-signal-container">
                {/* header */}
                <div className="cis-signal-header">
                    <div className="cis-signal-title">{props.tokenName}</div>
                    <img onClick={onDismiss} className="cis-signal-close-btn" src={getURL('images/ico_close.png')} />
                </div>
                <div className="cis-signal-seperator" />

                {/* content */}
                <div className="cis-signal-content">
                    <div className='cis-signal-hot-info'>
                        <div className='info-title'>市场热门信号</div>
                        <div className='info-desc'>{alertChanceInfo ? `${alertChanceInfo.count || 0} 个策略报警` : '暂无数据'}</div>
                        <div className='info-list'>
                            <div className='header-row'>
                                <span className='header-col cis-signal-time'>时间</span>
                                <span className='header-col col-2'>策略名称</span>
                            </div>
                            {alertChanceInfo?.alertChances && alertChanceInfo.alertChances.length > 0 ?
                                <div>
                                    {alertChanceInfo.alertChances.slice(0, 5).map((item: any) => (
                                        <div className='data-row'>
                                            <span className='data-col cis-signal-time'>{formatTime(item.timestamp, "YYYY/MM/dd\nhh:mm")}</span>
                                            <div className='data-col col-2'>
                                                <img className='cis-publiser-avatar' src={item.avatar}></img>
                                                <span className='cis-col2-value' title={item.publisherName}>{item.publisherName}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {alertChanceInfo.alertChances.length >= 5 ? renderTableFooter(5) : null}
                                </div>
                                : renderEmptyTabel()}
                        </div>
                    </div>

                    <div className='cis-signal-tg-info'>
                        <div className='info-title'>TG频道喊单</div>
                        <div className='info-desc'>{tgCallChannelInfo ? `${tgCallChannelInfo.count || '0'} 个TG频道喊单` : '暂无数据'}</div>
                        <div className='info-list'>
                            <div className='header-row'>
                                <span className='header-col cis-signal-time'>时间</span>
                                <span className='header-col col-2'>TG频道</span>
                            </div>
                            {tgCallChannelInfo?.callChannels && tgCallChannelInfo.callChannels.length ?
                                <div>
                                    {tgCallChannelInfo.callChannels.slice(0, 5).map((item: any) => (
                                        <a href={item.channelLink} target="_blank">
                                            <div className='data-row tg-entry' >
                                                <span className='data-col cis-signal-time'>{formatTime(item.timestamp, "YYYY/MM/dd\nhh:mm")}</span>
                                                <div className='data-col col-2'>
                                                    <img className='cis-tg-logo' src={getURL('images/ico_tg.png')} />
                                                    <span className='cis-col2-value' title={item.channelName}>{item.channelName}</span>
                                                </div>
                                                <img className='ico-tg-entry' src={getURL('images/ico_next_gray.png')} />
                                            </div>
                                        </a>
                                    ))}
                                    {tgCallChannelInfo.callChannels.length >= 5 ? renderTableFooter(5) : null}
                                </div> : renderEmptyTabel()}
                        </div>
                    </div>

                    <div className='cis-signal-kol-info'>
                        <div className='info-title'>
                            推特大V喊单<span className="info-title-sub">(该数据由</span><img className="ico-x3-logo" src={getURL("images/ico_x3logo.png")}/><span className="info-title-sub">提供)</span>
                        </div>
                        <div className='info-desc'>{kolCallInfo ? `${kolCallInfo.mentionUserCount || '0'} 位KOL提到了该CA` : '暂无数据'}</div>
                        <div className='info-list'>
                            <div className='header-row'>
                                <span className='header-col kol'>KOL</span>
                                <span className='header-col col-2'>粉丝数</span>
                            </div>
                            {kolCallInfo?.kolCalls && kolCallInfo.kolCalls.length ?
                                <div>
                                    {kolCallInfo.kolCalls.slice(0, 5).map((item: any) => (
                                        <a href={item.postUrl} target="_blank">
                                            <div className='data-row kol-entry'>
                                                <div className="kol-basic-info">
                                                    <img className='data-col kol-avatar' src={item.avatar} />
                                                    <span className='data-col kol-name' title={item.screenName}>{item.screenName}</span>
                                                </div>
                                                <span className='data-col fans-count'>{!item.fanCountStr ? '0' : item.fanCountStr}</span>
                                                <img className='ico-tg-entry' src={getURL('images/ico_next_gray.png')} />
                                            </div>
                                        </a>
                                    ))}
                                    {kolCallInfo.kolCalls.length > 0 ? renderTableFooter(5, kolCallInfo.overviewUrl) : null}
                                </div> : renderEmptyTabel()}
                        </div>
                    </div>
                </div>
            </div>
        </CIModal>
    )
}