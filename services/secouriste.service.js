const Secouriste = require('../models/Secouriste');
async function getSecouristeById(id) {
    const secouriste = await Secouriste.findOne({'_id': id});
    return {
        id: secouriste.id,
        name: secouriste.name,
        lastname: secouriste.lastname,
        email: secouriste.email,
        //phone: Secouriste.phone,
        isAdmin: secouriste.isAdmin,
        age: secouriste.age,
        //certificat: Secouriste.certificat,
        //yearsOfExperience: Secouriste.yearsOfExperience,
        //description: Secouriste.description,
        createdAt: secouriste.createdAt,
        updatedAt: secouriste.updatedAt,
    }
}
module.exports = {
    getSecouristeById
}
