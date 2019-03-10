'use strict'

console.log('\x1Bc')

const LOG = true
const DEBUG = false

global.cleanArray = actual => {
  if (actual && actual.constructor === Array) {
    let j = 0
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        actual[j++] = actual[i]
      }
    }
    actual.length = j
    return actual
  }
  return []
}

global.fixISO = str => {
  return str.substr(0,4) + "-" + str.substr(4,2) + "-" + str.substr(6,5) + ":" + str.substr(11,2) + ":" +  str.substr(13)
}

global.log = message => {
  if (LOG) console.log((message) ? message : '')
}

global.debug = message => {
  if (DEBUG) console.log(chalk.yellow('DEBUG:'), message)
}

const crypto = require('crypto')
const util = require('util')

const async = require('async')
const chalk = require('chalk')
const Discord = require('discord.js')
const findRemoveSync = require('find-remove')
const get = require('simple-get')
const moment = require('moment')
const nodePersist = require('node-persist')
const os = require('os-utils')

const Clan = require('./clash-of-clans-api/clans')

console.log(chalk.cyan('-'.repeat(17)))
console.log(chalk.cyan(' Discord War Bot '))
console.log(chalk.cyan('-'.repeat(17)))

global.config = require('./config')
log(chalk.bold('Server Permission URL:'))
log(chalk.magenta.bold('https://discordapp.com/oauth2/authorize?client_id=' + config.discord.clientId + '&scope=bot&permissions=134208\n'))

const DiscordClient = new Discord.Client()

const COC_API_BASE = 'https://api.clashofclans.com/v1'

global.DiscordChannelEmojis = {
  'dwashield': '<:dwashield:443879491278995466>',
  'dwashieldbroken': '<:dwashieldbroken:443879490989588483>',
  'dwasword': '<:dwasword:443879493107712010>',
  'dwaswordbroken': '<:dwaswordbroken:443879493321359370>',
  'dwastarempty': '<:dwastarempty:443879491211886603>',
  'dwastar': '<:dwastar:443879491287384064>',
  'dwastarnew': '<:dwastarnew:443879493099323393>',
  'elixir': '<:elixir:443896099321806850>',
  'darkelixir': '<:darkelixir:443896098826878998>',
  'gold': '<:gold:443896099204235265>',
  'squaregold': '<:squaregold:443896099628122112>',
  'diamondelixir': '<:diamondelixir:443896099082600459>',
  'gems': '<:gems:443896099560882178>',
  'versustrophies': '<:versustrophies:443896100177313802>',
}
global.DiscordTownHallEmojis = [
  '<:townhall1:443895940709875745>',
  '<:townhall2:443895940630315019>',
  '<:townhall3:443895941733285888>',
  '<:townhall4:443895941922160640>',
  '<:townhall5:443895941930549248>',
  '<:townhall6:443895941812977686>',
  '<:townhall7:443895942207373322>',
  '<:townhall8:443895941968429067>',
  '<:townhall9:443895941812977665>',
  '<:townhall10:443895942068961281>',
  '<:townhall11:443895942723272756>',
  '<:townhall12:507960908950274048>',
]
global.DiscordBuilderHallEmojis = [
  '<:builderhall1:443895939560636456>',
  '<:builderhall2:443895939946774528>',
  '<:builderhall3:443895941208997900>',
  '<:builderhall4:443895940957339649>',
  '<:builderhall5:443895941284626443>',
  '<:builderhall6:443895941368381450>',
  '<:builderhall7:443895941544804353>',
  '<:builderhall8:443895941829754890>',
]
global.DiscordTroopEmojis = {
  'Barbarian': '<:barbarian:443879949787594763>',
  'Archer': '<:archer:443879968716619787>',
  'Goblin': '<:goblin:443879969660338196>',
  'Giant': '<:giant:443879951465185301>',
  'Wall Breaker': '<:wallbreaker:443879963968667688>',
  'Balloon': '<:ballooncoc:443879964614459393>',
  'Wizard': '<:wizard:443879969353891842>',
  'Healer': '<:healer:443879969303822338>',
  'Dragon': '<:dragoncoc:443879969739898891>',
  'P.E.K.K.A': '<:pekka:443879969358086144>',
  'Minion': '<:minion:443879969739767828>',
  'Hog Rider': '<:hogrider:443879943902986241>',
  'Valkyrie': '<:valkyrie:443879969438040071>',
  'Golem': '<:golem:443879949670285312>',
  'Witch': '<:witch:443879969827979274>',
  'Lava Hound': '<:lavahound:443879969505148939>',
  'Bowler': '<:bowler:443879946142744596>',
  'Baby Dragon': '<:babydragon:443879949263437836>',
  'Miner': '<:miner:443879969311948822>',
  'Electro Dragon': '<:electrodragon:507960591193735198>',

  'Battle Blimp': '<:battleblimp:507961336521818123>',
  'Wall Wrecker': '<:wallwrecker:507961222428098560>',

  'Raged Barbarian': '<:ragedbarbarian:443879969807007745>',
  'Sneaky Archer': '<:sneakyarcher:443879969358217237>',
  'Beta Minion': '<:betaminion:443879943311720468>',
  'Boxer Giant': '<:boxergiant:443879969744224276>',
  'Bomber': '<:bomber:443879950551089166>',
  'Super P.E.K.K.A': '<:superpekka:443879969693892609>',
  'Cannon Cart': '<:cannoncart:443879955634323456>',
  'Drop Ship': '<:dropship:443879969823653888>',
  'Night Witch': '<:nightwitch:443879969907802112>',
}
global.DiscordSpellEmojis = {
  'Lightning Spell': '<:lightningspell:443879863749836801>',
  'Healing Spell': '<:healingspell:443879864324456458>',
  'Rage Spell': '<:ragespell:443879865410650132>',
  'Jump Spell': '<:jumpspell:443879864139776019>',
  'Freeze Spell': '<:freezespell:443879867834957854>',
  'Poison Spell': '<:poisonspell:443879868233547776>',
  'Earthquake Spell': '<:earthquakespell:443879867227045888>',
  'Haste Spell': '<:hastespell:443879864987287566>',
  'Clone Spell': '<:clonespell:443879868589932612>',
  'Skeleton Spell': '<:skeletonspell:443879864454479872>',
}
global.DiscordHeroEmojis = {
  'Barbarian King': '<:barbarianking:443879710934433822>',
  'Archer Queen': '<:archerqueen:443879710154424324>',
  'Grand Warden': '<:grandwarden:443879711282823178>',
  'Battle Machine': '<:warmachine:443879645935566849>',
}

global.Clans = {}
global.Players = {}

const StarColors = config.starColors

global.Storage = nodePersist.create()
Storage.initSync()

global.AnnounceClans = Storage.getItemSync('AnnounceClans')
AnnounceClans = cleanArray(AnnounceClans)
if (!AnnounceClans) AnnounceClans = []
Storage.setItemSync('AnnounceClans', AnnounceClans)

