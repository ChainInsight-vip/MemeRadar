import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { cisLog } from './utils/utils.ts'

function initializeObservers() {
	cisLog('start')

	if (!document.body) {
		cisLog('body is nil')
		window.addEventListener("DOMContentLoaded", initializeObservers);
		return;
	}

	let lastUrl = location.href;
	
	setInterval(function() {
		if (window.location.href !== lastUrl || !document.querySelector('#cis-root')) {
			lastUrl = window.location.href;
			
			insertContent();
		}
	}, 5000); // 每秒检查一次

	setTimeout(() => {
		insertContent();
	}, 3000);

  	function insertContent() {
		const isOKX = location.hostname === 'www.okx.com'
		if (isOKX) {
			insertContentToOKX()
			return;
		}

		const isGMGN = location.hostname === 'gmgn.ai'
		if (isGMGN) {
			insertContentToGMGN()
			return;
		}

		const isAVE = location.hostname === 'ave.ai'
		if (isAVE) {
			insertContentToAVE();
			return;
		}

		const isXXYY = location.hostname.includes('xxyy.io')
		if (isXXYY) {
			insertContentToXXYY();
			return;
		}

		const isDebot = location.hostname.includes('debot.ai')
		if (isDebot) {
			insertContentToDebot()
			return;
		}

		const isLogearn = location.hostname.includes('logearn.com')
		if (isLogearn) {
			insertContentToLogearn()
			return;
		}

		const isAngryx = location.hostname.includes('angryx.io')
		if (isAngryx) {
			insertContentToAngryx()
			return;
		}
	}
}

function insertContentToOKX() {
	document.querySelector('#cis-root')?.remove()

	let matchResult = location.href.match(/https:\/\/www\.okx\.com\/.*\/web3\/detail\/(.*)\/(.*)/)
	if (!matchResult) {
		cisLog('skip insert')
		return;
	}

	const parent = document.getElementsByClassName('dex-overflow_scroll-scroll-children')[0]
	cisLog('ci parent: ', parent)

	if (!parent) {
		cisLog('empty parent')
		return;
	}

	// https://www.okx.com/zh-hans-sg/web3/detail/501/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
	let lastPath = location.pathname.split('/').pop() || ''
	const ca = lastPath
	if (!ca) {
		cisLog('❌ ca is null');
		return;
	}
	
	let chainName = location.pathname.split('/').slice(-2)[0]
	if (chainName == '501') {
		chainName = 'Solana'
	} else if (chainName == '1') {
		chainName = 'Ethereum'
	} else if (chainName == '8453') {
		chainName = 'Base'
	} else {
		// 不支持
		chainName = ''
	}
	if (!chainName) {
		cisLog('❌ chainName is null');
		return;
	}
	
	// 代币名称
	let tokenNameNode = document.getElementsByClassName('ellipsis index_token-symbol__5VOJY')[0]
	let tokenName = tokenNameNode?.firstChild?.textContent || ''
	if (typeof tokenName == 'string') {
		tokenName = tokenName.trim();
	}

	if (!tokenName) {
		cisLog('❌ tokenName is null');
		return;
	}
	cisLog('tokenName is: ', tokenName)

	let panel = document.createElement("div");
    panel.id = 'cis-root';
    if (parent.children) {
		parent.insertBefore(panel, parent.children[0])
	} else {
		parent.appendChild(panel);
	}

    createRoot(panel).render(
      <StrictMode>
        <App ca={ca} chainName={chainName} tokenName={tokenName}/>
      </StrictMode>,
    )
	return true;
}

