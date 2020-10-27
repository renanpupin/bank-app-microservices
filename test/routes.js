process.env.NODE_ENV = 'test';  //force ENV=test

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

let server = require('../gateway/server.js');

describe('test routes', function() {
    let account1;
    let account2;

    it('should check if test is working', function (done) {
        chai.request(server)
            .get('/api')
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);

                done()
            });
    });

    it('should test create account endpoint', function (done) {
        chai.request(server)
            .post('/api/accounts')
            .send({
                user: +new Date()
            })
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.account).to.not.undefined;

                account1 = res.body.account;

                done()
            });
    });

    it('should test get account endpoint', function (done) {
        chai.request(server)
            .get('/api/accounts/'+account1)
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.account).to.not.undefined;

                done()
            });
    });

    it('should test create account endpoint', function (done) {
        chai.request(server)
            .post('/api/accounts')
            .send({
                user: +new Date()
            })
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.account).to.not.undefined;

                done()
            });
    });
});
