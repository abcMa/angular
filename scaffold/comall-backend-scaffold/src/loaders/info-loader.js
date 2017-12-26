export const InfoLoader = {
    get: async function (data, config) {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ title: 'This is a scaffold', content: 'Hello World!' });
            }, 1000);
        });
    }
};