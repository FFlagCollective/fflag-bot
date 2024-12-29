import { ChatInputCommandInteraction, SlashCommandBuilder, type CommandInteraction, type Interaction } from "discord.js";


export default {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repeats your message')
        .addStringOption(option =>
            option.setName('message')
            .setDescription('The message to repeat')
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        //@ts-expect-error it will exist
        await interaction.reply(interaction.options.getString('message'));
    }
}