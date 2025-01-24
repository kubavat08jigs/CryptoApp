import { useCallback, useRef } from 'react';
let lastTime = null;

export function throttle(callback, delay) {

    // const throttledCallback = ((...args) => {
    const now = Date.now();
    if (!lastTime || now - lastTime >= delay) {
        lastTime = now;
        callback();
    }
    // }, [callback, delay]);
}

export function debounce(callback, delay, debounceTimer) {
    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
    }
    debounceTimer.current = setTimeout(() => {
        console.log("callback called");
        callback();
        debounceTimer.current = null;
    }, delay);
}
