var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var demo = false;

function grid(text) {
	var hash = String(CryptoJS.SHA512(text));
	var out = [];
	for (var i = 0; i < 64; i++) {
		var n = parseInt(hash.substring(i * 2, (i * 2) + 2), 16);
		var pos = n % alphabet.length;
		out.push(alphabet.substring(pos, pos + 1));
	}
	return out;
}

function grid2table(grid, num) {
	var out = "<table id='grid" + num + "' class='grid'>";
	for (var line = 0; line < 8; line++) {
		out += "<tr>";
		for (var col = 0; col < 8; col++) {
			var pos = line * 8 + col
				out += "<td id='grid" + num + "-" + line + col + "' class='cell'>" + grid[pos] + "</td>";
			if (col % 2 == 1 && col < 7) {
				out += "<td class='spacer'><div class='spacer'>&nbsp;</div></td>";
			}
		}
		out += "</tr>";
		if (line % 2 == 1 && line < 7) {
			out += "<tr class='spacer'><td colspan='100'></td></tr>";
		}
	}
	out += "</table>";
	return out;
}

var cache = {};
function grids(salt, identifier) {
	if (cache[salt + "-" + identifier]) {
		return cache[salt + "-" + identifier];
	}
	var pos = 0;
	var out = "<table id='all'>";
	for (var line = 0; line < 3; line++) {
		out += "<tr>";
		for (var col = 0; col < 4; col++) {
			out += "<td>" +
				grid2table(grid(salt + "-" + pos + "-" + identifier), "" + line + col) +
				"</td>";
			pos++;
		}
		out += "</tr>";
	}
	out += "</table>";
	cache[salt + "-" + identifier] = out;
	return out;
}

function refresh() {
	demo = false;
	document.getElementById("grids").innerHTML = grids(
			document.getElementById('salt').value,
			document.getElementById('identifier').value
			);
}

document.onkeydown = function(evt) {
	var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;

	if (keyCode == 13 || keyCode == 9) {
		if (document.activeElement == document.getElementById('salt')) {
			document.getElementById("identifier").focus();
			document.getElementById("identifier").select();
		} else if (document.activeElement == document.getElementById('identifier')) {
			if (keyCode == 13) {
				document.getElementById("identifier").select();
			} else if (keyCode == 9) {
				document.getElementById("salt").focus();
				document.getElementById("salt").select();
			}
			refresh();
		}
		//evt.preventDefault();
		return false;
	}
}

function highlight(id) {
	document.getElementById(id).style.backgroundColor = "#f00";
	setTimeout(function() {document.getElementById(id).style.backgroundColor = "yellow";}, 500);
}

function linePattern() {
	var l = Math.round(Math.random() * 1);
	var c = Math.round(Math.random() * 2);
	var line = Math.round(Math.random() * 7);
	var dt = 500;
	var t = 0;
	for (var p = 0; p < 4; p++) {
		t += dt;
		setTimeout(highlight, t, "grid" + l + c + "-" + line + (p * 2 + 1));
	}
	for (var p = 0; p < 4; p++) {
		t += dt;
		setTimeout(highlight, t, "grid" + l + (c + 1) + "-" + line + (p * 2 + 1));
	}
}

function pattern() {
	// more to come...
	linePattern();
}

function demof() {
	if (demo) {
		document.getElementById("grids").innerHTML = grids(
				"", Math.round(Math.random() * 20));
		setTimeout(function(){ demof(); }, 50);
	}
}
setTimeout(function(){ demof(); }, 50);

function startIntro() {
	var intro = introJs();
	var hl = 0;
	intro.onbeforechange(function(targetElement) {
		if (targetElement.id == "grids" && hl == 0) {
			refresh();
			hl += 1;
		} else if (targetElement.id == "grids" && hl == 1) {
			pattern();
			hl += 1;
		}
	});
	intro.setOptions({
		steps: [
		{ 
			intro: "PasswordGrids will help you generate unique and secure passwords for all your accounts."
		},
		{
			element: '#salt',
			intro: "First, define your unique secret master password.",
			position: 'right'
		},
		{
			element: '#identifier',
			intro: "The identifier represents the account you need a password for. It can be 'facebook', 'gmail', 'myname@gmail.com', ...",
			position: 'right'
		},
		{
			element: '#grids',
			intro: 'These grids are generated based on the master password and the identifier.',
			position: 'right'
		},
		{
			element: '#grids',
			intro: 'You need to pick 8+ characters based on a secret pattern.',
			position: 'right'
		},
		{
			element: '#grids',
			intro: "Prefix them with a special character and a lower case letter like '!a' or '#z'.<br><br>This improves password compatibility.",
			position: 'right'
		},
		{
			intro: "Your password is ready !<br><br>Remember your master password, pattern and prefix.<br><br>See <a href='https://github.com/lleonini/passwordgrids-cli'>documentation</a> for more informations."
		}
		]
	});

	intro.start();
}
