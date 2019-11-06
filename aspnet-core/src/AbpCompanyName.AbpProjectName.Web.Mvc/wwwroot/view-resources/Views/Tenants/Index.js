﻿(function ($) {
    var _tenantService = abp.services.app.tenant,
        l = abp.localization.getSource('AbpProjectName'),
        _modal = $('#TenantCreateModal'),
        _$form = _modal.find('form'),
        _$table = $('#TenantsTable');

    var _$tenantsTable = _$table.DataTable({
        paging: true,
        serverSide: true,
        ajax: function (data, callback, settings) {
            var filter = $('#TenantsSearchForm').serializeFormToObject(true);
            filter.maxResultCount = data.length;
            filter.skipCount = data.start;

            abp.ui.setBusy(_$table);
            _tenantService.getAll(filter).done(function (result) {
                callback({
                    recordsTotal: result.totalCount,
                    recordsFiltered: result.totalCount,
                    data: result.items
                });
            }).done(() => {
                abp.ui.clearBusy(_$table);
            });
        },
        buttons: [
            {
                name: 'refresh',
                text: '<i class="fas fa-redo-alt"></i>',
                action: () => _$tenantsTable.draw(false)
            }
        ],
        columnDefs: [
            {
                targets: 0,
                data: null,
                sortable: false,
                autoWidth: false,
                defaultContent: '',
                render: (data, type, row, meta) => {
                    return [
                        '<div class="btn-group">',
                        `   <button type="button" class="btn bg-secondary edit-tenant" data-tenant-id="${row.id}" data-toggle="modal" data-target="#TenantEditModal">`,
                        `       <i class="fas fa-pencil-alt"></i> ${l('Edit')}`,
                        '   </button>',
                        '   <button type="button" class="btn bg-secondary dropdown-toggle dropdown-icon" data-toggle="dropdown">',
                        '   </button>',
                        '   <div class="dropdown-menu" role="menu">',
                        `     <a href="#" class="dropdown-item delete-tenant" data-tenant-id="${row.id}" data-tenancy-name="${row.tenancyName}">`,
                        `         <i class="fas fa-trash"></i> ${l('Delete')}`,
                        '     </a>',
                        '   </div>',
                        '</div>'
                    ].join('');
                }
            },
            {
                targets: 1,
                data: 'tenancyName',
                sortable: false
            },
            {
                targets: 2,
                data: 'name',
                sortable: false
            },
            {
                targets: 3,
                data: 'isActive',
                sortable: false,
                render: data => `<input type="checkbox" disabled ${data ? 'checked' : ''}>`
            }
        ]
    });

    _$form.find('.save-button').click(function (e) {
        e.preventDefault();

        if (!_$form.valid()) {
            return;
        }

        var tenant = _$form.serializeFormToObject();

        abp.ui.setBusy(_modal);

        _tenantService
            .create(tenant)
            .done(function () {
                _modal.modal('hide');
                _$form[0].reset();
                abp.notify.info(l('SavedSuccessfully'));
                _$tenantsTable.ajax.reload();
            })
            .always(function () {
                abp.ui.clearBusy(_modal);
            });
    });

    $(document).on('click', '.delete-tenant', function () {
        var tenantId = $(this).attr('data-tenant-id');
        var tenancyName = $(this).attr('data-tenancy-name');

        deleteTenant(tenantId, tenancyName);
    });

    $(document).on('click', '.edit-tenant', function (e) {
        var tenantId = $(this).attr('data-tenant-id');

        abp.ajax({
            url: abp.appPath + 'Tenants/EditModal?tenantId=' + tenantId,
            type: 'POST',
            dataType: 'html',
            success: function (content) {
                $('#TenantEditModal div.modal-content').html(content);
            },
            error: function (e) { }
        });
    });

    abp.event.on('tenant.edited', function (data) {
        _$tenantsTable.ajax.reload();
    });

    function deleteTenant(tenantId, tenancyName) {
        abp.message.confirm(
            abp.utils.formatString(
                l('AreYouSureWantToDelete'),
                tenancyName
            ),
            null,
            function (isConfirmed) {
                if (isConfirmed) {
                    _tenantService
                        .delete({
                            id: tenantId
                        })
                        .done(function () {
                            abp.notify.info(l('SuccessfullyDeleted'));
                            _$tenantsTable.ajax.reload();
                        });
                }
            }
        );
    }

    _modal.on('shown.bs.modal', () => {
        _modal.find('input:not([type=hidden]):first').focus();
    }).on('hidden.bs.modal', () => {
        _$form.clearForm();
    });

    $('.btn-search').on('click', function (e) {
        _$tenantsTable.ajax.reload();
    });
})(jQuery);
