import express, {request} from "express";
import {PrismaClient} from "@prisma/client";


const router = express.Router();
const prisma = new PrismaClient();
const loginCheck = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json("Not access")
    }
    next();
};
router.get("/list", loginCheck, async (req, res, next) => {
    const page = req.query.page || 1; // ページ番号のデフォルト値は1
    const pageSize = 10; // 1ページあたりのアイテム数

    try {
        const totalCount = await prisma.books.count();
        const maxPage = Math.ceil(totalCount / pageSize);
        const books = await prisma.books.findMany({
            select: {
                id: true,
                title: true,
                author: true,
                publishDate: true,
                rental: true
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        res.status(200).json({ books , maxPage});
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get(`/detail/:id`, loginCheck, async (req, res, next) =>{
    const detail_book = await prisma.books.findFirst({
        where:{id: req.params.id} , select: {
            id: true,
            isbn13: true,
            title: true,
            author: true,
            publishDate: true,
        }
    })
    const rentalInfo = await prisma.rental.findFirst({
        where:{userId: req.params.id}, select:{
            user:{select:{
                    name: true
                }
            },
            rentalDate: true,
            returnDeadline: true
        }
    })
    res.status(200).json({
            detail_book,
            rentalInfo
        }
    )
})
export default router;