global.announcingClan = (clanTag) => {
  let count = 0
  let match
  AnnounceClans.forEach(clan => {
    if (clan.tag === clanTag.toUpperCase().replace(/O/g, '0')) {
      match = count
    }
    count++
  })
  return match
}

global.getClanChannel = (clanTag, done) => {
  AnnounceClans.forEach(clan => {
    if (clan.tag === clanTag.toUpperCase().replace(/O/g, '0')) {
      done(clan.channels)
    }
  })
}

global.getChannelClan = (channelId, done) => {
  AnnounceClans.forEach(clan => {
    if (clan.channels.indexOf(channelId) > -1) {
      done(clan.tag)
    }
  })
}

global.ChannelSettings = Storage.getItemSync('ChannelSettings')
ChannelSettings = cleanArray(ChannelSettings)
if (!ChannelSettings) ChannelSettings = []
Storage.setItemSync('ChannelSettings', ChannelSettings)

global.channelSettingsInit = (channelId) => {
  let found = false
  ChannelSettings.forEach(channel => {
    if (channel.id === channelId) {
      found = true
    }
  })
  if (!found) {
    ChannelSettings.push({ id: channelId })
  }
}


global.channelSettingsGet = (channelId, option) => {
  let returnValue
  ChannelSettings.forEach(channel => {
    if (channel.id === channelId) {
      returnValue = channel[option]
    }
  })
  return returnValue
}

global.channelSettingsSet = (channelId, option, value) => {
  channelSettingsInit(channelId)
  ChannelSettings.forEach(channel => {
    if (channel.id === channelId) {
      channel[option] = value
    }
  })
  // console.log(ChannelSettings)
  ChannelSettings = cleanArray(ChannelSettings)
  Storage.setItemSync('ChannelSettings', ChannelSettings)
}

global.getChannelById = (channelId, done) => {
  DiscordClient.channels.forEach(channel => {
    if (channel.id == channelId) done(channel)
  })
  done()
}

global.getAnnouncerStats = () => {
  let announcerStats = {
    clanCount: AnnounceClans.length
  }
  let channels = []
  AnnounceClans.forEach(announceClan => {
    announceClan.channels.forEach(channel => {
      if (channels.indexOf(channel) === -1) {
        channels.push(channel)
      }
    })
  })
  announcerStats.channelCount = channels.length
  return announcerStats
}

