import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase.js'

const COLLECTION_NAME = 'party-finder-players'

/**
 * IMPORTANTE: Esta coleção é compartilhada com FinaisService.
 * - FinaisService usa type: 'gt-participant' e 'ferumbras-participant'
 * - PartyFinderService usa type: 'party-finder-player'
 * Isso evita conflitos entre os dois sistemas.
 */

export class PartyFinderService {
  // Add a new player
  static async addPlayer(playerData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...playerData,
        type: 'party-finder-player',  // Identificador específico
        registeredAt: Timestamp.fromDate(new Date()),
        createdBy: this.getBrowserId()
      })
      
      // Track locally which players this browser created
      this.trackLocalPlayer(docRef.id)
      
      return { id: docRef.id, ...playerData }
    } catch (error) {
      console.error('Error adding player:', error)
      throw error
    }
  }

  // Get all players
  static async getAllPlayers() {
    try {
      // Get only party-finder players first, then filter by date
      const q = query(
        collection(db, COLLECTION_NAME),
        where('type', '==', 'party-finder-player')  // Filtrar apenas players do Party Finder
      )
      
      const querySnapshot = await getDocs(q)
      const players = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registeredAt: doc.data().registeredAt.toDate()
      }))
      
      // Filter by 24 hours in code (to avoid complex Firebase indexes)
      const yesterday = new Date()
      yesterday.setHours(yesterday.getHours() - 24)
      
      return players
        .filter(player => player.registeredAt > yesterday)
        .sort((a, b) => b.registeredAt - a.registeredAt)
        
    } catch (error) {
      console.error('Error getting players:', error)
      return []
    }
  }

  // Listen for real-time updates
  static onPlayersChange(callback) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('type', '==', 'party-finder-player')  // Filtrar apenas players do Party Finder
      )

      return onSnapshot(q, (querySnapshot) => {
        const players = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          registeredAt: doc.data().registeredAt.toDate()
        }))
        
        // Filter by 24 hours in code
        const yesterday = new Date()
        yesterday.setHours(yesterday.getHours() - 24)
        
        const recentPlayers = players
          .filter(player => player.registeredAt > yesterday)
          .sort((a, b) => b.registeredAt - a.registeredAt)
        
        callback(recentPlayers)
      })
    } catch (error) {
      console.error('Error listening to players:', error)
      return () => {} // Return empty unsubscribe function
    }
  }

  // Remove a player
  static async removePlayer(playerId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, playerId))
      this.untrackLocalPlayer(playerId)
      return true
    } catch (error) {
      console.error('Error removing player:', error)
      throw error
    }
  }

  // Check if current browser can remove this player
  static canRemovePlayer(playerId) {
    const myPlayers = JSON.parse(localStorage.getItem('myPartyFinderPlayers') || '[]')
    return myPlayers.includes(playerId)
  }

  // Track players created by this browser
  static trackLocalPlayer(playerId) {
    const myPlayers = JSON.parse(localStorage.getItem('myPartyFinderPlayers') || '[]')
    if (!myPlayers.includes(playerId)) {
      myPlayers.push(playerId)
      localStorage.setItem('myPartyFinderPlayers', JSON.stringify(myPlayers))
    }
  }

  // Remove player from local tracking
  static untrackLocalPlayer(playerId) {
    const myPlayers = JSON.parse(localStorage.getItem('myPartyFinderPlayers') || '[]')
    const updatedPlayers = myPlayers.filter(id => id !== playerId)
    localStorage.setItem('myPartyFinderPlayers', JSON.stringify(updatedPlayers))
  }

  // Get unique browser ID (simple implementation)
  static getBrowserId() {
    let browserId = localStorage.getItem('partyFinderBrowserId')
    if (!browserId) {
      browserId = 'browser_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('partyFinderBrowserId', browserId)
    }
    return browserId
  }
}