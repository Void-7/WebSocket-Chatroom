//1.导入nodejs-websocket包
const ws =require('nodejs-websocket');
const PORT=3000;
const TYPE_ENTER=0;
const TYPE_LEAVE=1;
const TYPE_MSG=2;

//2.创建一个server
//2.1如何处理用户的请求

let count=0;//用户连接数量

//一旦用户连接，函数为当前用户创建一个connect对象
const server = ws.createServer(connect=>{
    console.log('新的连接');
    count++;
    connect.userName=`用户${count}`;
    broadcast(
        {   type:TYPE_ENTER,
            msg:`${connect.userName}进入了聊天室。`,
            time:new Date().toLocaleTimeString()
        });
        connect.on('text',data=>{
        broadcast({   
            type:TYPE_MSG,
            msg:`${connect.userName}:`+data,
            time:new Date().toLocaleTimeString()
        });
    })

    //一旦wb连接断开，close事件触发
    connect.on('close',()=>{
        console.log('连接已断开。');
        count--;
        broadcast({   
            type:TYPE_LEAVE,
            msg:`${connect.userName}离开了聊天室。`,
            time:new Date().toLocaleTimeString()
        });
    })
    //注册一个error处理异常
    connect.on('error',()=>{
        console.log('连接异常。');
    })
})

//broadcast function
function broadcast(msg){
    server.connections.forEach(item=>{
        item.send(JSON.stringify(msg));
    })
}

server.listen(PORT,()=>{
    console.log('websocket服务启动成功，端口监听：'+PORT);
})