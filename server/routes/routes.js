import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js'
import { PrismaClient } from '@prisma/client';
import { deleteUser, getAllUsers, getUserById } from '../controllers/userController.js';
import { createPlan, deletePlan, getAllPlans, getPlanById } from '../controllers/planController.js';
import { addPlanToItinerary, deletePlanFromItinerary } from '../controllers/itineraryController.js';
import { addCommentToPlan, deleteCommentFromPlan, getAllComments } from '../controllers/commentController.js';
const prisma = new PrismaClient();

const router = express.Router()

//api routes

// user dobijemo sve korisnike, jednog ,brisemo 
router.get('/user',authenticateToken, getAllUsers)

router.get('/user/:id',authenticateToken, getUserById)

router.delete('/user/:id',authenticateToken, deleteUser)

//plan
router.post('/plan',authenticateToken, createPlan)

router.get('/plan', authenticateToken, getAllPlans)

router.get('/plan/:id', authenticateToken, getPlanById)

router.delete('/plan/:id',authenticateToken, deletePlan)


//comment
router.post('/comment/:planId',authenticateToken, addCommentToPlan)

router.delete('/comment/:commentId',authenticateToken, deleteCommentFromPlan)

router.get('/comment', getAllComments)


//ininerary
router.post('/itinerary/add',authenticateToken, addPlanToItinerary)

router.delete('/itinerary/delete',authenticateToken, deletePlanFromItinerary)



export default router