<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<link rel="stylesheet" href="style.css">
<link rel="shortcut icon" href="#">
<!-- 엑셀 파일 내보내기 -->
<script	src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.3/xlsx.full.min.js"></script>
<script	src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://kit.fontawesome.com/a4a9a94dd2.js" crossorigin="anonymous"></script>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 반응형 웹페이지 -->
<title>AudioInspect</title>
</head>
<body>
	<h1>AudioInspect</h1>

	<div class="compare_method">
		<span>비교 형식</span> <input type="button" class="compare_button current"
			value="TEXT"> <input type="button" class="compare_button"
			value="TREE"> <input type="button" class="compare_button"
			value="XML">
	</div>
	<table id="summary">
		<tr>
			<td class="line"></td>
		</tr>
	</table>
	<div class="whole" style="height: 50%;">
		<div id="standardfiletotal">
			<ul class="tabs">
				<li class="tab-link1" data-tab="standardfile">
					<form id="uploadfile">
						<input type="file" id="standardfilebox" style="display: none;" accept=".m4a">
					</form>
	               <label class="standardtablaebl" for="standardfilebox">기준 파일	<button class="stbtn">X</button></label>
					</li>
			</ul>
			<div id="standardfile_scroll" ondblclick="dbclick()">
				<table id="standardfile"></table>
			</div>
		</div>

		<div id="comparefiletotal">
			<ul class="compare_tabs">
				<li class="compare_basic_tab-link current" data-tab="compare_basic">
					<input type="file" id="comparefilebox" style="display: none;" multiple="multiple" accept=".m4a">
	               <label for="comparefilebox">+</label>
	             </li>
			</ul>
			<div class="compare_context" id="compare_context"
				ondblclick="dbclick()">
				<table id="compare_basic" class="comparefile current"></table>
			</div>
		</div>
		<script>
      <!-- 동시 스크롤 기능 -->
         function dbclick() {
            var $divs = $('#standardfile_scroll, #compare_context');
            var sync = function(e) {
               var $other = $divs.not(this).off('scroll'), other = $other
                     .get(0);
               var percentage = this.scrollTop
                     / (this.scrollHeight - this.offsetHeight);
               other.scrollTop = percentage
                     * (other.scrollHeight - other.offsetHeight);
               setTimeout(function() {
                  $other.on('scroll', sync);
               }, 10);
            }
            $divs.on('scroll', sync);
         }
      </script>
	</div>

	<div class="reset_method">
		<button type="button" id="reset" name="reset" style="display: inline-block; border: 0; outline: 0; background: white">
			<span style="font-size: 15px">초기화</span> 
			<i id="resetbutton"	class="fa-solid fa-arrow-rotate-right" style="background: white; font-size: 20px"></i>
		</button>
	</div>

	<script src="js/MetaData.js"></script>
	<script src='https://unpkg.com/mediainfo.js/dist/mediainfo.min.js'></script>
	<script src="js/SemiMetaData.js"></script>
	<script src="js/fileManage.js"></script>
	<script src="js/getCompareResults.js"></script>
	<script src="js/changeCompareMethod.js"></script>
	<script src="js/exportXML.js"></script>

	<div>
		<div class="box">
			<table id="filelist">
				<thead id="filelisttable_head">
					<tr>
						<td style="width: 10%">No.</td>
						<td style="width: 30%">파일명</td>
						<td style="width: 20%">파일 크기</td>
						<td style="width: 40%">수정한 날짜</td>
					</tr>
				</thead>
				<tbody id="filelisttable_body">
					<tr>
						<td style="width: 10%" class="detailline">기준 파일</td>
						<td style="width: 30%" class="standard_name"></td>
						<td style="width: 20%" class="standard_size"></td>
						<td style="width: 40%" class="standard_date"></td>
					</tr>
					<tr class="removetr">
						<td style="width: 10%; height: 25px"></td>
						<td style="width: 30%"></td>
						<td style="width: 20%"></td>
						<td style="width: 40%"></td>
					</tr>
					<tr class="removetr">
						<td style="width: 10%; height: 25px"></td>
						<td style="width: 30%"></td>
						<td style="width: 20%"></td>
						<td style="width: 40%"></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<script>
      $(function() {
         $(".stbtn").click(function() {
            $(".standard_name").empty();
            $(".standard_size").empty();
            $(".standard_date").empty();
            $("#standardfile").empty();
            $("#standardfile").val("");
            $('.line').val("");
            $(".resultline").empty();
            $(".resultline_2").empty();
            $(".line").empty();
            standard_deleteFile();
         });
      });
   </script>
	<br>
	<span class="compareresulttext" style="color: rgb(78, 78, 78);">비교 상세 결과</span>
	<div class="export_file">
		<span>결과 저장하기</span>
		<input type="button" class="export_button" value="XML" onclick = "exportReportToXML()">
		<input type="button" class="export_button" id="excelFileExport"	value="EXCEL">
	</div>
	<table id="resultlist">
		<thead id="resultlisttable">
			<tr>
				<td>메타데이터 상 주요 불일치 원인</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="resultline"></td>
			</tr>
			<tr>
				<td class="resultline_2"></td>
			</tr>
		</tbody>
	</table>

</body>
</html>