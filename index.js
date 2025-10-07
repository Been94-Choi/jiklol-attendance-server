import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let attendees = [];

io.on("connection", (socket) => {
  console.log("새 클라이언트 연결됨");

  socket.emit("updateAttendees", attendees);

  socket.on("checkIn", ({ nickname }) => {
    if (!attendees.includes(nickname)) {
      attendees.push(nickname);
      console.log(`${nickname} 출석 완료`);
      io.emit("updateAttendees", attendees);
    }
  });

  socket.on("disconnect", () => {
    console.log("클라이언트 연결 종료");
  });
});

app.get("/", (req, res) => {
  res.send("출석 서버가 실행 중입니다!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ 서버 실행 중 (포트 ${PORT})`));
