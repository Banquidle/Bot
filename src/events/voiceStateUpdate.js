import { CONFIG } from '../config.js'
import { trackPlayer } from '../services/playerService.js'

export async function handleVoiceStateUpdate(oldState, newState) {
    if (newState.member.user.bot) return

    if (newState.channelId === CONFIG.VOICE_CHANNEL_ID && oldState.channelId !== CONFIG.VOICE_CHANNEL_ID) {
        await trackPlayer(newState.member.id)
    }
}