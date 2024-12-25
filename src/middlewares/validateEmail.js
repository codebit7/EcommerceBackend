async function validateEmail(req,res, next){
    let {email} = req.body;
    let emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(emailRegex.test(email)){
        next();
    }
    else{
        res.status(400).send({message: "Invalid email"});
    }
}

module.exports = validateEmail