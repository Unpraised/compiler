var app = function() {
	var handleModalClickers = {
		init:function() {
			$(document).on('click', '.modalOpen', function(e) {
				e.preventDefault();
				var modal = $(this).attr('data-modal');
				//$('#' + modal).addClass('activeModal');
				if ($('#' + modal).hasClass('style2')) {
					ui.handleModal.init2(modal);
				}
				else {
					ui.handleModal.init(modal);
				}
				e.stopImmediatePropagation();
				e.stopPropagation();
			});
	
			$('.modalClose').on('click', function(e) {
				e.preventDefault();
				var modal = $(this).parents('.modal').attr('id');
				if ($(this).attr('data-send')) {
					return false;
				}
				if ($(this).attr('data-confirm')) {
					try {
						$(this).removeAttr('data-confirm').removeAttr('data-check');
						$('#confirmation').find('.confirmOk').removeAttr('data-confirm').removeAttr('data-check');
					}
					catch(err) {
						window.location.reload();
					}
				}
				
				if ($(this).attr('data-redirect')) {
					var link = $(this).attr('data-redirect');
					setTimeout(function() {
						window.location.href = link;
					},1000);
				}
				if ($(this).attr('data-change')) {
					var fn = $(this).attr('data-change').split('|');
					switch(fn[0]) {
						case 'quickEdit.option.reset':
							quickEdit.option.reset(fn[1]);
							break;
					}
					$(this).removeAttr('data-change');
				}
				ui.handleModal.close(modal);
				e.stopImmediatePropagation();
				e.stopPropagation();
			});
			
			$('.style2 .extendModal').on('click', function(e) {
				e.preventDefault();
				var modal = $(this).parents('.modal').attr('id');
				ui.handleModal.style2.expand(modal);
				if ($(this).hasClass('expanded')) {
					$(this).removeClass('expanded');
					$('#' + modal + ' .modalWrap').css('top', ui.handleModal.style2.minimizeHeight);
				}
				else {
					$(this).addClass('expanded');
				}
				e.stopImmediatePropagation();
				e.stopPropagation();
			});
		}
	}
	
	var handleWindowHeight = {
		init:function() {
			
			if (!$('body').hasClass('fullHeight')) {
				var headers = $('.header').outerHeight(true);
				var footers = $('.footer').outerHeight(true);
				var pageWrap = $('.pageWrap').outerHeight(true);
				var windowHeight = $(window).height();
				var content = headers + pageWrap;
				
				if (windowHeight > content ) {
					//console.log('lol');
					$('.mainContent').css('min-height', windowHeight - headers - footers);
				}
			}
			else {
				//console.log($(window).outerWidth());
				if ($(window).outerWidth() > 360) {
					$('.sidebarWrap').css('max-height', $('.mainContentArea').outerHeight());
					if ($('.sidebarWrap').hasClass('active')) {
						$('.sidebarWrap').removeClass('active');
					}
				}
				else {
					$('.sidebarWrap').css('max-height', $(window).outerHeight() - $('.header').outerHeight());
				}
				
			}
			
		}
	}
	
	var windowActions = {
		resize:function() {
			$(window).resize(function() {
				// Modal Resize Module
				$('.mainContent').removeAttr('style');
				$('.sidebarWrap').removeAttr('style');
				handleWindowHeight.init();
				if ($('.modal').is(':visible') && !$('.modal:visible').hasClass('style2')) {
					var modalId = '#' + $('.modal:visible').attr('id');
					var modalWrapper = modalId + ' .modalWrap';
					$(modalWrapper).removeAttr('style');
					ui.handleModal.checkHeight(modalId, modalWrapper);
					//console.log('resize_modal!')
				}
				if ($('.tabbedWrap').length) {
					$('.tabbedWrap').each(function() {
						var tabId = $(this).parents('.withTabs').attr('id');
						var index = ui.portletTabs.tabs[tabId]['currentActive'];
						var currentHeight = $(this).height();
						var currActive = $('#' + tabId + ' .tabbed > div:nth-child('+(index)+')');
						var newHeight = $(currActive).outerHeight() + 80;
						if (newHeight !== currentHeight) {
							//console.log(tabId + ' Current Height: ' + currentHeight + ' New Height ' + newHeight);
							ui.portletTabs.determineHeight(tabId, currActive);
						}
					});
				}
				ui.hasMoreNav.init();
			});
		}
	}
	
	var keyboardShortcut = {
		init:function() {
			keyboardShortcut.escape();
			keyboardShortcut.mouseup();
			keyboardShortcut.scroll();
		},
		escape:function() {
			$(document).on('keyup',function(evt) {
				if (evt.keyCode == 27) {
					//console.log('esc');
					if ($('.responsiveMenu.collapsed.open').length) {
						var menubar = '#' + $('.responsiveMenu.collapsed.open').attr('id');
						ui.responsiveMenu.close(menubar);
					}
					if ($('.nav_expand.active').length) {
						ui.menu.closeAddition();
					}
					if ($('.hasMore.active').length) {
						var containerId = $('.hasMore.active').attr('href');
						ui.hasMoreNav.hide(containerId);
					}
					if ($('.modal.style2.activeModal').length) {
						var id = $('.modal.style2.activeModal').attr('id');
						ui.handleModal.close(id);
					}
				}
			});
		},
		mouseup:function() {
			$(document).on('mouseup', function (e) {
				if ($('.responsiveMenu.collapsed.open').length) {
					var containerId = '#' + $('.responsiveMenu.collapsed.open').attr('id');
					var container = $(containerId);
					keyboardShortcut.closeMe(e, container, ui.responsiveMenu.close, containerId);
				}
				if ($('.hasMore.active').length) {
					var ignore = $(e.target).attr('data-ignore');	
					if (ignore != 'true') {
						var containerId = $('.hasMore.active').attr('href');
						var container = $(containerId);
						keyboardShortcut.closeMe(e, container, ui.hasMoreNav.hide, containerId);
					}
				}
				if ($('.nav_expand.active').length) {
					var ignore = $(e.target).attr('data-ignore');	
					if (ignore != 'true') {
						var containerId = '#' + $('.nav_expand.active').attr('id');
						var container = $(containerId);
						keyboardShortcut.closeMe(e, container, ui.menu.closeAddition, '');
					}
				}
				if ($('.modal.style2.activeModal').length) {
					var id = $('.modal.style2.activeModal').attr('id');
					var container = $('#' + id).children('.modalWrap');
					keyboardShortcut.closeMe(e, container, ui.handleModal.close, id);
					//ui.handleModal.close(id);
				}
			});
		},
		scroll:function() {
			$('.wrapper').on('scroll', function (e) {
				var state = $('#ui-datepicker-div').is(':visible');
				if (state == true) {
					$('.datepicker').datepicker('hide');
				}
			});
		},
		closeMe:function(e, container, fn, fnParam) {
			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				if (fnParam == '') {
					fn();
				}
				else {
					fn(fnParam)
				}
			}
		}
	}
	
	var windowResizer = function() {
		$(window).on('resize', function() {
			var window = $(window);
			if ($('.responsiveMenu').length) {
				ui.responsiveMenu.resize();
			}
			if ($('.sidebarWrap').length) {
				if (!$('#sidebar_trigger').is(':visible')) {
					$('.sidebar.active').removeClass('active');
				}
			}
			
		
		});
	}
	
	var filterLaporan = {
		init:function() {
			var alertText = '<p style="margin:0">Click on <i class="fa fa-pencil"></i> to further refine your search filter</p>';

			$('.trigger_check').on('change', function() {
				var rel = $(this).data('rel');
				if ($(this).is(':checked')) {
					$('.child_' + rel).prop('checked', true);
				}
				else {
					$('.child_' + rel).prop('checked', false);
				}
				
				if (!$('.toast').length && $('.toast').html() != alertText) {
					ui.toast(alertText);
				}
				filterLaporan.counter(rel);
			});

			$('.trigger_child').on('change', function() {
				var rel = $(this).data('rel');
				filterLaporan.counter(rel);
			});

			$('.filter_show').on('click', function(e) {
				e.preventDefault();
				var rel = $(this).data('rel');
				filterLaporan.refine.init(rel);
				e.stopImmediatePropagation();
				e.stopPropagation();
			});
		},
		counter:function(rel) {
			var length = $('.child_' + rel).length;
			var checked = $('.child_' + rel + ':checked').length;
			var text = '(' + checked + ' of ' + length + ')';
			
			if (checked != 0 && checked < length) {
				$('#main_' + rel + ' > span').text(text);
				$('#main_' + rel).prop('checked', false);
			}
			else if (checked == length) {
				$('#main_' + rel + ' > span').text(text);
				$('#main_' + rel).prop('checked', true);
			}
			else {
				$('#main_' + rel + ' > span').text('');
			}
		},
		refine:{
			init:function(rel) {
				var wrap = $('#wrap_' + rel);
				if ($(wrap).is(':hidden')) {
					filterLaporan.refine.show(wrap);
				}
				else {
					filterLaporan.refine.hide(wrap);
				}
			},
			show:function(wrap){
				$(wrap).slideDown();
			},
			hide:function(wrap) {
				$(wrap).slideUp();
			}
		} 
	}

	var dataTables = {
		init:function() {
			if ($('#transaction_report').length) {
				/* CR25831-Channel Type Agen46- added requestId, status & via @var columns */
				var columns = [
					{ "data": null },
					{ "data": "datetime" },
					{ "data": "requestId" }, 
					{ "data": "kode_outlet" },
					{ "data": "trxtype_id" },
					{ "data": "nominal" },
					{ "data": "status" }, 
					{ "data": "no_jurnal" },
					{ "data": "biller_type" },
					{ "data": "biller_code" },
					{ "data": "biller_name" },
					{ "data": "no_rekening" },
					{ "data": "via" },
					{ "data": "controls" }
				];
				handleTable.tableInitWithIndex('transaction_report','laporan/retrieveAll','retrieveData', columns, 1);
			
				filterLaporan.init();
			}
			
			/* CR28312 Filter Message Broadcast Start */
			if ($('table#broadcast_unread').length) {
				var ops = {
					"serverSide": true,
					"processing": true
				}
				var columns = [
					{ "data": null },
					{ "data": "controls1" },
					{ "data": "created_by" }, 
					{ "data": "tgl_terima" },
					{ "data": "controls2" }
				];
				handleTable.tableInitWithIndex('broadcast_unread','broadcast/broadcast_unread/retrieve','broadcast_unread',columns,0,true,true,null,ops);
			
				filterLaporan.init();
			}
			
			if ($('table#broadcast_read').length) {
				var ops = {
					"serverSide": true,
					"processing": true
				}
				var columns = [
					{ "data": null },
					{ "data": "controls1" },
					{ "data": "created_by" }, 
					{ "data": "tgl_terima" },
					{ "data": "controls2" }
				];
				handleTable.tableInitWithIndex('broadcast_read','broadcast/broadcast_read/retrieve','broadcast_read',columns,0,true,true,null,ops);
			
				filterLaporan.init();
			}
			
			if ($('table#broadcast_delete').length) {
				var ops = {
					"serverSide": true,
					"processing": true
				}
				var columns = [
					{ "data": null },
					{ "data": "controls" },
					{ "data": "created_by" }, 
					{ "data": "tgl_terima" }
				];
				handleTable.tableInitWithIndex('broadcast_delete','broadcast/broadcast_delete/retrieve','broadcast_delete',columns,0,true,true,null,ops);
			
				filterLaporan.init();
			}
			
			if ($('table#broadcast_sent').length) {
				var ops = {
					"serverSide": true,
					"processing": true
				}
				var columns = [
					{ "data": null },
					{ "data": "controls1" },
					{ "data": "destination" }, 
					{ "data": "tanggal" },
					{ "data": "controls2" }
				];
				handleTable.tableInitWithIndex('broadcast_sent','broadcast/retrieve','retrieveBroadcastSent',columns,0,true,true,null,ops);
			
				filterLaporan.init();
			}
			/* CR28312 Filter Message Broadcast End */

            /* CR21443-Penambahan Menu Maintenance Data Agen46 di Channel Keagenan START */
            if ($("#transaction_report_perubahan").length) {
                var a = [{
                    data: null
                }, {
                    data: "kode_cabang"
                }, {
                    data: "username"
                }, {
                    data: "nama_agen"
                }, {
                    data: "old"
                }, {
                    data: "new"
                }, {
                    data: "create_by"
                }, {
                    data: "approve_by"
                }, {
                    data: "note"
                }, {
                    data: "created_at"
                }, {
                    data: "updated_at"
                }, {
                	/*CR24702_Enhancement_User_Branch_Monitoring_Aplikasi_Agen46 - Start */
                    //data: "status"
                    data: "status_perubahan"
                    /*CR24702_Enhancement_User_Branch_Monitoring_Aplikasi_Agen46 - End */
                }];
				
				/* IR11314 Fixing Tutup & Maintain Agen46 Start */
				var ops = {
					"serverSide": true,
					"processing":true
				}
                handleTable.tableInitWithIndex("transaction_report_perubahan", "laporanperubahan/retrieveAll", "retrieveLaporanperubahan", a, 0,true,true,null,ops);
				/* IR11314 Fixing Tutup & Maintain Agen46 End */
				
                filterLaporan.init()
            }
            /* CR21443-Penambahan Menu Maintenance Data Agen46 di Channel Keagenan END */
			
			/* CR25226 Penambahan Status Tutup Start */
            if ($("#report_agen_tutup").length) {
                var a = [{
                    data: null
                }, {
                    data: "kode_agen"
                }, {
                    data: "nama_agen"
                }, {
                    data: "created_at"
                }, {
                    data: "updated_at"
                }, {
                    data: "create_by"
                }, {
                    data: "approve_by"
                }];
				
				/* IR11314 Fixing Tutup & Maintain Agen46 Start */
				var ops = {
					"serverSide": true,
					"processing":true
				}
				handleTable.tableInitWithIndex("report_agen_tutup", "agenTutup/retrieveAll", "retrieveAgenTutup", a, 0,true,true,null,ops);
				/* IR11314 Fixing Tutup & Maintain Agen46 End */
				
                filterLaporan.init()
            }
            /* CR25226 Penambahan Status Tutup End */

			/* CR18443 BNI Life Start */
			if ($('#cetak_report').length) {
				var columns = [
					{ "data": null },
					{ "data": "h_transactionDate" },
					{ "data": "h_identitynumber" },
					{ "data": "h_registrationnumber" },
					{ "data": "h_name" },
					{ "data": "h_dateofbirth" },
					{ "data": "h_product_desc" },
					{ "data": "h_planType_desc" },
					{ "data": "h_startDate" },
					{ "data": "h_endDate" },
					{ "data": "controls" }				
				];
				handleTable.validatereport('cetak_report','transaksi/asuransi_mikro/cetak_ulang/retrieveAll','retrieveData', columns, 1);
			
				filterLaporan.init();
			}
			/* CR18443 BNI Life Start */
			/* CR20560 Fitur Remittance Start */
			if ($('#remittance_report').length) {
				var columns = [
					{ "data": null },
					{ "data": "poDate",render:function(data,type,row){
						return moment(data).utc().format('DD/MM/YYYY');
					} },
					{ "data": "senderName" },
					{ "data": "beneficiaryName" },
					{ "data": "amountCurrency" },
					{ "data": "amount" },
					{ "data": "controls" }				
				];
				handleTable.validatereport('remittance_report','transaksi/remittance/retrieveAll','retrieveData', columns, 1);
			
				filterLaporan.init();
			}
			/* CR20560 Fitur Remittance End */
			/* CR22087 Inquiry Cicilan BPJS Tunggakan Start */
			if ($('#cicilan_va_bpjs').length) {
				var columns = [
					{ "data": null },
					{ "data": "TransactionDate" },
					{ "data": "JournalNum" },
					{ "data": "TransactionType" },
					{ "data": "Amount" },
					{ "data": "Balance" }
				];
				
				handleTable.validatereport('cicilan_va_bpjs','transaksi/pembayaran/cicilan_va_bpjs_ks/retrieveAll','retrieveData', columns, 1);
			
				filterLaporan.init();
			}
			/* CR22087 Inquiry Cicilan BPJS Tunggakan End */
			if ($('#bansos_report').length) {
				var columns = [
					{ "data": null },
					{ "data": "created",render:function(data,type,row){
						return moment(data).utc().format('DD-MMM-YY (H:mm:ss)');
					} },
					{ "data": "recepient.name" },
					{ "data": "card_number" },
					{ "data": "account_number" },
					{ "data": "subcommodity.name" },
					{ "data": "product"},
					{ "data": "subcommodity.unit" },
					{ "data": "qty" },
					{ "data": "price" },
					{"data":"bank.bank_name",render:function(data,type,row){
						return data || '';
					}}
				];
				var ops = {
					"serverSide": true,
					"processing":true
				}
				handleTable.tableInitWithIndex('bansos_report','laporan_bansos/retrieveAll','bansos_report', columns, 1,null,null,null,ops);
			
				filterLaporan.init();
			}

			/* CR28328 Otomasi Fee Keagenan Start */
			if ($('#tbl_hitung_fee').length) {
				var columns = [
					{ "data": null },
					{ "data": "trx_name"},
					{ "data": "via"},
					{ "data": "jumlah_transaksi"},
					{ "data": "total_pendapatan"},
				];

				var ops = {
					"bInfo": false,
					"searching": false,
					"serverSide": true,
					"responsive": false,
					"paging": false,
					"drawCallback": function( settings ) {

						var footer = settings.json.footer;
						var start = settings.json.start;
						var end = settings.json.end;
						$('#start').val(start);
						$('#end').val(end);
						if (footer.length > 0 && footer[0].total_pendapatan_cr !== null) {
							for (let i = 0; i < footer.length; i++) {
								$('#totalCrBlm').html("<b>Rp. "+footer[i].total_pendapatan_cr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')+"</b>");
								$('#totalDbBlm').html("<b>Rp. "+footer[i].total_pendapatan_db.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')+"</b>");
								$('#totalCrBlm').val(footer[i].total_pendapatan_cr);
								$('#totalDbBlm').val(footer[i].total_pendapatan_db);
							}
						} else {
							$('#totalCrBlm').val("0");
							$('#totalDbBlm').val("0");
							$('#totalCrBlm').html("<b>Rp. 0</b>");
							$('#totalDbBlm').html("<b>Rp. 0</b>");
						}
						if (settings.json.data.length == 0) {
							$("#submit_hitung_fee").css("display", "none");
							$('#pin_transaksi').attr('disabled', true);
						} else {
							$("#submit_hitung_fee").css("display", "inline-block");
							$('#pin_transaksi').removeAttr('disabled');
						}
					},
					"columnDefs": [{
						"orderable": false,
						// "targets": [0,1,2,3,4]
						"targets": [0,1,2,3]
					},{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					}],
				}
				handleTable.tableInitWithIndex('tbl_hitung_fee','fee/retrieveAll','tbl_hitung_fee', columns, 1,null,null,null,ops);
				var table = $('#tbl_hitung_fee').DataTable();
				if (!table.data().length) {
					$(".submit_hitung_fee").attr("disabled", true);
				} else {
					$(".submit_hitung_fee").attr("disabled", false);
				}
				filterLaporan.init();
			}

			if ($('#tbl_skema_agen').length) {
				var columns = [
					{ "data": null },
					{ "data": "jenis_trx" },
					{ "data": "industri" },
					{ "data": "trx_type_target" },
					{ "data": "biller_target" },
					{ "data": "trx_type_source_desc" },
					{ "data": "channel_source" },
					{ "data": "nom_min",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "nom_max",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "fee_perorangan",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "fee_super_agen",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "action" },
				];

				var ops = {
					"serverSide": true,
					"responsive": true,
					"searching": true,
					"columnDefs": [{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					},
					{
						"orderable": false,
						"targets": 11
					},],
				}
				handleTable.tableInitWithIndex('tbl_skema_agen','skema/getFeeAgen','tbl_skema_agen', columns, 1,null,null,null,ops);
			}

			if ($('#tbl_skema_mitra').length) {
				var sendData = [];
				sendData['kode'] = $('#kode').val();

				var columns = [
					{ "data": null },
					{ "data": "jenis_trx" },
					{ "data": "industri" },
					{ "data": "trx_type_target" },
					{ "data": "biller_target" },
					{ "data": "trx_type_source_desc" },
					{ "data": "channel_source" },
					{ "data": "nom_min",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "nom_max",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "fee_perorangan",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "fee_super_agen",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "action" },
				];

				var ops = {
					"serverSide": true,
					"responsive": true,
					"searching": true,
					"columnDefs": [{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					},
					{
						"orderable": false,
						"targets": 11
					},],
				}
				handleTable.tableInitWithIndex('tbl_skema_mitra','skema/getFeeMitra','tbl_skema_mitra', columns, 1,sendData,null,null,ops);
			}

			if ($('#tbl_fee_mitra').length) {
				var columns = [
					{ "data": null },
					{ "data": "kode_mitra" },
					{ "data": "mitra_nama" },
					{ "data": "mitra_pic_nama" },
					{ "data": "action" }
				];

				var ops = {
					"serverSide": true,
					"responsive": true,
					"searching": true,
					"columnDefs": [{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					}],
				}
				handleTable.tableInitWithIndex('tbl_fee_mitra','skema/getMitra','tbl_fee_mitra', columns, 1,null,null,null,ops);
			}		
			
			if ($('#tbl_laporan_fee_mitra').length) {
				var columns = [
					{ "data": null },
					{ "data": "kode_mitra" },
					{ "data": "via" },
					{ "data": "trx_name" },
					{ "data": "jumlah_transaksi"},
					{ "data": "total_pendapatan",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					}
				];

				var ops = {
					"serverSide": true,
					"responsive": false,
					"searching": false,
					"drawCallback": function( settings ) {

						var footer = settings.json.footer;
						if (footer.length > 0 && footer[0].total_pendapatan_cr !== null) {
							for (let i = 0; i < footer.length; i++) {
								$('#totalCr').html("<b>Rp. "+footer[i].total_pendapatan_cr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')+"</b>");
								
							}
						} else {
							$('#totalCr').html("<b>Rp. 0</b>");
						}
					},
					"columnDefs": [{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					}],
				}
				handleTable.tableInitWithIndex('tbl_laporan_fee_mitra','agent/retrieveLaporanMitra','tbl_laporan_fee_mitra', columns, 1,null,null,null,ops);
			
				filterLaporan.init();
			}
			
			if ($('#tbl_laporan_fee_agen_mitra').length) {
				var columns = [
					{ "data": null },
					{ "data": "trx_name" },
					{ "data": "via" },
					{ "data": "jumlah_transaksi"},
					{ "data": "total_pendapatan",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "kode_loket"},
				];

				var ops = {
					"serverSide": true,
					"responsive": false,
					"searching": false,
					"drawCallback": function( settings ) {

						var footer = settings.json.footer;
						if (footer.length > 0 && footer[0].total_pendapatan_cr !== null) {
							for (let i = 0; i < footer.length; i++) {
								$('#totalCr').html("<b>Rp. "+footer[i].total_pendapatan_cr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')+"</b>");
							}
						} else {
							$('#totalCr').html("<b>Rp. 0</b>");
						}
					},
					"columnDefs": [{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					}],
				}
				handleTable.tableInitWithIndex('tbl_laporan_fee_agen_mitra','agent/retrieveLaporanAgenMitra','tbl_laporan_fee_agen_mitra', columns, 1,null,null,null,ops);
			
				filterLaporan.init();
			}

			if ($('#tbl_laporan_agen').length) {
				var sendData = [];
				sendData['kode_cabang'] = $('#filter_cabang').val();

				var columns = [
					{ "data": null },
					{ "data": "kode_agen" },
					{ "data": "trx_name"},
					{ "data": "via"},
					{ "data": "jumlah_transaksi"},
					{ "data": "total_pendapatan",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
				];

				var ops = {
					"serverSide": true,
					"responsive": true,
					"searching": true,
					"drawCallback": function( settings ) {
						
						var footer = settings.json.footer;
						if (footer.length > 0 && footer[0].total_pendapatan_cr !== null) {
							for (let i = 0; i < footer.length; i++) {
								$('#totalCr').html("<b>Rp. "+footer[i].total_pendapatan_cr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')+"</b>");
							}
						} else {
							$('#totalCr').html("<b>Rp. 0</b>");
						}
					},
					"columnDefs": [{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					}],
				}

				handleTable.tableInitWithIndex('tbl_laporan_agen','agent/retrieveLaporan','tbl_laporan_agen', columns, 1, sendData,null,null,ops);
							
				filterLaporan.init();
			}
			
			if ($('#tbl_skema_pendapatan').length) {
				var columns = [
					{ "data": null },
					{ "data": "jenis_trx" },
					{ "data": "trx_type_source" },
					{ "data": "industri" },
					{ "data": "channel_source" },
					{ "data": "fee_perorangan",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "biaya_loket" },
				];

				var ops = {
					"serverSide": true,
					"responsive": true,
					"searching": true,
					"columnDefs": [{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					},
					{
						"orderable": false,
						"targets": 6
					},],
				}
				handleTable.tableInitWithIndex('tbl_skema_pendapatan','skema_pendapatan_retrieve','tbl_skema_pendapatan', columns, 1,null,null,null,ops);
			}
			
			if ($('#tbl_view_skema_pendapatan').length) {
				var columns = [
					{ "data": null },
					{ "data": "jenis_trx" },
					{ "data": "trx_type_source" },
					{ "data": "industri" },
					{ "data": "channel_source" },
					{ "data": "nom_min",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "nom_max",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "fee_perorangan",
					  "render": $.fn.dataTable.render.number( '.', ',', 0 )
					},
					{ "data": "biaya_loket" },
				];

				var ops = {
					"serverSide": true,
					"responsive": true,
					"searching": true,
					"columnDefs": [{
						"targets": 0,
						"data": null,
						"orderable": false,
						"defaultContent": ""
					},
					{
						"orderable": false,
						"targets": 8
					},],
				}
				handleTable.tableInitWithIndex('tbl_view_skema_pendapatan','skema/view_skema_pendapatan_retrieve','tbl_view_skema_pendapatan', columns, 1,null,null,null,ops);
			}
			/* CR28328 Otomasi Fee Keagenan End */

			if ($('#table2').length) {
				var columns = [
					{ "data": null },
					{ "data": "tanggal" },
					{ "data": "rekening" },
					{ "data": "saldo" },
					{ "data": "keterangan" }
				];
				handleTable.tableInitWithIndex('table2','retrieveData','retrieveData', columns, 1);
			}
			if ($('#stock_table').length) {
				var columns = [
					{ "data": null },
					{ "data": "product_id" },
					{ "data": "product_name" },
					{ "data": "stock" }
				];
				handleTable.tableInitWithIndex('stock_table','transaksi/subsidi/subsidi/Cek_stock_agent/retrieveAll','retrieveData', columns, 1);
			}

			/* CR24346 Topup Tapcash Bulk Start */
			if($('#report_bulk_topup').length){
				var columns = [
					{"data":null},
					{"data":"filename"},
					{"data":"datetime"},
					{"data":"status"},
				];

				var ops = {
					"serverSide": true,
					"processing":true,
					"searching": false
				}

				handleTable.tableInitWithIndex('report_bulk_topup','transaksi/bulk_topup/get_report','report_bulk_topup', columns, 1,null,true,null,ops);

				filterLaporan.init();
			}
			/* CR24346 Topup Tapcash Bulk End */

			/* CR26537_Enhancement_KUR Mikro Start */
			if ($('#cek_status_pengajuan_report').length) {
				var columns = [
					{ "data": null },
					{ "data": "no_pengajuan" },
					{ "data": "no_ktp" },
					{ "data": "tanggal_pengajuan" },
					{ "data": "nama_pemohon" },
					{ "data": "nominal_pengajuan" },
					{ "data": "nominal_disetujui" },
					{ "data": "status_pengajuan" },
					{ "data": "controls" },
				];
				var ops = {
					"serverSide": true,
					"processing": true
				}
				handleTable.tableInitWithIndex('cek_status_pengajuan_report', 'transaksi/kur_mikro/getListStatusPengajuan', 'cek_status_pengajuan_report', columns, 1);

				filterLaporan.init();
				var table = $('#cek_status_pengajuan_report').DataTable();

				$('#cek_status_pengajuan_report tbody').on('click', '.form-data-lengkap', function (e) {
					var id_pengajuan = encodeURIComponent(window.btoa($(this).find('input[name=idPengajuan]').val()));
					var nominal_pengajuan = encodeURIComponent(window.btoa($(this).find('input[name=nominalPengajuan]').val()));
					// var no_pengajuan = atob($('input[name=getNoPengajuan]').val());
					document.location.href = app.link() + "transaksi/kur_mikro/form_data_lengkap/" + id_pengajuan + "/" + nominal_pengajuan;
				});

				$('#cek_status_pengajuan_report tbody').on( 'click', '.cek-status', function (e) {
					
					var tableee = $('#cek_status_pengajuan_report').DataTable();
					// var dataRow = tableee.row($(this).closest('tr')).data();
					// console.log('hit')
					var current_row = $(this).parents('tr');//Get the current row
					if (current_row.hasClass('child')) {//Check if the current row is a child row
						current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
					}
					var dataRow = tableee.row(current_row).data();
					var row = tableee.row(current_row).index();
					
					// console.log(row,no_pengajuan);
					// console.log(dataRow);
					
					$.ajax({
						headers: {
							'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
						},
						url: app.link() + "transaksi/kur_mikro/updateCekStatus",
						method: "POST",
						data: {
							no_pengajuan: dataRow['no_pengajuan'],
							id 			: dataRow['id'],
							nominal		: dataRow['nominal_pengajuan'],
							id_kolom	: row
						},
						success: function (dataUpdate) {
							if (dataUpdate['code'] == "00") {
								dataRow['status_pengajuan'] = dataUpdate['data']['description']
								dataRow['controls'] = dataUpdate['data']['controls']
							var data = dataRow;
							tableee.draw();
							} else {
								ui.handleAlert.alert('Error ' + dataUpdate['code'], dataUpdate['messages']['message']);
							}
						}
					})
				});				
			}
			/* CR26537_Enhancement_KUR Mikro End */
			/* CR25900 Rekonsiliasi Agen Start */
			if ($('table#tableListRekon').length) {
				var ops = {
					"serverSide": true,
					"processing": true,
					"ordering": false,
				}
				var columns = [
					{ "data": null },
					{ "data": "nama_file"},
					{ "data": "tanggal_transaksi" },
					{ "data": "tanggal_upload" },
					{ "data": "tanggal_selesai" },
					{ "data": "status" },
					{ "data": "controls" },
				];
				handleTable.tableInitWithIndex('tableListRekon','rekonsil/retrieve','tableListRekon', columns, 1, true, true, null, ops);
			}
			/* CR25900 Rekonsiliasi Agen End */		
			/* CR24815 Enhancement User Management Aplikasi Agen46 - Start */
			if ($('table#tableListUserActivity').length) {
				var ops = {
					"serverSide": true,
					"processing": true,
					"ordering": false,
				}
				var columns = [
					{ "data": null },
					{ "data": "npp" },
					{ "data": "nama" },
					{ "data": "email" },
					{ "data": "no_hp" },
					{ "data": "unit" },
					{ "data": "jabatan" },
					{ "data": "role" },
					{ "data": "status" },
					{ "data": "last_login" },
				];
				handleTable.tableInitWithIndex('tableListUserActivity', 'userActivity/retrieve', 'tableListUserActivity', columns, 1, true, true, null, ops);
			}
			
			if ($('table#tableListMenuManagement').length) {
				var ops = {
					"serverSide": true,
					"processing": true,
					"ordering": false,
				}
				var columns = [
					{ "data": null },
					{ "data": "role" },
					{ "data": "main_menu" },
					{ "data": "menu_child1" },
					{ "data": "menu_child2" },
					{ "data": "status_menu_value" },
					{ "data": "menu_perm" }
				];
				handleTable.tableInitWithIndex('tableListMenuManagement', 'menuManagement/retrieve', 'tableListMenuManagement', columns, 1, true, true, null, ops);
			}
			/* CR24815 Enhancement User Management Aplikasi Agen46 - End */		
		}
	}
	
	var smallFn = {
		init:function() {
			smallFn.datepicker();
			smallFn.datetimepicker(); // CR27537 Switcher OKB
			//smallFn.pulsate()
			//var hello = new smallFn.pulsate('.newMsg');
		},
		datepicker:function() {
			if ($(".datepicker" ).length) {
				$('.datepicker').each(function() {
					$(this).datepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat:'dd-mm-yy',
					//	dateFormat:'yy-mm-dd',
						yearRange: "-100:+5",
						showAnim: 'slideDown',
						onSelect:function() {
							$(this).blur().trigger('change');
						}
					});
				});
				//$('#tanggalFee').datepicker('option', 'defaultDate', -1 );
				$('#tanggal_rekon').datepicker('option', 'dateFormat', 'yy-mm-dd');
				$('#laporanDate').datepicker('option', 'dateFormat', 'yy-mm-dd');
				$('.formatYear').datepicker('option', 'dateFormat', 'yy-mm-dd');
				$('.formatYear').datepicker('option', 'maxDate', '0D');
				/* CR29126 BPJS TK BPU - START */
				$('.formatYearBPJS').datepicker('option', 'dateFormat', 'dd-mm-yy');
				$('.formatYearBPJS').datepicker('option', 'maxDate', '0D');
				/* CR29126 BPJS TK BPU - END */
				/* CR18443 BNI Life Start*/
				$('.formatYearDDMMYYYY').datepicker('option', 'dateFormat', 'dd/mm/yy');
				$('.formatYearDDMMYYYY').datepicker('option', 'maxDate', '0D');
				$('.formatYearInfinity').datepicker('option', 'dateFormat', 'dd/mm/yy');
				/* CR18443 BNI Life End*/
				/* CR22087 Inquiry Cicilan BPJS Tunggakan Start */
				var rangeDate =  $('#rangeDate').val();
				$('.formatFromYYYYMMDD').datepicker('option', 'dateFormat', 'yy/mm/dd');
				$('.formatFromYYYYMMDD').datepicker('option', 'maxDate', '0D');
				$('.formatFromYYYYMMDD').datepicker('option', 'minDate', rangeDate);
				/* CR22087 Inquiry Cicilan BPJS Tunggakan End */
				/* CR28328 Otomasi Fee Keagenan Start */
				$('.rangeMonth').datepicker('option', 'minDate', '-3M');
				$('.rangeMonth1').datepicker('option', 'minDate', '-1M');
				/* CR28328 Otomasi Fee Keagenan End */
				$('.rangeWeek2').datepicker('option', 'minDate', '-14D'); // CR25900 Rekonsiliasi Agen
				/* CR27537 Switcher OKB Start */
				$('.formatFrom').datepicker('option', 'dateFormat', 'yy-mm-dd');
				$('.formatTo').datepicker('option', 'dateFormat', 'yy-mm-dd');
				$('.formatFrom').datepicker('option', 'maxDate', '0D');
				$('.formatFrom').datepicker('option', 'minDate', '-93D');
				$('.formatFrom, #from').on('change', function() {
					var startDate = $("#from").datepicker('getDate');
					$('.formatTo').datepicker('option', 'minDate', startDate);
					
					var today = new Date();
					var choose = new Date(startDate);
					
					diff  = new Date(today-choose),
					days  = Math.floor(diff/1000/60/60/24);
					
					if (startDate != null) {
						if (days <= '30' || days <= '31') {
							$('.formatTo').datepicker('option', 'maxDate', new Date());
						} else {
							var maxDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
							$('.formatTo').datepicker('option', 'maxDate', maxDate);
						}
					}
				});
				/* CR27537 Switcher OKB End */
			}
		},
		/* CR27537 Switcher OKB Start */
		datetimepicker:function() {
			if ($(".datetimepicker" ).length) {
				$('.datetimepicker').each(function() {
					$(this).datetimepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat: 'yy-mm-dd',
						timeFormat: 'HH:mm:ss',
						minDate: '0D',
						yearRange: '-100:+5',
						showAnim: 'slideDown',
						onSelect:function() {
							$(this).blur().trigger('change');
						}
					});
				});
			}
		},
		/* CR27537 Switcher OKB End */
		pulsate:function() {
			$('.newMsg').pulsate({
				color: '#ccc', // set the color of the pulse
				reach: 5,                              // how far the pulse goes in px
				speed: 1000,                            // how long one pulse takes in ms
				pause: 0,                               // how long the pause between pulses is in ms
				glow: true,                             // if the glow should be shown too
				repeat: true,                           // will repeat forever if true, if given a number will repeat for that many times
				onHover: false                          // if true only pulsate if user hovers over the element
			});
		}
	}
	
	
	var calendar = {
		init:function() {
			if ($('#calendar').length) {
				$('#calendar').fullCalendar({
					events: app.link() + '/retrieveEvents'
					// put your options and callbacks here
				})
			}
		}
	}
	
	var debugMe = {
		init:function() {
			if (!debugMe.status) {
				debugMe.disableLogger();
			}
		},
		status:true,
		oldConsoleLog:null,
		enableLogger:function() {
			if(debugMe.oldConsoleLog == null)
				return;

			window['console']['log'] = debugMe.oldConsoleLog;
		},
		disableLogger:function() {
			debugMe.oldConsoleLog = console.log;
			window['console']['log'] = function() {};
		}
	}
	
	var forms = {
		init:function() {
			// Multiform
			if ($('.ui').length) {
				forms.multipleForm();
			}
			/* SingleForm
			** Create your validation rules
			** Add the proper data- tags
			*/
			if ($('#transfer').length) {
				forms.transfer();
			}
			if ($('#form_4').length) {
				forms.singleForm();
			}

			if ($('#changePassword').length) {
				forms.changePassword();
			}
			/* CR20976 Security Keagenan Start */
			if ($('#changePasswordOTP').length) {
				forms.changePasswordOTP();
			}
			/* CR20976 Security Keagenan End */
			if ($('#createTicket').length) {
				forms.createTicket();
			}
			if ($('#addToTicket').length) {
				forms.addToTicket();
			}


			if ($('#changePIN').length) {
				forms.changePIN();
			}
			/* CR20976 Security Keagenan Start */
			if ($('#changePINOTP').length) {
				forms.changePINOTP();
			}
			/* CR20976 Security Keagenan End */
			if ($('#resetPIN').length) {
				forms.resetPIN();
			}
			/* CR20976 Security Keagenan Start */
			if ($('#resetPINOTP').length) {
				forms.resetPINOTP();
			}
			/* CR20976 Security Keagenan End */
			if ($('#forgetPIN').length) {
				forms.forgetPIN();
			}
			/* CR25900 Rekonsiliasi Agen Start */
			if ($('#formUploadRekon').length) {
				forms.formUploadRekon();
			}
			/* CR25900 Rekonsiliasi Agen End */
		},
		forgetPIN:function() {
			var valRules = {
				'password': {
					required: true
				},
				'email': {
					required: true,
					email: true
				}
			};
			
			var valMessages = {
				'password': {
					required: validation.messages.required()
				},
				'email': {
					required: validation.messages.required(),
					email: validation.messages.email()
				}
			}
			validation.validateMe('forgetPIN', valRules, valMessages);
		},
		resetPIN:function() {
			var valRules = {
				'token': {
					required: true
				},
				'new_pin_transaksi': {
					required: true,
					pwcheck_alfanum:true
				/* CR20976 Security Keagenan Start */
				},
				'otp': {
					required: true
				}
				/* CR20976 Security Keagenan End */
			};
			
			var valMessages = {
				'token': {
					required: validation.messages.required()
				},
				'new_pin_transaksi': {
					required: validation.messages.required(),
					pwcheck_alfanum: validation.messages.pwcheck_alfanum()
				/* CR20976 Security Keagenan Start */
				},
				'otp': {
					required: validation.messages.required()
				}
			}
			validation.validateMultiple('resetPIN', valRules, valMessages);
		},
		resetPINOTP:function() {
			var valRules = {
				'token': {
					required: true
				},
				'new_pin_transaksi': {
					required: true,
					pwcheck_alfanum:true
				}
			};
			
			var valMessages = {
				'token': {
					required: validation.messages.required()
				},
				'new_pin_transaksi': {
					required: validation.messages.required(),
					pwcheck_alfanum: validation.messages.pwcheck_alfanum()
				}
			}
			validation.validateMultiple('resetPINOTP', valRules, valMessages);
		},
		/* CR20976 Security Keagenan End */
		createTicket:function() {
			var valRules = {
				'subject': {
					required: true
				},
				'topik': {
					required: true
				},
				'priority': {
					required: true
				},
				'pesan': {
					required: true
				}
			};
			
			var valMessages = {
				'subject': {
					required: validation.messages.required()
				},
				'topik': {
					required: validation.messages.required()
				},
				'priority': {
					required: validation.messages.required()
				},
				'pesan': {
					required: validation.messages.required()
				}
			}
			validation.validateMe('createTicket', valRules, valMessages);
		},
		addToTicket:function() {
			var valRules = {
				'comment_isi': {
					required: true
				}
			};
			
			var valMessages = {
				'comment_isi': {
					required: validation.messages.required()
				}
			}
			validation.validateMe('addToTicket', valRules, valMessages);
		},
		changePIN:function() {
			var valRules = {
				'o_pin': {
					required: true
				},
				'n_pin': {
					required: true,
					pwcheck_alfanum:true,
					notEqual: '#o_pin'
				},
				'nc_pin': {
					required: true,
					equalTo:'#n_pin'
				/* CR20976 Security Keagenan Start */
				},
				'otp': {
					required: true
				}
				/* CR20976 Security Keagenan End */
			};
			
			var valMessages = {
				'o_pin': {
					required: validation.messages.required()
						
				},
				'n_pin': {
					required: validation.messages.required(),
					pwcheck_alfanum: validation.messages.pwcheck_alfanum(),
					notEqual: validation.messages.notEqual('PIN baru tidak boleh sama dengan PIN lama')
				},
				'nc_pin': {
					required: validation.messages.required(),
					equalTo: validation.messages.equalTo()
				/* CR20976 Security Keagenan Start */
				},
				'otp': {
					required: validation.messages.required()
				}
			}
			validation.validateMultiple('changePIN', valRules, valMessages);
		},
		changePINOTP:function() {
			var valRules = {
				'o_pin': {
					required: true
				},
				'n_pin': {
					required: true,
					pwcheck_alfanum:true,
					notEqual: '#o_pin'
				},
				'nc_pin': {
					required: true,
					equalTo:'#n_pin'
				}
			};
			
			var valMessages = {
				'o_pin': {
					required: validation.messages.required()
						
				},
				'n_pin': {
					required: validation.messages.required(),
					pwcheck_alfanum: validation.messages.pwcheck_alfanum(),
					notEqual: validation.messages.notEqual('PIN baru tidak boleh sama dengan PIN lama')
				},
				'nc_pin': {
					required: validation.messages.required(),
					equalTo: validation.messages.equalTo()
				}
			}
			validation.validateMultiple('changePINOTP', valRules, valMessages);
		},
		/* CR20976 Security Keagenan End */
		changePassword:function() {
			var valRules = {
				'o_password': {
					required: true
				},
				'n_password': {
					required: true,
					pwcheck_alfanum:true,
					notEqual: '#o_password'
				},
				'nc_password': {
					required: true,
					equalTo:'#n_password'
				/* CR20976 Security Keagenan Start */
				},
				'otp': {
					required: true
				}
				/* CR20976 Security Keagenan End */
			};
			
			var valMessages = {
				'o_password': {
					required: validation.messages.required()
						
				},
				'n_password': {
					required: validation.messages.required(),
					pwcheck_alfanum: validation.messages.pwcheck_alfanum(),
					notEqual: validation.messages.notEqual('Password baru tidak boleh sama dengan password lama')
				},
				'nc_password': {
					required: validation.messages.required(),
					equalTo: validation.messages.equalTo()
				/* CR20976 Security Keagenan Start */
				},
				'otp': {
					required: validation.messages.required()
				}
			}
			validation.validateMultiple('changePassword', valRules, valMessages);
		},
		changePasswordOTP:function() {
			var valRules = {
				'o_password': {
					required: true
				},
				'n_password': {
					required: true,
					pwcheck_alfanum:true,
					notEqual: '#o_password'
				},
				'nc_password': {
					required: true,
					equalTo:'#n_password'
				}
			};
			
			var valMessages = {
				'o_password': {
					required: validation.messages.required()
						
				},
				'n_password': {
					required: validation.messages.required(),
					pwcheck_alfanum: validation.messages.pwcheck_alfanum(),
					notEqual: validation.messages.notEqual('Password baru tidak boleh sama dengan password lama')
				},
				'nc_password': {
					required: validation.messages.required(),
					equalTo: validation.messages.equalTo()
				}
			}
			validation.validateMultiple('changePasswordOTP', valRules, valMessages);
		},
		/* CR20976 Security Keagenan End */
		multipleForm:function() {
			var valRules = {
				'text1': {
					required: true
				},
				'dropdown_0': {
					required: true
				},
				'checkbox[]': {
					required:true,
					minlength:2,
					maxlength:3
				},
				'radio_1': {
					required: true
				},
				'textarea': {
					required: true
				},
				'textarea1': {
					required: true
				}
			};
			
			var valMessages = {
				'text1': {
					required: validation.messages.required()
				},
				'dropdown_0': {
					required: validation.messages.required()
				},
				'checkbox[]': {
					required: validation.messages.required(),
					minlength: validation.messages.minlength(2),
					maxlength: validation.messages.maxlength(3)
				},
				'radio_1': {
					required: validation.messages.required()
				},
				'textarea': {
					required: validation.messages.required()
				},
				'textarea1': {
					required: validation.messages.required()
				}
			}
			validation.validateMe('form_1', valRules, valMessages);
			
			var valRules2 = {
				'text2': {
					required: true
				}
			};
			
			var valMessages2 = {
				'text2': {
					required: validation.messages.required()
				}
			}
			validation.validateMe('form_2', valRules2, valMessages2);
			
			var valRules3 = {
				'text3': {
					required: true
				}
			};
			
			var valMessages3 = {
				'text3': {
					required: validation.messages.required()
				}
			}
			validation.validateMe('form_3', valRules3, valMessages3);
			
			// Initialise
			var multiFormItem = new ui.multiForm.submit('tab2');
		},
		transfer:function() {
			
			// Initialise
			var multiFormItem = new ui.multiForm.submit('transfer');
		},
		singleForm:function() {
			var valRules3 = {
				'tab_4_1_text': {
					required: true
				}
			};
			
			var valMessages3 = {
				'tab_4_1_text': {
					required: validation.messages.required()
				}
			}
			validation.validateMe('form_4', valRules3, valMessages3);
		/* CR25900 Rekonsiliasi Agen Start */
		},
		formUploadRekon:function() {
			var valRules = {
				'file': {
					required: true
				},
				'tgl': {
					required: true,
				}
			};
			var valMessages = {
				'file': {
					required: validation.messages.required()
						
				},
				'tgl': {
					required: validation.messages.required(),
				}
			}
			validation.validateMe('formUploadRekon', valRules, valMessages);
		/* CR25900 Rekonsiliasi Agen End */
		}
	}
	
	var interactive = {
		init:function() {
			$('input[type=radio].interactive').on('change', function() {
				var data = $(this).attr('data-dropdown');
				interactive.change(data);
			});
		},
		dropdown:function() {
			$(document).on('change', '.nio_select.interactive', function() {
				var selected = $(this).find('option:selected');
				if ($(selected).attr('data-dropdown')) {
					var data = $(selected).attr('data-dropdown');
					var id = $(this).attr('id');
					interactive.change(data, id);
				}
			});
		},
		change:function(data, id) {
			if (data) {
				var toList = data.split('|');
				var dropdownId = '#' + toList[toList.length - 1];
				var select = '<option value="">'+toList[0]+'</option>';
				//console.log('interactive changed');
				if (toList[1] !== 'reset') {
					toList.shift();
					toList.pop();
					$.each(toList, function(key, val) {
						select = select + '<option value="'+val.split(':')[0]+'">'+val.split(':')[1]+'</option>';
					});
					$(dropdownId).empty().append(select);
					nio_dropdown.reinit(dropdownId);
				}
				else {
					$(dropdownId).empty().append(select);
					nio_dropdown.reinit(dropdownId);
				}
				$('#' + id).show().focusout().hide();
			}
		}
	}
	
	var charts = {
		init:function() {
			if ($('.isChart').length) {
				var data = [
					{ label: "Registrasi",  data: 10, color: "#ff9900"},
					{ label: "Setoran",  data: 30, color: "#faaa4a"},
					{ label: "Tarik Tunai",  data: 90, color: "#fcbe76"},
					{ label: "Transfer",  data: 70, color: "#fed29f"},
					{ label: "Pembelian",  data: 80, color: "#fee6cb"},
					{ label: "Pembayaran",  data: 110, color: "#fbc814"}
				];
				/*var data2 = [
					{ label: "Registrasi",  data: 10, color: "#01526a"},
					{ label: "Setoran",  data: 30, color: "#017b9f"},
					{ label: "Tarik Tunai",  data: 90, color: "#00a4d3"}
				];
				var pie2 = new charts.pie('pie_2', data2);*/
				if(window.location.pathname != '/bansos/dashboard'){
					$.ajax({
						url:app.link() + 'laporan/jumlahAllTx',
						type:'get',
						success:function(data) {
							if (data.allTx !== undefined) {
								if (data.allTx.length) {
									var pie = new charts.pie('pie', data.allTx);
								}
							}
							else {
								$('#pie').append('<p>No Transaction</p>')
							}
							if (data.lakupandai !== undefined) {
								if (data.lakupandai.length) {
									var pie = new charts.pie('pie_2', data.lakupandai);
								}
							}
							else {
								$('#pie_2').append('<p>No Transaction</p>')
							}
						}
					})
				}
				/*
				var d1 = [];
				for (var i = 0; i <= 10; i += 1) {
					d1.push([i, parseInt(Math.random() * 30)]);
				}
				var d1 = {color:'#ff9900', data:[], 'label':'Registrasi'};
				for (var i = 0; i <= 31; i += 1) {
					d1['data'].push([i+1, parseInt(Math.random() * 30)]);
				}
				var d2 = {color:'#cc0033', data:[], 'label':'Setoran'};
				for (var i = 0; i <= 31; i += 1) {
					d2['data'].push([i+1, parseInt(Math.random() * 30)]);
				}
				var d3 = {color:'#02ca02', data:[], 'label':'Tarik Tunai'};
				for (var i = 0; i <= 31; i += 1) {
					d3['data'].push([i+1, parseInt(Math.random() * 30)]);
				}
				var dataChart = [d1,d2,d3];
				var chart = new charts.chart('chart_1', dataChart,31);*/
			}
		},
		chart:function(id, data,daysOfMonth) {
			this.id = id;
			var placeholder = '#' + this.id;
			$.plot(placeholder, data, {
				series: {
					stack: 0,
					lines: {
						show: true,
						fill: false,
						steps: false
					},
					points: {
						show : true
					},
					bars: {
						show: false,
						barWidth: 0.6
					}
				},
				grid: {
					/*markings: [{ 
						xaxis: { from: 0, to: 100 }, yaxis: { from: 10, to: 10 }, color: "#bb0000" 
					}]*/
				},
				xaxis: {
					min:1,
					label:'Hello',
					ticks:daysOfMonth,
					max:daysOfMonth,
					tickDecimals:0
				}
			});
		},
		pie:function(id, data) {
			this.id = id;
			var placeholder = $('#' + this.id);
			//console.log(data);
			$.plot(placeholder, data, {
				series: {
					pie: { 
						show: true,
						radius: 1,
						label: {
							show: false,
							radius: 3/4,
							background: {
								opacity: 0.5,
								color:'#fff'
							}
						}
					}
				},
				grid: {
					hoverable: true
				},
				legend: {
					show: true
				}
			});
			
			placeholder.on("plothover", function(event, pos, obj) {
				var previousPoint = null;
				if (!obj) {
					previousPoint = null;
					$('.hoverNotice').remove();
					return;
				}
				else {
					if (previousPoint != obj.datapoint) {
						previousPoint = obj.datapoint;
						var percent = parseFloat(obj.series.percent).toFixed(2);
						var data = obj.datapoint[1][0][1];
						var x = pos['pageX'];
						var y = pos['pageY'];
						$('.hoverNotice').remove();
						var message = obj.series.label + ": " + data + " (" + percent + "%)";
						$('body').append('<div class="hoverNotice" style="top:'+y+'px;left:'+x+'px;background:' + obj.series.color + ';color:'+obj.series.textColor+'";>'+message+'</div>');
					}
					
				}
			});
		}
	}



	var handleAddressDetail = {
		id: 
			{
				'superagent':
					[
						'alamat_propinsi',
						'alamat_kabupaten_kota',
						'alamat_kecamatan',
						'alamat_kelurahan',
						'alamat_kodepos',
						'kode_cabang',
						'kode_wil_bi'
					],
				'agent':
					[
						'openAccount_propinsi',
						'openAccount_kabupatenKota',
						'openAccount_Kecamatan',
						'openAccount_desaKelurahan',
						'openAccount_kodePos'
					]
			},
		items:function(id, type) {
			var hello = 
			{
				'alamat_propinsi':
					[
						{'id':id[1], 'title':'Pilih Kabupaten'},
						{'id':id[2], 'title':'Pilih Kecamatan'},
						{'id':id[3], 'title':'Pilih Desa/Kelurahan'},
						{'id':id[4], 'title':'Pilih Kode Pos'},
						{'id':id[5], 'title':'Pilih Cabang Padanan'},
						{'id':id[6], 'title':'Pilih Kode Wil BI'}
					],
				'alamat_kabupaten_kota':
					[
						{'id':id[2], 'title':'Pilih Kecamatan'},
						{'id':id[3], 'title':'Pilih Desa/Kelurahan'},
						{'id':id[4], 'title':'Pilih Kode Pos'},
						{'id':id[6], 'title':'Pilih Kode Wil BI'}
					],
				'alamat_kecamatan':
					[
						{'id':id[3], 'title':'Pilih Desa/Kelurahan'},
						{'id':id[4], 'title':'Pilih Kode Pos'}
					],
				'alamat_kelurahan':
					[
						{'id':id[4], 'title':'Pilih Kode Pos'}
					]
			};
			
			return hello[type];
		},
		init:function() {
			//console.log(handleAddressDetail.items(handleAddressDetail.id['outlet'], 'alamat_propinsi'));
		}
	}
	
	var handleProv = {
		init:function() {
			handleProv.selectPropinsi();
			/* CR18946 KUR Mikro Start */
			handleProv.selectElo();
			/* CR18946 KUR Mikro End */
			/* CR29126 BPJS TK BPU Start */
			handleProv.selectLokasiKerja();
			handleProv.selectKantorCabang();
			/* CR29126 BPJS TK BPU End */ 
		},
		/* CR29126 BPJS TK BPU Start */
		selectKantorCabang:function(){
			$(document).on('change', '.nio_select.kantorCabang', function() {
				var value = $(this).val();
				var id = $(this).attr('id');
				var dep;
				var data;
				var url = 'getKantorCabangBPJS';
				switch (id) {
					case 'kantor_cabangProvinsi':
						dep = [
							{'id':'kantor_cabangKabupaten','title':'Pilih Kabupaten/Kota'},
							{'id':'lokasi_kantorCabang','title':'Pilih Kantor'}
						];
						data =[ 
								{
									'link':'getListKantorCabang',
									'param':value,
									'level':2,
									'child':{
										id:'kantor_cabangKabupaten',
										title:'Kabupaten/Kota'
									}
								}
							];
						break;
					case 'kantor_cabangKabupaten':
						dep = [
							{'id':'lokasi_kantorCabang','title':'Pilih Kantor'}
						];
						data =[ 
								{
									'link':'getListKantorCabang',
									'param':value,
									'level':3,
									'child':{
										id:'lokasi_kantorCabang',
										title:'Kantor'
									}
								}
							];
						break;
				}
				
				handleProv.ajaxCall2(app.link() + url, {'data':data}, dep);
			});
		},
		selectLokasiKerja:function(){
			$(document).on('change', '.nio_select.lokasiKerja', function() {
				var value = $(this).val();
				var id = $(this).attr('id');
				var dep;
				var data;
				var url = 'getWilayahBPJS';
				switch (id) {
					case 'bpjs_provinsi':
						dep = [
							{'id':'bpjs_kotaKabupaten','title':'Pilih Kabupaten/Kota'}
						];
						data =[ 
								{
									'link':'getListKabByProp',
									'param':value,
									'child':{
										id:'bpjs_kotaKabupaten',
										title:'Kabupaten/Kota'
									}
								}
							];
						console.log(data);
						break;
				}
				
				handleProv.ajaxCall2(app.link() + url, {'data':data}, dep);
			});
		},
		/* CR29126 BPJS TK BPU End */
		/* CR18946 KUR Mikro Start */
		selectElo:function(){
			$(document).on('change', '.nio_select.elo', function() {
				var value = $(this).val();
				var id = $(this).attr('id');
				var dep;
				var data;
				var url = 'getWilayahElo';
				switch (id) {
					case 'kurmikro_propinsi':
						dep = [
							{'id':'kurmikro_kabupatenKota','title':'Pilih Kabupaten/Kota'},
							{'id':'kurmikro_Kecamatan','title':'Pilih Kecamatan'}
						];
						data =[ 
								{
									'link':'getKotaByPropinsiELO',
									'param':value,
									'child':{
										id:'kurmikro_kabupatenKota',
										title:'Kabupaten/Kota'
									}
								}
							];
						break;
					case 'kurmikro_kabupatenKota':
						dep = [
							{'id':'kurmikro_Kecamatan','title':'Pilih Kecamatan'},
						];
						data = [
								{
									'link':'getKecamatanByKotaELO',
									'param':value,
									'child':{
										id:'kurmikro_Kecamatan',
										title:'Kecamatan'
									}
								}
							];
						break;
					case 'kurmikro_economiSector':
						dep = [
						{'id':'kurmikro_economiSubSector','title':'Pilih Sub Sektor Ekonomi'}
						];
						data = [
								{
									'link':'getSubSektorEkonomiELO',
									'param':value,
									'child':{
										id:'kurmikro_economiSubSector',
										title:'Sub Sektor Ekonomi'
									}
								}
							];
						break;
					case 'company_propinsi':
						dep = [
						{'id':'company_kabupatenKota','title':'Pilih Kabupaten/Kota'},
						{'id':'company_Kecamatan','title':'Pilih Kecamatan'},
						{'id':'company_nearestBranch','title':'Pilih Cabang BNI Terdekat'},
						];
						data = [
								{
									'link':'getKotaByPropinsiELO',
									'param':value,
									'child':{
										id:'company_kabupatenKota',
										title:'Kabupaten/Kota'
									}
								}							];
						break;
					case 'company_kabupatenKota':
						dep = [
							{'id':'company_Kecamatan','title':'Pilih Kecamatan'},
							{'id':'company_nearestBranch','title':'Pilih Cabang BNI Terdekat'},
						];
						data = [
								{
									'link':'getKecamatanByKotaELO',
									'param':value,
									'child':{
										id:'company_Kecamatan',
										title:'Kecamatan'
									}
								}
							];
						break;
					case 'company_Kecamatan':
						dep = [
							{'id':'company_nearestBranch','title':'Pilih Cabang BNI Terdekat'},
						];
						data = [
								{
									'link':'getCabangELO',
									'param':value,
									'child':{
										id:'company_nearestBranch',
										title:'Cabang BNI Terdekat'
									}
								}

							];
						break;
					case 'bail_propinsi':
						dep = [
						{'id':'bail_kabupatenKota','title':'Pilih Kabupaten/Kota'},
						];
						data = [
								{
									'link':'getKotaByPropinsiELO',
									'param':value,
									'child':{
										id:'bail_kabupatenKota',
										title:'Kabupaten/Kota'
									}
								}
							];
						break;
					case 'bail_kabupatenKota':
						dep = [
						{'id':'bail_Kecamatan','title':'Pilih Kecamatan'}
						];
						data = [
								{
									'link':'getKecamatanByKotaELO',
									'param':value,
									'child':{
										id:'bail_Kecamatan',
										title:'Kecamatan'
									}
								}
							];
						break;
					case 'bail_kabupatenKota':
						dep = [
						{'id':'bail_Kecamatan','title':'Pilih Kecamatan'}
						];
						data = [
								{
									'link':'getKecamatanByKotaELO',
									'param':value,
									'child':{
										id:'bail_Kecamatan',
										title:'Kecamatan'
									}
								}
							];
						break;
				}
				
				handleProv.ajaxCall2(app.link() + url, {'data':data}, dep);
			});
		},
		/* CR18946 KUR Mikro End */
		selectPropinsi:function() {
			$(document).on('change', '.nio_select.propinsi', function() {
				var data = {};
				var value = $(this).val();
				var id = $(this).attr('id');
				//console.log(value)
				if (value !== '' && $(this).hasClass('kantor')) {
					if (id == 'kantor_cabang') {
						var dep = [{'id':'alamat_kantor_cabang2', 'title':''}, {'id':'alamat_kantor_cabang', 'title':''}];
						var alamat = $('#' + id + ' option[value=' + value + ']').attr('data-alamat');
						$('#alamat_kantor_cabang2').val(alamat);
						$('#alamat_kantor_cabang').val(alamat);
					}
				}
				if (value !== '' && $(this).hasClass('propinsi')) {
					// Mitra
					switch (id) {
						case 'alamat_propinsi':
						case 'alamat_kabupaten_kota':
						case 'alamat_kecamatan':
						case 'alamat_kelurahan':
							var key = 'superagent';
							break;
						case 'openAccount_propinsi':
						case 'openAccount_kabupatenKota':
						case 'openAccount_Kecamatan':
						case 'openAccount_desaKelurahan':
							var key = 'agent';
							break;
					}
					
					
					if (id == 'alamat_propinsi' || id == 'openAccount_propinsi') {
						var dep = handleAddressDetail.items(handleAddressDetail.id[key], 'alamat_propinsi');
						data['req'] = [
							{ 'type':'propinsi', 'id':handleAddressDetail.id[key][1], 'val':value }
						];
					}
					
					
					if (id == 'alamat_kabupaten_kota') {
						var jenis = $(this).children('option[value="' + value + '"]').attr('data-jenis');
						var kabupaten = $(this).children('option[value="' + value + '"]').attr('data-kabupaten');
						
						var dep = handleAddressDetail.items(handleAddressDetail.id[key], 'alamat_kabupaten_kota');
						/*IR11708 Fixing Error Perubahan Jenis Lokasi Usaha - Start*/
						if($('#add_agen').length) {
							data['req'] = [
								{ 'type':'kabupaten', 'id':handleAddressDetail.id[key][2], 'data-jenis':jenis, 'data-kabupaten':kabupaten, 'val':value },
								{ 'type':'kabupaten2', 'id':handleAddressDetail.id[key][5], 'data-jenis':jenis, 'data-kabupaten':kabupaten, 'val':value },
								{ 'type':'kabupaten3', 'id':handleAddressDetail.id[key][6], 'data-jenis':jenis, 'data-kabupaten':kabupaten, 'val':value }
							];
						} else {
							data['req'] = [
							{ 'type':'kabupaten', 'id':handleAddressDetail.id[key][2], 'data-jenis':jenis, 'data-kabupaten':kabupaten, 'val':value }
							
							];
						}
						/*IR11708 Fixing Error Perubahan Jenis Lokasi Usaha - End*/
					}

					if (id == 'openAccount_kabupatenKota') {
						var jenis = $(this).children('option[value="' + value + '"]').attr('data-jenis');
						var kabupaten = $(this).children('option[value="' + value + '"]').attr('data-kabupaten');
						
						var dep = handleAddressDetail.items(handleAddressDetail.id[key], 'alamat_kabupaten_kota');
						data['req'] = [
							{ 'type':'kabupaten', 'id':handleAddressDetail.id[key][2], 'data-jenis':jenis, 'data-kabupaten':kabupaten, 'val':value }
						];
					}
					
					if (id == 'alamat_kecamatan' || id == 'openAccount_Kecamatan') {
						var propinsi = $('#' + handleAddressDetail.id[key][0]).val();
						var kabOrKota = $('#' + handleAddressDetail.id[key][1]).children('option[value="' + $('#' + handleAddressDetail.id[key][1]).val() + '"]').attr('data-jenis');
						var kabupaten = $('#' + handleAddressDetail.id[key][1]).children('option[value="' + $('#' + handleAddressDetail.id[key][1]).val() + '"]').attr('data-kabupaten');
						
						var dep = handleAddressDetail.items(handleAddressDetail.id[key], 'alamat_kecamatan');
						
						data['req'] = [
							{ 'type':'kecamatan', 'id':handleAddressDetail.id[key][3], 'data-propinsi':propinsi, 'data-jenis':kabOrKota, 'data-kabupaten':kabupaten, 'val':value }
						];
					}
					
					if (id == 'alamat_kelurahan' || id == 'openAccount_desaKelurahan') {
						var propinsi = $('#' + handleAddressDetail.id[key][0]).val();
						var kabOrKota = $('#' + handleAddressDetail.id[key][1]).children('option[value="' + $('#' + handleAddressDetail.id[key][1]).val() + '"]').attr('data-jenis');
						var kabupaten = $('#' + handleAddressDetail.id[key][1]).children('option[value="' + $('#' + handleAddressDetail.id[key][1]).val() + '"]').attr('data-kabupaten');
						var kecamatan = $('#' + handleAddressDetail.id[key][2]).val();
						
						var dep = handleAddressDetail.items(handleAddressDetail.id[key], 'alamat_kelurahan');
						
						data['req'] = [
							{ 'type':'kelurahan', 'id':handleAddressDetail.id[key][4], 'data-propinsi':propinsi, 'data-jenis':kabOrKota, 'data-kabupaten':kabupaten, 'data-kecamatan':kecamatan, 'val':value }
						];
					}
					
					handleProv.ajaxCall2(app.link() + 'getKabupaten', data, dep);
				}
			});
		},
		ajaxCall2: function(url, data, dep) {
			$.each(dep, function(key, val) {
				//console.log(val);
				//console.log($('#' + val['id']).is('select'))
				if ($('#' + val['id']).is('select')) {
					$('#' + val['id']).children('option').not(':first').remove();
					$('#' + val['id'] + '_dropdown ul').children('li').not(':first').remove();
					$('#' + val['id'] + '_dropdown').find('.selectedText').text(val['title']);
				}
				else {
					$('#' + val['id']).val('');
				}
			});
			
			
			$.ajax({
				url:( app.overwrite ? url.replace('http:', 'https:') : url ),
				data:data,
				type:'POST',
				success:function(data) {
					//console.log(data);
					$.each(data, function(key, val) {
						
						////console.log('Key: ' + key + ' Val: ' + val);
						var dropdown = '#' + key;
						$(dropdown).empty();
						$(dropdown).append(val);
						nio_dropdown.reinit(dropdown);
					});
				//	$(dropdown).empty();
				//	$(dropdown).append(data);
				//	nio_dropdown.reinit(dropdown);
				}
			});
		}
	}

	var broadcast = {
		retrieve:function() {
			//console.log('get');
			$.ajax({
				url:app.link() + 'broadcast/view',
				type:'get',
				global:false,
				success:function(data) {
					//console.log(data);
					if (data.bcData !== undefined) {
						if (data.bcData.length > 0) {
							$.each(data.bcData, function(key, val) {
								var template = '<li>' +
										( val['read'] == "0" ? '<span style="margin-right:10px;" class="badge red">Unread</span>' : '') + '<a href="'+val['link']+'">'+val['judul']+'</a>' +
										'<p class="meta">'+val['meta']+'</p>' +
									'</li>';
								$('#notifications ul.notifications').append(template);
							});
							if (data.count > 0) {
								if (data.count > 99) {
									data.count = '99+'
								}
								$('#notif_trigger').addClass('hasNotif').attr('data-count', data.count);
							}
							else if (data.count < 0) {
								$('#notifications ul.notifications').append('<p>Problem retrieving broadcast.</p>');
							}
						}
						else {
							$('#notifications ul.notifications').append('<p><i class="fa fa-info-circle"></i> No Broadcast found</p>');
						}
					}
				}
			});
		}
	}
	
	var position = {
		init:function() {
			if ($('#lat').length && $('#lng').length) {
				map.latLng();
			}
		}
	}

	var quickEdit = {
		option: {
			currDetail:{},
			reset:function(id) {
				var newSelected = $('#' + id).find('option:selected');
				/*$(newSelected).removeAttr('selected');
				$('#' + id + ' option:nth-child('+quickEdit.option.currDetail[id]['index'] +')').attr('selected');
				console.log(quickEdit.option.currDetail[id]['index']);
				var oldSelected = $('#' + id).find('option:selected').text();
				console.log(oldSelected);*/
				$('#' + id + '_dropdown ul.dropdown_list li:nth-child('+quickEdit.option.currDetail[id]['index']+') a').click();

				//nio_dropdown.update(id, );
			},
			init:function() {
				$('.editableField').each(function() {
					var id = $(this).attr('id');
					var curr = $(this).find('option[selected]');
					quickEdit.option.currDetail[id] = { index : $(curr).index() + 1 , value : $(curr).val() }
				});

				$('.editableField').on('change', function(e) {
					var value = $(this).val();
					var id = $(this).attr('id');
					// console.log('Old Value: ' + quickEdit.option.currDetail[id]['value'] + ' New Value: ' + value);
					$('#confirmation').find('.modalClose').attr('data-change', 'quickEdit.option.reset|' + id);
					if (value !== '' && value !== quickEdit.option.currDetail[id]['value']) {
						ui.handleAlert.confirm('Confirm', '<p>'+$(this).attr('data-alert')+'</p>');
						if ($('#confirmation').is(':visible')) {
							$('#confirmation').off().on('click', '.confirmOk', function(e) {
								quickEdit.option.change(id, value);
								$('#cancelledChange').removeAttr('id');
							});
						}
					}
				});
				//console.log(quickEdit.option.currDetail);
			},
			change:function(id, value) {
				switch (id) {
					case 'kode_cabang_new':
						var link = 'agent/changeCabang'
						break;
					case 'kode_wil_bi_new':
						var link = 'agent/changeKWB'
						break;
					default:
						//console.log('method not supported');
						return false;
				}
				$('#confirmation .modalClose').removeAttr('data-change');
				$.ajax({
					url:app.link() + link,
					type:'post',
					data: { id : $('#c_id').val(), kode_cabang : value },
					success:function(data) {
						//console.log(data)
						ui.handleModal.close('confirmation');
						if (data.code == 1) {
							var curr = $('#' + id).find('option[value='+value+']');
							quickEdit.option.currDetail[id] = { index : $(curr).index() + 1 , value : $(curr).val() }
							ui.handleAlert.alert('Informasi', '<p>Kode Cabang telah diganti.</p>');
							$('#' + id.split('_new')[0] + '_check').val(value);
						}
						else {
							ui.handleAlert.alert(data.messages.title, data.messages.message);
						}
					}
				})
			}
		},
		init:function() {
			quickEdit.option.init();
			$('.quickEdit').on('click', function(e) {
				e.preventDefault();
				var btn = $(this);
				var type = $(this).attr('data-attr');
				var oldVal = $(this).attr('data-value');
				//console.log(type);
				switch (type) {
					case 'kode_cabang':
						quickEdit.showEditBox(btn,type,oldVal);
						break;
					case 'kode_wil_bi':
						quickEdit.showEditBox(btn,type,oldVal);
						//console.log('edit kode wil bi');
						break;
					default:
						//console.log('method not supported');
						return false;
				}
				e.stopPropagation();
				e.stopImmediatePropagation();
			});
		},
		showEditBox:function(btn, type, oldVal) {
			function ucwords(str,force){
				str=force ? str.toLowerCase() : str;  
				return str.replace(/(\b)([a-zA-Z])/g,
				function(firstLetter){
					return   firstLetter.toUpperCase();
				});
			}
			if (!$('#edit_' + type).length) {
				var editBox = '<div class="editBox input withRightIcon">' +
					'<input type="text" id="edit_'+type+'" name="'+type+'" placeholder="'+ucwords(type.replace('_', ' '))+'" value="'+oldVal+'" />' +
					'<a class="rightIcon" title="submit"><i class="fa fa-check"></i></a>' +
				'</div>';
				$(btn).parents('p').hide();
				$(btn).parents('.input').append(editBox);

				$('#edit_' + type).on('change keyup input', function() {
					if (type == 'kode_cabang') {
						//console.log('kode_cabang')
						var inputRule = 'number|required|min:3|max:3';
					}
					else {
						var inputRule = 'number|required|min:4|max:4'
					}
					var validate = simpleValidate.init('edit_' + type, inputRule);
				})

				$('#edit_' + type).next('a').on('click', function() {
					//console.log('clicked');
					if (type == 'kode_cabang') {
						//console.log('kode_cabang')
						var inputRule = 'number|required|min:3|max:3';
					}
					else {
						var inputRule = 'number|required|min:4|max:4'
					}
					var validate = simpleValidate.init('edit_' + type, inputRule);
					if (validate != false) {
						quickEdit.ajaxCall(type, btn);
					}
				});
			}
			
		},
		ajaxCall:function(type, btn) {
			switch (type) {
				case 'kode_cabang':
					var link = 'agent/changeCabang'
					break;
				case 'kode_wil_bi':
					var link = 'agent/changeKWB'
					break;
				default:
					//console.log('method not supported');
					return false;
			}
			//console.log(link);
			var value = $('#edit_' + type).val();
			$.ajax({
				url:app.link() + link,
				type:'post',
				data: { id : $('#c_id').val(), kode_cabang : value },
				success:function(data) {
					//console.log(data)
					if (data.code == 1) {
						var editBox = $('#edit_' + type).parents('.editBox');
						var editP = $(editBox).prev('p').children('span').text(value).end().show();
						if ($('#' + type + '_check').length) {
							$('#' + type + '_check').val(value);
						}
						$(editBox).remove();
						$(btn).attr('data-value', value)
					}
					else {
						ui.handleAlert.alert(data.messages.title, data.messages.message);
					}
				}
			})
		}
	}

	var simpleValidate = {
		init:function(inputVal, rules) {
			var errorId = [];
			var errors = [];
			var validate = rules.split('|');
			var inputId = inputVal;
			var inputVal = $('#'+inputVal).val();
			$('.inputGroup .alert.error').remove();
			$.each(validate, function(key, val) {
				if (val.indexOf(":") >= 0) {
					var val = val.split(':');
					if (val[0] == 'max') {
						if (inputVal.length > val[1]) {
							if ($.inArray(inputId, errorId) == '-1') {
								errors.push({'id':inputId, 'message':validation.messages.maxlength(val[1]) });
								errorId.push(inputId);
							}
						}
					}
					if (val[0] == 'min') {
						if (inputVal.length < val[1]) {
							if ($.inArray(inputId, errorId) == '-1') {
								errors.push({'id':inputId, 'message':validation.messages.minlength(val[1]) });
								errorId.push(inputId);
							}
						}
					}
				}
				else {
					if (val == 'number') {
						if (isNaN(inputVal)) {
							if ($.inArray(inputId, errorId) == '-1') {
								errors.push({'id':inputId, 'message':validation.messages.digits() });
								errorId.push(inputId);
							}
						}
					}
					if (val == 'required') {
						if (inputVal == '') {
							if ($.inArray(inputId, errorId) == '-1') {
								errors.push({'id':inputId, 'message':validation.messages.required() });
								errorId.push(inputId);
							}
						}
					}
				}
			});
			if (errors.length) {
				//console.log('error found');
				$.each(errors, function(ke, ve) {
					var error = '<span class="alert error">' +
						'<label class="error">' + ve['message'] + '</label>' +
						'</span>';
					$('#' + ve['id']).parents('.inputGroup').append(error);
				});
				return false;
			}
		}
	}

	var checkFiles = {
		init:function() {
			if (validation.FileApiSupported()) {
				$('.added_photo').on('change', function() {
					//console.log($(this)[0].files)
					$(this).show().focusout().hide();
				});
			}
		}
	}

	checkSession = {
		idler:0,
		timeout:600, // in seconds = 10 minutes
		stopWatch:function() {
			var seconds = 0, minutes = 0, hours = 0,
		    t;

			function add() {
			    checkSession.idler++;
			    //console.log('Time: ' + checkSession.idler);
			    if (checkSession.idler > checkSession.timeout) {
			    	checkSession.action();
			    } 
			    else {
				    timer();
				}
			}
			function timer() {
				t = setTimeout(add, 1000);
			}
			timer();
		},
		stat:false,
		init:function() {
			checkSession.stopWatch();
			$(document).on('mousemove keypress', function() {
				if (checkSession.idler > checkSession.timeout || checkSession.idler > checkSession.timeout - 10) { //2번유형가 있어. 확인과 지키 
					checkSession.action();
				}
			});
		},
		action:function() {
			if (!checkSession.stat) {
				checkSession.stat = true;
				$.ajax({
					url:app.link() + 'checkSession',
					global: false,
					type:'get',
					success:function(data) {
						if (data == '1') {
							checkSession.idler = 0;
							checkSession.stat = false;
							//console.log('세션 데이터가 다시 시작했어요');
						}
						else {
							ui.handleAlert.alert('Session Expired', '<p>You have been inactive for a while and your session expired. Please refresh the page to login.</p>');
							$('.alertClose').off('click').on('click', function(e) {
								e.preventDefault();
								location.reload();
								ui.handleModal.close('alert');
								e.stopImmediatePropagation();
								e.stopPropagation();
							});
						}
					}
				});
			}
		}
	}
	/* CR24815 Enhancement User Management Aplikasi Agen46 - Start */
	checkSessionBNI = {
		idler:0,
		timeout:600, // in seconds = 10 minutes
		stopWatch:function() {
			var seconds = 0, minutes = 0, hours = 0,
		    t;

			function add() {
			    checkSessionBNI.idler++;
			    // console.log('Time: ' + checkSessionBNI.idler + ' ' + checkSessionBNI.timeout);
			    if (checkSessionBNI.idler > checkSessionBNI.timeout) {
			    	checkSessionBNI.action();
			    } 
			    else {
				    timer();
				}
			}
			function timer() {
				t = setTimeout(add, 1000);
			}
			timer();
		},
		stat:false,
		init:function() {
			checkSessionBNI.stopWatch();
			$(document).on('mousemove keypress', function() {
				if (checkSessionBNI.idler > checkSessionBNI.timeout || checkSessionBNI.idler > checkSessionBNI.timeout - 10) { //2번유형가 있어. 확인과 지키 
					checkSessionBNI.action();
				}
			});
		},
		action:function() {
			if (!checkSessionBNI.stat) {
				checkSessionBNI.stat = true;
				$.ajax({
					url:app.link() + 'checkSessionBNI',
					global: false,
					type:'get',
					success:function(data) {
						console.log(data);
						if (data == '1') {
							checkSessionBNI.idler = 0;
							checkSessionBNI.stat = false;
							//console.log('세션 데이터가 다시 시작했어요');
						}
						else {
							ui.handleAlert.alert('Session Expired', '<p>You have been inactive for a while and your session expired. Please refresh the page to login.</p>');
							$('.alertClose').off('click').on('click', function (e) {
								e.preventDefault();
								location.href = app.link() + '/login/BNI';
								ui.handleModal.close('alert');
								e.stopImmediatePropagation();
								e.stopPropagation();
							});
						}
					}
				});
			}
		}
	}
	/* CR24815 Enhancement User Management Aplikasi Agen46 - End */
	var handleMultiIcons = {
		init:function() {
			if ($('div.multi').length) {
				$('div.multi').each(function() {
					var ele = $(this);
					var idx = 0;
					var icons = $(this).children('img');
					var current = $(this).children('img.active');
				
					$(ele).css('border-color', $(current).attr('data-color'));
					var start = setInterval(function() {
						idx++;
						if (idx > icons.length - 1) {
							idx = 0;
						}
						$(ele).css('border-color', $(icons[idx]).attr('data-color'));
						$(icons).removeClass('active');
						$(icons[idx]).addClass('active');

					},2000);
				});
			}
		}
	}

	return {
		init:function() {
			window.onbeforeunload=function(){
				if ($('form.processing_form').length) {
					return "Transaksi sedang berjalan. Apakah Anda yakin untuk keluar dari halaman ini?";
				}
			}
			$('body').hide().fadeIn('slow');
			position.init();
			handleMultiIcons.init();
			charts.init();
			checkFiles.init();
			if ($('.nio_select').length) {
				nio_dropdown.create();
				interactive.dropdown();
			}
			ui.ajax.common();
			debugMe.init();
			calendar.init();
			dataTables.init();
			
			windowResizer();
			ui.breadcrumb.init();
			ui.menu.init();
			ui.input.init();
			keyboardShortcut.init();
			handleModalClickers.init();
			handleWindowHeight.init();
			windowActions.resize();
			ui.responsiveMenu.init();
			ui.hasMoreNav.init();
			smallFn.init();
			/* CR24815 Enhancement User Management Aplikasi Agen46 - Start */
			if ($('#divBNI').length) {
				checkSessionBNI.init();
			}else{
				checkSession.init();
			}
			/* CR24815 Enhancement User Management Aplikasi Agen46 - End */
			/* Initialize Tabbing
			** Custom call:
			** var tab_2 = new ui.portletTabs.createTab('tab_2');
			*/
			// 
			if ($('.withTabs').length) {
				$('.withTabs').each(function() {
					var id = $(this).attr('id');
					var tab = new ui.portletTabs.createTab(id);
				});
			}
			// init after ui.portletTabs.createTab
			forms.init();
			
			ui.singleForm.init();
			handleProv.init();
			if ($('.selection').length) {
				$('.selection').each(function() {
					var id = $(this).attr('id');
					var select = new ui.selection.createNew(id);
				});
				////console.log(ui.selection.tracker);
			}
			$('input[type=radio][name=input_type]').on('change', function(e) {
				var id = $(this).attr('id');
				if (id == 'cari') {
					$('#nomor_tagihan_wrap label').text('Cari Nomor Tagihan');
					$('#nomor_tagihan_wrap button').removeAttr('style');
					$('#nomor_tagihan_wrap .input').addClass('withSubmit');
				}
				else {
					$('#nomor_tagihan_wrap label').text('Masukkan Nomor Tagihan');
					$('#nomor_tagihan_wrap button').hide();
					$('#nomor_tagihan_wrap .input').removeClass('withSubmit');
				}
			});
			/* CR19296 Broadcast Message Start */
			broadcast.retrieve();
			/* CR19296 Broadcast Message End */
			quickEdit.init();
			/* CR27141 Pengembangan Mapping Klasifikasi - Start */			
			if ($('#fiturAgen').length) {
				var e = document.getElementById("klasifikasi_agen");
				var selected = e.options[e.selectedIndex].value;
				$.ajax({
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					},
					url: app.link() + "agent/getFiturKlasifikasi",
					method: "POST",
					data: {
						klasifikasi_name: selected
					},
					success: function (response) {
						if (response != '') {
							$("#fiturAgen").empty()
							$("#fiturAgen").append(response)
							/*CR28880 - Start */
							if (response.includes("lpg") && response.includes("lpg_pangkalan") == false ){
								$('#agen_elpiji_f').show();
								$('#agen_elpiji').prop('required',true);
							}else {
					        	$('#agen_elpiji_f').hide();
					        	$('#agen_elpiji').val('');
					        	$('#agen_elpiji').prop('required',false);
					        }
							/*CR28880 - End */
						} else {
							ui.handleAlert.alert('Error Get Data');
						}
					}
				})
			}
			$('#klasifikasi_agen').on('change', function (e) {
				var value = $(this).val();
				$.ajax({
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					},
					url: app.link() + "agent/getFiturKlasifikasi",
					method: "POST",
					data: {
						klasifikasi_name: value 
					},
					success: function (response) {
						console.log(response)
						if (response != '') {
							$("#fiturAgen").empty()
							$("#fiturAgen").append(response)
							$('#sendFiturAgent').val(response)
							/*CR28880 - Start */
							if (response.includes("lpg") && response.includes("lpg_pangkalan") == false ){
								$('#agen_elpiji_f').show();
								$('#agen_elpiji').prop('required',true);
							}else {
					        	$('#agen_elpiji_f').hide();
					        	$('#agen_elpiji').prop('required',false);
					        }
							/*CR28880 - End */
							if ($('#fiturAgenKBI').length) {
								$('#fiturAgenKBI').empty()
								$.each(response, function (key, val) {
									$.each(val['fitur'], function (key1, val1) {
										if (val1['active_status'] == 0) {
											$('#fiturAgenKBI').append('<div class="choiceWrap"><input type="checkbox" id="' + val1['slug'] + '" name="agent_type[]" value="' + val1['slug'] + '" disabled /><label for="' + val1['nama_fitur'] + '">' + val1['nama_fitur'] + '</label></div>')
										} else {
											$('#fiturAgenKBI').append('<div class="choiceWrap"><input type="checkbox" id="' + val1['slug'] + '" name="agent_type[]" value="' + val1['slug'] + '" checked /><label for="' + val1['nama_fitur'] + '">' + val1['nama_fitur'] + '</label></div>')

										}
									})
								});
								$('#fiturAgenKBI').append('<div class="clearfix"></div>')
								/*CR28880 - Start */
								if($('#lpg').prop("checked")) {
									$('#agen_elpiji_f').show();
									$('#agen_elpiji').prop('required',true);
								} else {
									$('#agen_elpiji_f').hide();
									$('#agen_elpiji').prop('required',false);
								}
								$('#lpg').change(function() {
							        if(this.checked) {
							            $('#agen_elpiji_f').show();
							            $('#agen_elpiji').prop('required',true);
							        } else {
							        	$('#agen_elpiji_f').hide();
							        	$('#agen_elpiji').prop('required',false);
							        }
								});
								/*CR28880 - End */
							}
						} else {
							ui.handleAlert.alert('Error Get Data');
						}
					}
				})
			});
			/* CR27141 Pengembangan Mapping Klasifikasi - End */			
		},
		mirrorTable:function(t) {
			if ($('#userApprove').length) {
				user.approve(t);
			}
			if ($('#quickGlance').length) {
				userBNI.mirrorTable(t);
			}
			return t;
		},
		link: function() {
			var link = ( app.overwrite ? $('meta[data-name=base]').attr('content').replace('http:', 'https:') : $('meta[data-name=base]').attr('content') ) + '/'
			return link;
		},
		interactive:function() {
			return interactive.init();
		},
		overwrite: true
	}
}();