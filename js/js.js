var form;
layui.config({"isOutAnim":false, "anim":-1});
layui.use(["form",'element','colorpicker'], function(){
	layer.config({"isOutAnim":false, "anim":-1});

	form = layui.form;
	colorpicker = layui.colorpicker;

	document.onselectstart = new Function('event.returnValue=false;');
	// - - - - - - - - Button - - - - - - - -
	$("button").click(function(e) {
		var event = $(this).attr("data-event");
		var param = $(this).attr("data-param");
		parent.SendMsg1("Button", event, param);
	});

	// - - - - - - - - saveData - - - - - - - -
	$("input[type=text]").keyup(function(e) {
		if (e.keyCode == 13) {
			this.blur();
		}
	}).blur(function(){
		if($(this).hasClass("layui-unselect")) {
			return false;
		}
		var minValue = Number($(this).attr("data-minvalue"))
			,maxValue = Number($(this).attr("data-maxvalue"))
			,value = $(this).val();
		if (minValue>0 && Number(value)<minValue) {
			value = minValue;
			$(this).val(minValue);
		}
		if (maxValue>0 && Number(value)>maxValue) {
			value = maxValue;
			$(this).val(maxValue);
		}
		parent.saveData("text", this.id, value);
	});

	$("textarea").blur(function(){
		if (this.id!='') {
			parent.saveData("textarea", this.id, $(this).val());
		}
	});

	$("input[type=text].file").dblclick(function(){
		var value = parent.clickButton("folder", this.id);
		if (value.length>2) {
			$(this).val(value);
		}
	});

	form.on('checkbox', function(data){
		parent.saveData("checkbox", data.elem.id, data.elem.checked);
		var punion = $(data.elem).attr("data-punion");
		if (punion!=null && punion.length>0) {
			var disabled = data.elem.checked ? "" : "disabled";
			$("input[type='text'][data-union='"+punion+"']").prop("disabled", disabled);
			$("input[type='checkbox'][data-union='"+punion+"']").prop("disabled", disabled);
			$("input[type='radio'][data-union='"+punion+"']").prop("disabled", disabled);
			$("textarea[data-union='"+punion+"']").prop("disabled", disabled);
			$("select[data-union='"+punion+"']").prop("disabled", disabled);
			form.render("radio");
			form.render("checkbox");
			form.render("select");
		}
	});

	form.on('radio', function(data){
		var value = $("input[type='radio'][name='"+data.elem.name+"']:checked").val();
		parent.saveData("radio", data.elem.name, value);
	});

	form.on('select', function(data){
		parent.saveData("select", data.elem.id, data.value);
	});

	// - - - - - - - - startRead - - - - - - - -
	$("input[type=checkbox]").each(function(index, e) {
		if ($(e).hasClass('layui-hide')) {
			$(e).parent().hide();

		}else{
			var checked = $(e).attr("checked");
			if (typeof(checked) == 'undefined' || checked=='' || checked=='false') {
				checked = "false";
			}else{
				checked = "true";
			}
			var value = parent.readData("checkbox", e.id, checked);
			if (value == 'true') {
				e.checked = true;
			}else{
				e.checked = false;
			}
		}
	});
	form.render("checkbox");

	$("input[type=radio]").each(function(index, e) {
		if ($(e).hasClass('layui-hide')) {
			$(e).parent().parent().hide();
		}else{
			var value = $("input[type=radio]:checked").val();
			var value = parent.readData("radio", e.name, value);
			if (value == e.value) {
				e.checked = true;
			}
		}
	});
	form.render("radio");

	$("input[type=text]").each(function(index, e) {
		if ($(e).hasClass('layui-hide')) {
			$(e).parent().parent().hide();
		}else{
			var value = parent.readData("text", e.id, $(e).val());
			$(e).val(value);
		}
	});

	$("div.color").each(function(index, el) {
		var name = $(el).attr("name")
			,config = {}
			,value = $("#"+name).val();
		config.elem = "#"+el.id;
		if (value != '') {
			config.color = value;
		}
		config.done = function(color) {
			$("#"+name).val(color);
			$("#"+name).blur();
		};
		colorpicker.render(config);
	});

	$("textarea").each(function(index, e) {
		if ($(e).hasClass('layui-hide')) {
			$(e).parent().parent().hide();
		}else{
			var value = parent.readData("textarea", e.id, $(e).val());
			$(e).val(value);
		}
	});

	$("select").each(function(index, e) {
		if ($(e).hasClass('layui-hide')) {
			$(e).parent().parent().hide();
		}else{
			var value = parent.readData("select", e.id, $(e).find("option:selected").val());
			if ($(e).find("option[value='"+value+"']").get().length>0) {
				$(e).find("option[value='"+value+"']").get()[0].selected = true;
			}
		}
	});
	form.render("select");

	// tips
	$("div.restart>.layui-unselect").each(function(index, el){
		$(el).hover(function() {
			layer.tips("������������Ч", el, {tips: 1});
		}, function() {
			layer.closeAll("tips");
		});
	});
	$("a[placeholder]").each(function(index, el){
		$(el).hover(function() {
			layer.tips($(el).attr('placeholder'), el, {tips: 1});
		}, function() {
			layer.closeAll("tips");
		});
	});

	$("input[placeholder],textarea[placeholder]").each(function(index, el) {
		$(el).focus(function() {
			var p1 = $(el).attr('data-p');
			if (p1 == null) {
				p1 = "";
			}

			var className = $(el).get()[0].className;
			if (className.indexOf('layui-unselect') == -1) {
				layer.tips(p1+$(el).attr('placeholder'), el, {tips: 1,time:100000, "anim":-1, "isOutAnim":false});
			}
		}).blur(function(){
			layer.closeAll("tips");
		});
	});

	// ����
	$("input[type='checkbox'][data-punion]").each(function(index, el) {
		var punion = $(el).attr("data-punion");
		if (punion.length>0) {
			var disabled = el.checked ? "" : "disabled";
			$("input[type='text'][data-union='"+punion+"']").prop("disabled", disabled);
			$("input[type='checkbox'][data-union='"+punion+"']").prop("disabled", disabled);
			$("input[type='radio'][data-union='"+punion+"']").prop("disabled", disabled);
			$("textarea[data-union='"+punion+"']").prop("disabled", disabled);
			$("select[data-union='"+punion+"']").prop("disabled", disabled);
			form.render("radio");
			form.render("checkbox");
			form.render("select");
		}
	});

	/* ���layui.open */
	$("a").click(function(event) {
		if (parent.$("div.layui-layer-title").length > 0) {
			if (typeof parent.SendMsg1 == 'function') {
				parent.SendMsg1("Url", $(this).attr("href"));
			}
		}
		return false;
	});

	// - - - - - - - - key - - - - - - - -
	$("input[key='key']").keyup(function(e) {
		var keyUp = parent.readData("", 'keyUp');
		$(this).val(keyUp);
		return false;
	}).keydown(function(e) {
		return false;
	});;

	// - - - - - - - - dtable - - - - - - - -
	var list = [];
	$("table[name='dtable']>tbody[id]").each(function(index, el) {
		var value = parent.readData("", el.id);
		if (value == "undefined") {
			return false;
		}

		list = JSON.parse(value);
		for (var i = 0; i < list.length; i++) {
			var $trObj = $('<tr></tr>');
			for(var ii in list[i]) {
				$trObj.append("<td>"+list[i][ii].replace(/\n/gi, "<br>")+"</td>");
			}
			$trObj.append('<td><a href="javascript:;" onclick="del(this);">ɾ��</td>');
			$("#"+el.id).append($trObj);
		}
	});

	$("div[name='dtable_input'] input").each(function(index, el) {
		$(el).keyup(function(e) {
			if (e.keyCode == 13) {
				if ($("div[name='dtable_input'] input").length == index+1) {
					add($(el).attr("data-id"));

				}else{
					$("div[name='dtable_input'] input").eq(index+1).focus();
				}
			}
		});
	});

	$("div[name='dtable_input'] button").click(function(e) {
		add($(this).attr("data-id"));
	});

	window.add = function(id) {
		var input = []
			,inputObj = [];
		$("div[name='dtable_input'] input,div[name='dtable_input'] textarea").each(function(index, el) {
			input.push(el.value);
			inputObj.push(el);
		});

		// �ж��ظ�
		if (inputObj.length>0) {
			only = $(inputObj[0]).attr("only");
			if (only == '1') {
				for (var l in list) {
					if (list[l][0].trim() == input[0].trim()) {
						layer.msg("���ʧ�ܣ�ԭ���ظ��ˣ�", {icon:2, "time":800});
						return false;
					}
				}
			}
		}

		var $trObj = $('<tr></tr>'), only="0";
		for (var i in input) {
			if (input[i].trim() == '') {
				inputObj[i].focus();
				return false;
			}
			$trObj.append("<td>"+input[i].replace(/\n/gi, "<br>")+"</td>");
		}

		$trObj.append('<td><a href="javascript:;" onclick="del(this);">ɾ��</td>');
		$("#"+id).append($trObj);
		list.push(input);
		parent.saveData("", id, JSON.stringify(list));

		for (var i in input) {
			if (i == 0) {
				inputObj[i].focus();
			}
			inputObj[i].value = '';
		}
	}

	window.del = function(obj) {
		layer.confirm('ȷ��Ҫɾ���˿�ݼ���', {
			btn: ['ȷ��','ȡ��']
			,icon:3
			,"isOutAnim":false
			,"anim":-1
			,"shade":0.01
		}, function(index) {
			var tr = $(obj).parent().parent()
				,key = tr.find("td").eq(0).text()
				,id = tr.parent().attr("id");
			for (var i in list) {
				if (list[i][0] == key) {
					list.splice(i, 1);
					break;
				}
			}
			tr.remove();
			layer.close(index);
			parent.saveData("", id, JSON.stringify(list));
		},function() {
		});
	}
});