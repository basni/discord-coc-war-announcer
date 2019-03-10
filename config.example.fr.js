module.exports = {
  owner: '', // Put your user id here. Try typing \@User#tag to get your id.
  asyncLimit: 5,
  updateInterval: 60 * 2, // 2 Minutes
  commandPrefix: '+',
  coc: {
    apiKey: '',
  },
  discord: {
    clientId: '',
    userToken: ''
  },
  starColors: [
    0xff484e, // 0 Stars
    0xffbc48, // 1 Star
    0xc7ff48, // 2 Stars
    0x4dff48  // 3 Stars
  ],
  finalMinutes: 15,
  messages: {
    prepDay: {
      title: 'la guerre est declarée',
      body: 'la bataille commence %date%\n@ %time%',
      color: 0x007cff
    },
    battleDay: {
      title: 'La guerre est déclarée!',
      body: 'Attack!',
      color: 0x007cff
    },
    lastHour: {
      title: 'La derniere heure de la guerre commence !',
      body: 'Si vous n\'avez pas fait vos 2 attaques, allez les faire!!',
      color: 0x007cff
    },
    finalMinutes: {
      title: 'Les dernieres minutes de la guerre ont commencé!',
      body: 'Si vous n\'avez pas fait vos 2 attaques, allez les faire!!',
      color: 0x007cff
    }
  }
}
