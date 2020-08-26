const mongoose = require('mongoose');
const SubSubCategory = mongoose.model('SubSubCategory');

// CREATE
exports.post = async (req, res) => {
	let SubSubCategory = new SubSubCategory(req.body);
	result = await SubSubCategory.save();

	console.log(`SubSubCategory: "${postData.name}" ADDED!!`);
	res.send(`SubSubCategory: "${postData.name}" ADDED!!`);
}

// READ
exports.get = async (req, res) => {
	const { id, name } = req.query;		// cat_id = SubSubCategory id, subcat_id = subSubSubCategory id, cat_name = SubSubCategory name (provision for searching on SubSubCategory name)
	let query = {};

	if (id) query._id = id;
	if (name) query.name = name;
	
	if(id || name){
		let result = await SubSubCategory.findOne(query);
		console.log("-----Finding SubSubCategory");
		res.send(result);
	}else{
		let result = await SubSubCategory.find(query).sort({ name: 1 });	//Sorting by ascending order of the name 
		console.log("-----Finding All sub-categories");
		res.send(result);
	}
}