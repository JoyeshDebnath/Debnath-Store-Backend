class ApiFeatures {
	constructor(query, queryStr) {
		this.query = query;
		this.queryStr = queryStr;
	} //constructore of api feature

	search() {
		let keyword = this.queryStr.keyword
			? {
					name: {
						$regex: this.queryStr.keyword,
						$options: "i",
					},
			  }
			: {};
		console.log("expression", keyword);
		this.query = this.query.find({ ...keyword }); //serach by keyuword
		return this;
	} //  ?serach api feature

	filter() {
		const queryCopy = { ...this.queryStr }; //created a copy of original query
		//$NOTE : i used spread opretaor here to copy but not the original firmat ie  const queryCopy=this.queryStr  -->> this is because
		//if we do so then it will create a refernce to original and any changes we do will be reflected in original query also . So inorder to avoid that i used the spread opr\erator to copy the object referb\nce
		const removeFields = ["keyword", "page", "limit"]; //what are the field/Key  we want to remove from the object
		console.log("Befgore removing keys :", queryCopy);
		removeFields.forEach((key) => delete queryCopy[key]); //deleteing all thiosm keys mentioned
		console.log("after removing the keys :", queryCopy);

		//ANCHOR : filter on basisi of price //
		let queryStr = JSON.stringify(queryCopy);
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

		//This.query --->> Product.find()
		this.query = this.query.find(JSON.parse(queryStr)); ///filter by category
		console.log(queryStr);
		return this;
	}
}

module.exports = ApiFeatures;
