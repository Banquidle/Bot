import { Routes } from 'discord.js'
import { trackPlayer } from '../services/playerService.js'

export async function handleInteractionCreate(interaction, client) {
    const isPlayCommand = interaction.isChatInputCommand() && interaction.commandName === 'play'
    const isStartButton = interaction.isButton() && interaction.customId === 'start_banquidle'

    if (isPlayCommand || isStartButton) {
        try {
            console.log(`[Interaction] User ${interaction.user.tag} started the activity.`)
            await trackPlayer(interaction.user.id)

            await client.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                body: {
                    type: 12
                }
            })
        } catch (error) {
            console.error("Failed to launch activity:", error)
        }
    }
}
