import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
// import { Icon } from '@contentstack/venus-components';
import ContentstackSDK from '@contentstack/app-sdk';
// import plugin from '../images/plugin.svg'
// import './style.css'
export default ContentstackSDK.init().then(async (sdk) => {
    const extensionObj = await sdk['location'];
    const RTE = await extensionObj['RTEPlugin'];
    if (!RTE)
        return;
    return RTE('highlight', () => ({
        title: 'Highlight',
        // icon: <Icon style={{ padding: '0 6px' }} icon='Edit' size='original' />,
        render: (props) => {
            return (_jsxs("div", { className: 'rte-container', children: [_jsx("div", { className: 'custom-field', children: _jsxs("div", { className: 'custom-field-container', children: [_jsx("div", { className: 'custom-field-icon', children: _jsx("img", { src: '', 
                                        // src={plugin}
                                        alt: 'icon' }) }), _jsxs("div", { className: 'app-component-content', children: [_jsx("h4", { children: "RTE Plugin" }), _jsx("p", { children: "Your new RTE plugin can be found on the toolbar above." })] })] }) }), _jsxs("div", { className: 'app-component-content', children: [_jsxs("p", { children: ["You can also find your plugin on the ", _jsx("strong", { children: "hoveringToolbar" }), ' ', "by selecting any text. Try selecting me."] }), _jsx("a", { href: '/', children: "Learn more" })] })] }));
        },
        displayOn: ['toolbar'],
        elementType: ['block'],
    }));
});