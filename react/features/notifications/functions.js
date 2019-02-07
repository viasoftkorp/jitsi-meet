import { toState } from '../base/redux';
import { getOverlayToRender } from '../overlay';

/**
 * Tells whether or not the notifications should be displayed based on
 * the current Redux state.
 *
 * @param {Object|Function} stateful - The redux store state.
 * @returns {boolean}
 */
export function areNotificationsVisible(stateful) {
    const state = toState(stateful);
    const isAnyOverlayVisible = Boolean(getOverlayToRender(state));
    const { enabled, notifications } = state['features/notifications'];
    const { calleeInfoVisible } = state['features/invite'];

    return enabled
        && !isAnyOverlayVisible
        && !calleeInfoVisible
        && notifications.length > 0;
}