function insertContentToGMGN() {
	cisLog('insertContentToGMGN');
	document.querySelector('#cis-root')?.remove()

	// https://gmgn.ai/(.*)/token/(.*)
	let matchResult = location.href.match(/https:\/\/gmgn\.ai\/(.*)\/token\/(.*)/)
	if (!matchResult) {
		cisLog('skip insert')
		return;
	}

    const parent = document.getElementsByClassName('css-1jy8g2v')[0]
	if (!parent) {
		cisLog('empty parent')
		return;
	}

	let lastPath = location.pathname.split('/').pop() || ''
	// JMt41gX2_HeBCP2imwM8vosBqU5PBvm1PamCzWj2ch9ZhVrsLpump || HeBCP2imwM8vosBqU5PBvm1PamCzWj2ch9ZhVrsLpump
	// 获取_之后的字符串
	if (lastPath.includes('_')) {
		lastPath = lastPath.split('_').pop() || ''
	}
	const ca = lastPath
	if (!ca) {
		cisLog('❌ ca is null');
		return;
	}

	let chainName = location.pathname.split('/')[1]
	if (chainName == 'sol') {
		chainName = 'Solana'
	} else if (chainName == 'eth') {
		chainName = 'Ethereum'
	} else if (chainName == 'base') {
		chainName = 'Base'
	} else if (chainName == 'bsc') {
		chainName = 'bsc'
	} else {
		// 不支持
		chainName = ''
	}
	if (!chainName) {
		cisLog('❌ chainName is null');
		return;
	}
	
	// 代币名称
	let tokenName = document.getElementsByClassName('css-1av451l')[0].firstChild?.textContent || ''
	if (typeof tokenName == 'string') {
		tokenName = tokenName.trim();
	}
	if (!tokenName) {
		cisLog('❌ tokenName is null');
		return;
	}

	let panel = document.createElement("div");
    panel.id = 'cis-root';
    if (parent.children) {
		parent.insertBefore(panel, parent.children[parent.children.length - 1])
	} else {
		parent.appendChild(panel);
	}

    createRoot(panel).render(
      <StrictMode>
        <App ca={ca} chainName={chainName} tokenName={tokenName}/>
      </StrictMode>,
    )
	return true;
}

function insertContentToDebot() {
	cisLog('insertContentToDebot');
	document.querySelector('#cis-root')?.remove()

	// https://debot.ai/token/solana/3htuDTQpnFd1J46KRGqCezMhBFT4JwBHKquARtzvpump
	let matchResult = location.href.match(/https:\/\/debot\.ai\/token\/(.*)\/(.*)/)
	if (!matchResult) {
		cisLog('skip insert')
		return;
	}

    const parent = document.getElementsByClassName('modernize-7dckhh')[0]
	if (!parent) {
		cisLog('empty parent')
		return;
	}

	let lastPath = location.pathname.split('/').pop() || ''
	// JMt41gX2_HeBCP2imwM8vosBqU5PBvm1PamCzWj2ch9ZhVrsLpump || HeBCP2imwM8vosBqU5PBvm1PamCzWj2ch9ZhVrsLpump
	// 获取_之后的字符串
	if (lastPath.includes('_')) {
		lastPath = lastPath.split('_').pop() || ''
	}
	const ca = lastPath
	if (!ca) {
		cisLog('❌ ca is null');
		return;
	}

	let chainName = location.pathname.split('/')[2]
	if (chainName.startsWith('sol')) {
		chainName = 'Solana'
	} else if (chainName.startsWith('eth')) {
		chainName = 'Ethereum'
	} else if (chainName == 'base') {
		chainName = 'Base'
	} else if (chainName == 'bsc') {
		chainName = 'bsc'
	} else {
		// 不支持
		chainName = ''
	}
	if (!chainName) {
		cisLog('❌ chainName is null');
		return;
	}
	
	// 代币名称
	let tokenName = document.getElementsByClassName('modernize-d5e0it')[0]?.firstChild?.textContent || ''
	if (typeof tokenName == 'string') {
		tokenName = tokenName.trim();
	}
	if (!tokenName) {
		cisLog('❌ tokenName is null');
		return;
	}

	let panel = document.createElement("div");
    panel.id = 'cis-root';
    if (parent.children) {
		parent.insertBefore(panel, parent.children[parent.children.length - 1])
	} else {
		parent.appendChild(panel);
	}

    createRoot(panel).render(
      <StrictMode>
        <App ca={ca} chainName={chainName} tokenName={tokenName}/>
      </StrictMode>,
    )
	return true;
}

