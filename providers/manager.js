console.log("providers/manager.js was loaded");

const _registry = {};

const Manager = function () {
    const self = {};

    self.register = function (provider) {
        const provider_id = provider.get_provider_id();
        _registry[provider_id] = provider;
        console.log("ProviderMng: Registered", provider_id);
        return true;
    };

    self.provider = function (provider_id) {
        return _registry[provider_id];
    }

    return self;
};

const manager_instance = Manager();

module.exports = manager_instance;