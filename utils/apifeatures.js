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
	} //filter ..

	pagination(resultsPerPage) {
		const currentPage = Number(this.queryStr.page) || 1;
		//Now suppose theree are 50 items and on 1 page we want to show 10 items ..
		//then we need to skip some items based on that . Suppose if the current page we are looking for is 1
		//then 0 pages will be skipped and  we will show 10 items . If the current page we are looking for is 2 then we need to skip 1st 10 items  and so on ..
		const skipped = resultsPerPage * (currentPage - 1); //how many items to be skipped /..
		this.query = this.query.limit(resultsPerPage).skip(skipped);
		return this;
	} //pagination  ..
}

module.exports = ApiFeatures;
