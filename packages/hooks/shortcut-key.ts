
export default function useShortcutKey() {

    let keydown = "";
    let keyArray: Array<string> = [];

    const handleKeyDown = (e: KeyboardEvent, handle?: ShortcutKeyType) => {
        const activeElement = document.activeElement?.tagName || "";
        const disableShortcutElement = ['INPUT', 'TEXTAREA'];
        if (disableShortcutElement.includes(activeElement)) return;
        if (keyArray.length > 0) {
            // a-z的按键 长按去重
            if (keyArray.indexOf(e.key.toLowerCase()) >= 0) {
                return;
            }
        }
        keyArray.push(e.key.toLowerCase());
        keydown = keyArray.join("+");
        // 监听按键捕获
        if (handle && handle[keydown]) {
            e.preventDefault();
            handle[keydown]();
        }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
        keyArray.splice(keyArray.indexOf(e.key.toLowerCase()), 1);
        keydown = keyArray.join("+");
        e.preventDefault();
    }

    return {
        handleKeyUp,
        handleKeyDown
    }

}