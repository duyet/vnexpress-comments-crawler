const fs = require('fs');
var data = './data/';

comments = [];
okmen = function (data) {
	items = data.data.items;
	comments = comments.concat(items);
	for (var i in items) {
		if (items[i].replys && items[i].replys.items) {
			comments = comments.concat(items[i].replys.items);
		}
	}
}

fs.readdirSync(data).forEach(file => {
	require(data + file);
})

comment_data = []
comments.forEach(c => {
	comment_data.push({
		comment_id: c.comment_id,
		content: c.content,
		userlike: c.userlike,
		label: -1
	})
})

console.log("Collected: ", comment_data.length);


// Write
const fields = Object.keys(comment_data[0]);
dataToWrite = "";

row = [];
for (var f of fields) {
	row.push('"' + f + '"');
}
dataToWrite += row.join(", ") + "\n";
comment_data.forEach(c => {
	row = [];
	for (var f of fields) {
		var cell = "" + c[f];
		cell = cell.split('"').join('\\"');
		row.push('"' + cell + '"');
	}
	dataToWrite += row.join(", ") + "\n";
})


fs.writeFile('comments.csv', dataToWrite, 'utf8', function (err) {
  if (err) {
    console.log('Some error occured - file either not saved or corrupted file saved.');
  } else{
    console.log('It\'s saved!');
  }
});