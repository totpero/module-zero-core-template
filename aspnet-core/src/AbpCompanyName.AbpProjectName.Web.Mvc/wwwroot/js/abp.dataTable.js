var abp = abp || {};
(function () {
    if (!$.fn.dataTable) {
        return;
    }

    abp.libs = abp.libs || {};
    var l = abp.localization.getSource("AbpProjectName");

    var language = {
        emptyTable: "No data available in table",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        infoEmpty: "Showing 0 to 0 of 0 entries",
        infoFiltered: "(filtered from _MAX_ total entries)",
        infoPostFix: "",
        infoThousands: ",",
        lengthMenu: "Show _MENU_ entries",
        loadingRecords: "Loading...",
        processing: "Processing...",
        search: "Search:",
        zeroRecords: "No matching records found",
        paginate: {
            first: "First",
            last: "Last",
            next: "Next",
            previous: "Previous"
        },
        aria: {
            sortAscending: ": activate to sort column ascending",
            sortDescending: ": activate to sort column descending"
        }
    };

    $.extend(true, $.fn.dataTable.defaults, {
        searching: false,
        ordering: false,
        language: language,
        processing: true,
        dom: [
            "<'row'<'col-md-12'f>>",
            "<'row'<'col-md-12't>>",
            "<'row margin-t-5'",
            "<'col-lg-5 col-xs-12'<'float-lg-left'p>>",
            "<'col-lg-3 col-xs-12'<'text-center'l>>",
            "<'col-lg-3 col-xs-12'<'float-lg-right text-center'i>>",
            "<'col-lg-1 col-xs-12'<'float-lg-right text-center data-tables-refresh'B>>",
            ">"
        ].join('')
    });
})();