/*
   业务模块
 */
const db = require("./db.js");

// 获取所有的图书信息
exports.allBooks = (req,res)=>{
    let sql = "select * from book";
    let data = null;
    db.base(sql,data,(result)=>{
        res.json(result);
    });  

} 

//编辑图书时根据id查询相应信息
exports.getBookById = (req,res)=>{
    //得到id
    let id = req.params.id;
    let sql = "select * from book where id=?";
    let data = [id];
    db.base(sql,data,(result)=>{
        res.json(result[0]);
    });
}

exports.editBook = (req,res)=>{
    let info = req.body;
    let sql = "update book set name=?,author=?,category=?,description=? where id=?";
    let data = [info.name,info.author,info.category,info.description,info.id];
    db.base(sql,data,(result)=>{
        console.log(result);
        if(result.affectedRows == 1) {
            res.json({bool:1});
        } else {
            res.json({bool:-1});
        }
    });
};

exports.deleteBook = (req,res)=>{
    let id = req.params.id;
    let sql = "delete from book where id=?";
    let data = [id];
    db.base(sql,data,(result)=>{
        if(result.affectedRows == 1) {
            res.json({bool:1});
        } else {
            res.json({bool:-1});
        }
    });
};

exports.addBook = (req,res)=>{
    let info = req.body;// {name:"...",}
    let sql = "insert into book set?";
    let data = info;
    db.base(sql,data,(result)=>{
        if(result.affectedRows == 1) {
            res.json({bool:1});
        } else {
            res.json({bool:-1});
        }
    });
};


