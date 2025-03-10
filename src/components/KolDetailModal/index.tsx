import CIModal from "../../Modal"
import { getURL } from "../../utils/utils"
import './index.scss'

interface IKolDetailModalProps {
    onDismiss: () => void
    tokenName: string
    renderEmptyTabel: any
    kolTransactionInfo: any
    renderTableFooter: any
    communityAttentionInfo: any
}

export default function KolDetailModal(props: IKolDetailModalProps) {
    const { communityAttentionInfo, renderEmptyTabel, kolTransactionInfo, renderTableFooter, onDismiss } = props;
    function _renderKolItem(item: any) {
        return (
            <div className='data-row'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img className='data-col kol-avatar' src={item.avatar} />
                    <span className='data-col kol-name' title={item.name}>{item.name}</span>
                </div>

                <span className='data-col buy-count'>{item.amountBought < 0 ? '-' : item.amountBought}</span>
                <span className='data-col sell-precent'>{item.sellRatio}</span>
            </div>
        )
    }
    return (
        <CIModal onDismiss={onDismiss} >
            <div className="kol-container">
                {/* header */}
                <div className="kol-header">
                    <div className="kol-title">{props.tokenName}</div>
                    <img onClick={onDismiss} className="ac-close-btn" src={getURL('images/ico_close.png')} />
                </div>
                <div className="kol-seperator" />
                {/* content */}
                <div className="kol-content">
                    <div className='kol-trade-info'>
                        <div className='info-title'>KOL交易分析</div>
                        <div className='info-desc'>{kolTransactionInfo ? `${kolTransactionInfo.buyerCount || '0'} 个KOL买入，${kolTransactionInfo.clearCount || '0'} 个已清仓` : `- 个KOL买入，- 个已清仓`}</div>
                        <div className='info-list'>
                            <div className='header-row header-row-around'>
                                <span className='header-col kol-name'>KOL</span>
                                <span className='header-col buy-count'>总买入量</span>
                                <span className='header-col sell-precent'>卖出%</span>
                            </div>
                            {kolTransactionInfo?.tradeStatList && kolTransactionInfo.tradeStatList.length ?
                                <div>
                                    {kolTransactionInfo.tradeStatList.slice(0, 10).map((item: any) => {
                                        return (
                                            item.twitterId ?
                                                <a href={`https://x.com/${item.twitterId}`} target="_blank">
                                                    {_renderKolItem(item)}
                                                </a> : _renderKolItem(item)
                                        )
                                    })}
                                    {kolTransactionInfo.tradeStatList.length >= 10 ? renderTableFooter(10) : null}
                                </div>
                                : renderEmptyTabel()}
                        </div>
                    </div>
                    <div className='kol-community-info'>
                        <div className='info-title'>KOL社区热度</div>
                        {communityAttentionInfo ?
                            <div className='info-desc'>{`72h内被 ${communityAttentionInfo.communityCount || '0'} 个KOL社群讨论 ${communityAttentionInfo.mentionCount || '0'} 次`}</div> :
                            <div className='info-desc'>暂无数据</div>}
                        <div className='info-list'>
                            <div className='header-row'>
                                <span className='header-col community-name'>知名社群</span>
                                <span className='header-col community-count'>讨论</span>
                            </div>
                            {communityAttentionInfo?.communityAttentions?.length ?
                                <div>
                                    {communityAttentionInfo.communityAttentions.slice(0, 10).map((item: any) => {
                                        const content = (
                                            <div className='data-row'>
                                                <div className='data-col community-name'>
                                                    <img className='community-avator' src={item.avatar} />
                                                    <span className='group-name' title={item.kolName}>{item.kolName}</span>
                                                </div>
                                                <span className='data-col community-count'>{item.totalMentionCount}</span>
                                                <img className='ico-item-entry' src={getURL('images/ico_next_gray.png')} />
                                            </div>
                                        )
                                        if (item.kolTwitterId) {
                                            return (
                                                <a href={`https://x.com/${item.kolTwitterId}`} target="_blank" style={{flex: 1, flexDirection: 'row'}}>
                                                    {content}
                                                </a>
                                            )
                                        }
                                        return content;
                                    })}
                                    {communityAttentionInfo.communityAttentions.length >= 10 ? renderTableFooter(10) : null}
                                </div> : renderEmptyTabel()}
                        </div>
                    </div>
                </div>
            </div>
        </CIModal>
    )
}