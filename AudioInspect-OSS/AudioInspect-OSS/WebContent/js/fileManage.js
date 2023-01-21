var fileList = [];
var $standardfile = document.getElementById("standardfilebox")
var stand = document.getElementById("stand")
var dropZone = document.querySelector("#standardfile")


var toggleClass = function(className) {
	var list = ["dragenter", "dragleave", "dragover", "drop"]

	for (var i = 0; i < list.length; i++) {
		if (className === list[i]) {
			dropZone.classList.add("drop-zone-" + list[i])
		} else {
			dropZone.classList.remove("drop-zone-" + list[i])
		}
	}
}


var standardfilesArr = new Array();
function standard_addFile(files) {
	// 첨부파일 개수 확인
	if (standardfilesArr.length > 0) {
		alert("기준 파일은 최대 1개 까지 첨부 가능합니다.");
	} else {
		for (const file of files) {
			// 첨부파일 검증
			if (validation(file)) {
				// 파일 배열에 담기
				var reader = new FileReader();
				reader.onload = function() {
					standardfilesArr.push(file);

				};
				reader.readAsDataURL(file);

				// 목록 추가
				let standard_name = '';
				standard_name += file.name;
				$('.standard_name').append(standard_name);
				let standard_size = '';
				standard_size += returnFileSize(file.size);
				$('.standard_size').append(standard_size);
				let standard_date = '';
				standard_date += file.lastModifiedDate;
				$('.standard_date').append(standard_date);
				return true;
			} else {
				continue;
			}
		}
	}
	// 초기화
	document.querySelector("input[type=file]").value = "";

}

function standard_deleteFile() {
	standardfilesArr = [];
}

//input 클릭으로 파일 받았을 때
$standardfile.addEventListener("change", function(e) {
	standard_addFile(e.target.files)
	file = this.files;
	dropZone.classList.add("active");
	document.querySelector('#standardfilebox').files = file;

	//semi는 js/SemiMetaData.js의 handleFiles로 return
	//Meta는 js/MetaData.js의 StandMetaData로 return 
	var comparemethod = document.querySelector(".compare_button.current").value;
	if (comparemethod == "XML") {
		return StandMetaData(document.querySelector('#standardfilebox').files);
	}
	else {
		return handleFiles(document.querySelector('#standardfilebox').files);
	}
	//standard_addFile(file);
})

//drag&drop으로 파일 받았을 때
// 드래그한 파일이 최초로 진입했을 때
dropZone.addEventListener("dragenter", function(e) {
	e.stopPropagation()
	e.preventDefault()

	toggleClass("dragenter")
	e.target.style.opacity = 0.3;

})

// 드래그한 파일이 dropZone 영역을 벗어났을 때
dropZone.addEventListener("dragleave", function(e) {
	e.stopPropagation()
	e.preventDefault()
	e.target.style.opacity = 1.0;

	toggleClass("dragleave")

})

// 드래그한 파일이 dropZone 영역에 머물러 있을 때
dropZone.addEventListener("dragover", function(e) {
	e.stopPropagation()
	e.preventDefault()

	toggleClass("dragover")
	e.target.style.opacity = 0.3;

})


// 드래그한 파일이 드랍되었을 때
dropZone.addEventListener("drop", function dragndrop(e) {
	e.preventDefault()
	toggleClass("drop")
	e.target.style.opacity = 1.0;

	var files = e.dataTransfer && e.dataTransfer.files
	$standardfile.files = files
	//semi, meta 모두 일단 standard_addFile로 return함
	return standard_addFile($standardfile.files);
})

dropZone.addEventListener("drop", function dragndrop(e) {
	e.preventDefault()
	toggleClass("drop")

	file = e.dataTransfer && e.dataTransfer.files
	//$("#standardfilebox") = files;
	document.querySelector('#standardfilebox').files = file;

	//semi는 js/SemiMetaData.js의 handleFiles로 return
	//Meta는 js/MetaData.js의 StandMetaData로 return 
	var comparemethod = document.querySelector(".compare_button.current").value;
	if (comparemethod == "XML") {
		return StandMetaData(document.querySelector('#standardfilebox').files);
	}
	else {
		return handleFiles(document.querySelector('#standardfilebox').files);
	}

})



