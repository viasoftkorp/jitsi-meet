// @flow

import _ from 'lodash';
import React, { Component } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

import { getConferenceName } from '../../../base/conference';
import { FILMSTRIP_SIZE, isFilmstripVisible } from '../../../filmstrip';
import {
    areNotificationsVisible,
    NotificationsContainer
} from '../../../notifications';
import { PictureInPictureButton } from '../../../mobile/picture-in-picture';
import {
    isNarrowAspectRatio,
    makeAspectRatioAware
} from '../../../base/responsive-ui';
import { isToolboxVisible } from '../../../toolbox';

import styles, { NAVBAR_GRADIENT_COLORS } from './styles';

type Props = {

    /**
     * True if the filmstrip is currently visible.
     */
    _filmstripVisible: boolean,

    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string,

    /**
     * True if the navigation bar should be visible.
     */
    _navBarVisible: boolean,

    /**
     * True if the notifications should be visible.
     */
    _notificationsVisible: boolean
};

/**
 * Implements a navigation bar component that is rendered on top of the
 * conference screen.
 */
class NavigationBar extends Component<Props> {
    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _navBarVisible, _notificationsVisible } = this.props;

        if (!_navBarVisible && !_notificationsVisible) {
            return null;
        }

        return (
            <View
                pointerEvents = 'box-none'
                style = { styles.navBarContainer }>
                <LinearGradient
                    colors = { NAVBAR_GRADIENT_COLORS }
                    pointerEvents = 'none'
                    style = { styles.gradient }>
                    <SafeAreaView>
                        <View style = { styles.gradientStretch } />
                    </SafeAreaView>
                </LinearGradient>
                <SafeAreaView
                    pointerEvents = 'box-none'
                    style = { styles.navBarSafeView }>
                    { _navBarVisible && this._renderNavigationBar() }
                    { _notificationsVisible
                            && this._renderNotificationsContainer() }
                </SafeAreaView>
            </View>
        );
    }

    /**
     * Renders a container for notifications to be displayed by the
     * base/notifications feature.
     *
     * @private
     * @returns {React$Element}
     */
    _renderNotificationsContainer() {
        const notificationsStyle = {};

        // In the landscape mode (wide) there's problem with notifications being
        // shadowed by the filmstrip rendered on the right. This makes the "x"
        // button not clickable. In order to avoid that a margin of the
        // filmstrip's size is added to the right.
        //
        // Pawel: after many attempts I failed to make notifications adjust to
        // their contents width because of column and rows being used in the
        // flex layout. The only option that seemed to limit the notification's
        // size was explicit 'width' value which is not better than the margin
        // added here.
        if (this.props._filmstripVisible && !isNarrowAspectRatio(this)) {
            notificationsStyle.marginRight = FILMSTRIP_SIZE;
        }

        return <NotificationsContainer style = { notificationsStyle } />;
    }

    /**
     * Renders the navigation bar.
     *
     * @private
     * @returns {React$Element}
     */
    _renderNavigationBar() {
        return (
            <View
                pointerEvents = 'box-none'
                style = { styles.navBarWrapper }>
                <PictureInPictureButton
                    styles = { styles.navBarButton } />
                <View
                    pointerEvents = 'box-none'
                    style = { styles.roomNameWrapper }>
                    <Text
                        numberOfLines = { 1 }
                        style = { styles.roomName }>
                        { this.props._meetingName }
                    </Text>
                </View>
            </View>);
    }

}

/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {{
 *     _meetingName: string,
 *     _visible: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
        /**
         * Is {@code true} when the filmstrip is currently visible.
         */
        _filmstripVisible: isFilmstripVisible(state),
        _meetingName: _.startCase(getConferenceName(state)),
        _navBarVisible: isToolboxVisible(state),
        _notificationsVisible: areNotificationsVisible(state)
    };
}

export default connect(_mapStateToProps)(makeAspectRatioAware(NavigationBar));
