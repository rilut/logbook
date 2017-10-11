module.exports = function (db, DataTypes) {
  const Member = db.define('Member', {
    s_no: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    member_id: { type: DataTypes.STRING },
    family_coding: { type: DataTypes.STRING },
    membership_type: { type: DataTypes.INTEGER },
    firstname: { type: DataTypes.STRING },
    lastname: { type: DataTypes.STRING },
    date_of_birth: { type: DataTypes.DATE },
    membership_status: { type: DataTypes.INTEGER },
    membership_category: { type: DataTypes.INTEGER },
    nric: { type: DataTypes.STRING },
    nric_type: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    contact_no: { type: DataTypes.INTEGER },
    address_1: { type: DataTypes.STRING },
    address_2: { type: DataTypes.STRING },
    address_3: { type: DataTypes.STRING },
    address_4: { type: DataTypes.STRING },
    address_5: { type: DataTypes.STRING },
    postal_code: { type: DataTypes.INTEGER },
    joindate: { type: DataTypes.DATE },
    age: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.ENUM('male', 'female') },
    expiry_date: { type: DataTypes.DATE },
    membership_fee: { type: DataTypes.FLOAT },
    staff_id: { type: DataTypes.STRING },
    spstudent_id: { type: DataTypes.STRING },
    corporate_staff: { type: DataTypes.STRING },
    photo_path: { type: DataTypes.STRING },
    checkin_status: { type: DataTypes.INTEGER },
    exco_status: { type: DataTypes.INTEGER }
  }, {
      tableName: 'member_list',
      timestamps: false
    });

  return Member;
};
