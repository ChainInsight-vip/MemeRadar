import React, {useEffect, useState, useRef} from 'react';
import CIModal from './Modal'
import Requester from './network/Requester'
import './App.scss'
import { cisLog, getURL } from './utils/utils';
import ciLocalStorage from './utils/CILocalStorage';
import ActivityCodeModal from './components/ActivityCodeModal';
import BasicInfoModal from './components/BasicInfoModal';
import KolDetailModal from './components/KolDetailModal';
import SingalModal from './components/SingalModal';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


const icoDev = getURL('images/ico_dev.png');
const icoNext = getURL('images/ico_next.png');
const icoTwitter = getURL('images/ico_twitter.png');
const icoKol = getURL('images/ico_kol.png');
const icoCall = getURL('images/ico_call.png');

interface IAppProps {
  ca: string,
  chainName: string
  tokenName: string
}

let completionActivity : undefined | ((show: boolean) => void);

const defaultUpdatePluginContentInfo = {
  title: '更新提醒',
  content: "MemeRadar有新的版本，可前往google商店升级"
}

function App(props: IAppProps) {
	const [showActivityCode, setShowActivityCode] = useState(false)
	const [showBasicInfoModal, setShowBasicInfoModal] = useState(false)
  const [showKolDetailModal, setShowKolDetailModal] = useState(false)
  const [showSignalModal, setShowSignalModal] = useState(false)

  const [needUpdatePlugin, setNeedUpdatePlugin] = useState(false)
  const [updatePluginContentInfo, setUpdatePluginContentInfo] = useState(defaultUpdatePluginContentInfo)

  const [narrate, setNarrate] = useState('')
  const [devInsiderInfo, setDevInsiderInfo] = useState<Record<string, any>>()
  const [twitterInfo, setTwitterInfo] = useState<Record<string, any>>()
  const [kolTransactionInfo, setKolTransactionInfo] = useState<Record<string, any>>()
  const [tgCallChannelInfo, setTgCallChannelInfo] = useState<Record<string, any>>()

  const [communityAttentionInfo, setCommunityAttentionInfo] = useState<Record<string, any>>()
  const [alertChanceInfo, setAlertChanceInfo] = useState<Record<string, any>>()
  const [kolCallInfo, setKOLCallInfo] = useState<Record<string, any>>()

  const [loadingCounter, setLoadingCounter] = useState(0)

  const refreshData = () => {
    if (loadingCounter > 0) {
      return;
    }

    let counter = 0;
    setLoadingCounter(++counter);
    Requester.fetchTokenNarrate(props.ca, props.chainName).then(narrate => {
      setLoadingCounter(--counter);
      setNarrate(narrate || '')
    })

    setLoadingCounter(++counter);
    Requester.fetchDevInsiderInfo(props.ca).then(devInsiderInfo => {
      setLoadingCounter(--counter);
      setDevInsiderInfo(devInsiderInfo)
    })

    setLoadingCounter(++counter);
    Requester.fetchCATwitterInfo(props.ca, props.chainName).then(twitterInfo => {
      setLoadingCounter(--counter);
      setTwitterInfo(twitterInfo)
    })

    setLoadingCounter(++counter);
    Requester.fetchKOLTransactionInfo(props.ca).then(result => {
      setLoadingCounter(--counter);
      setKolTransactionInfo(result || {})
    })

    setLoadingCounter(++counter);
    Requester.fetchCommunityInfo(props.ca, props.chainName).then(result => {
      setLoadingCounter(--counter);
      if (result) {
        setCommunityAttentionInfo(result.communityAttentionInfo || {})
        setAlertChanceInfo(result.alertChanceInfo || {})
        setKOLCallInfo(result.kolCallInfo || {})
      }
    })

    setLoadingCounter(++counter);
    Requester.fetchCallChannelInfo(props.ca, props.chainName).then(result => {
      setLoadingCounter(--counter);
      setTgCallChannelInfo(result?.callChannelInfo || {})
    })
  }

  useEffect(() => {
    const manifest = chrome.runtime.getManifest()
    Requester.checkPluginUpdate(manifest.version).then(resp => {
      if (resp.code === 0 && resp.data) {
        if (resp.data.hasUpdate) {
          let updateInfo = updatePluginContentInfo;
          if (resp.data.updateInfo) {
            updateInfo = JSON.parse(resp.data.updateInfo)
          }

          if (updateInfo.content) {
            setUpdatePluginContentInfo(updateInfo)
          }
          setNeedUpdatePlugin(true)
        }
      }
    })

    refreshData();
  },[])

  const showInfoModalIfCan = (setShowInfoModalFunc: (show: boolean) => void) => {
    ciLocalStorage.get({
			activationCode: ''
		}, function(result: any) {
			if (result.activationCode) {
				setShowInfoModalFunc(true)
			} else {
				setShowActivityCode(true);
        completionActivity = setShowInfoModalFunc
			}
		})
  }

	const showBasicInfoModalIfCan = (e: { stopPropagation: () => void; preventDefault: () => void; }) => {
    cisLog('showBasicInfoModalIfCan')
    e.preventDefault();
    showInfoModalIfCan(setShowBasicInfoModal)
  }

  const showKolDetailModalIfCan = () => {showInfoModalIfCan(setShowKolDetailModal)}

  const showSignalModalIfCan = () => {showInfoModalIfCan(setShowSignalModal)}

  const onFinishActivated = () => {
    setShowActivityCode(false)
    if (completionActivity) {
      completionActivity(true)
      completionActivity = undefined
    }
  }
  
  function renderEmptyTabel() {
    return (
      <div className="cis-empty-container">
        <img className="ico-empty-content" src={getURL('images/img_empty_content.png')}/>
        <span className="cis-empty-title">暂无相关数据</span>
      </div>
    )
  }

  function renderTableFooter(tipsCount: number, link?: string) {
    if (link) {
      return (
        <a href={link} target="_blank">
          <div className='cis-table-footer' style={{background: 'rgba(10, 15, 22, 0.4)'}}>
            <div className='cis-table-footer-title'>{'点击查看更多'}</div>
          </div>
        </a>
      );
    }
    return (
      <div className='cis-table-footer'>
        <div className='cis-table-footer-title'>{link ? '点击查看更多' : `仅展示最新${tipsCount}条数据`}</div>
      </div>
    )
  }
  
	return (
		<>
        <div id="cis-panel" style={{userSelect: 'none'}}>
          <div className="top-section">
            {/* 叙事 */}
            <div className="panel-section-item" onClick={showBasicInfoModalIfCan}>
              <div className="icon-container">
                <img src={icoDev} className='icon-panel-dev' />
              </div>
              <div className='cis-flex-row-padding4'>
                <div className="cis-number">{devInsiderInfo ? (devInsiderInfo.dev_histories_count || 0) : '-'}</div><div className='cis-desc'>发盘</div>
              </div>
              <div className='cis-flex-row-padding4'>
                <img className='icon-panel-twitter' src={icoTwitter} />
                <div className="cis-number">{twitterInfo?.quality ? (twitterInfo.quality.smartFollowersCount || 0) : '-'}</div><div className='cis-desc'>大v关注</div>
              </div>
              <div className='cis-flex-row-padding4'>
                <div className="cis-number">{twitterInfo ? (twitterInfo.nameHistories?.length || 0) : '-'}</div><div className='cis-desc'>改名</div>
              </div>
              <button className='panel-description-button'>叙事</button>
            </div>
            <img className='icon-panel-next' src={icoNext} onClick={showBasicInfoModalIfCan} />
            <div className='ico-refresh-container'>
              {loadingCounter > 0 ? <Spin className='ico-refresh' style={{backgroundColor: 'rgb(206, 207, 208, 0.6)'}} indicator={<LoadingOutlined style={{ color: "#fff", fontSize: 10 }} spin />} /> :
              <img className='ico-refresh' src={getURL("images/ico_refresh.png")} onClick={refreshData} />}
            </div>
          </div>

          <div className="bottom-section">
            <div className="cis-flex-row cis-entry-item" onClick={showKolDetailModalIfCan}>
              {/* kol detail */}
              <div className="panel-section-item">
                <div className='icon-container'>
                  <img src={icoKol} className="icon-panel-kol" />
                </div>
                <div className='cis-flex-row-padding4'>
                  <div className="cis-number">{kolTransactionInfo?.tradeStatList ? kolTransactionInfo.tradeStatList.length : '-'}</div><div className='cis-desc'>交易</div>
                </div>
                <div className='cis-flex-row-padding4'>
                  <div className="cis-number">{communityAttentionInfo ? (communityAttentionInfo.communityCount || 0) : '-'}</div><div className='cis-desc'>社群</div>
                </div>
              </div>
              <img className='icon-panel-next' src={icoNext} />
            </div>
            <div className="cis-flex-row cis-entry-item" onClick={showSignalModalIfCan}>
              <div className="panel-section-item">
                <div className='icon-container'>
                  <img src={icoCall} className="icon-panel-call" />
                </div>
                <div className="cis-flex-row-padding4">
                  <div className="cis-number">{alertChanceInfo ? (alertChanceInfo.count || 0) : '-'}</div><div className='cis-desc'>信号</div>
                </div>
                <div className="cis-flex-row-padding4">
                  <div className="cis-number">{tgCallChannelInfo || kolCallInfo  ? (kolCallInfo?.mentionUserCount || 0) + (tgCallChannelInfo?.count || 0) : '-'}</div><div className='cis-desc'>TG+推特喊单</div>
                </div>
              </div>
              <img className='icon-panel-next' src={icoNext} />
            </div>
          </div>
        </div>

			{showActivityCode ? <ActivityCodeModal 
          onDismiss={() => setShowActivityCode(false)}
          onFinishActivated={onFinishActivated}
        /> : null}
			{showBasicInfoModal ? <BasicInfoModal 
        onDismiss={() => setShowBasicInfoModal(false)}
        narrate={narrate}
        tokenName={props.tokenName}
        devInsiderInfo={devInsiderInfo}
        twitterInfo={twitterInfo}
        renderEmptyTabel={renderEmptyTabel}
      /> : null}
      {showKolDetailModal ? <KolDetailModal 
        onDismiss={() => setShowKolDetailModal(false)}
        tokenName={props.tokenName}
        renderEmptyTabel={renderEmptyTabel}
        kolTransactionInfo={kolTransactionInfo}
        renderTableFooter={renderTableFooter}
        communityAttentionInfo={communityAttentionInfo}
      /> : null}
      {showSignalModal ? <SingalModal 
        onDismiss={() => setShowSignalModal(false)}
        tokenName={props.tokenName}
        renderEmptyTabel={renderEmptyTabel}
        tgCallChannelInfo={tgCallChannelInfo}
        kolCallInfo={kolCallInfo}
        renderTableFooter={renderTableFooter}
        alertChanceInfo={alertChanceInfo}
      /> : null}
      {needUpdatePlugin ? <CIModal onDismiss={() => {setNeedUpdatePlugin(false)}} >
				<div className="update-plugin-container">
					<div className="update-plugin-header">
            <div className="ac-close-btn"/>
						<div className="update-plugin-title">{updatePluginContentInfo.title}</div>
						<img onClick={() => {setNeedUpdatePlugin(false)}} className="ac-close-btn" style={{marginTop: '-4px', marginRight: '-4px'}} src={getURL('images/ico_close.png')} />
					</div>
					<div className="update-plugin-content">
            <div className='update-plugin-text'>{updatePluginContentInfo.content}</div>
						<a className='update-plugin-btn' href="https://chromewebstore.google.com/detail/MemeRadar/nhildbfbblldjpmlhopajgbcfjcepcoe" target="_blank">
							去更新
						</a>
					</div>
				</div>

      </CIModal>: null}
		</>
	)
}

export default App
