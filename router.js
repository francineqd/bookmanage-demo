/*
   路由模块
*/
const express = require('express');
const router = express.Router();
const service = require("./service.js");

// 提供所有图书信息
router.get('/books',service.allBooks);

// 编辑图书时根据id查询相应信息 localhost:3000/books/book/5
router.get('/books/book/:id',service.getBookById);

// 提交编辑后的数据
router.put("/books/book",service.editBook);

// 删除图书信息
router.delete("/books/book/:id",service.deleteBook);

//添加图书信息
router.post("/books/book",service.addBook);

module.exports = router;