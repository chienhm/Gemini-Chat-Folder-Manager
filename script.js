function initFloatingWidget() {
    // 1. Tạo nút Toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'gemini-folder-toggle';
    toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" style="width: 28px; height: 28px;">
      <defs>
        <linearGradient id="grad-btn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d96570;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M10 25 C10 16.7 16.7 10 25 10 L50 10 L60 25 L118 25 C123.5 25 128 29.5 128 35 L128 108 C128 119 119 128 108 128 L20 128 C9 128 0 119 0 108 L0 35 C0 29.5 4.5 25 10 25 Z" fill="#e3e3e3"/>
      <path d="M0 45 C0 36.7 6.7 30 15 30 L113 30 C121.3 30 128 36.7 128 45 L128 108 C128 119 119 128 108 128 L20 128 C9 128 0 119 0 108 L0 45 Z" fill="#a8c7fa"/>
      <path d="M64 45 C64 45 70 70 95 76 C70 82 64 107 64 107 C64 107 58 82 33 76 C58 70 64 45 64 45 Z" fill="url(#grad-btn)"/>
    </svg>`;
    toggleBtn.title = 'Mở quản lý Folder';
    document.body.appendChild(toggleBtn);

    // Load vị trí đã lưu (nếu có)
    chrome.storage.local.get(['geminiBtnPos'], (result) => {
        if (result.geminiBtnPos) {
            toggleBtn.style.top = result.geminiBtnPos.top;
            toggleBtn.style.left = result.geminiBtnPos.left;
            toggleBtn.style.bottom = 'auto';
            toggleBtn.style.right = 'auto';
        }
    });

    // 2. Tạo Panel chính
    const panel = document.createElement('div');
    panel.id = 'gemini-folder-panel';
    
    // Load saved width
    chrome.storage.local.get(['geminiPanelWidth'], (result) => {
        if (result.geminiPanelWidth) {
            panel.style.width = result.geminiPanelWidth + 'px';
        }
    });

    panel.innerHTML = `
       <div id="gemini-folder-resizer"></div>
       
       <!-- Close Button (Side Tab) -->
       <button id="g-close-panel-btn" title="Đóng Panel" style="
           position: absolute;
           top: 50%;
           right: -24px;
           transform: translateY(-50%);
           width: 24px;
           height: 48px;
           background: var(--gfm-bg-panel);
           border: 1px solid var(--gfm-border);
           border-left: none;
           border-radius: 0 8px 8px 0;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           color: var(--gfm-text-secondary);
           z-index: 10002;
           box-shadow: 4px 0 8px var(--gfm-shadow);
       ">
           <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
       </button>

       <div class="panel-header-row">
           <h3 style="display: flex; align-items: center; gap: 12px; margin: 0; font-size: 18px; line-height: 1; user-select: none;">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" style="width: 28px; height: 28px; min-width: 28px; display: block;">
                  <defs>
                    <linearGradient id="grad-header" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#d96570;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <path d="M10 25 C10 16.7 16.7 10 25 10 L50 10 L60 25 L118 25 C123.5 25 128 29.5 128 35 L128 108 C128 119 119 128 108 128 L20 128 C9 128 0 119 0 108 L0 35 C0 29.5 4.5 25 10 25 Z" fill="#e3e3e3"/>
                  <path d="M0 45 C0 36.7 6.7 30 15 30 L113 30 C121.3 30 128 36.7 128 45 L128 108 C128 119 119 128 108 128 L20 128 C9 128 0 119 0 108 L0 45 Z" fill="#a8c7fa"/>
                  <path d="M64 45 C64 45 70 70 95 76 C70 82 64 107 64 107 C64 107 58 82 33 76 C58 70 64 45 64 45 Z" fill="url(#grad-header)"/>
               </svg>
               <span style="padding-top: 2px;">Gemini Chat Folder</span>
           </h3>
           <div style="position: relative;">
               <button id="g-menu-btn" class="header-menu-btn" title="Menu">
                   <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
               </button>
               <div id="g-header-dropdown" class="header-dropdown">
                   <div class="dropdown-item" id="g-export-btn">
                       <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                       <span>Backup Data</span>
                   </div>
                   <div class="dropdown-item" id="g-import-btn">
                       <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
                       <span>Restore Data</span>
                   </div>
                   <div class="dropdown-item" id="g-toggle-float-btn">
                       <!-- Icon set by JS -->
                       <span>Ẩn nút nổi</span>
                   </div>
               </div>
           </div>
       </div>
       <input type="file" id="g-import-file" style="display: none" accept=".json">
       
       <!-- Section: Create Folder -->
       <div class="panel-section">
          <div class="input-group">
             <input type="text" id="g-new-folder" class="g-input" placeholder="Tên Folder mới...">
             <button id="g-add-folder" class="g-btn">Tạo</button>
          </div>
       </div>
 
       <!-- Section: Save Chat -->
       <div class="panel-section">
           <div class="section-label">Lưu Chat hiện tại</div>
           <input type="text" id="g-chat-name" class="g-input mb-8" placeholder="Tên đoạn chat (tùy chọn)...">
           
           <div class="input-group">
              <div class="custom-select-wrapper" id="g-folder-select-wrapper">
                  <div class="custom-select-trigger" id="g-folder-select-trigger">
                      <span>Chọn folder...</span>
                  </div>
                  <div class="custom-select-options" id="g-folder-select-options">
                      <!-- Options will be populated here -->
                  </div>
                  <input type="hidden" id="g-folder-select-value">
              </div>
              <button id="g-save-chat" class="g-btn save-btn">Lưu</button>
           </div>
       </div>
 
       <div id="g-folders-list" class="folder-container"></div>
    `;
    document.body.appendChild(panel);

    // 3. Xử lý logic Toggle & Drag
    makeDraggable(toggleBtn);
    makeResizable(panel);

    // --- THEME DETECTION ---
    let themeTimeout;
    function updateTheme() {
        if (themeTimeout) clearTimeout(themeTimeout);
        themeTimeout = setTimeout(() => {
            // Try to get background from body, fallback to html if transparent
            let bgColor = window.getComputedStyle(document.body).backgroundColor;
            if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                bgColor = window.getComputedStyle(document.documentElement).backgroundColor;
            }

            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                const isLight = brightness > 128;
                const hasClass = document.documentElement.classList.contains('gfm-light-mode');
                
                if (isLight && !hasClass) {
                    document.documentElement.classList.add('gfm-light-mode');
                } else if (!isLight && hasClass) {
                    document.documentElement.classList.remove('gfm-light-mode');
                }
            }
        }, 100); // Debounce 100ms
    }
    
    // Initial check
    updateTheme();
    
    // Observe body for attribute changes (often used for theme toggling)
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });

    toggleBtn.addEventListener('click', () => {
        if (toggleBtn.dataset.isDragging === "true") return;
        
        const isShowing = panel.classList.toggle('show');
        
        // Update Side Button Icon
        const sideBtn = document.getElementById('g-close-panel-btn');
        if (sideBtn) {
             sideBtn.innerHTML = isShowing 
                ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`
                : `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`;
        }
        
        if (isShowing) {
            // Luôn cập nhật tên chat mới nhất từ title khi mở panel
            const nameInput = document.getElementById('g-chat-name');
            // Lấy title hiện tại, bỏ phần "Gemini - " nếu có
            let currentTitle = document.title.replace(/^Gemini - /, "").trim();
            if (!currentTitle) currentTitle = "Chat không tên";
            
            nameInput.value = currentTitle;
            loadData(); 
        }
    });

    document.getElementById('g-add-folder').addEventListener('click', createFolder);
    document.getElementById('g-save-chat').addEventListener('click', saveCurrentChat);
    
    // Toggle Panel (Side Tab)
    const sideBtn = document.getElementById('g-close-panel-btn');
    sideBtn.addEventListener('click', () => {
        const isShowing = panel.classList.toggle('show');
        
        sideBtn.innerHTML = isShowing 
            ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`
            : `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`;

        if (isShowing) {
            const nameInput = document.getElementById('g-chat-name');
            let currentTitle = document.title.replace(/^Gemini - /, "").trim();
            if (!currentTitle) currentTitle = "Chat không tên";
            nameInput.value = currentTitle;
            loadData(); 
        }
    });

    // Menu Toggle
    const menuBtn = document.getElementById('g-menu-btn');
    const dropdown = document.getElementById('g-header-dropdown');
    
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (dropdown.classList.contains('show') && !dropdown.contains(e.target) && e.target !== menuBtn) {
            dropdown.classList.remove('show');
        }
    });

    // --- TOGGLE FLOATING BUTTON VISIBILITY ---
    const toggleFloatBtn = document.getElementById('g-toggle-float-btn');
    
    function updateFloatBtnState() {
        chrome.storage.local.get(['geminiFloatBtnHidden'], (result) => {
            const isHidden = result.geminiFloatBtnHidden;
            if (isHidden) {
                toggleBtn.style.display = 'none';
                toggleFloatBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    <span>Hiện nút nổi</span>
                `;
            } else {
                toggleBtn.style.display = 'flex';
                toggleFloatBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                    <span>Ẩn nút nổi</span>
                `;
            }
        });
    }
    
    // Initial check
    updateFloatBtnState();

    toggleFloatBtn.addEventListener('click', () => {
        chrome.storage.local.get(['geminiFloatBtnHidden'], (result) => {
            const newState = !result.geminiFloatBtnHidden;
            chrome.storage.local.set({ geminiFloatBtnHidden: newState }, () => {
                updateFloatBtnState();
                showToast(newState ? "Đã ẩn nút nổi" : "Đã hiện nút nổi", "success");
            });
        });
    });

    // --- EXPORT / IMPORT LOGIC ---
    document.getElementById('g-export-btn').addEventListener('click', () => {
        chrome.storage.local.get(['geminiFolders'], (result) => {
            const data = JSON.stringify(result.geminiFolders || [], null, 2);
            const blob = new Blob([data], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const now = new Date();
            const timestamp = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + '_' +
                String(now.getHours()).padStart(2, '0') + '-' +
                String(now.getMinutes()).padStart(2, '0') + '-' +
                String(now.getSeconds()).padStart(2, '0');
            
            a.download = `gemini-chat-folders-backup-${timestamp}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Đã xuất file backup thành công!", "success");
        });
    });

    const fileInput = document.getElementById('g-import-file');
    document.getElementById('g-import-btn').addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (Array.isArray(data)) {
                    // Check depth limit
                    for (const rootNode of data) {
                        if (rootNode.type === 'folder') {
                            if (getSubtreeDepth(rootNode) > 3) {
                                showToast("File backup chứa folder quá 3 cấp! Không thể restore.", "error");
                                fileInput.value = '';
                                return;
                            }
                        }
                    }

                    showConfirm("Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại. Bạn có chắc không?", () => {
                        try {
                            chrome.storage.local.set({ geminiFolders: data }, () => {
                                if (chrome.runtime.lastError) {
                                    showToast("Lỗi: " + chrome.runtime.lastError.message, "error");
                                    return;
                                }
                                loadData();
                                showToast("Đã khôi phục dữ liệu thành công!", "success");
                            });
                        } catch (e) {
                            console.error(e);
                            showToast("Extension đã cập nhật. Vui lòng F5 lại trang!", "error");
                        }
                    }, "Có");
                } else {
                    showToast("File không hợp lệ!", "error");
                }
            } catch (err) {
                showToast("Lỗi đọc file!", "error");
            }
            fileInput.value = ''; // Reset input
        };
        reader.readAsText(file);
    });
}

