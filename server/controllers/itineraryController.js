import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//dodati novi plan u itinerer
export const addPlanToItinerary = async (req, res) => {
    const { planId } = req.body;
    const userId = req.user.userId; 

    try {
        // pronalazi se itinerer
        const itinerary = await prisma.itinerary.findFirst({
            where: {
                userId: userId
            }
        });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found for the user' });
        }

        // provera da li plan postoji
        const plan = await prisma.plan.findUnique({
            where: {
                id: parseInt(planId)
            },
            include: {
                creator: {
                    select: {
                        name: true 
                    }
                }
            }
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        //dodaje se plan u itinerer
        const updatedItinerary = await prisma.itinerary.update({
            where: {
                id: itinerary.id
            },
            data: {
                plans: {
                    connect: { id: parseInt(planId) }
                }
            },
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
            }
        });

        // dodaje se itinerer u plan
        await prisma.plan.update({
            where: {
                id: parseInt(planId)
            },
            data: {
                itinerary: {
                    connect: { id: itinerary.id }
                }
            }
        });

        res.json({ message: 'Plan added to itinerary successfully', plan: plan });
    } catch (error) {
        console.error('Error adding plan to itinerary:', error);
        res.status(500).json({ message: 'Error adding plan to itinerary', error });
    }
};

//brisanje plana iz itinerera
export const deletePlanFromItinerary = async (req, res) => {
    const { planId } = req.body;
    const userId = req.user.userId;

    try {
       
        //pretraga itinerera u zavisnosti od korisnika koji je ulogovan
        const itinerary = await prisma.itinerary.findFirst({
            where: {
                userId: userId
            }
        });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found for the user' });
        }

        //pretraga plana u itinereru
        const planInItinerary = await prisma.itinerary.findUnique({
            where: {
                id: itinerary.id
            },
            include: {
                plans: {
                    where: {
                        id: parseInt(planId)
                    }
                }
            }
        });
        
          
          

        if (!planInItinerary || planInItinerary.plans.length === 0) {
            return res.status(404).json({ message: 'Plan not found in the itinerary' });
        }

        // pretraga plana od svih planova
        const plan = await prisma.plan.findUnique({
            where: {
              id: parseInt(planId)
            },
            include: {
              creator: { 
                select: {
                  name: true 
                }
              }
            }
          });
          

        // brisanje plana iz itinerera
        const updatedItinerary = await prisma.itinerary.update({
            where: {
                id: itinerary.id
            },
            data: {
                plans: {
                    disconnect: { id: parseInt(planId) }
                }
            },
            include: {
                plans: true 
            }
        });

        // brisanje itinera iz plana
        await prisma.plan.update({
            where: {
                id: parseInt(planId)
            },
            data: {
                itinerary: {
                    disconnect: { id: itinerary.id }
                }
            }
        });

        res.json({ message: 'Plan deleted from itinerary successfully', plan: plan });
    } catch (error) {
        console.error('Error deleting plan from itinerary:', error);
        res.status(500).json({ message: 'Error deleting plan from itinerary', error });
    }
};
