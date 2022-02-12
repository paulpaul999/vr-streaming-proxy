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

    self.handle_directory_request = async function(spec) {
        const { dlna_path } = spec;
        if (dlna_path !== '0') {
            const parsed = dlna_path.split('/');
            const provider_id = parsed[0];

            const handler = self.provider(provider_id);
            const listing = await handler.handle_directory_request(spec);
            return { listing, provider_id };
        }

        const listing = [];
        for (const provider_id in _registry) {
            if (Object.hasOwnProperty.call(_registry, provider_id)) {
                const provider = _registry[provider_id];
                listing.push(
                    {
                        type: 'dir',
                        dlna_id: provider_id, /* => dir_path+'/misc' */
                        displayname: provider.get_displayname(),
                    }
                );
            }
        }

        // const listing = [
        //     {
        //         type: 'dir',
        //         dlna_id: 'misc', /* => dir_path+'/misc' */
        //         displayname: 'Misc'
        //     },
        //     {
        //         type: 'dir',
        //         dlna_id: 'slr',
        //         displayname: 'SexLikeReal'
        //     },
        //     {
        //         type: 'dir',
        //         dlna_id: 'cvr',
        //         displayname: 'CzechVR'
        //     },
        // ];
        return { listing: listing, provider_id: undefined };
    };

    return self;
};

const manager_instance = Manager();

export default manager_instance;