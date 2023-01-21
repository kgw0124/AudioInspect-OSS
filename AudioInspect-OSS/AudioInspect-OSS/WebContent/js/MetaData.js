function StandMetaData(file) {
	var form = new FormData();
	var inputFileList = file;
	for (var i = 0; i < inputFileList.length; i++) {
		form.append('uploadFile', inputFileList[i]);
	}
	//정상적으로 form에 저장되었는지 확인
	//for (var key of form.values()) {
	//   console.log(key);
	//}

	$.ajax({
		method: "POST",
		url: '/fileUploadServlet; charset=utf-8',
		dataType: 'text',
		data: form,
		//contentType, processData를 false로 지정하지 않으면 file을 ajax로 전송할 수 없다.
		contentType: false,
		processData: false,
		complete: function(data) {
			dataList = data.responseText.replaceAll("[", "").replaceAll("]", "").split(",")
			getStandMetaDataTreeFromXML(dataList[1])
		},
		error: function(request, status, error) {
			console.log(request.responseText);
			console.log(status.responseText);
			console.log(error.responseText);
			alert("ajax 에러 발생");
			return;
		}
	})
}

function CompMetadata(file) {
	var form = new FormData();
	form.append('uploadFile', file);
	//form.append('uploadFile', file);
	//정상적으로 form에 저장되었는지 확인
	//for (var key of form.keys()) {
	//   console.log(key);
	//}

	$.ajax({
		method: "POST",
		url: '/fileUploadServlet',
		dataType: 'text',
		data: form,
		//contentType, processData를 false로 지정하지 않으면 file을 ajax로 전송할 수 없다.
		contentType: false,
		processData: false,
		complete: function(data) {
			dataList = data.responseText.replaceAll("[", "").replaceAll("]", "").split(",")
			getCompMetaDataTreeFromXML(dataList[0], dataList[1])
			document.getElementById("XMLFileExport").addEventListener("click", function() {
				exportReportXMlCompare(dataList[0], dataList[1])
			}, false);
		},
		error: function(request, status, error) {
			console.log(request.responseText);
			console.log(status.responseText);
			console.log(error.responseText);
			alert("ajax 에러 발생");
			return;
		}
	})
}


function getStandMetaDataTreeFromXML(xml) {
	var standardfile = document.getElementById('standardfile')
	standardfile.value = xml
	//console.log(standardfile.value)
	var result = ""
	var block_info = []
	var data_info = []
	var xml = xml.split("\n")
	for (var i = 10; i < xml.length; i++) { //MediaInfoLib에 대한 정보는 제외하기 위해 index 10부터 시작
		if (xml[i].includes("block") == true) { //block값들
			if (xml[i].includes("</block>") == true) {
				standardfile = '</details>'
				block_info.pop()
				result = result + standardfile
			} else {
				if ($(xml[i]).attr("name") == "Second pass") { //Second pass 블록 이하의 내용은 출력할 필요 없음
					break
				}
				standardfile = '<details id=standard' + i + ' style="margin-left:' + 4 * block_info.length + '%"><summary>' + getBlockIcon(xml[i]) + $(xml[i]).attr('name') + '</summary>'
				block_info.push(i)
				result = result + standardfile
			}
		} else { //data값들
			standardfile = '<tr><td style="border-left: 2px dashed black; padding-left: 5px;">' + $(xml[i]).attr('name') + " :: " + $(xml[i]).text() + '</td></tr>'
			data_info.push(block_info[block_info.length - 1] + "," + standardfile)
		}
	}
	$('#standardfile').append(result)
	for (var i = 0; i < data_info.length; i++) {
		var data = data_info[i].split(",")
		$("details#standard" + data[0]).append(data[1])
	}
}

function getCompMetaDataTreeFromXML(fileName, xml) {
	var fileName = fileName.replaceAll(" ", "").replaceAll(".", "")
	var comparefile = document.getElementById(fileName)
	comparefile.value = xml
	var result = ""
	var block_info = []
	var data_info = []
	var xml = xml.split("\n")
	for (var i = 10; i < xml.length; i++) { //MediaInfoLib에 대한 정보는 제외하기 위해 index 10부터 시작
		if (xml[i].includes("block") == true) { //block값들
			if (xml[i].includes("</block>") == true) {
				comparefile = '</details>'
				block_info.pop()
				result = result + comparefile
			} else {
				if ($(xml[i]).attr("name") == "Second pass") { //Second pass 블록 이하의 내용은 출력할 필요 없음
					break
				}
				comparefile = '<details id=' + fileName + i + ' style="margin-left:' + 4 * block_info.length + '%"><summary>' + getBlockIcon(xml[i]) + $(xml[i]).attr('name') + '</summary>'
				block_info.push(i)
				result = result + comparefile
			}
		} else { //data값들
			comparefile = '<tr><td style="border-left: 2px dashed black;">' + $(xml[i]).attr('name') + " :: " + $(xml[i]).text() + '</td></tr>'
			data_info.push(block_info[block_info.length - 1] + "," + comparefile)
		}
	}
	$("table#" + fileName).append(result)
	for (var i = 0; i < data_info.length; i++) {
		var data = data_info[i].split(",")
		//console.log(data)
		$("details#" + fileName + data[0]).append(data[1])
	}
}

function getBlockIcon(block) {
	blockName = $(block).attr('name')
	if (blockName == "File Type") {
		blockIcon = '<i class="fa-solid fa-file-check"></i>  '
		return blockIcon
	} else if (blockName == "Free space") {
		blockIcon = '<i class="fa-regular fa-cube"></i>  '
		return blockIcon
	} else if (blockName == "File header") {
		blockIcon = '<i class="fa-regular fa-id-card-clip"></i>  '
		return blockIcon
	} else if (blockName == "Data") {
		blockIcon = '<i class="fa-solid fa-database"></i>  '
		return blockIcon
	} else if (blockName == "Header") {
		blockIcon = '<i class="fa-solid fa-tags"></i>  '
		return blockIcon
	} else {
		blockName = blockName.toUpperCase()
		if (blockName.includes("HEADER")) {
			blockIcon = '<i class="fa-solid fa-user"></i>  '
			return blockIcon
		} else if (blockName.includes("DATA")) {
			blockIcon = '<i class="fa-regular fa-block"></i>  '
			return blockIcon
		} else {
			blockIcon = '<i class="fa-solid fa-table"></i>  '
			return blockIcon
		}
	}
}