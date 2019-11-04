(function ($) {

    //Notification handler
    abp.event.on('abp.notifications.received', function (userNotification) {
        abp.notifications.showUiNotifyForUserNotification(userNotification);

        // TODO migrate to admin-lte below commented lines
        //Desktop notification
        //Push.create("AbpProjectName", {
        //    body: userNotification.notification.data.message,
        //    icon: abp.appPath + 'images/app-logo-small.png',
        //    timeout: 6000,
        //    onClick: function () {
        //        window.focus();
        //        this.close();
        //    }
        //});
    });

    //serializeFormToObject plugin for jQuery
    $.fn.serializeFormToObject = function () {
        //serialize to array
        var data = $(this).serializeArray();

        //add also disabled items
        $(':disabled[name]', this).each(function () {
            data.push({ name: this.name, value: $(this).val() });
        });

        //map to object
        var obj = {};
        data.map(function (x) { obj[x.name] = x.value; });

        return obj;
    };

    //Configure blockUI
    if ($.blockUI) {
        $.blockUI.defaults.baseZ = 2000;
    }


    //Configure validator
    $.validator.setDefaults({
        highlight: function (element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'p',
        errorClass: 'text-danger',
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    function initAdvSearch() {
        $('.abp-advanced-search').each(function (i, obj) {
            var $advSearch = $(obj);
            var advSearchWidth = 0;
            $advSearch.each(function () {
                advSearchWidth += parseInt($(this).width(), 10);
            });
            $advSearch.find('.dropdown-menu').width(advSearchWidth);
        });
    }
    initAdvSearch();

    $(window).resize(function () {
        clearTimeout(window.resizingFinished);
        window.resizingFinished = setTimeout(function () {
            initAdvSearch();
        }, 500);
    });

})(jQuery);