/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { PureComponent } from 'react';
import './AddToHomeScreen.style';
import isMobile from 'Util/Mobile';

const STORE_NAME = 'ScandiPWA';

export default class AddToHomeScreen extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { isBannerClosed: false };
        this.installPromptEvent = null;
        this.handleBannerClose = this.handleBannerClose.bind(this);
        this.handleAppInstall = this.handleAppInstall.bind(this);
    }

    componentDidMount() {
        this.listenBeforeInstallPromtEvent();
    }

    handleAppInstall() {
        // Show the modal add to home screen dialog
        this.installPromptEvent.prompt();
        // Wait for the user to respond to the prompt
        this.installPromptEvent.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                this.setState({ isBannerClosed: true });
            }

            // Clear the saved prompt since it can't be used again
            this.installPromptEvent = null;
        });
    }

    handleBannerClose() {
        this.setState({ isBannerClosed: true });
    }

    listenBeforeInstallPromtEvent() {
        window.addEventListener('beforeinstallprompt', (event) => {
            // Prevent Chrome <= 67 from automatically showing the prompt
            event.preventDefault();
            // Stash the event so it can be triggered later.
            this.installPromptEvent = event;
        });
    }

    renderAndroidBanner() {
        return (
            <div block="AndroidBanner-AppToHomeScreen">
                <div block="BannerClose">
                    <button onClick={ this.handleBannerClose } />
                </div>
                <div block="Title">
                    <p>
                        { __(`Add ${ STORE_NAME } to your home screen for the full-screen browsing experience!`) }
                    </p>
                </div>
                <div block="AppInstall">
                    <button onClick={ this.handleAppInstall }>
                        { __('ADD TO HOME SCREEN') }
                    </button>
                </div>
            </div>
        );
    }

    renderIosBanner() {
        return (
            <div block="IosBanner-AppToHomeScreen">
                <div block="Title">
                    <p>
                        { __(`Browse ${ STORE_NAME } in full-screen:`) }
                    </p>
                    <div block="TextAndIcons">
                        <p>{ __('tap:') }</p>
                        <div block="IconShare" />
                        <p>{ __(', then') }</p>
                        <div block="IconPlus" />
                        <b>{ __('Add to Home Screen') }</b>
                    </div>
                </div>
                <div block="BannerClose">
                    <p>
                        <button onClick={ this.handleBannerClose }>
                            <u>
                                { __('Maybe later') }
                            </u>
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    render() {
        const { isBannerClosed } = this.state;

        if (isMobile.standaloneMode() || isBannerClosed) {
            return null;
        }

        if (isMobile.iOS()) {
            return this.renderIosBanner();
        }

        if (isMobile.android()) {
            return this.renderAndroidBanner();
        }

        return null;
    }
}
