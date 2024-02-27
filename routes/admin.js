import express from "express";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const adminCheck = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(401).json("Not access")
    }
    next();
};
//管理者の書籍追加
router.post("/book/create",adminCheck, async (req, res, next) => {
    const {isbn13,title,author,publishDate} = req.body;
    try{
        const create_book = await prisma.books.create({
            data: {
                isbn13: parseFloat(isbn13),
                title,
                author,
                publishDate: new Date(publishDate)
            }})
        res.status(201).json({
            message: "OK",
            create_book
        });
    } catch (e) {
        switch (e.code) {
            case "P2002":
                res.status(400).json({
                    message: "NG"
                });
                break;
            default:
                console.error(e);
                res.status(500).json({
                    message: "NG"
                });
        }
    }
});
// 管理者の書籍更新

router.put("/book/update",adminCheck, async (req, res, next) => {
    const {bookId,isbn13,title,author,publishDate} = req.body;
    try{
        const update_book = await prisma.books.update({
            where: {id: bookId},
            data: {
                isbn13: parseFloat(isbn13),
                title,
                author,
                publishDate: new Date(publishDate)
            }})
        res.status(201).json({
            message: "update!",
            update_book
        });
    } catch (e) {
        switch (e.code) {
            case "P2002":
                res.status(400).json({
                    message: "update error"
                });
                break;
            default:
                console.error(e);
                res.status(500).json({
                    message: "unknown error"
                });
        }
    }
});
router.get("/rental/current", adminCheck, async (req, res, next) =>{
    const rental_books = await prisma.rental.findMany({
        where:{returnDate: null,},
        select: {
            id: true,
            user: {select:{id: true, name: true}},
            book: {select:{id: true, title: true}},
            rentalDate: true,
            returnDeadline: true
        }
    })
    res.status(200).json({
        rental_books
    })
});
router.get(`/rental/current/:uid`, adminCheck, async (req, res, next) =>{
    const rental_books = await prisma.rental.findMany({
        where:{returnDate: null,userId: req.params.uid},
        select: {
            user: {select:{id: true, name: true}},
        }
    })
    const rental_Books = await prisma.rental.findMany({
        where:{returnDate: null, userId: req.params.uid},
        select:{
            id: true,
            book: {select:{id: true, title: true}},
            rentalDate: true,
            returnDeadline: true
        }
    })
    res.status(200).json({
        rental_books,
        rental_Books
    })
});
export default router;