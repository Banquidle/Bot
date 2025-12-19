import { ActionRowBuilder, ButtonBuilder, ButtonStyle, InviteTargetType } from 'discord.js'
import { CONFIG } from '../config.js'

export async function sendBanquidleInvite(client, targetMessage = null, extraContent = "") {
    if (!CONFIG.ACTIVITY_ID) {
        console.error("ACTIVITY_ID is missing in env.")
        return
    }

    try {
        const guild = await client.guilds.fetch(CONFIG.GUILD_ID)
        const voiceChannel = guild.channels.cache.get(CONFIG.VOICE_CHANNEL_ID)

        if (!voiceChannel) {
            console.error("Voice channel not found.")
            return
        }

        const invite = await voiceChannel.createInvite({
            targetType: InviteTargetType.EmbeddedApplication,
            targetApplication: CONFIG.ACTIVITY_ID
        })

        const startButton = new ButtonBuilder()
            .setLabel('Start Banquidle')
            .setStyle(ButtonStyle.Link)
            .setURL(invite.url)

        const row = new ActionRowBuilder().addComponents(startButton)

        const payload = {
            content: `Rejoins le **Banquidle** du jour !${extraContent}`,
            components: [row]
        }

        if (targetMessage) {
            await targetMessage.reply(payload)
        } else {
            const textChannel = guild.channels.cache.get(CONFIG.TEXT_CHANNEL_ID)
            if (textChannel?.isTextBased()) {
                await textChannel.send(payload)
            }
        }
    } catch (error) {
        console.error("Error sending invite:", error)
    }
}
