/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import 'dotenv/config';
import { Markup, Telegraf } from 'telegraf';
import axios from 'axios';
console.log('Bot Token:', process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN!);

// URL base da sua API
const API_BASE_URL = 'http://localhost:3000';

// Comando /start
bot.start((ctx) => {
  ctx.replyWithPhoto(
    { source: 'src/bot/images/start.png' },
    {
      caption:
        'Bem-vindo! Eu posso te ajudar a encontrar informações sobre a FURIA. Use os botões abaixo ou o comando /help para ver as opções disponíveis.',
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('📰 Últimas notícias', 'news'),
          Markup.button.callback('⬅️ Últimos jogos', 'recent'),
        ],
        [
          Markup.button.callback('⚔️ Próximos jogos', 'next'),
          Markup.button.callback('📊 Estatísticas', 'stats'),
        ],
        [Markup.button.callback('📱 Contatos/Redes Sociais', 'socials')],
      ]),
    },
  );
});

bot.action('startbtton', (ctx) => {
  ctx.replyWithPhoto(
    { source: 'src/bot/images/start.png' },
    {
      caption:
        'Bem-vindo! Eu posso te ajudar a encontrar informações sobre a FURIA. Use os botões abaixo ou os comandos /recent, /next ou /news para começar!',
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('📰 Últimas notícias', 'news'),
          Markup.button.callback('⬅️ Últimos jogos', 'recent'),
        ],
        [
          Markup.button.callback('⚔️ Próximos jogos', 'next'),
          Markup.button.callback('📊 Estatísticas', 'stats'),
        ],
        [Markup.button.callback('📱 Contatos/Redes Sociais', 'socials')],
      ]),
    },
  );
});

bot.action('recent', async (ctx) => {
  try {
    const page = 1;
    const pageSize = 5;

    const response = await axios.get(
      `${API_BASE_URL}/matches/recent?page=${page}&pageSize=${pageSize}`,
    );
    const { matches, total } = response.data;

    if (matches.length === 0) {
      ctx.reply('Nenhum jogo recente encontrado.');
      return;
    }

    sendPaginatedMatches(ctx, matches, page, pageSize, total);
  } catch (error) {
    console.error('Erro ao buscar jogos recentes:', error);
    ctx.reply('Desculpe, não consegui buscar os jogos recentes no momento.');
  }
});

bot.action('next', async (ctx) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/matches/next`);
    const matches = response.data;

    if (matches.length === 0) {
      ctx.reply('Nenhum próximo jogo encontrado.');
      return;
    }

    const message = matches
      .map(
        (match: any) =>
          `🕒 ${match.date}\n🏆 ${match.team1} vs ${match.team2}\n🔗 [Detalhes do jogo](${match.matchLink})`,
      )
      .join('\n\n');

    ctx.replyWithMarkdownV2(message);
  } catch (error) {
    console.error('Erro ao buscar próximos jogos:', error);
    ctx.reply('Desculpe, não consegui buscar os próximos jogos no momento.');
  }
});

bot.action('news', async (ctx) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news`);
    const news = response.data;

    if (news.length === 0) {
      ctx.reply('Nenhuma notícia encontrada.');
      return;
    }

    const message = news
      .map(
        (item: any) =>
          `📰 *${item.title}*\n📅 ${item.date}\n🔗 [Leia mais](${item.link})`,
      )
      .join('\n\n');

    ctx.replyWithMarkdown(message);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    ctx.reply('Desculpe, não consegui buscar as notícias no momento.');
  }
});

bot.action('stats', async (ctx) => {
  await ctx.reply(
    'Escolha uma opção:',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('📊 Estatísticas do time', 'team_stats'),
        Markup.button.callback('👥 Estatísticas de um jogador', 'player_stats'),
      ],
      [Markup.button.callback('⬅️ Voltar', 'startbtton')],
    ]),
  );
});

