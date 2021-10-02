let chai = require('chai');
let chaiHttp = require('chai-http');
const { response } = require('express');
let server = require('../index');

// Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {
  /**
   * Test the GET route
   */
  describe('GET /api/tasks', () => {
    it('It should GET all the tasks', (done) => {
      chai
        .request(server)
        .get('/api/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eq(3);
        });
      done();
    });

    it('It should not GET all the tasks', (done) => {
      chai
        .request(server)
        .get('/api/task')
        .end((err, res) => {
          res.should.have.status(404);
        });
      done();
    });
  });

  /**
   * Task the GET by id route
   */

  describe('GET /api/tasks/:id', () => {
    it('It should GET a task by ID', (done) => {
      const taskId = 1;
      chai
        .request(server)
        .get('/api/tasks/' + taskId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('completed');
          res.body.should.have.property('id').eq(1);
        });
      done();
    });

    it('It should not GET a task by ID', (done) => {
      const taskId = 123;
      chai
        .request(server)
        .get('/api/tasks/' + taskId)
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eq('The task with the provided ID does not exists.');
        });
      done();
    });
  });

  /**
   * Test the POST route
   */
  describe('POST /api/tasks', () => {
    it('It should POST a new task', (done) => {
      const task = {
        name: 'Task 4',
        completed: false
      };

      chai
        .request(server)
        .post('/api/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(4);
          res.body.should.have.property('name').eq('Task 4');
          res.body.should.have.property('completed').eq(false);
        });
      done();
    });
    it('It should not POST a new task without the name property', (done) => {
      const task = {
        completed: false
      };

      chai
        .request(server)
        .post('/api/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eq('The name should be at least 3 chars long!');
        });
      done();
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('It should update a existing task', (done) => {
      const taskId = 1;
      const task = {
        name: 'Task 1 changed',
        completed: true,
      };
      chai
        .request(server)
        .put('/api/tasks/' + taskId)
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(1);
          res.body.should.have.property('name').eq('Task 1 changed');
          res.body.should.have.property('completed').eq(true);
          done();
        })
    })

    it('It should not update a existing task', (done) => {
      const taskId = 1;
      const task = {
        name: 'Ta',
        completed: true,
      };
      chai
        .request(server)
        .put('/api/tasks/' + taskId)
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eq('The name should be at least 3 char long!');
          done();
        })
    })
  });

  describe('DELETE /api/tasks/:id', () => {
    it('It should delete a existing task', (done) => {
      const taskId = 1;

      chai
        .request(server)
        .delete('/api/tasks/' + taskId)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eq('Task removed successfully');
        });
      done();
    });

    it('It should not delete the existing task', (done) => {
      const taskId = 123;

      chai
        .request(server)
        .delete('/api/tasks/' + taskId)
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eq('The task with the provided ID does not exit')
        })
      done();
    });
  });
});

