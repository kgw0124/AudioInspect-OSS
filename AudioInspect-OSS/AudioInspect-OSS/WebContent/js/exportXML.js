function exportReportToXML() {
	var comparemethod = document.querySelector(".compare_button.current").value;
	let element = document.createElement('a');
	let xml = "";
	var standardfile = document.getElementById('standardfile')

	if (comparemethod == "XML") {
		xml = standardfile.value;
	}
	else {
		standardfile_result = standardfile.value.split("\n");
		standardfile_result = standardfile.value.replaceAll("\n", "\n<").replaceAll(" ", "").replaceAll(":", ">\n");
		xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + "\n";
		xml += standardfile_result;
	}

	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml));
	element.setAttribute('download', 'audiofile.xml');
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}


function exportReportXMlCompare(fileName, xml) {
	//var fileName = fileName.replaceAll(" ", "").replaceAll(".", "")
	var comparefile = document.getElementById(fileName)
	comparefile.value = xml;
	let xml2 = "";
	var comparemethod = document.querySelector(".compare_button.current").value;
	let element = document.createElement('a');

	//XML인 경우
	if (comparemethod == "XML") {
		//var standardfile_result = standardfile.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("<br>", "\n");
		xml2 = comparefile.value;
	}


	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml2));
	element.setAttribute('download', 'compareAudiofile.xml');
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

