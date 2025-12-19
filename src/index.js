import { Client, GatewayIntentBits, Events } from 'discord.js'
import { CONFIG } from './config.js'
import { handleReady } from './events/ready.js'
import { handleVoiceStateUpdate } from './events/voiceStateUpdate.js'
import { handleMessageCreate } from './events/messageCreate.js'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.once(Events.ClientReady, (c) => handleReady(c))
client.on(Events.VoiceStateUpdate, (oldState, newState) => handleVoiceStateUpdate(oldState, newState))
client.on(Events.MessageCreate, (message) => handleMessageCreate(message, client))

client.login(CONFIG.TOKEN)