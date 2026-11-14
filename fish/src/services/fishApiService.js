let preloadedPuzzlePromise = null;

async function requestPuzzle(url, timeoutMs = 15000) {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok)
        throw new Error(`HTTP error ${res.status}`);
    const isJson = url.includes('out=json') || res.headers.get('content-type')?.includes('application/json');
    if (isJson) {
        const data = await res.json();
        const rawBase64 = data.question || '';
        const imageData = rawBase64.startsWith('http')
            ? rawBase64
            : rawBase64.startsWith('data:')
                ? rawBase64
                : `data:image/png;base64,${rawBase64}`;
        const fishCount =
            typeof data.fish === 'number'
                ? data.fish
                : typeof data.solution === 'number'
                    ? data.solution
                    : typeof data.answer === 'number'
                        ? data.answer
                        : parseInt(data.fish || data.solution || data.answer, 10) || 0;
        const chestCount =
            typeof data.chest === 'number'
                ? data.chest
                : parseInt(data.chest, 10) || Math.max(1, Math.min(5, Math.ceil(fishCount / 2)));
        return {
            imageData,
            fishCount,
            chestCount: Math.max(1, chestCount),
        };
    }
    else {
        const text = (await res.text()).trim();
        const commaIdx = text.indexOf(',');
        if (commaIdx > 0) {
            const rawBase64 = text.substring(0, commaIdx).trim();
            const remainder = text.substring(commaIdx + 1).trim();
            const parts = remainder.split(',');
            const fishCount = parseInt(parts[0].trim(), 10) || 0;
            const chestCount = parts.length > 1
                ? parseInt(parts[1].trim(), 10) || Math.max(1, Math.min(5, Math.ceil(fishCount / 2)))
                : Math.max(1, Math.min(5, Math.ceil(fishCount / 2)));
            const imageData = rawBase64.startsWith('data:')
                ? rawBase64
                : `data:image/png;base64,${rawBase64}`;
            return {
                imageData,
                fishCount,
                chestCount,
            };
        }
        throw new Error('Invalid CSV structure');
    }
}

async function doFetchFishPuzzle() {
    try {
        const res = await fetch('/api/puzzle', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
        if (res.ok) {
            const data = await res.json();
            if (data && data.success) {
                const fishCount =
                    typeof data.fish === 'number'
                        ? data.fish
                        : typeof data.solution === 'number'
                            ? data.solution
                            : parseInt(data.fish || data.solution, 10) || 0;
                const chestCount =
                    typeof data.chest === 'number'
                        ? data.chest
                        : parseInt(data.chest, 10) || Math.max(1, Math.min(5, Math.ceil(fishCount / 2)));
                return {
                    imageData: data.question,
                    fishCount,
                    chestCount,
                };
            }
        }
    }
    catch {}

    try {
        const puzzle = await requestPuzzle('/api/marcconrad/uob/fish/api.php?out=json&base64=yes', 15000);
        return puzzle;
    }
    catch (err) {
        console.warn('Vite proxy failed, trying direct JSON:', err);
    }

    try {
        const puzzle = await requestPuzzle('/api/marcconrad/uob/fish/api.php?out=csv&base64=yes', 15000);
        return puzzle;
    }
    catch (err) {}

    try {
        const puzzle = await requestPuzzle('https://marcconrad.com/uob/fish/api.php?out=json&base64=yes', 18000);
        return puzzle;
    }
    catch (err) {
        console.warn('Direct JSON failed, trying CSV format:', err);
    }

    try {
        const puzzle = await requestPuzzle('https://marcconrad.com/uob/fish/api.php?out=csv&base64=yes', 18000);
        return puzzle;
    }
    catch (err) {
        console.warn('Direct CSV failed:', err);
    }

    return {
        imageData: '/game-assets/fish-puzzle-sample.png',
        fishCount: 4,
        chestCount: 2,
    };
}

export function preloadNextFishPuzzle() {
    preloadedPuzzlePromise = doFetchFishPuzzle();
}

export async function fetchFishPuzzle() {
    if (preloadedPuzzlePromise) {
        const p = preloadedPuzzlePromise;
        preloadedPuzzlePromise = null;
        try {
            const cached = await p;
            setTimeout(preloadNextFishPuzzle, 1000);
            return cached;
        }
        catch {
        }
    }
    const result = await doFetchFishPuzzle();
    setTimeout(preloadNextFishPuzzle, 1000);
    return result;
}

export default {
    fetchFishPuzzle,
    preloadNextFishPuzzle,
};
