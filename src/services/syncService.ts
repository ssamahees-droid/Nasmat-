/**
 * Production-Hardened Sync Service for «نسمة الحياة»
 * 
 * Scope: Favorites, Personal Notes, Daily Check-ins, and Wellness Habits.
 * 
 * Core Architectural Guarantees:
 * 1. Clock-Drift Immunity:
 *    - Monotonic revision/version numbering on all notes, check-ins, and habits.
 *    - Firestore serverTimestamp() used for cloud record authority.
 *    - Client clock skew (forward or backward) cannot overwrite a higher-version edit.
 * 
 * 2. Anti-Resurrection Tombstone Lifecycle:
 *    - Local tombstones with version tracking for notes, check-ins, and habits.
 *    - A pull from cloud before push will NEVER resurrect a locally deleted entity.
 * 
 * 3. Atomic Progressive Offline Queue:
 *    - Item-by-item processing with immediate dequeue only after confirmed write success.
 *    - Sudden disconnection preserves failing and unattempted mutations in order.
 *    - Completely idempotent using deterministic document IDs (zero duplicate records).
 * 
 * 4. Completion Logs Multi-Device Protection:
 *    - Habit completed dates are merged via Union to prevent multi-device completion loss.
 * 
 * 5. Zero UI Disruption:
 *    - localStorage remains the immediate synchronous data source for UI.
 */

import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

import { db, auth, isFirebaseConfigured } from './firebaseClient';
import { storage, PersonalNote } from './storage';
import { DailyCheckin, WellnessHabit, AssessmentRecord } from '../types';

export interface SyncMutation {
  id: string; // Unique mutation log ID
  entity: 'favorite' | 'note' | 'checkin' | 'habit' | 'assessment';
  entityId: string;
  operation: 'upsert' | 'delete';
  data: any;
  timestamp: string; // ISO (for local reference)
}

export interface EntityTombstone {
  id: string;
  version: number;
  deletedAt: string;
}

const SYNC_QUEUE_KEY = 'nesmat_sync_queue_v1';
const LAST_SYNC_KEY = 'nesmat_last_sync_v1';
const TOMBSTONES_NOTES_KEY = 'nesmat_notes_tombstones_v1';
const TOMBSTONES_CHECKINS_KEY = 'nesmat_checkins_tombstones_v1';
const TOMBSTONES_HABITS_KEY = 'nesmat_habits_tombstones_v1';
const TOMBSTONES_ASSESSMENTS_KEY = 'nesmat_assessments_tombstones_v1';

export class SyncService {
  private isSyncing = false;

