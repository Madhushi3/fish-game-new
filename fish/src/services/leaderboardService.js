export const FIGMA_LEADERBOARD = [];
const STORAGE_KEY = 'swimming_game_leaderboard_real_v1';
class LeaderboardService {
    async getLeaderboard(playerName = 'Madhushi', playerScore = 0) {
        const cleanPlayer = (playerName || 'Madhushi').trim();
        try {
            const res = await fetch(`/api/leaderboard?playerName=${encodeURIComponent(cleanPlayer)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {

                    const seen = new Set();
                    const deduplicated = [];
                    for (const item of data.data) {
                        const key = item.name.toLowerCase().trim();
                        if (!seen.has(key)) {
                            seen.add(key);
                            deduplicated.push({
                                ...item,
                                isCurrentPlayer: key === cleanPlayer.toLowerCase(),
                            });
                        }
                    }
                    const ranked = deduplicated.map((item, index) => ({
                        ...item,
                        rank: index + 1,
                    }));
                    if (ranked.length > 0) {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(ranked));
                    }
                    return ranked;
                }
            }
        }
        catch {

        }
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            let list = stored ? JSON.parse(stored) : [];
            const playerMap = new Map();
            for (const item of list) {
                const key = item.name.toLowerCase().trim();
                playerMap.set(key, { ...item, isCurrentPlayer: key === cleanPlayer.toLowerCase() });
            }

            const activeKey = cleanPlayer.toLowerCase();
            if (playerScore > 0 || playerMap.has(activeKey)) {
                const existing = playerMap.get(activeKey);
                if (existing) {
                    existing.score = Math.max(existing.score, playerScore);
                    existing.name = cleanPlayer;
                    existing.isCurrentPlayer = true;
                }
                else {
                    playerMap.set(activeKey, {
                        id: 'player_' + Date.now(),
                        name: cleanPlayer,
                        score: playerScore,
                        isCurrentPlayer: true,
                    });
                }
            }
            const sorted = Array.from(playerMap.values()).sort((a, b) => b.score - a.score);
            const ranked = sorted.map((item, index) => ({
                ...item,
                rank: index + 1,
            }));
            return ranked;
        }
        catch {
            return [];
        }
    }
    async submitScore(playerName, score) {
        try {
            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName, score }),
            });
        }
        catch {

        }
        const board = await this.getLeaderboard(playerName, score);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    }
}
export const leaderboardService = new LeaderboardService();
export default leaderboardService;