var $comparefile = document.getElementById("comparefilebox")
var comparedropZone = document.querySelector("#compare_context")

var comparetoggleClass = function(className) {

	console.log("current event: " + className)

	var list = ["dragenter", "dragleave", "dragover", "drop"]

	for (var i = 0; i < list.length; i++) {
		if (className === list[i]) {
			comparedropZone.classList.add("drop-zone-" + list[i])
		} else {
			comparedropZone.classList.remove("drop-zone-" + list[i])
		}
	}
}

/* 비교 파일 추가 */
var comparefilesArr = new Array();
var comparefile_numb = 1;
function compare_addFile(files) {
	for (const file of files) {
		if (standardfilesArr.length == 0) {
			alert("기준 파일을 먼저 선택해 주세요");
			$("#comparefilebox").val("");
			document.querySelector("input[type=file]").value = "";
			compare_deleteFile();
		}
		// 첨부파일 검증
		else {
			if (validation(file)) {
				// 파일 배열에 담기
				var reader = new FileReader();
				reader.onload = function() {
					comparefilesArr.push(file);
				};
				reader.readAsDataURL(file);

				$(".removetr").remove();

				if (file.name == files[files.length - 1].name) {
					let compare_infos = '';
					compare_infos = '<tr name = "trStaff" class = "trline" id = "trline">';
					compare_infos += '<td class = "filenum" style="background: lightgrey; font-weight:bold">' + comparefile_numb + '</td>';
					comparefile_numb++;
					compare_name = '';
					compare_name = '<td style="background: lightgrey; font-weight:bold" id = "' + file.name + '">' + file.name + '</td>';
					compare_infos += compare_name;
					compare_infos += '<td style="background: lightgrey; font-weight:bold">' + returnFileSize(file.size) + '</td>';
					compare_infos += '<td style="background: lightgrey; font-weight:bold">' + file.lastModifiedDate + '</td>';
					compare_infos += '</tr>';
					$('#filelisttable_body').append(compare_infos);
				} else {
					let compare_infos = '';
					compare_infos = '<tr name = "trStaff" class = "trline" id = "trline">';
					compare_infos += '<td class = "filenum">' + comparefile_numb + '</td>';
					comparefile_numb++;
					compare_name = '';
					compare_name = '<td id = "' + file.name + '">' + file.name + '</td>';
					compare_infos += compare_name;
					compare_infos += '<td>' + returnFileSize(file.size) + '</td>';
					compare_infos += '<td>' + file.lastModifiedDate + '</td>';
					compare_infos += '</tr>';
					$('#filelisttable_body').append(compare_infos);
				}

				$('ul.compare_tabs li').removeClass('current');
				$('div.compare_context table').removeClass('current');
				//file명에서 .을 제거한 문자열: compare_text에 tabmenu함수가 적용되지 않음을 해결하기 위해
				let filename = file.name.replaceAll(' ','').replaceAll(".", "");
				//탭메뉴 추가
				let compare_tabs = '';
				compare_tabs += '<li id="cpdelete" class="tab-link current" data-tab="' + filename + '">' + file.name + '<button id = "buttonhover" class="buttonhover" name = "tabdelete">X</button></li>';
				$('.compare_tabs').append(compare_tabs);
				//파일 별로 mediainfo 결과창 추가
				let compare_context = '';
				// compare_context += '<textarea id="' + filename + '" class="comparefile">' + file.name + '</textarea>';
				compare_context += '<table id="' + filename + '" class="comparefile current"></table>';
				//tabmenu.js없어져서 getCompareResults.js로 변경
				compare_context += '<script src="js/getCompareResults.js"></script>';
				$('.compare_context').append(compare_context);

				//탭메뉴 파일명 옆 X로 지우기
				$('ul.compare_tabs li').on("click", "button[name=tabdelete]", function() {
					//현재 누른 탭메뉴의 파일명 불러와서 삭제
					//var compare_tabs = $(".tab-link.current").text();
					var compare_tabs_data = $(this).parent();
					compare_tabs_data.remove();
					var t = compare_tabs_data[0].innerText;
					var a = t.replaceAll(' ','').replaceAll('.', '').replaceAll('X', '');
					//tab내용 지우기
					if (compare_tabs_data[0].classList.value == "tab-link current") {
						var compare_context = $(".comparefile.current");
						compare_context.remove();
					}
					else {
						for (var r = 0; r < $(".comparefile").length; r++) {
							var comparefile_del = $(".comparefile")[r];
							if (a == comparefile_del.id) {
								var b = comparefile_del;
								b.remove();
							}
						}

					}

					//탭메뉴의 파일명과 filelist의 파일명이 같은지 확인하고 삭제
					for (var r = 1; r < ($(".trline").length) + 1; r++) {
						var filelist_filename = document.getElementById("filelisttable_body").getElementsByTagName("tr");
						var cell = filelist_filename[r].cells[1].innerText;
						//탭메뉴의 파일명을 text로 불러와서 삭제버튼인 X도 같이 출력되어 filelist에도 X를 붙이고 같은지 확인
						cell += "X";
						if (t == cell) {
							//console.log(filelist_filename);
							//console.log(cell);
							var deletecel = filelist_filename[r].cells[1].parentElement;
							deletecel.remove();
						}

						//result부분 삭제
						$(".resultline").empty();
						$(".resultline_2").empty();
						$(".line").empty();
						//중복 파일 가능 코드
						$("#comparefilebox").val("");
						compare_deleteFile();

					}
					//filelist No. 삭제 시 번호 다시 세기
					for (var i = 0; i < $(".trline").length; i++) {
						$(".trline")[i].cells[0].innerHTML = '<td class = "filenum">' + (i + 1) + '</td>';
					}
					//삭제 후 파일을 다시 넣으려면 comparefile_numb를 바꿔줘야 함
					comparefile_numb = $(".trline").length + 1;

				});

				//current tab 클릭시 filelist에 표시
				$('ul.compare_tabs li').click(function() {
					var compare_tabs = $(".tab-link.current").text();
					for (var r = 1; r < ($(".trline").length) + 1; r++) {
						var filelist_filename = document.getElementById("filelisttable_body").getElementsByTagName("tr");
						var cell = filelist_filename[r].cells[1].innerText;
						//탭메뉴의 파일명을 text로 불러와서 삭제버튼인 X도 같이 출력되어 filelist에도 X를 붙이고 같은지 확인
						cell += "X";
						if (compare_tabs == cell) {
							for (var i = 0; i < 4; i++) {
								//console.log(filelist_filename);
								//console.log(cell);
								var currenttab = filelist_filename[r].cells[i];
								currenttab.style.backgroundColor = "lightgrey";
								currenttab.style.fontWeight = "bold";
							}
						}
						else {
							for (var i = 0; i < 4; i++) {
								var currenttab = filelist_filename[r].cells[i];
								currenttab.style.backgroundColor = "white";
								currenttab.style.fontWeight = "normal";
							}
						}
					}
				})

			} else {
				continue;
			}
		}
	}
	// 초기화
	document.querySelector("input[type=file]").value = "";
}