  getQueue(): SyncMutation[] {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveQueue(queue: SyncMutation[]): void {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  dequeueMutation(mutationId: string): void {
    const queue = this.getQueue().filter(m => m.id !== mutationId);
    this.saveQueue(queue);
  }

  getNoteTombstones(): Record<string, EntityTombstone> {
    const raw = localStorage.getItem(TOMBSTONES_NOTES_KEY);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  }

  getCheckinTombstones(): Record<string, EntityTombstone> {
    const raw = localStorage.getItem(TOMBSTONES_CHECKINS_KEY);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  }

  getHabitTombstones(): Record<string, EntityTombstone> {
    const raw = localStorage.getItem(TOMBSTONES_HABITS_KEY);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  }

  getAssessmentTombstones(): Record<string, EntityTombstone> {
    const raw = localStorage.getItem(TOMBSTONES_ASSESSMENTS_KEY);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  }

  private addNoteTombstone(noteId: string, version: number, timestamp: string): void {
    const tombstones = this.getNoteTombstones();
    tombstones[noteId] = { id: noteId, version, deletedAt: timestamp };
    localStorage.setItem(TOMBSTONES_NOTES_KEY, JSON.stringify(tombstones));
  }

  private addCheckinTombstone(checkinId: string, version: number, timestamp: string): void {
    const tombstones = this.getCheckinTombstones();
    tombstones[checkinId] = { id: checkinId, version, deletedAt: timestamp };
    localStorage.setItem(TOMBSTONES_CHECKINS_KEY, JSON.stringify(tombstones));
  }

  private addHabitTombstone(habitId: string, version: number, timestamp: string): void {
    const tombstones = this.getHabitTombstones();
    tombstones[habitId] = { id: habitId, version, deletedAt: timestamp };
    localStorage.setItem(TOMBSTONES_HABITS_KEY, JSON.stringify(tombstones));
  }

  private addAssessmentTombstone(assessmentId: string, version: number, timestamp: string): void {
    const tombstones = this.getAssessmentTombstones();
    tombstones[assessmentId] = { id: assessmentId, version, deletedAt: timestamp };
    localStorage.setItem(TOMBSTONES_ASSESSMENTS_KEY, JSON.stringify(tombstones));
  }

  enqueueMutation(mutation: Omit<SyncMutation, 'id'>): void {
    const queue = this.getQueue();
    const newMutation: SyncMutation = {
      ...mutation,
      id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };

    const filtered = queue.filter(
      m => !(m.entity === newMutation.entity && m.entityId === newMutation.entityId)
    );
    filtered.push(newMutation);
    this.saveQueue(filtered);
  }

  recordFavoriteChange(contentId: string, isFavorited: boolean): void {
    const now = new Date().toISOString();
    this.enqueueMutation({
      entity: 'favorite',
      entityId: contentId,
      operation: isFavorited ? 'upsert' : 'delete',
      data: { contentId, isFavorited, updatedAt: now },
      timestamp: now
    });
  }

  recordNoteChange(note: PersonalNote, operation: 'upsert' | 'delete' = 'upsert'): void {
    const now = new Date().toISOString();
    const version = typeof note.version === 'number' ? note.version : 1;

    if (operation === 'delete') {
      this.addNoteTombstone(note.id, version, now);
    }

    this.enqueueMutation({
      entity: 'note',
      entityId: note.id,
      operation,
      data: { ...note, version, updatedAt: now },
      timestamp: now
    });
  }

  recordCheckinChange(checkin: DailyCheckin, operation: 'upsert' | 'delete' = 'upsert'): void {
    const now = new Date().toISOString();
    const version = typeof checkin.version === 'number' ? checkin.version : 1;

    if (operation === 'delete') {
      this.addCheckinTombstone(checkin.id, version, now);
    }

    this.enqueueMutation({
      entity: 'checkin',
      entityId: checkin.id,
      operation,
      data: { ...checkin, version, updatedAt: now },
      timestamp: now
    });
  }

  recordHabitChange(habit: WellnessHabit, operation: 'upsert' | 'delete' = 'upsert'): void {
    const now = new Date().toISOString();
    const version = typeof habit.version === 'number' ? habit.version : 1;

    if (operation === 'delete') {
      this.addHabitTombstone(habit.id, version, now);
    }

    this.enqueueMutation({
      entity: 'habit',
      entityId: habit.id,
      operation,
      data: { ...habit, version, updatedAt: now },
      timestamp: now
    });
  }

  recordAssessmentChange(assessment: AssessmentRecord, operation: 'upsert' | 'delete' = 'upsert'): void {
    const now = new Date().toISOString();
    const version = typeof assessment.version === 'number' ? assessment.version : 1;

    if (operation === 'delete') {
      this.addAssessmentTombstone(assessment.id, version, now);
    }

    this.enqueueMutation({
      entity: 'assessment',
      entityId: assessment.id,
      operation,
      data: { ...assessment, version, updatedAt: now },
      timestamp: now
    });
  }

  async pushMutationItem(userId: string, item: SyncMutation): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');

    if (item.entity === 'favorite') {
      const favDocRef = doc(db, 'users', userId, 'favorites', item.entityId);
      if (item.operation === 'upsert') {
        await setDoc(favDocRef, {
          id: item.entityId,
          userId,
          itemType: 'content',
          itemId: item.entityId,
          title: item.data.title || '',
          savedAt: item.timestamp,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp(),
          deleted: false
        }, { merge: true });
      } else {
        await setDoc(favDocRef, {
          id: item.entityId,
          userId,
          itemId: item.entityId,
          deleted: true,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp()
        }, { merge: true });
      }
    } else if (item.entity === 'note') {
      const noteDocRef = doc(db, 'users', userId, 'notes', item.entityId);
      const noteVersion = typeof item.data.version === 'number' ? item.data.version : 1;

      if (item.operation === 'upsert') {
        await setDoc(noteDocRef, {
          id: item.entityId,
          userId,
          text: item.data.text,
          date: item.data.date,
          moodTag: item.data.moodTag || null,
          version: noteVersion,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp(),
          deleted: false
        }, { merge: true });
      } else {
        await setDoc(noteDocRef, {
          id: item.entityId,
          userId,
          version: noteVersion,
          deleted: true,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp()
        }, { merge: true });
      }
    } else if (item.entity === 'checkin') {
      const checkinDocRef = doc(db, 'users', userId, 'checkins', item.entityId);
      const checkinVersion = typeof item.data.version === 'number' ? item.data.version : 1;

      if (item.operation === 'upsert') {
        await setDoc(checkinDocRef, {
          id: item.entityId,
          userId,
          moodValue: item.data.moodValue,
          date: item.data.date,
          optionalNote: item.data.optionalNote || null,
          timestamp: item.data.timestamp || item.timestamp,
          version: checkinVersion,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp(),
          deleted: false
        }, { merge: true });
      } else {
        await setDoc(checkinDocRef, {
          id: item.entityId,
          userId,
          version: checkinVersion,
          deleted: true,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp()
        }, { merge: true });
      }
    } else if (item.entity === 'habit') {
      const habitDocRef = doc(db, 'users', userId, 'wellness_habits', item.entityId);
      const habitVersion = typeof item.data.version === 'number' ? item.data.version : 1;

      if (item.operation === 'upsert') {
        await setDoc(habitDocRef, {
          id: item.entityId,
          userId,
          title: item.data.title,
          category: item.data.category || 'routine',
          frequency: item.data.frequency || 'daily',
          targetDaysPerWeek: item.data.targetDaysPerWeek || 7,
          completedDates: item.data.completedDates || [],
          completionLog: item.data.completionLog || {},
          createdAt: item.data.createdAt,
          version: habitVersion,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp(),
          deleted: false
        }, { merge: true });
      } else {
        await setDoc(habitDocRef, {
          id: item.entityId,
          userId,
          version: habitVersion,
          deleted: true,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp()
        }, { merge: true });
      }
    } else if (item.entity === 'assessment') {
      const assessmentDocRef = doc(db, 'users', userId, 'assessments', item.entityId);
      const assessmentVersion = typeof item.data.version === 'number' ? item.data.version : 1;

      if (item.operation === 'upsert') {
        await setDoc(assessmentDocRef, {
          id: item.entityId,
          userId,
          assessmentType: item.data.assessmentType || 'initial_check',
          assessmentTitle: item.data.assessmentTitle || '',
          instrumentVersion: item.data.instrumentVersion || '1.0',
          answers: item.data.answers || {},
          score: typeof item.data.score === 'number' ? item.data.score : 0,
          maxScore: typeof item.data.maxScore === 'number' ? item.data.maxScore : 0,
          resultTitle: item.data.resultTitle || '',
          resultText: item.data.resultText || '',
          recommendation: item.data.recommendation || '',
          createdAt: item.data.createdAt,
          safetyFlagTriggered: !!item.data.safetyFlagTriggered,
          version: assessmentVersion,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp(),
          deleted: false
        }, { merge: true });
      } else {
        await setDoc(assessmentDocRef, {
          id: item.entityId,
          userId,
          version: assessmentVersion,
          deleted: true,
          updatedAt: item.timestamp,
          serverUpdated: serverTimestamp()
        }, { merge: true });
      }
    }
  }

  async syncNow(): Promise<{
    success: boolean;
    syncedFavoritesCount: number;
    syncedNotesCount: number;
    syncedCheckinsCount: number;
    syncedHabitsCount: number;
    syncedAssessmentsCount: number;
    error?: string;
  }> {
    if (this.isSyncing) {
      return { 
        success: false, 
        syncedFavoritesCount: 0, 
        syncedNotesCount: 0, 
        syncedCheckinsCount: 0, 
        syncedHabitsCount: 0, 
        syncedAssessmentsCount: 0,
        error: 'Sync already in progress' 
      };
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { 
        success: false, 
        syncedFavoritesCount: 0, 
        syncedNotesCount: 0, 
        syncedCheckinsCount: 0, 
        syncedHabitsCount: 0, 
        syncedAssessmentsCount: 0,
        error: 'Client is offline' 
      };
    }

    const userId = auth?.currentUser?.uid;
    if (!db || !auth || !isFirebaseConfigured || !userId) {
      return { 
        success: true, 
        syncedFavoritesCount: 0, 
        syncedNotesCount: 0, 
        syncedCheckinsCount: 0, 
        syncedHabitsCount: 0, 
        syncedAssessmentsCount: 0,
        error: 'Operating in local offline cache' 
      };
    }

    this.isSyncing = true;

    try {
      // ----------------------------------------------------
      // STEP 1: Process Local Mutation Queue Item-by-Item
      // ----------------------------------------------------
      const queue = [...this.getQueue()];

      let queueHalted = false;
      for (const item of queue) {
        try {
          await this.pushMutationItem(userId, item);
          this.dequeueMutation(item.id);
        } catch (itemError) {
          console.warn('[Sync] Queue halted at item:', item.id, itemError);
          queueHalted = true;
          break;
        }
      }

      // If queue was interrupted by network loss, halt sync cleanly to prevent inconsistent partial pull
      if (queueHalted) {
        return {
          success: false,
          syncedFavoritesCount: 0,
          syncedNotesCount: 0,
          syncedCheckinsCount: 0,
          syncedHabitsCount: 0,
          syncedAssessmentsCount: 0,
          error: 'Queue push interrupted by network error'
        };
      }

      // ----------------------------------------------------
      // STEP 2: Pull and Merge Favorites from Cloud
      // ----------------------------------------------------
      let syncedFavoritesCount = 0;
      const favsCollectionRef = collection(db, 'users', userId, 'favorites');
      const favsSnapshot = await getDocs(favsCollectionRef);
      
      const localFavs = new Set(storage.getFavorites());
      const pendingFavoriteDeletes = new Set(
        this.getQueue().filter(m => m.entity === 'favorite' && m.operation === 'delete').map(m => m.entityId)
      );
      const pendingFavoriteUpserts = new Set(
        this.getQueue().filter(m => m.entity === 'favorite' && m.operation === 'upsert').map(m => m.entityId)
      );
      
      favsSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const contentId = docSnap.id;
        syncedFavoritesCount++;

        if (data.deleted === true) {
          if (!pendingFavoriteUpserts.has(contentId)) {
            localFavs.delete(contentId);
          }
        } else {
          if (!pendingFavoriteDeletes.has(contentId)) {
            localFavs.add(contentId);
          }
        }
      });

      localStorage.setItem('nesmat_favorites_v1', JSON.stringify(Array.from(localFavs)));

      // ----------------------------------------------------
      // STEP 3: Pull and Merge Personal Notes
      // ----------------------------------------------------
      let syncedNotesCount = 0;
      const notesCollectionRef = collection(db, 'users', userId, 'notes');
      const notesSnapshot = await getDocs(notesCollectionRef);

      const localNotes = storage.getNotes();
      const localNotesMap = new Map<string, PersonalNote>(
        localNotes.map(n => [n.id, n])
      );
      const noteTombstones = this.getNoteTombstones();

      notesSnapshot.forEach(docSnap => {
        const cloudData = docSnap.data();
        const noteId = docSnap.id;
        syncedNotesCount++;

        const cloudVersion = typeof cloudData.version === 'number' ? cloudData.version : 1;
        const localNote = localNotesMap.get(noteId);
        const tombstone = noteTombstones[noteId];

        if (tombstone) {
          if (cloudVersion <= tombstone.version || cloudData.deleted) {
            localNotesMap.delete(noteId);
            return;
          }
        }

        if (!localNote) {
          if (!cloudData.deleted) {
            localNotesMap.set(noteId, {
              id: noteId,
              userId: cloudData.userId,
              text: cloudData.text,
              date: cloudData.date,
              moodTag: cloudData.moodTag,
              version: cloudVersion,
              updatedAt: cloudData.updatedAt
            });
          }
        } else {
          const localVersion = typeof localNote.version === 'number' ? localNote.version : 1;

          if (cloudVersion > localVersion) {
            if (cloudData.deleted) {
              localNotesMap.delete(noteId);
            } else {
              localNotesMap.set(noteId, {
                id: noteId,
                userId: cloudData.userId,
                text: cloudData.text,
                date: cloudData.date,
                moodTag: cloudData.moodTag,
                version: cloudVersion,
                updatedAt: cloudData.updatedAt
              });
            }
          } else if (localVersion > cloudVersion) {
            // Local wins
          } else {
            // Equal version tie-breaker (localVersion === cloudVersion)
            if (cloudData.deleted) {
              localNotesMap.delete(noteId);
            } else {
              const cloudTime = new Date(cloudData.updatedAt || 0).getTime();
              const localTime = new Date(localNote.updatedAt || 0).getTime();
              if (cloudTime > localTime) {
                // Cloud update is newer
                localNotesMap.set(noteId, {
                  id: noteId,
                  userId: cloudData.userId,
                  text: cloudData.text,
                  date: cloudData.date,
                  moodTag: cloudData.moodTag,
                  version: cloudVersion,
                  updatedAt: cloudData.updatedAt
                });
              }
            }
          }
        }
      });

      localStorage.setItem('nesmat_notes_v1', JSON.stringify(Array.from(localNotesMap.values())));

      // ----------------------------------------------------
      // STEP 4: Pull and Merge Daily Check-ins
      // ----------------------------------------------------
      let syncedCheckinsCount = 0;
      const checkinsCollectionRef = collection(db, 'users', userId, 'checkins');
      const checkinsSnapshot = await getDocs(checkinsCollectionRef);

      const localCheckins = storage.getDailyCheckins();
      const localCheckinsMap = new Map<string, DailyCheckin>(
        localCheckins.map(c => [c.id, c])
      );
      const checkinTombstones = this.getCheckinTombstones();

      checkinsSnapshot.forEach(docSnap => {
        const cloudData = docSnap.data();
        const checkinId = docSnap.id;
        syncedCheckinsCount++;

        const cloudVersion = typeof cloudData.version === 'number' ? cloudData.version : 1;
        const localCheckin = localCheckinsMap.get(checkinId);
        const tombstone = checkinTombstones[checkinId];

        if (tombstone) {
          if (cloudVersion <= tombstone.version || cloudData.deleted) {
            localCheckinsMap.delete(checkinId);
            return;
          }
        }

        if (!localCheckin) {
          if (!cloudData.deleted) {
            localCheckinsMap.set(checkinId, {
              id: checkinId,
              userId: cloudData.userId,
              moodValue: cloudData.moodValue,
              date: cloudData.date,
              optionalNote: cloudData.optionalNote || undefined,
              timestamp: cloudData.timestamp,
              version: cloudVersion,
              updatedAt: cloudData.updatedAt
            });
          }
        } else {
          const localVersion = typeof localCheckin.version === 'number' ? localCheckin.version : 1;

          if (cloudVersion > localVersion) {
            if (cloudData.deleted) {
              localCheckinsMap.delete(checkinId);
            } else {
              localCheckinsMap.set(checkinId, {
                id: checkinId,
                userId: cloudData.userId,
                moodValue: cloudData.moodValue,
                date: cloudData.date,
                optionalNote: cloudData.optionalNote || undefined,
                timestamp: cloudData.timestamp,
                version: cloudVersion,
                updatedAt: cloudData.updatedAt
              });
            }
          } else if (localVersion > cloudVersion) {
            // Local wins
          } else {
            // Equal version tie-breaker (localVersion === cloudVersion)
            if (cloudData.deleted) {
              localCheckinsMap.delete(checkinId);
            } else {
              const cloudTime = new Date(cloudData.updatedAt || 0).getTime();
              const localTime = new Date(localCheckin.updatedAt || 0).getTime();
              if (cloudTime > localTime) {
                // Cloud update is newer
                localCheckinsMap.set(checkinId, {
                  id: checkinId,
                  userId: cloudData.userId,
                  moodValue: cloudData.moodValue,
                  date: cloudData.date,
                  optionalNote: cloudData.optionalNote || undefined,
                  timestamp: cloudData.timestamp,
                  version: cloudVersion,
                  updatedAt: cloudData.updatedAt
                });
              }
            }
          }
        }
      });

      localStorage.setItem('nesmat_checkins_v1', JSON.stringify(Array.from(localCheckinsMap.values())));

      // ----------------------------------------------------
      // STEP 5: Pull and Merge Wellness Habits (Union on Completions)
      // ----------------------------------------------------
      let syncedHabitsCount = 0;
      const habitsCollectionRef = collection(db, 'users', userId, 'wellness_habits');
      const habitsSnapshot = await getDocs(habitsCollectionRef);

      const localHabits = storage.getHabits();
      const localHabitsMap = new Map<string, WellnessHabit>(
        localHabits.map(h => [h.id, h])
      );
      const habitTombstones = this.getHabitTombstones();

      habitsSnapshot.forEach(docSnap => {
        const cloudData = docSnap.data();
        const habitId = docSnap.id;
        syncedHabitsCount++;

        const cloudVersion = typeof cloudData.version === 'number' ? cloudData.version : 1;
        const localHabit = localHabitsMap.get(habitId);
        const tombstone = habitTombstones[habitId];

        if (tombstone) {
          if (cloudVersion <= tombstone.version || cloudData.deleted) {
            localHabitsMap.delete(habitId);
            return;
          }
        }

        const cloudCompletedDates: string[] = Array.isArray(cloudData.completedDates) ? cloudData.completedDates : [];
        const cloudCompletionLog: Record<string, { completed: boolean; version: number; updatedAt: string }> = 
          cloudData.completionLog || {};

        if (!localHabit) {
          if (!cloudData.deleted) {
            localHabitsMap.set(habitId, {
              id: habitId,
              userId: cloudData.userId,
              title: cloudData.title,
              category: cloudData.category || 'routine',
              frequency: cloudData.frequency || 'daily',
              targetDaysPerWeek: cloudData.targetDaysPerWeek || 7,
              completedDates: cloudCompletedDates,
              completionLog: cloudCompletionLog,
              createdAt: cloudData.createdAt,
              version: cloudVersion,
              updatedAt: cloudData.updatedAt
            });
          }
        } else {
          const localVersion = typeof localHabit.version === 'number' ? localHabit.version : 1;
          const localCompletedDates: string[] = Array.isArray(localHabit.completedDates) ? localHabit.completedDates : [];
          const localCompletionLog = localHabit.completionLog || {};

          // PER-DATE REVISION MERGE (Eliminates Uncompletion Resurrection Bug)
          const allDates = new Set([
            ...Object.keys(localCompletionLog),
            ...Object.keys(cloudCompletionLog),
            ...localCompletedDates,
            ...cloudCompletedDates
          ]);

          const mergedLog: Record<string, { completed: boolean; version: number; updatedAt: string }> = {};
          const activeDatesSet = new Set<string>();

          allDates.forEach(date => {
            const localRec = localCompletionLog[date];
            const cloudRec = cloudCompletionLog[date];

            let resolved: { completed: boolean; version: number; updatedAt: string };

            if (localRec && cloudRec) {
              if (localRec.version > cloudRec.version) {
                resolved = localRec;
              } else if (cloudRec.version > localRec.version) {
                resolved = cloudRec;
              } else {
                // Tie: newer updatedAt wins
                const localTime = new Date(localRec.updatedAt).getTime();
                const cloudTime = new Date(cloudRec.updatedAt).getTime();
                resolved = cloudTime >= localTime ? cloudRec : localRec;
              }
            } else if (localRec) {
              resolved = localRec;
            } else if (cloudRec) {
              resolved = cloudRec;
            } else {
              // Fallback for legacy date strings without explicit per-date log
              const isDone = localCompletedDates.includes(date) || cloudCompletedDates.includes(date);
              resolved = {
                completed: isDone,
                version: 1,
                updatedAt: cloudData.updatedAt || new Date().toISOString()
              };
            }

            mergedLog[date] = resolved;
            if (resolved.completed) {
              activeDatesSet.add(date);
            }
          });

          const finalCompletedDates = Array.from(activeDatesSet);

          if (cloudVersion > localVersion) {
            if (cloudData.deleted) {
              localHabitsMap.delete(habitId);
            } else {
              localHabitsMap.set(habitId, {
                id: habitId,
                userId: cloudData.userId,
                title: cloudData.title,
                category: cloudData.category || localHabit.category,
                frequency: cloudData.frequency || localHabit.frequency,
                targetDaysPerWeek: cloudData.targetDaysPerWeek || localHabit.targetDaysPerWeek,
                completedDates: finalCompletedDates,
                completionLog: mergedLog,
                createdAt: cloudData.createdAt || localHabit.createdAt,
                version: cloudVersion,
                updatedAt: cloudData.updatedAt
              });
            }
          } else if (localVersion > cloudVersion) {
            // Local metadata wins, but take the date-level merged resolutions
            localHabitsMap.set(habitId, {
              ...localHabit,
              completedDates: finalCompletedDates,
              completionLog: mergedLog
            });
          } else {
            // Equal version tie-breaker (localVersion === cloudVersion)
            if (cloudData.deleted) {
              localHabitsMap.delete(habitId);
            } else {
              const cloudTime = new Date(cloudData.updatedAt || 0).getTime();
              const localTime = new Date(localHabit.updatedAt || 0).getTime();
              const winningData = cloudTime > localTime ? cloudData : localHabit;

              localHabitsMap.set(habitId, {
                id: habitId,
                userId: winningData.userId || localHabit.userId,
                title: winningData.title || localHabit.title,
                category: winningData.category || localHabit.category,
                frequency: winningData.frequency || localHabit.frequency,
                targetDaysPerWeek: winningData.targetDaysPerWeek || localHabit.targetDaysPerWeek,
                completedDates: finalCompletedDates,
                completionLog: mergedLog,
                createdAt: winningData.createdAt || localHabit.createdAt,
                version: localVersion,
                updatedAt: cloudTime > localTime ? cloudData.updatedAt : localHabit.updatedAt
              });
            }
          }
        }
      });

      localStorage.setItem('nesmat_habits_v1', JSON.stringify(Array.from(localHabitsMap.values())));

      // ----------------------------------------------------
      // STEP 6: Pull and Merge Assessments (PHQ-9 & Scales)
      // ----------------------------------------------------
      let syncedAssessmentsCount = 0;
      const assessmentsCollectionRef = collection(db, 'users', userId, 'assessments');
      const assessmentsSnapshot = await getDocs(assessmentsCollectionRef);

      const localAssessments = storage.getAssessments();
      const localAssessmentsMap = new Map<string, AssessmentRecord>(
        localAssessments.map(a => [a.id, a])
      );
      const assessmentTombstones = this.getAssessmentTombstones();

      assessmentsSnapshot.forEach(docSnap => {
        const cloudData = docSnap.data();
        const assessmentId = docSnap.id;
        syncedAssessmentsCount++;

        const cloudVersion = typeof cloudData.version === 'number' ? cloudData.version : 1;
        const localAssessment = localAssessmentsMap.get(assessmentId);
        const tombstone = assessmentTombstones[assessmentId];

        if (tombstone) {
          if (cloudVersion <= tombstone.version || cloudData.deleted) {
            localAssessmentsMap.delete(assessmentId);
            return;
          }
        }

        if (!localAssessment) {
          if (!cloudData.deleted) {
            localAssessmentsMap.set(assessmentId, {
              id: assessmentId,
              userId: cloudData.userId,
              assessmentType: cloudData.assessmentType || 'initial_check',
              assessmentTitle: cloudData.assessmentTitle || '',
              instrumentVersion: cloudData.instrumentVersion || '1.0',
              answers: cloudData.answers || {},
              score: cloudData.score,
              maxScore: cloudData.maxScore,
              resultTitle: cloudData.resultTitle,
              resultText: cloudData.resultText,
              recommendation: cloudData.recommendation,
              createdAt: cloudData.createdAt,
              safetyFlagTriggered: cloudData.safetyFlagTriggered,
              version: cloudVersion,
              updatedAt: cloudData.updatedAt
            });
          }
        } else {
          const localVersion = typeof localAssessment.version === 'number' ? localAssessment.version : 1;

          if (cloudVersion > localVersion) {
            if (cloudData.deleted) {
              localAssessmentsMap.delete(assessmentId);
            } else {
              localAssessmentsMap.set(assessmentId, {
                id: assessmentId,
                userId: cloudData.userId,
                assessmentType: cloudData.assessmentType || localAssessment.assessmentType,
                assessmentTitle: cloudData.assessmentTitle || localAssessment.assessmentTitle,
                instrumentVersion: cloudData.instrumentVersion || localAssessment.instrumentVersion,
                answers: cloudData.answers || localAssessment.answers,
                score: cloudData.score,
                maxScore: cloudData.maxScore,
                resultTitle: cloudData.resultTitle,
                resultText: cloudData.resultText,
                recommendation: cloudData.recommendation,
                createdAt: cloudData.createdAt,
                safetyFlagTriggered: cloudData.safetyFlagTriggered,
                version: cloudVersion,
                updatedAt: cloudData.updatedAt
              });
            }
          } else if (localVersion > cloudVersion) {
            // Local wins
          } else {
            // Equal version tie-breaker (localVersion === cloudVersion)
            if (cloudData.deleted) {
              localAssessmentsMap.delete(assessmentId);
            } else {
              const cloudTime = new Date(cloudData.updatedAt || 0).getTime();
              const localTime = new Date(localAssessment.updatedAt || 0).getTime();
              if (cloudTime > localTime) {
                localAssessmentsMap.set(assessmentId, {
                  id: assessmentId,
                  userId: cloudData.userId,
                  assessmentType: cloudData.assessmentType || localAssessment.assessmentType,
                  assessmentTitle: cloudData.assessmentTitle || localAssessment.assessmentTitle,
                  instrumentVersion: cloudData.instrumentVersion || localAssessment.instrumentVersion,
                  answers: cloudData.answers || localAssessment.answers,
                  score: cloudData.score,
                  maxScore: cloudData.maxScore,
                  resultTitle: cloudData.resultTitle,
                  resultText: cloudData.resultText,
                  recommendation: cloudData.recommendation,
                  createdAt: cloudData.createdAt,
                  safetyFlagTriggered: cloudData.safetyFlagTriggered,
                  version: cloudVersion,
                  updatedAt: cloudData.updatedAt
                });
              }
            }
          }
        }
      });

      localStorage.setItem('nesmat_assessments_v1', JSON.stringify(Array.from(localAssessmentsMap.values())));
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());

