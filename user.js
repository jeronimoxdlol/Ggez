export default async function handler(req, res) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
    }

    if (!/^\d{17,19}$/.test(userId)) {
        return res.status(400).json({ error: 'ID de Discord invÃ¡lido' });
    }

    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN) {
        return res.status(500).json({ error: 'Token de bot no configurado' });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bot ${BOT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                return res.status(401).json({ error: 'Token de bot invÃ¡lido' });
            } else if (response.status === 404) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            } else {
                return res.status(response.status).json({ error: `Error ${response.status}` });
            }
        }

        const userData = await response.json();
        res.status(200).json(userData);
        
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar usuario' });
    }
}