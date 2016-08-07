"use strict";

var chai    = require('chai');
var R       = require('ramda');
var request = require('supertest');
var rewire  = require('rewire');

var agent = request(rewire('../../lib/server'));

chai.should();

describe('Users', function () {

  var userId = null;

  before(function (done) {
    var email = "test" + (Math.random() + 1).toString(36).substring(7) + "@user.com";
    agent
      .post('/api/users')
      .send({'email': email})
      .expect(function (res) {
        userId = res.body._id;
      })
      .end(done);
  });

  after(function (done) {
    done();
  });

  it('Should get a 404 response', function (done) {

    agent
      .get('/api/users/57a75a7ec8152dc3c536513e')
      .expect(404)
      .end(done);
  });

  it('Should fail with validation error when no email has been provided', function (done) {

    agent
      .post('/api/users')
      .expect(400)
      .end(done);
  });

  it('Should fail with validation error when invalid email provided', function (done) {

    agent
      .post('/api/users')
      .send({'email': "invalid"})
      .expect(400)
      .end(done);
  });

  it('Should create a valid user', function (done) {

    var email = "test" + (Math.random() + 1).toString(36).substring(7) + "@user.com";
    agent
      .post('/api/users')
      .send({'email': email})
      .expect(201)
      .expect(function (res) {
        res.body.should.contain.all.keys(['email', '_id']);
      })
      .end(done);
  });

  it('Should get a status 200 response with a valid user', function (done) {

    agent
      .get('/api/users/' + userId)
      .expect(200)
      .expect(function (res) {
        res.body.should.contain.all.keys(['email', '_id']);
      })
      .end(done);
  });
});
