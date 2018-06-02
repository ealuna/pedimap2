(function () {
    if (!window.$) return console.error('La aplicación requiere de jQuery.');

    if (!window.appPedimap) window.appPedimap = {};

    var defaultStorage = window.localStorage || window.sessionStorage;
    var defaultHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    appPedimap.mobileHeight = window.outerHeight || defaultHeight || 480;
    appPedimap.deviceHeight = (defaultHeight || 720) - 50;
    appPedimap.defaultWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (!defaultStorage) console.error('El navegador no soporta Web Storage.');

    appPedimap.getInputElement = function (n) {
        return document.getElementsByName(n)[0] || document.getElementById(n);
    };

    appPedimap.getParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    appPedimap.setRequestInterval = function (cb1, cb2) {
        if (appPedimap.requestInterval) clearInterval(appPedimap.requestInterval);
        if (cb2 instanceof Function) cb2(); else cb1();
        appPedimap.requestInterval = setInterval(cb1, 60000 * 3);
    };

    appPedimap.postRequest = function (options) {
        var url = options.url;
        var data = options.data || {};
        var success = options.success;
        var error = options.error || function (err) {
            //console.error(err.responseText)
        };
        $.post({
            url: '/pedimap/api' + url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: success,
            error: error
        });
    };

    appPedimap.setNewStyle = function (text) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = text;
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(style);
    };

    appPedimap.setNewScript = function (options) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if (options.async) script.async = true;
        if (options.defer) script.defer = true;
        script.src = options.src;
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
    };

    appPedimap.InputData = {
        'setValue': function (name, value) {
            var input = appPedimap.getInputElement(name);
            if (!value || !input) return;
            switch (input.type) {
                case 'checkbox':
                    input.checked = value;
                    break;
                default:
                    input.value = value;
                    break;
            }
        },
        'getValue': function (name) {
            var input = appPedimap.getInputElement(name);
            if (!input) return '';
            switch (input.type) {
                case 'checkbox':
                    return input.checked;
                default:
                    return input.value;
            }
        },
        'setOptions': function (options) {
            var element = $('#' + options.name);
            var data = options.data || [];
            var selected = options.selected || false;
            var valueOption = options.valueOption || 'codigo';
            var labelOption = options.labelOption || 'descrip';
            var html = options.firstOption || (options.firstDefault ? '<option value="" selected>TODOS</option>' : '');
            data.forEach(function (item) {
                html += ('<option value="' + item[valueOption] + '">' + item[labelOption] + '</option>');
            });
            element.html(html);
            if (selected) element.val(selected);
            element.trigger("chosen:updated");
            return element.val();
        },
        'checkValidation': function (elements, callback) {
            for (var i = 0; i < elements.length; i++) {
                var element = appPedimap.getInputElement(elements[i]);
                if (element.value === "") return callback(element.name);
            }
            callback(null);
        },
        'eventChange': function (id, callback) {
            $('#' + id).on('change', callback);
        }
    };

    appPedimap.StorageData = {
        'default': defaultStorage,
        'load': function (index, elements) {
            if (!defaultStorage) return;
            var item = defaultStorage.getItem(index);
            if (!item) return;
            var data = JSON.parse(item);
            elements.forEach(function (name) {
                if (data.hasOwnProperty(name)) {
                    appPedimap.InputData.setValue(name, data[name])
                }
            });
        },
        'save': function (index, elements) {
            if (!defaultStorage) return;
            var data = {};
            elements.forEach(function (name) {
                data[name] = appPedimap.InputData.getValue(name);
            });
            defaultStorage.setItem(index, JSON.stringify(data));
        }
    };
})();