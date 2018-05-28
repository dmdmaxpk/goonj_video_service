const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const shortid = require('shortid');

 
// For finding:
// db.inventory.find( { 'sub_category.title': "A" } )


//PATH: categories (TOP LEVEL, only main categories) ADD new option of category
//PATH: categories/weather/ (ALL subcatgories of weather) ADD new subcat

exports.post = async (req, res) => {

	let query = { _id: req.query.catID };
	const { catID } = req.query;
	let postData = req.body;
	postData.added_dtm = new Date();

	let result;
	// Following are the two cases for adding category or subcategory
	// 1- If category is provided then add the subcategory to it
	// URL Sample: /category/add?catID=HJlH-7z1m
	if (catID) {
		result = await Category.update(
			query,
			{ $push : { sub_categories: postData } }
		);
		console.log(`SUB-CATEGORY: "${postData.title}" ADDED to ${catID}!!`);
		res.send(`SUB-CATEGORY: "${postData.title}" ADDED to ${catID}!!`);
	}
	// 2- If no category is provided then add the category
	// URL Sample: /category/add
	else {
		let category = new Category (postData);
		result = await category.save();
		console.log(`CATEGORY: "${postData.title}" ADDED!!`);
		res.send(`CATEGORY: "${postData.title}" ADDED!!`);
	}
	console.log(result);
}


exports.get = async (req, res) => {

	const { catID, subcatID } = req.query;
	let query = {};

	// if (cat) query.title = cat;	
	if (catID) query._id = catID;

	console.log("Query: ", query);
	
	let result;
	// Three cases for finding category and subcategories
	// 1- For finding the subcategory of a category
	// URL Sample: /category/view?catID=S1lVrJ2OAz&subcatID=jds86
	if (subcatID) {
		result = await Category.findOne( query, { sub_categories: { $elemMatch: { _id: subcatID } } } );
		console.log("-----Finding SubCategory");
		res.send(result.sub_categories[0]);
	}
	// 2- For finding just the category and its subcategories by its ID || title
	// URL Sample: /category/view?catID=ahi8a1
	else if (catID) {
		result = await Category.findOne(query); 
		console.log("-----Finding Category");
		res.send(result);
	}
	// 3- If nothing is provided then finding all the categories with their all subcategories
	// URL Sample: /category/view
	else {
		result = await Category.find(query).sort({title:1});	//Sorting by ascending order of the title name 
		console.log("-----Finding All categories with subcategories");
		res.send(result);
	}

}

exports.put = async (req, res) => {

	// 2 use cases: update the category and update the subcat
	// URL Sample: /category/update/S1lVrJ2OAz?subcat=dhas82
	// const { catID } = req.params;
	const { catID, subcatID } = req.query;
	
	let postBody = req.body;
	postBody.last_edited = new Date();
	console.log("Body: ", postBody);

	let result;
	// If subcat is provided then it will update the subcat
	// URL Sample: /category/update/S1lVrJ2OAz?subcatID=jds86
	if (subcatID) {

		// Making data obj for Updating all the values submitted
		var updateData = {};
		for (var prop in postBody) {
			updateData[`sub_categories.$.${prop}`] = postBody[prop];
		}
		console.log(updateData);

		result = await Category.updateOne(
			{ _id: catID, "sub_categories._id": subcatID },	//Finding the _id of cat and the _id of subcat
			updateData		//Updating the whole document of that subcat by new values, $set is default
			// { $set: { "sub_categories.$" : postBody } }		//If we want to replace the whole object, but the id wont be added
		)
		if (result) {
			console.log("SUBCATEGORY UPDATED");
			res.send("SUBCATEGORY UPDATED!!!");
		}
		else{
			console.log("No SubCategory Found!");
			res.send("No SubCategory Found!");
		}
	}
	// If no subcat, update the cat:
	// URL Sample: /category/update/S1lVrJ2O
	else {
		result = await Category.update({ _id: catID }, postBody);
		if (result) {
			console.log("CATEGORY UPDATED");
			res.send("CATEGORY UPDATED!!!");
		}
		else{
			console.log("No Category Found!");
			res.send("No Category Found!");
		}
	}

	
}

exports.delete = async (req, res) => {

	// const { catID } = req.params;
	const { catID, subcatID } = req.query;

	console.log(catID, subcatID);

	let result;
	// If subcat is provided then delete the subcat of a cat
	// URL Sample: /category/update/S1lVrJ2OAz?subca
	if (subcatID) {
		result = await Category.update(
		{_id: catID},
		{ $pull : { sub_categories: { _id: subcatID } }}
		);
		console.log(result); 
		res.send(`Subcategory removed: ${subcatID}`);
	}
	// If no subcat, delete the cat:
	// URL Sample: /category/update/S1lVrJ2O
	else{
		result = await Category.findOneAndRemove( { _id: catID } );
		
		if (result) {
			console.log(`Category Deleted: ${catID}`);
			res.send(`Category Deleted: ${catID}`);
		}
		else{
			console.log("No Category Found!");
			res.send("No Category Found!");
		}
	}
}