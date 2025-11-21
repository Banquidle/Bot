import cron from 'node-cron'
import dotenv from 'dotenv'

dotenv.config()

const GUILD = '1297123181739376700'
const VOICE_CHANNEL = '1348761088556142612'
const TEXT_CHANNEL = '1297123182503002174'

const CRON = '0 10 * * *'

import {
    Client,
    GatewayIntentBits,
    Events,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    InviteTargetType
} from 'discord.js'

import { createRequire } from 'module'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Bot is ready! Logged in as ${readyClient.user.tag}`)

    cron.schedule(CRON, () => {
        console.log('Running daily task: sending Banquidle invitation !')
        sendButton()
    }, {
        timezone: "Europe/Paris"
    })
})

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return

    if (message.content.toLowerCase().startsWith('!b'))
    {
        sendButton(message)
    }
})

async function sendButton(message = null)
{
    const activityId = process.env.ACTIVITY_ID

    if (!activityId) {
        console.error("ACTIVITY_ID is not set in .env file.")
        return
    }

    const voiceChannel = client.guilds.cache.get(GUILD).channels.cache.get(VOICE_CHANNEL)

    const invite = await voiceChannel.createInvite({
        targetType: InviteTargetType.EmbeddedApplication,
        targetApplication: activityId
    })

    const startButton = new ButtonBuilder()
        .setLabel('Start Banquidle')
        .setStyle(ButtonStyle.Link)
        .setURL(invite.url)

    const row = new ActionRowBuilder().addComponents(startButton)

    const toSend = {
        content: `Rejoins le **Banquidle** du jour !`,
        components: [row]
    }

    if (message) {
        await message.reply(toSend)
    } else {
        const guild = await client.guilds.fetch(GUILD);
        const channels = await guild.channels.fetch();
        const textChannel = channels.get(TEXT_CHANNEL);

        if (textChannel && textChannel.isTextBased()) {
            await textChannel.send(toSend)
        } else {
            console.error("Target Text Channel not found or is not a text channel.")
        }
    }
}

client.login(process.env.TOKEN)

