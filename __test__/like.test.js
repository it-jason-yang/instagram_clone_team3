const { likeProcess, likeOutPut } = require("../controllers/likes/like-ctrl");
jest.mock("../models");
const { Like } = require("../models");

describe("likeProcess", () => {
  createLikeOne = likeProcess.createLike;
  const req = {
    params: { postId: 1 },
  };
  const res = {
    locals: { userId: "adc" },
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  test("좋아요를 누르면 좋아요되었습니다 라고 해야됨", async () => {
    Like.findOne.mockReturnValue(null);
    await createLikeOne(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      msg: "좋아요 완료",
    });
  });
  test("좋아요를 누른 사람이 또 누르면 좋아요는 한번만 할 수 있습니다라고 알려줘야됨", async () => {
    Like.findOne.mockReturnValue(
      Promise.resolve({
        createLikeOne(userId, postId) {
          return Promise.resolve(true);
        },
      })
    );
    await createLikeOne(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      msg: "좋아요는 한번만 할 수 있습니다",
    });
  });
  test("DB에서 에러발생 시 catch 부분 error 호출", async () => {
    const error = "에러에러";
    Like.findOne.mockReturnValue(Promise.reject(error));
    await createLikeOne(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      msg: "알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요",
    });
  });
});

//연결 주소 test
// describe("api connet test", () => {
//   test("POST /api/likes/:postId status 200 test", async () => {
//     const req = {
//       headers: {
//         authorization:
//           "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNjM0ODEwMjIxfQ.2_5ZIkIVCYRGLktWPy06a6S9-V3t8JCbltmBaBk8vW0",
//       },
//       locals: {},
//     };
//     const res = await supertest(server).post("/api/likes/:postId");
//     expect(res.status).toEqual(200);
//   });

// test("GET /api/likes/:postId status 200 test", async () => {
//   const res = await supertest(server).get("/api/likes/:postId");
//   expect(res.status).toEqual(200);
// });

// test("GET /api/likes/:postId status 200 test", async () => {
//   const res = await supertest(server).delete("/api/likes/:postId");
//   expect(res.status).toEqual(200);
// });

// test("GET /api/likeslikes/postId status 404 test", async () => {
//   const res = await supertest(server).get("/api/likeslikes/:postId");
//   expect(res.status).toEqual(404);
// });
// });

// it("GET /api/likes/:postId 성공 시 status 200", async () => {
//   Like.findAll = jest.fn();
//   const req = {
//     params: {
//       postId: "1",
//     },
//   };
//   const res = await supertest(server).get("/api/likes/:postId");
//   expect(res.status).toBe(200);
//   expect(Like.findAll).toHaveBeenCalledTimes(1);
//   expect(Like.findAll).toHaveLength(0);
// });

// it("post /api/likes/:postId 성공 시 status 200", async () => {
//   const res = await supertest(server)
//     .post("/api/likes/:postId")
//     .send({
//       headers: {
//         authorization:
//           "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiLsmrTsmIHsnpAiLCJpYXQiOjE2MzQ3OTM0NDJ9.cs7ImmFCCdtAWRwHkApN3Gs8sbmMOv-PYi10Lodmxmk",
//       },
//     });
//   expect(res.status).toBe(200);
// });