global.discordAttackMessage = (warId, WarData, clanTag, opponentTag, attackData, channelId) => {
  debug(clanTag)
  debug(attackData)
  let style = channelSettingsGet(channelId, 'style')
  let styleStars = channelSettingsGet(channelId, 'styleStars')
  let filter = channelSettingsGet(channelId, 'filter')
  if (!style) style = 6
  if (!styleStars) styleStars = false
  if (!filter) filter = 'all'
  let emojis = DiscordChannelEmojis
  let clanPlayer
  let opponentPlayer
  let attackDir = 'across'
  if (attackData.who === 'clan') {
    clanPlayer = Players[attackData.attackerTag]
    opponentPlayer = Players[attackData.defenderTag]
    if (clanPlayer.townhallLevel > opponentPlayer.townhallLevel) {
      attackDir = 'down'
    } else if (clanPlayer.townhallLevel < opponentPlayer.townhallLevel) {
      attackDir = 'up'
    }
  } else if (attackData.who === 'opponent') {
    opponentPlayer = Players[attackData.attackerTag]
    clanPlayer = Players[attackData.defenderTag]
    if (clanPlayer.townhallLevel < opponentPlayer.townhallLevel) {
      attackDir = 'down'
    } else if (clanPlayer.townhallLevel > opponentPlayer.townhallLevel) {
      attackDir = 'up'
    }
  } else {
    return
  }
  if ((filter === 'attacks' && attackData.who === 'opponent') || (filter === 'defenses' && attackData.who === 'clan') || (filter === 'none')) {
    return
  }
  let attackMessage = (attackData.stars > 0) ? emojis.dwasword : emojis.dwaswordbroken
  let defendMessage = (attackData.stars > 0) ? emojis.dwashieldbroken : emojis.dwashield
  if (attackData.fresh) {
    attackMessage += '\uD83C\uDF43' // 🍃
  }
  if (attackDir === 'up') {
    attackMessage += '\uD83D\uDD3A' // 🔺
  } else if (attackDir === 'down') {
    attackMessage += '\uD83D\uDD3B' // 🔻
  }
  let messageStars = emojis.dwastar.repeat(attackData.stars-attackData.newStars) + emojis.dwastarnew.repeat(attackData.newStars) + emojis.dwastarempty.repeat(3 - attackData.stars)
  let embed
  let text
  // \u200e = LEFT-TO-RIGHT MARK
  if (style === 1) {
    text = ''
    text += DiscordTownHallEmojis[clanPlayer.townhallLevel - 1] + ' ' + clanPlayer.name + '\u200e ' + ((attackData.who === 'clan') ? attackMessage : defendMessage)
    text += messageStars + ' ' + attackData.destructionPercentage + '%'
    text += ((attackData.who === 'clan') ? defendMessage : attackMessage) + ' ' + opponentPlayer.name + '\u200e ' + DiscordTownHallEmojis[opponentPlayer.townhallLevel - 1]
  } else if (style === 2) {
    text = ''
    text += clanPlayer.name + '\u200e [' + clanPlayer.mapPosition + '] ' + DiscordTownHallEmojis[clanPlayer.townhallLevel - 1] + ' ' + ((attackData.who === 'clan') ? attackMessage : defendMessage)
    text += messageStars + ' ' + attackData.destructionPercentage + '%'
    text += ((attackData.who === 'clan') ? defendMessage : attackMessage) + ' ' + DiscordTownHallEmojis[opponentPlayer.townhallLevel - 1] + ' [' + opponentPlayer.mapPosition + '] ' + opponentPlayer.name
  } else if (style === 3) {
    embed = new Discord.RichEmbed()
    .setColor(StarColors[attackData.stars])
    .addField(clanPlayer.name, (attackData.who === 'clan') ? attackMessage : defendMessage, true)
    .addField(DiscordTownHallEmojis[clanPlayer.townhallLevel - 1] + ' ' + clanPlayer.mapPosition + ' vs ' + opponentPlayer.mapPosition + ' ' + DiscordTownHallEmojis[opponentPlayer.townhallLevel - 1], messageStars + '\n\t\t' + attackData.destructionPercentage + '%', true)
    .addField(opponentPlayer.name, (attackData.who === 'clan') ? defendMessage : attackMessage, true)
  } else if (style === 4) {
    attackMessage += '\n' + attackData.attackerTag
    defendMessage += '\n' + attackData.defenderTag
    embed = new Discord.RichEmbed()
    .setColor(StarColors[attackData.stars])
    .addField(clanPlayer.name, (attackData.who === 'clan') ? attackMessage : defendMessage, true)
    .addField(DiscordTownHallEmojis[clanPlayer.townhallLevel - 1] + ' ' + clanPlayer.mapPosition + ' vs ' + opponentPlayer.mapPosition + ' ' + DiscordTownHallEmojis[opponentPlayer.townhallLevel - 1], messageStars + '\n\t\t' + attackData.destructionPercentage + '%', true)
    .addField(opponentPlayer.name, (attackData.who === 'clan') ? defendMessage : attackMessage, true)
  } else if (style === 5) {
    attackMessage += '\n'
    defendMessage += '\n'
    attackMessage += (attackData.who === 'clan') ? WarData.stats.clan.name : WarData.stats.opponent.name
    defendMessage += (attackData.who === 'clan') ? WarData.stats.opponent.name : WarData.stats.clan.name
    embed = new Discord.RichEmbed()
    .setColor(StarColors[attackData.stars])
    .addField(clanPlayer.name, (attackData.who === 'clan') ? attackMessage : defendMessage, true)
    .addField(DiscordTownHallEmojis[clanPlayer.townhallLevel - 1] + ' ' + clanPlayer.mapPosition + ' vs ' + opponentPlayer.mapPosition + ' ' + DiscordTownHallEmojis[opponentPlayer.townhallLevel - 1], messageStars + '\n\t\t' + attackData.destructionPercentage + '%', true)
    .addField(opponentPlayer.name, (attackData.who === 'clan') ? defendMessage : attackMessage, true)
  } else if (style === 6) {
    attackMessage += '\n' + attackData.attackerTag
    defendMessage += '\n' + attackData.defenderTag
    embed = new Discord.RichEmbed()
    .setColor(StarColors[attackData.stars])
    .addField(clanPlayer.name, (attackData.who === 'clan') ? attackMessage : defendMessage, true)
    .addField(DiscordTownHallEmojis[clanPlayer.townhallLevel - 1] + ' ' + clanPlayer.mapPosition + ' vs ' + opponentPlayer.mapPosition + ' ' + DiscordTownHallEmojis[opponentPlayer.townhallLevel - 1], messageStars + '\n\t\t' + attackData.destructionPercentage + '%', true)
    .addField(opponentPlayer.name, (attackData.who === 'clan') ? defendMessage : attackMessage, true)
    .addField(WarData.stats.clan.name, WarData.stats.clan.tag, true)
    .addField('\u200b', '\u200b', true)
    .addField(WarData.stats.opponent.name, WarData.stats.opponent.tag, true)
  } else if (style === 7) {
    	if (attackData.who === 'opponent') {
    	text = ''
    	text += '!wm ' + clanPlayer.mapPosition + 'd'
    	text += opponentPlayer.mapPosition + ' '
    	text += attackData.stars + ' ' + attackData.destructionPercentage
    	}
    	else if (attackData.who === 'clan'){
    	text = ''
    	text += '!wm ' + clanPlayer.mapPosition + 'a'
    	text += opponentPlayer.mapPosition + ' '
    	text += attackData.stars + ' ' + attackData.destructionPercentage
    	}
  } else if (style === 8) {
    	if (attackData.who === 'opponent') {
    	text = ''
    	text += 'wm ' + clanPlayer.mapPosition + 'd'
    	text += opponentPlayer.mapPosition + ' '
    	text += attackData.stars + ' ' + attackData.destructionPercentage
    	}
    	else if (attackData.who === 'clan'){
    	text = ''
    	text += 'wm ' + clanPlayer.mapPosition + 'a'
    	text += opponentPlayer.mapPosition + ' '
    	text += attackData.stars + ' ' + attackData.destructionPercentage
    	}
  } else if (style === 9) {
    attackMessage += '\n' + attackData.attackerTag
    defendMessage += '\n' + attackData.defenderTag
    embed = new Discord.RichEmbed()
      .setImage((attackData.who === 'clan') ? WarData.stats.clan.badge.small : WarData.stats.opponent.badge.small)
      .setColor(StarColors[attackData.stars])
      .addField(clanPlayer.name, (attackData.who === 'clan') ? attackMessage : defendMessage, true)
      .addField(DiscordTownHallEmojis[clanPlayer.townhallLevel - 1] + ' ' + clanPlayer.mapPosition + ' vs ' + opponentPlayer.mapPosition + ' ' + DiscordTownHallEmojis[opponentPlayer.townhallLevel - 1], messageStars + '\n\t\t' + attackData.destructionPercentage + '%', true)
      .addField(opponentPlayer.name, (attackData.who === 'clan') ? defendMessage : attackMessage, true)
      .addField(WarData.stats.clan.name, WarData.stats.clan.tag, true)
      .addField('\u200b', '\u200b', true)
      .addField(WarData.stats.opponent.name, WarData.stats.opponent.tag, true)
  }
  if (styleStars && style > 2) {
    embed
    .addField(WarData.stats.clan.attacks + '/' + WarData.stats.clan.memberCount * 2 + ' ' + emojis.dwasword, WarData.stats.clan.destructionPercentage + '%', true)
    .addField(WarData.stats.clan.memberCount + ' v ' + WarData.stats.opponent.memberCount, WarData.stats.clan.stars + ' ' + emojis.dwastarnew + ' vs ' + emojis.dwastarnew + ' ' + WarData.stats.opponent.stars, true)
    .addField(WarData.stats.opponent.attacks + '/' + WarData.stats.opponent.memberCount * 2 + ' ' + emojis.dwasword, WarData.stats.opponent.destructionPercentage + '%', true)
  } else if (styleStars) {
    text += '\n'
    text += WarData.stats.clan.destructionPercentage + '% '
    text += WarData.stats.clan.stars + ' ' + emojis.dwastarnew + ' vs ' + emojis.dwastarnew + ' ' + WarData.stats.opponent.stars
    text += WarData.stats.opponent.destructionPercentage + '%'
  }

  WarData.lastReportedAttack = attackData.order
  ClanStorage.setItemSync(warId, WarData)
  getChannelById(channelId, discordChannel => {
    if (discordChannel && embed) discordChannel.send({embed}).then(debug).catch(log)
    if (discordChannel && text) discordChannel.send(text).then(debug).catch(log)
  })
}

