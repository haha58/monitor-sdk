const express = require("express");
const cors = require("cors"); //用于处理跨域请求的中间件
const bodyParse = require("body-parser"); //用于解析请求体的中间件

const app = express();

//启用CORS（跨源资源共享），允许所有源访问
app.use(cors());

// 解析application/x-www-form-urlencoded请求体
app.use(bodyParse.urlencoded({ extended: false }));
// 解析application/json请求体
app.use(bodyParse.json());
//解析text/plain请求体
app.use(bodyParse.text());

app.post("/reportData", (req, res) => {
  console.log(req.body);
  res.status(200).send("ok");
});

// 启动服务器
app.listen(9800, () => {
  console.log("server is running on 9800");
});
