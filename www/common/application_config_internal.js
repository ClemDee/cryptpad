/*
 * This is an internal configuration file.
 * If you want to change some configurable values, use the '/customize/application_config.js'
 * file (make a copy from /customize.dist/application_config.js)
 */
define(['/common/common-hash.js'], function(Hash) {
    var config = {};

    //
    //
    //
    //
    /**
     * A helper function allowing to create conditionnal default configuration,
     * depending whether or not SSO mode was enabled on the application
     *
     * We need to use a getter function to chose at runtime
     * which one of the "default" or "sso" value to use
     * as the sso mode could be specified in the overriden configuration
     *
     * @param {string} propertyName The property name to define
     * @param {Object} values An object containing two keys: "default" and "sso"
     * - "default" value will be used when sso mode is disabled
     * - "sso" value will be used when sso mode is enabled
     */
    var setConfigPropertyWhetherSSOEnabled = function (propertyName, values) {
        Object.defineProperty(config, propertyName, {
            configurable: true,
            enumerable: true,
            get: function () {
                if (config.ssoEnabled) { return values.sso; }
                return values.default;
            },
            // Allow default properties to
            set: function (value) {
                Object.defineProperty(config, propertyName, {
                    value: value,
                    configurable: true,
                    writable: true,
                    enumerable: true,
                });
            },
        });
    };

    /**
     * Return whether the user has already register to cryptpad with his SSO credentials
     * SSO-TODO: maybe move this to a more appropriate location?
     */
     config.sso_hasRegistered = function (cb) {
      // Get user account public informations from ldap server, if it exists
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/sso/user');
      xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                var user = xhr.responseText;
                // If the string is not empty, it means the user information was stored on the server
                var hasRegistered = !!user;
                cb(hasRegistered);
            }
        }
      };
      xhr.onerror = function (error) {
          console.log(error);
      };
      xhr.send();
    };

    /* Select the buttons displayed on the main page to create new collaborative sessions.
     * Removing apps from the list will prevent users from accessing them. They will instead be
     * redirected to the drive.
     * You should never remove the drive from this list.
     */
    config.availablePadTypes = ['drive', 'teams', 'pad', 'sheet', 'code', 'slide', 'poll', 'kanban', 'whiteboard',
                                /*'doc', 'presentation',*/ 'file', /*'todo',*/ 'contacts' /*, 'calendar' */];
    /* The registered only types are apps restricted to registered users.
     * You should never remove apps from this list unless you know what you're doing. The apps
     * listed here by default can't work without a user account.
     * You can however add apps to this list. The new apps won't be visible for unregistered
     * users and these users will be redirected to the login page if they still try to access
     * the app
     */
    setConfigPropertyWhetherSSOEnabled('registeredOnlyTypes', {
        default: ['file', 'contacts', 'notifications', 'support', 'calendar'],
        sso: ['drive', 'file', 'contacts', 'notifications', 'support', 'calendar'],
    });

    /* CryptPad is available is multiple languages, but only English and French are maintained
     * by the developers. The other languages may be outdated, and any missing string for a langauge
     * will use the english version instead. You can customize the langauges you want to be available
     * on your instance by removing them from the following list.
     * An empty list will load all available languages for CryptPad. The list of available languages
     * can be found at the top of the file `/customize.dist/messages.js`. The list should only
     * contain languages code ('en', 'fr', 'de', 'pt-br', etc.), not their full name.
     */
    //config.availableLanguages = ['en', 'fr', 'de'];

    /* You can display a link to the imprint (legal notice) of your website in the static pages
     * footer. To do so, you can either set the following value to `true` and create an imprint.html page
     * in the `customize` directory. You can also set it to an absolute URL if your imprint page already exists.
     */
    config.imprint = false;
    // config.imprint = true;
    // config.imprint = 'https://xwiki.com/en/company/legal-notice';

    /* You can display a link to your own privacy policy in the static pages footer.
     * To do so, set the following value to the absolute URL of your privacy policy.
     */
    // config.privacy = 'https://xwiki.com/en/company/PrivacyPolicy';

    /*  Cryptpad apps use a common API to display notifications to users
     *  by default, notifications are hidden after 5 seconds
     *  You can change their duration here (measured in milliseconds)
     */
    config.notificationTimeout = 5000;
    config.disableUserlistNotifications = false;

    // Update the default colors available in the whiteboard application
    config.whiteboardPalette = [
        '#000000', // black
        '#FFFFFF', // white
        '#848484', // grey
        '#8B4513', // saddlebrown
        '#FF0000', // red
        '#FF8080', // peach?
        '#FF8000', // orange
        '#FFFF00', // yellow
        '#80FF80', // light green
        '#00FF00', // green
        '#00FFFF', // cyan
        '#008B8B', // dark cyan
        '#0000FF', // blue
        '#FF00FF', // fuschia
        '#FF00C0', // hot pink
        '#800080', // purple
    ];

    // Background color in the apps with centered content:
    // - file app in view mode
    // - rich text app when editor's width reduced in settings
    config.appBackgroundColor = '#666';

    // Set enableTemplates to false to remove the button allowing users to save a pad as a template
    // and remove the template category in CryptDrive
    config.enableTemplates = true;

    // Set enableHistory to false to remove the "History" button in all the apps.
    config.enableHistory = true;

    /*  user passwords are hashed with scrypt, and salted with their username.
        this value will be appended to the username, causing the resulting hash
        to differ from other CryptPad instances if customized. This makes it
        such that anyone who wants to bruteforce common credentials must do so
        again on each CryptPad instance that they wish to attack.

        WARNING: this should only be set when your CryptPad instance is first
        created. Changing it at a later time will break logins for all existing
        users.
    */
    config.loginSalt = '';
    config.minimumPasswordLength = 8;

    // Amount of time (ms) before aborting the session when the algorithm cannot synchronize the pad
    config.badStateTimeout = 30000;

    // Customize the icon used for each application.
    // You can update the colors by making a copy of /customize.dist/src/less2/include/colortheme.less
    config.applicationsIcon = {
        file: 'cptools-file',
        fileupload: 'cptools-file-upload',
        folderupload: 'cptools-folder-upload',
        pad: 'cptools-richtext',
        code: 'cptools-code',
        slide: 'cptools-slide',
        poll: 'cptools-poll',
        whiteboard: 'cptools-whiteboard',
        todo: 'cptools-todo',
        contacts: 'fa-address-book',
        kanban: 'cptools-kanban',
        doc: 'fa-file-word-o',
        presentation: 'fa-file-powerpoint-o',
        sheet: 'cptools-sheet',
        drive: 'fa-hdd-o',
        teams: 'fa-users',
    };

    // Ability to create owned pads and expiring pads through a new pad creation screen.
    // The new screen can be disabled by the users in their settings page
    config.displayCreationScreen = true;

    // Prevent anonymous users from storing pads in their drive
    config.disableAnonymousStore = false;

    // Hide the usage bar in settings and drive
    //config.hideUsageBar = true;

    // Disable feedback for all the users and hide the settings part about feedback
    //config.disableFeedback = true;

    // Add new options in the share modal (extend an existing tab or add a new tab).
    // More info about how to use it on the wiki:
    // https://github.com/xwiki-labs/cryptpad/wiki/Application-config#configcustomizeshareoptions
    //config.customizeShareOptions = function (hashes, tabs, config) {};

    // Add code to be executed on every page before loading the user object. `isLoggedIn` (bool) is
    // indicating if the user is registered or anonymous. Here you can change the way anonymous users
    // work in CryptPad, use an external SSO or even force registration
    // *NOTE*: You have to call the `callback` function to continue the loading process
    //config.beforeLogin = function(isLoggedIn, callback) {};
    setConfigPropertyWhetherSSOEnabled('beforeLogin', {
        sso: function (isLoggedIn, callback) {
            // If user is already logged in, skip
            if (isLoggedIn) { return void callback(); }

            // Redirect to register if user hasn't create his cryptpad account yet
            // Else, redirect to login page
            config.sso_hasRegistered(function (hasRegistered) {
                var redirectPage = hasRegistered ? "login" : "register";
                var href = Hash.hashToHref('', redirectPage);
                var url = Hash.getNewPadURL(href, { href: window.location.href });
                window.location.href = url;
            });
        },
    });

    // Add code to be executed on every page after the user object is loaded (also work for
    // unregistered users). This allows you to interact with your users' drive
    // *NOTE*: You have to call the `callback` function to continue the loading process
    //config.afterLogin = function(api, callback) {};

    // Add code to be executed at the end of the logout
    // *NOTE*: You have to call the `callback` function to end the logout process
    // setConfigPropertyWhetherSSOEnabled('customizeLogout', {
    //     sso: function () {
    //         // Here we are deleting every cookies so that it can work for every SSO solutions
    //         // SSO-TODO: there might be an already exiting solution to do this in cryptpad,
    //         // but haven't found it
    //         var clearCookies = function () {
    //             var cookies = document.cookie.split("; ");
    //             for (var c = 0; c < cookies.length; c++) {
    //                 var d = window.location.hostname.split(".");
    //                 while (d.length > 0) {
    //                     var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
    //                     var p = location.pathname.split('/');
    //                     document.cookie = cookieBase + '/';
    //                     while (p.length > 0) {
    //                         document.cookie = cookieBase + p.join('/');
    //                         p.pop();
    //                     };
    //                     d.shift();
    //                 }
    //             }
    //         };
    //         debugger;
    //         clearCookies();
    //         localStorage.clear();
    //         window.location.href = config.ssoLogoutUrl;
    //     },
    // });


    // Disabling the profile app allows you to import the profile informations (display name, avatar)
    // from an external source and make sure the users can't change them from CryptPad.
    // You can use config.afterLogin to import these values in the users' drive.
    setConfigPropertyWhetherSSOEnabled('disableProfile', {
        default: false,
        sso: true,
    });

    // Disable the use of webworkers and sharedworkers in CryptPad.
    // Workers allow us to run the websockets connection and open the user drive in a separate thread.
    // SharedWorkers allow us to load only one websocket and one user drive for all the browser tabs,
    // making it much faster to open new tabs.
    config.disableWorkers = false;

    // Teams are always loaded during the initial loading screen (for the first tab only if
    // SharedWorkers are available). Allowing users to be members of multiple teams can
    // make them have a very slow loading time. To avoid impacting the user experience
    // significantly, we're limiting the number of teams per user to 3 by default.
    // You can change this value here.
    //config.maxTeamsSlots = 5;

    // Each team is considered as a registered user by the server. Users and teams are indistinguishable
    // in the database so teams will offer the same storage limits as users by default.
    // It means that each team created by a user can increase their storage limit by +100%.
    // We're limiting the number of teams each user is able to own to 1 in order to make sure
    // users don't use "fake" teams (1 member) just to increase their storage limit.
    // You can change the value here.
    // config.maxOwnedTeams = 5;

    // The userlist displayed in collaborative documents is stored alongside the document data.
    // Everytime someone with edit rights joins a document or modify their user data (display
    // name, avatar, color, etc.), they update the "userlist" part of the document. When too many
    // editors are in the same document, all these changes increase the risks of conflicts which
    // require CPU time to solve. A "degraded" mode can now be set when a certain number of editors
    // are in a document at the same time. This mode disables the userlist, the chat and the
    // position of other users' cursor. You can configure the number of user from which the session
    // will enter into degraded mode. A big number may result in collaborative edition being broken,
    // but this number depends on the network and CPU performances of each user's device.
    config.degradedLimit = 8;

    // In "legacy" mode, one-time users were always creating an "anonymous" drive when visiting CryptPad
    // in which they could store their pads. The new "driveless" mode allow users to open an existing
    // pad without creating a drive in the background. The drive will only be created if they visit
    // a different page (Drive, Settings, etc.) or try to create a new pad themselves. You can disable
    // the driveless mode by changing the following value to "false"
    config.allowDrivelessMode = true;

    return config;
});
