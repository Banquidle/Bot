import cron from 'node-cron'
import {REST, Routes, ApplicationCommandType} from 'discord.js'
import {CONFIG} from '../config.js'
import {popDailyPlayers} from '../services/playerService.js'
import {sendBanquidleInvite} from '../utils/messageUtils.js'

export async function handleReady(client) {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`)

    cron.schedule(CONFIG.CRON_SCHEDULE, async () => {
        console.log('> running daily..')

        const playerIds = await popDailyPlayers()

        let mentionString = ""

        if (playerIds.length > 0) {
            const fetchPromises = playerIds.map(async (id) => {
                try {
                    console.log("Try to fetch for", id)
                    const response = await fetch(`https://banquidle-webapp.antlia.dopolytech.fr/api/nb_tries_yesterday?user_id=${id}`)
                    const data = await response.json()
                    const tries = data.nb || 0
                    return `<@${id}>: ${tries === 1 ? '1st try' : `${tries} essais`}`
                } catch (error) {
                    console.error(`Failed to fetch tries for player ${id}:`, error)
                    return `${id}: unavailable (check bot serv errors for details)`
                }
            })

            const playerResults = await Promise.all(fetchPromises)
            mentionString = `Performance d'hier :\n${playerResults.map(result => `- ${result}`).join('\n')}\n\n`
        }

        await sendBanquidleInvite(client, null, mentionString)
    }, {
        timezone: CONFIG.TIMEZONE
    })
}
