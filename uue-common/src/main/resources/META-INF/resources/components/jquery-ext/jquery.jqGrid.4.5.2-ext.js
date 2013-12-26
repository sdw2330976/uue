(function(a) {
	a.extend(a.ui.multiselect, {
		defaults : {
			sortable : true,
			searchable : true,
			animated : "fast",
			show : "slideDown",
			hide : "slideUp",
			dividerLocation : 0.6,
			nodeComparator : function(d, c) {
				var f = d.text(), e = c.text();
				return f == e ? 0 : (f < e ? -1 : 1)
			}
		},
		locale : {
			addAll : "添加全部",
			removeAll : "移除全部",
			itemsCount : "项已选"
		}
	});
	a.extend(a.jgrid.defaults, {
		datatype : "json",
		loadonce : false,
		filterToolbar : {},
		ignoreCase : true,
		prmNames : {
			npage : "npage"
		},
		jsonReader : {
			repeatitems : false,
			root : "content",
			total : "totalPages",
			records : "totalElements"
		},
		treeReader : {
			level_field : "extraAttributes.level",
			parent_id_field : "extraAttributes.parent",
			leaf_field : "extraAttributes.isLeaf",
			expanded_field : "extraAttributes.expanded",
			loaded : "extraAttributes.loaded",
			icon_field : "extraAttributes.icon"
		},
		autowidth : true,
		rowNum : 10,
		page : 1,
		altclass : "evennumber",
		height : "auto",
		viewsortcols : [ true, "vertical", true ],
		mtype : "POST",
		rowList : [ 5, 10, 15, 20, 50, 100, 200 ],
		viewrecords : true,
		rownumbers : true,
		gridview : true,
		altRows : true,
		sortable : true,
		multiselect : true,
		multiSort : true,
		forceFit : false,
		shrinkToFit : true,
		sortorder : "desc",
		sortname : "createdDate",
		ajaxSelectOptions : {
			cache : true
		},
		loadError : function(e, f, c, d) {
			alert("表格数据加载处理失败,请尝试刷新或联系管理员!")
		}
	});
	a.extend(a.jgrid.search, {
		multipleSearch : true,
		multipleGroup : true,
		width : 700,
		jqModal : false,
		searchOperators : true,
		stringResult : true,
		searchOnEnter : true,
		defaultSearch : "bw",
		operandTitle : "点击选择查询方式",
		operands : {
			eq : "=",
			ne : "!",
			lt : "<",
			le : "<=",
			gt : ">",
			ge : ">=",
			bw : "^",
			bn : "!^",
			"in" : "=",
			ni : "!=",
			ew : "|",
			en : "!@",
			cn : "~",
			nc : "!~",
			nu : "#",
			nn : "!#"
		}
	});
	a.extend(a.jgrid.del, {
		serializeDelData : function(c) {
			c.ids = c.id;
			c.id = "";
			return c
		},
		errorTextFormat : function(d) {
			var c = jQuery.parseJSON(d.responseText);
			return c.message
		},
		afterComplete : function(e) {
			var d = new Array();
			var c = jQuery.parseJSON(e.responseText);
			if (c.type == "success") {
				top.$.publishMessage(c.message);
				d[0] = true
			} else {
				top.$.publishError(c.message);
				d[0] = false
			}
			return d
		},
		ajaxDelOptions : {
			dataType : "json"
		}
	});
	var b;
	a.fn.grid = function(c) {
		this.each(function() {
			if (typeof c === "string") {
				var f = a.jgrid.getMethod(c);
				if (!f) {
					throw ("jqGrid - No such method: " + c)
				}
				var d = a.makeArray(arguments).slice(1);
				return f.apply(this, d)
			}
			if (c.url == undefined && c.queryForm) {
				a(c.queryForm).find(":text").each(function() {
					a(this).val(a.trim(a(this).val()))
				});
				c.url = a(c.queryForm).attr("action") + "?"
						+ a(c.queryForm).serialize()
			}
			var h = this;
			var g = a(this).attr("id");
			c.loadComplete = function(l) {
				a(this).closest("div.ui-jqgrid-view").find(
						"tr.ui-search-toolbar th.ui-th-column div").filter(
						":empty").each(function() {
					a(this).attr("title", "双击可快速清空查询条件");
					a(this).dblclick(function() {
						a(h).trigger("clearToolbar")
					})
				})
			};
			if (!h.grid) {
				var e = a(h);
				c = a.extend({
					filterToolbar : {},
					columnChooser : true,
					exportExcelLocal : true
				}, c);
				if (c.pager == undefined) {
					c.pager = "#" + e.attr("id") + "Pager"
				}
				if (c.editRow) {
					if (!c.ondblClickRow) {
						c.ondblClickRow = function(m, o, l, n) {
							e.jqGrid("editRow", m)
						}
					}
				}
				a.each(c.colModel,
						function(m, l) {
							var n = {
								fixed : true,
								searchoptions : {
									searchhidden : true,
									sopt : [ "bw", "bn", "eq", "ne", "cn",
											"nc", "ew", "en" ],
									buildSelect : function(r) {
										var q = jQuery.parseJSON(r);
										if (q == null) {
											q = r
										}
										var p = "<select>";
										p += "<option value=''></option>";
										for ( var o in q) {
											o = o + "";
											p += ("<option value='" + o + "'>"
													+ q[o] + "</option>")
										}
										p += "</select>";
										return p
									}
								}
							};
							if (l.formatter == disabledFormatter
									|| l.formatter == booleanFormatter) {
								l = a.extend(l, {
									width : 60,
									fixed : true,
									stype : "select",
									align : "center"
								});
								n.searchoptions = a.extend(n.searchoptions, {
									value : enumsContainer.booleanLabel
								})
							}
							if (!l.width) {
								n.fixed = false
							}
							if (l.stype == "select") {
								n.searchoptions = a.extend(n.searchoptions, {
									sopt : [ "eq", "ne" ]
								})
							}
							if (l.sorttype == "date") {
								n = a.extend(n, {
									width : 140,
									align : "center"
								});
								n.searchoptions = a.extend(n.searchoptions,
										{
											sopt : [ "eq", "ne", "ge", "le",
													"gt", "lt" ],
											dataInit : function(o) {
												a(o).datepicker()
											}
										})
							}
							if (l.sorttype == "number") {
								n = a.extend(n, {
									width : 60,
									align : "center"
								});
								n.searchoptions = a.extend(n.searchoptions,
										{
											sopt : [ "eq", "ne", "ge", "le",
													"gt", "lt" ]
										})
							}
							l.searchoptions = a.extend(n.searchoptions,
									l.searchoptions);
							l = a.extend(n, l);
							c.colModel[m] = l
						});
				e.jqGrid(c);
				e.jqGrid("navGrid", c.pager, {
					edit : false,
					add : false,
					del : c.delRow == undefined ? false : true,
					beforeRefresh : function() {
						var l = a(this);
						l.jqGrid("setGridParam", {
							datatype : "json"
						})
					}
				}, {}, {}, {
					reloadAfterSubmit : true,
					url : c.delRow == undefined ? false : c.delRow.url
				}, {});
				if (c.addRow) {
					c.addRow = a.extend({
						caption : "",
						buttonicon : "ui-icon-plus",
						position : "first",
						title : "添加数据",
						onClickButton : function() {
							if (c.addRow.toTab) {
								a(c.addRow.toTab).show();
								a(c.addRow.toTab).tabs("add", c.addRow.url,
										c.addRow.title)
							} else {
								var l = a(this).closest("div.ui-tabs");
								l.tabs("add", c.addRow.url, c.addRow.title)
							}
						}
					}, c.addRow);
					e.jqGrid("navButtonAdd", c.pager, c.addRow)
				}
				if (c.filterToolbar) {
					e.jqGrid("filterToolbar", c.filterToolbar)
				}
				if (c.columnChooser) {
					e.jqGrid("navButtonAdd", c.pager, {
						caption : "",
						buttonicon : "ui-icon-battery-2",
						position : "last",
						title : "设定显示列和顺序",
						onClickButton : function() {
							var l = e.jqGrid("getGridParam", "width");
							e.jqGrid("columnChooser", {
								width : 470,
								done : function(m) {
									if (m) {
										this.jqGrid("remapColumns", m, true);
										e.jqGrid("setGridWidth", l, false)
									} else {
									}
								}
							})
						}
					})
				}
				if (c.exportExcelLocal) {
					e.jqGrid("navButtonAdd", c.pager, {
						caption : "",
						buttonicon : "ui-icon-arrowthickstop-1-s",
						position : "last",
						title : "导出当前显示数据",
						onClickButton : function() {
							e.jqGrid("exportExcelLocal", c.exportExcelLocal)
						}
					})
				}
			} else {
				a(h).jqGrid("setGridParam", {
					url : c.url,
					datatype : "json",
					page : 1
				}).trigger("reloadGrid")
			}
		})
	};
	a
			.extend(
					a.jgrid,
					{
						buildButtons : function(d, f, c, g, e) {
							str = "";
							a
									.each(
											d,
											function() {
												str += "<a class='btn-icon' href='javascript:void(0)' title='"
														+ this.title
														+ "' onclick=\""
														+ this.onclick
														+ ";event.stopPropagation();\" style='margin:2px'><i class='"
														+ this.icon
														+ "'></i></a>"
											});
							return str
						},
						buildLink : function(d, f, c, g, e) {
							return '<a href="javascript:void(0)" onclick="'
									+ d.onclick + '">' + d.text + "</a>"
						}
					});
	a.jgrid
			.extend({
				refresh : function() {
					this.each(function() {
						var c = this;
						if (!c.grid) {
							return
						}
						a(c).jqGrid("setGridParam", {
							datatype : "json"
						}).trigger("reloadGrid")
					})
				},
				delRow : function(c) {
					this.each(function() {
						var d = this;
						if (!d.grid) {
							return
						}
						a("#" + d.p.id + "Pager").find(
								"span.ui-icon-trash:first").parent().click()
					})
				},
				addRow : function(c) {
					this.each(function() {
						var d = this;
						if (!d.grid) {
							return
						}
						a("#" + d.p.id + "Pager").find(
								"span.ui-icon-plus:first").parent().click()
					})
				},
				editRow : function(c, d) {
					this
							.each(function() {
								var l = this;
								if (!l.grid || !l.p.editRow) {
									return
								}
								var h = a(l).jqGrid("getRowData", c);
								var e = h[l.p.editRow.labelCol];
								var g = a(e).text();
								if (a(e).text() != "") {
									e = g
								}
								if (l.p.editRow.toTab) {
									a(l.p.editRow.toTab).show();
									a(l.p.editRow.toTab)
											.tabs(
													"add",
													l.p.editRow.url
															+ (l.p.editRow.url
																	.indexOf("?") > 0 ? "&"
																	: "?")
															+ "id=" + c,
													"编辑-" + e)
								} else {
									var f = a(this).closest("div.ui-tabs");
									f
											.tabs(
													"add",
													l.p.editRow.url
															+ (l.p.editRow.url
																	.indexOf("?") > 0 ? "&"
																	: "?")
															+ "id=" + c, "编辑-"
															+ e)
								}
							})
				},
				advSearch : function(c) {
					this.each(function() {
						var d = this;
						if (!d.grid) {
							return
						}
						a("#" + d.p.id + "Pager").find(
								"span.ui-icon-search:first").parent().click()
					})
				},
				search : function(c) {
					this.each(function() {
						var f = this;
						if (!f.grid) {
							return
						}
						var d = a(f).jqGrid("getGridParam", "url");
						for ( var e in c) {
							d = AddOrReplaceUrlParameter(d, e, c[e])
						}
						a(f).jqGrid("setGridParam", {
							url : d,
							page : 1
						}).trigger("reloadGrid")
					})
				},
				exportExcelLocal : function(c) {
					this.each(function() {
						var g = this;
						if (!g.grid) {
							return
						}
						if (!confirm("确认导出当前页面 " + g.p.caption
								+ " 数据为Excel下载文件？")) {
							return
						}
						var f = new Array();
						f = a(g).getDataIDs();
						var m = g.p.colModel;
						var p = g.p.colNames;
						var l = "";
						for (k = 0; k < p.length; k++) {
							var n = m[k];
							if (n.hidedlg || n.hidden || n.disableExport) {
								continue
							}
							l = l + p[k] + "\t"
						}
						l = l + "\n";
						for (i = 0; i < f.length; i++) {
							data = a(g).getRowData(f[i]);
							for (j = 0; j < p.length; j++) {
								var n = m[j];
								if (n.hidedlg || n.hidden || n.disableExport) {
									continue
								}
								var h = a(data[n.name]).text();
								if (h == "") {
									h = data[n.name]
								}
								if (h == "null" || h == null) {
									h = ""
								}
								l = l + h + "\t"
							}
							l = l + "\n"
						}
						l = l + "\n";
						var d = a(
								'<form method="post" target = "_blank" action="'
										+ WEB_ROOT
										+ '/pub/grid!export"></form>')
								.appendTo(a("body"));
						var o = a('<input type="hidden" name="exportDatas"/>')
								.appendTo(d);
						var e = a('<input type="hidden" name="fileName"/>')
								.appendTo(d);
						e.val(g.p.caption + ".xls");
						o.val(l);
						d.submit();
						d.remove()
					})
				},
				refreshRowIndex : function() {
					var c = a(this);
					a.each(a(c).jqGrid("getDataIDs"), function(d, e) {
						a(c).find("#" + e).find("input,select").each(
								function() {
									var f = a(this).attr("name");
									a(this).attr(
											"name",
											f.substring(0, f.indexOf("[") + 1)
													+ d
													+ f.substring(f
															.indexOf("]"),
															f.length))
								})
					})
				},
				getAtLeastOneSelectedItem : function(l) {
					var h = a(this);
					var g = jQuery(h).jqGrid("getGridParam", "selarrrow");
					var f = [];
					var e = 0;
					for ( var c = 0; c < g.length; c++) {
						var d = a("#jqg_" + jQuery(h).attr("id") + "_" + g[c])
								.is(":disabled");
						if (!d) {
							f[e] = g[c];
							e++
						}
					}
					if (l) {
						jQuery(h)
								.find("table.jqsubgrid")
								.each(
										function() {
											var o = a(this)
													.jqGrid("getGridParam",
															"selarrrow");
											for ( var m = 0; m < o.length; m++) {
												var n = a(
														"#jqg_"
																+ jQuery(this)
																		.attr(
																				"id")
																+ "_" + g[m])
														.is(":disabled");
												if (!n) {
													f[e] = o[m];
													e++
												}
											}
										})
					}
					if (f.length == 0) {
						a.jAlert("请至少选择一条行项目！");
						return false
					} else {
						return f.join()
					}
				},
				getOnlyOneSelectedItem : function() {
					var h = a(this);
					var g = jQuery(h).jqGrid("getGridParam", "selarrrow");
					var f = [];
					var e = 0;
					for ( var c = 0; c < g.length; c++) {
						var d = a("#jqg_" + jQuery(h).attr("id") + "_" + g[c])
								.is(":disabled");
						if (!d) {
							f[e] = g[c];
							e++
						}
					}
					if (f.length == 0) {
						a.jAlert("请选取操作项目！");
						return false
					} else {
						if (f.length > 1) {
							a.jAlert("只能选择一条操作项目！");
							return false
						}
						return f.join()
					}
				},
				getSelectedItem : function() {
					var d = a(this);
					var c = jQuery(d).jqGrid("getGridParam", "selarrrow");
					return c.join()
				}
			});
	a.RefreshTriggerSourceGrid = function() {
		a(b).jqGrid("refresh")
	};
	a.SetupTriggerSourceGrid = function(c) {
		b = a(c)
	};
	a.triggerGridRowDblClick = function(c) {
		a(c).closest("tr.jqgrow").dblclick()
	}
})(jQuery);
function disabledFormatter(b, a, c) {
	if (b) {
		return '<span class="label label-warning">禁用</span>'
	} else {
		return ""
	}
}
function booleanFormatter(b, a, c) {
	if (b) {
		return "是"
	} else {
		return "否"
	}
}
function eraseCellValueLink(b) {
	var a = $(b);
	if (a.text() != "") {
		return a.text()
	} else {
		return b
	}
};