function insertContentToLogearn() {
	cisLog('insertContentToLogearn');
	document.querySelector('#cis-root')?.remove()

	// https://logearn.com/en/solana/tokens/2VKBwYWzUbCUt8whqe3iA8TafXrMeE9MaLHcXqSrpump
	let matchResult = location.href.match(/https:\/\/logearn\.com\/(.*)\/(.*)\/tokens\/(.*)/)
	if (!matchResult) {
		cisLog('skip insert')
		return;
	}

    const parent = document.getElementsByClassName('md:h-12 h-16 px-2 flex justify-between header-nav md:px-2')[0]
	if (!parent) {
		cisLog('empty parent')
		return;
	}

	let lastPath = location.pathname.split('/').pop() || ''
	// JMt41gX2_HeBCP2imwM8vosBqU5PBvm1PamCzWj2ch9ZhVrsLpump || HeBCP2imwM8vosBqU5PBvm1PamCzWj2ch9ZhVrsLpump
	// 获取_之后的字符串
	if (lastPath.includes('_')) {
		lastPath = lastPath.split('_').pop() || ''
	}
	const ca = lastPath
	if (!ca) {
		cisLog('❌ ca is null');
		return;
	}

	let chainName = location.pathname.split('/').slice(-3)[0]
	if (chainName.startsWith('sol')) {
		chainName = 'Solana'
	} else if (chainName.startsWith('eth')) {
		chainName = 'Ethereum'
	} else if (chainName == 'base') {
		chainName = 'Base'
	} else if (chainName == 'bsc') {
		chainName = 'bsc'
	} else {
		// 不支持
		chainName = ''
	}
	if (!chainName) {
		cisLog('❌ chainName is null');
		return;
	}
	
	// 代币名称
	let tokenName = document.querySelector('.flex.items-center.justify-start.text-kd14px14px >span')?.firstChild?.textContent || ''
	if (typeof tokenName == 'string') {
		tokenName = tokenName.trim();
	}
	if (!tokenName) {
		cisLog('❌ tokenName is null');
		return;
	}

	let panel = document.createElement("div");
    panel.id = 'cis-root';
    if (parent.children) {
		parent.insertBefore(panel, parent.children[parent.children.length - 1])
	} else {
		parent.appendChild(panel);
	}

    createRoot(panel).render(
      <StrictMode>
        <App ca={ca} chainName={chainName} tokenName={tokenName}/>
      </StrictMode>,
    )
	return true;
}

function insertContentToAngryx() {
	cisLog('insertContentToAngryx');
	document.querySelector('#cis-root')?.remove()

	// https://angryx.io/token/sol/GKaJr3TCAPYwkJvMPpKG7ya5pSTBvTMsTXGJJKEKpump
	// https://angryx.io/token/sol/GKaJr3TCAPYwkJvMPpKG7ya5pSTBvTMsTXGJJKEKpump/
	let matchResult = location.href.match(/https:\/\/angryx\.io\/token\/(.*)\/(.*)/)
	if (!matchResult) {
		cisLog('skip insert')
		return;
	}

    const parent = document.querySelector('.flex.items-center.h-20.gap-x-5.px-3')
	if (!parent) {
		cisLog('empty parent')
		return;
	}
	
	// https://angryx.io/token/sol/GKaJr3TCAPYwkJvMPpKG7ya5pSTBvTMsTXGJJKEKpump/
	// https://angryx.io/token/sol/GKaJr3TCAPYwkJvMPpKG7ya5pSTBvTMsTXGJJKEKpump
	let pathname = location.pathname;
	if (pathname.endsWith('/')) {
		pathname = location.pathname.slice(0, location.pathname.length - 1)
	}

	let lastPath = pathname.split('/').pop() || ''
	// JMt41gX2_HeBCP2imwM8vosBqU5PBvm1PamCzWj2ch9ZhVrsLpump || HeBCP2imwM8vosBqU5PBvm1PamCzWj2ch9ZhVrsLpump
	// 获取_之后的字符串
	if (lastPath.includes('_')) {
		lastPath = lastPath.split('_').pop() || ''
	}
	const ca = lastPath
	if (!ca) {
		cisLog('❌ ca is null');
		return;
	}

	let chainName = pathname.split('/').slice(-2)[0]
	if (chainName.startsWith('sol')) {
		chainName = 'Solana'
	} else if (chainName.startsWith('eth')) {
		chainName = 'Ethereum'
	} else if (chainName == 'base') {
		chainName = 'Base'
	} else if (chainName == 'bsc') {
		chainName = 'bsc'
	} else {
		// 不支持
		chainName = ''
	}
	if (!chainName) {
		cisLog('❌ chainName is null');
		return;
	}
	
	// 代币名称
	let tokenName = document.querySelector('div.flex.items-center.gap-x-1 span.font-medium')?.firstChild?.textContent || ''
	if (typeof tokenName == 'string') {
		tokenName = tokenName.trim();
	}
	if (!tokenName) {
		cisLog('❌ tokenName is null');
		return;
	}

	let panel = document.createElement("div");
    panel.id = 'cis-root';
    if (parent.children) {
		parent.insertBefore(panel, parent.children[parent.children.length - 1])
	} else {
		parent.appendChild(panel);
	}

    createRoot(panel).render(
      <StrictMode>
        <App ca={ca} chainName={chainName} tokenName={tokenName}/>
      </StrictMode>,
    )
	return true;
}


