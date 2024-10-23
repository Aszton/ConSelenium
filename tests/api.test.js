import pkg from "pactum";
const { spec } = pkg;
import { expect } from "chai";
import { baseUrl, userID, user, secretPassword } from "../helpers/data.js";
let token;

describe("API tests", () => {
  it.skip("first test", async () => {
    const response = await spec().get(`${baseUrl}/BookStore/v1/Books`);
    expect(response.statusCode).to.eql(200);
    expect(response.body.books[0].title).to.eql("Git Pocket Guide");
  });

  it.skip("create account", async () => {
    const response = await spec().post(`${baseUrl}/Account/v1/User`).withBody({
      userName: user,
      password: secretPassword,
    });
    expect(response.statusCode).to.eql(201);
  });

  it("Generate token", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/GenerateToken`)
      .withBody({
        userName: user,
        password: secretPassword,
      });
    token = response.body.token;
    expect(response.statusCode).to.eql(200);
  });

  it("Get user ID", async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userID}`)
      .withBearerToken(token);
    expect(response.statusCode).to.eql(200);
  });

  it("Add a book", async () => {
    const response = await spec()
    .post(`${baseUrl}/BookStore/v1/Books`)
    .withBearerToken(token)
    .withBody({
        "userId": userID,
        "collectionOfIsbns": [
          {
            "isbn": "9781449325862"
          }
        ]
      })
      expect(response.statusCode).to.eql(201)
  })

  it("Delete all books from user 'Kuczer'", async () => {
    const response = await spec()
      .delete(`${baseUrl}/BookStore/v1/Books?UserId=${userID}`)
      .withBearerToken(token);
    expect(response.statusCode).to.eql(204);
  });

  it("Get User 'Kuczer' and assert empty books list", async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userID}`)
      .withBearerToken(token);
    expect(response.statusCode).to.eql(200);
    expect(response.body.books).to.eql([]);
  });
});
