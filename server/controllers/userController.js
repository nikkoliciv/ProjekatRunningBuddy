import express from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// dobijanje svih korisnika
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//dobijanje jednog korisnika
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                name: true,
                email: true,
                isAdmin: true,
                Plan: true, 
                Itinerary: {
                    include: {
                        plans: {
                            select: {
                                id: true,
                                time: true,
                                place: true,
                                length: true,
                                creatorId: true,
                                creator: {
                                    select: {
                                        name: true 
                                    }
                                }
                            }
                        }    
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//brisanje korisnika
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Provera da li korisnik postoji
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                Plan: true,
                Itinerary: true,
                Comment: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Konstrukcija Prisma promises
        const deleteOperations = [];

        //komentari korisnika na njegovim planoivma
        for (const plan of user.Plan) {
            deleteOperations.push(
                prisma.comment.deleteMany({
                    where: { planId: plan.id },
                })
            );
        }

        //njegovi komentari
        deleteOperations.push(
            prisma.comment.deleteMany({
                where: { creatorId: user.id },
            })
        );

        //planovi
        for (const plan of user.Plan) {
            deleteOperations.push(
                prisma.plan.delete({
                    where: { id: plan.id },
                })
            );
        }

        //itinerer
        if (user.Itinerary) {
            deleteOperations.push(
                prisma.itinerary.delete({
                    where: { id: user.Itinerary.id },
                })
            );
        }

        // Brisanje korisnika
        deleteOperations.push(
            prisma.user.delete({
                where: { id: parseInt(id) },
            })
        );

        // Brisanje svegaa  Execute all delete operations in a transaction
        await prisma.$transaction(deleteOperations);

        res.json({ message: 'User deleted successfully', user });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

