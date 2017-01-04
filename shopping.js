const Telegraf = require('telegraf')
const { memorySession, reply } = require('telegraf')
const { Extra, Markup } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(memorySession())

// Register middleware
const print = (ctx) =>  {
  console.log(ctx.session.list);
  if(ctx.session.list == null || ctx.session.list.length == 0){
      return ctx.reply('Shopping list is empty.')
  }
  var html = '<b>Shopping list: </b>\n';
  
  for (var i = 0; i < ctx.session.list.length; i++) {
      html += i+1 +  '. ' + ctx.session.list[i].text + '\n'
  }  

  return ctx.reply(html, {parse_mode: 'html'})
}

const clear = (ctx) => {ctx.session.list = []; }

// Register commands
bot.command('start', (ctx) => {
    clear(ctx);
    ctx.reply('Hello %USERNAME%! Now you can create a new shopping list.')}
)

bot.command('help1', (ctx) => {
  return ctx.reply(`List of available commands: `, {parse_mode: 'Markdown'})
})

bot.command('new', (ctx) => clear(ctx))
bot.command('show', (ctx) => print(ctx))

bot.command('onetime', (ctx) => {
  return ctx.reply('One time keyboard', Markup
    .keyboard([
      ['/new', '/show']      
    ])    
    .resize()
    .extra()
  )
})

// Handle messages
bot.hears(/^([^/].*)/, (ctx) => {
    if(ctx.session.list){
        ctx.session.list.push(ctx.message)
    }
})

// Error hanlding
bot.catch((err) => {
  console.log('An error occured.', err)
})

// Start polling
bot.startPolling()