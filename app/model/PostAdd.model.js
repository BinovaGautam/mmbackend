module.exports = (sequelize, Sequelize) => {
	const PostAdd = sequelize.define('postadd', {
	
		advname: {type: Sequelize.STRING},
		advprice: {type: Sequelize.INTEGER(6)},
    advquant: { type: Sequelize.STRING },
		advdesc: { type: Sequelize.STRING },
		advphone: { type: Sequelize.STRING },
		advcity: { type: Sequelize.STRING },
		advfullname: {type:Sequelize.STRING},
		advcategory:{type:Sequelize.STRING},
		advimgbase: {type: Sequelize.TEXT}, 
		advlocation: {type: Sequelize.TEXT}, 
		advcountry: {type: Sequelize.TEXT}, 
		userId: {type: Sequelize.INTEGER(6)},
		
	});
	
	return PostAdd;
}
