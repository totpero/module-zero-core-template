(function ($) {
    var _tenantService = abp.services.app.tenant;
    var _$modal = $('#TenantEditModal');
    var _$form = _$modal.find('form');

    function save() {
        if (!_$form.valid()) {
            return;
        }

        var tenant = _$form.serializeFormToObject();

        abp.ui.setBusy(_$form);
        _tenantService.update(tenant).done(function () {
            _$modal.modal('hide');
            _$form[0].reset();
            abp.event.trigger('tenant.edited', tenant);
        }).always(function () {
            abp.ui.clearBusy(_$modal);
        });
    }

    //Handle save button click
    _$form.closest('div.modal-content').find(".save-button").click(function (e) {
        e.preventDefault();
        save();
    });

    //Handle enter key
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            save();
        }
    });

    _$modal.on('shown.bs.modal', function () {
        _$form.find('input[type=text]:first').focus();
    });
})(jQuery);