// === HÀM XỬ LÝ KÉO THẢ NÚT (DRAG) ===
function makeDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.dataset.isDragging = "false"; // Reset trạng thái
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Tính toán vị trí mới
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Nếu di chuyển chuột thì đánh dấu là đang kéo
        elmnt.dataset.isDragging = "true";

        // Cập nhật vị trí
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        elmnt.style.bottom = "auto";
        elmnt.style.right = "auto";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        
        // Lưu vị trí mới vào storage
        if (elmnt.dataset.isDragging === "true") {
            const pos = { top: elmnt.style.top, left: elmnt.style.left };
            chrome.storage.local.set({ geminiBtnPos: pos });
            
            // Reset flag sau một khoảng ngắn để tránh click nhầm
            setTimeout(() => { elmnt.dataset.isDragging = "false"; }, 100);
        }
    }
}

// --- LOGIC DỮ LIỆU MỚI (RECURSIVE) ---

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getRandomIcon() {
    const icons = ['💬', '💭', '📝', '💡', '✨', '🤖', '🧠', '📚', '📌', '📍', '🚩', '💎', '🚀', '🌟', '🔥', '🌈', '🔮', '🎯', '🎨', '🎼'];
    return icons[Math.floor(Math.random() * icons.length)];
}

function createFolder(parentId = null) {
    // Handle event object if called from event listener
    if (typeof parentId !== 'string') parentId = null;

    const doCreate = (name) => {
        if (!name) return;
        chrome.storage.local.get(['geminiFolders'], (result) => {
            let data = result.geminiFolders || [];
            if (!Array.isArray(data)) data = []; 

            const newFolder = {
                id: generateId(),
                type: 'folder',
                name: name,
                children: [],
                isOpen: true
            };

            if (parentId) {
                const parentDepth = getFolderDepth(data, parentId);
                if (parentDepth >= 3) {
                    showToast("Chỉ được tạo tối đa 3 cấp thư mục!", "error");
                    return;
                }

                const parent = findNode(data, parentId);
                if (parent && parent.type === 'folder') {
                    // Add to top to match inline input position
                    parent.children.unshift(newFolder);
                    parent.isOpen = true;
                }
            } else {
                data.push(newFolder);
            }

            chrome.storage.local.set({ geminiFolders: data }, loadData);
        });
    };

    if (parentId) {
        // Inline Input Logic
        const header = document.querySelector(`.folder-name[data-id="${parentId}"]`);
        if (!header) return;
        
        const childrenDiv = header.nextElementSibling;
        if (!childrenDiv) return;

        // Visually open immediately
        childrenDiv.classList.add('open');
        
        // Create Input Container
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.padding = '10px 16px';
        container.style.background = '#1e1f20';
        container.style.borderRadius = '12px';
        container.style.border = '1px solid #a8c7fa'; // Active border
        container.style.marginBottom = '8px';
        container.style.marginLeft = '4px';
        container.style.marginRight = '4px';
        
        // Icon
        const icon = document.createElement('span');
        icon.textContent = '📁';
        icon.style.marginRight = '12px';
        container.appendChild(icon);

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'g-input';
        input.style.height = '28px';
        input.style.border = 'none'; // Remove default border
        input.style.background = 'transparent';
        input.style.padding = '0';
        input.style.width = '100%';
        input.style.outline = 'none';
        input.style.boxShadow = 'none';
        input.placeholder = 'Tên folder mới...';
        
        container.appendChild(input);
        
        // Insert after top drop zone
        const topZone = childrenDiv.querySelector('.root-drop-zone[data-action="folder-top"]');
        if (topZone) {
            topZone.after(container);
        } else {
            childrenDiv.prepend(container);
        }
        
        input.focus();
        
        let finished = false;
        const finish = (save) => {
            if (finished) return;
            finished = true;
            const val = input.value.trim();
            container.remove();
            if (save && val) {
                if (val.length > 150) {
                    showToast("Tên folder không được quá 150 ký tự!", "error");
                    return;
                }
                doCreate(val);
            }
        };
        
        input.addEventListener('blur', () => {
            setTimeout(() => finish(true), 100);
        });
        
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                finish(true);
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                finish(false);
            }
            e.stopPropagation();
        });

    } else {
        const nameInput = document.getElementById('g-new-folder');
        const name = nameInput.value.trim();
        if (name) {
            if (name.length > 150) {
                showToast("Tên folder không được quá 150 ký tự!", "error");
                return;
            }
            doCreate(name);
            nameInput.value = '';
        }
    }
}

