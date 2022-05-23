


module.exports = (sequelize, DataTypes) => {
	const Category = sequelize.define('category', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		}
	},{
		toJSON() {
			return { ...this.get() }
		}
	});
	return Category;
}