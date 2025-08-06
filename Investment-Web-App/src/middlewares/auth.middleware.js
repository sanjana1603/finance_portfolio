function auth(req,res,next){
    if(!req.body) req.body = {};
    req.body.userId = 1;
    next();
}

module.exports = auth;