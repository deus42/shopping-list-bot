const Telegraf = require('telegraf')
const { memorySession, reply } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(memorySession())

// Register middleware
const print = (ctx, next) => ctx.reply('yo').then(next)

// Register commands
bot.command('start', (ctx) => {
    ctx.session.list = [];
    ctx.reply('Hello %USERNAME%! Now you can create a new shopping list.')}
)

bot.command('help1', (ctx) => {
  return ctx.reply(`List of available commands: `, {parse_mode: 'Markdown'})
})

bot.command('new', (ctx) => {
  ctx.session.list = []
})

bot.command('clear', (ctx) => {
  ctx.session.list = []
})

bot.command('show', (ctx) => {
  var length = ctx.session.list.length;
  if(length == 0){
      return ctx.reply('Shopping list is empty.')
  }
  var html = '<b>Shopping list: </b>\n';
  
  for (var i = 0; i < length; i++) {
      html += i +  '. ' + ctx.session.list[i].text + '\n'
  }  

  return ctx.reply(html, {parse_mode: 'html'})
})

// Handle messages
bot.hears(/.+/, (ctx) => {
  ctx.session.list.push(ctx.message)
})

// Error hanlding
bot.catch((err) => {
  console.log('An error occured.', err)
})

// Start polling
bot.startPolling()