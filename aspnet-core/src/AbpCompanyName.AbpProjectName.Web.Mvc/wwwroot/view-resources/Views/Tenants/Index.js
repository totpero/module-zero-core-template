(function ($) {
    var _tenantService = abp.services.app.tenant;
    var l = abp.localization.getSource('AbpProjectName');
    var _modal = $('#TenantCreateModal');
    var _$form = _modal.find('form');

    var _$tenantsTable = $('#TenantsTable').DataTable({
        paging: true,
        serverSide: true,
        ajax: function (data, callback, settings) {
            var filters = $('#TenantsSearchForm').serializeFormToObject();
            _tenantService.getAll({ keyword: filters.name }).done(function (res) {
                callback({
                    recordsTotal: res.totalCount,
                    recordsFiltered: res.totalCount,
                    data: res.items
                });
            });
        },
        buttons: [
            {
                name: 'refresh',
                text: '<i class="fas fa-redo-alt style="padding-left: 5px"></i>',
                action: function (foo) {
                    _$tenantsTable.draw(false);
                }
            }
        ],
        columnDefs: [
            {
                targets: 0,
                data: null,
                sortable: false,
                autoWidth: false,
                defaultContent: '',
                render: function (data, type, row, meta) {
                    return [
                        '<div class="dropdown">',
                        '   <a href="#" class="btn bg-secondary dropdown-toggle" data-toggle="dropdown">',
                        `       <span>${l('Actions')}</span>`,
                        '   </a>',
                        '   <ul class="dropdown-menu p-0">',
                        '       <li class="dropdown-item">',
                        `           <a href="#" class="btn-block edit-tenant" data-tenant-id="${row.id}" data-toggle="modal" data-target="#TenantEditModal">`,
                        `               <i class="fas fa-pencil-alt"></i> ${l('Edit')}`,
                        '           </a>',
                        '       </li>',
                        '       <li class="dropdown-item">',
                        `           <a href="#" class="btn-block delete-tenant" data-tenant-id="${row.id}" data-tenancy-name="${row.tenancyName}">`,
                        `               <i class="fas fa-trash"></i> ${l('Delete')}`,
                        '           </a>',
                        '       </li>',
                        '   </ul>',
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
                render: data =>
                    `<input type="checkbox" disabled ${data ? 'checked' : ''}>`
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
        e.preventDefault();

        var tenantId = $(this).attr('data-tenant-id');

        abp.ajax({
            url: abp.appPath + 'Tenants/EditTenantModal?tenantId=' + tenantId,
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
                abp.localization.localize('AreYouSureWantToDelete', 'AbpProjectName'),
                tenancyName
            ),
            function (isConfirmed) {
                if (isConfirmed) {
                    _tenantService
                        .delete({
                            id: tenantId
                        })
                        .done(function () {
                            _$tenantsTable.ajax.reload();
                        });
                }
            }
        );
    }

    _modal.on('shown.bs.modal', function () {
        _modal.find('input:not([type=hidden]):first').focus();
    });

    $('.btn-search').on('click', function (e) {
        e.preventDefault();
        _$tenantsTable.ajax.reload();
    });
})(jQuery);