//input 클릭으로 파일 받았을 때
$comparefile.addEventListener("change", function(e) {
	compare_addFile(e.target.files)
	file = this.files;
	comparedropZone.classList.add("active");
	document.querySelector('#comparefilebox').files = file;

	//semi는 js/SemiMetaData.js의 comparehandleFiles로 return
	//Meta는 js/MetaData.js의 CompMetadata로 return 
	var comparemethod = document.querySelector(".compare_button.current").value;
	if (comparemethod == "XML") {
		for (var i = 0; i < file.length; i++) {
			CompMetadata(file[i]);
		}
	}
	else {
		comparehandleFiles(document.querySelector('#comparefilebox').files);
	}
})


//drag&drop으로 파일 받았을 때
// 드래그한 파일이 최초로 진입했을 때
comparedropZone.addEventListener("dragenter", function(e) {
	e.stopPropagation()
	e.preventDefault()
	comparetoggleClass("dragenter")
	e.target.style.opacity = 0.3;

})
// 드래그한 파일이 dropZone 영역을 벗어났을 때
comparedropZone.addEventListener("dragleave", function(e) {
	e.stopPropagation()
	e.preventDefault()
	comparetoggleClass("dragleave")
	e.target.style.opacity = 1.0;
})
// 드래그한 파일이 dropZone 영역에 머물러 있을 때
comparedropZone.addEventListener("dragover", function(e) {
	e.stopPropagation()
	e.preventDefault()
	comparetoggleClass("dragover")
	e.target.style.opacity = 0.3;
})