global.discordHitrateMessage = (WarData, channelId) => {
  debug(WarData)
  if (WarData.stats.state === 'inWar' || WarData.stats.state === 'warEnded') {
    let emojis = DiscordChannelEmojis
    const embed = new Discord.RichEmbed()
    .setTitle('Attack Hitrate')
    .setFooter(WarData.stats.clan.tag + ' vs ' + WarData.stats.opponent.tag)
    .setColor(0x007cff)
    
    for (let th = 3; th <= 11; th++) {
      if (WarData.stats.hitrate['TH' + th + 'v' + th].clan.attempt > 0 || WarData.stats.hitrate['TH' + th + 'v' + th].opponent.attempt > 0) {
        let clanHitRate = 'n/a'
        if (WarData.stats.hitrate['TH' + th + 'v' + th].clan.attempt > 0) clanHitRate = WarData.stats.hitrate['TH' + th + 'v' + th].clan.success + '/' + WarData.stats.hitrate['TH' + th + 'v' + th].clan.attempt + ' - ' + Math.round(WarData.stats.hitrate['TH' + th + 'v' + th].clan.success / WarData.stats.hitrate['TH' + th + 'v' + th].clan.attempt * 100, 2) + '%'
        let opponentHitRate = 'n/a'
        if (WarData.stats.hitrate['TH' + th + 'v' + th].opponent.attempt > 0) opponentHitRate = WarData.stats.hitrate['TH' + th + 'v' + th].opponent.success + '/' + WarData.stats.hitrate['TH' + th + 'v' + th].opponent.attempt + ' - ' + Math.round(WarData.stats.hitrate['TH' + th + 'v' + th].opponent.success / WarData.stats.hitrate['TH' + th + 'v' + th].opponent.attempt * 100, 2) + '%'
        embed.addField(DiscordTownHallEmojis[th-1] + ' vs ' + DiscordTownHallEmojis[th-1], clanHitRate, true)
        embed.addField(DiscordTownHallEmojis[th-1] + ' vs ' + DiscordTownHallEmojis[th-1], opponentHitRate, true)
        embed.addBlankField(true)
      }
      if (th === 9) {
        if (WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.attempt > 0 || WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.attempt > 0) {
          let clanHitRate = 'n/a'
          if (WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.attempt > 0) clanHitRate = WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.success + '/' + WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.attempt + ' - ' + Math.round(WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.success / WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.attempt * 100, 2) + '%'
          let opponentHitRate = 'n/a'
          if (WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.attempt > 0) opponentHitRate = WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.success + '/' + WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.attempt + ' - ' + Math.round(WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.success / WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.attempt * 100, 2) + '%'
          embed.addField(DiscordTownHallEmojis[th-1] + ' vs ' + DiscordTownHallEmojis[th], clanHitRate, true)
          embed.addField(DiscordTownHallEmojis[th-1] + ' vs ' + DiscordTownHallEmojis[th], opponentHitRate, true)
          embed.addBlankField(true)
        }
      }
      if (th === 10) {
        if (WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.attempt > 0 || WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.attempt > 0) {
          let clanHitRate = 'n/a'
          if (WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.attempt > 0) clanHitRate = WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.success + '/' + WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.attempt + ' - ' + Math.round(WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.success / WarData.stats.hitrate['TH' + th + 'v' + (th+1)].clan.attempt * 100, 2) + '%'
          let opponentHitRate = 'n/a'
          if (WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.attempt > 0) opponentHitRate = WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.success + '/' + WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.attempt + ' - ' + Math.round(WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.success / WarData.stats.hitrate['TH' + th + 'v' + (th+1)].opponent.attempt * 100, 2) + '%'
          embed.addField(DiscordTownHallEmojis[th-1] + ' vs ' + DiscordTownHallEmojis[th], clanHitRate, true)
          embed.addField(DiscordTownHallEmojis[th-1] + ' vs ' + DiscordTownHallEmojis[th], opponentHitRate, true)
          embed.addBlankField(true)
        }
      }
      if (th === 11) {
        if (WarData.stats.hitrate['TH' + th + 'v' + (th-1)].clan.attempt > 0 || WarData.stats.hitrate['TH' + th + 'v' + (th-1)].opponent.attempt > 0) {
          let clanHitRate = 'n/a'
          if (WarData.stats.hitrate['TH' + th + 'v' + (th-1)].clan.attempt > 0) clanHitRate = WarData.stats.hitrate['TH' + th + 'v' + (th-1)].clan.success + '/' + WarData.stats.hitrate['TH' + th + 'v' + (th-1)].clan.attempt + ' - ' + Math.round(WarData.stats.hitrate['TH' + th + 'v' + (th-1)].clan.success / WarData.stats.hitrate['TH' + th + 'v' + (th-1)].clan.attempt * 100, 2) + '%'
          let opponentHitRate = 'n/a'
          if (WarData.stats.hitrate['TH' + th + 'v' + (th-1)].opponent.attempt > 0) opponentHitRate = WarData.stats.hitrate['TH' + th + 'v' + (th-1)].opponent.success + '/' + WarData.stats.hitrate['TH' + th + 'v' + (th-1)].opponent.attempt + ' - ' + Math.round(WarData.stats.hitrate['TH' + th + 'v' + (th-1)].opponent.success / WarData.stats.hitrate['TH' + th + 'v' + (th-1)].opponent.attempt * 100, 2) + '%'
          embed.addField(DiscordTownHallEmojis[th-1] + ' vs ' + DiscordTownHallEmojis[th-2], clanHitRate, true)
          embed.addField(DiscordTownHallEmojis[th-1] + ' vs ' + DiscordTownHallEmojis[th-2], opponentHitRate, true)
          embed.addBlankField(true)
        }
      }
    }
    embed.addField(WarData.stats.clan.name + ' vs ' + WarData.stats.opponent.name, '\u200b')

    getChannelById(channelId, discordChannel => {
      if (discordChannel) discordChannel.send({embed}).then(debug).catch(log)
    })
  } else {
    getChannelById(channelId, discordChannel => {
      if (discordChannel) discordChannel.send('No hitrate stats for this war check back later.').then(debug).catch(log)
    })
  }
}

global.discordStatsMessage = (WarData, channelId) => {
  debug(WarData)
  let emojis = DiscordChannelEmojis
  let extraMessage = ''
  if (WarData.stats.state === 'preparation') {
    extraMessage = '\nWar starts ' + moment(WarData.stats.startTime).fromNow()
  } else if (WarData.stats.state === 'inWar') {
    extraMessage = '\nWar ends ' + moment(WarData.stats.endTime).fromNow()
  } else if (WarData.stats.state === 'warEnded') {
    extraMessage = '\nWar ended ' + moment(WarData.stats.endTime).fromNow()
  }
  const embed = new Discord.RichEmbed()
  .setFooter(WarData.stats.clan.tag + ' vs ' + WarData.stats.opponent.tag)
  .setColor(0x007cff)
  .addField(WarData.stats.clan.attacks + '/' + WarData.stats.clan.memberCount * 2 + ' ' + emojis.dwasword, WarData.stats.clan.destructionPercentage + '%', true)
  .addField(WarData.stats.clan.memberCount + ' v ' + WarData.stats.opponent.memberCount, WarData.stats.clan.stars + ' ' + emojis.dwastarnew + ' vs ' + emojis.dwastarnew + ' ' + WarData.stats.opponent.stars, true)
  .addField(WarData.stats.opponent.attacks + '/' + WarData.stats.opponent.memberCount * 2 + ' ' + emojis.dwasword, WarData.stats.opponent.destructionPercentage + '%', true)
  .addField(WarData.stats.clan.name + ' vs ' + WarData.stats.opponent.name, extraMessage)

  getChannelById(channelId, discordChannel => {
    if (discordChannel) discordChannel.send({embed}).then(debug).catch(log)
  })
}

