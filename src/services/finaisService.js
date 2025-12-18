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

// Usar a mesma coleção do Party Finder para evitar problemas de permissão
const COLLECTION_NAME = 'party-finder-players'

// Verificar se o Firebase está configurado
console.log('Firebase DB initialized:', !!db)

export class FinaisService {
  // Add participant to GT
  static async addGTParticipant(participantData) {
    try {
      console.log('Adding GT participant:', participantData)
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...participantData,
        type: 'gt-participant',
        registeredAt: Timestamp.fromDate(new Date())
      })
      
      console.log('GT participant added successfully:', docRef.id)
      return { id: docRef.id, ...participantData }
    } catch (error) {
      console.error('Error adding GT participant:', error)
      console.error('Error details:', error.message, error.code)
      throw error
    }
  }

  // Add participant to Ferumbras
  static async addFerumbrasParticipant(participantData) {
    try {
      console.log('Adding Ferumbras participant:', participantData)
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...participantData,
        type: 'ferumbras-participant',
        registeredAt: Timestamp.fromDate(new Date())
      })
      
      console.log('Ferumbras participant added successfully:', docRef.id)
      return { id: docRef.id, ...participantData }
    } catch (error) {
      console.error('Error adding Ferumbras participant:', error)
      console.error('Error details:', error.message, error.code)
      throw error
    }
  }

  // Get all GT participants
  static async getGTParticipants() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('type', '==', 'gt-participant')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error getting GT participants:', error)
      throw error
    }
  }

  // Get all Ferumbras participants
  static async getFerumbrasParticipants() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('type', '==', 'ferumbras-participant')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error getting Ferumbras participants:', error)
      throw error
    }
  }

  // Remove GT participant
  static async removeGTParticipant(participantId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, participantId))
      return true
    } catch (error) {
      console.error('Error removing GT participant:', error)
      throw error
    }
  }

  // Remove Ferumbras participant
  static async removeFerumbrasParticipant(participantId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, participantId))
      return true
    } catch (error) {
      console.error('Error removing Ferumbras participant:', error)
      throw error
    }
  }

  // Listen to GT participants changes (real-time)
  static listenToGTParticipants(callback) {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('type', '==', 'gt-participant')
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const participants = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('GT participants updated:', participants)
      callback(participants)
    }, (error) => {
      console.error('Error listening to GT participants:', error)
    })
  }

  // Listen to Ferumbras participants changes (real-time)
  static listenToFerumbrasParticipants(callback) {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('type', '==', 'ferumbras-participant')
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const participants = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('Ferumbras participants updated:', participants)
      callback(participants)
    }, (error) => {
      console.error('Error listening to Ferumbras participants:', error)
    })
  }

  // Check if GT is full
  static async isGTFull() {
    try {
      const participants = await this.getGTParticipants()
      return participants.length >= 15
    } catch (error) {
      console.error('Error checking GT capacity:', error)
      return false
    }
  }

  // Check if Ferumbras is full
  static async isFerumbrasFull() {
    try {
      const participants = await this.getFerumbrasParticipants()
      return participants.length >= 15
    } catch (error) {
      console.error('Error checking Ferumbras capacity:', error)
      return false
    }
  }
}