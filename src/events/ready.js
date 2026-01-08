import cron from 'node-cron'
import { REST, Routes, ApplicationCommandType } from 'discord.js'
import { CONFIG } from '../config.js'
import { popDailyPlayers } from '../services/playerService.js'
import { sendBanquidleInvite } from '../utils/messageUtils.js'

export async function handleReady(client) {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`)

    const commands = [
        {
            name: 'play',
            description: 'Launch Banquidle via slash command!',
        },
        {
            name: 'Launch',
            type: ApplicationCommandType.PrimaryEntryPoint,
            description: 'Start the Activity',
        },
    ]

    const rest = new REST({ version: '10' }).setToken(CONFIG.TOKEN)

    try {
        console.log('Refreshing application (/) commands...')
        await rest.put(Routes.applicationCommands(CONFIG.ACTIVITY_ID), { body: commands })
        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error('Error reloading commands:', error)
    }

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