// === UI HELPERS ===
function showToast(message, type = 'info') {
    let toast = document.getElementById('g-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'g-toast';
        toast.className = 'g-toast';
        document.body.appendChild(toast);
    }
    
    toast.className = 'g-toast ' + type;
    toast.textContent = message; // Use textContent to prevent XSS
    
    requestAnimationFrame(() => toast.classList.add('show'));
    
    if (toast.timeout) clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showConfirm(message, onConfirm, confirmText = 'Xóa') {
    let overlay = document.getElementById('g-confirm-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'g-confirm-overlay';
        overlay.className = 'g-modal-overlay';
        overlay.innerHTML = `
            <div class="g-modal">
                <div class="g-modal-title">Xác nhận</div>
                <div class="g-modal-body" id="g-confirm-msg" style="color: #c4c7c5; margin-bottom: 20px;"></div>
                <div class="g-modal-actions">
                    <button class="g-btn g-btn-secondary" id="g-confirm-cancel">Hủy</button>
                    <button class="g-btn g-btn-danger" id="g-confirm-ok">Xóa</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('g-confirm-cancel').addEventListener('click', () => {
            overlay.classList.remove('show');
        });
    }
    
    const okBtn = document.getElementById('g-confirm-ok');
    okBtn.textContent = confirmText;
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);
    
    newOkBtn.addEventListener('click', () => {
        onConfirm();
        overlay.classList.remove('show');
    });
    
    document.getElementById('g-confirm-msg').textContent = message;
    overlay.classList.add('show');
}

function showPrompt(message, onConfirm) {
    let overlay = document.getElementById('g-prompt-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'g-prompt-overlay';
        overlay.className = 'g-modal-overlay';
        overlay.innerHTML = `
            <div class="g-modal">
                <div class="g-modal-title" id="g-prompt-title">Nhập thông tin</div>
                <div class="g-modal-body" style="margin-bottom: 20px;">
                    <input type="text" id="g-prompt-input" class="g-input" style="width: 100%;" placeholder="...">
                </div>
                <div class="g-modal-actions">
                    <button class="g-btn g-btn-secondary" id="g-prompt-cancel">Hủy</button>
                    <button class="g-btn" id="g-prompt-ok" style="background: #a8c7fa; color: #041e49;">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('g-prompt-cancel').addEventListener('click', () => {
            overlay.classList.remove('show');
        });
    }
    
    const input = document.getElementById('g-prompt-input');
    const title = document.getElementById('g-prompt-title');
    const okBtn = document.getElementById('g-prompt-ok');
    
    title.textContent = message;
    input.value = '';
    
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);
    
    const finish = () => {
        const val = input.value.trim();
        if (val) {
            onConfirm(val);
            overlay.classList.remove('show');
        }
    };

    newOkBtn.addEventListener('click', finish);
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter') finish();
        if (e.key === 'Escape') overlay.classList.remove('show');
    };
    
    overlay.classList.add('show');
    setTimeout(() => input.focus(), 100);
}

