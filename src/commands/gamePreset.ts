import { ActionRowBuilder, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type Interaction } from "discord.js";

const aliases = {
    "The Strongest Battlegrounds": 10449761463,
    "General purpose": 0
}

const games = {
    10449761463: [
        "low quality - fast dashes",
        "high quality - slightly slower dashes",
    ],
    0: [
        "Hitbox Expander - Variant 1",
        "Hitbox Expander - Variant 2",
        "Hitbox Expander - Variant 3",
        "Hitbox Expander - Variant 4",
    ]
}

export default {
    data: new SlashCommandBuilder()
        .setName('game-preset')
        .setDescription('Find a FFlag preset for a game')
        .addStringOption(option =>
            option.setName('preset')
            .setDescription('The game preset to set')
            //@ts-ignore 
            .addChoices(Object.entries(aliases).map((value) => ({name: String(value[0]), value: String(value[1])})))
            .setRequired(true)),
    async execute(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        //@ts-expect-error it will exist
        const preset: string = interaction.options.getString('preset');
        
        // if (games[preset as number] == undefined || games[aliases[preset]] == undefined) 
        //     return await interaction.reply({ content: 'That game does not have a preset', ephemeral: true });

        const baseUrl = "https://raw.githubusercontent.com/FFlagCollective/game-presets/refs/heads/main/"
        const gameUrl = `${baseUrl}${preset ?? aliases[preset]}/`

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('game-preset')
            .setPlaceholder('Select a preset')
           
            //@ts-ignore
            .addOptions(games[preset].map((game, index) => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(game)
                    .setValue(String(index))
                    .setDescription(`Preset ${index + 1}`)
        }))
        const row = new ActionRowBuilder().addComponents(selectMenu);
        //@ts-ignore
        const gameResponse = await interaction.reply({ content: 'Select a preset', components: [row] });
        const collector = gameResponse.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30_000 });  
        collector.on('collect', async i => {
        	const selection = i.values[0];
            await interaction.followUp({ content: `${gameUrl}/${selection}.json`, ephemeral: true });
            return;
        })
    }
}