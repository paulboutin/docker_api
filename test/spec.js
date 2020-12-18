const fs = require('fs');
const request = require('../app/node_modules/supertest/index');
const helpers = require('../app/helpers');
const app = require('../app/app');

// Test helper functions

// if test dir doesnt exist create it
if (!fs.existsSync('../data/tests/')){
  fs.mkdirSync('../data/tests/');
}

test("write file succeeds", done => {
  helpers.writeFile("some content to test", (data) => {
    try {
      expect(data).toEqual("../data/tests/test.txt");
      done();
    } catch (error) {
      done(error);
    }
  }, "../data/tests/test.txt");
});

test("read file returns a file", done => {
  helpers.readFile((data) => {
    try {
      expect(data).toEqual("some content to test");
      done();
    } catch (error) {
      done(error);
    }
  }, false, "../data/tests/test.txt");
});


// Test API endpoints

describe("POST /hash/tester", () => {
  const expectedResult = 'Success! New tester hash has been pushed to BOTW Server.';
  test("It should respond with 200", async () => {
    const response = await request(app).post("/hash/tester");
    expect(response.statusCode).toBe(200);
    expect((response) => {
      assert.ok(response.text.includes(expectedResult));
    });
  });
});

describe("GET /hash/tester ", () => {
  test("It should respond with 200", async () => {
    const response = await request(app).get("/hash/tester");
    expect(response.statusCode).toBe(200);
    expect((response) => {
      assert.ok(response.text.includes('{}'));
    });
  });
});