function saveCurrentChat() {
    const folderId = document.getElementById('g-folder-select-value').value;
    if (!folderId) { 
        showToast("Vui lòng chọn folder trước!", "error"); 
        return; 
    }
 
    const nameInput = document.getElementById('g-chat-name');
    const customTitle = nameInput.value.trim();
    const title = customTitle || document.title.replace(/^Gemini - /, "").trim() || "Chat không tên";
    
    if (title.length > 150) {
        showToast("Tên chat không được quá 150 ký tự!", "error");
        return;
    }

    const url = window.location.href;
 
    chrome.storage.local.get(['geminiFolders'], (result) => {
       let data = result.geminiFolders || [];
       
       const targetFolder = findNode(data, folderId);
       if (targetFolder) {
           const exists = targetFolder.children.some(c => c.type === 'chat' && c.url === url);
           if (exists) {
               showToast(`Chat này đã có trong folder "${targetFolder.name}"!`, "warning");
               return;
           }
           
           targetFolder.children.push({
               id: generateId(),
               type: 'chat',
               title: title,
               url: url,
               icon: getRandomIcon()
           });
           targetFolder.isOpen = true;

           chrome.storage.local.set({ geminiFolders: data }, () => {
              loadData();
              showToast("Đã lưu chat thành công!", "success");
              nameInput.value = ''; 
           });
       }
    });
}

function getSubtreeDepth(node) {
    if (node.type !== 'folder') return 0;
    let maxChildDepth = 0;
    if (node.children) {
        for (const child of node.children) {
            if (child.type === 'folder') {
                maxChildDepth = Math.max(maxChildDepth, getSubtreeDepth(child));
            }
        }
    }
    return 1 + maxChildDepth;
}

function getFolderDepth(nodes, id, currentDepth = 1) {
    for (const node of nodes) {
        if (node.id === id) return currentDepth;
        if (node.children) {
            const depth = getFolderDepth(node.children, id, currentDepth + 1);
            if (depth !== -1) return depth;
        }
    }
    return -1;
}

function findNode(nodes, id) {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

function deleteNode(nodes, id) {
    const idx = nodes.findIndex(n => n.id === id);
    if (idx !== -1) {
        nodes.splice(idx, 1);
        return true;
    }
    for (const node of nodes) {
        if (node.children) {
            if (deleteNode(node.children, id)) return true;
        }
    }
    return false;
}

// --- DRAG & DROP LOGIC ---
let dragSrcId = null;

function findParentInfo(nodes, id, parent = null) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
            return { array: nodes, index: i, parent: parent };
        }
        if (nodes[i].children) {
            const res = findParentInfo(nodes[i].children, id, nodes[i]);
            if (res) return res;
        }
    }
    return null;
}

