(function(a){a.widget("ui.combotext",{options:{delay:60,title:"展开",minLength:1,highlight:true,autoFocus:false},_create:function(){var j=this,i=j.element.hide(),g=i.children(":selected").eq(0),b=g[0]&&g.text()||"",c=g[0]&&g.val()||"";var e=i.attr("name");i.removeAttr("name");i.attr("disabled",true);var d=i.attr("required");a.each(i.children("option"),function(){a(this).attr("pinyin",makePy(this.text))});var f=a('<div class="input-append"/>');f.insertBefore(i);var h=j.input=a('<input name="'+e+'" type="text"/>').val(b).addClass(i.attr("class")).appendTo(f).autocomplete({source:function(l,k){k(i.children("option").not(":disabled").map(function(){var n=this.text;if(this.text!=this.value){n=this.value+":"+this.text}var m=a(this).attr("pinyin");if(this.value==""){return{label:"&nbsp;",value:this.value,option:this}}if(this.value&&(!l.term||n.toLowerCase().indexOf(l.term.toLowerCase())>=0||m.toLowerCase().indexOf(l.term.toLowerCase())>=0)){if(j.options.highlight&&l.term!=""){n=n.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+a.ui.autocomplete.escapeRegex(l.term)+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong><font color=red>$1</font></strong>")}return{label:n,value:this.value,option:this}}}))},select:function(k,l){i.val(l.item.option.text);l.item.option.selected=true;j._trigger("selected",k,{item:l.item.option});h.attr("title",l.item.option.text);h.closest("form").attr("_inputChanged","true")},change:function(l,m){var k=a(this);k.closest("form").attr("_inputChanged","true")},delay:j.options.delay,minLength:j.options.minLength,autoFocus:j.options.autoFocus});if(d){h.attr("required",d)}i.removeAttr("class");h.after(i);if(!jQuery.browser.msie){h[0].addEventListener("input",function(){var k=this.value;if(k){a(this).autocomplete("search",k)}},false)}h.data("ui-autocomplete")._renderItem=function(k,l){return a("<li></li>").data("item.autocomplete",l).append("<a>"+l.label+"</a>").appendTo(k)};this.button=a('<span class="add-on"><i class="icon-arrow-down"></i></span>').attr("tabIndex",-1).attr("title",j.options.title).appendTo(f).click(function(){if(h.autocomplete("widget").is(":visible")){h.autocomplete("close");return false}a(this).blur();h.autocomplete("option","minLength",0);h.autocomplete("search","").focus();h.autocomplete("option","minLength",j.options.minLength);return false});g=b=c=null},_setOption:function(e,f){var d=this;var b=d.element,c=b.next();if(e=="size"){f=parseInt(f,10);c.attr("size",f)}else{if(e=="disabled"||e=="minLength"){this.input.autocomplete("option",e,f)}else{this.options[e]=f}}},destroy:function(){this.input.remove();this.button.remove();this.element.show();a.Widget.prototype.destroy.call(this)}})})(jQuery);