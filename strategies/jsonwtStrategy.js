const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Secouriste = mongoose.model("Secouriste");
const myKey = require("../mysetup/myurl");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myKey.secret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Secouriste.findById(jwt_payload.id)
        .then(person => {
          if (person) {
            return done(null, person);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
