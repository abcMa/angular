let loadingElement;

export const loading = {
    // 开启全局读取中
    open: () => {
        if (loadingElement) {
            return;
        }
        loadingElement = document.createElement('div');
        let spin = document.createElement('span');
        spin.className = 'ant-spin-dot';
        spin.innerHTML = '<i></i><i></i><i></i><i></i>';
        spin.style.display = 'inline-block';
        loadingElement.appendChild(spin);
        loadingElement.className = 'ant-spin ant-spin-spinning';
        Object.assign(loadingElement.style, {
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            textAlign: 'center',
            lineHeight: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
        });
        document.body.appendChild(loadingElement);
    },
    // 关闭全局读取中
    close: () => {
        document.body.removeChild(loadingElement);
        loadingElement = null;
    }
};
