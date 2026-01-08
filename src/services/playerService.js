import { promises as fs } from 'fs'
import { CONFIG } from '../config.js'

export async function trackPlayer(userId) {
    try {
        let players = []
        try {
            const data = await fs.readFile(CONFIG.STORAGE_FILE, 'utf-8')
            players = JSON.parse(data)
        } catch (err) {
        }

        if (!players.includes(userId)) {
            players.push(userId)
            await fs.writeFile(CONFIG.STORAGE_FILE, JSON.stringify(players, null, 2))
            console.log(`[PlayerService] Tracked user: ${userId}`)
        }
    } catch (error) {
        console.error('[PlayerService] Error tracking player:', error)
    }
}

export async function popDailyPlayers() {
    try {
        const data = await fs.readFile(CONFIG.STORAGE_FILE, 'utf-8')
        const players = JSON.parse(data)
        
        await fs.writeFile(CONFIG.STORAGE_FILE, JSON.stringify([]))
        
        return players
    } catch (err) {
        return []
    }
}