bot.action('team_stats', async (ctx) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats/team`);
    const stats = response.data;

    const message =
      `📊 Estatísticas do time:\n\n` +
      `🏆 Mapas Jogados: ${stats.mapsPlayed}\n` +
      `✅ Vitórias: ${stats.wdl[0]}\n` +
      `❌ Derrotas: ${stats.wdl[1]}\n` +
      `🔢 Total de Kills: ${stats.totalKills}\n` +
      `💀 Total de Mortes: ${stats.totalDeaths}\n` +
      `🔥 Taxa de Vitória: ${stats.winRate}%\n` +
      `🎯 K/D Ratio: ${stats.kdRatio}`;

    await ctx.replyWithMarkdown(
      message,
      Markup.inlineKeyboard([[Markup.button.callback('⬅️ Voltar', 'stats')]]),
    );
  } catch (error) {
    console.error('Erro ao buscar estatísticas do time:', error);
    ctx.reply(
      'Desculpe, não consegui buscar as estatísticas do time no momento.',
    );
  }
});

bot.action('player_stats', async (ctx) => {
  await ctx.replyWithPhoto(
    { source: 'src/bot/images/lineup.png' },
    {
      caption: 'Escolha um jogador para ver as estatísticas:',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('FalleN', 'player_FalleN')],
        [Markup.button.callback('yuurih', 'player_yuurih')],
        [Markup.button.callback('YEKINDAR', 'player_YEKINDAR')],
        [Markup.button.callback('KSCERATO', 'player_KSCERATO')],
        [Markup.button.callback('molodoy', 'player_molodoy')],
        [Markup.button.callback('⬅️ Voltar', 'stats')],
      ]),
    },
  );
});

bot.action(/player_(.+)/, async (ctx) => {
  let playerName = ctx.match[1];
  console.log('Jogador selecionado:', playerName);

  if (playerName === 'fallen') {
    console.log('Jogador selecionado: FalleN');
    playerName = 'FalleN';
  } else if (playerName.toLowerCase() === 'yekindar') {
    playerName = 'YEKINDAR';
  } else if (playerName.toLowerCase() === 'kscerato') {
    playerName = 'KSCERATO';
  }
  console.log('Nome do jogador formatado:', playerName);

  const playerImages: Record<string, string> = {
    FalleN: 'src/bot/images/fallen.jpeg',
    yuurih: 'src/bot/images/yuurih.jpeg',
    YEKINDAR: 'src/bot/images/yekindar.jpeg',
    KSCERATO: 'src/bot/images/KSCERATO.png',
    molodoy: 'src/bot/images/molodoy.jpeg',
  };

  const playerImage = playerImages[playerName];

  try {
    if (playerImage) {
      await ctx.replyWithPhoto(
        { source: playerImage },
        { caption: `📸 Foto de ${playerName}` },
      );
    }

    const response = await axios.get(
      `${API_BASE_URL}/stats/player/${playerName}`,
    );
    const stats = response.data;

    const message =
      `👤 *${playerName}*\n` +
      `🔫 Total de Kills: ${stats.totalKills}\n` +
      `🎯 Headshot %: ${stats.headshotPercentage}%\n` +
      `💀 Total de Mortes: ${stats.totalDeaths}\n` +
      `🔥 K/D Ratio: ${stats.kdRatio}\n` +
      `📊 Damage por Round: ${stats.damagePerRound}\n` +
      `💥 Grenade Damage por Round: ${stats.grenadeDamagePerRound}\n` +
      `🔢 Mapas Jogados: ${stats.mapsPlayed}\n` +
      `🔄 Rounds Jogados: ${stats.roundsPlayed}\n` +
      `⭐ Rating: ${stats.rating}`;

    await ctx.replyWithMarkdown(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback('⬅️ Voltar', 'player_stats')],
        [Markup.button.callback('📊 Estatísticas do time', 'team_stats')],
      ]),
    );
  } catch (error) {
    console.error(
      `Erro ao buscar estatísticas do jogador ${playerName}:`,
      error,
    );
    ctx.reply(
      `Desculpe, não consegui buscar as estatísticas de ${playerName} no momento.`,
    );
  }
});

bot.action('socials', async (ctx) => {
  await ctx.reply(
    'Aqui estão os contatos e redes sociais da FURIA:\n\n' +
      '📸 Instagram: [@furia](https://www.instagram.com/furiagg)\n' +
      '🐦 Twitter: [@FURIA](https://twitter.com/FURIA)\n' +
      '📺 Twitch: [FURIA](https://www.twitch.tv/furia)\n' +
      '🌐 Site oficial: [furia.gg](https://furia.gg)',
    Markup.inlineKeyboard([
      [
        Markup.button.url('📱 WhatsApp', 'https://wa.me/5511993404466'),
        Markup.button.url('🐦 Twitter', 'https://twitter.com/FURIA'),
      ],
      [
        Markup.button.url('📸 Instagram', 'https://www.instagram.com/furiagg'),
        Markup.button.url('🌐 Site oficial', 'https://furia.gg'),
      ],
      [Markup.button.callback('⬅️ Voltar', 'start')],
    ]),
  );
});

bot.action(/recent_page_(\d+)/, async (ctx) => {
  const page = parseInt(ctx.match[1], 10);
  const pageSize = 5;

  try {
    const response = await axios.get(
      `${API_BASE_URL}/matches/recent?page=${page}&pageSize=${pageSize}`,
    );
    const { matches, total } = response.data;

    if (matches.length === 0) {
      ctx.reply('Nenhum jogo encontrado para esta página.');
      return;
    }

    sendPaginatedMatches(ctx, matches, page, pageSize, total);
  } catch (error) {
    console.error('Erro ao buscar jogos recentes:', error);
    ctx.reply('Desculpe, não consegui buscar os jogos recentes no momento.');
  }
});

// Comando /help
bot.help((ctx) => {
  ctx.reply(
    'Comandos disponíveis:\n/recent - Últimos jogos\n/next - Próximos jogos\n/news - Últimas notícias',
  );
});

// Comando /recent para buscar os últimos jogos
bot.command('recent', async (ctx) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/matches/recent`);

    const matches = response.data;

    if (matches.length === 0) {
      ctx.reply('Nenhum jogo recente encontrado.');
      return;
    }

    const message = matches
      .map(
        (match: any) =>
          `🕒 ${match.date}\n🏆 ${match.team1} ${match.score} ${match.team2}\n🔗 [Detalhes do jogo](${match.matchLink})`,
      )
      .join('\n\n');

    ctx.replyWithMarkdown(message);
  } catch (error) {
    console.error('Erro ao buscar jogos recentes:', error);
    ctx.reply('Desculpe, não consegui buscar os jogos recentes no momento.');
  }
});

