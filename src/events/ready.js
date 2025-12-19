import cron from 'node-cron'
import { CONFIG } from '../config.js'
import { popDailyPlayers } from '../services/playerService.js'
import { sendBanquidleInvite } from '../utils/messageUtils.js'

export function handleReady(client) {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`)

    cron.schedule(CONFIG.CRON_SCHEDULE, async () => {
        console.log('> running daily..')
        
        const playerIds = await popDailyPlayers()
        
        let mentionString = ""
        if (playerIds.length > 0) {
            const pings = playerIds.map(id => `<@${id}>`).join(' ')
            mentionString = `\n\n🥸 **ping:** ${pings}`
        }
        
        await sendBanquidleInvite(client, null, mentionString)
    }, {
        timezone: CONFIG.TIMEZONE
    })
}
