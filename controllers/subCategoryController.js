const mongoose = require('mongoose');
const SubCategory = mongoose.model('SubCategory');

// CREATE
exports.post = async (req, res) => {
	let postData = req.body;

	let subCat = new SubCategory(postData);
	result = await subCat.save();

	console.log(`SubCategory: "${postData.name}" ADDED!!`);
	res.send(`SubCategory: "${postData.name}" ADDED!!`);
}

// READ
exports.get = async (req, res) => {
	const { id, name } = req.query;		// cat_id = SubCategory id, subcat_id = subSubCategory id, cat_name = SubCategory name (provision for searching on SubCategory name)
	let query = {};

	if (id) query._id = id;
	if (name) query.name = name;
	
	if(id || name){
		let result = await SubCategory.findOne(query);
		console.log("-----Finding SubCategory");
		res.send(result);
	}else{
		let result = await SubCategory.find(query).sort({ name: 1 });	//Sorting by ascending order of the name 
		console.log("-----Finding All sub-categories");
		res.send(result);
	}
}