global.discordMissingAttackMessage = (clanTag, channelId, PlayersMissingAtack) => {
  debug(clanTag)

  let showmissing = channelSettingsGet(channelId, 'showmissing')
  if (!showmissing) showmissing = 'no'

  if (showmissing === 'yes' && PlayersMissingAtack.length > 0) {

    PlayersMissingAtack.forEach(member => {
      const embed = new Discord.RichEmbed()
      .setTitle(Clans[clanTag].name + ' vs ' + Clans[clanTag].opponent.name)
      .setFooter(clanTag + ' vs ' + Clans[clanTag].opponent.tag)

      if (!member.attacks) {
        embed.addField(member.name + " is missing 2 attacks!!!", member.tag)
          .setColor(0xFF484E)
        } else {
          if (member.attacks.length != 2) {
            embed.addField(member.name + " is missing 1 attack!", member.tag)
            .setColor(0xFFBC48)
        }
      }
      getChannelById(channelId, discordChannel => {
        if (discordChannel) discordChannel.send({ embed }).then(debug).catch(log)
      })
    })

  }

}

global.discordReportMessage = (warId, WarData, clanTag, message, channelId) => {
  debug(clanTag)
  let emojis = DiscordChannelEmojis
  let clanPlayer
  let opponentPlayer
  // log(WarData)
  // log(Clans[clanTag])
  const embed = new Discord.RichEmbed()
  .setTitle(Clans[clanTag].name + ' vs ' + Clans[clanTag].opponent.name)
  .setFooter(clanTag + ' vs ' + Clans[clanTag].opponent.tag)
  .setColor(message.color)
  .addField(message.title, message.body)

  ClanStorage.setItemSync(warId, WarData)
  getChannelById(channelId, discordChannel => {
    if (discordChannel) discordChannel.send({embed}).then(debug).catch(log)
  })
}

global.getAnnouncingChannels = () => {
  let channelIds = []
  AnnounceClans.forEach(clan => {
    clan.channels.forEach(channelId => {
      if (channelIds.indexOf(channelId) < 0) channelIds.push(channelId)
    })
  })
  return channelIds
}

let playerReport = (channel, data) => {
  debug(data)

  let embed = new Discord.RichEmbed()
  .setAuthor(data.name + '\u200e ' + data.tag, (data.league) ? data.league.iconUrls.small : null)
  .setThumbnail('https://coc.guide/static/imgs/other/town-hall-' + data.townHallLevel + '.png')

  if (data.clan) embed.setFooter(data.role + ' of ' + data.clan.name + '\u200e ' + data.clan.tag, data.clan.badgeUrls.small)

  embed.addField('League', (data.league) ? data.league.name : 'n/a', true)
  embed.addField('Trophies', data.trophies , true)
  embed.addField('War Stars', data.warStars , true)
  embed.addField('Best Trophies', data.bestTrophies, true)

  let troopLevels = ''
  let count = 0
  data.troops.forEach(troop => {
    if (troop.village === 'home') {
      count++
      troopLevels += DiscordTroopEmojis[troop.name] + ' ' + troop.level
      if (count > 0 && count % 8 === 0) {
        if (troop.level === troop.maxLevel) {
          troopLevels += '*\n'
        } else {
          troopLevels += '\n'
        }
      } else {
        if (troop.level === troop.maxLevel) {
          troopLevels += '*\u2002'
        } else {
          troopLevels += '\u2002\u2002'
        }
      }
    }
  })
  if (troopLevels) embed.addField('Troop Levels', troopLevels.slice(0, troopLevels.length - 2))

  let spellLevels = ''
  count = 0
  data.spells.forEach(spell => {
    if (spell.village === 'home') {
      count++
      spellLevels += DiscordSpellEmojis[spell.name] + ' ' + spell.level
      if (count > 0 && count % 8 === 0) {
        if (spell.level === spell.maxLevel) {
          spellLevels += '*\n'
        } else {
          spellLevels += '\n'
        }
      } else {
        if (spell.level === spell.maxLevel) {
          spellLevels +=  '*\u2002'
        } else {
          spellLevels +=  '\u2002\u2002'
        }
      }
    }
  })
  if (spellLevels) embed.addField('Spell Levels', spellLevels.slice(0, spellLevels.length - 2))

  let heroLevels = ''
  count = 0
  data.heroes.forEach(hero => {
    if (hero.village === 'home') {
      count++
      heroLevels += DiscordHeroEmojis[hero.name] + ' ' + hero.level
      if (count > 0 && count % 8 === 0) {
        if (hero.level === hero.maxLevel) {
          heroLevels +=  '*\n'
        } else {
          heroLevels +=  '\n'
        }
      } else {
        if (hero.level === hero.maxLevel) {
          heroLevels +=  '*\u2002'
        } else {
          heroLevels +=  '\u2002\u2002'
        }
      }
    }
  })
  if (heroLevels) embed.addField('Hero Levels', heroLevels.slice(0, heroLevels.length - 2))
  
  if (data.builderHallLevel) {
    embed.addField('Builder Hall Level', DiscordBuilderHallEmojis[data.builderHallLevel - 1] + ' ' + data.builderHallLevel, true)
    embed.addField('Versus Trophies', data.versusTrophies , true)
    embed.addField('Versus Battle Wins', data.versusBattleWins , true)
    embed.addField('Best Versus Trophies', data.bestVersusTrophies , true)
    let troopLevels = ''
    let count = 0
    data.troops.forEach(troop => {
      if (troop.village === 'builderBase') {
        count++
        troopLevels += DiscordTroopEmojis[troop.name] + ' ' + troop.level
        if (count > 0 && count % 8 === 0) {
          if (troop.level === troop.maxLevel) {
            troopLevels += '*\n'
          } else {
            troopLevels += '\n'
          }
        } else {
          if (troop.level === troop.maxLevel) {
            troopLevels += '*\u2002'
          } else {
            troopLevels += '\u2002\u2002'
          }
        }
      }
    })
    if (troopLevels) embed.addField('Troop Levels', troopLevels.slice(0, troopLevels.length - 2))

    let spellLevels = ''
    count = 0
    data.spells.forEach(spell => {
      if (spell.village === 'builderBase') {
        count++
        spellLevels += DiscordSpellEmojis[spell.name] + ' ' + spell.level
        if (count > 0 && count % 8 === 0) {
          if (spell.level === spell.maxLevel) {
            spellLevels += '*\n'
          } else {
            spellLevels += '\n'
          }
        } else {
          if (spell.level === spell.maxLevel) {
            spellLevels +=  '*\u2002'
          } else {
            spellLevels +=  '\u2002\u2002'
          }
        }
      }
    })
    if (spellLevels) embed.addField('Spell Levels', spellLevels.slice(0, spellLevels.length - 2))

    let heroLevels = ''
    count = 0
    data.heroes.forEach(hero => {
      if (hero.village === 'builderBase') {
        count++
        heroLevels += DiscordHeroEmojis[hero.name] + ' ' + hero.level
        if (count > 0 && count % 8 === 0) {
          if (hero.level === hero.maxLevel) {
            heroLevels +=  '*\n'
          } else {
            heroLevels +=  '\n'
          }
        } else {
          if (hero.level === hero.maxLevel) {
            heroLevels +=  '*\u2002'
          } else {
            heroLevels +=  '\u2002\u2002'
          }
        }
      }
    })
    if (heroLevels) embed.addField('Hero Levels', heroLevels.slice(0, heroLevels.length - 2))
  }

  channel.send({embed}).then(debug).catch(log)
}

