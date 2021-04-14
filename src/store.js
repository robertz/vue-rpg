import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    character: localStorage.getItem('character') ? JSON.parse(localStorage.getItem('character')) : {
      name: 'Dev the Mighty',
      race: 'Human',
      init: false,
      current: {
        hp: 0
      },
      attr: {
        lvl: 0,
        xp: 0,
        hp: 8,
        ac: 14,
        cp: 0 // copper
      },
      stats: {
        str: 3,
        dex: 3,
        con: 3,
        int: 3,
        wis: 3,
        chr: 3
      }
    },
    data: {
      advancement: [
        { xp: 0, level: 1, proficiency: 2 },
        { xp: 300, level: 2, proficiency: 2 },
        { xp: 900, level: 3, proficiency: 2 },
        { xp: 2700, level: 4, proficiency: 2 },
        { xp: 6500, level: 5, proficiency: 3 },
        { xp: 14000, level: 6, proficiency: 3 },
        { xp: 23000, level: 7, proficiency: 3 },
        { xp: 34000, level: 8, proficiency: 3 },
        { xp: 48000, level: 9, proficiency: 4 },
        { xp: 64000, level: 10, proficiency: 4 },
        { xp: 85000, level: 11, proficiency: 4 },
        { xp: 100000, level: 12, proficiency: 4 },
        { xp: 120000, level: 13, proficiency: 5 },
        { xp: 140000, level: 14, proficiency: 5 },
        { xp: 165000, level: 15, proficiency: 5 },
        { xp: 195000, level: 16, proficiency: 5 },
        { xp: 225000, level: 17, proficiency: 6 },
        { xp: 265000, level: 18, proficiency: 6 },
        { xp: 305000, level: 19, proficiency: 6 },
        { xp: 355000, level: 20, proficiency: 6 }
      ],
      classes: [
        { name: 'Fighter', base: 10, perLvl: 7, cp: 20000 }
      ],
      races: [
        { id: 0, name: 'Human', stats: { str: 1, dex: 1, con: 1, int: 1, wis: 1, chr: 1 } }
      ]
    }
  },
  mutations: {
    SET_CHARACTER (state, character) {
      state.character = character || null
    },
    SET_ATTR (state, attr) {
      state.character.attr = attr || null
    }
  },
  actions: {
    setCharacter ({ commit }, character) {
      commit('SET_CHARACTER', character)
    },
    setAttr ({ commit }, attr) {
      commit('SET_ATTR', attr)
    },
    async refreshCharacter (ctx) {
      ctx.commit('SET_CHARACTER', JSON.parse(localStorage.getItem('character')))
    }
  }
})
