import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//dodavanje komentara 
export const addCommentToPlan = async (req, res) => {
    const { planId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; 

    try {
        // provera da li plan postoji
        const plan = await prisma.plan.findUnique({
            where: { id: parseInt(planId) },
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

       
        //kreiranje novog komentara
        const newComment = await prisma.comment.create({
            data: {
              content,
              creator: {
                connect: { id: userId }
              },
              plan: {
                connect: { id: parseInt(planId) }
              }
            },
            include: {
              creator: { 
                select: {
                  name: true 
                }
              }
            }
          });

        res.status(201).json({ message: 'Comment added to plan successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment to plan:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// brisanje komentara
export const deleteCommentFromPlan = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.userId; 

    try {
        //pronalazak komentara
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(commentId) },
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.creatorId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        // brisanje komentara
        await prisma.comment.delete({
            where: { id: parseInt(commentId) },
        });

        res.status(200).json({ message: 'Comment deleted successfully', comment });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const getAllComments = async (req, res) => {
  try {
      const comments = await prisma.comment.findMany({
          include: {
              creator: {
                  select: { name: true } 
              },
              plan: {
                  select: { id: true, place: true } 
              }
          }
      });

      res.status(200).json({ comments });
  } catch (error) {
      console.error('Error retrieving all comments:', error);
      res.status(500).json({ message: 'Internal server error', error });
  }
};