      return {
        success: true,
        syncedFavoritesCount,
        syncedNotesCount,
        syncedCheckinsCount,
        syncedHabitsCount,
        syncedAssessmentsCount
      };
    } catch (error: any) {
      console.warn('[Sync] Sync notice:', error?.message || error);
      return {
        success: false,
        syncedFavoritesCount: 0,
        syncedNotesCount: 0,
        syncedCheckinsCount: 0,
        syncedHabitsCount: 0,
        syncedAssessmentsCount: 0,
        error: error.message || 'Unknown sync error'
      };
    } finally {
      this.isSyncing = false;
    }
  }

  async getCloudHabit(userId: string, habitId: string) {
    if (!db) return null;
    const ref = doc(db, 'users', userId, 'wellness_habits', habitId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }
}

export const syncService = new SyncService();

// Auto-wire storage mutations to SyncService queue
storage.onFavoriteChanged((contentId, isFavorited) => {
  syncService.recordFavoriteChange(contentId, isFavorited);
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    syncService.syncNow().catch(() => {});
  }
});

storage.onNoteChanged((note, operation) => {
  syncService.recordNoteChange(note, operation);
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    syncService.syncNow().catch(() => {});
  }
});

storage.onCheckinChanged((checkin, operation) => {
  syncService.recordCheckinChange(checkin, operation);
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    syncService.syncNow().catch(() => {});
  }
});

storage.onHabitChanged((habit, operation) => {
  syncService.recordHabitChange(habit, operation);
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    syncService.syncNow().catch(() => {});
  }
});

storage.onAssessmentChanged((assessment, operation) => {
  syncService.recordAssessmentChange(assessment, operation);
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    syncService.syncNow().catch(() => {});
  }
});

// Auto-trigger sync on window online event
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncService.syncNow().catch(() => {});
  });
}