// Comando /next para buscar os próximos jogos
bot.command('next', async (ctx) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/matches/next`);

    const matches = response.data;

    if (matches.length === 0) {
      ctx.reply('Nenhum próximo jogo encontrado.');
      return;
    }

    const message = matches
      .map(
        (match: any) =>
          `🕒 ${match.date}\n🏆 ${match.team1} vs ${match.team2}\n🔗 [Detalhes do jogo](${match.matchLink})`,
      )
      .join('\n\n');

    ctx.replyWithMarkdown(message);
  } catch (error) {
    console.error('Erro ao buscar próximos jogos:', error);
    ctx.reply('Desculpe, não consegui buscar os próximos jogos no momento.');
  }
});

// Comando /news para buscar as últimas notícias
bot.command('news', async (ctx) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news`);
    const news = response.data;

    if (news.length === 0) {
      ctx.reply('Nenhuma notícia encontrada.');
      return;
    }

    const message = news
      .map(
        (item: any) =>
          `📰 *${item.title}*\n📅 ${item.date}\n🔗 [Leia mais](${item.link})`,
      )
      .join('\n\n');

    ctx.replyWithMarkdown(message);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    ctx.reply('Desculpe, não consegui buscar as notícias no momento.');
  }
});

function sendPaginatedMatches(
  ctx: any,
  matches: any[],
  page: number,
  pageSize: number,
  total: number,
) {
  const message = matches
    .map(
      (match: any) =>
        `🕒 ${match.date}\n🏆 ${match.score}\n🔗 [Detalhes do jogo](${match.matchLink})`,
    )
    .join('\n\n');

  const totalPages = Math.ceil(total / pageSize);

  // Adiciona os botões de navegação
  const buttons = [
    Markup.button.callback('⬅️ Página anterior', `recent_page_${page - 1}`),
    Markup.button.callback('⬅️ Voltar', 'startbtton'),
    Markup.button.callback('➡️ Próxima página', `recent_page_${page + 1}`),
  ];
  if (page === 1) {
    buttons.shift(); // Remove o botão de página anterior se estiver na primeira página
  }
  if (page === totalPages) {
    buttons.pop(); // Remove o botão de próxima página se estiver na última página
  }
  if (totalPages === 1) {
    buttons.pop(); // Remove o botão de próxima página se houver apenas uma página
  }
  if (page > totalPages) {
    ctx.reply('Página inválida.');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ctx.replyWithMarkdown(message, Markup.inlineKeyboard(buttons as any));
}

// Inicia o bot
bot.launch();
console.log('Bot iniciado!');
