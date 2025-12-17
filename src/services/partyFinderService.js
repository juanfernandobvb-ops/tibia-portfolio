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

export class PartyFinderService {
  // Add a new player
  static async addPlayer(playerData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...playerData,
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
      // Get only players from last 24 hours
      const yesterday = new Date()
      yesterday.setHours(yesterday.getHours() - 24)
      
      const q = query(
        collection(db, COLLECTION_NAME),
        where('registeredAt', '>', Timestamp.fromDate(yesterday)),
        orderBy('registeredAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registeredAt: doc.data().registeredAt.toDate() // Convert back to Date
      }))
    } catch (error) {
      console.error('Error getting players:', error)
      return []
    }
  }

  // Listen for real-time updates
  static onPlayersChange(callback) {
    try {
      const yesterday = new Date()
      yesterday.setHours(yesterday.getHours() - 24)
      
      const q = query(
        collection(db, COLLECTION_NAME),
        where('registeredAt', '>', Timestamp.fromDate(yesterday)),
        orderBy('registeredAt', 'desc')
      )

      return onSnapshot(q, (querySnapshot) => {
        const players = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          registeredAt: doc.data().registeredAt.toDate()
        }))
        callback(players)
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