function insertContentToAVE() {
	document.querySelector('#cis-root')?.remove()

	let matchResult = location.href.match(/https:\/\/ave\.ai\/token\/(.*)\-(.*)/)
	if (!matchResult) {
		cisLog('skip insert')
		return;
	}

	// https://ave.ai/token/CVFh76y2f3gauzXGFiSNHYaAcfAc8JNwNxjV7SmHUvaL-solana
	const parent = document.getElementsByClassName('tokenInfo-container')[0]
	if (!parent) {
		cisLog('empty parent')
		return;
	}

	let lastPath = location.pathname.split('/').pop() || ''
	// lastPath = https://ave.ai/token/0x194b302a4b0a79795fb68e2adf1b8c9ec5ff8d1f-bsc
	let [ca, chainName] = lastPath.split('-')
	if (chainName == 'solana') {
		chainName = 'Solana'
	} else if (chainName == 'eth') {
		chainName = 'Ethereum'
	} else if (chainName == 'base') {
		chainName = 'Base'
	} else if (chainName == 'bsc') {
		chainName = 'bsc'
	} else {
		// 不支持
		chainName = ''
	}
	if (!ca) {
		cisLog('❌ ca is null');
		return;
	}
	if (!chainName) {
		cisLog('❌ chainName is null');
		return;
	}
	
	// 代币名称
	let tokenNameNode = document.getElementsByClassName('flex-start clickable-btn')[0]
	let tokenName = tokenNameNode?.firstChild?.textContent || ''
	if (typeof tokenName == 'string') {
		tokenName = tokenName.trim();
	}
	if (!tokenName) {
		cisLog('❌ tokenName is null');
		return;
	}
	cisLog('tokenName is: ', tokenName)

	let panel = document.createElement("div");
    panel.id = 'cis-root';
    if (parent.children) {
		parent.insertBefore(panel, parent.children[1])
	} else {
		parent.appendChild(panel);
	}

    createRoot(panel).render(
      <StrictMode>
        <App ca={ca} chainName={chainName} tokenName={tokenName}/>
      </StrictMode>,
    )
	return true;
}

function insertContentToXXYY() {
	document.querySelector('#cis-root')?.remove()

	let matchResult = location.href.match(/https:\/\/.*\.xxyy\.io\/(.*)\/(.*)/)
	if (!matchResult) {
		cisLog('skip insert')
		return;
	}

	// https://pro.xxyy.io/sol/A1b61xWnT6jxK6AZnxC5EZjGP3cdkN1Fz6oLSm4sR8qk
	const parent = document.getElementsByClassName('topbar')[0]
	if (!parent) {
		cisLog('empty parent')
		return;
	}

	const linkElement = document.querySelector('a[href*="solscan.io/token"]') as HTMLAnchorElement;
	let ca, chainName, tokenName;
	if (linkElement) {
		const href = linkElement.href; // 获取 href 属性
		ca = href.split('/').pop(); // 提取 ca
		chainName = 'Solana'
		tokenName = linkElement.textContent?.trim(); // 提取 tokenName
	} else {
		cisLog("❌ linkElement is null");
		return;
	}

	if (!ca) {
		cisLog('❌ ca is null');
		return;
	}

	if (!chainName) {
		cisLog('❌ chainName is null');
		return;
	}

	// 代币名称
	// let tokenName = '';
	// for (const key in window) {
	// 	const win = window[key]
	// 	const linkElement = document.querySelector('a[href*="solscan.io/token"]');
	// 	tokenName = win?.document.getElementsByClassName('title-l31H9iuA mainTitle-l31H9iuA apply-overflow-tooltip withDot-l31H9iuA')[0]?.textContent || ''
	// 	if (tokenName) {
	// 		break;
	// 	}
	// }
	
	if (typeof tokenName == 'string') {
		tokenName = tokenName.trim();
	}
	if (!tokenName) {
		cisLog('❌ tokenName is null');
		return;
	}
	cisLog('tokenName is: ', tokenName)

	let panel = document.createElement("div");
    panel.id = 'cis-root';
	panel.style.marginTop = "8px";
    if (parent.children) {
		parent.insertBefore(panel, parent.children[1])
	} else {
		parent.appendChild(panel);
	}

    createRoot(panel).render(
      <StrictMode>
        <App ca={ca} chainName={chainName} tokenName={tokenName}/>
      </StrictMode>,
    )
	return true;
}



if (location.hostname === 'localhost') {
	const ca = ''
	const chainName = ''
	createRoot(document.getElementById('ci-test-root')!).render(
		<StrictMode>
			<App ca={ca} chainName={chainName} tokenName={''}/>
		</StrictMode>,
	)
} else {
	// 开始初始化
	initializeObservers();
}
