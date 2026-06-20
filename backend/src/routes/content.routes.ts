// src/routes/content.routes.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';

// Controllers de Raças e Personagens
import { createRaceController, getWorldRacesController, deleteRaceController, updateRaceController } from '../controllers/race.controller';
import { createCharacterController, getWorldCharactersController, deleteCharacterController, updateCharacterController } from '../controllers/character.controller';

// Controllers de Conteúdo Extra (com delete e update)
import { 
  createKingdomController, getKingdomsController, deleteKingdomController, updateKingdomController,
  createLocationController, getLocationsController, deleteLocationController, updateLocationController,
  createEventController, getEventsController, deleteEventController, updateEventController,
  createProfessionController, getProfessionsController, deleteProfessionController, updateProfessionController,
  createConceptController, getConceptsController, deleteConceptController, updateConceptController,
  createLoreEntryController, getLoreEntriesController, deleteLoreEntryController, updateLoreEntryController
} from '../controllers/extra-content.controller';

// Controller do Simulador
import { simulateConflictController } from '../controllers/simulator.controller';

const router = Router();

// Todas as rotas de conteúdo exigem autenticação
router.use(authenticate);

// --- RAÇAS (com delete/update) ---
router.post('/worlds/:worldId/races', createRaceController);
router.get('/worlds/:worldId/races', getWorldRacesController);
router.delete('/races/:id', deleteRaceController);
router.put('/races/:id', updateRaceController);

// --- PERSONAGENS (com delete/update) ---
router.post('/worlds/:worldId/characters', createCharacterController);
router.get('/worlds/:worldId/characters', getWorldCharactersController);
router.delete('/characters/:id', deleteCharacterController);
router.put('/characters/:id', updateCharacterController);

// --- REINOS ---
router.post('/worlds/:worldId/kingdoms', createKingdomController);
router.get('/worlds/:worldId/kingdoms', getKingdomsController);
router.delete('/kingdoms/:id', deleteKingdomController);
router.put('/kingdoms/:id', updateKingdomController);

// --- LOCAIS ---
router.post('/worlds/:worldId/locations', createLocationController);
router.get('/worlds/:worldId/locations', getLocationsController);
router.delete('/locations/:id', deleteLocationController);
router.put('/locations/:id', updateLocationController);

// --- EVENTOS ---
router.post('/worlds/:worldId/events', createEventController);
router.get('/worlds/:worldId/events', getEventsController);
router.delete('/events/:id', deleteEventController);
router.put('/events/:id', updateEventController);

// --- PROFISSÕES ---
router.post('/worlds/:worldId/professions', createProfessionController);
router.get('/worlds/:worldId/professions', getProfessionsController);
router.delete('/professions/:id', deleteProfessionController);
router.put('/professions/:id', updateProfessionController);

// --- CONCEITOS ---
router.post('/worlds/:worldId/concepts', createConceptController);
router.get('/worlds/:worldId/concepts', getConceptsController);
router.delete('/concepts/:id', deleteConceptController);
router.put('/concepts/:id', updateConceptController);

// --- LORE ENTRIES ---
router.post('/worlds/:worldId/lore', createLoreEntryController);
router.get('/worlds/:worldId/lore', getLoreEntriesController);
router.delete('/lore/:id', deleteLoreEntryController);
router.put('/lore/:id', updateLoreEntryController);

// --- SIMULADORES ---
router.post('/worlds/:worldId/simulate/conflict', simulateConflictController);

export default router;