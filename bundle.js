'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var venusComponents = require('@contentstack/venus-components');
var ContentstackSDK = require('@contentstack/app-sdk');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ContentstackSDK__default = /*#__PURE__*/_interopDefaultLegacy(ContentstackSDK);

// import plugin from '../images/plugin.svg'
// import './style.css'
var index = ContentstackSDK__default["default"].init().then(async (sdk) => {
    const extensionObj = await sdk['location'];
    const RTE = await extensionObj['RTEPlugin'];
    if (!RTE)
        return;
    return RTE('highlight', () => ({
        title: 'Highlight',
        icon: jsxRuntime.jsx(venusComponents.Icon, { style: { padding: '0 6px' }, icon: 'Edit', size: 'original' }),
        render: (props) => {
            return (jsxRuntime.jsxs("div", { className: 'rte-container', children: [jsxRuntime.jsx("div", { className: 'custom-field', children: jsxRuntime.jsxs("div", { className: 'custom-field-container', children: [jsxRuntime.jsx("div", { className: 'custom-field-icon', children: jsxRuntime.jsx("img", { src: '', 
                                        // src={plugin}
                                        alt: 'icon' }) }), jsxRuntime.jsxs("div", { className: 'app-component-content', children: [jsxRuntime.jsx("h4", { children: "RTE Plugin" }), jsxRuntime.jsx("p", { children: "Your new RTE plugin can be found on the toolbar above." })] })] }) }), jsxRuntime.jsxs("div", { className: 'app-component-content', children: [jsxRuntime.jsxs("p", { children: ["You can also find your plugin on the ", jsxRuntime.jsx("strong", { children: "hoveringToolbar" }), ' ', "by selecting any text. Try selecting me."] }), jsxRuntime.jsx("a", { href: '/', children: "Learn more" })] })] }));
        },
        displayOn: ['toolbar'],
        elementType: ['block'],
    }));
});

module.exports = index;
