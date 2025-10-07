import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors()); // 모바일에서 접근 가능하도록 설정

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 모든 출처 허용
    methods: ["GET", "POST"]
  }
});

let attendees = [];

io.on("connection", (socket) => {
  console.log("새 클라이언트 연결됨");

  // 접속 시 현재 출석 인원 전송
  socket.emit("updateAttendees", attendees);

  // 출석 체크 이벤트
  socket.on("checkIn", ({ nickname }) => {
    if (!attendees.includes(nickname)) {
      attendees.push(nickname);
      console.log(`${nickname} 출석 완료`);
      io.emit("updateAttendees", attendees); // 전체 클라이언트에 실시간 전송
    }
  });

  socket.on("disconnect", () => {
    console.log("클라이언트 연결 종료");
  });
});

app.get("/", (req, res) => {
  res.send("✅ 출석 서버 실행 중");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`서버 실행 중 (포트 ${PORT})`));
