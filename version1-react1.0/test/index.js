var superagent = require('superagent')
var expect = require('expect.js')

describe('express rest api server', function(){

  it('post object', function(done){
    superagent.post('http://localhost:3000/api/register')
      .send({ email: '510622610@qq.com',
        psw: '123'
      })
      .end(function(e,res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.eql(1)
        expect(res.body[0]._id.length).to.eql(24)
        id = res.body[0]._id
        done()
      })
  });

  // it('retrieves a collection', function(done){
  //   superagent.get('http://localhost:3000')
  //     .end(function(e, res){
  //       console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(res.body.length).to.be.above(0)
  //       expect(res.body.map(function (item){return item._id})).to.contain(id)
  //       done()
  //     })
  // })

})
