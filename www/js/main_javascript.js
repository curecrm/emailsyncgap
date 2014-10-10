String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function() {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function() {
    return this.replace(/\s+$/, "");
}
if (!this.JSONLib) {
    this.JSONLib = {};
}(function() {
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if (typeof JSONLib.stringify !== 'function') {
        JSONLib.stringify = function(value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSONLib.stringify');
            }
            return str('', {
                '': value
            });
        };
    }
    if (typeof JSONLib.parse !== 'function') {
        JSONLib.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j;
            }
            throw new SyntaxError('JSONLib.parse');
        };
    }
}());
var Prompt = this.Prompt = {
    text: '',
    callback: null,
    prompt: function(text, callback) {
        Prompt.text = text;
        Prompt.callback = callback;
        p = $('#prompt_link');
        if (p.length > 0) {
            p.click();
        } else {
            callback(prompt(text));
        }
    },
    return_result: function(result) {
        if (Prompt.callback != null) {
            Prompt.callback(result);
        }
        Prompt.callback = null;
    },
    on_show: function() {
        $('#prompt_text').text(Prompt.text);
        $('#prompt_input')[0].focus();
    },
    on_close: function() {
        if (Prompt.callback != null) {
            Prompt.callback(null);
        }
    }
}
try {
    $.fn.insertAtCaret = function(myValue) {
        return this.each(function() {
            if (document.selection) {
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    };
} catch (err) {}
var Wizard = this.Wizard = {
    initial_wizard_list: [],
    reload_when_done: false,
    location_when_done: '?',
    add_to_initial_list: function(w) {
        Wizard.initial_wizard_list.push(w);
    },
    hide_and_show_next: function() {
        $('.wizard').hide();
        if (Wizard.initial_wizard_list.length > 0) {
            var w = Wizard.initial_wizard_list.shift();
            $(w).show();
        } else if (Wizard.reload_when_done) {
            window.location = Wizard.location_when_done;
        }
    }
};
var QuickBox = this.QuickBox = {
    twitter_allowed: false,
    twitter_enabled: false,
    scroll_to_conversations: true,
    contact_id: '',
    contact_name: '',
    bucket_slug: '',
    bucket_name: '',
    reply_id: '',
    reply_name: '',
    reply_to_all: false,
    reply_twitter: false,
    public_twitter: false,
    init: function() {
        QuickBox.update_tooltip();
    },
    update_tooltip: function() {
        var tooltip = '';
        var close_link = "<span style='margin-left: 5px;'><a href='#' onclick='QuickBox.cancel();return false;'><img border='0' src='/static/sync/tango/actions/process-stop.png'/></a></span>";
        var button = 'Go!';
        var at_syntax = "";
        if (QuickBox.reply_to_all) {
            tooltip = 'Reply to: all';
            button = 'Reply';
        } else if (QuickBox.reply_id) {
            tooltip = 'Reply to: ' + QuickBox.reply_name;
            button = 'Reply';
        } else if (QuickBox.contact_name) {
            tooltip = 'Take a note or schedule: ' + '<b>' + QuickBox.contact_name + '</b>';
            close_link = '';
        } else if (QuickBox.bucket_slug && QuickBox.bucket_name) {
            tooltip = 'Tag: ' + QuickBox.bucket_name;
            close_link = '';
        } else if (QuickBox.public_twitter) {
            tooltip = 'Enter a Tweet';
            button = 'Tweet';
        } else {
            tooltip = 'Take a note or schedule something';
            close_link = "<span style=''></span>";
        }
        tooltip = tooltip.replace('/\n$/', '');
        $('#parse_submit').val(button);
        if (tooltip) {
            $('#tooltip_container').show();
            $('#tooltip_msg').html(tooltip + close_link + at_syntax);
        } else {
            $('#tooltip_container').hide();
        }
    },
    submit: function() {
        if (!((QuickBox.reply_twitter || QuickBox.public_twitter) && $('#parse').val().length > 140) || confirm('Your message is too long for a tweet and will be cut off. Is this OK?')) {
            Ajax.submit_parse($('#parse').val(), QuickBox.contact_id, QuickBox.bucket_slug, QuickBox.reply_id, QuickBox.reply_to_all, QuickBox.public_twitter);
        }
    },
    scroll_to: function() {
        try {
            $('#parse').focus();
        } catch (msg) {}
    },
    select_public_twitter: function() {
        if (!QuickBox.twitter_enabled) {
            if (confirm('You do not have a Twitter account setup. Would you like to setup Twitter now?')) {
                if (Ajax.agent == 'firefox') {
                    window.open('https://curecrm.com/sync//settings/', '_blank');
                } else {
                    window.location = '/sync//settings/';
                }
            } else {
                return;
            }
        }
        QuickBox.clear_reply();
        QuickBox.public_twitter = true;
        QuickBox.update_tooltip();
    },
    clear_reply: function() {
        QuickBox.reply_id = '';
        QuickBox.reply_name = '';
        QuickBox.reply_to_all = '';
        QuickBox.reply_twitter = false;
        QuickBox.public_twitter = false;
        QuickBox.update_tooltip();
    },
    clear_note_only: function() {
        $('#parse').val('Type something...');
        $('#parse').attr('rows', '3');
        QuickBox.clear_reply();
    },
    clear_contact_bucket: function() {
        QuickBox.contact_id = '';
        QuickBox.contact_name = '';
        QuickBox.bucket_slug = '';
        QuickBox.bucket_name = '';
    },
    clear: function() {
        QuickBox.clear_reply();
        QuickBox.clear_contact_bucket();
        QuickBox.clear_note_only();
        try {
            Page.kb_action_icons_enabled = true;
        } catch (msg) {}
    },
    cancel: function() {
        QuickBox.clear_contact_bucket();
        QuickBox.clear_reply();
        try {
            Page.kb_action_icons_enabled = true;
        } catch (msg) {}
    }
};
var Ajax = this.Ajax = {
    BASE_AJAX_URL: '',
    agent: "iphone",
    people: false,
    current_ajax_request: null,
    init: function() {
        if (typeof($['orig_ajax']) == 'undefined') {
            $.orig_ajax = $.ajax;
            $.ajax = function(options) {
                var csrf_tokens = [];
                $('.csrfmiddlewaretoken').each(function(index) {
                    var token = $(this).val();
                    var unique = true;
                    var i;
                    for (i = 0; i < csrf_tokens.length; i++) {
                        if (csrf_tokens[i] == token) {
                            unique = false;
                            break;
                        }
                    }
                    if (unique)
                        csrf_tokens.push(token);
                });
                if (csrf_tokens.length > 0) {
                    if (!options.data) {
                        options.data = new Object();
                    }
                    options.data.csrfmiddlewaretoken = csrf_tokens.join(',');
                }
                if (Ajax.agent) {
                    if (!options.data) {
                        options.data = new Object();
                    }
                    options.data.agent = Ajax.agent;
                }
                options.data.nocache = (new Date().getTime()) + '_' + Math.floor(Math.random() * 10000);
                return $.orig_ajax(options);
            }
        }
        $('#sync_loading_bar').ajaxStart(function() {
            $(this).show().fadeTo(.8, .8);
        });
        $('#sync_loading_bar').ajaxStop(function() {
            $(this).hide();
        });
    },
    failure: function(msg, redirect) {
        if (typeof(redirect) == "undefined") {} else {
            if (Ajax.agent != 'firefox') {} else {
                if (typeof(Page.logout) != "undefined") {}
            }
        }
    },
    failure_logout: function(msg) {
        Ajax.failure(msg, "/sync/logout/?to=%2Flogin%2F%3Fagent%3Diphone");
    },
    load_people_select: function(element, default_selection) {
        var parent_element = $(element);
        if (!!Ajax.people) {
            var people = Ajax.people;
            parent_element.html('');
            if (!!default_selection) {
                $("<option selected='selected'>" + default_selection + "</option>").appendTo(parent_element);
            }
            for (i = 0; i < people.length; i++) {
                $("<option>" + people[i].ez_name + "</option>").val(people[i].ez_name).appendTo(parent_element);
            }
        }
    },
    load_people_div: function(select_person_function) {
        var people = Ajax.people;
        var peopleDiv = false;
        if (people.length == 0) {
            peopleDiv = $("<div>No one else is part of your network.   </div>");
        } else {
            peopleDiv = $("<div>   </div>");
            $("<div></div>").text('@all').attr('title', '@all').data('ez', '@all').css({
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                marginBottom: '3px'
            }).click(function(e) {
                if (select_person_function != undefined) {
                    select_person_function($(this));
                } else {
                    try {
                        $('#parse').insertAtCaret($(this).data('ez') + ' ');
                    } catch (err) {}
                }
            }).append('<span style="border-bottom: 0px;"> - Everyone</span>').appendTo(peopleDiv);
            for (i = 0; i < people.length; i++) {
                $("<div></div>").text(people[i].ez_name).data('ez', people[i].ez_name).attr('title', people[i].ez_name).css({
                    borderBottom: '1px solid #ccc',
                    cursor: 'pointer',
                    marginBottom: '3px'
                }).click(function(e) {
                    if (select_person_function != undefined) {
                        select_person_function($(this));
                    } else {
                        try {
                            $('#parse').insertAtCaret($(this).data('ez') + ' ');
                        } catch (err) {}
                    }
                }).append('<span style="border-bottom: 0px; color: #777"> -' + people[i].full_name + ' (' + people[i].email + ')</span>').appendTo(peopleDiv);
            }
        }
        $('#people_div').html('').append(peopleDiv).toggle();
    },
    load_people: function(load_function) {
        if (!Ajax.people) {
            Ajax.send_data('/sync/ajax/load_people/', {}, function(data) {
                if (data.return_data.success) {
                    var people = data.return_data.people;
                    Ajax.people = people;
                    if (load_function != undefined) {
                        load_function();
                    }
                } else {
                    alert("Could not get list of people.");
                }
            }, "GET");
        } else {
            if (load_function != undefined) {
                load_function();
            }
        }
    },
    set_modals: function(name, val) {
        Ajax.send_data('/sync/ajax/set_modals/', {
            name: name,
            val: val
        }, function(data) {
            if (data.return_data.success) {
                if (val == 1) {
                    $('.wizard_' + name).show();
                    $('.wizard_' + name + '_hidden').hide();
                } else {
                    if (Wizard.hide_and_show_next) {
                        Wizard.hide_and_show_next();
                    } else {
                        $('.wizard_' + name).hide();
                        $('.wizard_' + name + '_hidden').show();
                    }
                }
            } else {
                alert('Failed to toggle your notification settings.');
            }
        }, "GET");
    },
    submit_parse: function(str, ref_contact_id, ref_bucket_slug, reply_id, reply_to_all, public_twitter, require_at_symbol) {
        if (str == "Example: Meeting with jessica on monday at 5" || str == "") {
            alert("Enter something like: running to lunch with @bob @status, or remind me to chat with @james next monday");
            return;
        }
        $('#parse_submit').attr('disabled', 'disabled');
        ref_contact_id = typeof(ref_contact_id) != 'undefined' ? ref_contact_id : false;
        ref_bucket_slug = typeof(ref_bucket_slug) != 'undefined' ? ref_bucket_slug : false;
        reply_id = typeof(reply_id) != 'undefined' ? reply_id : false;
        reply_to_all = typeof(reply_to_all) != 'undefined' ? reply_to_all : false;
        public_twitter = typeof(public_twitter) != 'undefined' ? public_twitter : false;
        require_at_symbol = typeof(require_at_symbol) != 'undefined' ? require_at_symbol : true;
        Ajax.send_data('/sync/ajax/parse/', {
            str: str,
            ref_contact_id: ref_contact_id,
            ref_bucket_slug: ref_bucket_slug,
            reply_id: reply_id,
            reply_to_all: reply_to_all,
            public_twitter: public_twitter,
            require_at_symbol: require_at_symbol
        }, function(data) {
            $('#parse_submit').removeAttr('disabled');
            if (data.return_data.success) {
                $('#parse').val('');
                QuickBox.clear_note_only();
                if (data.return_data.group_id) {
                    Page.highlight_group_id = data.return_data.group_id;
                }
                if (Page.update_widgets) {
                    Page.update_widgets();
                    if (QuickBox.scroll_to_conversations) {}
                } else {
                    window.location = '/sync/';
                }
            } else {
                alert(data.return_data.msg);
            }
        }, "GET");
    },
    eval_json: function(data) {
        if (typeof(data) == "string")
            var res = eval('(' + data + ')');
        else
            var res = data;
        return res;
    },
    login: function() {
        var email = $('#email_login').val();
        var password = $('#email_password').val();
        
        Ajax.send_data('https://curecrm.com/sync/ajax/login/', {
            email: email,
            password: password,
            base_url: ''
        }, function(data) {
            if (data.return_data.success) {
            	jQuery.data( document.body, "email", $('input[type="email"]').val() );
  				$('input#check_auth').click();
            } else {
            	jQuery.data( document.body, "email", false);
                $('input[type="email"], input[type="password"]').addClass('has-error');
                alert(data.return_data.msg);
            }
        }, "GET");
    },
    toggle_perms: function(widget_id, id) {
        var img = $('#kb_' + widget_id + '_' + id + '_perms');
        var private = 0;
        if (img.hasClass('perms_private')) {
            private = 1;
        }
        private = 1 - private;
        Ajax.send_data('/sync/ajax/edit_email/', {
            cmd: 'set_perms',
            id: id,
            private: private
        }, function(data) {
            if (data.return_data.success) {
                if (private) {
                    img.removeClass('perms_public');
                    img.addClass('perms_private');
                    img.attr('src', '/static/sync/tango/emblems/emblem-readonly.png');
                    img.attr('title', 'This is private: only you can see this.');
                } else {
                    img.addClass('perms_public');
                    img.removeClass('perms_private');
                    img.attr('src', '/static/sync/tango/emblems/emblem-public.png');
                    img.attr('title', 'This is public: your whole team can see this.');
                }
            } else {
                alert("Could not toggle permissions.");
            }
        }, "GET");
    },
    send_data: function(ajax_function, data, call_func, method, type, abort_previous) {
        var that = this;
        var callFunction = function(func, object) {
            func(object);
        }
        if (typeof(type) == "undefined" || Ajax.agent == 'firefox') {
            type = (Ajax.agent == 'firefox') ? 'jsonp' : 'json';
        }
        if (typeof(method) == "undefined")
            method = "GET";
        var url;
        if (ajax_function.indexOf('http') == 0) {
            url = ajax_function;
        } else {
            if (ajax_function.charAt(0) == '/' && (Ajax.agent != 'firefox')) {
                url = ajax_function;
            } else {
                url = that.BASE_AJAX_URL + ajax_function;
            }
        }
        if (abort_previous == true) {
            Ajax.abort();
        }
        $(function() {
            Ajax.current_ajax_request = $.ajax({
                type: method,
                url: url,
                dataType: type,
                data: data,
                error: function() {
                    Ajax.current_ajax_request = null;
                },
                success: function(return_data) {
                    Ajax.current_ajax_request = null;
                    if ((call_func != null) && (return_data != null)) {
                        callFunction(call_func, {
                            return_data: return_data,
                            input_data: data
                        });
                    }
                }
            });
        });
    },
    abort: function() {
        if (Ajax.current_ajax_request != null) {
            Ajax.current_ajax_request.abort();
            Ajax.current_ajax_request = null;
        }
    }
};
var CureCRMOpenID = this.CureCRMOpenID = {
    BASE_URL: '',
    popup_window: null,
    popup: function(email) {
        var url = CureCRMOpenID.BASE_URL + '/sync/openid_auth/openid_start/?email=' + encodeURI(email);
        CureCRMOpenID.popup_window = window.open(url, '', 'toolbar=0,scrollbars=0,location=1,statusbar=0,menubar=0,resizable=0,width=500,height=400');
        CureCRMOpenID.popup_window.focus();
        CureCRMOpenID.check_popup_interval = setInterval("CureCRMOpenID.check_popup()", 50);
    },
    check_popup_interval: null,
    check_popup: function() {
        if (CureCRMOpenID.popup_window != null && CureCRMOpenID.popup_window.closed) {
            CureCRMOpenID.popup_window = null;
            clearInterval(CureCRMOpenID.check_popup_interval);
            CureCRMOpenID.check_popup_interval = 0;
            var button = document.getElementById('curecrm_reload_sidebar_button');
            if (button != null) {
                button.click();
            } else {
                window.location.reload();
            }
        }
    },
    get_endpoint: function(email) {
        Ajax.send_data('/sync/ajax/openid_auth/get_endpoint/', {
            email: email
        }, function(data) {
            if (data.return_data.success) {
                window.location = data.return_data.url;
            } else {
                alert(data.return_data.msg);
            }
        }, "GET");
    }
};
$(document).ready(function() {
    Ajax.init();
});