function isDescendant(nodes, targetId) {
    for (const node of nodes) {
        if (node.id === targetId) return true;
        if (node.children && isDescendant(node.children, targetId)) return true;
    }
    return false;
}

function handleDragStart(e) {
    // FIX: Use currentTarget to get the row element, not the child (icon/text)
    const target = e.currentTarget;
    dragSrcId = target.dataset.id;
    
    target.classList.add('draggable-source');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragSrcId); // Required for Firefox
    e.stopPropagation();
    
    document.getElementById('g-folders-list').classList.add('dragging-active');
}

function handleDragEnd(e) {
    const target = e.currentTarget;
    target.classList.remove('draggable-source');
    
    document.querySelectorAll('.drag-target-top, .drag-target-bottom, .drag-target-inside')
        .forEach(el => el.classList.remove('drag-target-top', 'drag-target-bottom', 'drag-target-inside'));
        
    document.getElementById('g-folders-list').classList.remove('dragging-active');
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const targetEl = e.currentTarget;
    const targetId = targetEl.dataset.id;
    
    // Don't allow dropping on itself
    if (targetId === dragSrcId) return;

    const rect = targetEl.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const height = rect.height;
    
    // Reset classes
    targetEl.classList.remove('drag-target-top', 'drag-target-bottom', 'drag-target-inside');

    if (targetEl.classList.contains('folder-name')) {
        // Folder Logic: Top 25% (Before), Bottom 25% (After), Middle 50% (Inside)
        if (relY < height * 0.25) {
            targetEl.classList.add('drag-target-top');
        } else if (relY > height * 0.75) {
            targetEl.classList.add('drag-target-bottom');
        } else {
            targetEl.classList.add('drag-target-inside');
        }
    } else {
        // Chat Logic: Top 50% (Before), Bottom 50% (After)
        if (relY < height * 0.5) {
            targetEl.classList.add('drag-target-top');
        } else {
            targetEl.classList.add('drag-target-bottom');
        }
    }
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-target-top', 'drag-target-bottom', 'drag-target-inside');
}

function handleDrop(e, data) {
    e.stopPropagation();
    e.preventDefault();
    
    const targetEl = e.currentTarget;
    const targetId = targetEl.dataset.id;
    
    if (dragSrcId === targetId) return;

    // Determine Action
    let action = '';
    if (targetEl.classList.contains('drag-target-top')) action = 'before';
    else if (targetEl.classList.contains('drag-target-bottom')) action = 'after';
    else if (targetEl.classList.contains('drag-target-inside')) action = 'inside';
    
    if (!action) return;

    // Perform Move
    chrome.storage.local.get(['geminiFolders'], (result) => {
        let rootData = result.geminiFolders || [];
        
        const srcInfo = findParentInfo(rootData, dragSrcId);
        const targetInfo = findParentInfo(rootData, targetId);
        
        if (!srcInfo || !targetInfo) return;

        const srcNode = srcInfo.array[srcInfo.index];
        const targetNode = targetInfo.array[targetInfo.index];

        // Validation: Cannot move folder into its own descendant
        if (srcNode.type === 'folder' && action === 'inside') {
             if (isDescendant(srcNode.children, targetId)) {
                 showToast("Không thể di chuyển folder vào trong con của nó!", "error");
                 return;
             }
        }
        // Validation: Cannot move folder into chat
        if (targetNode.type === 'chat' && action === 'inside') return;

        // --- DEPTH CHECK ---
        if (srcNode.type === 'folder') {
            const srcSubtreeDepth = getSubtreeDepth(srcNode);
            let targetLevel = 0;

            if (action === 'inside') {
                targetLevel = getFolderDepth(rootData, targetId);
                if (targetLevel + srcSubtreeDepth > 3) {
                    showToast("Di chuyển sẽ vượt quá 3 cấp thư mục!", "error");
                    return;
                }
            } else { // before or after
                targetLevel = getFolderDepth(rootData, targetId);
                if (targetLevel + srcSubtreeDepth - 1 > 3) {
                    showToast("Di chuyển sẽ vượt quá 3 cấp thư mục!", "error");
                    return;
                }
            }
        }
        // -------------------

        // Remove Source
        srcInfo.array.splice(srcInfo.index, 1);

        // Re-fetch target info because array might have changed if in same parent
        const newTargetInfo = findParentInfo(rootData, targetId);
        
        if (action === 'inside') {
            const newParent = newTargetInfo.array[newTargetInfo.index];
            newParent.children.push(srcNode);
            newParent.isOpen = true;
        } else {
            let insertIndex = newTargetInfo.index;
            if (action === 'after') insertIndex++;
            newTargetInfo.array.splice(insertIndex, 0, srcNode);
        }

        chrome.storage.local.set({ geminiFolders: rootData }, loadData);
    });
}

