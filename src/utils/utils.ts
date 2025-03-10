

export function formatTime(inputTime: number | string, format: string) {
	const parsedTime = new Date(Number(inputTime))
	const year = parsedTime.getFullYear()
	const month = (parsedTime.getMonth() + 1).toString().padStart(2, '0')
	const day = parsedTime.getDate().toString().padStart(2, '0')
	const hours = parsedTime.getHours().toString().padStart(2, '0')
	const minutes = parsedTime.getMinutes().toString().padStart(2, '0')
	const seconds = parsedTime.getSeconds().toString().padStart(2, '0')

	const formattedTime = format
		.replace('YYYY', year + '')
		.replace('MM', month)
		.replace('dd', day)
		.replace('hh', hours)
		.replace('mm', minutes)
		.replace('ss', seconds)

	return formattedTime
}

// 封装 console.log 函数，输出时增加前缀 [meme-radar]
export function cisLog(...args: any[]) {
	console.log('[meme-radar]', ...args)
}

export function getURL(path: string) {
	if (chrome.runtime) {
	  return chrome.runtime.getURL(path);
	}
	return path
}