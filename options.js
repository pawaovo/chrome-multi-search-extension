document.addEventListener('DOMContentLoaded', function() {
    const manageWebsites = document.getElementById('manage-websites');
    const newSiteName = document.getElementById('new-site-name');
    const newSiteUrl = document.getElementById('new-site-url');
    const addSiteButton = document.getElementById('add-site-button');

    let sites = [];

    // 初始化加载网站
    chrome.storage.sync.get('sites', function(data) {
        sites = data.sites || [];
        sites.forEach(site => addSiteToDOM(site));
    });

    // 添加新网站
    addSiteButton.addEventListener('click', () => {
        const name = newSiteName.value.trim();
        const url = newSiteUrl.value.trim();
        if (!name || !url) return;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert('URL必须以http://或https://开头');
            return;
        }
        const site = { name, url };
        sites.push(site);
        chrome.storage.sync.set({ sites }, () => {
            addSiteToDOM(site);
            newSiteName.value = '';
            newSiteUrl.value = '';
        });
    });

    // 将网站添加到DOM
    function addSiteToDOM(site) {
        const siteDiv = document.createElement('div');
        siteDiv.textContent = `${site.name} - ${site.url}`;

        // 添加编辑按钮
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            const newName = prompt('Enter new site name:', site.name);
            const newUrl = prompt('Enter new site URL:', site.url);
            if (newName && newUrl) {
                site.name = newName;
                site.url = newUrl;
                updateSites();
            }
        };
        siteDiv.appendChild(editButton);

        // 添加删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            const index = sites.indexOf(site);
            if (index !== -1) {
                sites.splice(index, 1);
                updateSites();
            }
        };
        siteDiv.appendChild(deleteButton);

        manageWebsites.appendChild(siteDiv);
    }

    // 更新网站列表
    function updateSites() {
        chrome.storage.sync.set({ sites }, () => {
            manageWebsites.innerHTML = '';
            sites.forEach(site => addSiteToDOM(site));
        });
    }

    // 添加快捷键设置链接点击处理
    document.getElementById('shortcut-link').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({url: 'chrome://extensions/shortcuts'});
    });
});