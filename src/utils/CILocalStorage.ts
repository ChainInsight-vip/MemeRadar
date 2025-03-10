class CILocalStorage {
    get(option: Record<string, any>, callback: (result: any) => void) {
        if (chrome.storage) {
            return chrome.storage.local.get(option, callback)
        }

        let result: Record<string, any> = {};
        for (const key in option) {
            const defaultValue = option[key];
            let value = localStorage.getItem(key)
            if (value === undefined) {
                result[key] = defaultValue;
            }

            if (value) {
                result[key] = JSON.parse(value);
            }
            result[key] = value;
        }
        callback(result)
    }
    set(option: Record<string, any>, callback: () => void) {
        if (chrome.storage) {
            return chrome.storage.local.set(option, callback);
        }

        for (const key in option) {
            const value = option[key];
            localStorage.setItem(key, JSON.stringify(value))
        }
        callback()
    }
}

const ciLocalStorage = new CILocalStorage()
export default ciLocalStorage;