function handleZoneDrop(e, data) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    const action = e.target.dataset.action; 
    const targetId = e.target.dataset.targetId;
    
    if (!dragSrcId) return;

    chrome.storage.local.get(['geminiFolders'], (result) => {
        let rootData = result.geminiFolders || [];
        
        const srcInfo = findParentInfo(rootData, dragSrcId);
        if (!srcInfo) return;

        const srcNode = srcInfo.array[srcInfo.index];

        // Validation for folder targets
        if (action === 'folder-top' || action === 'folder-bottom') {
             if (srcNode.id === targetId) return;
             if (srcNode.type === 'folder' && isDescendant(srcNode.children, targetId)) {
                 showToast("Không thể di chuyển folder vào trong con của nó!", "error");
                 return;
             }
        }
        
        // --- DEPTH CHECK ---
        if (srcNode.type === 'folder') {
            const srcSubtreeDepth = getSubtreeDepth(srcNode);
            
            if (action === 'root-top' || action === 'root-bottom') {
                if (srcSubtreeDepth > 3) {
                     showToast("Folder này có quá nhiều cấp con!", "error");
                     return;
                }
            } else if (action === 'folder-top' || action === 'folder-bottom') {
                const targetLevel = getFolderDepth(rootData, targetId);
                if (targetLevel + srcSubtreeDepth > 3) {
                    showToast("Di chuyển sẽ vượt quá 3 cấp thư mục!", "error");
                    return;
                }
            }
        }
        // -------------------

        // Remove from old location
        srcInfo.array.splice(srcInfo.index, 1);

        // Add to new location
        if (action === 'root-top') {
            rootData.unshift(srcNode);
        } else if (action === 'root-bottom') {
            rootData.push(srcNode);
        } else if (action === 'folder-top' || action === 'folder-bottom') {
             const targetInfo = findParentInfo(rootData, targetId);
             if (targetInfo) {
                 const targetFolder = targetInfo.array[targetInfo.index];
                 if (!targetFolder.children) targetFolder.children = [];
                 
                 if (action === 'folder-top') {
                     targetFolder.children.unshift(srcNode);
                 } else {
                     targetFolder.children.push(srcNode);
                 }
                 targetFolder.isOpen = true;
             }
        }

        chrome.storage.local.set({ geminiFolders: rootData }, loadData);
    });
}

function setupZoneEvents(el, data) {
    el.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.target.classList.add('drag-over');
    });
    el.addEventListener('dragleave', (e) => {
        e.target.classList.remove('drag-over');
    });
    el.addEventListener('drop', (e) => handleZoneDrop(e, data));
}

