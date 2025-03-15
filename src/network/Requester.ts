import { cisLog } from '../utils/utils.ts'
import { getData, postData } from './network.ts'

export interface ResponseData {
	code: number
	msg: string
	data?: Record<string, any>
}

class Requester {
	private _handleError(err: any): Promise<ResponseData> {
		if (typeof err === 'string') {
			return Promise.resolve({
				code: -1,
				msg: err,
			})
		} else if (err instanceof Error) {
			return Promise.resolve({
				code: -1,
				msg: err.message,
			})
		} else {
			return Promise.resolve({
				code: -1,
				msg: 'system error, please try again',
			})
		}
	}
	private async _get(path: string, param = {}) {
		try {
			return await getData(path, param)
		} catch (err) {
			return this._handleError(err)
		}
	}

	private async _post(path: string, param = {}) {
		try {
			return await postData(path, param)
		} catch (err) {
			cisLog('--err', err)
			return this._handleError(err)
		}
	}

	public activateCode(code: string): Promise<ResponseData> {
		return this._post('/api/v0/plugin/use_invitation_code', { invitationCode: code })
	}

	public checkPluginUpdate(version: string) {
		function versionToNumber(version: string) {
			// 将字符串版本，按规则转成数字，如：1.1.0 -> 10100
			return version.split('.').reduce((acc, num) => acc * 100 + parseInt(num), 0)
		}

		return this._post('/api/v0/plugin/check_user_address', { version: versionToNumber(version)})
	}

	// 叙事
	public async fetchTokenNarrate(ca: string, chainName: string) {
		const resp = await this._post('/api/v0/util/query/analyze_token_narrative', {contractAddress: ca, chain: chainName})
		if (resp.code == 0 && resp.data.narrative) {
			return resp.data.narrative;
		}
		return '暂无相关数据'
	}

	// dev 持仓信息
	public async fetchDevInsiderInfo(ca: string) {
		const resp = await this._get('/api/v1/insider/dev_tokens', {ca})
		if (resp.code == 0 && resp.data.data) {
			return resp.data.data;
		}
		return;
	}

	public async fetchCATwitterInfo(ca: string, chainName: string) {
		const resp = await this._post('/api/v0/util/query/analyze_token_twitter', {contractAddress: ca, chain: chainName})
		if (resp.code == 0 && resp.data) {
			return resp.data;
		}
		return;
	}
	
	// public async fetchCABasicInfo(ca: string, chainName: string) {
	// 	const [narrate, devInsiderInfo, twitterInfo] = await Promise.all([
	// 		this.fetchTokenNarrate(ca, chainName),
	// 		this.fetchDevInsiderInfo(ca),
	// 		this.fetchCATwitterInfo(ca, chainName)
	// 	])

	// 	return {
	// 		narrate,
	// 		devInsiderInfo,
	// 		twitterInfo
	// 	}
	// }

	public async fetchKOLTransactionInfo(ca: string) {
		const resp = await this._get('/api/v0/util/query/kol_analysis_by_token', { tokenAddress: ca})
		if (resp.code == 0 && resp.data) {
			return resp.data;
		}
		return;
	}

	private delay(second: number) {
		return new Promise<void>(resolve => {
			setTimeout(() => {
				resolve()
			}, second * 1000)
		})
	}

	public async fetchCommunityInfo(ca: string, chainName: string) : Promise<any> {
		const resp = await this._post('/api/v0/util/query/analyze_token_community_v2', {contractAddress: ca, chain: chainName})
		if (resp.code == 0 && resp.data) {
			return resp.data;
		}
		return;
	}

	public async fetchCallChannelInfo(ca: string, chainName: string, retryTimes = 5) : Promise<any> {
		const resp = await this._post('/api/v0/util/query/analyze_token_call_channel', {contractAddress: ca, chain: chainName})
		if (resp.code == 100 && retryTimes > 0) {
			retryTimes -= 1;
			await this.delay(2)
			return await this.fetchCallChannelInfo(ca, chainName, retryTimes);
		} else if (resp.code == 0 && resp.data) {
			return resp.data;
		}
		return;
	}
}

export default new Requester()