define([
    "dojo/_base/declare",
    "dojo/_base/lang",
], function(declare, lang) {
    "use strict";

    return declare("MobileFeatures.widget.plugin.dialog", [], {

        // Set in modeler
        dialogEnabled: true,

        _enableDialog: function() {
            this.debug("._enableDialog");
            if (navigator && navigator.notification && (typeof mx.ui.mobileDialogLoaded === "undefined" || mx.ui.mobileDialogLoaded === null || mx.ui.mobileDialogLoaded === false)) {
                mx.ui.mobileDialogLoaded = true;
                mx.ui.confirmation = lang.hitch(this, this._confirmationReplacement);

                mx.ui.info = lang.hitch(this, this._infoReplacement);
                mx.ui.warning = lang.hitch(this, this._warningReplacement);
                mx.ui.error = lang.hitch(this, this._errorReplacement);

            } else if (mx.ui.mobileDialogLoaded === true) {
                this.debug("._enableDialog not loaded, already enabled");
            } else {
                console.warn(this.id + "._enableDialog dialog not enabled. Either already enabled or 'cordova-plugin-dialogs' plugin missing in Phonegap");
            }
        },

        _confirmationReplacement: function(args) {
            this.debug("._confirmationReplacement");
            var proceed = args.proceed || this.mxTranslation("mxui.widget.DialogMessage", "ok", "Ok");
            var cancel = args.cancel || this.mxTranslation("mxui.widget.DialogMessage", "cancel", "Cancel");
            var confirm = this.mxTranslation("mxui.widget.ConfirmationDialog", "caption", "Confirmation");
            navigator.notification.confirm(args.content, function(buttonNum) {
                if (buttonNum === 1) {
                    args.handler();
                    //Extra argument so other widgets can get a callback on the cancel button too
                } else if (buttonNum === 2) {
                    if (window.plugins && window.plugins.nativepagetransitions) {
                        window.plugins.nativepagetransitions.cancelPendingTransition(function(msg) {
                            //console.log("success: " + msg)
                        }); // called when the screenshot was hidden (almost instantly)
                    }
                    if (args.onCancel) {
                        args.onCancel();
                    }
                }
            }, confirm, [proceed, cancel]);
        },

        _infoReplacement: function(msg, modal) {
            var info = this.mxTranslation("mxui.widget.DialogMessage", "info", "Info");
            navigator.notification.alert(msg, null, info);
        },
        _warningReplacement: function(msg, modal) {
            var warning = this.mxTranslation("mxui.widget.DialogMessage", "warning", "Warning");
            navigator.notification.alert(msg, null, warning);
        },
        _errorReplacement: function(msg, modal) {
            var error = this.mxTranslation("mxui.widget.DialogMessage", "error", "Error");
            navigator.notification.alert(msg, null, error);
        },

        mxTranslation: function(namespace, key, fallback) {
            return window.mx.session.getConfig("uiconfig.translations." + namespace + "." + key)
                || (window.mx.session.getConfig("uiconfig.translations"))[namespace + "." + key]
                || fallback
                || "[No translation]";
        }

    });
});