function loadData() {
    chrome.storage.local.get(['geminiFolders'], (result) => {
       let data = result.geminiFolders;

       // MIGRATION: Object -> Array
       if (data && !Array.isArray(data)) {
           const newData = [];
           for (const [name, chats] of Object.entries(data)) {
               const folderId = generateId();
               const children = chats.map(c => ({
                   id: generateId(),
                   type: 'chat',
                   title: c.title,
                   url: c.url
               }));
               newData.push({
                   id: folderId,
                   type: 'folder',
                   name: name,
                   children: children,
                   isOpen: false
               });
           }
           data = newData;
           chrome.storage.local.set({ geminiFolders: data });
       }
       
       if (!data) data = [];

       const listDiv = document.getElementById('g-folders-list');
       
       // --- CUSTOM DROPDOWN LOGIC ---
       const selectWrapper = document.getElementById('g-folder-select-wrapper');
       const selectTrigger = document.getElementById('g-folder-select-trigger');
       const selectOptions = document.getElementById('g-folder-select-options');
       const selectValue = document.getElementById('g-folder-select-value');
       const triggerSpan = selectTrigger.querySelector('span');

       listDiv.innerHTML = ''; 
       selectOptions.innerHTML = '';
       
       // Reset selection
       selectValue.value = '';
       triggerSpan.textContent = 'Chọn folder...';
       selectTrigger.onclick = (e) => {
           e.stopPropagation(); // Prevent closing immediately
           selectWrapper.classList.toggle('open');
       };
       
       // Close dropdown when clicking outside
       document.addEventListener('click', (e) => {
           if (!selectWrapper.contains(e.target)) {
               selectWrapper.classList.remove('open');
           }
       });

       // Render Select Options
       function renderOptions(nodes, depth = 0) {
           nodes.forEach(node => {
               if (node.type === 'folder') {
                   const opt = document.createElement('div');
                   opt.className = 'custom-option';
                   opt.dataset.value = node.id;
                   // Visual indentation using non-breaking spaces or padding
                   opt.style.paddingLeft = (12 + depth * 15) + 'px'; 
                   opt.textContent = (depth > 0 ? '└─ ' : '') + node.name;
                   
                   opt.addEventListener('click', () => {
                       selectValue.value = node.id;
                       triggerSpan.textContent = node.name;
                       selectWrapper.classList.remove('open');
                       
                       // Update selected class
                       document.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
                       opt.classList.add('selected');
                   });
                   
                   selectOptions.appendChild(opt);
                   if (node.children) renderOptions(node.children, depth + 1);
               }
           });
       }
       renderOptions(data);
       // -----------------------------

       // Top Zone

       // Render Tree
       function renderTree(nodes, container, currentDepth = 1) {
           nodes.forEach(node => {
               if (node.type === 'folder') {
                   const folderRow = document.createElement('div');
                   folderRow.className = 'folder-row';
                   
                   const header = document.createElement('div');
                   header.className = 'folder-name';
                   header.draggable = true; // Make header draggable
                   header.dataset.id = node.id;
                   
                   // Drag Events
                   header.addEventListener('dragstart', handleDragStart);
                   header.addEventListener('dragend', handleDragEnd);
                   header.addEventListener('dragover', handleDragOver);
                   header.addEventListener('dragleave', handleDragLeave);
                   header.addEventListener('drop', (e) => handleDrop(e, data));

                   const titleSpan = document.createElement('span');
                   titleSpan.className = 'folder-title-text';
                   titleSpan.textContent = `📁 ${node.name}`;
                   header.appendChild(titleSpan);

                   // Actions
                   const actionsSpan = document.createElement('span');
                   actionsSpan.className = 'folder-actions';
                   actionsSpan.style.display = 'flex';
                   actionsSpan.style.alignItems = 'center';

                   // Add Subfolder
                   if (currentDepth < 3) {
                       const addSubBtn = document.createElement('span');
                       addSubBtn.className = 'action-btn add-subfolder';
                       addSubBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"/></svg>';
                       addSubBtn.title = 'Tạo folder con';
                       addSubBtn.dataset.id = node.id;
                       actionsSpan.appendChild(addSubBtn);
                   }

                   // Rename
                   const renBtn = document.createElement('span');
                   renBtn.className = 'action-btn rename-folder';
                   renBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
                   renBtn.title = 'Đổi tên Folder';
                   renBtn.dataset.id = node.id;
                   actionsSpan.appendChild(renBtn);

                   // Clear
                   const clearBtn = document.createElement('span');
                   clearBtn.className = 'action-btn clear-folder';
                   clearBtn.innerHTML = '🧹';
                   clearBtn.title = 'Dọn dẹp (Xóa hết chat)';
                   clearBtn.dataset.id = node.id;
                   actionsSpan.appendChild(clearBtn);

                   // Delete
                   const delBtn = document.createElement('span');
                   delBtn.className = 'action-btn del-folder';
                   delBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
                   delBtn.title = 'Xóa Folder';
                   delBtn.dataset.id = node.id;
                   actionsSpan.appendChild(delBtn);

                   header.appendChild(actionsSpan);
                   folderRow.appendChild(header);

                   // Children Container
                   const childrenDiv = document.createElement('div');
                   childrenDiv.className = 'folder-children';
                   if (node.isOpen) childrenDiv.classList.add('open');
                   
                   // Toggle Open/Close
                   header.addEventListener('click', (e) => {
                       if (!e.target.closest('.action-btn') && !e.target.closest('input')) {
                           node.isOpen = !node.isOpen;
                           chrome.storage.local.set({ geminiFolders: data }); // Save state
                           childrenDiv.classList.toggle('open');
                       }
                   });

                   // Sub-folder Top Zone
                   const subTop = document.createElement('div');
                   subTop.className = 'root-drop-zone';
                   subTop.dataset.action = 'folder-top';
                   subTop.dataset.targetId = node.id;
                   setupZoneEvents(subTop, data);
                   childrenDiv.appendChild(subTop);

                   renderTree(node.children, childrenDiv, currentDepth + 1);

                   // Sub-folder Bottom Zone
                   const subBot = document.createElement('div');
                   subBot.className = 'root-drop-zone';
                   subBot.dataset.action = 'folder-bottom';
                   subBot.dataset.targetId = node.id;
                   setupZoneEvents(subBot, data);
                   childrenDiv.appendChild(subBot);

                   folderRow.appendChild(childrenDiv);
                   container.appendChild(folderRow);

               } else if (node.type === 'chat') {
                   const item = document.createElement('div');
                   item.className = 'chat-item-row';
                   item.draggable = true;
                   item.dataset.id = node.id;

                   // Drag Events
                   item.addEventListener('dragstart', handleDragStart);
                   item.addEventListener('dragend', handleDragEnd);
                   item.addEventListener('dragover', handleDragOver);
                   item.addEventListener('dragleave', handleDragLeave);
                   item.addEventListener('drop', (e) => handleDrop(e, data));

                   const link = document.createElement('a');
                   if (node.url && (node.url.startsWith('http://') || node.url.startsWith('https://'))) {
                       link.href = node.url;
                   } else {
                       link.href = '#';
                       link.onclick = (e) => { e.preventDefault(); showToast("URL không hợp lệ!", "error"); };
                   }
                   link.className = 'chat-link';
                   link.textContent = `${node.icon || '💬'} ${node.title}`;
                   item.appendChild(link);

                   const actions = document.createElement('span');
                   actions.className = 'chat-actions';
                   actions.style.display = 'flex';
                   
                   // Rename Chat
                   const renChat = document.createElement('span');
                   renChat.className = 'action-btn rename-chat';
                   renChat.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
                   renChat.title = 'Đổi tên Chat';
                   renChat.dataset.id = node.id;
                   actions.appendChild(renChat);

                   // Delete Chat
                   const delChat = document.createElement('span');
                   delChat.className = 'action-btn delete-btn';
                   delChat.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
                   delChat.title = 'Xóa Chat';
                   delChat.dataset.id = node.id;
                   actions.appendChild(delChat);

                   item.appendChild(actions);
                   container.appendChild(item);
               }
           });
       }
       renderTree(data, listDiv);
       
       // Bottom Zone
       const bottomZone = document.createElement('div');
       bottomZone.className = 'root-drop-zone';
       bottomZone.dataset.action = 'root-bottom';
       setupZoneEvents(bottomZone, data);
       listDiv.appendChild(bottomZone);

       // Drop on Empty Space -> Move to Root Bottom
       listDiv.addEventListener('dragover', (e) => {
           e.preventDefault();
           if (e.target === listDiv) {
               listDiv.classList.add('drag-over-void');
           }
       });
       listDiv.addEventListener('dragleave', (e) => {
           if (e.target === listDiv) {
               listDiv.classList.remove('drag-over-void');
           }
       });
       listDiv.addEventListener('drop', (e) => {
           if (e.target === listDiv) {
               e.preventDefault();
               listDiv.classList.remove('drag-over-void');
               
               // Mock event to reuse handleZoneDrop logic
               const mockEvent = {
                   preventDefault: () => {},
                   target: {
                       classList: { remove: () => {} },
                       dataset: { action: 'root-bottom' }
                   }
               };
               handleZoneDrop(mockEvent, data);
           }
       });

       addEvents(data);
    });
}

