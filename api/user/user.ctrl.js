// let users = [
//     { id:1, name:'kim' },
//     { id:2, name:'won' },
//     { id:3, name:'bae' }
// ];

const User = require('../../models').User;

const index = async (req, res, next) => {
    
    req.query.limit =  req.query.limit || 10;

    const limit = parseInt(req.query.limit, 10);
    if(Number.isNaN(limit)) return res.status(400).end();

    const users = await User.findAll({limit: limit});
    res.json(users);

    // res.json(users.slice(0, limit));
}

const search = async (req, res, next) => {
    
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) return res.status(400).end();

    // const user = users.filter(user => user.id === id)[0];
    
    const user = await User.findOne({where : {id}});
    if(!user) return res.status(404).end();

    res.json(user);
}

const destroy = async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) return res.status(400).end();

    // const user = users.filter(user => user.id !== id);
    const user = await User.destroy({where:{id}});
    res.status(204).end();
}

const create = async (req, res, next) => {
    const name = req.body.name;
    if(!name) return res.status(400).end();

    // const isConflict = users.filter(user=> user.name === name).length;
    // if(isConflict) return res.status(409).end();

    // const id = Date.now();
    // const user = {id, name}
    // users.push(user);

    try{
        const user = await User.create({name});
        res.status(201).json(user);
    }catch(err){
        if(err.name = 'SequelizeUniqueConstraintError'){
            return res.status(409).end();
        }
        res.status(500).end();
    }
}

const update = (req, res, next) => {
    const id = parseInt(req.params.id,10);
    if(Number.isNaN(id)) return res.status(400).end();

    const name = req.body.name;
    if(!name) return res.status(400).end();

    // let isConflict = users.filter(user => user.name === name).length;
    // if(isConflict) return res.status(409).end();

    // const user = users.filter(user => user.id === id)[0];
    // if(!user) return res.status(404).end();

    // user.name = name;

    User.findOne({where:{id}}).then(user => {
        if(!user) return res.status(404).end();
        user.name = name;
        user.save()
        .then(_=>{
            res.json(user);
        })
        .catch(err => {
            if(err.name = 'SequelizeUniqueConstraintError'){
                return res.status(409).end();
            }
            res.status(500).end();
        }) 
    })
    
}

module.exports = {
    index, search, destroy, create, update
}