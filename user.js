export default async function handler(req, res) {
    const { userId } = req.query;

    // Validar ID
    if (!userId) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
    }

    if (!/^\d{17,19}$/.test(userId)) {
        return res.status(400).json({ error: 'ID de Discord inválido' });
    }

    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const GUILD_ID = process.env.DISCORD_GUILD_ID;

    if (!BOT_TOKEN || !GUILD_ID) {
        return res.status(500).json({
            error: 'Variables de entorno no configuradas'
        });
    }

    try {
        const response = await fetch(
            `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}`,
            {
                headers: {
                    Authorization: `Bot ${BOT_TOKEN}`
                }
            }
        );

        if (response.status === 404) {
            return res.status(404).json({
                error: 'Usuario no encontrado en el servidor'
            });
        }

        if (!response.ok) {
            return res.status(response.status).json({
                error: `Error Discord API ${response.status}`
            });
        }

        const member = await response.json();

        // Respuesta LIMPIA y LEGAL
        return res.status(200).json({
            id: member.user.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            avatar: member.user.avatar
                ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
                : null,
            created_at: new Date(
                (BigInt(member.user.id) >> 22n) + 1420070400000n
            ).toISOString()
        });

    } catch (err) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}
