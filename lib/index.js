import path from "path";
import Temple from "templejs";
var thispkg = require("./package.json");

export default function(compile) {
	var meta = compile.metadata;
	var p = [ compile.metadata.add("templejs") ];

	if (meta.dependencies[thispkg.name]) {
		var ver = meta.dependencies[thispkg.name];
		meta.remove(thispkg.name);
		p.push(meta.add(thispkg.name + "@" + ver, { dev: true }));
	}

	compile.transform.use(transform);

	return Promise.all(p);
}

function transform(file) {
	if (path.extname(file.path) !== ".html") return;
	file.type = "script";
	file.targets = ["client"];
	file.originalSource = file.source;
	file.source = `var Temple = require("templejs");
module.exports = (function() {
${Temple.compile(file.source)}
}).call(this);
`;
}
