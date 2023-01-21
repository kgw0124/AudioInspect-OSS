$(document).ready(function() {
	$('.compare_button').click(function() {
		$('.compare_button').removeClass('current');
		$(this).addClass('current');
	})
})

$(document).ready(function() {
	var difference_index_standardfile = []; //기준 파일의 차이 속성 인덱스 저장
	var difference_index_comparefile = []; //비교 파일의 차이 속성 인덱스 저장
	var track_info_standardfile = []; //기준 파일의 트랙 정보(General, Audio) 속성 인덱스 저장
	var track_info_comparefile = []; //비교 파일의 트랙 정보(General, Audio) 속성 인덱스 저장
	$('div.compare_method input').click(function getCompareResult() {
		//standard 파일과 이전에 선택한 compare 파일과의 비교 결과를 삭제
		$(".resultline").empty();
		$(".resultline_2").empty();
		$(".line").empty();

		var standardfile = $('#standardfile').val();
		var current_comparefile_name = $('.tab-link.current ').text().replaceAll(' ','').replaceAll('.', '').replaceAll('X', ''); //탭메뉴 이용을 위한 비교 파일 이름
		var current_output_comparefile_name = $('.tab-link.current ').text().replaceAll('X', ''); //화면에 뜨는 비교 파일 이름
		var comparefile = $('#' + current_comparefile_name).val();
		var tab_id = $(".tab-link.current").text().replaceAll(' ','').replaceAll('.', '').replaceAll('X', '');
		var standardfileArr = standardfile.split("\n");
		var comparefileArr = comparefile.split("\n");
		var copy_standardfileArr = standardfile.split("\n");
		var copy_comparefileArr = comparefile.split("\n");
		var comparemethod = document.querySelector(".compare_button.current").value;
		var standardfile_name = document.querySelector('td.standard_name').innerHTML;

		//standardfile과 comparefile의 차이점 출력
		var i;
		var j;
		//standardfile의 mediainfo 정보가 comparefile보다 많을 때
		if (standardfileArr.length > comparefileArr.length) {
			difference_index_standardfile = [];//difference_index_standardfile 초기화
			difference_index_comparefile = []//difference_index_comparefile 초기화
			for (i = 0; i < standardfileArr.length; i++) {
				var slash = standardfileArr[i].indexOf(':');
				var search_standard_name = standardfileArr[i].substring(0, slash);
				for (j = 0; j < comparefileArr.length; j++) {
					//standardfileArr[i]의 정보가 General, Audio, ""(공백)인 경우, comparefileArr[j]의 정보가 ""(공백)인 경우 비교하지 않는다.
					if (standardfileArr[i] == "General" || standardfileArr[i] == "Audio" || standardfileArr[i] == "" || comparefile[j] == "") {
						break;
					} else {
						var compare_slash = comparefileArr[j].indexOf(':');
						var search_compare_name = comparefileArr[j].substring(0, compare_slash);
						//standardfileArr[i]와 comparefileArr[j]의 문자열에서 ':' 이전의 내용이 같아야지 비교 실행
						if (search_standard_name == search_compare_name) {
							//이제는 ':' 뒤의 내용을 비교하는데 이때 두 내용이 다른 경우
							if (standardfileArr[i].substring(slash + 1) != comparefileArr[j].substring(compare_slash + 1)) {
								let resultline = '';
								resultline = '<tr><td class = "compareresult">' + search_standard_name + ' 속성이 일치하지 않습니다.</td></tr>';
								$('.resultline').append(resultline);
								standardfileArr[i] = "";
								comparefileArr[j] = ""; //comparefileArr[j]의 내용을 공백으로 바꿈: General과 Audio에 같은 속성이 존재하기 때문
								difference_index_standardfile.push(i); //standardfile과 comparefile의 차이점의 인덱스를 저장
								difference_index_comparefile.push(j); //standardfile과 comparefile의 차이점의 인덱스를 저장
								break
								//이제는 ':' 뒤의 내용을 비교하는데 이때 두 내용이 같은 경우
							} else {
								standardfileArr[i] = "";
								comparefileArr[j] = "";
								break
							}
							//standardfileArr[i]와 comparefileArr[j]의 문자열에서 ':' 이전의 내용이 달라 비교 실행 X
						} else {
							continue
						}
					}
				}
			}
			//comparefile의 mediainfo 정보가 standardfile보다 많을 때
		} else {
			difference_index_standardfile = [];//difference_index_standardfile 초기화
			difference_index_comparefile = []//difference_index_comparefile 초기화
			for (i = 0; i < comparefileArr.length; i++) {
				var slash = comparefileArr[i].indexOf(':');
				var search_compare_name = comparefileArr[i].substring(0, slash);
				for (j = 0; j < standardfileArr.length; j++) {
					if (comparefileArr[i] == "General" || comparefileArr[i] == "Audio" || comparefileArr[i] == "" || standardfile[j] == "") {
						break;
					} else {
						var standard_slash = standardfileArr[j].indexOf(':');
						var search_standard_name = standardfileArr[j].substring(0, standard_slash);
						if (search_compare_name == search_standard_name) {
							if (comparefileArr[i].substring(slash + 1) != standardfileArr[j].substring(standard_slash + 1)) {
								let resultline = '';
								resultline = '<tr><td class = "compareresult">' + search_standard_name + ' 속성이 일치하지 않습니다.</td></tr>';
								$('.resultline').append(resultline);
								comparefileArr[i] = "";
								standardfileArr[j] = "";
								difference_index_comparefile.push(i); //standardfile과 comparefile의 차이점의 인덱스를 저장
								difference_index_standardfile.push(j); //standardfile과 comparefile의 차이점의 인덱스를 저장
								break
							} else {
								comparefileArr[i] = "";
								standardfileArr[j] = "";
								break
							}
						} else {
							continue
						}
					}
				}
			}
		}

		//standardfile, comparefile 둘 중 하나만 가지고 있는 속성값 출력
		for (i = 0; i < standardfileArr.length; i++) {
			if (tab_id == "compare_basic") {
				break
			} else {
				if (standardfileArr[i] == "General" || standardfileArr[i] == "") {
					continue
				} else if (standardfileArr[i] == "Audio") {
					track_info_standardfile = [];
					track_info_standardfile.push(i);
					continue
				} else {
					let resultline_2 = '';
					resultline_2 = '<tr><td class = "compareresult">' + standardfileArr[i] + ' 속성이 "' + standardfile_name + '"에만 존재합니다. </td></tr>';
					$('.resultline_2').append(resultline_2);
					difference_index_standardfile.push(i); //standardfile과 comparefile의 차이점의 인덱스를 저장
				}
			}
		}

		for (j = 0; j < comparefileArr.length; j++) {
			if (tab_id == "compare_basic") {
				break
			} else {
				if (comparefileArr[j] == "General" || comparefileArr[j] == "") {
					continue
				} else if (comparefileArr[j] == "Audio") {
					track_info_comparefile = [];
					track_info_comparefile.push(j);
					continue
				} else {
					let resultline_2 = '';
					resultline_2 = '<tr><td class = "compareresult">' + comparefileArr[j] + ' 속성이 "' + current_output_comparefile_name + '"에만 존재합니다. </td></tr>';
					$('.resultline_2').append(resultline_2);
					difference_index_comparefile.push(j);
				}
			}
		}

		//기준파일, 비교파일의 mediainfo 정보칸에 출력
		if (comparemethod == "TEXT") { //출력 방식이 TEXT인 경우
			//standardfile과 comparefile의 mediainfo 결과창에 차이점을 빨간색으로 출력
			var x;
			if (tab_id == "compare_basic") {
				stop
			} else {
				$('#standardfile').empty();
				for (x = 0; x < copy_standardfileArr.length; x++) {
					if (difference_index_standardfile.includes(x) == true) { //standardfile과 comparefile이 차이를 가지는 속성 인덱스
						let standardfile = "";
						standardfile = '<tr><td class = "filehover" style="color:red">' + copy_standardfileArr[x] + '</td></tr>';
						$('#standardfile').append(standardfile);
					} else { //standardfile과 comparefile이 차이를 가지지 않는 속성 인덱스
						let standardfile = "";
						standardfile = '<tr><td class = "filehover">' + copy_standardfileArr[x] + '</td></tr>';
						$('#standardfile').append(standardfile);
					}
				}
			}
			var z;
			$('#' + tab_id).empty();
			for (z = 0; z < copy_comparefileArr.length; z++) {
				if (tab_id == "compare_basic") {
					continue
				} else {
					if (difference_index_comparefile.includes(z) == true) { //standardfile과 comparefile이 차이를 가지는 속성 인덱스
						let comparefile = "";
						comparefile = '<tr><td style="color:red" class = "filehover">' + copy_comparefileArr[z] + '</td></tr>';
						$('#' + tab_id).append(comparefile);
					} else { //standardfile과 comparefile이 차이를 가지지 않는 속성 인덱스
						let comparefile = "";
						comparefile = '<tr><td class = "filehover">' + copy_comparefileArr[z] + '</td></tr>';
						$('#' + tab_id).append(comparefile);
					}
				}
			}
		} else { //출력 방식이 TREE인 경우
			var x;
			if (tab_id == "compare_basic") {
				stop
			} else {
				$('#standardfile').empty();
				//범위(1)
				var standardfile = "";
				standardfile = '<details class="standard_General"><summary><i class="fa-regular fa-file"></i> General</summary>'
				$('#standardfile').append(standardfile);
				//범위(2)
				for (x = 1; x < track_info_standardfile[0]; x++) {
					if (difference_index_standardfile.includes(x) == true) { //standardfile과 comparefile이 차이를 가지는 속성 인덱스
						var standardfile = "";
						standardfile = '<tr class="tree_context"><td style="color:red">┗  <i class="fa-solid fa-triangle-exclamation style="color:red"></i> ' + copy_standardfileArr[x] + '</td></tr>';
						$('details.standard_General').append(standardfile);
					} else if (copy_standardfileArr[x] == "") {
						var standardfile = "";
						standardfile = '<tr class="tree_context"><td>' + copy_standardfileArr[x] + '</td></tr>';
						$('details.standard_General').append(standardfile);
					} else { //standardfile과 comparefile이 차이를 가지지 않는 속성 인덱스
						var standardfile = "";
						standardfile = '<tr class="tree_context"><td>┗  ' + copy_standardfileArr[x] + '</td></tr>';
						$('details.standard_General').append(standardfile);
					}
				}
				//범위(3)
				var standardfile = "";
				standardfile = '</details><details class="standard_Audio"><summary><i class="fa-regular fa-file-audio"></i> Audio</summary>'
				$('#standardfile').append(standardfile);
				//범위(4)
				for (x = track_info_standardfile[0] + 1; x < copy_standardfileArr.length; x++) {
					if (difference_index_standardfile.includes(x) == true) { //standardfile과 comparefile이 차이를 가지는 속성 인덱스
						var standardfile = "";
						standardfile = '<tr class="tree_context"><td style="color:red">┗  <i class="fa-solid fa-triangle-exclamation style="color:red"></i> ' + copy_standardfileArr[x] + '</td></tr>';
						$('details.standard_Audio').append(standardfile);
					} else if (copy_standardfileArr[x] == "") {
						var standardfile = "";
						standardfile = '<tr class="tree_context"><td>' + copy_standardfileArr[x] + '</td></tr>';
						$('details.standard_Audio').append(standardfile);
					} else { //standardfile과 comparefile이 차이를 가지지 않는 속성 인덱스
						var standardfile = "";
						standardfile = '<tr class="tree_context"><td>┗  ' + copy_standardfileArr[x] + '</td></tr>';
						$('details.standard_Audio').append(standardfile);
					}
				}
			}
			var z;
			$('#' + tab_id).empty();
			for (z = 0; z < copy_comparefileArr.length; z++) {
				if (tab_id == "compare_basic") {
					continue
				} else {
					//범위(1)
					var comparefile = "";
					comparefile = '<details class="compare_General"><summary><i class="fa-regular fa-file"></i> General</summary>';
					$('#' + tab_id).append(comparefile);
					//범위(2)
					for (z = 1; z < track_info_comparefile[0]; z++) {
						if (difference_index_comparefile.includes(z) == true) { //standardfile과 comparefile이 차이를 가지는 속성 인덱스
							var comparefile = "";
							comparefile = '<tr class="tree_context"><td style="color:red">┗  <i class="fa-solid fa-triangle-exclamation style="color:red"></i> ' + copy_comparefileArr[z] + '</td></tr>';
							$('details.compare_General').append(comparefile);
						} else if (copy_comparefileArr[z] == "") {
							var comparefile = "";
							comparefile = '<tr class="tree_context"><td>' + copy_comparefileArr[z] + '</td></tr>';
							$('details.compare_General').append(comparefile);
						} else { //standardfile과 comparefile이 차이를 가지지 않는 속성 인덱스
							var comparefile = "";
							comparefile = '<tr class="tree_context"><td>┗  ' + copy_comparefileArr[z] + '</td></tr>';
							$('details.compare_General').append(comparefile);
						}
					}
					//범위(3)
					var comparefile = "";
					comparefile = '</details><details class="compare_Audio"><summary><i class="fa-regular fa-file-audio"></i> Audio</summary>'
					$('#' + tab_id).append(comparefile);
					//범위(4)
					for (z = track_info_comparefile[0] + 1; z < copy_comparefileArr.length; z++) {
						if (difference_index_comparefile.includes(z) == true) { //standardfile과 comparefile이 차이를 가지는 속성 인덱스
							let comparefile = "";
							comparefile = '<tr class="tree_context"><td style="color:red">┗  <i class="fa-solid fa-triangle-exclamation style="color:red"></i> ' + copy_comparefileArr[z] + '</td></tr>';
							$('details.compare_Audio').append(comparefile);
						} else if (copy_comparefileArr[z] == "") {
							let comparefile = "";
							comparefile = '<tr class="tree_context"><td>' + copy_comparefileArr[z] + '</td></tr>';
							$('details.compare_Audio').append(comparefile);
						} else { //standardfile과 comparefile이 차이를 가지지 않는 속성 인덱스
							let comparefile = "";
							comparefile = '<tr class="tree_context"><td>┗  ' + copy_comparefileArr[z] + '</td></tr>';
							$('details.compare_Audio').append(comparefile);
						}
					}
				}
			}
		}

		// "(기준 파일명)과 (비교 파일명)은 일치합니다/ 일치하지 않습니다." 출력
		var standard_compare_difference = $('.resultline').text();
		var standard_compare_difference_2 = $('.resultline_2').text();
		if (tab_id == "compare_basic") {
			stop
		} else {
			if (standard_compare_difference == '' && standard_compare_difference_2 == '') {
				let line = '';
				line = standardfile_name + ' 와( ' + current_output_comparefile_name + ' 는 일치합니다.';
				$('.line').append(line);
			} else {
				let line = '';
				line = standardfile_name + ' 와 ' + current_output_comparefile_name + ' 는 일치하지 않습니다.';
				$('.line').append(line);
			}
		}
	})
})