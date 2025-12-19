// 打开模态框显示大图
function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const img = element.querySelector('img');
    
    modal.style.display = 'block';
    modalImg.src = img.src;
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// 防止点击图片时关闭模态框
document.getElementById('modalImage').addEventListener('click', function(event) {
    event.stopPropagation();
});

// 页面加载完成提示
console.log('Shader Gallery loaded successfully');