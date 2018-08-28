import gameData from './gameData.json'

export default {
  computed: {
    canLevel: function () {
      return this.levelByExperience > this.character.attr.lvl
    },
    levelByExperience: function () {
      // calculate the level the character should be by experience
      let level = 1
      for (let i = 0; i < gameData.advancement.length; i++) {
        level = this.character.attr.xp >= gameData.advancement[i].xp ? gameData.advancement[i].level : level
      }
      return level
    }
  },
  methods: {
    roll: function (dice, critical = false) {
      let rolls = dice.split('+')
      let result = 0
      for (let r = 0; r < rolls.length; r++) {
        // critical roles should roll double ie 1d6 becomes 2d6
        let count = critical ? rolls[r].split('d')[0] * 2 : rolls[r].split('d')[0]
        let die = rolls[r].split('d')[1]
        for (let i = 0; i < count; i++) {
          result += Math.floor(Math.random() * die) + 1
        }
      }
      return parseInt(result)
    },
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
    }
  },
  filters: {
    plussed: function (value) {
      return parseInt(value) >= 0 ? '+' + value : value
    },
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
    }
  }
}
