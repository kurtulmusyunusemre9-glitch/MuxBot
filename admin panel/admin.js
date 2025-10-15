// Admin bilgileri (gerçek uygulamada database'de tutulur)
const ADMIN_CREDENTIALS = {
    email: 'admin@muxclan.com',
    password: 'muxadmin2025'  // Güvenli şifre kullanın!
};

let currentAdmin = null;
let salesData = JSON.parse(localStorage.getItem('muxSalesData')) || [];
let xmlFiles = JSON.parse(localStorage.getItem('muxXmlFiles')) || {
    basic: [],
    premium: [],
    pro: []
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Authentication check - admin access only
    checkAdminAuthentication();
    
    // Admin giriş formu
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // XML upload formu
    const xmlUploadForm = document.getElementById('xmlUploadForm');
    if (xmlUploadForm) {
        xmlUploadForm.addEventListener('submit', handleXmlUpload);
    }
    
    // Eğer admin oturumu varsa direkt paneli göster
    const savedAdmin = localStorage.getItem('muxCurrentAdmin');
    if (savedAdmin) {
        currentAdmin = JSON.parse(savedAdmin);
        showAdminPanel();
    }
});

// Admin authentication check
function checkAdminAuthentication() {
    const authData = localStorage.getItem('muxAuth');
    
    if (!authData) {
        // No authentication, redirect to login
        redirectToLogin();
        return;
    }
    
    try {
        const sessionData = JSON.parse(authData);
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        // Check if session is valid and user is admin
        if (hoursDiff < 24 && sessionData.role === 'admin') {
            // User is authenticated as admin
            console.log('Admin access granted');
            return;
        } else if (hoursDiff >= 24) {
            // Session expired
            localStorage.removeItem('muxAuth');
            redirectToLogin('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
        } else if (sessionData.role !== 'admin') {
            // User is authenticated but not admin
            redirectToLogin('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
        }
    } catch (error) {
        localStorage.removeItem('muxAuth');
        redirectToLogin('Geçersiz oturum bilgisi.');
    }
}

function redirectToLogin(message = 'Admin paneline erişmek için giriş yapmalısınız.') {
    alert(message);
    window.location.href = 'http://localhost:3000/auth/login';
}

// Admin girişi
function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        currentAdmin = { email: email, loginTime: new Date().toISOString() };
        localStorage.setItem('muxCurrentAdmin', JSON.stringify(currentAdmin));
        showAdminPanel();
    } else {
        alert('❌ Hatalı email veya şifre!');
    }
}

// Admin panelini göster
function showAdminPanel() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    // Dashboard verilerini güncelle
    updateDashboard();
    updateSalesTable();
    updateXmlList();
}

// Dashboard güncelle
function updateDashboard() {
    const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
    const monthlySales = salesData
        .filter(sale => new Date(sale.date).getMonth() === new Date().getMonth())
        .reduce((sum, sale) => sum + sale.amount, 0);
    const totalCustomers = new Set(salesData.map(sale => sale.email)).size;
    
    // En çok satan paketi bul
    const packageCounts = salesData.reduce((counts, sale) => {
        counts[sale.package] = (counts[sale.package] || 0) + 1;
        return counts;
    }, {});
    const bestSeller = Object.keys(packageCounts).reduce((a, b) => 
        packageCounts[a] > packageCounts[b] ? a : b, 'Premium Paket');
    
    document.getElementById('totalSales').textContent = `₺${totalSales}`;
    document.getElementById('monthlySales').textContent = `₺${monthlySales}`;
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('bestSeller').textContent = bestSeller;
}

// Satış tablosunu güncelle
function updateSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    tbody.innerHTML = '';
    
    salesData.reverse().forEach(sale => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${new Date(sale.date).toLocaleDateString('tr-TR')}</td>
            <td>${sale.customerName}</td>
            <td>${sale.email}</td>
            <td>${sale.package}</td>
            <td>${sale.amount}₺</td>
            <td><span class="status-success">✅ Tamamlandı</span></td>
        `;
    });
}

// XML liste güncelle
function updateXmlList() {
    const xmlListDiv = document.getElementById('xmlFilesList');
    xmlListDiv.innerHTML = '';
    
    Object.keys(xmlFiles).forEach(packageType => {
        const packageDiv = document.createElement('div');
        packageDiv.innerHTML = `
            <h4>${packageType.toUpperCase()} Paket:</h4>
            ${xmlFiles[packageType].map(file => `
                <div class="xml-file-item">
                    <span>📄 ${file}</span>
                    <button onclick="deleteXmlFile('${packageType}', '${file}')" class="delete-xml">Sil</button>
                </div>
            `).join('')}
        `;
        xmlListDiv.appendChild(packageDiv);
    });
}

// XML dosyası yükleme
function handleXmlUpload(e) {
    e.preventDefault();
    
    const packageType = document.getElementById('xmlPackageType').value;
    const files = document.getElementById('xmlFile').files;
    
    if (!packageType) {
        alert('Paket tipi seçin!');
        return;
    }
    
    if (files.length === 0) {
        alert('En az bir XML dosyası seçin!');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
            xmlFiles[packageType].push(file.name);
        }
    });
    
    localStorage.setItem('muxXmlFiles', JSON.stringify(xmlFiles));
    updateXmlList();
    
    alert(`${files.length} XML dosyası ${packageType} paketine eklendi!`);
    document.getElementById('xmlUploadForm').reset();
}

// XML dosyası sil
function deleteXmlFile(packageType, fileName) {
    if (confirm(`${fileName} dosyasını silmek istediğinize emin misiniz?`)) {
        xmlFiles[packageType] = xmlFiles[packageType].filter(file => file !== fileName);
        localStorage.setItem('muxXmlFiles', JSON.stringify(xmlFiles));
        updateXmlList();
    }
}

// Satış verilerini Excel'e aktar
function exportSales() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Tarih,Müşteri,Email,Paket,Fiyat\n"
        + salesData.map(sale => 
            `${new Date(sale.date).toLocaleDateString('tr-TR')},${sale.customerName},${sale.email},${sale.package},${sale.amount}₺`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mux_satislar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Satış geçmişini temizle
function clearSales() {
    if (confirm('Tüm satış geçmişini silmek istediğinize emin misiniz?')) {
        salesData = [];
        localStorage.removeItem('muxSalesData');
        updateDashboard();
        updateSalesTable();
        alert('Satış geçmişi temizlendi!');
    }
}

// Admin çıkışı
function adminLogout() {
    currentAdmin = null;
    localStorage.removeItem('muxCurrentAdmin');
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminLoginForm').reset();
}

// Dış dosyalardan erişim için global fonksiyon
window.addSaleRecord = function(saleData) {
    salesData.push({
        date: new Date().toISOString(),
        customerName: saleData.customerName,
        email: saleData.email,
        package: saleData.package,
        amount: saleData.amount,
        id: Date.now()
    });
    localStorage.setItem('muxSalesData', JSON.stringify(salesData));
};
