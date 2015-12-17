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

function grid2table(grid) {
	var out = "<table class='grid'>";
	for (var line = 0; line < 8; line++) {
		out += "<tr>";
		for (var col = 0; col < 8; col++) {
			var pos = line * 8 + col
				out += "<td class='cell'>" + grid[pos] + "</td>";
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
			out += "<td>" + grid2table(grid(salt + "-" + pos + "-" + identifier)) + "</td>";
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
	intro.onbeforechange(function(targetElement) {
		if (targetElement.id == "grids") {
			refresh();
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
			position: 'top'
		},
		{
			element: '#grids',
			intro: 'You need to pick 8+ chars in this grids based on your secret pattern.',
			position: 'top'
		},
		{
			intro: "Prefix your password with a special character and a lower case letter ('!a', '#z', ...).<br> This improves password compatibility."
		},
		{
			intro: "Your password is ready. Just remember your master password, pattern and prefix."
		},
		{
			intro: "That's all !<br>You can save this page and use it offline.<br>See <a href='https://github.com/lleonini/passwordgrids-cli'>documentation</a> for more informations/"
		}
		]
	});

	intro.start();
}
