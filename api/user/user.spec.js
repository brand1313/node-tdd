const app = require('../../app');
const request = require('supertest');
const should = require('should');
const models = require('../../models')

describe('GET /users',() => {
    describe('성공 시', () => {
        const users = [
            {name:'kim'},
            {name:'won'},
            {name:'bae'}
        ];
        before(() => models.sequelize.sync({force: true}));
        before(() => models.User.bulkCreate(users))
        it('유저들의 객체를 반환한다.',(done)=>{
            request(app)
                .get('/users')
                .end((err, res)=>{
                    res.body.should.be.instanceOf(Array);
                    done();
                })
        });

        it('최대 limit 갯수만큼 응답한다.',(done)=>{
            request(app)
                .get('/users?limit=2')
                .end((err, res)=>{
                    res.body.should.have.lengthOf(2);
                    done();
                })
        });
    });

    describe('실패 시',() => {
        it('limit이 숫자형이 아니면 400을 응답한다.',(done)=>{
            request(app)
                .get('/users?limit=two')
                .expect(400)
                .end(done);
        })
    })
});

describe('GET /users/:id',() => {
    const users = [
        {name:'kim'},
        {name:'won'},
        {name:'bae'}
    ];
    before(() => models.sequelize.sync({force: true}));
    before(() => models.User.bulkCreate(users))

    describe('성공 시',() => {
        it('id가 1인 유저 객체를 반환한다.', (done)=>{
            request(app)   
                .get('/users/1')
                .end((err, res) => {
                    res.body.should.have.property('id', 1);
                    done();
                });
        })
    });

    describe('실패 시',() => {
        it('id가 숫자형이 아닐 경우 400으로 응답한다.', done => {
            request(app)   
                .get('/users/one')
                .expect(400)
                .end(done);
        });

        it('id로 유저를 찾을 수 없을 경우 404로 응답한다. ', done=>{
            request(app)
                .get('/users/999')
                .expect(404)
                .end(done)
        })
    })
});

describe('DELETE /users/:id', () => {
    const users = [
        {name:'kim'},
        {name:'won'},
        {name:'bae'}
    ];
    before(() => models.sequelize.sync({force: true}));
    before(() => models.User.bulkCreate(users))

    describe('성공 시', () => {
        it('204를 반환한다.',(done)=>{
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done);
        });
    })

    describe('실패 시', () => {
        it('id가 숫자형이 아닐 경우',(done)=>{
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done);
        });
    })
});

describe('POST /user',() => {

    const users = [
        {name:'kim'},
        {name:'won'},
        {name:'bae'}
    ];
    before(() => models.sequelize.sync({force: true}));
    before(() => models.User.bulkCreate(users))

    describe('성공 시',()=> {
        let name='hong';
        let body;
        before(done => {
            request(app)
                .post('/users')
                .send({name})
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                })
        })
        
        it('생성된 유저 객체를 반환한다.', done=>{
            body.should.have.property('id');
            done();
        });

        it('입력한 name을 반환한다.', done => {
            body.should.have.property('name', name);
            done();
        })
    })

    describe('실패 시',()=> {
        it('name 파라미터 누락시 400을 반환한다.', done=>{
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done);
        });
        it('name이 중복일 경우 409를 반환한다.', done => {
            request(app)
                .post('/users')
                .send({name : 'bae'})
                .expect(409)
                .end(done);
        });
    });

});


describe.only('PUT /user/:id', () => {
    const users = [
        {name:'kim'},
        {name:'won'},
        {name:'bae'}
    ];
    before(() => models.sequelize.sync({force: true}));
    before(() => models.User.bulkCreate(users))
    
    describe('성공 시',() => {
        it('변경된 name을 응답한다.',done=>{
            let name = "park";
            request(app)
                .put('/users/3')
                .send({name})
                .end((err, res) => {
                    res.body.should.have.property('name',name);
                    done();
                });
        })
    })

    describe('실패 시',() => {
        it('정수가 아닌 경우 id일 경우 400을 응답한다.',done=>{
            request(app)
                .put('/users/one')
                .send({name:'choi'})
                .expect(400)
                .end(done);
        });
        it('name이 없을 경우 400을 응답한다.', done => {
            request(app)
                .put('/users/1')
                .send({})
                .expect(400)
                .end(done);
        });
        it('없는 유저일 경우 404를 응답한다.', done=>{
            request(app)
                .put('/users/999')
                .send({name:'bae'})
                .expect(404)
                .end(done);
        });
        it('이름이 중복일 경우 409를 응답한다.', done=>{
            request(app)
                .put('/users/1')
                .send({name:'won'})
                .expect(409)
                .end(done);
        })
    })
})


