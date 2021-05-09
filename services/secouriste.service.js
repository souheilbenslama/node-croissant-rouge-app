const {Secouriste} = require('../models/Secouriste');
async function getSecouristeById(id) {
    const secouriste = await Secouriste.findOne({'_id': id});
    return {
        id: secouriste.id,
        name: secouriste.name,
        gouvernorat: secouriste.gouvernorat,
        email: secouriste.email,
        phone: secouriste.phone,
        cin:secouriste.cin,
        isAdmin: secouriste.isAdmin,
        age: secouriste.age,
        isActivated:secouriste.isActivated,
        isNormalUser:secouriste.isNormalUser,
        isFree:secouriste.isFree,
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
