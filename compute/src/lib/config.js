/// <reference types="@fastly/js-compute" />

import { SecretStore } from 'fastly:secret-store';

export class SecretStoreManager {
  static instance = null;

  constructor() {
    this.secrets = null;
  }

  static getInstance() {
    if (!SecretStoreManager.instance) {
      SecretStoreManager.instance = new SecretStoreManager();
    }
    return SecretStoreManager.instance;
  }

  async getSecret(key) {
    if (!this.secrets) {
      try {
        const store = new SecretStore('secret_default');
        const secretsMap = await store.get('secrets');
        if (!secretsMap) {
          throw new Error('Secrets not found in store');
        }
        this.secrets = JSON.parse(secretsMap.plaintext());
      } catch (error) {
        console.error('Failed to load secrets:', error);
        throw error;
      }
    }
    return this.secrets[key];
  }

  static async getSecret(key) {
    const instance = SecretStoreManager.getInstance();
    return instance.getSecret(key);
  }
}
