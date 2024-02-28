import express, {request} from "express";
import {PrismaClient} from "@prisma/client";


const router = express.Router();
const prisma = new PrismaClient();
const loginCheck = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json("Not access")
    }
    req.userId = req.user.id;
    next();
};
router.post("/start", loginCheck, async (req, res) => {
    const { bookId } = req.body;
    const userId = req.userId
    try{
        const existingRental = await prisma.rental.findFirst({
            where: { bookId, returnDate: null }
        });
        if (existingRental) {
            return res.status(409).json("貸出中のため失敗");
        }
        const rental_start = await prisma.rental.create({
            data:{
                book: {connect:{id: bookId}},
                user: {connect:{id: userId}}
            },
            select: {
                id: true,
                bookId: true,
                rentalDate: true,
                returnDeadline: true
            }
        })
        res.status(201).json({
            message: "貸出成功",
            rental_start
        })


    } catch (error) {
        console.error(error)
        res.status(400).json({
            message:"その他エラー"
        })
    }
});
router.put('/return', loginCheck, async (req, res, next) => {
    const {rentalId} = req.body;
    try{
        const return_book = await prisma.rental.update({
            where:{id: Number(rentalId)}, data:{
                returnDate: new Date(Date.now())
            }
        })
        res.status(200).json({
            message:"OK",
            return_book
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({message:"NG"})
    }
});
router.get("/current", loginCheck, async (req, res, next) =>{
    const userId = req.userId;
    const rentalbooks = await prisma.rental.findMany({
        where:{returnDate: null, userId: userId},
        select: {
            id: true,
            book: {select:{id: true, title: true}},
            rentalDate: true,
            returnDeadline: true
        }
    })
    res.status(200).json({
        rentalbooks
    })
});
router.get('/history', loginCheck, async (req, res, next) =>{
    const userId = req.userId;
    const rental_history = await prisma.rental.findMany({
        where:{userId: userId, returnDate: {not: null}},
        select:{
            id: true,
            book:{select:{id: true, title: true}},
            rentalDate: true,
            returnDate: true
        }
    })
    res.status(200).json({
        message: "OK",
        rental_history
    })
})

export default router;