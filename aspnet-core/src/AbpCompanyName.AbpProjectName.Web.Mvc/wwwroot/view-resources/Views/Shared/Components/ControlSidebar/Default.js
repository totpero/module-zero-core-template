$(function () {
    "use strict";

    // get current theme settings on load
    var themeSettings = {
        skin: abp.setting.get('App.Theme.Skin'),
        fixed: abp.setting.getBoolean('App.Theme.Fixed'),
        boxed: abp.setting.getBoolean('App.Theme.Boxed'),
        sidebar: {
            mini: abp.setting.getBoolean('App.Theme.Sidebar.Mini'),
            toggle: abp.setting.getBoolean('App.Theme.Sidebar.Toggle'),
            expandOnHover: abp.setting.getBoolean('App.Theme.Sidebar.ExpandOnHover'),
        },
        controlSidebar: {
            skin: abp.setting.get('App.Theme.ControlSidebar.Skin'),
            slide: abp.setting.getBoolean('App.Theme.ControlSidebar.Slide'),
        }
    };

    /**
     * Get access to plugins
     */
    $('[data-toggle="control-sidebar"]').controlSidebar();
    $('[data-toggle="push-menu"]').pushMenu();
    var $pushMenu = $('[data-toggle="push-menu"]').data("lte.pushmenu");
    var $controlSidebar = $('[data-toggle="control-sidebar"]').data(
        "lte.controlsidebar"
    );
    var $layout = $("body").data("lte.layout");
    $(window).on("load", function () {
        // Reinitialize variables on load
        $pushMenu = $('[data-toggle="push-menu"]').data("lte.pushmenu");
        $controlSidebar = $('[data-toggle="control-sidebar"]').data(
            "lte.controlsidebar"
        );
        $layout = $("body").data("lte.layout");
    });

    /**
     * Toggles layout classes
     *
     * @param String layout the layout class to toggle
     * @returns void
     */
    function changeLayout(layout) {
        $("body").toggleClass(layout);
        $layout.fixSidebar();
        if ($("body").hasClass("fixed") && layout == "fixed") {
            $pushMenu.expandOnHover();
            $layout.activate();
        }
        $controlSidebar.fix();
    }

    /**
     * Replaces the old skin with the new skin
     * @param String skin the new skin class
     * @returns Boolean false to prevent link's default action
     */
    function changeSkin(skin) {
        $("body")
            .removeClass(function (index, className) {
                return (className.match(/(^|\s)skin-\S+/g) || []).join(" ");
            })
            .addClass(skin);
        return false;
    }

    /**
     * Retrieve default settings and apply them to the template
     * @returns void
     */
    (function setup() {
        $("[data-skin]").on("click", function (e) {
            if ($(this).hasClass("knob"))
                return;
            e.preventDefault();
            var skin = $(this).data("skin");
            changeSkin(skin);
            themeSettings.skin = skin;
        });

        $("[data-layout]").on("click", function () {
            var $this = $(this),
                layout = $this.data("layout"),
                checked = $this.is(":checked"),
                $cbLayoutFixed = $('[data-layout="fixed"]'),
                $cbLayoutBoxed = $('[data-layout="layout-boxed"]'),
                $cbSidebarMini = $('[data-layout="sidebar-mini"]'),
                $cbExpandOnHover = $('[data-enable="expandOnHover"]');

            changeLayout(layout);

            if (layout === "fixed") {
                themeSettings.fixed = checked;

                if (checked) {
                    themeSettings.boxed = false;
                    $("body").removeClass("layout-boxed");
                    $cbLayoutBoxed.prop("checked", false);
                }
            }
            if (layout === "layout-boxed") {
                themeSettings.boxed = checked;

                if (checked) {
                    themeSettings.fixed = false;
                    $("body").removeClass("fixed");
                    $cbLayoutFixed.prop("checked", false);
                }
            }
            if (layout === "sidebar-collapse") {
                themeSettings.sidebar.toggle = checked;

                if (!checked) {
                    themeSettings.sidebar.expandOnHover = false;
                    $cbSidebarMini.prop('disabled', false);
                    $cbExpandOnHover.prop("checked", false);
                }
            }
            if (layout === "sidebar-mini") {
                themeSettings.sidebar.mini = checked;
                $cbExpandOnHover.prop('disabled', !checked);
            }
        });

        $('[data-sidebarskin="toggle"]').on("click", function () {
            var $sidebar = $(".control-sidebar");
            if ($sidebar.hasClass("control-sidebar-dark")) {
                $sidebar.removeClass("control-sidebar-dark");
                $sidebar.addClass("control-sidebar-light");
                themeSettings.controlSidebar.skin = "control-sidebar-light";
            } else {
                $sidebar.removeClass("control-sidebar-light");
                $sidebar.addClass("control-sidebar-dark");
                themeSettings.controlSidebar.skin = "control-sidebar-dark";
            }
        });

        $("[data-controlsidebar]").on("click", function () {
         
            var
                $this = $(this),
                checked = $this.is(":checked");

            changeLayout($this.data("controlsidebar"));

            //$controlSidebar.options.slide = checked;

            themeSettings.controlSidebar.slide = checked;
        });

        $('[data-enable="expandOnHover"]').on("click", function () {
            var $this = $(this),
                checked = $this.is(":checked"),
                $cbsidebarCollapse = $('[data-layout="sidebar-collapse"]'),
                $cbSidebarMini = $('[data-layout="sidebar-mini"]');

            $cbSidebarMini.prop("disabled", checked);
            $cbsidebarCollapse.prop("checked", checked);
            themeSettings.sidebar.toggle = checked;

            if ($this.is(":checked")) {
                $pushMenu.expandOnHover();
                $('body').addClass("sidebar-mini-expand-feature");
                if (!$("body").hasClass("sidebar-collapse"))
                    changeLayout("sidebar-collapse");
                themeSettings.sidebar.expandOnHover = true;
            } else {
                $('.main-sidebar').off("mouseenter mouseleave");
                $('body').removeClass("sidebar-mini-expand-feature");
                themeSettings.sidebar.expandOnHover = false;
            }
        });

        //  Reset options
        if (themeSettings.fixed) {
            $('[data-layout="fixed"]').prop("checked", true);
            $("body").removeClass("layout-boxed");
        }
        if (themeSettings.boxed) {
            $('[data-layout="layout-boxed"]').prop("checked", true);
            $("body").removeClass("fixed");
        }
        if (themeSettings.sidebar.toggle) {
            $('[data-layout="sidebar-collapse"]').prop("checked", true);
        }
        if (themeSettings.controlSidebar.skin === "control-sidebar-light") {
            $('[data-sidebarskin="toggle"]').prop("checked", true);
        }
        if (themeSettings.sidebar.mini) {
            $('[data-layout="sidebar-mini"]').prop("checked", true);

        } else {
            $('[data-enable="expandOnHover"]').prop("disabled", true);
        }
        if (themeSettings.sidebar.expandOnHover) {
            $pushMenu.expandOnHover();
            $('body').addClass("sidebar-mini sidebar-collapse");
            $('[data-layout="sidebar-mini"]').prop("checked", true).prop("disabled", true);
            $('[data-layout="sidebar-collapse"]').prop("checked", true);
            $('[data-enable="expandOnHover"]').prop("checked", true);
        }
        if (themeSettings.controlSidebar.slide) {
            $('body').addClass("control-sidebar-open");
            $('[data-controlsidebar]').prop("checked", true);
        }

        $('#save-layout-changes').on('click', function (e) {
            e.preventDefault();
            var controlSidebar = $('.control-sidebar');

            abp.ui.setBusy(controlSidebar);
            abp.services.app.configuration.changeUiTheme(themeSettings)
                .done(function () {
                    location.reload(true);
                }).always(function () {
                    abp.ui.clearBusy(controlSidebar);
                });
        })
    })();
});
