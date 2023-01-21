const standardfilebox = document.getElementById('standardfilebox')
const standardfile = document.getElementById('standardfile')
const track_info_standardfile = [];
const track_info_comparefile = [];

function handleFiles(files) {
	var file = files[0];
	console.log(file);
	const onChangeFile = (mediainfo) => {
		if (file) {
			standardfile.value = 'Working…'

			const getSize = () => file.size

			const readChunk = (chunkSize, offset) =>
				new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = (event) => {
						if (event.target.error) {
							reject(event.target.error)
						}
						resolve(new Uint8Array(event.target.result))
					}
					reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
				})


			mediainfo
				.analyzeData(getSize, readChunk)
				.then((result) => {
					var comparemethod = document.querySelector(".compare_button.current").value;
					standardfile.value = result //이거 삭제하면 안됨!
					const standardfile_result = result.split("\n")
					if (comparemethod == "TEXT") {
						for (var i = 0; i < standardfile_result.length; i++) {
							let standardfile_txt = ''
							standardfile_txt += '<tr><td>' + standardfile_result[i] + '</td></tr>'
							$('#standardfile').append(standardfile_txt)
						}
					} else {
						//범위(1)
						let standardfile = ""
						standardfile = '<details class="standard_General"><summary><i class="fa-regular fa-file"></i> General</summary>'
						$('#standardfile').append(standardfile)
						//범위(2)
						for (var i = 1; i < standardfile_result.length; i++) {
							if (standardfile_result[i] == "Audio") {
								let standardfile = "";
								standardfile = '</details><details class="standard_Audio"><summary><i class="fa-regular fa-file-audio"></i> Audio</summary>'
								$('#standardfile').append(standardfile);
								track_info_standardfile.push(i);
								break;
							} else if (standardfile_result[i] == "") {
								let standardfile = "";
								standardfile = '<tr class="tree_context"><td>' + standardfile_result[i] + '</td></tr>';
								$('details.standard_General').append(standardfile);
							} else {
								let standardfile = "";
								standardfile = '<tr class="tree_context"><td>┗  ' + standardfile_result[i] + '</td></tr>';
								$('details.standard_General').append(standardfile);
							}
						}
						//범위(3)
						for (var i = track_info_standardfile[0] + 1; i < standardfile_result.length; i++) {
							if (standardfile_result[i] != "") {
								let standardfile = "";
								standardfile = '<tr class="tree_context"><td>┗  ' + standardfile_result[i] + '</td></tr>';
								$('details.standard_Audio').append(standardfile);
							} else {
								let standardfile = "";
								standardfile = '<tr class="tree_context"><td>' + standardfile_result[i] + '</td></tr>';
								$('details.standard_Audio').append(standardfile);
							}
						}
					}
				})
				.catch((error) => {
					standardfile.value = `An error occured:\n${error.stack}`
				})
		}
	}

	MediaInfo({ format: "TEXT" }, (mediainfo) => {
		standardfilebox.addEventListener('change', () => onChangeFile(mediainfo))
	})
	MediaInfo({ format: "TEXT" }, (mediainfo) => {
		onChangeFile(mediainfo)
	})
}



function comparehandleFiles(files) {
	//var comparefilebox = document.getElementById("comparefilebox");
	/*
	   async function compareonChangeFile(mediainfo) {
		  for (file of comparefilebox.files) {
			 //console.log(file.name)
			 await comparefile_info(mediainfo, file)
		  }
	   }*/

	async function compareonChangeFile(mediainfo) {
		for (var file of files) {
			await comparefile_info(mediainfo, file)
		}
	}

	const comparefile_info = (mediainfo, file) => {
		console.log(file);
		const filename = file.name.replaceAll(' ','').replaceAll(".", "")
		const comparefile = document.getElementById(filename) //나가는 곳
		if (file) {
			comparefile.value = 'Working…'
			const getSize = () => file.size

			const readChunk = (chunkSize, offset) =>
				new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = (event) => {
						if (event.target.error) {
							reject(event.target.error)
						}
						resolve(new Uint8Array(event.target.result))
					}
					reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
				})

			return mediainfo
				.analyzeData(getSize, readChunk)
				.then((result) => {
					var comparemethod = document.querySelector(".compare_button.current").value;
					comparefile.value = result
					const comparefile_result = result.split('\n')
					if (comparemethod == "TEXT") {
						for (var i = 0; i < comparefile_result.length; i++) {
							let comparefile_txt = ''
							comparefile_txt += '<tr><td>' + comparefile_result[i] + '</td></tr>'
							$('#' + filename).append(comparefile_txt)
						}
					} else {
						//범위(1)
						let comparefile = ""
						comparefile = '<details class="compare_General"><summary><i class="fa-regular fa-file"></i> General</summary>'
						$('#' + filename).append(comparefile)
						//범위(2)
						for (var i = 1; i < comparefile_result.length; i++) {
							if (comparefile_result[i] == "Audio") {
								let comparefile = "";
								comparefile = '</details><details class="compare_Audio"><summary><i class="fa-regular fa-file-audio"></i> Audio</summary>'
								$('#' + filename).append(comparefile);
								track_info_comparefile.push(i);
								break;
							} else if (comparefile_result[i] == "") {
								let comparefile = "";
								comparefile = '<tr class="tree_context"><td>' + comparefile_result[i] + '</td></tr>';
								$('details.compare_General').append(comparefile);
							} else {
								let comparefile = "";
								comparefile = '<tr class="tree_context"><td>┗  ' + comparefile_result[i] + '</td></tr>';
								$('details.compare_General').append(comparefile);
							}
						}
						//범위(3)
						for (var i = track_info_comparefile[0] + 1; i < comparefile_result.length; i++) {
							if (comparefile_result[i] != "") {
								let comparefile = "";
								comparefile = '<tr class="tree_context"><td>┗  ' + comparefile_result[i] + '</td></tr>';
								$('details.compare_Audio').append(comparefile);
							} else {
								let comparefile = "";
								comparefile = '<tr class="tree_context"><td>' + comparefile_result[i] + '</td></tr>';
								$('details.compare_Audio').append(comparefile);
							}
						}
					}
				})
				.catch((error) => {
					comparefile.value = `An error occured:\n${error.stack}`
				})
		}
	}
	/*
	MediaInfo({ format: 'text' }, (mediainfo) => {
	   comparefilebox.addEventListener('change', () => compareonChangeFile(mediainfo))
	})*/
	MediaInfo({ format: 'text' }, (mediainfo) => {
		compareonChangeFile(mediainfo)
	})

}