let discordReady = () => {
  let apiRequest = (task, cb) => {
    get.concat({
      url: task.url,
      method: 'GET',
      headers: {
        'authorization': 'Bearer ' + config.coc.apiKey,
        'Cache-Control':'no-cache'
      }
    }, function (err, res, jsonBuffer) {
      cb()
      if (jsonBuffer.length > 0) {
        let data = JSON.parse(jsonBuffer)
        task.done(data)
      } else {
        task.done(false)
      }
    })
  }

  global.apiQueue = async.queue(apiRequest, config.asyncLimit)

  let getCurrentWar = (clanTag, done = () => {}) => {
    apiQueue.push({
      url: COC_API_BASE + '/clans/' + encodeURIComponent(clanTag) + '/currentwar',
      done: done
    })
  }

  let getWarLog = (clanTag, done = () => {}) => {
    apiQueue.push({
      url: COC_API_BASE + '/clans/' + encodeURIComponent(clanTag) + '/warlog',
      done: done
    })
  }

  global.getPlayer = (playerTag, done = () => {}) => {
    playerTag = playerTag.toUpperCase().replace(/O/g, '0')
    if (playerTag.match(/^#[0289PYLQGRJCUV]+$/)) {
      apiQueue.push({
        url: COC_API_BASE + '/players/' + encodeURIComponent(playerTag),
        done: done
      })
    } else {
      done('Invalid Tag')
    }
  }

  async.each(AnnounceClans, (clan, done) => {
    try {
      let newClan = new Clan(clan.tag)
      // console.log(newClan)
      clan.channels.forEach(id => {
        newClan.addChannel(id)
      })
      newClan.fetchCurrentWar(apiQueue, done)
      Clans[newClan.getTag()] = newClan
    } catch (err) {
      if (err === 'missingTag') {
        console.log('Attempted to create a Clan() with no tag.')
      } else if (err === 'emptyTag') {
        console.log('Attempted to create a Clan() with an empty string.')
      } else {
        console.log(err)
      }
    }
  }, function(err) {
    setTimeout(discordReady, 1000 * config.updateInterval)
  })
}

DiscordClient.on('message', message => {
  let messageContent = message.content.trim()
  let prefix = config.commandPrefix || '!'
  if (messageContent.slice(0, 1) === prefix) {
    let channelId = message.channel.id
    let splitMessage = messageContent.split(' ')
    if (splitMessage[0].toLowerCase() === prefix + 'info') {
      let announcerStats = getAnnouncerStats()
      const embed = new Discord.RichEmbed()
      .setFooter('Announcing wars since April 29th 2017 (' + moment('2017-04-29').fromNow() + ')')
      .setColor(0x007cff)
      .addField('Instance Owned By', '<@' + config.owner + '>', true)
      .addField('Node Version', '[' + process.version + '](https://nodejs.org)', true)
      .addField('Discord.JS Version', '[' + Discord.version + '](https://github.com/hydrabolt/discord.js)', true)
      .addField('Tracking Stats', 'Announcing stats for ' + announcerStats.clanCount + ' clan' + ((announcerStats.clanCount != 1) ? 's' : '') + ' across ' + announcerStats.channelCount + ' channel' + ((announcerStats.channelCount != 1) ? 's' : ''))
      .addField('Load Average', os.loadavg(10), true)
      .addField('Process Started', moment().subtract(os.processUptime(), 's').fromNow(), true)
      .addField('Free Memory', Math.round(os.freemem()) + 'MB', true)
      .addField('Clash of Clans War Announcer', 'This is an instance of [Discord CoC War Announcer](https://github.com/spAnser/discord-coc-war-announcer). A node.js discord bot written to monitor the Clash of Clans API and announce war attacks to a discord channel.')

      message.channel.send({embed}).then(debug).catch(log)
    } else if (splitMessage[0].toLowerCase() === prefix + 'help') {
      let helpMessage = '1. `' + prefix + 'announce #CLANTAG` Assign a clan to announce in a channel.\n'
      helpMessage += '2. `' + prefix + 'unannounce #CLANTAG` Stop a clan from announcing in a channel.\n'
      helpMessage += '3. `' + prefix + 'warstats #CLANTAG` Display war stats for a clan that is tracked by The Announcer. If not provided with a clan tag it will display war stats for all clans assigned to the channel the command was run in.\n'
      helpMessage += '4. `' + prefix + 'hitrate #CLANTAG` Display hit rate stats for a clan that is tracked by The Announcer. If not provided with a clan tag it will display hit rate stats for all clans assigned to the channel the command was run in.\n'
      helpMessage += '5. `' + prefix + 'playerstats #PLAYERTAG` Display player stats for any player tag provided.\n'
      helpMessage += '6. `' + prefix + 'style [1-9](+)` Choose a style to use for war attacks in this channel. Requires a number to select style type, optionally append a `+` if you want war stats included in every message.\n'
      helpMessage += '7. `' + prefix + 'filter all,attacks,defenses,none` Not yet implemented\n'
      // helpMessage += '7. `' + prefix + 'filter all,attacks,defenses,none` Filter which attacks show up in the channel.\n'
      helpMessage += '8. `' + prefix + 'info` Display bot information.\n'
      helpMessage += '9. `' + prefix + 'identify` bot as clan member (!identify #aaaaaaa).\n'
      helpMessage += '10. `' + prefix + 'showmissing yes,no` Show missing attacks with final hours and final minutes messages. Default value is no.\n'
      message.channel.send(helpMessage).then(debug).catch(log)
    } else if (splitMessage[0].toLowerCase() === prefix + 'announce') {
      if (message.member.hasPermission('MANAGE_CHANNELS')) {
        if (splitMessage[1]) {
          let clanTag = splitMessage[1].toUpperCase().replace(/O/g, '0')
          if (clanTag.match(/^#[0289PYLQGRJCUV]+$/)) {
            if (!Clans[clanTag]) {
              let newClan = new Clan(clanTag)
              newClan.addChannel(message.channel.id)
              newClan.fetchCurrentWar(apiQueue)
              Clans[newClan.getTag()] = newClan
            } else {
              Clans[clanTag].addChannel(message.channel.id)
            }
            let announcingIndex = announcingClan(clanTag)
            if (typeof announcingIndex === 'undefined') {
              AnnounceClans.push({
                tag: clanTag,
                channels: [
                  channelId
                ]
              })
              message.channel.send('War announcements for ' + clanTag + ' registered in this channel.').then(debug).catch(log)
            } else {
              if (AnnounceClans[announcingIndex].channels.indexOf(channelId) > -1) {
                message.channel.send('Provided clanTag is already registered to this channel.').then(debug).catch(log)
              } else {
                AnnounceClans[announcingIndex].channels.push(channelId)
                message.channel.send('War announcements for ' + clanTag + ' registered in this channel.').then(debug).catch(log)
              }
            }
            AnnounceClans = cleanArray(AnnounceClans)
            Storage.setItemSync('AnnounceClans', AnnounceClans)
          } else {
            message.channel.send('Please provide a valid clan tag to announce. Valid tag characters are: \n```\n0289PYLQGRJCUV\n```').then(debug).catch(log)
          }
        } else {
          message.channel.send('Please provide a clan tag to start announcements for.\n```\n!announce #clanTag\n```').then(debug).catch(log)
        }
      } else {
        message.channel.send('Someone with the permissions to manage channels needs to run that command.').then(debug).catch(log)
      }
    } else if (splitMessage[0].toLowerCase() === prefix + 'unannounce') {
      if (message.member.hasPermission('MANAGE_CHANNELS')) {
        if (splitMessage[1]) {
          let clanTag = splitMessage[1].toUpperCase().replace(/O/g, '0')
          let announcingIndex = announcingClan(clanTag)
          if (typeof announcingIndex !== 'undefined') {
            let channelIndex = AnnounceClans[announcingIndex].channels.indexOf(channelId)
            if (channelIndex > -1) {
              if (AnnounceClans[announcingIndex].channels.length > 1) {
                let tmpChannels = []
                AnnounceClans[announcingIndex].channels.forEach(cId => {
                  if (cId != channelId) {
                    tmpChannels.push(cId)
                  }
                })
                AnnounceClans[announcingIndex].channels = tmpChannels
              } else {
                let tmpAnnounceClans = []
                Object.keys(AnnounceClans).forEach(aId => {
                  if (aId != announcingIndex) {
                    tmpAnnounceClans[aId] = AnnounceClans[aId]
                  }
                })
                AnnounceClans = tmpAnnounceClans
              }
              message.channel.send('War announcements for ' + clanTag + ' have been stopped in this channel.').then(debug).catch(log)
            } else {
              message.channel.send('War announcements for ' + clanTag + ' were not registered in this channel.').then(debug).catch(log)
            }
            if (Clans[clanTag]) {
              Clans[clanTag].removeChannel(channelId)
            }
          }
          AnnounceClans = cleanArray(AnnounceClans)
          Storage.setItemSync('AnnounceClans', AnnounceClans)
        } else {
          message.channel.send('Please provide a clan tag to stop announcements for.\n```\n!unannounce #clanTag\n```').then(debug).catch(log)
        }
      } else {
        message.channel.send('Someone with the permissions to manage channels needs to run that command.').then(debug).catch(log)
      }
    } else if (splitMessage[0].toLowerCase() === prefix + 'warstats') {
      if (splitMessage[1]) {
        let clanTag = splitMessage[1].toUpperCase().replace(/O/g, '0')
        if (Clans[clanTag]) {
          let WarData = Clans[clanTag].getWarData()
          let AnnouncingClan = AnnounceClans[announcingClan(clanTag)]
          if (WarData) {
            discordStatsMessage(WarData, channelId)
          } else if (AnnouncingClan.state === 'notInWar') {
            message.channel.send(clanTag + ' is not currently in war.').then(debug).catch(log)
          } else if (AnnouncingClan.reason === 'accessDenied') {
            message.channel.send(clanTag + '\'s war log is not public.').then(debug).catch(log)
          } else {
            message.channel.send('War data is missing try again in a little bit. I might still be fetching the data.').then(debug).catch(log)
          }
        } else {
          message.channel.send('I don\'t appear to have any war data for that clan.').then(debug).catch(log)
        }
      } else {
        getChannelClan(channelId, clanTag => {
          let WarData = Clans[clanTag].getWarData()
          let AnnouncingClan = AnnounceClans[announcingClan(clanTag)]
          if (WarData) {
            discordStatsMessage(WarData, channelId)
          } else if (AnnouncingClan.state === 'notInWar') {
            message.channel.send(clanTag + ' is not currently in war.').then(debug).catch(log)
          } else if (AnnouncingClan.reason === 'accessDenied') {
            message.channel.send(clanTag + '\'s war log is not public.').then(debug).catch(log)
          } else {
            message.channel.send('War data is missing try again in a little bit. I might still be fetching the data.').then(debug).catch(log)
          }
        })
      }
    } else if (splitMessage[0].toLowerCase() === prefix + 'hitrate') {
      if (splitMessage[1]) {
        let clanTag = splitMessage[1].toUpperCase().replace(/O/g, '0')
        if (Clans[clanTag]) {
          let clanTag = splitMessage[1]
          let WarData = Clans[clanTag].getWarData()
          let AnnouncingClan = AnnounceClans[announcingClan(clanTag)]
          if (WarData) {
            discordHitrateMessage(WarData, channelId)
          } else if (AnnouncingClan.state === 'notInWar') {
            message.channel.send(clanTag + ' is not currently in war.').then(debug).catch(log)
          } else if (AnnouncingClan.reason === 'accessDenied') {
            message.channel.send(clanTag + '\'s war log is not public.').then(debug).catch(log)
          } else {
            message.channel.send('War data is missing try again in a little bit. I might still be fetching the data.').then(debug).catch(log)
          }
        } else {
          message.channel.send('I don\'t appear to have any war data for that clan.').then(debug).catch(log)
        }
      } else {
        getChannelClan(channelId, clanTag => {
          let WarData = Clans[clanTag].getWarData()
          if (WarData) {
            discordHitrateMessage(WarData, channelId)
          } else {
            message.channel.send('War data is missing try again in a little bit. I might still be fetching the data.').then(debug).catch(log)
          }
        })
      }
    } else if (splitMessage[0].toLowerCase() === prefix + 'playerstats') {
      if (splitMessage[1]) {
        getPlayer(splitMessage[1], data => {
          if (data === 'Invalid Tag') {
            message.channel.send('Please provide a valid player tag to look up. Valid tag characters are: \n```\n0289PYLQGRJCUV\n```').then(debug).catch(log)
          } else if (data && !data.hasOwnProperty('reason')) {
            playerReport(message.channel, data)
          } else {
            message.channel.send('There was an error fetching the player data.')
            // TODO: include the error code and reason in the returned response to the user for easier troubleshooting
          }
        })
      } else {
        message.channel.send('Please provide a player tag to look up.\n```\n' + prefix + 'playerstats #playertag\n```').then(debug).catch(log)
      }
    } else if (splitMessage[0].toLowerCase() === prefix + 'filter') {
      if (splitMessage[1] && (splitMessage[1].toLowerCase() === 'all' || splitMessage[1].toLowerCase() === 'attacks' || splitMessage[1].toLowerCase() === 'defenses' || splitMessage[1].toLowerCase() === 'none')) {
        channelSettingsSet(message.channel.id, 'filter', splitMessage[1].toLowerCase())
        if (splitMessage[1].toLowerCase() === 'all') {
          message.channel.send('Announcer will now announce everything.')
        } else if (splitMessage[1].toLowerCase() === 'attacks') {
          message.channel.send('Announcer will now announce attacks only.')
        } else if (splitMessage[1].toLowerCase() === 'defenses') {
          message.channel.send('Announcer will now announce defenses only.')
        } else if (splitMessage[1].toLowerCase() === 'none') {
          message.channel.send('Announcer will now announce nothing.')
        }
      } else {
        message.channel.send('Please choose a valid filter method `all, attacks, defenses, none`.')
      }
    } else if (splitMessage[0].toLowerCase() === prefix + 'showmissing') {
      if (splitMessage[1] && (splitMessage[1].toLowerCase() === 'yes' || splitMessage[1].toLowerCase() === 'no')) {
        channelSettingsSet(message.channel.id, 'showmissing', splitMessage[1].toLowerCase())
        if (splitMessage[1].toLowerCase() === 'yes') {
          message.channel.send('Announcer will now announce missing attacks with final hours and final minutes messages.')
        } else if (splitMessage[1].toLowerCase() === 'no') {
          message.channel.send('Announcer will now NOT announce missing attacks with final hours and final minutes messages.')
        }
      } else {
        message.channel.send('Please choose a valid showmissing method `yes, no`.')
      }
    } else if (splitMessage[0].toLowerCase() === prefix + 'identify') {
      if (splitMessage[1]) {
        let identID = splitMessage[1]
          message.channel.send('!wm identify ' + identID).then(debug).catch(log)
          } else {
            message.channel.send('error').then(debug).catch(log)
          }
      }  else if (splitMessage[0].toLowerCase() === prefix + 'style') {
      if (message.member.hasPermission('MANAGE_CHANNELS')) {
        if (splitMessage[1]) {
          let showStars = (splitMessage[1].indexOf('+') == 1)
          let styleId = parseInt(splitMessage[1])
          if (styleId > 0 && styleId < 10) {
            channelSettingsSet(message.channel.id, 'style', styleId)
            channelSettingsSet(message.channel.id, 'styleStars', showStars)
            let extra = (showStars) ? ' w/ War Stats' : ''
            message.channel.send('This channel will now announce attacks with style #' + styleId + extra).then(debug).catch(log)
          } else {
            message.channel.send('Invalid style id choose a number between 1-9').then(debug).catch(log)
          }
        } else {
          message.channel.send('Please provide a style id to use for this channel.\n```\n' + prefix + 'style [1-8](+)\n```').then(debug).catch(log)
        }
      } else {
        message.channel.send('Someone with the permissions to manage channels needs to run that command.').then(debug).catch(log)
      }
    } else if (splitMessage[0].toLowerCase() === prefix + 'styletest') {
      let emojis = DiscordChannelEmojis
      let text
      let embed

      message.channel.send('***Style #1***').then(debug).catch(log)
      text = ''
      text += DiscordTownHallEmojis[9] + ' Player Name ' + emojis.dwasword
      text += emojis.dwastar.repeat(1) + emojis.dwastarnew.repeat(1) + emojis.dwastarempty.repeat(1) + ' ' + '75%'
      text += emojis.dwashieldbroken + ' Opponent Name ' + DiscordTownHallEmojis[10]
      message.channel.send(text).then(debug).catch(log)

      message.channel.send('***Style #2***').then(debug).catch(log)
      text = ''
      text += 'Player Name [6] ' + DiscordTownHallEmojis[9] + ' ' + emojis.dwasword + '\uD83C\uDF43\uD83D\uDD3A'
      text += emojis.dwastar.repeat(1) + emojis.dwastarnew.repeat(1) + emojis.dwastarempty.repeat(1) + ' ' + '75%'
      text += emojis.dwashieldbroken + ' ' + DiscordTownHallEmojis[10] + ' [5] Opponent Name'
      message.channel.send(text).then(debug).catch(log)

      message.channel.send('***Style #3***').then(debug).catch(log)
      embed = new Discord.RichEmbed()
      .setColor(StarColors[2])
      .addField('Player Name', emojis.dwasword + '\uD83C\uDF43\uD83D\uDD3A', true)
      .addField(DiscordTownHallEmojis[9] + ' 6 vs 5 ' + DiscordTownHallEmojis[10], emojis.dwastar.repeat(1) + emojis.dwastarnew.repeat(1) + emojis.dwastarempty.repeat(1), true)
      .addField('Opponent Name', emojis.dwashieldbroken + ' 75%', true)
      message.channel.send({embed}).then(debug).catch(log)

      message.channel.send('***Style #4***').then(debug).catch(log)
      embed = new Discord.RichEmbed()
      .setColor(StarColors[2])
      .addField('Player Name', emojis.dwasword + '\uD83C\uDF43\uD83D\uDD3A\n#playerTag', true)
      .addField(DiscordTownHallEmojis[9] + ' 6 vs 5 ' + DiscordTownHallEmojis[10], emojis.dwastar.repeat(1) + emojis.dwastarnew.repeat(1) + emojis.dwastarempty.repeat(1) + '\n\t\t' + '75%', true)
      .addField('Opponent Name', emojis.dwashieldbroken + '\n#opponentTag', true)
      message.channel.send({embed}).then(debug).catch(log)

      message.channel.send('***Style #5***').then(debug).catch(log)
      embed = new Discord.RichEmbed()
      .setColor(StarColors[2])
      .addField('Player Name', emojis.dwasword + '\uD83C\uDF43\uD83D\uDD3A\nClan Name', true)
      .addField(DiscordTownHallEmojis[9] + ' 6 vs 5 ' + DiscordTownHallEmojis[10], emojis.dwastar.repeat(1) + emojis.dwastarnew.repeat(1) + emojis.dwastarempty.repeat(1) + '\n\t\t' + '75%', true)
      .addField('Opponent Name', emojis.dwashieldbroken + '\nOpponent Clan Name', true)
      message.channel.send({embed}).then(debug).catch(log)

      message.channel.send('***Style #6 (default)***').then(debug).catch(log)
      embed = new Discord.RichEmbed()
      .setColor(StarColors[2])
      .addField('Player Name', emojis.dwasword + '\uD83C\uDF43\uD83D\uDD3A\n#playerTag', true)
      .addField(DiscordTownHallEmojis[9] + ' 6 vs 5 ' + DiscordTownHallEmojis[10], emojis.dwastar.repeat(1) + emojis.dwastarnew.repeat(1) + emojis.dwastarempty.repeat(1) + '\n\t\t' + '75%', true)
      .addField('Opponent Name', emojis.dwashieldbroken + '\n#opponentTag', true)
      .addField('Clan Name', '#clanTag', true)
      .addField('\u200b', '\u200b', true)
      .addField('Opponent Clan Name', '#opponentClanTag', true)
      message.channel.send({embed}).then(debug).catch(log)
    } else if (splitMessage[0].toLowerCase() === prefix + 'news' && message.author.id === config.owner) {
      // Send global announcement to announcing channels from the bot owner. Will mainly be used for updates.
      getAnnouncingChannels().forEach(channelId => {
        getChannelById(channelId, discordChannel => {
          if (discordChannel) discordChannel.send(splitMessage.slice(1).join(' ')).then(debug).catch(log)
        })
      })
    }
  }
})

DiscordClient.on('ready', () => {
  discordReady()
})

DiscordClient.login(config.discord.userToken)
