const server = require("../server");
const { Like } = require("../models");
const supertest = require("supertest");

jest.mock("../models");

test("GET /api/likes/:postId status 200 test", async () => {
  const res = await supertest(server).get("/api/likes/:postId");
  expect(res.status).toEqual(200);
});

test("GET /api/likeslikes/postId status 404 test", async () => {
  const res = await supertest(server).get("/api/likeslikes/:postId");
  expect(res.status).toEqual(404);
});

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
