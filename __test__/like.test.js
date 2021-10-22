const { likeProcess, likeOutPut } = require("../controllers/likes/like-ctrl");
jest.mock("../models");
const { Like } = require("../models");

createLikeOne = likeProcess.createLike;
// removeLikeOne = likeProcess.removeLike;
// getLikeAll = likeOutPut.getLike;

//likeProcess testcode
describe("createLikeOne", () => {
  const req = {
    params: { postId: 1 },
  };
  const res = {
    locals: { userId: "adc" },
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  test("좋아요를 누르면 좋아요 완료 라고 해야됨", async () => {
    Like.findOne.mockReturnValue(null);
    await createLikeOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      msg: "좋아요 완료",
    });
  });

  test("좋아요를 누른 사람이 또 누르면 좋아요는 한번만 할 수 있습니다 라고 알려줘야됨", async () => {
    Like.findOne.mockReturnValue(true);
    await createLikeOne(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      msg: "좋아요는 한번만 할 수 있습니다",
    });
  });
  test("좋아요 추가 기능 중 DB에서 에러발생 시(catch로 이동 후 error 호출) 알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요 라고 해야됨", async () => {
    const error = "에러에러";
    Like.findOne.mockReturnValue(Promise.reject(error));
    await createLikeOne(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      msg: "알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요",
    });
  });
});

//removeLikeOne testcode
// describe("removeLikeOne", () => {
//   const req = {
//     params: { postId: 1 },
//   };
//   const res = {
//     locals: { userId: "abc" },
//     status: jest.fn(() => res),
//     send: jest.fn(),
//   };
//   //좋아요 취소
//   test("좋아요를 다시 누르면 좋아요 취소가 되었습니다 라고 해야됨", async () => {
//     Like.findOne.mockReturnValue(true);
//     await removeLikeOne(req, res);
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.send).toHaveBeenCalledWith({
//       msg: "좋아요를 취소 했습니다",
//     });
//   });
//   console.log(res.send);
//   //좋아요 취소
//   test("좋아요를 한적이 없는데 좋아요 취소를 누르게 되면 좋아요를 한 상태에만 가능한 기능입니다. 라고 해야됨", async () => {
//     Like.findOne.mockReturnValue(false);
//     await removeLikeOne(req, res);
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.send).toHaveBeenCalledWith({
//       msg: "좋아요를 한 상태에만 가능한 기능입니다",
//     });
//   });
//   //좋아요 취소
//   test("좋아요 취소 기능 중 DB에서 에러발생 시 catch 부분 error 호출", async () => {
//     const error = "에러에러";
//     Like.findOne.mockReturnValue(Promise.reject(error));
//     await removeLikeOne(req, res);
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith({
//       msg: "알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요",
//     });
//   });
// });

//likeOutPut testcode
// describe("likeOutPut", () => {
//   const req = {
//     params: { postId: 1 },
//   };
//   const res = {
//     status: jest.fn(() => res),
//     send: jest.fn(),
//   };
//   //좋아요 조회
//   test("좋아요가 게시물에 달려있을때 좋아요를 불러오게 되면 좋아요 갯수를 불러왔습니다라고 함", async () => {
//     Like.findAll.mockReturnValue(true);
//     await getLikeAll(req, res);
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.send).toHaveBeenCalledWith({
//       msg: "좋아요 갯수를 불러왔습니다",
//     });
//   });

//   test("좋아요가 게시물에 없을때 좋아요를 불러오게 되면 좋아요를 한 사람이 없습니다라고 함", async () => {
//     Like.findAll.mockReturnValue(false);
//     await getLikeAll(req, res);
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.send).toHaveBeenCalledWith({
//       msg: "좋아요를 한 사람이 없습니다",
//     });
//   });
//   test("좋아요 조회 기능 중 DB에서 에러발생 시 catch 부분 error 호출", async () => {
//     const error = "에러에러!!";
//     Like.findAll.mockReturnValue(Promise.reject(error));
//     await getLikeAll(req, res);
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith({
//       msg: "알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요",
//     });
//   });
// });
