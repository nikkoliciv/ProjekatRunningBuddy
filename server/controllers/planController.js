import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//kreiranje plana
export const createPlan = async (req, res) => {
    const { time, place, length } = req.body;
    const userId = req.user.userId; //dobija se iz middlewera 

    try {
        // pronalazi se itinerer koji odgovara korisniku
        const itinerary = await prisma.itinerary.findFirst({
            where: {
                userId: userId
            }
        });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found for the user' });
        }

        //kreira se novi plan
        const newPlan = await prisma.plan.create({
            data: {
              time: new Date(time),
              place,
              length,
              creator: {
                connect: { id: userId }
              }
            },
            include: {
              creator: {
                select: {
                  name: true,
                }
              }
            }
          });

        // dodaje se novi plan u itinerer
        const updatedItinerary = await prisma.itinerary.update({
            where: {
                id: itinerary.id
            },
            data: {
                plans: {
                    connect: { id: newPlan.id }
                }
            },
            include: {
                plans: true 
            }
        });

        //vraca se poruka, updatovan itinerer, i plan
        res.json({ message: 'Plan added to itinerary successfully',updatedItinerary: updatedItinerary, plan: newPlan });
    } catch (error) {
        console.error('Error adding plan to itinerary:', error);
        res.status(500).json({ message: 'Error adding plan to itinerary', error });
    }
};

//brisanje plana
export const deletePlan = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const plan = await prisma.plan.findUnique({
            where: { id: parseInt(id) },
            include: { comments: true }, // Include comments in the query
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.creatorId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this plan' });
        }

        // Delete all comments associated with the plan
        await prisma.comment.deleteMany({
            where: { planId: parseInt(id) },
        });

        // Delete the plan
        await prisma.plan.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Plan and associated comments deleted successfully' });
    } catch (error) {
        console.error('Error deleting plan and comments:', error);
        res.status(500).json({ message: 'Error deleting plan and comments', error });
    }
};



//dobijanje svih planova
export const getAllPlans = async (req, res) => {
    try {
        const plans = await prisma.plan.findMany({
            include: {
                creator: {
                    select: {
                        name: true, 
                    }
                }
            }
        });
        console.log('plans from server', plans);
        res.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//dobijanje plana po idu
export const getPlanById = async (req, res) => {
    const { id } = req.params;

    try {
        const plan = await prisma.plan.findUnique({
            where: { id: parseInt(id) },
            include: {
                creator: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                comments: {
                    include: {
                        creator: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                itinerary:{
                    include: {
                        user: {
                            select:{
                                name: true,
                            }
                        }

                    }
                }
            }
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.json(plan);
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
