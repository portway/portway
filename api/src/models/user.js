export default function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    }
  })

  // force: true will drop the table if it already exists
  User.sync({ force: true }).then(() => {
    // Table created
    return User.create({
      firstName: 'John',
      lastName: 'Hancock'
    })
  })


  return User
}