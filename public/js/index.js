;$(function() {
    initList();
    // 初始化数据列表
    function initList() {
        $.ajax({
            type: "get",
            url: "/books",
            dataType: "json",
            success: function(data) {
                // 渲染数据列表
                var html = template('indexTpl',{list:data});
                $("#dataList").html(html);
                pageInit();
                // 操作DOM
                $("#dataList").find("tr").each(function(index,element) {
                    var td = $(element).find("td:eq(5)");
                    var id = $(element).find("td:eq(0)").text();
                    // 绑定编辑图书单击事件
                    td.find("a:eq(0)").click(function() {
                        editBook(id);
                    });
                    td.find("a:eq(1)").click(function() {
                        deleteBook(id);
                    });
                });
            }
        });
        $("#addBook").click(function() {
            addBook();
        });
    }

    function editBook(id) {
        var form = $("#addBookForm");
        // 根据id查询最新的数据
        $.ajax({
            type: "get",
            url: "/books/book/"+id,
            dataType: "json",
            success: function(data) {
                // 初始化弹窗
                var mark = new MarkBox(400,300,"编辑图书",form[0]);//转成原生dom对象form.get(0)或form[0]
                mark.init();
                // 填充表单数据
                form.find("input[name=id]").val(data.id);
                form.find("input[name=name]").val(data.name);
                form.find("input[name=author]").val(data.author);
                form.find("input[name=category]").val(data.category);
                form.find("input[name=description]").val(data.description);
                // 对表单的提交按钮添加单击事件
                form.find("input[type=button]").unbind("click").click(function() {
                    // 编辑完成数据后重新提交表单
                    $.ajax({
                        type:"put",
                        url: "/books/book",
                        dataType: "json",
                        data: form.serialize(),
                        success: function(data) {
                            if(data.bool == 1) {
                                //关闭弹窗
                                mark.close();
                                // 重新渲染数据列表
                                initList();
                                
                            }
                        }
                    })
                })
            }
        })
    }

    function deleteBook(id) {
        $.ajax({
            type: "delete",
            url: "/books/book/"+id,
            dataType: "json",
            success: function(data) {
                if(data.bool == 1) {
                    // 重新渲染数据列表
                    initList();
                }  
            }
        })
    }

    function addBook() {
        var form = $("#addBookForm");
        // 重置表单数据
        form.find("input").not("input[type=button]").removeAttr("value");
        // 初始化弹窗
        var mark = new MarkBox(400,300,"编辑图书",form[0]);//转成原生dom对象form.get(0)或form[0]
        mark.init();
        form.find("input[type=button]").unbind("click").click(function() {
            // 编辑完成数据后重新提交表单
            $.ajax({
                type:"post",
                url: "/books/book",
                dataType: "json",
                data: form.serialize(),
                success: function(data) {
                    if(data.bool == 1) {
                        //关闭弹窗
                        mark.close();
                        // 重新渲染数据列表
                        initList();
                    }
                }
            });
        });
    }

    function pageInit() {
        var theTable = document.getElementById("dataList");
        // total news count
        var count = theTable.rows.length;
        
        // max count for one page
        var ONE_PAGE_COUNT = 5;
        
        // total pages
        var totalPage = parseInt(count / ONE_PAGE_COUNT) + ((count % ONE_PAGE_COUNT) == 0? 0 : 1);
        // init page
        var currPage = 1;
        // function used to set news count
        function setUICount(count) {
        if (count == undefined) {count = 0;}
        $("#cp-count").text(count);
        }
        
        // function used to set total pages
        function setUIPages(totalPage) {
        totalPage = Math.max(1, totalPage);
        $("#total-page").text(totalPage)
        }
        
        // update curr page
        function setUICurrPage(currPage) {
        currPage = Math.max(1, currPage);
        $("#curr-page").text(currPage);
        }
        
        // 传入显示的page参数，显示对应页面的图书列表，隐藏其他列表
        function scanAllForShow(page) {
        // page at least 1 or max totalPage
        page = Math.max(1, Math.min(totalPage, page));
            for (var i = 0;i < count;i++) {
                if (parseInt(i / ONE_PAGE_COUNT) + 1 == page)
                    $(dataList[i]).attr("style", "");
                else
                    $(dataList[i]).attr("style", "display: none");
            }
        }
        
        function homePage() {
            currPage = 1;
            scanAllForShow(currPage);
            setUICurrPage(currPage);
        }
        
        function nexePage() {
            var last = currPage;
            if (last == totalPage)
            return;
            
            scanAllForShow(++currPage);
        
            setUICurrPage(currPage);
        }
        
        function prevPage() {
            var next = currPage;
            if (next <= 1) 
            return;
            
            scanAllForShow(--currPage);
            
            setUICurrPage(currPage);
        }
        
        function lastPage() {
            currPage = totalPage;
            scanAllForShow(currPage);
            setUICurrPage(currPage);
        }
        
        function goToPage() {
            var target = $("#goToPage").val();
            if (target == undefined)
            target = currPage;
            target = Math.max(1, Math.min(totalPage, target));
            currPage = target;
            scanAllForShow(target);
            setUICurrPage(currPage);
            $("#goToPage").val("");
        }
        
        // 页面加载完成后调用此函数
        function pageList() {
            dataList = $("#dataList").children();
            count = dataList.length;
            totalPage = parseInt(count / ONE_PAGE_COUNT) + ((count % ONE_PAGE_COUNT) == 0? 0 : 1);
            currPage = 1;
            setUICount(count);
            setUIPages(totalPage);
            setUICurrPage(currPage);
            scanAllForShow(currPage);
            // 注册点击函数
            $("#home").click(homePage);
            $("#prev").click(prevPage);
            $("#next").click(nexePage);
            $("#last").click(lastPage);
            $("#goTo").click(goToPage);
            
            }
            pageList();
        }
});



