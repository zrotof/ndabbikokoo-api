checkUserRole = (requiredRole) => {
    return (req, res, next) => {
        const userRoles = req.user.roles.split("|");

        if(!userRoles.includes(requiredRole)){
            return res.status(401).json(
                {
                    success: false,
                    data: null,
                    message: "Vous ne pouvez accéder effectuer cette opération !"
                }
            )
        } 

        next();
    }
}

module.exports = { checkUserRole }