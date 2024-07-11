document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('search-box');
    const searchButton = document.getElementById('search-button');
    const siteSelection = document.getElementById('site-selection');
    const settingsButton = document.getElementById('settings-button');

    // 使搜索框在加载后自动获取焦点
    searchBox.focus();

    // 全局状态对象
    let sites = [];

    // 从 chrome.storage 中加载网站信息
    chrome.storage.sync.get('sites', function(data) {
        sites = data.sites || [
            {name: 'Site 1', url: 'https://site1.com/search?q=', enabled: true},
            {name: 'Site 2', url: 'https://site2.com/search?q=', enabled: true},
            {name: 'Site 3', url: 'https://site3.com/search?q=', enabled: true},
            {name: 'Site 4', url: 'https://site4.com/search?q=', enabled: true},
            {name: 'Site 5', url: 'https://site5.com/search?q=', enabled: true}
        ];

        function renderSites() {
            siteSelection.innerHTML = ''; // 清空站点选择容器

            sites.forEach((site, index) => {
                const siteButton = document.createElement('button');
                siteButton.textContent = site.name;
                siteButton.classList.add('site-button');
                if (!site.enabled) {
                    siteButton.classList.add('disabled');
                }

                siteButton.addEventListener('click', () => {
                    site.enabled = !site.enabled;
                    siteButton.classList.toggle('disabled');
                    saveSites(); // 保存状态
                    searchBox.focus(); // 重新聚焦搜索框
                });

                siteSelection.appendChild(siteButton);
            });

            // 启用拖拽排序功能
            new Sortable(siteSelection, {
                animation: 150,
                onEnd: function () {
                    // 更新 sites 数组的顺序
                    const updatedSites = [];
                    siteSelection.querySelectorAll('.site-button').forEach(button => {
                        const index = button.textContent;
                        updatedSites.push(sites.find(site => site.name === index));
                    });
                    sites = updatedSites;
                    saveSites(); // 保存新顺序
                }
            });
        }

        renderSites();

        // 执行搜索功能
        function performSearch() {
            const query = searchBox.value;
            if (!query) return;

            sites.forEach(site => {
                if (site.enabled) {
                    const url = site.url + encodeURIComponent(query);
                    chrome.tabs.create({ url: url });
                }
            });
        }

        // 搜索按钮事件
        searchButton.addEventListener('click', performSearch);

        // 回车键事件
        searchBox.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        // 保存站点状态到 storage
        function saveSites() {
            chrome.storage.sync.set({ sites });
        }

        // 设置按钮事件
        settingsButton.addEventListener('click', () => {
            saveSites();
            chrome.runtime.openOptionsPage();
        });
    });
});
