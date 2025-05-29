/**
 * Notification Model - handles web push notifications
 */
class NotificationModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
    this.vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
  }

  isNotificationSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      throw new Error(`Failed to request notification permission: ${error.message}`);
    }
  }

  async subscribeToPushNotification() {
    try {
      const token = this._getToken();
      
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('Service worker not registered');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.vapidPublicKey,
      });

      const subscriptionJson = subscription.toJSON();

      const response = await fetch(`${this.baseUrl}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscriptionJson.endpoint,
          keys: {
            p256dh: subscriptionJson.keys.p256dh,
            auth: subscriptionJson.keys.auth,
          },
        }),
      });

      const responseJson = await response.json();
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Failed to subscribe to push notifications: ${error.message}`);
    }
  }

  async unsubscribeFromPushNotification() {
    try {
      const token = this._getToken();
      
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('Service worker not registered');
      }

      const subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        return { error: false, message: 'Not subscribed to push notifications' };
      }

      const subscriptionJson = subscription.toJSON();

      const response = await fetch(`${this.baseUrl}/notifications/subscribe`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscriptionJson.endpoint,
        }),
      });

      const responseJson = await response.json();
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      await subscription.unsubscribe();

      return responseJson;
    } catch (error) {
      throw new Error(`Failed to unsubscribe from push notifications: ${error.message}`);
    }
  }

  _getToken() {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    return auth.token || null;
  }
}

export default NotificationModel;