function enableInlineEdit(element, currentValue, onSave, triggerBtn) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.className = 'g-input'; 
    input.style.height = '28px';
    input.style.padding = '0 8px';
    input.style.fontSize = '14px';
    input.style.flex = '1';
    input.style.minWidth = '0';
    input.style.marginRight = '8px';
    
    // Create Save Button
    const saveBtn = document.createElement('span');
    saveBtn.className = 'action-btn';
    saveBtn.style.color = '#8ab4f8';
    saveBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>';
    saveBtn.title = 'Lưu thay đổi';

    // Swap UI
    element.style.display = 'none';
    element.parentNode.insertBefore(input, element);
    
    if (triggerBtn) {
        triggerBtn.style.display = 'none';
        triggerBtn.parentNode.insertBefore(saveBtn, triggerBtn);
    }

    input.focus();

    let isProcessing = false;

    function finish(shouldSave) {
        if (isProcessing) return;
        isProcessing = true;

        const newValue = input.value.trim();
        
        if (shouldSave && newValue && newValue !== currentValue) {
            if (newValue.length > 150) {
                showToast("Tên không được quá 150 ký tự!", "error");
                // Restore UI
                input.remove();
                element.style.display = '';
                if (triggerBtn) {
                    saveBtn.remove();
                    triggerBtn.style.display = '';
                }
                return;
            }
            onSave(newValue);
            // UI will be rebuilt by loadData
        } else {
            // Restore UI
            input.remove();
            element.style.display = '';
            if (triggerBtn) {
                saveBtn.remove();
                triggerBtn.style.display = '';
            }
        }
    }

    input.addEventListener('blur', () => {
        // Delay to allow saveBtn mousedown to fire
        setTimeout(() => finish(true), 200);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finish(true);
        } else if (e.key === 'Escape') {
            finish(false);
        }
        e.stopPropagation();
    });
    
    input.addEventListener('click', (e) => e.stopPropagation());

    saveBtn.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent blur
        finish(true);
    });
    
    saveBtn.addEventListener('click', (e) => e.stopPropagation());
}

function addEvents(data) {
    // Add Subfolder
    document.querySelectorAll('.add-subfolder').forEach(btn => {
        btn.addEventListener('click', (e) => {
            createFolder(e.currentTarget.dataset.id);
        });
    });

    // Rename Folder
    document.querySelectorAll('.rename-folder').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = e.currentTarget.dataset.id;
            const node = findNode(data, id);
            if (node) {
                const header = e.currentTarget.closest('.folder-name');
                const textSpan = header.querySelector('span:first-child');
                
                enableInlineEdit(textSpan, node.name, (newName) => {
                    node.name = newName;
                    chrome.storage.local.set({ geminiFolders: data }, loadData);
                }, e.currentTarget);
            }
        });
    });

    // Clear Folder (Delete all children)
    document.querySelectorAll('.clear-folder').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const node = findNode(data, id);
            if (node) {
                showConfirm(`Bạn có chắc muốn xóa hết nội dung trong "${node.name}"?`, () => {
                    node.children = [];
                    chrome.storage.local.set({ geminiFolders: data }, loadData);
                    showToast("Đã dọn sạch folder", "success");
                });
            }
        });
    });

    // Delete Folder/Chat
    document.querySelectorAll('.del-folder, .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            showConfirm("Bạn có chắc muốn xóa mục này không?", () => {
                deleteNode(data, id);
                chrome.storage.local.set({ geminiFolders: data }, loadData);
                showToast("Đã xóa thành công", "success");
            });
        });
    });

    // Rename Chat
    document.querySelectorAll('.rename-chat').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = e.currentTarget.dataset.id;
            const node = findNode(data, id);
            if (node) {
                const row = e.currentTarget.closest('.chat-item-row');
                const link = row.querySelector('.chat-link');
                
                enableInlineEdit(link, node.title, (newTitle) => {
                    node.title = newTitle;
                    chrome.storage.local.set({ geminiFolders: data }, loadData);
                }, e.currentTarget);
            }
        });
    });
}

// === HÀM XỬ LÝ RESIZE PANEL ===
function makeResizable(panel) {
    const resizer = panel.querySelector('#gemini-folder-resizer');
    if (!resizer) return;

    let startX, startWidth;

    resizer.addEventListener('mousedown', initResize);

    function initResize(e) {
        e.preventDefault();
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
        
        resizer.classList.add('resizing');
        
        document.documentElement.addEventListener('mousemove', doResize);
        document.documentElement.addEventListener('mouseup', stopResize);
    }

    function doResize(e) {
        const newWidth = startWidth + (e.clientX - startX);
        if (newWidth > 250 && newWidth < 800) { 
            panel.style.width = newWidth + 'px';
        }
    }

    function stopResize() {
        resizer.classList.remove('resizing');
        document.documentElement.removeEventListener('mousemove', doResize);
        document.documentElement.removeEventListener('mouseup', stopResize);
        
        chrome.storage.local.set({ geminiPanelWidth: parseInt(panel.style.width) });
    }
}

initFloatingWidget();