comparedropZone.addEventListener("drop", function(e) {
   e.preventDefault()
   toggleClass("drop")
   e.target.style.opacity = 1.0;

   file = e.dataTransfer && e.dataTransfer.files
   //$("#standardfilebox") = files;
   document.querySelector('#comparefilebox').files = file;

	compare_addFile($comparefile.files);
   //semi는 js/SemiMetaData.js의 comparehandleFiles로 return
   //Meta는 js/MetaData.js의 CompMetadata로 return 
   var comparemethod = document.querySelector(".compare_button.current").value;
   if (comparemethod == "XML") {
      for (var i = 0; i < file.length; i++) {
         CompMetadata(file[i]);
      }
   }
   else {
      comparehandleFiles(document.querySelector('#comparefilebox').files);
   }
})

function compare_deleteFile() {
	comparefilesArr = [];
}

function compare_checkDuplicate(obj) {
	for (const file of obj.files) {
		if ($(".trline").length == 0) {
			return true;
		} else {
			for (var r = 1; r < ($(".trline").length) + 1; r++) {
				var filelist_filename = document.getElementById("filelisttable_body").getElementsByTagName("tr");
				var cell = filelist_filename[r].cells[1].innerText;
				if (file.name == cell) {
					alert(file.name + "은 이미 선택하신 비교 파일입니다.");
					return false;
				}
				else {
					continue
				}
			}
			return true;
		}
	}
}

/* 첨부파일 검증 */
function validation(obj) {
	const fileTypes = ['audio/m4a', 'audio/x-m4a'];
	if (obj.name.lastIndexOf('.') == -1) {
		alert("확장자가 없는 파일은 제외되었습니다.");
		return false;
	} else if (!fileTypes.includes(obj.type)) {
		alert("m4a 파일만 첨부 가능합니다.");
		return false;
	} else {
		return true;
	}
}

/* 파일 사이즈 계산 */
function returnFileSize(number) {
	if (number < 1024) {
		return number + 'bytes';
	} else if (number > 1024 && number < 1048576) {
		return (number / 1024).toFixed(1) + 'KB';
	} else if (number > 1048576) {
		return (number / 1048576).toFixed(1) + 'MB';
	}
}

//전체 삭제
$('#reset').click(function() {
	var answer;
	answer = confirm("초기화 하시겠습니까?")
	if (answer == true) {
		$(".standard_name").empty();
		$(".standard_size").empty();
		$("#standardfile").empty();
		$(".standard_date").empty();
		$("#standardfile").val("");
		$('.line').val("");
		$(".resultline").empty();
		$(".resultline_2").empty();
		$(".line").empty();
		standard_deleteFile();

		//추가 코드
		$("#comparefilebox").val("");
		compare_deleteFile();
		//끝

		for (var r = 1; r < ($(".tab-link").length) + 1; r++) {
			$(".tab-link").remove();
		}
		//tab내용 지우기
		var compare_context = $(".comparefile.current");
		compare_context.remove();
		for (var r = 1; r < ($(".trline").length) + 1; r++) {
			$(".trline").remove();
		}
		//삭제 후 파일을 다시 넣으려면 comparefile_numb를 바꿔줘야 함
		comparefile_numb = $(".trline").length + 1;
	}
})